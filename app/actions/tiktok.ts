"use server";

export interface TikTokResult {
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
  running_time?: number;
  provider?: "ensembledata" | "brightdata";
}

const ENSEMBLEDATA_API_KEY = process.env.ENSEMBLEDATAS_API_KEY;
const BRIGHTDATA_API_KEY = process.env.BRIGHTDATA_API_KEY;
const DATASET_ID = "gd_l1villgoiiidt09ci";
const BRIGHTDATA_API = "https://api.brightdata.com";

function cleanTikTokUsername(input: string): string {
  return input
    .trim()
    .replace(/^https?:\/\/(www\.)?tiktok\.com\/@?/i, "")
    .replace(/^@/, "")
    .split("?")[0]
    .split("/")[0]
    .trim();
}

function normalizarSeguidores(value: any): number | null {
  if (value === null || value === undefined || value === "") return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

/* ============================================================
   ENSEMBLEDATA (NUEVO)
   ============================================================ */

async function consultarEnsembleDataTikTok(
  username: string
): Promise<TikTokResult | null> {
  if (!ENSEMBLEDATA_API_KEY) {
    return null;
  }

  try {
    const url = `https://ensembledata.com/apis/tt/user/info?username=${encodeURIComponent(
      username
    )}&token=${ENSEMBLEDATA_API_KEY}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
      signal: AbortSignal.timeout(6000),
    });

    const text = await response.text();
    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }

    if (!response.ok || !data) {
      console.warn("[TikTok][EnsembleData] HTTP", response.status);
      return null;
    }

    // Estructura que devuelve EnsembleData: data.user y data.stats
    const userObj = data.data?.user ?? data.user ?? null;
    const statsObj = data.data?.stats ?? data.stats ?? null;

    if (!userObj) {
      return null;
    }

    const uniqueId = userObj.uniqueId || userObj.unique_id || username;
    const nickname = userObj.nickname || username;
    
    // Obtener la mejor foto disponible
    const foto =
      userObj.avatarLarger ||
      userObj.avatarMedium ||
      userObj.avatarThumb ||
      userObj.avatar_larger?.url_list?.[0] ||
      userObj.avatar_medium?.url_list?.[0] ||
      null;

    const seguidores = normalizarSeguidores(statsObj?.followerCount || statsObj?.follower_count);

    return {
      existe: true,
      username: uniqueId,
      nombre: nickname,
      seguidores,
      foto,
      privada: Boolean(userObj.privateAccount || userObj.secret),
      externalUrl: `https://www.tiktok.com/@${uniqueId}`,
      processing: false,
      provider: "ensembledata",
    };
  } catch (error) {
    console.warn(
      "[TikTok][EnsembleData] ERROR:",
      error instanceof Error ? error.message : error
    );
    return null;
  }
}

/* ============================================================
   BRIGHT DATA (RESPALDO)
   ============================================================ */

function extractProfile(data: any): any {
  if (!data) return null;
  if (Array.isArray(data)) return data[0];
  if (Array.isArray(data?.data)) return data.data[0];
  if (data?.data && typeof data.data === "object") return data.data;
  if (data?.profile) return data.profile;
  if (data?.username || data?.unique_id || data?.uniqueId || data?.account_id || data?.nickname) return data;
  return null;
}

function normalizeBrightDataProfile(profile: any, cleanUsername: string): TikTokResult {
  if (profile.error) {
    if (profile.error_code === "dead_page") {
      return { existe: false, error: "Perfil no encontrado" };
    }
    throw new Error(profile.error);
  }

  const username =
    profile.username ??
    profile.unique_id ??
    profile.uniqueId ??
    profile.account_id ??
    cleanUsername;

  const nombre =
    profile.nickname ??
    profile.display_name ??
    profile.displayName ??
    profile.name ??
    username;

  const seguidores = normalizarSeguidores(
    profile.followers_count ??
      profile.followersCount ??
      profile.follower_count ??
      profile.followers ??
      profile.stats?.followers ??
      profile.stats?.followerCount ??
      0
  );

  const foto =
    profile.avatar_url ??
    profile.avatarUrl ??
    profile.avatar_larger ??
    profile.avatarLarge ??
    profile.avatar_medium ??
    profile.avatarMedium ??
    profile.avatar_thumb ??
    profile.avatarThumb ??
    profile.profile_pic_url_hd ??
    profile.profile_pic_url ??
    profile.profilePicUrl ??
    null;

  return {
    existe: true,
    username,
    nombre,
    seguidores,
    foto,
    privada: Boolean(profile.privateAccount || profile.secret),
    externalUrl: `https://www.tiktok.com/@${username}`,
    processing: false,
    provider: "brightdata",
  };
}

