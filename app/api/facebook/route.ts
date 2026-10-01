import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// ============================================================
// CACHE EN MEMORIA (Map) - Compatible con Vercel
// ============================================================

const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 horas

function getFromCache(username: string): any | null {
  const entry = cache.get(username.toLowerCase());
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    cache.delete(username.toLowerCase());
    return null;
  }
  console.log("[Facebook] CACHE HIT:", username);
  return entry.data;
}

function setCache(username: string, data: any) {
  cache.set(username.toLowerCase(), { data, timestamp: Date.now() });
  console.log("[Facebook] CACHE SET:", username);
}

// ============================================================
// CONFIGURACIÓN
// ============================================================

const BRIGHTDATA_API_KEY =
  process.env.BRIGHTDATA_API_KEY;

const DATASET_ID =
  "gd_mf124a0511bauquyow";

const BRIGHTDATA_API =
  "https://api.brightdata.com";

// ============================================================
// TIPOS
// ============================================================

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

// ============================================================
// LIMPIAR USUARIO
// ============================================================

function limpiarUsuario(
  value: string
): string {
  return value
    .trim()
    .replace(
      /^https?:\/\/(www\.)?facebook\.com\/?/i,
      ""
    )
    .replace(/^@/, "")
    .split("?")[0]
    .split("#")[0]
    .split("/")[0]
    .trim();
}

// ============================================================
// LEER RESPUESTA JSON
// ============================================================

async function leerJson(
  response: Response
): Promise<any> {
  const text =
    await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

// ============================================================
// NORMALIZAR NÚMERO DE SEGUIDORES
// ============================================================

function normalizarSeguidores(
  value: any
): number | null {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  if (
    typeof value === "number" &&
    Number.isFinite(value)
  ) {
    return value;
  }

  if (typeof value === "string") {
    const limpio =
      value
        .replace(/\s/g, "")
        .replace(/,/g, "")
        .replace(/\./g, "");

    const numero =
      Number(limpio);

    if (
      Number.isFinite(numero)
    ) {
      return numero;
    }

    // Ejemplo: "16K"
    const match =
      value.match(
        /^([\d.,]+)\s*(K|M|mil|millones)?$/i
      );

    if (match) {
      let n =
        Number(
          match[1]
            .replace(",", ".")
        );

      const unidad =
        (
          match[2] ?? ""
        ).toLowerCase();

      if (
        unidad === "k" ||
        unidad === "mil"
      ) {
        n *= 1000;
      }

      if (
        unidad === "m" ||
        unidad === "millones"
      ) {
        n *= 1000000;
      }

      return Number.isFinite(n)
        ? Math.round(n)
        : null;
    }
  }

  return null;
}

// ============================================================
// NORMALIZAR PERFIL
// ============================================================

function normalizarPerfil(
  profile: FacebookProfile,
  username: string
) {
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

  const seguidores =
    normalizarSeguidores(
      seguidoresRaw
    );

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

    username:
      usernameResult,

    nombre,

    seguidores,

    foto,

    externalUrl,
  };
}

// ============================================================
// ENCONTRAR PERFIL
// ============================================================

function encontrarPerfil(
  data: any,
  username: string
) {
  if (!data) {
    return null;
  }

  let profile: any = null;

  // ----------------------------------------------------------
  // Array directo
  // ----------------------------------------------------------

  if (Array.isArray(data)) {
    profile =
      data[0] ?? null;
  }

  // ----------------------------------------------------------
  // { data: [...] }
  // ----------------------------------------------------------

  else if (
    Array.isArray(data?.data)
  ) {
    profile =
      data.data[0] ?? null;
  }

  // ----------------------------------------------------------
  // { data: {...} }
  // ----------------------------------------------------------

  else if (
    data?.data &&
    typeof data.data === "object"
  ) {
    profile =
      data.data;
  }

  // ----------------------------------------------------------
  // { profile: {...} }
  // ----------------------------------------------------------

  else if (
    data?.profile &&
    typeof data.profile === "object"
  ) {
    profile =
      data.profile;
  }

  // ----------------------------------------------------------
  // Objeto directo
  // ----------------------------------------------------------

  else if (
    typeof data === "object"
  ) {
    profile =
      data;
  }

  if (!profile) {
    return null;
  }

  // ==========================================================
  // IMPORTANTE:
  // No tratar snapshot como perfil
  // ==========================================================

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

  if (
    pareceSnapshot &&
    !parecePerfil
  ) {
    return null;
  }

  return normalizarPerfil(
    profile,
    username
  );
}

// ============================================================
// INICIAR SNAPSHOT
// ============================================================

