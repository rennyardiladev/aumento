import type {
  Plat,
  Perfil,
} from "./plataformas";

// ============================================================
// CONFIGURACIÓN
// ============================================================

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
  "AppleWebKit/537.36 (KHTML, like Gecko) " +
  "Chrome/124.0 Safari/537.36";

// ============================================================
// INSTAGRAM / BRIGHT DATA (ASYNC)
// ============================================================

interface InstagramResult extends Perfil {
  processing?: boolean;
  snapshotId?: string;
  error?: string;
}

async function instagram(
  user: string,
  snapshotId?: string
): Promise<InstagramResult> {
  if (!BRIGHTDATA_API_KEY) {
    throw new Error("BRIGHTDATA_API_KEY no configurada");
  }

  const cleanUsername = user
    .trim()
    .replace(/^@/, "")
    .replace(/^https?:\/\/(www\.)?instagram\.com\/@?/i, "")
    .split("?")[0]
    .split("/")[0]
    .trim();

  if (!cleanUsername) {
    return { existe: false, error: "Usuario inválido" };
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const apiUrl = snapshotId
    ? `${baseUrl}/api/instagram?user=${encodeURIComponent(cleanUsername)}&snapshot=${encodeURIComponent(snapshotId)}`
    : `${baseUrl}/api/instagram?user=${encodeURIComponent(cleanUsername)}`;

  console.log("[Instagram] Consultando:", apiUrl);

  const response = await fetch(apiUrl, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || `Instagram API HTTP ${response.status}`);
  }

  const data = await response.json();

  // Si está procesando
  if (data.status === "processing") {
    console.log("[Instagram] Snapshot procesando:", data.snapshotId);
    return {
      existe: false,
      processing: true,
      snapshotId: data.snapshotId,
    };
  }

  // Si hay error
  if (!data.success) {
    if (data.code === "dead_page") return { existe: false };
    throw new Error(data.error || "Error en Instagram API");
  }

  // Datos listos
  const profile = data.data;
  return {
    existe: true,
    privada: profile.privada ?? false,
    seguidores: profile.seguidores ?? null,
    nombre: profile.nombre ?? profile.username ?? cleanUsername,
    foto: profile.foto ?? null,
  };
}

// ============================================================
// TIKTOK / BRIGHT DATA
// ============================================================

const BRIGHTDATA_API_KEY =
  process.env.BRIGHTDATA_API_KEY;

interface TikTokResult
  extends Perfil {
  processing?: boolean;
  snapshotId?: string;
  error?: string;
}

