"use server";

// --- CONFIGURACIÓN DE APIs (todas desde .env, sin valores por defecto) ---
const BRIGHTDATA_API_KEY = process.env.BRIGHTDATA_API_KEY;
const HASDATA_API_KEY = process.env.HASDATA_API_KEY;
const SOCIALCRAWL_API_KEY = process.env.SOCIALCRAWL_API_KEY;
const PROFILEQUERY_TOKEN = process.env.PROFILEQUERY_TOKEN;
const APIFY_TOKEN = process.env.APIFY_TOKEN;
const ENSEMBLEDATA_TOKEN = process.env.ENSEMBLEDATA_TOKEN;
const IG_RAPID_KEY = process.env.IG_RAPID_KEY;

const DATASET_ID = "gd_l1vikfch901nx3by4";
const BRIGHTDATA_API = "https://api.brightdata.com";

const TIMEOUT_MS = 8000;
const CACHE_TTL_MS = 10 * 60 * 1000;

export interface InstagramResult {
  existe: boolean;
  privada?: boolean;
  seguidores?: number | null;
  nombre?: string;
  foto?: string | null;
  error?: string;
  processing?: boolean;
  snapshotId?: string | null;
  username?: string;
  externalUrl?: string;
  provider?: string;
  running_time?: number;
}

// --- Caché simple en memoria ---
const cache = new Map<string, { at: number; data: InstagramResult }>();

function cleanIgUsername(value: string): string {
  return value
    .trim()
    .replace(/^https?:\/\/(www\.)?instagram\.com\/@?/i, "")
    .replace(/^@/, "")
    .split("?")[0]
    .split("/")[0]
    .trim()
    .toLowerCase();
}

async function leerJson(response: Response): Promise<any> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

// fetch con timeout para que una API lenta no frene la cascada
function fetchT(url: string, init: RequestInit = {}, ms = TIMEOUT_MS) {
  return fetch(url, { ...init, cache: "no-store", signal: AbortSignal.timeout(ms) });
}

function normalizarPerfil(profile: any, username: string, providerName: string): InstagramResult | null {
  if (!profile) return null;
  if (profile.error) {
    if (profile.error_code === "dead_page" || profile.error === "Page not found") return null;
    throw new Error(profile.error);
  }

  return {
    existe: true,
    username: profile.username ?? profile.user_name ?? profile.handle ?? profile.ownerUsername ?? username,
    nombre: profile.fullName ?? profile.display_name ?? profile.full_name ?? profile.name ?? username,
    seguidores:
      profile.followersCount ??
      profile.followers ??
      profile.follower_count ??
      profile.followers_count ??
      profile.edge_followed_by?.count ??
      0,
    foto:
      profile.profilePicUrl ??
      profile.avatar_url ??
      profile.profile_pic_url ??
      profile.profilePicUrlHD ??
      profile.profile_pic_url_hd ??
      "",
    privada: Boolean(profile.private ?? profile.is_private ?? profile.private_account ?? profile.isPrivate ?? false),
    externalUrl: `https://www.instagram.com/${username}/`,
    provider: providerName,
  };
}

function encontrarPerfil(data: any, username: string, providerName: string): InstagramResult | null {
  if (!data) return null;
  if (Array.isArray(data)) return normalizarPerfil(data[0], username, providerName);
  if (data?.username && (data?.followersCount !== undefined || data?.fullName !== undefined)) {
    return normalizarPerfil(data, username, providerName);
  }
  if (data?.author) return normalizarPerfil(data.author, username, providerName);
  if (Array.isArray(data?.data)) return normalizarPerfil(data.data[0], username, providerName);
  if (data?.data && typeof data.data === "object") {
    if (data.data.author) return normalizarPerfil(data.data.author, username, providerName);
    return normalizarPerfil(data.data, username, providerName);
  }
  if (data?.profile) return normalizarPerfil(data.profile, username, providerName);
  if (data?.username || data?.user_name || data?.full_name || data?.followers || data?.display_name || data?.fullName) {
    return normalizarPerfil(data, username, providerName);
  }
  return null;
}

