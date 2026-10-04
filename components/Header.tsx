"use client";

import { PLAT, type Plat } from "@/lib/plataformas";
import { useState } from "react";
import { FAQModal } from "./FAQModal";

interface HeaderProps {
  activePlat: Plat;
  className?: string;
}

const metricIcons = {
  seguidores: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  suscriptores: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      <path d="M17 8h.01" />
    </svg>
  ),
  likes: (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
  comentarios: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  visualizaciones: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
};

const metricsByPlatform: Record<Plat, Array<keyof typeof metricIcons>> = {
  instagram: ["seguidores", "likes", "comentarios", "visualizaciones"],
  facebook: ["seguidores", "likes", "comentarios", "visualizaciones"],
  tiktok: ["seguidores", "likes", "comentarios", "visualizaciones"],
  youtube: ["suscriptores", "likes", "comentarios", "visualizaciones"],
  spotify: ["seguidores", "likes", "comentarios", "visualizaciones"],
};

const FAQIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" width="22" height="22">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <path d="M12 17h.01" />
  </svg>
);

const BlogIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" width="22" height="22">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

export function Header({ activePlat, className }: HeaderProps) {
  const metrics = metricsByPlatform[activePlat] || ["seguidores", "likes", "comentarios", "visualizaciones"];
  const current = PLAT[activePlat];
  const [showFAQ, setShowFAQ] = useState(false);

  return (
    <>
      <header className={`app-header ${className || ""}`} style={{ "--g": current.g, "--acc": current.acc } as React.CSSProperties}>
        <div className="header-row">
          <div className="logo-container">
            <img src="/aumentodeseguidores.webp" alt="Aumento de Seguidores" className="logo-img" />
          </div>
          <nav className="metrics-bar" role="tablist" aria-label="Métricas">
            {metrics.map((metric, i) => (
              <button
                key={metric}
                className={`metric-tab ${i === 0 ? "active" : ""}`}
                role="tab"
                aria-selected={i === 0}
                aria-controls={`panel-${metric}`}
                id={`tab-${metric}`}
                onClick={() => {}}
              >
                <span className="metric-icon">{metricIcons[metric]}</span>
                <span className="metric-label">{metric.charAt(0).toUpperCase() + metric.slice(1)}</span>
              </button>
            ))}
</nav>
           <button
             className="faq-btn"
             onClick={() => window.location.href = "/blog"}
             aria-label="Blog"
             title="Blog"
           >
             <BlogIcon />
           </button>
           <button
             className="faq-btn"
             onClick={() => setShowFAQ(true)}
             aria-label="Preguntas frecuentes"
             title="Preguntas frecuentes"
           >
             <FAQIcon />
           </button>
         </div>
      </header>
      <FAQModal open={showFAQ} onClose={() => setShowFAQ(false)} />
    </>
  );
}