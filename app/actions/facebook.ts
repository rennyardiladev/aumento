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
  provider?: "socialcrawl" | "socialapis" | "apify" | "brightdata";
}

const SOCIALCRAWL_API_KEY = process.env.SOCIALCRAWL_API_KEY;
const SOCIALAPIS_API_TOKEN = process.env.SOCIALAPIS_API_TOKEN;
const APIFY_API_TOKEN = process.env.APIFY_API_TOKEN;
const BRIGHTDATA_API_KEY = process.env.BRIGHTDATA_API_KEY;

const DATASET_ID = "gd_mf124a0511bauquyow";
const BRIGHTDATA_API = "https://api.brightdata.com";

/* ============================================================
   TIPOS
   ============================================================ */

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

  status?: string;

  [key: string]: any;
}

/* ============================================================
   UTILIDADES
   ============================================================ */

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

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

/**
 * Convierte diferentes formatos de seguidores a un número.
 */
function normalizarSeguidores(value: any): number | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const original = value.trim();

    const directo = Number(
      original.replace(/\s/g, "").replace(/,/g, "")
    );

    if (Number.isFinite(directo)) {
      return directo;
    }

    const match = original.match(/^([\d.,]+)\s*(K|M|mil|millones)?$/i);

    if (match) {
      let numero = Number(match[1].replace(",", "."));
      const unidad = (match[2] ?? "").toLowerCase();

      if (unidad === "k" || unidad === "mil") {
        numero *= 1_000;
      }

      if (unidad === "m" || unidad === "millones") {
        numero *= 1_000_000;
      }

      return Number.isFinite(numero) ? Math.round(numero) : null;
    }
  }

  return null;
}

/**
 * Normaliza un perfil genérico.
 */
function normalizarPerfil(
  profile: FacebookProfile,
  username: string
): FacebookResult | null {
  if (!profile) {
    return null;
  }

  const usernameResult =
    profile.username ??
    profile.user_name ??
    profile.userName ??
    profile.handle ??
    username;

  const nombre =
    profile.page_name ??
    profile.pageName ??
    profile.name ??
    profile.display_name ??
    profile.displayName ??
    profile.title ??
    usernameResult;

  const seguidoresRaw =
    profile.followers ??
    profile.follower_count ??
    profile.followers_count ??
    profile.num_followers ??
    profile.followersCount ??
    profile.page_followers ??
    null;

  const seguidores = normalizarSeguidores(seguidoresRaw);

  const foto =
    profile.profile_photo ??
    profile.profile_photo_url ??
    profile.profilePhoto ??
    profile.profile_picture ??
    profile.profile_picture_url ??
    profile.profile_pic ??
    profile.avatar ??
    profile.avatar_url ??
    profile.logo ??
    profile.logo_url ??
    profile.image ??
    profile.image_url ??
    null;

  const externalUrl =
    profile.url ??
    profile.page_url ??
    profile.pageUrl ??
    `https://www.facebook.com/${username}`;

  return {
    existe: true,
    username: usernameResult,
    nombre,
    seguidores,
    foto,
    externalUrl,
    privada: profile.status === "private" || profile.status === "privada",
    processing: false,
  };
}

/* ============================================================
   SOCIALCRAWL (NUEVO)
   ============================================================ */

