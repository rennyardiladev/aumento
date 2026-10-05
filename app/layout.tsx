import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aumentodeseguidores.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Aumento de Seguidores | Instagram, TikTok, YouTube, Facebook y Spotify",
    template: "%s | Aumento de Seguidores",
  },
  description: "Aumenta seguidores, likes, comentarios y visualizaciones en Instagram, Facebook, TikTok, YouTube y Spotify. Servicio rápido, seguro y garantizado en toda Latinoamérica.",
  keywords: [
    "aumento de seguidores",
    "comprar seguidores instagram",
    "seguidores tiktok",
    "seguidores youtube",
    "seguidores facebook",
    "seguidores spotify",
    "likes instagram",
    "comentarios instagram",
    "visualizaciones reels",
    "marketing digital",
    "crecimiento redes sociales",
  ],
  authors: [{ name: "Aumento de Seguidores" }],
  creator: "Aumento de Seguidores",
  publisher: "Aumento de Seguidores",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
    languages: {
      "es": siteUrl,
      "es-CO": siteUrl,
    },
  },
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: siteUrl,
    siteName: "Aumento de Seguidores",
    title: "Aumento de Seguidores | Instagram, TikTok, YouTube, Facebook y Spotify",
    description: "Aumenta seguidores, likes, comentarios y visualizaciones en Instagram, Facebook, TikTok, YouTube y Spotify. Servicio rápido, seguro y garantizado.",
    images: [
      {
        url: "/icono.webp",
        width: 512,
        height: 512,
        alt: "Aumento de Seguidores - Logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Aumento de Seguidores | Instagram, TikTok, YouTube, Facebook y Spotify",
    description: "Aumenta seguidores, likes, comentarios y visualizaciones en Instagram, Facebook, TikTok, YouTube y Spotify.",
    images: ["/icono.webp"],
    creator: "@aumentoseguidores",
    site: "@aumentoseguidores",
  },
  icons: {
    icon: "/icono.webp",
    shortcut: "/icono.webp",
    apple: "/icono.webp",
  },
  other: {
    cryptomus: "9eebc8d8",
    "theme-color": "#D62976",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#D62976",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
          {children}
        </div>
        <Analytics />
      </body>
    </html>
  );
}