async function iniciarSnapshot(
  facebookUrl: string
) {
  // Usar scrape como TikTok (puede devolver datos directos)
  const url =
    `${BRIGHTDATA_API}/datasets/v3/scrape` +
    `?dataset_id=${encodeURIComponent(
      DATASET_ID
    )}` +
    `&notify=false` +
    `&include_errors=true`;

  console.log(
    "[Facebook] Iniciando scrape:",
    facebookUrl
  );

  const response =
    await fetch(
      url,
      {
        method: "POST",

        headers: {
          Authorization:
            `Bearer ${BRIGHTDATA_API_KEY}`,

          "Content-Type":
            "application/json",

          Accept:
            "application/json",
        },

        body: JSON.stringify({
          input: [
            {
              url: facebookUrl,
            },
          ],
          limit_per_input: 1,
        }),

        cache: "no-store",
      }
    );

  const data =
    await leerJson(response);

  console.log(
    "[Facebook] Scrape HTTP:",
    response.status
  );

  console.log(
    "[Facebook] Scrape:",
    data
  );

  if (!response.ok) {
    throw new Error(
      typeof data === "string"
        ? data
        : data?.message ??
          data?.error ??
          `Bright Data HTTP ${response.status}`
    );
  }

  return data;
}

// ============================================================
// CONSULTAR PROGRESO
// ============================================================

async function consultarSnapshot(
  snapshotId: string
) {
  const url =
    `${BRIGHTDATA_API}/datasets/v3/progress/${encodeURIComponent(
      snapshotId
    )}`;

  const response =
    await fetch(
      url,
      {
        method: "GET",

        headers: {
          Authorization:
            `Bearer ${BRIGHTDATA_API_KEY}`,

          Accept:
            "application/json",
        },

        cache: "no-store",
      }
    );

  const data =
    await leerJson(response);

  console.log(
    "[Facebook] Progress HTTP:",
    response.status
  );

  console.log(
    "[Facebook] Progress:",
    data
  );

  if (!response.ok) {
    throw new Error(
      typeof data === "string"
        ? data
        : data?.message ??
          data?.error ??
          `Progress HTTP ${response.status}`
    );
  }

  return data;
}

// ============================================================
// DESCARGAR SNAPSHOT
// ============================================================

async function descargarSnapshot(
  snapshotId: string
) {
  const url =
    `${BRIGHTDATA_API}/datasets/v3/snapshot/${encodeURIComponent(
      snapshotId
    )}` +
    `?format=json`;

  console.log(
    "[Facebook] Descargando snapshot:",
    snapshotId
  );

  const response =
    await fetch(
      url,
      {
        method: "GET",

        headers: {
          Authorization:
            `Bearer ${BRIGHTDATA_API_KEY}`,

          Accept:
            "application/json",
        },

        cache: "no-store",
      }
    );

  const data =
    await leerJson(response);

  console.log(
    "[Facebook] Download HTTP:",
    response.status
  );

  console.log(
    "[Facebook] Download:",
    data
  );

  if (!response.ok) {
    throw new Error(
      typeof data === "string"
        ? data
        : data?.message ??
          data?.error ??
          `Download HTTP ${response.status}`
    );
  }

  return data;
}

// ============================================================
// DETERMINAR ESTADO
// ============================================================

function obtenerEstado(
  progress: any
): string {
  return String(
    progress?.status ??
    progress?.state ??
    progress?.snapshot_status ??
    ""
  ).toLowerCase();
}

// ============================================================
// GET
//
// Primera llamada:
//
// /api/facebook?user=bucaramarketing
//
// Segunda llamada:
//
// /api/facebook?user=bucaramarketing&snapshot=sd_xxxxx
// ============================================================