async function consultarSocialCrawl(
  facebookUrl: string,
  username: string
): Promise<FacebookResult | null> {
  if (!SOCIALCRAWL_API_KEY) {
    return null;
  }

  try {
    const url = `https://www.socialcrawl.dev/v1/facebook/profile?url=${encodeURIComponent(
      facebookUrl
    )}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-api-key": SOCIALCRAWL_API_KEY,
        Accept: "application/json",
      },
      cache: "no-store",
      signal: AbortSignal.timeout(6000),
    });

    const data = await leerJson(response);

    if (!response.ok || !data?.success || !data?.data) {
      console.warn("[Facebook][SocialCrawl] HTTP", response.status, data);
      return null;
    }

    const author = data.data.author;
    if (!author) {
      return null;
    }

    return {
      existe: true,
      username: author.username || username,
      nombre: author.display_name || username,
      seguidores: normalizarSeguidores(author.followers),
      foto: author.avatar_url || null,
      externalUrl: author.url || facebookUrl,
      privada: author.private === true,
      processing: false,
      provider: "socialcrawl",
    };
  } catch (error) {
    console.warn(
      "[Facebook][SocialCrawl] ERROR:",
      error instanceof Error ? error.message : error
    );
    return null;
  }
}

/* ============================================================
   SOCIALAPIS
   ============================================================ */

async function consultarSocialAPIs(
  facebookUrl: string,
  username: string
): Promise<FacebookResult | null> {
  if (!SOCIALAPIS_API_TOKEN) {
    return null;
  }

  try {
    const url =
      "https://api.socialapis.io/facebook/pages/details" +
      `?link=${encodeURIComponent(facebookUrl)}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-api-token": SOCIALAPIS_API_TOKEN,
        Accept: "application/json",
      },
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });

    const data = await leerJson(response);

    if (!response.ok || !data || typeof data !== "object") {
      return null;
    }

    const profile = data["0"] ?? data.data?.[0] ?? data.data ?? null;

    if (!profile || typeof profile !== "object") {
      return null;
    }

    const tieneDatos =
      profile.title ||
      profile.name ||
      profile.page_name ||
      profile.url ||
      profile.followers_count ||
      profile.image;

    if (!tieneDatos) {
      return null;
    }

    return {
      existe: true,
      username:
        profile.url
          ?.replace(/^https?:\/\/(www\.)?facebook\.com\//i, "")
          .replace(/\/$/, "") ?? username,
      nombre: profile.title ?? profile.name ?? profile.page_name ?? username,
      seguidores: normalizarSeguidores(
        profile.followers_count ?? profile.followers ?? profile.followers_display
      ),
      foto: profile.image ?? profile.profile_photo ?? profile.profile_picture ?? null,
      externalUrl: profile.url ?? facebookUrl,
      privada: profile.status === "private" || profile.status === "privada",
      processing: false,
      provider: "socialapis",
    };
  } catch (error) {
    console.warn(
      "[Facebook][SocialAPIs] ERROR:",
      error instanceof Error ? error.message : error
    );
    return null;
  }
}

/* ============================================================
   APIFY
   ============================================================ */

function normalizarApifyProfile(
  data: any,
  username: string
): FacebookResult | null {
  const profile = Array.isArray(data) ? data[0] : data;

  if (!profile) {
    return null;
  }

  const tieneDatos =
    profile.title ||
    profile.pageName ||
    profile.pageUrl ||
    profile.facebookUrl ||
    profile.followers ||
    profile.profilePictureUrl;

  if (!tieneDatos) {
    return null;
  }

  return {
    existe: true,
    username: profile.pageName ?? username,
    nombre: profile.title ?? profile.pageName ?? username,
    seguidores: normalizarSeguidores(
      profile.followers ?? profile.followers_count
    ),
    foto: profile.profilePictureUrl ?? profile.profilePhoto ?? null,
    externalUrl:
      profile.pageUrl ?? profile.facebookUrl ?? `https://www.facebook.com/${username}`,
    privada: false,
    processing: false,
    provider: "apify",
  };
}

