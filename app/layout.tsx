import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aumento de Seguidores",
  description: "Seguidores para Instagram, Facebook, TikTok, YouTube y Spotify en toda Latinoamérica.",
  icons: {
    icon: "/icono.webp",
    shortcut: "/icono.webp",
    apple: "/icono.webp",
  },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
          {children}
        </div>
      </body>
    </html>
  );
}