async function checkSnapshot(snapshotId: string, cleanUsername: string) {
  const monitorUrl = `${BRIGHTDATA_API}/datasets/v3/snapshot/${encodeURIComponent(snapshotId)}`;
  
  const response = await fetch(monitorUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${BRIGHTDATA_API_KEY}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  const text = await response.text();
  let data: any;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }

  if (response.status === 202) {
    return { status: "processing", data: null };
  }

  if (!response.ok) {
    throw new Error(`Error consultando snapshot: HTTP ${response.status} ${text}`);
  }

  const profile = extractProfile(data);
  if (profile) {
    return { status: "ready", data: normalizeBrightDataProfile(profile, cleanUsername) };
  }

  return { status: "processing", data: null };
}

/* ============================================================
   FUNCIÓN PRINCIPAL
   ============================================================ */

export async function getTikTokProfile(
  user: string,
  snapshotId?: string
): Promise<TikTokResult> {
  try {
    const cleanUsername = cleanTikTokUsername(user);
    if (!cleanUsername) {
      return { existe: false, error: "Usuario de TikTok inválido" };
    }

    const tiktokUrl = `https://www.tiktok.com/@${cleanUsername}`;

    // Si viene un snapshot previo de Bright Data
    if (snapshotId) {
      if (!BRIGHTDATA_API_KEY) {
        return { existe: false, error: "BRIGHTDATA_API_KEY no configurada" };
      }
      const result = await checkSnapshot(snapshotId, cleanUsername);
      if (result.status === "ready" && result.data) {
        return result.data;
      }
      return { existe: false, processing: true, snapshotId };
    }

    /* ========================================================
       1. ENSEMBLEDATA (PRIMERA OPCIÓN)
       ======================================================== */

    if (ENSEMBLEDATA_API_KEY) {
      console.log(`[TikTok] Consultando EnsembleData: ${cleanUsername}`);
      const ensembleResult = await consultarEnsembleDataTikTok(cleanUsername);

      if (ensembleResult?.existe) {
        console.log(`[TikTok] ✓ EnsembleData: ${cleanUsername}`);
        return ensembleResult;
      }

      console.log(`[TikTok] EnsembleData no encontró ${cleanUsername}`);
    }

    /* ========================================================
       2. BRIGHT DATA (RESPALDO)
       ======================================================== */

    if (!BRIGHTDATA_API_KEY) {
      return {
        existe: false,
        error: "Ninguna API de TikTok pudo encontrar el perfil",
      };
    }

    console.log(`[TikTok] Consultando Bright Data: ${cleanUsername}`);

    const scrapeUrl = `${BRIGHTDATA_API}/datasets/v3/scrape?dataset_id=${encodeURIComponent(
      DATASET_ID
    )}&notify=false&include_errors=true`;

    const response = await fetch(scrapeUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${BRIGHTDATA_API_KEY}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        input: [{ url: tiktokUrl, country: "" }],
        limit_per_input: 1,
      }),
      cache: "no-store",
    });

    const responseText = await response.text();
    let data: any;
    try {
      data = JSON.parse(responseText);
    } catch {
      data = responseText;
    }

    if (!response.ok) {
      return { existe: false, error: `Bright Data HTTP ${response.status}`, processing: false };
    }

    let profile = extractProfile(data);
    if (profile) {
      return normalizeBrightDataProfile(profile, cleanUsername);
    }

    const snapshotIdFromResponse = data?.snapshot_id;
    if (snapshotIdFromResponse) {
      return { existe: false, processing: true, snapshotId: snapshotIdFromResponse, provider: "brightdata" };
    }

    return { existe: false, processing: true, snapshotId: null, provider: "brightdata" };

  } catch (error) {
    console.error("Error TikTok:", error);
    return { existe: false, error: error instanceof Error ? error.message : String(error), processing: false };
  }
}