import { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { ArticleCard } from "@/components/ArticleCard";

export const metadata: Metadata = {
  title: "Blog - Marketing Digital, Seguidores, Likes y SEO | Aumento de Seguidores",
  description: "Artículos expertos sobre marketing digital, crecimiento de seguidores, estrategias de engagement, SEO para redes sociales y monetización de contenido.",
  keywords: "marketing digital, seguidores, likes, comentarios, visualizaciones, SEO, redes sociales, Instagram, TikTok, YouTube",
  openGraph: {
    title: "Blog - Marketing Digital | Aumento de Seguidores",
    description: "Artículos expertos sobre marketing digital, crecimiento de seguidores, estrategias de engagement, SEO para redes sociales y monetización de contenido.",
    type: "website",
    images: ["/icono.webp"],
  },
  twitter: {
    card: "summary",
    title: "Blog - Marketing Digital | Aumento de Seguidores",
    description: "Artículos expertos sobre marketing digital, crecimiento de seguidores, estrategias de engagement, SEO para redes sociales.",
    images: ["/icono.webp"],
  },
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
 
// Additional articles for marketing blog
const moreArticles = [
  {
    slug: "facebook-ads-para-creadores",
    title: "Facebook Ads para Creadores: Guía de Campañas Rentables 2024",
    excerpt: "Aprende a crear campañas de Facebook Ads que conviertan: estructura de campañas, audiencias, creativos y optimización de ROAS.",
    category: "Facebook Ads",
    readTime: "10 min",
    date: "2024-01-20",
    seoKeywords: "facebook ads creadores, campañas facebook ads, roas facebook",
  },
  {
    slug: "tiktok-shop-afiliados",
    title: "TikTok Shop y Afiliados: Cómo Vender sin Inventario",
    excerpt: "Guía completa para monetizar con TikTok Shop: configuración, selección de productos, contenido que vende y escalado.",
    category: "TikTok",
    readTime: "9 min",
    date: "2024-01-18",
    seoKeywords: "tiktok shop, afiliados tiktok, vender en tiktok",
  },
  {
    slug: "email-marketing-creadores",
    title: "Email Marketing para Creadores: Construye tu Lista y Vende en Automático",
    excerpt: "Por qué necesitas una lista de email, lead magnets que convierten, secuencias de bienvenida y automatizaciones de ventas.",
    category: "Email Marketing",
    readTime: "8 min",
    date: "2024-01-16",
    seoKeywords: "email marketing creadores, lead magnet, automatizacion email",
  },
  {
    slug: "linkedin-personal-branding",
    title: "Personal Branding en LinkedIn: Estrategia para Profesionales y B2B",
    excerpt: "Optimiza tu perfil, estrategia de contenido, networking y cómo generar leads cualificados en LinkedIn.",
    category: "LinkedIn",
    readTime: "7 min",
    date: "2024-01-14",
    seoKeywords: "personal branding linkedin, linkedin b2b, generar leads linkedin",
  },
  {
    slug: "pinterest-trafico-web",
    title: "Pinterest para Tráfico Web: SEO Visual que Convierte",
    excerpt: "Cómo usar Pinterest como motor de búsqueda visual: pines optimizados, tableros, rich pins y estrategia de contenido evergreen.",
    category: "Pinterest",
    readTime: "6 min",
    date: "2024-01-13",
    seoKeywords: "pinterest trafico web, seo pinterest, marketing pinterest",
  },
  {
    slug: "shorts-vs-reels-vs-tiktok",
    title: "Shorts vs Reels vs TikTok: Dónde Publicar en 2024",
    excerpt: "Comparativa completa de los 3 formatos de video corto: algoritmo, monetización, audiencia, herramientas y estrategia multiplataforma.",
    category: "Video Corto",
    readTime: "8 min",
    date: "2024-01-11",
    seoKeywords: "shorts vs reels vs tiktok, video corto 2024, donde publicar",
  },
  {
    slug: "community-management-escalado",
    title: "Community Management a Escala: Automatización sin Perder Humanidad",
    excerpt: "Herramientas y workflows para gestionar comunidades grandes: respuestas automáticas, moderación, CRM social y escalado de equipo.",
    category: "Community",
    readTime: "7 min",
    date: "2024-01-09",
    seoKeywords: "community management, automatizacion community, gestion comunidad",
  },
  {
    slug: "seo-local-negocios-fisicos",
    title: "SEO Local para Negocios Físicos: Domina Google Maps y Atrae Clientes",
    excerpt: "Optimiza tu ficha de Google Business, reseñas, citations locales, contenido geo-localizado y estrategia de link building local.",
    category: "SEO Local",
    readTime: "9 min",
    date: "2024-01-07",
    seoKeywords: "seo local, google maps negocio, ficha google business",
  },
  {
    slug: "content-repurposing-workflow",
    title: "Content Repurposing: Workflow para Multiplicar tu Contenido x10",
    excerpt: "Sistema completo para transformar 1 pieza de contenido en 20+ formatos: video, audio, texto, gráficos para todas las plataformas.",
    category: "Productividad",
    readTime: "10 min",
    date: "2024-01-06",
    seoKeywords: "content repurposing, reutilizar contenido, workflow contenido",
  },
  {
    slug: "web3-social-tokens-creadores",
    title: "Web3 para Creadores: Social Tokens, NFTs y Economía de Creadores",
    excerpt: "Introducción a la economía de creadores en Web3: social tokens, membresías NFT, DAOs y nuevas formas de monetizar comunidad.",
    category: "Web3",
    readTime: "11 min",
    date: "2024-01-04",
    seoKeywords: "web3 creadores, social tokens, nfts creadores, economia creadores",
  },
];

// Combine all articles
const allArticles = [...articles, ...moreArticles];

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
          {allArticles.map((article) => (
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