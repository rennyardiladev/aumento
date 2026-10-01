"use server";

export interface FacebookResult {
  existe: boolean;
  privada?: boolean;
  seguidores?: number | null;
  nombre?: string;
  foto?: string | null;
  error?: string;
  processing?: boolean;
  snapshotId?: string;
  username?: string;
  externalUrl?: string;
  running_time?: number;
}

const BRIGHTDATA_API_KEY = process.env.BRIGHTDATA_API_KEY;
const DATASET_ID = "gd_mf124a0511bauquyow";
const BRIGHTDATA_API = "https://api.brightdata.com";

interface FacebookProfile {
  username?: string;
  user_name?: string;
  userName?: string;
  handle?: string;
  page_name?: string;
  pageName?: string;
  name?: string;
  display_name?: string;
  displayName?: string;
  title?: string;
  followers?: number | string;
  follower_count?: number | string;
  followers_count?: number | string;
  num_followers?: number | string;
  followersCount?: number | string;
  page_followers?: number | string;
  profile_photo?: string;
  profile_photo_url?: string;
  profilePhoto?: string;
  profile_picture?: string;
  profile_picture_url?: string;
  profile_pic?: string;
  avatar?: string;
  avatar_url?: string;
  logo?: string;
  logo_url?: string;
  image?: string;
  image_url?: string;
  url?: string;
  page_url?: string;
  pageUrl?: string;
  [key: string]: any;
}

function limpiarUsuario(value: string): string {
  return value
    .trim()
    .replace(/^https?:\/\/(www\.)?facebook\.com\/?/i, "")
    .replace(/^@/, "")
    .split("?")[0]
    .split("#")[0]
    .split("/")[0]
    .trim();
}

async function leerJson(response: Response): Promise<any> {
  const text = await response.text();
  if (!text) return null;
  try { return JSON.parse(text); } catch { return text; }
}

function normalizarSeguidores(value: any): number | null {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const limpio = value.replace(/\s/g, "").replace(/,/g, "").replace(/\./g, "");
    const numero = Number(limpio);
    if (Number.isFinite(numero)) return numero;
    const match = value.match(/^([\d.,]+)\s*(K|M|mil|millones)?$/i);
    if (match) {
      let n = Number(match[1].replace(",", "."));
      const unidad = (match[2] ?? "").toLowerCase();
      if (unidad === "k" || unidad === "mil") n *= 1000;
      if (unidad === "m" || unidad === "millones") n *= 1000000;
      return Number.isFinite(n) ? Math.round(n) : null;
    }
  }
  return null;
}

function normalizarPerfil(profile: FacebookProfile, username: string) {
  if (!profile) return null;
  const usernameResult = profile.username ?? profile.user_name ?? profile.userName ?? profile.handle ?? username;
  const nombre = profile.page_name ?? profile.pageName ?? profile.name ?? profile.display_name ?? profile.displayName ?? profile.title ?? usernameResult;
  const seguidoresRaw = profile.followers ?? profile.follower_count ?? profile.followers_count ?? profile.num_followers ?? profile.followersCount ?? profile.page_followers ?? null;
  const seguidores = normalizarSeguidores(seguidoresRaw);
  const foto = profile.profile_photo ?? profile.profile_photo_url ?? profile.profilePhoto ?? profile.profile_picture ?? profile.profile_picture_url ?? profile.profile_pic ?? profile.avatar ?? profile.avatar_url ?? profile.logo ?? profile.logo_url ?? profile.image ?? profile.image_url ?? null;
  const externalUrl = profile.url ?? profile.page_url ?? profile.pageUrl ?? `https://www.facebook.com/${username}`;
  return { existe: true, username: usernameResult, nombre, seguidores, foto, externalUrl };
}

function encontrarPerfil(data: any, username: string) {
  if (!data) return null;
  let profile: any = null;
  if (Array.isArray(data)) profile = data[0] ?? null;
  else if (Array.isArray(data?.data)) profile = data.data[0] ?? null;
  else if (data?.data && typeof data.data === "object") profile = data.data;
  else if (data?.profile && typeof data.profile === "object") profile = data.profile;
  else if (typeof data === "object") profile = data;
  if (!profile) return null;
  const pareceSnapshot = profile.snapshot_id || profile.snapshotId || profile.status === "running" || profile.status === "pending" || profile.status === "processing";
  const parecePerfil = profile.username || profile.user_name || profile.name || profile.page_name || profile.followers || profile.followers_count || profile.profile_photo || profile.profile_picture;
  if (pareceSnapshot && !parecePerfil) return null;
  return normalizarPerfil(profile, username);
}