// ==========================================
// 0. PROVEEDOR: INSTAGRAM HTML (Gratis, se omite si hay bloqueos)
// ==========================================
function decodeJsonString(raw: string): string {
  try {
    return JSON.parse(`"${raw}"`);
  } catch {
    return raw;
  }
}

async function getFromInstagramHtml(username: string): Promise<InstagramResult | null> {
  try {
    const response = await fetchT(
      `https://www.instagram.com/${encodeURIComponent(username)}/`,
      {
        method: "GET",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml",
          "Accept-Language": "en-US,en;q=0.9",
        },
      },
      5000
    );

    if (!response.ok) return null;
    const html = await response.text();

    const start = html.indexOf('"xig_user_by_username"');
    if (start === -1) return null; // Bloqueado por login wall, pasa al siguiente proveedor sin romper
    const block = html.slice(start, start + 6000);
    const pick = (re: RegExp) => block.match(re)?.[1];

    const seguidoresRaw = pick(/"follower_count":(\d+)/);
    if (!seguidoresRaw) return null;

    const usernameRaw = pick(/"username":"([^"]+)"/);
    const nombreRaw = pick(/"full_name":"((?:[^"\\]|\\.)*)"/);
    const fotoRaw = pick(/"profile_pic_url":"((?:[^"\\]|\\.)*)"/);
    const privadaRaw = pick(/"is_private":(true|false)/);

    return {
      existe: true,
      username: usernameRaw ?? username,
      nombre: nombreRaw ? decodeJsonString(nombreRaw) : username,
      seguidores: Number(seguidoresRaw),
      foto: fotoRaw ? decodeJsonString(fotoRaw) : "",
      privada: privadaRaw === "true",
      externalUrl: `https://www.instagram.com/${username}/`,
      provider: "InstagramHTML",
    };
  } catch {
    return null; // Si falla por red o timeout, pasa silenciosamente al siguiente
  }
}

// ==========================================
// 1. PROVEEDOR: HASDATA
// ==========================================
async function getFromHasData(username: string): Promise<InstagramResult | null> {
  if (!HASDATA_API_KEY) return null;
  const url = `https://api.hasdata.com/scrape/instagram/profile?handle=${encodeURIComponent(username)}`;
  const response = await fetchT(url, {
    method: "GET",
    headers: { "x-api-key": HASDATA_API_KEY, "Content-Type": "application/json" },
  });
  if (!response.ok) {
    throw new Error(`HasData HTTP Error: ${response.status}`);
  }
  const data = await leerJson(response);
  return encontrarPerfil(data, username, "HasData");
}

// ==========================================
// 2. PROVEEDOR: SOCIALCRAWL
// ==========================================
async function getFromSocialCrawl(username: string): Promise<InstagramResult | null> {
  if (!SOCIALCRAWL_API_KEY) return null;
  const url = `https://www.socialcrawl.dev/v1/instagram/profile?handle=${encodeURIComponent(username)}`;
  const response = await fetchT(url, {
    method: "GET",
    headers: { "x-api-key": SOCIALCRAWL_API_KEY, Accept: "application/json" },
  });
  if (!response.ok) {
    throw new Error(`SocialCrawl HTTP Error: ${response.status}`);
  }
  const data = await leerJson(response);
  return encontrarPerfil(data?.data ?? data, username, "SocialCrawl");
}

// ==========================================
// 3. PROVEEDOR: PROFILEQUERY
// ==========================================
async function getFromProfileQuery(username: string): Promise<InstagramResult | null> {
  if (!PROFILEQUERY_TOKEN) return null;
  const url = `https://api.profilequery.com/v1/profile?handle=${encodeURIComponent(username)}`;
  const response = await fetchT(url, {
    method: "GET",
    headers: { Authorization: `Bearer ${PROFILEQUERY_TOKEN}`, Accept: "application/json" },
  });
  if (!response.ok) {
    throw new Error(`ProfileQuery HTTP Error: ${response.status}`);
  }
  const data = await leerJson(response);
  return encontrarPerfil(data?.data ?? data, username, "ProfileQuery");
}

