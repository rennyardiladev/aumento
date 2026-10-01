import { CFG } from "@/lib/config";
import { Logos } from "./Logos";
import type { Plat } from "@/lib/plataformas";

const REDES: Plat[] = ["instagram", "facebook", "youtube", "tiktok"];

export default function Footer() {
  const wa = `https://wa.me/${CFG.wa}?text=${encodeURIComponent("Hola, necesito ayuda con mi pedido.")}`;
  return (
    <footer className="site-footer">
      <div className="in">
        <div className="footer-brand">
          <img src="/aumentodeseguidores.webp" alt="Aumento de Seguidores" className="logo-img" />
        </div>
        <div>Seguidores para Instagram, Facebook, TikTok, YouTube y Spotify en toda Latinoamérica.</div>
        <div style={{ marginTop: 10 }}>
          Pagos con Nequi y PayPal ·{" "}
          <a href={wa} target="_blank" rel="noopener noreferrer">Soporte por WhatsApp</a>
        </div>
        <div className="soc">
          {REDES.map((k) => {
            const Logo = Logos[k];
            return (
              <a key={k} href={CFG.redes[k]} target="_blank" rel="noopener noreferrer" aria-label={k}>
                <Logo />
              </a>
            );
          })}
        </div>
        <div className="fine">
          © 2026 aumentodeseguidores.com. Todos los derechos reservados.
          <br />
          Instagram, Facebook, TikTok, YouTube, Spotify, Nequi y PayPal son marcas de sus respectivos dueños. Este sitio no está afiliado ni respaldado por ellas.
        </div>
      </div>
    </footer>
  );
}