async function iniciarSnapshot(facebookUrl: string) {
  const url = `${BRIGHTDATA_API}/datasets/v3/scrape?dataset_id=${encodeURIComponent(DATASET_ID)}&notify=false&include_errors=true`;
  const response = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${BRIGHTDATA_API_KEY}`, "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ input: [{ url: facebookUrl }], limit_per_input: 1 }),
    cache: "no-store",
  });
  const data = await leerJson(response);
  if (!response.ok) throw new Error(typeof data === "string" ? data : data?.message ?? data?.error ?? `Bright Data HTTP ${response.status}`);
  return data;
}

async function consultarSnapshot(snapshotId: string) {
  const url = `${BRIGHTDATA_API}/datasets/v3/progress/${encodeURIComponent(snapshotId)}`;
  const response = await fetch(url, {
    method: "GET", headers: { Authorization: `Bearer ${BRIGHTDATA_API_KEY}`, Accept: "application/json" }, cache: "no-store",
  });
  const data = await leerJson(response);
  if (!response.ok) throw new Error(typeof data === "string" ? data : data?.message ?? data?.error ?? `Progress HTTP ${response.status}`);
  return data;
}

async function descargarSnapshot(snapshotId: string) {
  const url = `${BRIGHTDATA_API}/datasets/v3/snapshot/${encodeURIComponent(snapshotId)}?format=json`;
  const response = await fetch(url, {
    method: "GET", headers: { Authorization: `Bearer ${BRIGHTDATA_API_KEY}`, Accept: "application/json" }, cache: "no-store",
  });
  const data = await leerJson(response);
  if (!response.ok) throw new Error(typeof data === "string" ? data : data?.message ?? data?.error ?? `Download HTTP ${response.status}`);
  return data;
}

function obtenerEstado(progress: any): string {
  return String(progress?.status ?? progress?.state ?? progress?.snapshot_status ?? "").toLowerCase();
}

export async function getFacebookProfile(user: string, snapshotId?: string): Promise<FacebookResult> {
  try {
    if (!BRIGHTDATA_API_KEY) {
      return { existe: false, error: "BRIGHTDATA_API_KEY no configurada" };
    }

    const username = limpiarUsuario(user);
    if (!username) {
      return { existe: false, error: "Usuario de Facebook inválido" };
    }

    const facebookUrl = `https://www.facebook.com/${username}`;

    if (snapshotId) {
      const progress = await consultarSnapshot(snapshotId);
      const status = obtenerEstado(progress);
      const procesando = status === "running" || status === "pending" || status === "processing" || status === "starting" || status === "created" || status === "queued" || status === "";
      if (procesando) {
        return { existe: false, processing: true, snapshotId, username, externalUrl: facebookUrl, running_time: progress?.running_time ?? progress?.elapsed_time ?? progress?.runningTime ?? 0 };
      }
      if (status === "failed" || status === "error" || status === "cancelled") {
        return { existe: false, error: "Bright Data no pudo obtener la pagina de Facebook", processing: false };
      }
      const data = await descargarSnapshot(snapshotId);
      const profile = encontrarPerfil(data, username);
      if (!profile) {
        return { existe: false, error: "Facebook no devolvio datos de la pagina", processing: false };
      }
      return profile;
    }

    const trigger = await iniciarSnapshot(facebookUrl);
    const newSnapshotId = trigger?.snapshot_id ?? trigger?.snapshotId;

    if (!newSnapshotId) {
      const profile = encontrarPerfil(trigger, username);
      if (profile) return profile;
      return { existe: false, error: "Bright Data no devolvio snapshot_id", processing: false };
    }

    return { existe: false, processing: true, snapshotId: newSnapshotId, username, externalUrl: facebookUrl };

  } catch (error) {
    console.error("[Facebook] ERROR:", error);
    return { existe: false, error: error instanceof Error ? error.message : String(error), processing: false };
  }
}