// ==========================================
// 4. PROVEEDOR: APIFY
// ==========================================
async function getFromApify(username: string): Promise<InstagramResult | null> {
  if (!APIFY_TOKEN) return null;
  const url = `https://api.apify.com/v2/acts/apify~instagram-profile-scraper/run-sync-get-dataset-items?token=${APIFY_TOKEN}`;
  const response = await fetchT(
    url,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usernames: [username] }),
    },
    20000
  );
  if (!response.ok) {
    throw new Error(`Apify HTTP Error: ${response.status}`);
  }
  const data = await leerJson(response);
  return encontrarPerfil(data, username, "Apify");
}

// ==========================================
// 5. PROVEEDOR: RAPID API
// ==========================================
async function getFromRapidApi(username: string): Promise<InstagramResult | null> {
  if (!IG_RAPID_KEY) return null;
  const host = "instagram-statistics-api.p.rapidapi.com";
  const url = `https://${host}/community2?username=${encodeURIComponent(username)}`;
  const response = await fetchT(url, {
    method: "GET",
    headers: { "x-rapidapi-key": IG_RAPID_KEY, "x-rapidapi-host": host },
  });
  if (!response.ok) {
    throw new Error(`RapidAPI HTTP Error: ${response.status}`);
  }
  const data = await leerJson(response);
  return encontrarPerfil(data?.result ?? data?.data ?? data, username, "RapidAPI");
}

// ==========================================
// 6. PROVEEDOR: ENSEMBLEDATA
// ==========================================
async function getFromEnsembleData(username: string): Promise<InstagramResult | null> {
  if (!ENSEMBLEDATA_TOKEN) return null;
  const url = `https://ensembledata.com/apis/instagram/user/detailed-info?username=${encodeURIComponent(
    username
  )}&token=${ENSEMBLEDATA_TOKEN}`;
  const response = await fetchT(url, { method: "GET" });
  if (!response.ok) {
    throw new Error(`EnsembleData HTTP Error: ${response.status}`);
  }
  const data = await leerJson(response);
  return encontrarPerfil(data?.data ?? data, username, "EnsembleData");
}

// ==========================================
// 7. PROVEEDOR: BRIGHT DATA (Respaldo Final)
// ==========================================
async function checkBrightDataSnapshot(snapshotId: string, username: string) {
  const monitorUrl = `${BRIGHTDATA_API}/datasets/v3/progress/${encodeURIComponent(snapshotId)}`;
  const response = await fetchT(monitorUrl, {
    headers: { Authorization: `Bearer ${BRIGHTDATA_API_KEY}`, Accept: "application/json" },
  });
  const data = await leerJson(response);
  if (!response.ok) throw new Error("Progress HTTP error en Bright Data");

  const status = String(data?.status ?? data?.state ?? "").toLowerCase();
  const runningTime = data?.running_time ?? data?.elapsed_time ?? 0;
  if (["running", "pending", "processing", "starting", "created", "queued", ""].includes(status)) {
    return { status: "processing" as const, running_time: runningTime };
  }
  if (["failed", "error", "cancelled"].includes(status)) throw new Error("Bright Data falló en el procesamiento del snapshot");

  const downloadUrl = `${BRIGHTDATA_API}/datasets/v3/snapshot/${encodeURIComponent(snapshotId)}?format=json`;
  const download = await fetchT(downloadUrl, {
    headers: { Authorization: `Bearer ${BRIGHTDATA_API_KEY}`, Accept: "application/json" },
  });
  const downloadData = await leerJson(download);
  const profile = encontrarPerfil(downloadData, username, "BrightData");
  return profile ? { status: "ready" as const, data: profile, running_time: runningTime } : { status: "processing" as const, running_time: runningTime };
}

