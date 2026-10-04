"use client";

import { PLAT, PLAT_KEYS, type Plat } from "@/lib/plataformas";
import { Logos } from "./Logos";
import { useState, useEffect } from "react";

interface HeroProps {
  activePlat: Plat;
  onChange: (plat: Plat) => void;
}

const floatingIcons = [
  { startX: -50, startY: -30, endX: 50, endY: 30, delay: 0, duration: 12 },
  { startX: 60, startY: -20, endX: -60, endY: 40, delay: 1.5, duration: 15 },
  { startX: -40, startY: 40, endX: 40, endY: -40, delay: 3, duration: 10 },
  { startX: 50, startY: 10, endX: -50, endY: -20, delay: 0.8, duration: 14 },
  { startX: -60, startY: 0, endX: 60, endY: 20, delay: 2.2, duration: 11 },
  { startX: 30, startY: -40, endX: -30, endY: 50, delay: 1, duration: 13 },
  { startX: -20, startY: -50, endX: 20, endY: -10, delay: 2.5, duration: 9 },
  { startX: 40, startY: 30, endX: -40, endY: -30, delay: 1.8, duration: 16 },
];

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
        <div className="floating-icons" aria-hidden="true">
          {floatingIcons.map((icon, i) => (
            <span
              key={i}
              className="floating-icon"
              style={{
                animationDelay: `${icon.delay}s`,
                animationDuration: `${icon.duration}s`,
                "--sx": icon.startX,
                "--sy": icon.startY,
                "--ex": icon.endX,
                "--ey": icon.endY,
              } as React.CSSProperties}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </span>
          ))}
        </div>
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