async function consultarApify(
  facebookUrl: string,
  username: string
): Promise<FacebookResult | null> {
  if (!APIFY_API_TOKEN) {
    return null;
  }

  try {
    const url =
      "https://api.apify.com/v2/acts/" +
      "apify~facebook-pages-scraper/" +
      "run-sync-get-dataset-items" +
      `?token=${encodeURIComponent(APIFY_API_TOKEN)}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        startUrls: [{ url: facebookUrl }],
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    });

    const data = await leerJson(response);

    if (!response.ok) {
      return null;
    }

    return normalizarApifyProfile(data, username);
  } catch (error) {
    console.warn(
      "[Facebook][Apify] ERROR:",
      error instanceof Error ? error.message : error
    );
    return null;
  }
}

/* ============================================================
   BRIGHT DATA
   ============================================================ */

function encontrarPerfil(data: any, username: string): FacebookResult | null {
  if (!data) {
    return null;
  }

  let profile: any = null;

  if (Array.isArray(data)) {
    profile = data[0] ?? null;
  } else if (Array.isArray(data?.data)) {
    profile = data.data[0] ?? null;
  } else if (data?.data && typeof data.data === "object") {
    profile = data.data;
  } else if (data?.profile && typeof data.profile === "object") {
    profile = data.profile;
  } else if (typeof data === "object") {
    profile = data;
  }

  if (!profile) {
    return null;
  }

  const pareceSnapshot =
    profile.snapshot_id ||
    profile.snapshotId ||
    profile.status === "running" ||
    profile.status === "pending" ||
    profile.status === "processing";

  const parecePerfil =
    profile.username ||
    profile.user_name ||
    profile.name ||
    profile.page_name ||
    profile.followers ||
    profile.followers_count ||
    profile.profile_photo ||
    profile.profile_picture;

  if (pareceSnapshot && !parecePerfil) {
    return null;
  }

  const resultado = normalizarPerfil(profile, username);

  if (resultado) {
    resultado.provider = "brightdata";
  }

  return resultado;
}

async function iniciarSnapshot(facebookUrl: string) {
  const url =
    `${BRIGHTDATA_API}/datasets/v3/scrape` +
    `?dataset_id=${encodeURIComponent(DATASET_ID)}` +
    "&notify=false" +
    "&include_errors=true";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${BRIGHTDATA_API_KEY}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      input: [{ url: facebookUrl }],
      limit_per_input: 1,
    }),
    cache: "no-store",
  });

  const data = await leerJson(response);

  if (!response.ok) {
    throw new Error(
      typeof data === "string"
        ? data
        : data?.message ?? data?.error ?? `Bright Data HTTP ${response.status}`
    );
  }

  return data;
}

async function consultarSnapshot(snapshotId: string) {
  const url =
    `${BRIGHTDATA_API}/datasets/v3/progress/` +
    `${encodeURIComponent(snapshotId)}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${BRIGHTDATA_API_KEY}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  const data = await leerJson(response);

  if (!response.ok) {
    throw new Error(
      typeof data === "string"
        ? data
        : data?.message ?? data?.error ?? `Progress HTTP ${response.status}`
    );
  }

  return data;
}

async function descargarSnapshot(snapshotId: string) {
  const url =
    `${BRIGHTDATA_API}/datasets/v3/snapshot/` +
    `${encodeURIComponent(snapshotId)}` +
    "?format=json";

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${BRIGHTDATA_API_KEY}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  const data = await leerJson(response);

  if (!response.ok) {
    throw new Error(
      typeof data === "string"
        ? data
        : data?.message ?? data?.error ?? `Download HTTP ${response.status}`
    );
  }

  return data;
}

function obtenerEstado(progress: any): string {
  return String(
    progress?.status ??
      progress?.state ??
      progress?.snapshot_status ??
      ""
  ).toLowerCase();
}

/* ============================================================
   FUNCIÓN PRINCIPAL
   ============================================================ */

export async function getFacebookProfile(
  user: string,
  snapshotId?: string
): Promise<FacebookResult> {
  try {
    if (
      !SOCIALCRAWL_API_KEY &&
      !SOCIALAPIS_API_TOKEN &&
      !APIFY_API_TOKEN &&
      !BRIGHTDATA_API_KEY
    ) {
      return {
        existe: false,
        error: "No hay APIs de Facebook configuradas",
      };
    }

    const username = limpiarUsuario(user);

    if (!username) {
      return {
        existe: false,
        error: "Usuario de Facebook inválido",
      };
    }

    const facebookUrl = `https://www.facebook.com/${username}`;

    /* ========================================================
       SNAPSHOT DE BRIGHT DATA YA EXISTENTE
       ======================================================== */

    if (snapshotId) {
      if (!BRIGHTDATA_API_KEY) {
        return {
          existe: false,
          error:
            "El snapshot pertenece a Bright Data pero BRIGHTDATA_API_KEY no está configurada",
          processing: false,
        };
      }

      const progress = await consultarSnapshot(snapshotId);
      const status = obtenerEstado(progress);

      const procesando =
        status === "running" ||
        status === "pending" ||
        status === "processing" ||
        status === "starting" ||
        status === "created" ||
        status === "queued" ||
        status === "";

      if (procesando) {
        return {
          existe: false,
          processing: true,
          snapshotId,
          username,
          externalUrl: facebookUrl,
          running_time:
            progress?.running_time ??
            progress?.elapsed_time ??
            progress?.runningTime ??
            0,
          provider: "brightdata",
        };
      }

      if (
        status === "failed" ||
        status === "error" ||
        status === "cancelled"
      ) {
        return {
          existe: false,
          error: "Bright Data no pudo obtener la página de Facebook",
          processing: false,
          provider: "brightdata",
        };
      }

      const data = await descargarSnapshot(snapshotId);
      const profile = encontrarPerfil(data, username);

      if (!profile) {
        return {
          existe: false,
          error: "Facebook no devolvió datos de la página",
          processing: false,
          provider: "brightdata",
        };
      }

      return profile;
    }

    /* ========================================================
       1. SOCIALCRAWL (NUEVO)
       ======================================================== */

    if (SOCIALCRAWL_API_KEY) {
      console.log(`[Facebook] Consultando SocialCrawl: ${username}`);
      const socialCrawlResult = await consultarSocialCrawl(
        facebookUrl,
        username
      );

      if (socialCrawlResult?.existe) {
        console.log(`[Facebook] ✓ SocialCrawl: ${username}`);
        return socialCrawlResult;
      }

      console.log(`[Facebook] SocialCrawl no encontró ${username}`);
    }

    /* ========================================================
       2. SOCIALAPIS
       ======================================================== */

    if (SOCIALAPIS_API_TOKEN) {
      console.log(`[Facebook] Consultando SocialAPIs: ${username}`);
      const socialResult = await consultarSocialAPIs(facebookUrl, username);

      if (socialResult?.existe) {
        console.log(`[Facebook] ✓ SocialAPIs: ${username}`);
        return socialResult;
      }

      console.log(`[Facebook] SocialAPIs no encontró ${username}`);
    }

    /* ========================================================
       3. APIFY
       ======================================================== */

    if (APIFY_API_TOKEN) {
      console.log(`[Facebook] Consultando Apify: ${username}`);
      const apifyResult = await consultarApify(facebookUrl, username);

      if (apifyResult?.existe) {
        console.log(`[Facebook] ✓ Apify: ${username}`);
        return apifyResult;
      }

      console.log(`[Facebook] Apify no encontró ${username}`);
    }

    /* ========================================================
       4. BRIGHT DATA
       ======================================================== */

    if (!BRIGHTDATA_API_KEY) {
      return {
        existe: false,
        error:
          "Ninguna de las APIs configuradas encontró el perfil de Facebook",
        processing: false,
      };
    }

    console.log(`[Facebook] Consultando Bright Data: ${username}`);

    const trigger = await iniciarSnapshot(facebookUrl);
    const newSnapshotId = trigger?.snapshot_id ?? trigger?.snapshotId;

    if (!newSnapshotId) {
      const profile = encontrarPerfil(trigger, username);

      if (profile) {
        return profile;
      }

      return {
        existe: false,
        error: "Bright Data no devolvió snapshot_id",
        processing: false,
        provider: "brightdata",
      };
    }

    return {
      existe: false,
      processing: true,
      snapshotId: newSnapshotId,
      username,
      externalUrl: facebookUrl,
      provider: "brightdata",
    };
  } catch (error) {
    console.error("[Facebook] ERROR:", error);

    return {
      existe: false,
      error: error instanceof Error ? error.message : String(error),
      processing: false,
    };
  }
}