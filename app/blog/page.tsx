import { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { ArticleCard } from "@/components/ArticleCard";

export const metadata: Metadata = {
  title: "Blog - Marketing Digital, Seguidores, Likes y SEO | Aumento de Seguidores",
  description: "Artículos expertos sobre marketing digital, crecimiento de seguidores, estrategias de engagement, SEO para redes sociales y monetización de contenido.",
  keywords: "marketing digital, seguidores, likes, comentarios, visualizaciones, SEO, redes sociales, Instagram, TikTok, YouTube",
};

const articles = [
  {
    slug: "como-aumentar-seguidores-instagram-2024",
    title: "Cómo Aumentar Seguidores en Instagram 2024: Estrategias Comprobadas",
    excerpt: "Descubre las tácticas más efectivas para crecer orgánicamente en Instagram este año. Desde optimización de perfil hasta contenido viral.",
    category: "Instagram",
    readTime: "8 min",
    date: "2024-01-15",
    seoKeywords: "aumentar seguidores instagram, crecer en instagram 2024, estrategias instagram",
  },
  {
    slug: "algoritmo-tiktok-viral-2024",
    title: "Algoritmo de TikTok 2024: Claves para Volverse Viral",
    excerpt: "Entiende cómo funciona el algoritmo de TikTok y aprende a crear contenido que el algoritmo recomiende a millones de usuarios.",
    category: "TikTok",
    readTime: "6 min",
    date: "2024-01-12",
    seoKeywords: "algoritmo tiktok, viral tiktok 2024, como volverse viral tiktok",
  },
  {
    slug: "comprar-seguidores-vs-organico",
    title: "Comprar Seguidores vs Crecimiento Orgánico: Verdades y Mitos",
    excerpt: "Analizamos los riesgos de comprar seguidores y por qué el crecimiento orgánico sostenible es la única estrategia que funciona a largo plazo.",
    category: "Estrategia",
    readTime: "10 min",
    date: "2024-01-10",
    seoKeywords: "comprar seguidores, crecimiento organico, riesgos comprar seguidores",
  },
  {
    slug: "aumentar-likes-comentarios-instagram",
    title: "Cómo Aumentar Likes y Comentarios en Instagram: Guía Completa",
    excerpt: "Técnicas probadas para maximizar el engagement en tus publicaciones: horarios óptimos, tipos de contenido, calls-to-action efectivos.",
    category: "Engagement",
    readTime: "7 min",
    date: "2024-01-08",
    seoKeywords: "aumentar likes instagram, mas comentarios instagram, engagement instagram",
  },
  {
    slug: "seo-youtube-videos-posicionar",
    title: "SEO para YouTube: Cómo Posicionar tus Videos en Primeros Resultados",
    excerpt: "Optimiza tus videos para el motor de búsqueda de YouTube: palabras clave, thumbnails, descripciones, etiquetas y retención de audiencia.",
    category: "YouTube",
    readTime: "9 min",
    date: "2024-01-05",
    seoKeywords: "seo youtube, posicionar videos youtube, optimizar videos youtube",
  },
  {
    slug: "estrategias-visualizaciones-reels",
    title: "Estrategias para Aumentar Visualizaciones en Reels y Shorts",
    excerpt: "Domina el formato de video corto: hooks en los primeros 3 segundos, tendencias de audio, frecuencia de publicación y análisis de métricas.",
    category: "Reels/Shorts",
    readTime: "5 min",
    date: "2024-01-03",
    seoKeywords: "visualizaciones reels, aumentar views reels, shorts viral",
  },
  {
    slug: "marketing-influencers-colaboraciones",
    title: "Marketing de Influencers: Cómo Hacer Colaboraciones Rentables",
    excerpt: "Guía paso a paso para identificar, contactar y negociar con influencers que generen ROI real para tu marca o negocio.",
    category: "Marketing",
    readTime: "11 min",
    date: "2024-01-01",
    seoKeywords: "marketing influencers, colaboraciones influencers, roi influencers",
  },
  {
    slug: "hashtags-estrategia-2024",
    title: "Estrategia de Hashtags 2024: Cómo Elegir los Mejores para tu Nicho",
    excerpt: "Deja de usar hashtags al azar. Aprende a investigar, combinar y rotar hashtags para maximizar alcance y descubrimiento orgánico.",
    category: "Instagram",
    readTime: "6 min",
    date: "2023-12-28",
    seoKeywords: "hashtags instagram 2024, mejores hashtags, estrategia hashtags",
  },
  {
    slug: "monetizar-instagram-tiktok-youtube",
    title: "Cómo Monetizar en Instagram, TikTok y YouTube: Guía 2024",
    excerpt: "Todas las formas de ganar dinero con tu contenido: programas de creadores, afiliados, productos propios, patrocinios y membresías.",
    category: "Monetización",
    readTime: "12 min",
    date: "2023-12-25",
    seoKeywords: "monetizar instagram, ganar dinero tiktok, monetizar youtube 2024",
  },
  {
    slug: "analiticas-metricas-crecimiento",
    title: "Analíticas y Métricas Clave para Medir tu Crecimiento en Redes Sociales",
    excerpt: "Qué métricas importan realmente, cómo interpretar los insights de cada plataforma y tomar decisiones basadas en datos para escalar.",
    category: "Analítica",
    readTime: "8 min",
    date: "2023-12-22",
    seoKeywords: "metricas redes sociales, analiticas instagram, kpis crecimiento social media",
  },
];

export default function BlogPage() {
  return (
    <div style={{ "--g": "linear-gradient(45deg, #FEDA75, #FA7E1E, #D62976, #962FBF, #4F5BD5)", "--acc": "#D62976" } as React.CSSProperties}>
      <Header activePlat="instagram" />
      <main style={{ maxWidth: "800px", margin: "0 auto", padding: "32px 16px 60px" }}>
        <header style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1 style={{ fontSize: "clamp(28px, 6vw, 42px)", fontWeight: 700, marginBottom: "12px", background: "var(--g)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Blog de Marketing Digital
          </h1>
          <p style={{ fontSize: "clamp(16px, 3vw, 18px)", color: "var(--mu)", maxWidth: "600px", margin: "0 auto" }}>
            Estrategias, guías y tendencias para crecer en redes sociales: seguidores, likes, comentarios, visualizaciones y SEO.
          </p>
        </header>

        <div style={{ display: "grid", gap: "24px" }}>
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>

        <nav style={{ marginTop: "48px", display: "flex", justifyContent: "center", gap: "8px" }} aria-label="Paginación">
          <button style={{ padding: "10px 16px", borderRadius: "10px", border: "1px solid var(--bd)", background: "var(--card)", color: "var(--tx)", fontWeight: 500 }} disabled>Anterior</button>
          <button style={{ padding: "10px 16px", borderRadius: "10px", background: "var(--g)", color: "#fff", fontWeight: 600 }} disabled>1</button>
          <button style={{ padding: "10px 16px", borderRadius: "10px", border: "1px solid var(--bd)", background: "var(--card)", color: "var(--tx)", fontWeight: 500 }}>2</button>
          <button style={{ padding: "10px 16px", borderRadius: "10px", border: "1px solid var(--bd)", background: "var(--card)", color: "var(--tx)", fontWeight: 500 }}>3</button>
          <button style={{ padding: "10px 16px", borderRadius: "10px", border: "1px solid var(--bd)", background: "var(--card)", color: "var(--tx)", fontWeight: 500 }}>Siguiente</button>
        </nav>
      </main>
      <Footer />
    </div>
  );
}