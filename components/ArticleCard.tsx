"use client";

import Link from "next/link";

interface ArticleCardProps {
  article: {
    slug: string;
    title: string;
    excerpt: string;
    category: string;
    readTime: string;
    date: string;
  };
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <article
      style={{
        background: "var(--card)",
        border: "1px solid var(--bd)",
        borderRadius: "16px",
        padding: "24px",
        transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.12)";
        e.currentTarget.style.borderColor = "var(--acc)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "var(--shadow)";
        e.currentTarget.style.borderColor = "var(--bd)";
      }}
    >
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
        <Link
          href={`/blog/${article.slug}`}
          className="article-category"
        >
          {article.category}
        </Link>
        <span style={{ fontSize: "13px", color: "var(--mu)" }}>{article.readTime} de lectura</span>
        <span style={{ fontSize: "13px", color: "var(--mu)" }}>{new Date(article.date).toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" })}</span>
      </div>

      <Link href={`/blog/${article.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
        <h2 style={{ fontSize: "clamp(18px, 3vw, 22px)", fontWeight: 700, lineHeight: 1.3, marginBottom: "8px", transition: "color 0.2s ease" }}>
          {article.title}
        </h2>
      </Link>

      <p className="article-excerpt">{article.excerpt}</p>

      <Link
        href={`/blog/${article.slug}`}
        className="article-link"
        onMouseEnter={(e) => { e.currentTarget.style.gap = "10px"; }}
        onMouseLeave={(e) => { e.currentTarget.style.gap = "6px"; }}
      >
        Leer artículo
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </Link>
    </article>
  );
}