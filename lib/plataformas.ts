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
export const PAQUETES: Paquete[] = [
  { n: 100, p: 5900 },
  { n: 500, p: 15000 },
  { n: 1000, p: 3000 },
  { n: 5000, p: 120000 },
];

export interface Perfil {
  existe: boolean;
  privada?: boolean;
  seguidores?: number | null;
  nombre?: string;
  foto?: string | null;
}
export const USUARIO_RE = /^[\p{L}\p{N} ._-]{1,60}$/u;
