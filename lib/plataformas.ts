export type Plat = "instagram" | "facebook" | "tiktok" | "youtube" | "spotify";

export interface PlatInfo {
  nombre: string;
  g: string; // degradado de fondo
  acc: string; // color de acento
  u: string; // unidad: seguidores / suscriptores
  ph: string; // placeholder del campo
  privada: boolean; // ¿existen cuentas privadas?
}

export const PLAT: Record<Plat, PlatInfo> = {
  instagram: { nombre: "Instagram", g: "linear-gradient(45deg,#FEDA75,#FA7E1E,#D62976,#962FBF,#4F5BD5)", acc: "#D62976", u: "seguidores", ph: "@usuario o link de Instagram", privada: true },
  facebook: { nombre: "Facebook", g: "linear-gradient(45deg,#0a4fbf,#1877F2,#5aa0ff)", acc: "#1877F2", u: "seguidores", ph: "página o link de Facebook", privada: true },
  tiktok: { nombre: "TikTok", g: "linear-gradient(45deg,#010101,#25F4EE 55%,#FE2C55)", acc: "#FE2C55", u: "seguidores", ph: "@usuario o link de TikTok", privada: true },
  youtube: { nombre: "YouTube", g: "linear-gradient(45deg,#8e0000,#FF0000,#ff6a5c)", acc: "#FF0000", u: "suscriptores", ph: "@canal o link de YouTube", privada: false },
  spotify: { nombre: "Spotify", g: "linear-gradient(45deg,#0b6b30,#1DB954,#191414)", acc: "#1DB954", u: "seguidores", ph: "link del perfil o artista", privada: false },
};

export const PLAT_KEYS = Object.keys(PLAT) as Plat[];

export interface Paquete { n: number; p: number } // cantidad y precio en COP

// Precios base por 1000 (en COP)
const BASE_PRICES: Record<Plat, number> = {
  instagram: 30000,
  facebook: 25000,
  tiktok: 80000,
  youtube: 129000,
  spotify: 20000,
};

function calcularPaquetes(plataforma: Plat): Paquete[] {
  const base = BASE_PRICES[plataforma];
  const ratios = [100, 500, 1000, 5000];
  return ratios.map((n) => {
    const precioBase = (base / 1000) * n;
    // Redondear a múltiplos de 100
    const p = Math.round(precioBase / 100) * 100;
    return { n, p };
  });
}

export const PAQUETES_POR_PLATAFORMA: Record<Plat, Paquete[]> = {
  instagram: calcularPaquetes("instagram"),
  facebook: calcularPaquetes("facebook"),
  tiktok: calcularPaquetes("tiktok"),
  youtube: calcularPaquetes("youtube"),
  spotify: calcularPaquetes("spotify"),
};

// Legacy export for backward compatibility
export const PAQUETES = PAQUETES_POR_PLATAFORMA.tiktok;

export interface Perfil {
  existe: boolean;
  privada?: boolean;
  seguidores?: number | null;
  nombre?: string;
  foto?: string | null;
}
export const USUARIO_RE = /^[\p{L}\p{N} ._-]{1,60}$/u;
