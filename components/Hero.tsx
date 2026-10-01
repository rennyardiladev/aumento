"use client";

import { PLAT, PLAT_KEYS, type Plat } from "@/lib/plataformas";
import { Logos } from "./Logos";
import { useState, useEffect } from "react";

interface HeroProps {
  activePlat: Plat;
  onChange: (plat: Plat) => void;
}

export function Hero({ activePlat, onChange }: HeroProps) {
  const current = PLAT[activePlat];
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <>
      <header className="hero" style={{ "--g": current.g, "--acc": current.acc } as React.CSSProperties}>
        <div className="hero-content">
          <h1>Impulsa tu {current.nombre}</h1>
          <p>Escribe tu usuario, verificamos tu cuenta y eliges tu paquete de {current.u}.</p>
        </div>
        {!isMobile && (
          <nav className="platform-tabs" role="tablist" aria-label="Plataformas">
            {PLAT_KEYS.map((k) => {
              const Logo = Logos[k];
              const isActive = k === activePlat;
              return (
                <button
                  key={k}
                  className={`platform-tab ${isActive ? "active" : ""}`}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`panel-${k}`}
                  id={`tab-${k}`}
                  onClick={() => onChange(k)}
                >
                  <Logo />
                  <span className="platform-name">{PLAT[k].nombre}</span>
                </button>
              );
            })}
          </nav>
        )}
      </header>

      {isMobile && (
        <nav className="mobile-tab-bar" role="tablist" aria-label="Plataformas" style={{ "--acc": current.acc } as React.CSSProperties}>
          {PLAT_KEYS.map((k) => {
            const Logo = Logos[k];
            const isActive = k === activePlat;
            return (
              <button
                key={k}
                className={`mobile-tab ${isActive ? "active" : ""}`}
                role="tab"
                aria-selected={isActive}
                aria-controls={`panel-${k}`}
                id={`mobile-tab-${k}`}
                onClick={() => onChange(k)}
              >
                <Logo />
                <span>{PLAT[k].nombre}</span>
              </button>
            );
          })}
        </nav>
      )}
    </>
  );
}