export async function GET(
  request: NextRequest
) {
  try {
    // ========================================================
    // 1. API KEY
    // ========================================================

    if (!BRIGHTDATA_API_KEY) {
      return NextResponse.json(
        {
          success: false,

          error:
            "BRIGHTDATA_API_KEY no configurada",
        },
        {
          status: 500,
        }
      );
    }

    // ========================================================
    // 2. PARÁMETROS
    // ========================================================

    const searchParams =
      request.nextUrl.searchParams;

    const rawUser =
      searchParams.get("user");

    const snapshotId =
      searchParams.get("snapshot");

    if (!rawUser) {
      return NextResponse.json(
        {
          success: false,

          error:
            'Parámetro "user" requerido',
        },
        {
          status: 400,
        }
      );
    }

    // ========================================================
    // 3. LIMPIAR USUARIO
    // ========================================================

    const username =
      limpiarUsuario(rawUser);

    if (!username) {
      return NextResponse.json(
        {
          success: false,

          error:
            "Usuario de Facebook inválido",
        },
        {
          status: 400,
        }
      );
    }

    // ========================================================
    // CACHE: Solo para consultas SIN snapshot (primera vez)
    // ========================================================

    if (!snapshotId) {
      const cached = getFromCache(username);
      if (cached) {
        return NextResponse.json(
          {
            success: true,
            data: cached,
            cached: true,
          },
          {
            status: 200,
            headers: { "Cache-Control": "no-store" },
          }
        );
      }
    }

    const facebookUrl =
      `https://www.facebook.com/${username}`;

    console.log(
      "======================================"
    );

    console.log(
      "[Facebook] Usuario:",
      username
    );

    console.log(
      "[Facebook] URL:",
      facebookUrl
    );

    console.log(
      "[Facebook] Snapshot:",
      snapshotId ??
        "nuevo"
    );

    console.log(
      "======================================"
    );

    // ========================================================
    // 4. CONSULTAR SNAPSHOT EXISTENTE
    // ========================================================

    if (snapshotId) {
      const progress =
        await consultarSnapshot(
          snapshotId
        );

      const status =
        obtenerEstado(
          progress
        );

      console.log(
        "[Facebook] Estado:",
        status
      );

      // ------------------------------------------------------
      // Todavía procesando
      // ------------------------------------------------------

      const procesando =
        status === "running" ||
        status === "pending" ||
        status === "processing" ||
        status === "starting" ||
        status === "created" ||
        status === "queued" ||
        status === "";

      if (procesando) {
        return NextResponse.json(
          {
            success: true,

            status:
              "processing",

            snapshotId,

            username,

            externalUrl:
              facebookUrl,

            running_time: progress?.running_time ?? progress?.elapsed_time ?? progress?.runningTime ?? 0,

            message:
              "Bright Data todavía está procesando Facebook.",
          },
          {
            status: 200,

            headers: {
              "Cache-Control":
                "no-store",
            },
          }
        );
      }

      // ------------------------------------------------------
      // Error
      // ------------------------------------------------------

      if (
        status === "failed" ||
        status === "error" ||
        status === "cancelled"
      ) {
        return NextResponse.json(
          {
            success: false,

            error:
              "Bright Data no pudo obtener la página de Facebook",

            snapshotId,

            username,

            details:
              progress,
          },
          {
            status: 502,
          }
        );
      }

      // ------------------------------------------------------
      // LISTO
      // ------------------------------------------------------

      const data =
        await descargarSnapshot(
          snapshotId
        );

      const profile =
        encontrarPerfil(
          data,
          username
        );

      if (!profile) {
        console.log(
          "[Facebook] Snapshot listo pero no se encontró perfil."
        );

        return NextResponse.json(
          {
            success: false,

            error:
              "Facebook no devolvió datos de la página",

            username,

            snapshotId,

            raw: data,
          },
          {
            status: 404,
          }
        );
      }

      console.log(
        "[Facebook] PERFIL ENCONTRADO:",
        profile
      );

      // Guardar en cache
      setCache(username, profile);

      return NextResponse.json(
        {
          success: true,

          data: profile,
        },
        {
          status: 200,

          headers: {
            "Cache-Control":
              "no-store",
          },
        }
      );
    }

    // ========================================================
    // 5. CREAR SNAPSHOT NUEVO
    // ========================================================

    const trigger =
      await iniciarSnapshot(
        facebookUrl
      );

    const newSnapshotId =
      trigger?.snapshot_id ??
      trigger?.snapshotId;

    // ========================================================
    // 6. BRIGHT DATA DEVOLVIÓ RESULTADO DIRECTO
    // ========================================================

    if (!newSnapshotId) {
      const profile =
        encontrarPerfil(
          trigger,
          username
        );

      if (profile) {
        // Guardar en cache
        setCache(username, profile);

        return NextResponse.json(
          {
            success: true,

            data: profile,
          },
          {
            status: 200,

            headers: {
              "Cache-Control":
                "no-store",
            },
          }
        );
      }

      return NextResponse.json(
        {
          success: false,

          error:
            "Bright Data no devolvió snapshot_id",

          username,

          raw: trigger,
        },
        {
          status: 502,
        }
      );
    }

    // ========================================================
    // 7. DEVOLVER SNAPSHOT
    // ========================================================

    console.log(
      "[Facebook] Snapshot creado:",
      newSnapshotId
    );

    return NextResponse.json(
      {
        success: true,

        status:
          "processing",

        snapshotId:
          newSnapshotId,

        username,

        externalUrl:
          facebookUrl,

        message:
          "Consulta iniciada",
      },
      {
        status: 200,

        headers: {
          "Cache-Control":
            "no-store",
        },
      }
    );

  } catch (error) {
    console.error(
      "[Facebook] ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        error:
          error instanceof Error
            ? error.message
            : String(error),
      },
      {
        status: 502,
      }
    );
  }
}
