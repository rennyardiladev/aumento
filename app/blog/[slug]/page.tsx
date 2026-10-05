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

// Additional articles for marketing blog
const moreArticles: Record<string, Article> = {
  "facebook-ads-para-creadores": {
    slug: "facebook-ads-para-creadores",
    title: "Facebook Ads para Creadores: Guía de Campañas Rentables 2024",
    excerpt: "Aprende a crear campañas de Facebook Ads que conviertan: estructura de campañas, audiencias, creativos y optimización de ROAS.",
    category: "Facebook Ads",
    readTime: "10 min",
    date: "2024-01-20",
    seoKeywords: "facebook ads creadores, campañas facebook ads, roas facebook",
    content: `
      <h2>Estructura de Campaña (CBO)</h2>
      <p>Usa Campaign Budget Optimization para que Facebook distribuya automáticamente:</p>
      <ul>
        <li><strong>Campaña:</strong> Objetivo (Conversiones, Tráfico, Engagement)</li>
        <li><strong>Conjunto de anuncios:</strong> Audiencia, presupuesto, ubicaciones</li>
        <li><strong>Anuncio:</strong> Creativo + copy + CTA</li>
      </ul>

      <h2>Audiencias que Funcionan</h2>
      <ol>
        <li><strong>Personalizada:</strong> Visitantes web, engagement previo, lista email</li>
        <li><strong>Similar (Lookalike):</strong> 1% de tu país basado en clientes</li>
        <li><strong>Interés:</strong> Nicho amplio (solo si no tienes datos)</li>
      </ol>

      <h2>Creativos que Convierten</h2>
      <ul>
        <li>Video corto (15-30s) con hook en 3s</li>
        <li>Carrusel de beneficios (no features)</li>
        <li>Testimonios reales con foto/nombre</li>
        <li>UGC (contenido de usuario) > Publicidad pulida</li>
      </ul>

      <h2>Optimización de ROAS</h2>
      <p>Regla 70/20/10: 70% presupuesto a lo que funciona, 20% testing, 10% nuevas audiencias. No toques anuncios ganadores por 7 días.</p>

      <h2>Pixel y Eventos</h2>
      <p>Configura Meta Pixel + Conversion API. Trackea: ViewContent, AddToCart, Purchase. Sin datos, no hay optimización.</p>
    `,
  },
  "tiktok-shop-afiliados": {
    slug: "tiktok-shop-afiliados",
    title: "TikTok Shop y Afiliados: Cómo Vender sin Inventario",
    excerpt: "Guía completa para monetizar con TikTok Shop: configuración, selección de productos, contenido que vende y escalado.",
    category: "TikTok",
    readTime: "9 min",
    date: "2024-01-18",
    seoKeywords: "tiktok shop, afiliados tiktok, vender en tiktok",
    content: `
      <h2>Configuración de TikTok Shop</h2>
      <ul>
        <li>Cuenta Business verificada</li>
        <li>Mínimo 1,000 seguidores (en algunos países)</li>
        <li>Vincular cuenta de TikTok Shop</li>
        <li>Catálogo de productos (o afiliados de otros vendedores)</li>
      </ul>

      <h2>Selección de Productos</h2>
      <p>Busca productos que:</p>
      <ul>
        <li>Tengan <strong>impulso de compra</strong> (precio < $50)</li>
        <li>Resuelvan un problema visible en video</li>
        <li>Tengan comisión alta (15-30%)</li>
        <li>Ya vendan bien (ranking de TikTok Shop)</li>
      </ul>

      <h2>Contenido que Vende</h2>
      <ol>
        <li><strong>Demo:</strong> Muestra el producto en uso real</li>
        <li><strong>Before/After:</strong> Transformación visible</li>
        <li><strong>Review honesto:</strong> Pros y contras</li>
        <li><strong>Unboxing:</strong> Reacción genuina</li>
        <li><strong>Tutorial:</strong> Cómo usarlo</li>
      </ol>

      <h2>Escalado</h2>
      <p>Cuando un video vende: réplicalo con variaciones (diferente hook, ángulo, música). Publica 3-5 videos/día del mismo producto.</p>

      <h2>Pagos y Comisiones</h2>
      <p>TikTok paga semanalmente. Comisión promedio: 10-30% del precio. Los productos digitales pagan más que físicos.</p>
    `,
  },
  "email-marketing-creadores": {
    slug: "email-marketing-creadores",
    title: "Email Marketing para Creadores: Construye tu Lista y Vende en Automático",
    excerpt: "Por qué necesitas una lista de email, lead magnets que convierten, secuencias de bienvenida y automatizaciones de ventas.",
    category: "Email Marketing",
    readTime: "8 min",
    date: "2024-01-16",
    seoKeywords: "email marketing creadores, lead magnet, automatizacion email",
    content: `
      <h2>Por qué Email > Redes Sociales</h2>
      <p>Tú eres dueño de la lista. Las redes pueden cambiar el algoritmo mañana. Email tiene ROI promedio de $36 por $1 invertido.</p>

      <h2>Lead Magnets que Funcionan</h2>
      <ul>
        <li><strong>Checklist:</strong> "Los 10 pasos para X"</li>
        <li><strong>Plantilla:</strong> "Calendario de contenido editable"</li>
        <li><strong>Mini-curso:</strong> "5 días para X"</li>
        <li><strong>Herramienta:</strong> "Calculadora de X"</li>
        <li><strong>Guía PDF:</strong> "La guía definitiva de X"</li>
      </ul>

      <h2>Secuencia de Bienvenida (5 emails)</h2>
      <ol>
        <li><strong>Día 0:</strong> Entrega lead magnet + historia</li>
        <li><strong>Día 1:</strong> Valor extra (tip rápido)</li>
        <li><strong>Día 3:</strong> Caso de éxito / testimonio</li>
        <li><strong>Día 5:</strong> Soft pitch (producto/servicio)</li>
        <li><strong>Día 7:</strong> Oferta directa</li>
      </ol>

      <h2>Herramientas Recomendadas</h2>
      <ul>
        <li><strong>Gratis (hasta 500 subs):</strong> MailerLite, Brevo</li>
        <li><strong>Crecimiento:</strong> ConvertKit, Beehiiv</li>
        <li><strong>E-commerce:</strong> Klaviyo</li>
      </ul>

      <h2>Métricas Clave</h2>
      <p>Open rate > 30%, CTR > 3%, Unsubscribe < 0.5%. Si no cumples, revisa asunto y segmentación.</p>
    `,
  },
  "linkedin-personal-branding": {
    slug: "linkedin-personal-branding",
    title: "Personal Branding en LinkedIn: Estrategia para Profesionales y B2B",
    excerpt: "Optimiza tu perfil, estrategia de contenido, networking y cómo generar leads cualificados en LinkedIn.",
    category: "LinkedIn",
    readTime: "7 min",
    date: "2024-01-14",
    seoKeywords: "personal branding linkedin, linkedin b2b, generar leads linkedin",
    content: `
      <h2>Optimización de Perfil</h2>
      <ul>
        <li><strong>Titular:</strong> No solo tu cargo. "Ayudo a X a lograr Y"</li>
        <li><strong>Banner:</strong> Visual con tu propuesta de valor</li>
        <li><strong>Acerca de:</strong> Historia + experiencia + CTA</li>
        <li><strong>Featured:</strong> 3-5 piezas de contenido destacado</li>
      </ul>

      <h2>Estrategia de Contenido</h2>
      <p>Publica 3-5 veces/semana. Formatos que funcionan:</p>
      <ol>
        <li><strong>Storytelling profesional:</strong> Lecciones aprendidas</li>
        <li><strong>Listas:</strong> "5 herramientas que uso para X"</li>
        <li><strong>Opiniones:</strong> Toma de postura en tu industria</li>
        <li><strong>Casos de estudio:</strong> Resultados con datos</li>
      </ol>

      <h2>Networking Estratégico</h2>
      <p>Conecta con 10-20 personas/día en tu nicho. Personaliza el mensaje. Comenta en posts de otros antes de publicar tú.</p>

      <h2>Generación de Leads B2B</h2>
      <p>Usa LinkedIn Sales Navigator para filtrar por cargo, industria, tamaño de empresa. Secuencia: Conectar → Valor → Reunión.</p>

      <h2>LinkedIn Newsletter</h2>
      <p>Activa la función de newsletter. Los suscriptores reciben notificación de cada post. Crecimiento orgánico garantizado.</p>
    `,
  },
  "pinterest-trafico-web": {
    slug: "pinterest-trafico-web",
    title: "Pinterest para Tráfico Web: SEO Visual que Convierte",
    excerpt: "Cómo usar Pinterest como motor de búsqueda visual: pines optimizados, tableros, rich pins y estrategia de contenido evergreen.",
    category: "Pinterest",
    readTime: "6 min",
    date: "2024-01-13",
    seoKeywords: "pinterest trafico web, seo pinterest, marketing pinterest",
    content: `
      <h2>Pinterest es un Buscador, no una Red Social</h2>
      <p>Los pines pueden traer tráfico por 6-12 meses (evergreen). Piensa en keywords, no en likes.</p>

      <h2>Optimización de Pin</h2>
      <ul>
        <li><strong>Título:</strong> Keyword principal + beneficio</li>
        <li><strong>Descripción:</strong> 2-3 oraciones con keywords naturales</li>
        <li><strong>Imagen:</strong> Vertical 1000x1500, texto legible, contraste alto</li>
        <li><strong>Link:</strong> Siempre al artículo/producto</li>
      </ul>

      <h2>Rich Pins</h2>
      <p>Activa Rich Pins (gratis). Muestran título, descripción y precio automáticamente del tu sitio. Mejoran CTR.</p>

      <h2>Estrategia de Tableros</h2>
      <p>Crea 5-10 tableros por nicho. Nombra tableros con keywords. Organiza pines por tema para que el algoritmo entienda tu contenido.</p>

      <h2>Frecuencia y Herramientas</h2>
      <p>5-10 pines/día (incluye repins). Usa Tailwind o Pinterest Business Hub para programar. Analiza qué pines traen más clicks y réplicalos.</p>
    `,
  },
  "shorts-vs-reels-vs-tiktok": {
    slug: "shorts-vs-reels-vs-tiktok",
    title: "Shorts vs Reels vs TikTok: Dónde Publicar en 2024",
    excerpt: "Comparativa completa de los 3 formatos de video corto: algoritmo, monetización, audiencia, herramientas y estrategia multiplataforma.",
    category: "Video Corto",
    readTime: "8 min",
    date: "2024-01-11",
    seoKeywords: "shorts vs reels vs tiktok, video corto 2024, donde publicar",
    content: `
      <h2>Comparativa Rápida</h2>
      <table style="width:100%; border-collapse:collapse; margin:16px 0;">
        <thead><tr style="background:var(--bg);"><th style="padding:8px;border:1px solid var(--bd);">Plataforma</th><th style="padding:8px;border:1px solid var(--bd);">Alcance</th><th style="padding:8px;border:1px solid var(--bd);">Monetización</th><th style="padding:8px;border:1px solid var(--bd);">Audiencia</th></tr></thead>
        <tbody>
          <tr><td style="padding:8px;border:1px solid var(--bd);">TikTok</td><td style="padding:8px;border:1px solid var(--bd);">Muy alto (FYP)</td><td style="padding:8px;border:1px solid var(--bd);">Creator Fund, Shop, Lives</td><td style="padding:8px;border:1px solid var(--bd);">Gen Z + Millennials</td></tr>
          <tr><td style="padding:8px;border:1px solid var(--bd);">Reels (IG)</td><td style="padding:8px;border:1px solid var(--bd);">Alto (Explore)</td><td style="padding:8px;border:1px solid var(--bd);">Bonuses, collabs, afiliados</td><td style="padding:8px;border:1px solid var(--bd);">Millennials + Gen X</td></tr>
          <tr><td style="padding:8px;border:1px solid var(--bd);">Shorts (YT)</td><td style="padding:8px;border:1px solid var(--bd);">Alto (Home + Shorts)</td><td style="padding:8px;border:1px solid var(--bd);">YPP Shorts (ads revenue)</td><td style="padding:8px;border:1px solid var(--bd);">Todos los grupos</td></tr>
        </tbody>
      </table>

      <h2>Estrategia Multiplataforma</h2>
      <p>No publiques el mismo video exacto. Adapta:</p>
      <ul>
        <li><strong>TikTok:</strong> Sonido trending, texto nativo, hashtags</li>
        <li><strong>Reels:</strong> Estética cuidada, CTA a bio, sin marca de agua TikTok</li>
        <li><strong>Shorts:</strong> Título con keyword, miniatura atractiva</li>
      </ul>

      <h2>Herramientas de Repurposing</h2>
      <p>Usa Opus Clip, Vizard o CapCut para generar múltiples versiones de un video largo. Elimina marcas de agua antes de cross-postear.</p>

      <h2>Dónde Empezar</h2>
      <p>Si eres nuevo: TikTok (mayor alcance orgánico). Si tienes producto: Reels (mejor conversión). Si buscas ingresos pasivos: Shorts (monetización directa).</p>
    `,
  },
  "community-management-escalado": {
    slug: "community-management-escalado",
    title: "Community Management a Escala: Automatización sin Perder Humanidad",
    excerpt: "Herramientas y workflows para gestionar comunidades grandes: respuestas automáticas, moderación, CRM social y escalado de equipo.",
    category: "Community",
    readTime: "7 min",
    date: "2024-01-09",
    seoKeywords: "community management, automatizacion community, gestion comunidad",
    content: `
      <h2>Respuestas Automáticas Inteligentes</h2>
      <p>Configura respuestas rápidas para:</p>
      <ul>
        <li>Preguntas frecuentes (precio, envío, horario)</li>
        <li>Comentarios negativos (empatía + solución)</li>
        <li>Menciones de marca (gracias + CTA)</li>
      </ul>

      <h2>Herramientas de Escalado</h2>
      <ul>
        <li><strong>Meta Business Suite:</strong> Bandeja unificada IG+FB</li>
        <li><strong>Sprout Social / Hootsuite:</strong> Escucha social + reportes</li>
        <li><strong>ManyChat:</strong> Auto-reply en DM de IG/FB</li>
        <li><strong>Zendesk / Intercom:</strong> Tickets + CRM</li>
      </ul>

      <h2>Moderación</h2>
      <p>Define reglas claras: palabras bloqueadas, spam, trolls. Automatiza lo que se puede, pero siempre revisa casos sensibles manualmente.</p>

      <h2>Workflow de Escalado</h2>
      <ol>
        <li>Nivel 1: Bot responde FAQs (60-70% de mensajes)</li>
        <li>Nivel 2: Community manager junior (respuestas estándar)</li>
        <li>Nivel 3: Senior (casos complejos, crisis)</li>
        <li>Nivel 4: Manager (estrategia, reportes)</li>
      </ol>

      <h2>Métricas de Comunidad</h2>
      <p>Tiempo de respuesta (< 1h), tasa de resolución, NPS de comunidad, crecimiento de menciones positivas.</p>
    `,
  },
  "seo-local-negocios-fisicos": {
    slug: "seo-local-negocios-fisicos",
    title: "SEO Local para Negocios Físicos: Domina Google Maps y Atrae Clientes",
    excerpt: "Optimiza tu ficha de Google Business, reseñas, citations locales, contenido geo-localizado y estrategia de link building local.",
    category: "SEO Local",
    readTime: "9 min",
    date: "2024-01-07",
    seoKeywords: "seo local, google maps negocio, ficha google business",
    content: `
      <h2>Google Business Profile (GBP)</h2>
      <p>La ficha es el 50% del SEO local. Optimiza:</p>
      <ul>
        <li><strong>Categoría principal:</strong> La más específica posible</li>
        <li><strong>Horario:</strong> Actualizado (incluye festivos)</li>
        <li><strong>Fotos:</strong> Mínimo 20, sube 1/semana</li>
        <li><strong>Descripción:</strong> 750 caracteres con keywords locales</li>
        <li><strong>Productos/Servicios:</strong> Completa cada ítem</li>
      </ul>

      <h2>Reseñas: El Factor #2</h2>
      <p>Pide reseñas a cada cliente (QR en mostrador, email post-compra). Responde a TODAS (positivas y negativas). Mínimo 10 reseñas para empezar a rankear.</p>

      <h2>Citations Locales (NAP)</h2>
      <p>Tu Nombre, Dirección y Teléfono deben ser idénticos en: Google, Facebook, Yelp, directorios locales, cámara de comercio. Inconsistencias = penalización.</p>

      <h2>Contenido Geo-localizado</h2>
      <p>Blog posts con keywords locales: "mejor [servicio] en [ciudad]". Páginas de servicio por zona. Schema markup LocalBusiness.</p>

      <h2>Link Building Local</h2>
      <p>Patrocina eventos locales, colabora con medios locales, únete a asociaciones. Un link de un medio local vale más que 100 links genéricos.</p>
    `,
  },
  "content-repurposing-workflow": {
    slug: "content-repurposing-workflow",
    title: "Content Repurposing: Workflow para Multiplicar tu Contenido x10",
    excerpt: "Sistema completo para transformar 1 pieza de contenido en 20+ formatos: video, audio, texto, gráficos para todas las plataformas.",
    category: "Productividad",
    readTime: "10 min",
    date: "2024-01-06",
    seoKeywords: "content repurposing, reutilizar contenido, workflow contenido",
    content: `
      <h2>El Concepto: 1 → 20+</h2>
      <p>1 video largo (YouTube) se convierte en:</p>
      <ul>
        <li>3-5 Shorts/Reels/TikToks</li>
        <li>10-15 clips para Stories</li>
        <li>1 artículo de blog (transcripción)</li>
        <li>5-10 posts de texto (Twitter/LinkedIn)</li>
        <li>1 carrusel (Instagram/LinkedIn)</li>
        <li>1 newsletter</li>
        <li>1 podcast (audio del video)</li>
        <li>Infografía (pinterest)</li>
      </ul>

      <h2>Workflow Paso a Paso</h2>
      <ol>
        <li><strong>Grabar:</strong> 1 video largo (15-30 min)</li>
        <li><strong>Transcribir:</strong> Whisper/Descript</li>
        <li><strong>Clip:</strong> Opus Clip/Vizard (auto-detecta momentos virales)</li>
        <li><strong>Editar:</strong> CapCut (ajusta formato por plataforma)</li>
        <li><strong>Publicar:</strong> Programa con Buffer/Later</li>
      </ol>

      <h2>Herramientas Recomendadas</h2>
      <ul>
        <li><strong>Transcripción:</strong> Whisper, Descript, Otter.ai</li>
        <li><strong>Clips:</strong> Opus Clip, Vizard, Munch</li>
        <li><strong>Diseño:</strong> Canva, Figma</li>
        <li><strong>Programación:</strong> Buffer, Later, Metricool</li>
      </ul>

      <h2>Calendario de Repurposing</h2>
      <p>Lunes: Video largo. Martes-Miércoles: Clips. Jueves: Artículo. Viernes: Carrusel. Sábado: Newsletter. Domingo: Stories.</p>
    `,
  },
  "web3-social-tokens-creadores": {
    slug: "web3-social-tokens-creadores",
    title: "Web3 para Creadores: Social Tokens, NFTs y Economía de Creadores",
    excerpt: "Introducción a la economía de creadores en Web3: social tokens, membresías NFT, DAOs y nuevas formas de monetizar comunidad.",
    category: "Web3",
    readTime: "11 min",
    date: "2024-01-04",
    seoKeywords: "web3 creadores, social tokens, nfts creadores, economia creadores",
    content: `
      <h2>Social Tokens: Tu Propia Moneda</h2>
      <p>Un token que representa tu marca. Usos:</p>
      <ul>
        <li><strong>Acceso:</strong> Contenido exclusivo para holders</li>
        <li><strong>Gobernanza:</strong> Vota en decisiones de la comunidad</li>
        <li><strong>Recompensas:</strong> Merch, meet & greet, early access</li>
        <li><strong>Monetización:</strong> Vende tokens para financiar proyectos</li>
      </ul>

      <h2>Plataformas para Crear Tokens</h2>
      <ul>
        <li><strong>Roll:</strong> Social tokens en Ethereum</li>
        <li><strong>Rally:</strong> Tokens para creadores (fácil)</li>
        <li><strong>Coinvise:</strong> Token + airdrops + quests</li>
      </ul>

      <h2>NFTs como Membresías</h2>
      <p>En lugar de suscripción mensual, vende NFTs que dan acceso permanente. Beneficios: ingresos únicos + comunidad comprometida + royalties en reventa.</p>

      <h2>DAOs de Creadores</h2>
      <p>Organizaciones autónomas descentralizadas. Tu comunidad posee parte del proyecto y vota en dirección. Ejemplo: un canal de YouTube gobernado por sus suscriptores.</p>

      <h2>Riesgos y Realidad</h2>
      <p>Web3 aún es nicho. No abandones plataformas tradicionales. Úsalo como capa extra de monetización para tu comunidad más fiel (1-5% de seguidores).</p>
    `,
  },
};

// Merge all articles
const allArticles: Record<string, Article> = { ...articles, ...moreArticles };

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = allArticles[slug];
  
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
  const article = allArticles[slug];

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