async function getFromBrightData(username: string, snapshotId?: string): Promise<InstagramResult> {
  if (!BRIGHTDATA_API_KEY) return { existe: false, error: "BRIGHTDATA_API_KEY no configurada" };

  if (snapshotId) {
    const res = await checkBrightDataSnapshot(snapshotId, username);
    if (res.status === "ready" && "data" in res && res.data) {
      const result = { ...res.data };
      if (res.running_time) result.running_time = res.running_time;
      return result;
    }
    return { existe: false, processing: true, snapshotId, username, running_time: res.running_time ?? 0 };
  }

  const scrapeUrl = `${BRIGHTDATA_API}/datasets/v3/scrape?dataset_id=${encodeURIComponent(
    DATASET_ID
  )}&notify=false&include_errors=true`;
  const response = await fetchT(
    scrapeUrl,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${BRIGHTDATA_API_KEY}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ input: [{ url: `https://www.instagram.com/${username}/` }], limit_per_input: 1 }),
    },
    30000
  );

  const data = await leerJson(response);
  if (!response.ok) return { existe: false, error: "Bright Data HTTP Error en scrape" };

  const profile = encontrarPerfil(data, username, "BrightData");
  if (profile) {
    const result = { ...profile };
    if (data?.running_time) result.running_time = data.running_time;
    return result;
  }

  const newSnapshotId = data?.snapshot_id ?? data?.snapshotId;
  if (newSnapshotId) {
    const runningTime = data?.running_time ?? 0;
    return { existe: false, processing: true, snapshotId: newSnapshotId, username, running_time: runningTime };
  }

  return { existe: false, processing: true, snapshotId: null, username };
}

// ==========================================
// FUNCIÓN PRINCIPAL (ENRUTADOR)
// ==========================================
export async function getInstagramProfile(user: string, snapshotId?: string): Promise<InstagramResult> {
  const username = cleanIgUsername(user);
  if (!username) return { existe: false, error: "Usuario de Instagram inválido" };

  if (snapshotId) {
    try {
      return await getFromBrightData(username, snapshotId);
    } catch (err: any) {
      return { existe: false, error: `Alerta BrightData (Snapshot): ${err.message}` };
    }
  }

  // Caché
  const cached = cache.get(username);
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) {
    return cached.data;
  }

  // 1. Intentar primero con InstagramHTML (si falla por login wall, pasa silenciosamente)
  const htmlResult = await getFromInstagramHtml(username);
  if (htmlResult?.existe) {
    console.log("[Router] Éxito con InstagramHTML");
    cache.set(username, { at: Date.now(), data: htmlResult });
    return htmlResult;
  }

  // 2. APIs de pago en cascada (Si una de estas falla con error crítico, se detiene y avisa)
  const paidProviders: Array<[string, (u: string) => Promise<InstagramResult | null>]> = [
    ["HasData", getFromHasData],
    ["SocialCrawl", getFromSocialCrawl],
    ["ProfileQuery", getFromProfileQuery],
    ["Apify", getFromApify],
    ["RapidAPI", getFromRapidApi],
    ["EnsembleData", getFromEnsembleData],
  ];

  for (const [name, fn] of paidProviders) {
    try {
      const result = await fn(username);
      if (result?.existe) {
        console.log(`[Router] Éxito con ${name}`);
        cache.set(username, { at: Date.now(), data: result });
        return result;
      }
    } catch (err: any) {
      console.warn(`[Router] Alerta: El proveedor ${name} falló y detuvo la cascada:`, err.message);
      return {
        existe: false,
        error: `Alerta: El proveedor [${name}] falló (${err.message}). Se detuvo la búsqueda en cascada.`
      };
    }
  }

  console.log("[Router] Las APIs principales fallaron. Intentando con Bright Data...");
  try {
    return await getFromBrightData(username);
  } catch (err: any) {
    return { existe: false, error: `Alerta BrightData final falló: ${err.message}` };
  }
}