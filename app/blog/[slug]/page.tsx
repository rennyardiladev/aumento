import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";

interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  seoKeywords: string;
  content: string;
}

const articles: Record<string, Article> = {
  "como-aumentar-seguidores-instagram-2024": {
    slug: "como-aumentar-seguidores-instagram-2024",
    title: "Cómo Aumentar Seguidores en Instagram 2024: Estrategias Comprobadas",
    excerpt: "Descubre las tácticas más efectivas para crecer orgánicamente en Instagram este año. Desde optimización de perfil hasta contenido viral.",
    category: "Instagram",
    readTime: "8 min",
    date: "2024-01-15",
    seoKeywords: "aumentar seguidores instagram, crecer en instagram 2024, estrategias instagram",
    content: `
      <h2>Optimiza tu Perfil para Conversión</h2>
      <p>Tu perfil es tu tarjeta de presentación. Antes de pensar en contenido, asegúrate de que tu bio, foto de perfil y enlace estén optimizados para convertir visitantes en seguidores.</p>
      <ul>
        <li><strong>Nombre de usuario:</strong> Fácil de recordar, relacionado con tu nicho</li>
        <li><strong>Bio:</strong> Qué haces + para quién + llamada a la acción clara</li>
        <li><strong>Enlace:</strong> Usa Linktree o similar para múltiples destinos</li>
        <li><strong>Foto:</strong> Rostro visible (personal) o logo nítido (marca)</li>
      </ul>

      <h2>Contenido que el Algoritmo Ama</h2>
      <p>El algoritmo de Instagram prioriza contenido que genera:</p>
      <ol>
        <li><strong>Retención:</strong> Videos que se ven completos (Reels)</li>
        <li><strong>Interacción:</strong> Comentarios, compartidos, guardados</li>
        <li><strong>Relación:</strong> Usuarios que interactúan con tus historias</li>
      </ol>

      <h2>Estrategia de Reels Diarios</h2>
      <p>Los Reels son el formato con mayor alcance orgánico en 2024. Publica 1 Reel diario durante 30 días:</p>
      <ul>
        <li>Días 1-10: Contenido educativo/tips rápidos</li>
        <li>Días 11-20: Entretenimiento + valor (storytelling)</li>
        <li>Días 21-30: Contenido de autoridad (casos de éxito, procesos)</li>
      </ul>

      <h2>Colaboraciones Estratégicas</h2>
      <p>Haz collabs con cuentas de tu mismo nicho (no competidores directos) pero audiencia complementaria. El intercambio de audiencias es el crecimiento más rápido y cualificado.</p>

      <h2>Hashtags y SEO en Instagram</h2>
      <p>Usa 3-5 hashtags de nicho específico + 2-3 de alcance medio + 1-2 de marca. El SEO en Instagram ahora funciona por palabras clave en bio, nombre, descripción y alt text de imágenes.</p>

      <h2>Consistencia vs Calidad</h2>
      <p>Mejor 3 posts de calidad a la semana que 7 mediocres. La consistencia entrena al algoritmo y a tu audiencia.</p>
    `,
  },
  "algoritmo-tiktok-viral-2024": {
    slug: "algoritmo-tiktok-viral-2024",
    title: "Algoritmo de TikTok 2024: Claves para Volverse Viral",
    excerpt: "Entiende cómo funciona el algoritmo de TikTok y aprende a crear contenido que el algoritmo recomiende a millones de usuarios.",
    category: "TikTok",
    readTime: "6 min",
    date: "2024-01-12",
    seoKeywords: "algoritmo tiktok, viral tiktok 2024, como volverse viral tiktok",
    content: `
      <h2>Los 3 Pilares del Algoritmo</h2>
      <p>TikTok evalúa cada video en tres dimensiones:</p>
      <ul>
        <li><strong>Interacción del usuario:</strong> Likes, comentarios, compartidos, seguidos, favoritos</li>
        <li><strong>Información del video:</strong> Sonidos, hashtags, descripciones, efectos</li>
        <li><strong>Configuración del dispositivo:</strong> Idioma, país, tipo de dispositivo (peso menor)</li>
      </ul>

      <h2>La Regla de los 3 Segundos</h2>
      <p>El hook (gancho) en los primeros 3 segundos determina si el usuario se queda o hace scroll. Tipos de hooks efectivos:</p>
      <ul>
        <li>Visual: Movimiento inesperado, cambio de escena, texto grande</li>
        <li>Auditivo: Sonido trending, pregunta directa, afirmación contundente</li>
        <li>Cognitivo: "Deja de hacer X", "Nadie te dice que...", "El error que cometes"</li>
      </ul>

      <h2>Sonidos Trending vs Originales</h2>
      <p>Usa sonidos en tendencia (flecha arriba en la biblioteca de sonidos) para entrar en el "pool" de descubrimiento. Combina: 70% sonidos trending + 30% audio original para branding.</p>

      <h2>Frecuencia y Horarios</h2>
      <p>Mínimo 1 video diario, ideal 2-3. Mejores horarios generales (ajusta a tu audiencia):</p>
      <ul>
        <li>Mañana: 6-9 AM (desayuno/commute)</li>
        <li>Tarde: 12-2 PM (almuerzo)</li>
        <li>Noche: 7-10 PM (tiempo libre)</li>
      </ul>

      <h2>Series y Formatos Repetibles</h2>
      <p>Crea series reconocibles: "Tip del día", "Reacting to...", "Cómo hago X". La familiaridad genera seguimiento y el algoritmo aprende tu patrón.</p>
    `,
  },
  "comprar-seguidores-vs-organico": {
    slug: "comprar-seguidores-vs-organico",
    title: "Comprar Seguidores vs Crecimiento Orgánico: Verdades y Mitos",
    excerpt: "Analizamos los riesgos de comprar seguidores y por qué el crecimiento orgánico sostenible es la única estrategia que funciona a largo plazo.",
    category: "Estrategia",
    readTime: "10 min",
    date: "2024-01-10",
    seoKeywords: "comprar seguidores, crecimiento organico, riesgos comprar seguidores",
    content: `
      <h2>Qué Pasa Realmente al Comprar Seguidores</h2>
      <p>La mayoría de servicios venden bots o cuentas inactivas. Resultado inmediato:</p>
      <ul>
        <li>Número inflado, engagement real cerca de 0%</li>
        <li>Algoritmo detecta engagement falso → shadowban</li>
        <li>Pérdida de credibilidad ante marcas y audiencia real</li>
        <li>Riesgo de suspensión de cuenta (Términos de Servicio)</li>
      </ul>

      <h2>Métricas que Importan vs Vanidad</h2>
      <table style="width:100%; border-collapse:collapse; margin:16px 0;">
        <thead><tr style="background:var(--bg);"><th style="padding:8px;border:1px solid var(--bd);">Métrica de Vanidad</th><th style="padding:8px;border:1px solid var(--bd);">Métrica Real</th></tr></thead>
        <tbody>
          <tr><td style="padding:8px;border:1px solid var(--bd);">Total seguidores</td><td style="padding:8px;border:1px solid var(--bd);">Tasa de engagement (likes+comentarios/seguidores)</td></tr>
          <tr><td style="padding:8px;border:1px solid var(--bd);">Likes totales</td><td style="padding:8px;border:1px solid var(--bd);">Comentarios genuinos / conversación</td></tr>
          <tr><td style="padding:8px;border:1px solid var(--bd);">Views</td><td style="padding:8px;border:1px solid var(--bd);">Tasa de retención / tiempo de visualización</td></tr>
        </tbody>
      </table>

      <h2>Crecimiento Orgánico Sostenible</h2>
      <p>El camino real toma 6-18 meses pero construye activos:</p>
      <ol>
        <li>Define tu nicho y pilar de contenido (3-5 temas)</li>
        <li>Crea sistema de contenido (batch recording, calendarios)</li>
        <li>Interacciona genuinamente 30 min/día en tu comunidad</li>
        <li>Analiza weekly: qué funcionó, qué no, itera</li>
        <li>Monetiza desde el día 1 (lead magnet, lista email)</li>
      </ol>

      <h2>Señales de Alerta de Servicios Fraudulentos</h2>
      <ul>
        <li>Prometen "X seguidores en 24h"</li>
        <li>No piden acceso a tu cuenta (usan bots externos)</li>
        <li>Precio demasiado bajo ($5-10 por 1000)</li>
        <li>No hay casos de estudio verificables</li>
      </ul>
    `,
  },
  "aumentar-likes-comentarios-instagram": {
    slug: "aumentar-likes-comentarios-instagram",
    title: "Cómo Aumentar Likes y Comentarios en Instagram: Guía Completa",
    excerpt: "Técnicas probadas para maximizar el engagement en tus publicaciones: horarios óptimos, tipos de contenido, calls-to-action efectivos.",
    category: "Engagement",
    readTime: "7 min",
    date: "2024-01-08",
    seoKeywords: "aumentar likes instagram, mas comentarios instagram, engagement instagram",
    content: `
      <h2>CTAs que Generan Comentarios Reales</h2>
      <p>Evita "comenta si estás de acuerdo". Usa preguntas específicas:</p>
      <ul>
        <li>"¿Cuál es tu mayor reto con X? Te leo 👇"</li>
        <li>"Opción A o B: [imagen comparativa] Vota en comentarios"</li>
        <li>"Etiqueta a quien necesita ver esto"</li>
        <li>"¿Qué harías en esta situación?"</li>
      </ul>

      <h2>Tipos de Contenido con Mayor Engagement</h2>
      <ol>
        <li><strong>Carousel educativo:</strong> Guardados + compartidos = señal fuerte al algoritmo</li>
        <li><strong>Reels con texto en pantalla:</strong> Accesibilidad + retención</li>
        <li><strong>Stories interactivas:</strong> Encuestas, quizzes, slider de emoji</li>
        <li><strong>Contenido UGC:</strong> Repostea contenido de seguidores (con permiso)</li>
      </ol>

      <h2>Horarios Óptimos por Nicho (2024)</h2>
      <ul>
        <li><strong>Lifestyle/Personal:</strong> 7-9 AM, 7-10 PM</li>
        <li><strong>B2B/Emprendedores:</strong> 8-10 AM, 5-7 PM (días laborables)</li>
        <li><strong>Entretenimiento:</strong> 12-2 PM, 9 PM-12 AM</li>
        <li><strong>Educación:</strong> 6-8 AM, 8-10 PM</li>
      </ul>

      <h2>Estrategia de Respuesta</h2>
      <p>Responde a TODOS los comentarios en la primera hora. Esto duplica la probabilidad de que el algoritmo muestre tu post a más gente. Usa respuestas que inviten a réplica.</p>

      <h2>Colaboraciones de Engagement</h2>
      <p>Haz "engagement pods" genuinos: grupos de 10-15 creators de tu nicho que se apoyan mutuamente. No uses bots ni pods masivos.</p>
    `,
  },
  "seo-youtube-videos-posicionar": {
    slug: "seo-youtube-videos-posicionar",
    title: "SEO para YouTube: Cómo Posicionar tus Videos en Primeros Resultados",
    excerpt: "Optimiza tus videos para el motor de búsqueda de YouTube: palabras clave, thumbnails, descripciones, etiquetas y retención de audiencia.",
    category: "YouTube",
    readTime: "9 min",
    date: "2024-01-05",
    seoKeywords: "seo youtube, posicionar videos youtube, optimizar videos youtube",
    content: `
      <h2>Investigación de Palabras Clave</h2>
      <p>YouTube es el 2º buscador mundial. Usa:</p>
      <ul>
        <li>Autocompletar de YouTube (escribe tu tema + espacio)</li>
        <li>TubeBuddy / VidIQ para volumen y dificultad</li>
        <li>Google Trends → "Búsqueda en YouTube"</li>
        <li>Analiza videos top de competidores: qué keywords usan</li>
      </ul>

      <h2>Optimización On-Page</h2>
      <table style="width:100%; border-collapse:collapse; margin:16px 0;">
        <thead><tr style="background:var(--bg);"><th style="padding:8px;border:1px solid var(--bd);">Elemento</th><th style="padding:8px;border:1px solid var(--bd);">Best Practice</th></tr></thead>
        <tbody>
          <tr><td style="padding:8px;border:1px solid var(--bd);">Título</td><td style="padding:8px;border:1px solid var(--bd);">Keyword principal al inicio, < 60 chars, CTR-focused</td></tr>
          <tr><td style="padding:8px;border:1px solid var(--bd);">Descripción</td><td style="padding:8px;border:1px solid var(--bd);">150-300 palabras, keyword en primeras 2 líneas, timestamps, links</td></tr>
          <tr><td style="padding:8px;border:1px solid var(--bd);">Tags</td><td style="padding:8px;border:1px solid var(--bd);">5-8 tags: 1 principal, 3 variaciones, 2-3 broad, 1 marca</td></tr>
          <tr><td style="padding:8px;border:1px solid var(--bd);">Thumbnail</td><td style="padding:8px;border:1px solid var(--bd);">1280x720, texto legible, cara + emoción, contraste alto</td></tr>
          <tr><td style="padding:8px;border:1px solid var(--bd);">Subtítulos</td><td style="padding:8px;border:1px solid var(--bd);">Sube .srt manual (mejor indexación que auto-generados)</td></tr>
        </tbody>
      </table>

      <h2>Retención: La Métrica Reina</h2>
      <p>YouTube prioriza videos que retienen. Estructura:</p>
      <ul>
        <li>0-30s: Hook + promesa de valor</li>
        <li>30s-70%: Entrega valor en bloques de 60-90s</li>
        <li>Último 10%: Resumen + CTA suscribirse/ver siguiente</li>
      </ul>

      <h2>Playlists y End Screens</h2>
      <p>Agrupa videos en playlists temáticas (SEO: nombre de playlist = keyword). End screens: 1 video relacionado + 1 suscribirse. Aumenta session time.</p>
    `,
  },
  "estrategias-visualizaciones-reels": {
    slug: "estrategias-visualizaciones-reels",
    title: "Estrategias para Aumentar Visualizaciones en Reels y Shorts",
    excerpt: "Domina el formato de video corto: hooks en los primeros 3 segundos, tendencias de audio, frecuencia de publicación y análisis de métricas.",
    category: "Reels/Shorts",
    readTime: "5 min",
    date: "2024-01-03",
    seoKeywords: "visualizaciones reels, aumentar views reels, shorts viral",
    content: `
      <h2>Anatomía de un Reel Viral</h2>
      <ul>
        <li><strong>0-1s:</strong> Movimiento inmediato (no logo, no intro)</li>
        <li><strong>1-3s:</strong> Hook visual + textual simultáneo</li>
        <li><strong>3-15s:</strong> Desarrollo con cortes cada 1-2s</li>
        <li><strong>15-30s:</strong> Climax + CTA sutil (seguir para más)</li>
      </ul>

      <h2>Audio: El Motor de Descubrimiento</h2>
      <p>Revisa daily la biblioteca de sonidos → "Trending" (flecha ↑). Usa el sonido en los primeros 24-48h de su pico. Baja el volumen original al 5-10% si hablas encima.</p>

      <h2>Texto en Pantalla = Accesibilidad + Retención</h2>
      <ul>
        <li>Subtítulos animados (palabra x palabra) → +40% retención</li>
        <li>Puntos clave en texto grande (estilo TikTok nativo)</li>
        <li>Safe zones: evita bordes (botones UI) y centro inferior (caption)</li>
      </ul>

      <h2>Frecuencia y Testing A/B</h2>
      <p>Publica 2 Reels/día por 2 semanas. Analiza: ¿Qué formato retiene más? ¿Qué tema? ¿Qué audio? Dobla lo que funciona.</p>

      <h2>Repurposing Inteligente</h2>
      <p>1 video largo (YouTube) → 3-5 Shorts/Reels + 1 Carousel (Twitter/LinkedIn) + 5-10 clips para Stories. Maximiza cada producción.</p>
    `,
  },
  "marketing-influencers-colaboraciones": {
    slug: "marketing-influencers-colaboraciones",
    title: "Marketing de Influencers: Cómo Hacer Colaboraciones Rentables",
    excerpt: "Guía paso a paso para identificar, contactar y negociar con influencers que generen ROI real para tu marca o negocio.",
    category: "Marketing",
    readTime: "11 min",
    date: "2024-01-01",
    seoKeywords: "marketing influencers, colaboraciones influencers, roi influencers",
    content: `
      <h2>Tipos de Influencers por Tamaño</h2>
      <ul>
        <li><strong>Nano (1-10k):</strong> Engagement 8-12%, muy nicho, bajo costo</li>
        <li><strong>Micro (10-100k):</strong> Engagement 3-6%, mejor ROI para marcas medianas</li>
        <li><strong>Macro (100k-1M):</strong> Alcance masivo, engagement 1-3%, alto costo</li>
        <li><strong>Mega/Celebridad (1M+):</strong> Brand awareness, engagement <1%</li>
      </ul>

      <h2>Cómo Evaluar un Influencer (Checklist)</h2>
      <ol>
        <li>Engagement rate real: (likes+comentarios) / seguidores × 100</li>
        <li>Calidad comentarios: ¿Son genéricos ("nice", "🔥") o conversacionales?</li>
        <li>Audiencia: ¿Coincide geografía, edad, intereses con tu buyer persona?</li>
        <li>Historial de collabs: ¿Promociona competencia? ¿Resultados previos?</li>
        <li>Autenticidad: ¿Contenido orgánico vs patrocinado ratio?</li>
      </ol>

      <h2>Modelos de Compensación</h2>
      <ul>
        <li><strong>Pago fijo:</strong> Fee por post/story/Reel (común en micro/macro)</li>
        <li><strong>Affiliate/CPA:</strong> Comisión por venta (bajo riesgo, alto incentivo)</li>
        <li><strong>Hybrid:</strong> Fee reducido + comisión (alineación de intereses)</li>
        <li><strong>Product seeding:</strong> Envío gratis a cambio de review (nano/micro)</li>
      </ul>

      <h2>Contrato y Brief</h2>
      <p>Incluye: entregables, fechas, derechos de uso (whitelisting), exclusividad, métricas de reporte, cláusula de morosidad/FTC compliance.</p>

      <h2>Medición de ROI</h2>
      <p>UTM parameters en todos los links. Trackea: tráfico, leads, ventas, CAC vs LTV. No midas solo "alcance".</p>
    `,
  },
  "hashtags-estrategia-2024": {
    slug: "hashtags-estrategia-2024",
    title: "Estrategia de Hashtags 2024: Cómo Elegir los Mejores para tu Nicho",
    excerpt: "Deja de usar hashtags al azar. Aprende a investigar, combinar y rotar hashtags para maximizar alcance y descubrimiento orgánico.",
    category: "Instagram",
    readTime: "6 min",
    date: "2023-12-28",
    seoKeywords: "hashtags instagram 2024, mejores hashtags, estrategia hashtags",
    content: `
      <h2>La Pirámide de Hashtags (Estrategia 3-3-3)</h2>
      <ul>
        <li><strong>3 Hashtags de Nicho (10k-100k posts):</strong> Tu comunidad directa, alta relevancia</li>
        <li><strong>3 Hashtags de Alcance Medio (100k-1M):</strong> Descubrimiento cualificado</li>
        <li><strong>3 Hashtags Broad/Trending (1M+):</strong> Volumen, pero competencia alta</li>
      </ul>

      <h2>Herramientas de Investigación</h2>
      <ul>
        <li>Instagram Search: escribe # + palabra → ve volumen</li>
        <li>Meta Business Suite → Insights → Hashtags</li>
        <li>Flick, Later, Hashtagify (pago)</li>
        <li>Analiza competidores top: qué hashtags usan consistentemente</li>
      </ul>

      <h2>Rotación y Evitar Shadowban</h2>
      <p>No uses los mismos 9-15 hashtags siempre. Crea 3-5 sets y rota. Evita hashtags baneados (#followforfollow, #likeforlike, #spam, etc.).</p>

      <h2>Hashtags de Marca y Campaña</h2>
      <p>Crea 1-2 hashtags propios (#TuMarca, #TuCampaña). Incentiva a seguidores a usarlos. Genera UGC rastreable y comunidad.</p>

      <h2>Ubicación: Caption vs Comentario</h2>
      <p>Ambos funcionan igual para algoritmo. Caption = estética limpia (oculta con "..."). Comentario = editable después. Elige por workflow.</p>
    `,
  },
  "monetizar-instagram-tiktok-youtube": {
    slug: "monetizar-instagram-tiktok-youtube",
    title: "Cómo Monetizar en Instagram, TikTok y YouTube: Guía 2024",
    excerpt: "Todas las formas de ganar dinero con tu contenido: programas de creadores, afiliados, productos propios, patrocinios y membresías.",
    category: "Monetización",
    readTime: "12 min",
    date: "2023-12-25",
    seoKeywords: "monetizar instagram, ganar dinero tiktok, monetizar youtube 2024",
    content: `
      <h2>Programas Oficiales de Creadores</h2>
      <table style="width:100%; border-collapse:collapse; margin:16px 0;">
        <thead><tr style="background:var(--bg);"><th style="padding:8px;border:1px solid var(--bd);">Plataforma</th><th style="padding:8px;border:1px solid var(--bd);">Programa</th><th style="padding:8px;border:1px solid var(--bd);">Requisitos 2024</th></tr></thead>
        <tbody>
          <tr><td style="padding:8px;border:1px solid var(--bd);">YouTube</td><td style="padding:8px;border:1px solid var(--bd);">YPP</td><td style="padding:8px;border:1px solid var(--bd);">1000 subs + 4000h watch O 10M Shorts views (90d)</td></tr>
          <tr><td style="padding:8px;border:1px solid var(--bd);">TikTok</td><td style="padding:8px;border:1px solid var(--bd);">Creator Fund / Rewards</td><td style="padding:8px;border:1px solid var(--bd);">10k followers + 100k views (30d), 18+ años</td></tr>
          <tr><td style="padding:8px;border:1px solid var(--bd);">Instagram</td><td style="padding:8px;border:1px solid var(--bd);">Bonuses / Gifts / Badges</td><td style="padding:8px;border:1px solid var(--bd);">Variables, usualmente 1k-10k followers + engagement</td></tr>
        </tbody>
      </table>

      <h2>Ingresos Directos vs Indirectos</h2>
      <ul>
        <li><strong>Directos (plataforma):</strong> Ads, bonuses, gifts, suscripciones</li>
        <li><strong>Indirectos (tú controlas):</strong> Afiliados, cursos, coaching, merch, patrocinios, newsletters pagadas</li>
      </ul>
      <p>Los ingresos indirectos suelen superar a directos 5:1 para creators medianos.</p>

      <h2>Embudo de Monetización</h2>
      <ol>
        <li><strong>Gratis:</strong> Contenido valor → confianza</li>
        <li><strong>Lead Magnet:</strong> Guía gratis a cambio de email</li>
        <li><strong>Tripwire:</strong> Producto bajo costo ($7-27)</li>
        <li><strong>Core Offer:</strong> Curso/mentoría/servicio ($197-2997)</li>
        <li><strong>Continuidad:</strong> Membresía/comunidad pagada</li>
      </ol>

      <h2>Patrocinios: Precio y Negociación</h2>
      <p>Regla general: $10-50 por 1000 followers (varía enormemente por nicho). Tech/finanzas pagan 3-5x lifestyle. Siempre pide: brief, aprobaciones, whitelisting rights, exclusividad temporal.</p>
    `,
  },
  "analiticas-metricas-crecimiento": {
    slug: "analiticas-metricas-crecimiento",
    title: "Analíticas y Métricas Clave para Medir tu Crecimiento en Redes Sociales",
    excerpt: "Qué métricas importan realmente, cómo interpretar los insights de cada plataforma y tomar decisiones basadas en datos para escalar.",
    category: "Analítica",
    readTime: "8 min",
    date: "2023-12-22",
    seoKeywords: "metricas redes sociales, analiticas instagram, kpis crecimiento social media",
    content: `
      <h2>Métricas de Vanidad vs Accionables</h2>
      <p>Deja de obsesionarte con seguidores totales. Enfócate en:</p>
      <ul>
        <li><strong>Tasa de crecimiento semanal:</strong> (Seguidores nuevos / Total) × 100. Meta: 1-3%/semana</li>
        <li><strong>Engagement Rate por post:</strong> (Likes + Comentarios + Compartidos + Guardados) / Alcance × 100</li>
        <li><strong>Tasa de conversión perfil→seguidor:</strong> Visitas a perfil / Nuevos seguidores</li>
        <li><strong>Retención de audiencia:</strong> % que ve 50%+ / 75%+ / 100% de tus videos</li>
      </ul>

      <h2>Dashboard Semanal (30 min/semana)</h2>
      <table style="width:100%; border-collapse:collapse; margin:16px 0;">
        <thead><tr style="background:var(--bg);"><th style="padding:8px;border:1px solid var(--bd);">Métrica</th><th style="padding:8px;border:1px solid var(--bd);">Fuente</th><th style="padding:8px;border:1px solid var(--bd);">Acción si Baja</th></tr></thead>
        <tbody>
          <tr><td style="padding:8px;border:1px solid var(--bd);">Alcance total</td><td style="padding:8px;border:1px solid var(--bd);">Insights nativos</td><td style="padding:8px;border:1px solid var(--bd);">Más Reels, collabs, horarios</td></tr>
          <tr><td style="padding:8px;border:1px solid var(--bd);">Engagement rate</td><td style="padding:8px;border:1px solid var(--bd);">Insights / Metricool</td><td style="padding:8px;border:1px solid var(--bd);">Mejores CTAs, responde comentarios</td></tr>
          <tr><td style="padding:8px;border:1px solid var(--bd);">Click link bio</td><td style="padding:8px;border:1px solid var(--bd);">Linktree / GA4</td><td style="padding:8px;border:1px solid var(--bd);">Mejora CTA en bio + stories</td></tr>
          <tr><td style="padding:8px;border:1px solid var(--bd);">Guardados/compartidos</td><td style="padding:8px;border:1px solid var(--bd);">Insights por post</td><td style="padding:8px;border:1px solid var(--bd);">Más contenido educativo/guardable</td></tr>
        </tbody>
      </table>

      <h2>Herramientas Recomendadas</h2>
      <ul>
        <li><strong>Gratis:</strong> Meta Business Suite, YouTube Studio, TikTok Analytics, GA4</li>
        <li><strong>Freemium:</strong> Metricool, Later, Buffer (plan gratis decente)</li>
        <li><strong>Pro:</strong> Sprout Social, Hootsuite, Brandwatch (equipos/agencias)</li>
      </ul>

      <h2>Análisis de Competidores</h2>
      <p>Monthly: top 5 competidores → ¿Qué formato funciona? ¿Qué temas? ¿Frecuencia? ¿Engagement rate? Adapta, no copies.</p>
    `,
  },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = articles[slug];
  
  if (!article) {
    return {
      title: "Artículo no encontrado",
    };
  }

  return {
    title: `${article.title} | Blog Aumento de Seguidores`,
    description: article.excerpt,
    keywords: article.seoKeywords,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.date,
      tags: [article.category],
    },
  };
}

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = articles[slug];

  if (!article) {
    notFound();
  }

  return (
    <div style={{ "--g": "linear-gradient(45deg, #FEDA75, #FA7E1E, #D62976, #962FBF, #4F5BD5)", "--acc": "#D62976" } as React.CSSProperties}>
      <Header activePlat="instagram" />
      <main style={{ maxWidth: "800px", margin: "0 auto", padding: "32px 16px 60px" }}>
        <Link
          href="/blog"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            color: "var(--mu)",
            fontSize: "14px",
            fontWeight: 500,
            marginBottom: "24px",
            textDecoration: "none",
            transition: "color 0.2s ease",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "var(--acc)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "var(--mu)"; }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5" />
            <path d="m12 19-7-7 7-7" />
          </svg>
          Volver al Blog
        </Link>

        <article>
          <header style={{ marginBottom: "24px" }}>
            <Link
              href="/blog"
              style={{
                background: "var(--g)",
                color: "#fff",
                padding: "4px 12px",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: 600,
                textDecoration: "none",
                display: "inline-block",
                marginBottom: "16px",
              }}
            >
              {article.category}
            </Link>
            <h1 style={{ fontSize: "clamp(24px, 5vw, 36px)", fontWeight: 700, lineHeight: 1.2, marginBottom: "16px" }}>
              {article.title}
            </h1>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", color: "var(--mu)", fontSize: "14px" }}>
              <span>{new Date(article.date).toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" })}</span>
              <span>{article.readTime} de lectura</span>
            </div>
          </header>

          <div
            style={{
              lineHeight: 1.8,
              fontSize: "16px",
              color: "var(--tx)",
            }}
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          <nav style={{ marginTop: "48px", paddingTop: "24px", borderTop: "1px solid var(--bd)", display: "flex", justifyContent: "space-between" }}>
            <Link href="/blog" style={{ color: "var(--acc)", fontWeight: 600, textDecoration: "none" }}>
              ← Todos los artículos
            </Link>
            <Link href="/blog" style={{ color: "var(--acc)", fontWeight: 600, textDecoration: "none" }}>
              Volver al Blog →
            </Link>
          </nav>
        </article>
      </main>
      <Footer />
    </div>
  );
}