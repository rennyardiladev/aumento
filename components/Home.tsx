"use client";

import { useState, useCallback, useEffect } from "react";
import { PLAT, PAQUETES, USUARIO_RE, type Plat, type Paquete } from "@/lib/plataformas";
import { consultarPerfil } from "@/app/actions/perfil";
import { CFG } from "@/lib/config";
import { Hero } from "./Hero";
import { Header } from "./Header";
import { UserPreview } from "./UserPreview";
import { PaymentCard } from "./PaymentCard";
import Footer from "./Footer";

type Metodo = "nequi" | "paypal";
type Resp = Awaited<ReturnType<typeof consultarPerfil>>;
const fmt = (n: number) => n.toLocaleString("es-CO");

export default function Home() {
  const [plat, setPlat] = useState<Plat>("instagram");
  const [input, setInput] = useState("");
  const [usuario, setUsuario] = useState("");
  const [loading, setLoading] = useState(false);
  const [polling, setPolling] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [perfil, setPerfil] = useState<Resp | null>(null);
  const [err, setErr] = useState("");
  const [sel, setSel] = useState<Paquete | null>(null);
  const [pago, setPago] = useState(false);
  const [metodo, setMetodo] = useState<Metodo>("nequi");
  const [tel, setTel] = useState("");
  const [telErr, setTelErr] = useState(false);
  const [orden, setOrden] = useState("");
  const [btnProgress, setBtnProgress] = useState(0);
  const [manualMode, setManualMode] = useState(false);
  const [manualLink, setManualLink] = useState("");
  const [allUsers, setAllUsers] = useState<string[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setToast(`${label} copiado: ${text}`);
    setTimeout(() => setToast(null), 3000);
  };

  const P = PLAT[plat];
  const bloqueada = !!perfil?.privada && P.privada;
  const listo = !!perfil?.existe && !bloqueada;

  function cambiar(k: Plat) {
    setPlat(k); setInput(""); setPerfil(null); setErr(""); setSel(null); setOrden(""); setPolling(false); setProgress(null); setManualMode(false); setManualLink("");
  }

  // Cargar usuarios desde public/users.txt
  useEffect(() => {
    fetch("/users.txt")
      .then(r => r.text())
      .then(text => {
        const users = text.split("\n").map(u => u.trim()).filter(u => u.length > 0);
        setAllUsers(users);
      })
      .catch(() => setAllUsers([]));
  }, []);

  // Polling para Facebook/TikTok async con progreso
  const pollPerfil = useCallback(async (
    plataforma: Plat,
    user: string,
    snapshotId: string,
    onProgress: (data: Resp) => void,
    onComplete: (data: Resp) => void,
    onError: (error: string) => void
  ) => {
    const maxAttempts = 30;
    const delayMs = 3000;
    let attempt = 0;

    for (attempt = 1; attempt <= maxAttempts; attempt++) {
      await new Promise(resolve => setTimeout(resolve, delayMs));

      try {
        const data = await consultarPerfil(plataforma, user, snapshotId);

        if (data.processing) {
          const runningTime = data.running_time || 0;
          const estimatedProgress = Math.min(95, Math.round((runningTime / 60000) * 100));
          setProgress(estimatedProgress);
          onProgress(data);
          continue;
        }

        setProgress(100);
        if (data.error === undefined && data.existe !== false) {
          onComplete(data);
          return;
        }

        setProgress(null);
        onError(data.error || "Perfil no encontrado");
        return;
      } catch {
        setProgress(null);
        onError("Error de conexión");
        return;
      }
    }

    setProgress(null);
    onError("Tiempo de espera agotado");
  }, []);

  async function verificar() {
    // 1. Quitamos la arroba inicial, eliminamos TODOS los espacios (tanto al rededor como en medio) y pasamos a minúsculas
    const u = input.trim().replace(/^@/, "").replace(/\s+/g, "").toLowerCase();
    
    // Actualizamos el input visualmente para que el usuario note cómo quedó unido
    setInput(u);

    setPerfil(null); setSel(null); setErr(""); setPolling(false); setBtnProgress(0);
    
    // Permitir URLs en Instagram, TikTok, YouTube, Facebook y Spotify
    const esURL = u.includes("instagram.com") || u.includes("tiktok.com") || u.includes("youtube.com") || u.includes("facebook.com") || u.includes("open.spotify.com");
    const esSpotifyID = plat === "spotify" && /^[a-zA-Z0-9]{22}$/.test(u);
    
    if (!esURL && !esSpotifyID && !USUARIO_RE.test(u)) {
      setErr("Usuario no válido. Solo letras, números, punto, guion y guion bajo.");
      return;
    }
    
    setLoading(true);
    setBtnProgress(5);

    const progressInterval = setInterval(() => {
      setBtnProgress(prev => {
        if (prev >= 90) return prev;
        const incremento = prev < 40 ? 8 : prev < 70 ? 4 : 2;
        return Math.min(prev + incremento, 90);
      });
    }, 300);

    // Timeout de 1 minuto -> modo manual
    const timeoutMs = 60000;
    const timeoutId = setTimeout(() => {
      clearInterval(progressInterval);
      setManualMode(true);
      setLoading(false);
      setBtnProgress(0);
    }, timeoutMs);

    try {
      const d = await consultarPerfil(plat, u);

      clearInterval(progressInterval);
      clearTimeout(timeoutId);
      setBtnProgress(100);

      // Facebook/TikTok/Instagram async: primera respuesta es processing
      if (d.processing && d.snapshotId && (plat === "facebook" || plat === "tiktok" || plat === "instagram")) {
        setLoading(false);
        setPolling(true);

        pollPerfil(
          plat,
          u,
          d.snapshotId,
          (progressData) => {
            console.log(`[${plat}] Polling:`, progressData);
          },
          (finalData) => {
            setPolling(false);
            setUsuario(u);
            setPerfil(finalData);
          },
          () => {
            setPolling(false);
            setManualMode(true);
            setErr("");
          }
        );
        return;
      }

      // Respuesta directa
      if (d.error) {
        setManualMode(true);
        setErr("");
      } else if (!d.existe) {
        setManualMode(true);
        setErr("");
      } else { 
        setUsuario(u); 
        setPerfil(d); 
      }
    } catch {
      clearInterval(progressInterval);
      clearTimeout(timeoutId);
      setManualMode(true);
      setErr("");
    } finally {
      setLoading(false);
      setTimeout(() => setBtnProgress(0), 600);
    }
  }

  async function verificarManual() {
    const u = manualLink.trim();
    if (!u) return;
    setManualMode(false);
    setUsuario(u);
    setPerfil({ existe: true, privada: false, seguidores: null, nombre: undefined, foto: null });
  }

  const digits = tel.replace(/\D/g, "");
  const usd = sel ? (sel.p / CFG.trm).toFixed(2) : "0.00";
  const resumen = sel ? `${fmt(sel.n)} ${P.u} para ${usuario} en ${P.nombre}` : "";

  function confirmar() {
    if (digits.length < 8) { setTelErr(true); return; }
    setTelErr(false);
    setOrden("SF-" + Math.random().toString(36).slice(2, 7).toUpperCase());
  }

  const wa = (msg: string) =>
    `https://wa.me/${CFG.wa}?text=` +
    encodeURIComponent(
      `Hola! Pedido ${orden}\n${resumen}\nTotal: $${fmt(sel?.p ?? 0)} ${CFG.moneda}\nMétodo: ${metodo === "nequi" ? "Nequi" : "PayPal"}\n${msg}\nMi WhatsApp: ${digits}`
    );

  return (
    <div style={{ "--g": P.g, "--acc": P.acc } as React.CSSProperties}>
      {!pago ? (
        <>
          <Header activePlat={plat} />
          <Hero activePlat={plat} onChange={cambiar} />
        </>
      ) : (
        <header className="hero" style={{ padding: "24px 16px 32px" }}>
          <h1>Finalizar pedido</h1>
          <p style={{ opacity: .95 }}>Elige cómo pagar. Solo necesitamos tu WhatsApp.</p>
        </header>
      )}

      <main>
        {!pago && (
          <>
            <section className="card">
              <label htmlFor="u"><b>1. Tu usuario de {P.nombre}</b></label>
              
              {!manualMode ? (
                <>
                  <div className="row" style={{ marginTop: 10 }}>
                    <input
                      id="u" value={input} placeholder={P.ph} autoComplete="off" autoCapitalize="off"
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && verificar()}
                      disabled={loading || polling}
                    />
                    <button onClick={verificar} disabled={loading || polling} style={{ position: "relative", overflow: "hidden", background: loading ? "transparent" : "var(--g)", color: loading ? "var(--tx)" : "#fff" }}>
                      {loading && (
                        <div style={{
                          position: "absolute",
                          inset: 0,
                          width: `${btnProgress}%`,
                          background: `linear-gradient(90deg, var(--acc), var(--g))`,
                          transition: "width 0.3s ease",
                          zIndex: 0,
                        }} />
                      )}
                      <span style={{ position: "relative", zIndex: 1 }}>
                        {loading ? `Verificando… ${btnProgress}%` : polling ? "Consultando…" : "Verificar"}
                      </span>
                    </button>
                  </div>
                </>
              ) : (
                <div style={{ marginTop: 10 }}>
                  <div className="msg info" style={{ background: "rgba(29,185,84,.15)", border: "1px solid var(--acc)" }}>
                    <b>😊 ¡No te preocupes!</b> No pudimos encontrar la cuenta automáticamente.
                    <br /><br />
                    Pega aquí el <b>link directo del perfil</b> y continuamos con tu pedido:
                  </div>
                  <div className="row" style={{ marginTop: 10 }}>
                    <input
                      id="manual-link"
                      value={manualLink}
                      placeholder="https://www.instagram.com/tuusuario/"
                      autoComplete="off"
                      autoCapitalize="off"
                      onChange={(e) => setManualLink(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && verificarManual()}
                    />
                    <button onClick={verificarManual} style={{ background: "var(--acc)" }}>Continuar</button>
                  </div>
                  <button onClick={() => { setManualMode(false); setManualLink(""); }} style={{ marginTop: 10, background: "transparent", color: "var(--mu)", border: "1px solid var(--bd)" }}>
                    ← Volver a buscar por usuario
                  </button>
                </div>
              )}
              
              {err && !manualMode && <div className="msg warn">{err}</div>}
              {polling && (
                <div style={{ marginTop: 12 }}>
                  <div className="msg info">Consultando {P.nombre}, por favor espere...</div>
                  <div style={{
                    width: "100%",
                    height: 8,
                    backgroundColor: "#efefef",
                    borderRadius: 4,
                    overflow: "hidden",
                    marginTop: 8
                  }}>
                    <div style={{
                      width: `${progress ?? 0}%`,
                      height: "100%",
                      background: `linear-gradient(90deg, var(--acc), var(--g))`,
                      borderRadius: 4,
                      transition: "width 0.5s ease",
                      minWidth: progress ? "2%" : 0
                    }} />
                  </div>
                  <div style={{ textAlign: "right", fontSize: 12, color: "var(--mu)", marginTop: 4 }}>
                    {progress !== null ? `${progress}%` : "Iniciando..."}
                  </div>
                </div>
              )}
              {perfil?.existe && (
                <>
                  <div className="profile" style={{ marginTop: 14 }}>
                    <div className="av">
                      {perfil.foto ? (
                        <img src={perfil.foto} alt={usuario} referrerPolicy="no-referrer" />
                      ) : (
                        usuario[0]?.toUpperCase()
                      )}
                    </div>
                    <div>
                      <b>{perfil.nombre && perfil.nombre !== usuario ? `${perfil.nombre} · ` : ""}@{usuario}</b><br />
                      <span style={{ color: "var(--mu)" }}>
                        {perfil.seguidores == null ? "—" : fmt(perfil.seguidores)} {P.u}
                      </span>
                    </div>
                  </div>
                  {bloqueada ? (
                    <div className="msg warn">Tu cuenta es <b>privada</b>. Cámbiala a pública para poder procesar el pedido y vuelve a verificar.</div>
                  ) : (
                    <div className="msg ok">Cuenta pública verificada ✔</div>
                  )}
                </>
              )}
            </section>

            {listo && (
              <section className="card">
                <b>2. Elige tu paquete</b>
                <div className="pk">
                  {PAQUETES.map((x) => (
                    <div key={x.n} className={`opt${sel?.n === x.n ? " sel" : ""}`} onClick={() => { setSel(x); setOrden(""); }}>
                      <b>{fmt(x.n)}</b>{P.u}<br />${fmt(x.p)} {CFG.moneda}
                    </div>
                  ))}
                </div>

                {sel && allUsers.length > 0 && (
                  <UserPreview count={sel.n} allUsers={allUsers} />
                )}

                <div className="total"><span>Total</span><span>{sel ? `$${fmt(sel.p)} ${CFG.moneda}` : "—"}</span></div>
                <button className="btn-primary" disabled={!sel} onClick={() => { setPago(true); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
                  Continuar al pago
                </button>
              </section>
            )}
          </>
        )}

        {pago && sel && (
          <section className="card">
            <a href="#" style={{ color: "var(--mu)", textDecoration: "none", fontSize: 14 }}
               onClick={(e) => { e.preventDefault(); setPago(false); setOrden(""); }}>← Volver</a><br />
            <b>Elige cómo pagar</b>
            <div className="tag" style={{ marginTop: 6, marginBottom: '6px' }}>Pedido: {resumen} · ${fmt(sel.p)} {CFG.moneda}</div>
            <div className="tag">Sin registro. Puedes pagar ahora o después de enviar tu pedido.</div>

            <div className="pk" style={{ gridTemplateColumns: "1fr 1fr", marginTop: 10 }}>
              <PaymentCard
                metodo="nequi"
                selected={metodo === "nequi"}
                onSelect={() => { setMetodo("nequi"); setOrden(""); }}
                monto={fmt(sel.p)}
                moneda={CFG.moneda}
                usd={usd}
                dato="3219412929"
                onCopy={copyToClipboard}
              />
              <PaymentCard
                metodo="paypal"
                selected={metodo === "paypal"}
                onSelect={() => { setMetodo("paypal"); setOrden(""); }}
                monto={fmt(sel.p)}
                moneda={CFG.moneda}
                usd={usd}
                dato="fabricadepeluchesmundodisney@gmail.com"
                onCopy={copyToClipboard}
              />
            </div>

            <label className="sm" htmlFor="ct" style={{ marginTop: 6, marginBottom: '6px', display: 'block' }}>
              Tu WhatsApp (solo este dato, para enviarte la confirmación)
            </label>
            <input 
              id="ct" 
              type="tel" 
              value={tel} 
              placeholder="+57 300 000 0000" 
              style={telErr 
                ? { borderColor: "#dc3c3c", marginBottom: "16px", display: "block", width: "100%" } 
                : { marginBottom: "16px", display: "block", width: "100%" }
              }
              onChange={(e) => setTel(e.target.value)} 
            />

            {!orden ? (
              <button className="btn-primary" onClick={confirmar}>Confirmar pedido</button>
            ) : (
              <div className="box">
                <div className="msg ok" style={{ margin: "0 0 10px" }}>Pedido registrado ✔</div>
                <div className="code">{orden}</div>
                {metodo === "nequi" ? (
                  <p>Envía <b>${fmt(sel.p)} {CFG.moneda}</b> por Nequi al número <b>{CFG.nequi}</b> y escribe este código en el mensaje:</p>
                ) : (
                  <p>Paga <b>US${usd}</b> (equivale a ${fmt(sel.p)} {CFG.moneda}) a la cuenta PayPal <b>{CFG.paypal}</b> y escribe este código en la nota:</p>
                )}
                {metodo === "paypal" && (
                  <a className="btn" target="_blank" rel="noopener noreferrer"
                     href={`https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=${encodeURIComponent(CFG.paypal)}&amount=${usd}&currency_code=USD&item_name=${orden}`}>
                    Pagar con PayPal
                  </a>
                )}
                <a className="btn-primary" target="_blank" rel="noopener noreferrer" href={wa("Ya pagué, adjunto el comprobante.")}>Ya pagué · enviar comprobante</a>
                <a className="btn alt" target="_blank" rel="noopener noreferrer" href={wa("Pagaré después de confirmar.")}>Pagar en 5 minutos · enviar pedido</a>
                <div className="tag">Empezamos a procesar tu pedido cuando confirmemos el pago.</div>
              </div>
            )}
          </section>
        )}
      </main>
      <Footer />
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}