async function tiktok(
  user: string,
  snapshotId?: string
): Promise<TikTokResult> {
  if (!BRIGHTDATA_API_KEY) {
    throw new Error(
      "BRIGHTDATA_API_KEY no configurada"
    );
  }

  const cleanUsername = user
    .trim()
    .replace(/^@/, "")
    .replace(
      /^https?:\/\/(www\.)?tiktok\.com\/@?/i,
      ""
    )
    .split("?")[0]
    .split("/")[0]
    .trim();

  if (!cleanUsername) {
    return {
      existe: false,
      error: "Usuario inválido",
    };
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000";

  const apiUrl = snapshotId
    ? `${baseUrl}/api/tiktok?user=${encodeURIComponent(
        cleanUsername
      )}&snapshot=${encodeURIComponent(
        snapshotId
      )}`
    : `${baseUrl}/api/tiktok?user=${encodeURIComponent(
        cleanUsername
      )}`;

  console.log(
    "[TikTok] Consultando:",
    apiUrl
  );

  const response =
    await fetch(apiUrl, {
      method: "GET",

      headers: {
        Accept:
          "application/json",
      },

      cache: "no-store",
    });

  const text =
    await response.text();

  let data: any;

  try {
    data =
      JSON.parse(text);
  } catch {
    throw new Error(
      "Respuesta inválida de API TikTok"
    );
  }

  console.log(
    "[TikTok] HTTP:",
    response.status
  );

  // ==========================================================
  // SNAPSHOT PROCESANDO
  // ==========================================================

  if (
    data?.status ===
    "processing"
  ) {
    console.log(
      "[TikTok] Snapshot procesando:",
      data.snapshotId
    );

    return {
      existe: false,

      processing: true,

      snapshotId:
        data.snapshotId,
    };
  }

  // ==========================================================
  // ERROR HTTP
  // ==========================================================

  if (!response.ok) {
    throw new Error(
      data?.error ||
        `TikTok API HTTP ${response.status}`
    );
  }

  // ==========================================================
  // PERFIL NO ENCONTRADO
  // ==========================================================

  if (
    data?.success === false
  ) {
    if (
      data?.code ===
      "dead_page"
    ) {
      return {
        existe: false,
      };
    }

    return {
      existe: false,

      error:
        data?.error ||
        "Perfil de TikTok no encontrado",
    };
  }

  // ==========================================================
  // DATOS
  // ==========================================================

  const profile =
    data?.data;

  if (!profile) {
    return {
      existe: false,
    };
  }

  return {
    existe: true,

    privada: false,

    seguidores:
      profile.followers ??
      null,

    nombre:
      profile.displayName ||
      profile.username ||
      cleanUsername,

    foto:
      profile.profilePic ||
      null,
  };
}

// ============================================================
// YOUTUBE
// ============================================================

async function youtube(
  user: string,
  _snapshotId?: string
): Promise<Perfil> {
  const key = process.env.YT_KEY;

  if (!key) {
    throw new Error("YT_KEY no configurada");
  }

  const cleanUser = user
    .trim()
    .replace(/^@/, "")
    .replace(/^https?:\/\/(www\.)?youtube\.com\/@?/i, "")
    .split("?")[0]
    .split("/")[0]
    .trim();

  if (!cleanUser) {
    return { existe: false };
  }

  const ytKey: string = key; // TypeScript narrowing

  // ==========================================================
  // OBTENER CANAL POR ID
  // ==========================================================

  async function obtenerCanal(
    channelId: string
  ): Promise<Perfil | null> {
    const url =
      "https://www.googleapis.com/youtube/v3/channels" +
      `?part=snippet,statistics` +
      `&id=${encodeURIComponent(channelId)}` +
      `&key=${encodeURIComponent(ytKey)}`;

    const r =
      await fetch(url, {
        cache: "no-store",
      });

    const text =
      await r.text();

    if (!r.ok) {
      console.error(
        "[YouTube] channels error:",
        r.status,
        text
      );

      throw new Error(
        `YouTube HTTP ${r.status}`
      );
    }

    let data: any;

    try {
      data =
        JSON.parse(text);
    } catch {
      throw new Error(
        "Respuesta JSON inválida de YouTube"
      );
    }

    const c =
      data?.items?.[0];

    if (!c) {
      return null;
    }

    const snippet =
      c.snippet ?? {};

    const statistics =
      c.statistics ?? {};

    const foto =
      snippet.thumbnails?.high?.url ||
      snippet.thumbnails?.medium?.url ||
      snippet.thumbnails?.default?.url ||
      null;

    const seguidores =
      statistics.hiddenSubscriberCount
        ? null
        : statistics.subscriberCount != null
          ? Number(
              statistics.subscriberCount
            )
          : null;

    const nombre =
      snippet.title ||
      cleanUser;

    const username =
      snippet.customUrl
        ?.replace(/^@/, "") ||
      cleanUser;

    console.log(
      "[YouTube] Canal encontrado:",
      {
        id: c.id,
        username,
        nombre,
        seguidores,
        foto,
      }
    );

    return {
      existe: true,

      privada: false,

      seguidores,

      nombre,

      foto,
    };
  }

  // ==========================================================
  // 1. CHANNEL ID
  // ==========================================================

  if (
    /^UC[\w-]{22}$/.test(
      cleanUser
    )
  ) {
    const canal =
      await obtenerCanal(
        cleanUser
      );

    return (
      canal ?? {
        existe: false,
      }
    );
  }

  // ==========================================================
  // 2. HANDLE
  // ==========================================================

  try {
    const handleUrl =
      "https://www.googleapis.com/youtube/v3/channels" +
      `?part=snippet,statistics` +
      `&forHandle=@${encodeURIComponent(
        cleanUser
      )}` +
      `&key=${encodeURIComponent(
        key
      )}`;

    const r =
      await fetch(
        handleUrl,
        {
          cache: "no-store",
        }
      );

    const text =
      await r.text();

    console.log(
      "[YouTube] Handle HTTP:",
      r.status
    );

    if (r.ok) {
      let data: any;

      try {
        data =
          JSON.parse(text);
      } catch {
        data = null;
      }

      const c =
        data?.items?.[0];

      if (c?.id) {
        const canal =
          await obtenerCanal(
            c.id
          );

        if (canal) {
          return canal;
        }
      }
    }
  } catch (error) {
    console.error(
      "[YouTube] Error handle:",
      error
    );
  }

  // ==========================================================
  // 3. SEARCH
  // ==========================================================

  console.log(
    "[YouTube] Handle no encontrado."
  );

  const searchUrl =
    "https://www.googleapis.com/youtube/v3/search" +
    `?part=snippet` +
    `&q=${encodeURIComponent(
      cleanUser
    )}` +
    `&type=channel` +
    `&maxResults=5` +
    `&key=${encodeURIComponent(
      key
    )}`;

  const searchResponse =
    await fetch(
      searchUrl,
      {
        cache: "no-store",
      }
    );

  const searchText =
    await searchResponse.text();

  console.log(
    "[YouTube] Search HTTP:",
    searchResponse.status
  );

  if (!searchResponse.ok) {
    console.error(
      "[YouTube] Search error:",
      searchText
    );

    throw new Error(
      `YouTube Search HTTP ${searchResponse.status}`
    );
  }

  let searchData: any;

  try {
    searchData =
      JSON.parse(
        searchText
      );
  } catch {
    throw new Error(
      "Respuesta JSON inválida de búsqueda YouTube"
    );
  }

  const resultados =
    searchData?.items ?? [];

  if (!resultados.length) {
    return {
      existe: false,
    };
  }

  const normalized =
    cleanUser.toLowerCase();

  const exacto =
    resultados.find(
      (item: any) => {
        const title =
          item.snippet?.title
            ?.toLowerCase()
            .trim();

        return (
          title === normalized
        );
      }
    );

  const seleccionado =
    exacto ||
    resultados[0];

  const channelId =
    seleccionado
      ?.id?.channelId;

  if (!channelId) {
    return {
      existe: false,
    };
  }

  const canal =
    await obtenerCanal(
      channelId
    );

  return (
    canal ?? {
      existe: false,
    }
  );
}

// ============================================================
// SPOTIFY (oEmbed - sin credenciales)
// ============================================================

function meta(html: string, property: string): string | null {
  const re = new RegExp(`<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']+)["']`, "i");
  const m = html.match(re);
  return m?.[1] ?? null;
}

async function spotify(
  q: string,
  _snapshotId?: string
): Promise<Perfil> {
  const url = q.split("?")[0];
  const r = await fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`, { cache: "no-store" });
  if (r.status === 404) return { existe: false };
  let nombre: string | null = null;
  let foto: string | null = null;
  if (r.ok) {
    const d = await r.json();
    nombre = d.title ?? null;
    foto = d.thumbnail_url ?? null;
  }
  if (!nombre || !foto) {
    const p = await fetch(url, { headers: { "User-Agent": UA, "Accept-Language": "es" }, cache: "no-store" });
    if (p.status === 404) return { existe: false };
    if (p.ok) {
      const html = await p.text();
      foto ??= meta(html, "og:image");
      nombre ??= meta(html, "og:title");
    }
  }
  if (!nombre) throw new Error("spotify");
  return { existe: true, privada: false, seguidores: null, nombre, foto };
}

// ============================================================
// FACEBOOK / BRIGHT DATA
// ============================================================

interface FacebookResult
  extends Perfil {
  processing?: boolean;
  snapshotId?: string;
  error?: string;
}

async function facebook(
  user: string,
  snapshotId?: string
): Promise<FacebookResult> {
  const cleanUsername =
    user
      .trim()
      .replace(/^@/, "")
      .replace(
        /^https?:\/\/(www\.)?facebook\.com\/@?/i,
        ""
      )
      .split("?")[0]
      .split("/")[0]
      .trim();

  if (!cleanUsername) {
    return {
      existe: false,
      error: "Usuario inválido",
    };
  }

  // ==========================================================
  // API INTERNA
  // ==========================================================

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000";

  const apiUrl =
    snapshotId
      ? `${baseUrl}/api/facebook?user=${encodeURIComponent(
          cleanUsername
        )}&snapshot=${encodeURIComponent(
          snapshotId
        )}`
      : `${baseUrl}/api/facebook?user=${encodeURIComponent(
          cleanUsername
        )}`;

  console.log(
    "[Facebook] Consultando:",
    apiUrl
  );

  // ==========================================================
  // PETICIÓN
  // ==========================================================

  const response =
    await fetch(apiUrl, {
      method: "GET",

      headers: {
        Accept:
          "application/json",
      },

      cache: "no-store",
    });

  const text =
    await response.text();

  let data: any;

  try {
    data =
      JSON.parse(text);
  } catch {
    throw new Error(
      "Respuesta inválida de API Facebook"
    );
  }

  console.log(
    "[Facebook] HTTP:",
    response.status
  );

  console.log(
    "[Facebook] Respuesta:",
    data
  );

  // ==========================================================
  // SNAPSHOT PROCESANDO
  // ==========================================================

  if (
    data?.status ===
    "processing"
  ) {
    console.log(
      "[Facebook] Snapshot procesando:",
      data.snapshotId
    );

    return {
      existe: false,

      processing: true,

      snapshotId:
        data.snapshotId,
    };
  }

  // ==========================================================
  // ERROR HTTP
  // ==========================================================

  if (!response.ok) {
    throw new Error(
      data?.error ||
        `Facebook API HTTP ${response.status}`
    );
  }

  // ==========================================================
  // PERFIL NO ENCONTRADO
  // ==========================================================

  if (
    data?.success === false
  ) {
    if (
      data?.code ===
      "dead_page"
    ) {
      return {
        existe: false,
      };
    }

    return {
      existe: false,

      error:
        data?.error ||
        "Perfil de Facebook no encontrado",
    };
  }

  // ==========================================================
  // DATOS DEL PERFIL
  // ==========================================================

  const profile =
    data?.data;

  if (!profile) {
    return {
      existe: false,
    };
  }

  console.log(
    "[Facebook] Perfil encontrado:",
    {
      username:
        profile.username,

      nombre:
        profile.nombre,

      seguidores:
        profile.seguidores,

      foto:
        profile.foto,
    }
  );

  return {
    existe:
      profile.existe !== false,

    privada: false,

    seguidores:
      profile.seguidores ??
      null,

    nombre:
      profile.nombre ||
      profile.username ||
      cleanUsername,

    foto:
      profile.foto ||
      null,
  };
}

// ============================================================
// TIPO BUSCADOR
// ============================================================

type Buscador = (
  usuario: string,
  snapshotId?: string
) => Promise<Perfil>;

// ============================================================
// BUSCADORES
// ============================================================

const BUSCADORES: Record<
  Plat,
  Buscador
> = {
  instagram,
  tiktok,
  youtube,
  spotify,
  facebook,
};

// ============================================================
// FUNCIÓN PÚBLICA
// ============================================================

export const buscar = (
  plataforma: Plat,
  usuario: string,
  snapshotId?: string
): Promise<Perfil> => {
  const buscador =
    BUSCADORES[plataforma];

  if (!buscador) {
    throw new Error(
      `Plataforma no soportada: ${plataforma}`
    );
  }

  return buscador(
    usuario,
    snapshotId
  );
};
