import {
  NextRequest,
  NextResponse,
} from "next/server";

import { buscar } from "@/lib/perfiles";

import {
  PLAT_KEYS,
  USUARIO_RE,
  type Plat,
  type Perfil,
} from "@/lib/plataformas";

export const dynamic = "force-dynamic";

interface PerfilConProcessing extends Perfil {
  processing?: boolean;
  snapshotId?: string;
  running_time?: number;
}

// ============================================================
// CACHE EN MEMORIA
// ============================================================

const cache = new Map<
  string,
  {
    t: number;
    d: Perfil;
  }
>();

const TTL = 5 * 60 * 1000;

// ============================================================
// LIMPIAR CACHE VENCIDO
// ============================================================

function limpiarCache() {
  const ahora = Date.now();

  for (const [key, value] of cache.entries()) {
    if (ahora - value.t >= TTL) {
      cache.delete(key);
    }
  }
}

// ============================================================
// RESPUESTA DE PROCESAMIENTO
// ============================================================

function respuestaProcessing(
  plataforma: Plat,
  usuario: string,
  snapshotId?: string,
  runningTime?: number
) {
  return NextResponse.json(
    {
      success: true,

      status: "processing",

      plataforma,

      usuario,

      snapshotId:
        snapshotId ?? null,

      running_time: runningTime,

      message:
        `Consultando ${plataforma}...`,
    },
    {
      status: 200,

      headers: {
        "Cache-Control":
          "no-store, no-cache, must-revalidate",
      },
    }
  );
}

// ============================================================
// GET
//
// Ejemplos:
//
// /api/perfil?plataforma=instagram&usuario=usuario
//
// /api/perfil?plataforma=youtube&usuario=insomnio
//
// /api/perfil?plataforma=facebook&usuario=bucaramarketing
//
// /api/perfil?plataforma=tiktok&usuario=georginagio
//
// Cuando Facebook/TikTok devuelven snapshot:
//
// /api/perfil?plataforma=facebook&usuario=bucaramarketing&snapshot=XXXX
//
// /api/perfil?plataforma=tiktok&usuario=georginagio&snapshot=XXXX
// ============================================================

export async function GET(
  req: NextRequest
) {
  // ==========================================================
  // 1. Parámetros
  // ==========================================================

  const sp =
    req.nextUrl.searchParams;

  const plat =
    sp.get("plataforma") as
      | Plat
      | null;

  const user =
    (
      sp.get("usuario") ?? ""
    )
      .trim()
      .replace(/^@/, "");

  const snapshotId =
    sp.get("snapshot") ||
    undefined;

  // ==========================================================
  // 2. Validar plataforma
  // ==========================================================

  if (
    !plat ||
    !PLAT_KEYS.includes(plat)
  ) {
    console.error(
      "[Perfil] Plataforma inválida:",
      plat
    );

    return NextResponse.json(
      {
        success: false,

        error:
          "plataforma_invalida",
      },
      {
        status: 400,
      }
    );
  }

  // ==========================================================
  // 3. Validar usuario
  // ==========================================================

  if (!user) {
    console.error("[Perfil] Usuario vacío:", user);
    return NextResponse.json({ success: false, error: "usuario_invalido" }, { status: 400 });
  }

  // Para Spotify, Instagram, TikTok, YouTube, Facebook permitir URLs; para otros usar regex estricto
  const esURL = user.includes("instagram.com") || user.includes("tiktok.com") || user.includes("youtube.com") || user.includes("facebook.com") || user.includes("open.spotify.com");
  if (!esURL && !USUARIO_RE.test(user)) {
    console.error("[Perfil] Usuario inválido:", user);
    return NextResponse.json({ success: false, error: "usuario_invalido" }, { status: 400 });
  }

  // ==========================================================
  // 4. Limpiar cache vencido
  // ==========================================================

  limpiarCache();

  // ==========================================================
  // 5. Clave de cache
  // ==========================================================

  // Para Spotify, Instagram, TikTok, YouTube, Facebook extraer ID/usuario de la URL para cache consistente
  let cacheUser = user;
  if (plat === "spotify") {
    const m = user.match(/open\.spotify\.com\/(artist|user|track|album|playlist)\/([a-zA-Z0-9]+)/);
    cacheUser = m ? m[2] : user;
  } else if (plat === "instagram") {
    const m = user.match(/instagram\.com\/@?([^\/\?]+)/i);
    cacheUser = m ? m[1] : user;
  } else if (plat === "tiktok") {
    const m = user.match(/tiktok\.com\/@?([^\/\?]+)/i);
    cacheUser = m ? m[1] : user;
  } else if (plat === "youtube") {
    const m = user.match(/youtube\.com\/@?([^\/\?]+)/i);
    cacheUser = m ? m[1] : user;
  } else if (plat === "facebook") {
    const m = user.match(/facebook\.com\/([^\/\?]+)/i);
    cacheUser = m ? m[1] : user;
  }
  const key = `${plat}:${cacheUser.toLowerCase()}`;

  // ==========================================================
  // 6. CACHE
  //
  // IMPORTANTE:
  //
  // Si existe snapshotId NO usamos el cache.
  //
  // Esto es necesario porque Bright Data puede estar
  // procesando todavía el snapshot.
  // ==========================================================

  if (!snapshotId) {
    const hit =
      cache.get(key);

    if (
      hit &&
      Date.now() - hit.t <
        TTL
    ) {
      console.log(
        "[Perfil] CACHE HIT:",
        key
      );

      return NextResponse.json(
        hit.d,
        {
          status: 200,

          headers: {
            "Cache-Control":
              "no-store",
          },
        }
      );
    }
  }

  // ==========================================================
  // 7. LOG
  // ==========================================================

  console.log(
    "[Perfil] Buscando:",
    {
      plataforma:
        plat,

      usuario:
        user,

      snapshot:
        snapshotId ??
        undefined,
    }
  );

  // ==========================================================
  // 8. BUSCAR PERFIL
  // ==========================================================

  try {
    const d =
      await buscar(
        plat,
        user,
        snapshotId
      );

    // ========================================================
    // 9. FACEBOOK / TIKTOK PROCESANDO
    //
    // No es error.
    //
    // Bright Data puede devolver:
    //
    // {
    //   processing: true,
    //   snapshotId: "sd_..."
    // }
    //
    // En ese caso devolvemos 200.
    // ========================================================

    if (
      d &&
      (d as PerfilConProcessing).processing === true
    ) {
      const currentSnapshot =
        (d as PerfilConProcessing).snapshotId ||
        snapshotId;

      console.log(
        "[Perfil] Procesando:",
        {
          plataforma:
            plat,

          usuario:
            user,

          snapshot:
            currentSnapshot,
        }
      );

      return respuestaProcessing(
        plat,
        user,
        currentSnapshot,
        (d as PerfilConProcessing).running_time
      );
    }

    // ========================================================
    // 10. PERFIL NO EXISTE
    // ========================================================

    if (
      !d ||
      d.existe === false
    ) {
      console.log(
        "[Perfil] Perfil no encontrado:",
        {
          plataforma:
            plat,

          usuario:
            user,
        }
      );

      return NextResponse.json(
        {
          existe: false,
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
    // 11. RESULTADO FINAL
    // ========================================================

    console.log(
      "[Perfil] Resultado:",
      {
        plataforma:
          plat,

        usuario:
          user,

        existe:
          d.existe,

        nombre:
          d.nombre,

        seguidores:
          d.seguidores,

        foto:
          d.foto
            ? "OK"
            : "NO",
      }
    );

    // ========================================================
    // 12. GUARDAR CACHE
    // ========================================================

    cache.set(
      key,
      {
        t:
          Date.now(),

        d,
      }
    );

    // ========================================================
    // 13. RESPUESTA FINAL
    // ========================================================

    return NextResponse.json(
      d,
      {
        status: 200,

        headers: {
          "Cache-Control":
            "no-store",
        },
      }
    );

  } catch (
    error
  ) {

    // ========================================================
    // 14. ERROR
    // ========================================================

    console.error(
      "[Perfil] ERROR:",
      {
        plataforma:
          plat,

        usuario:
          user,

        snapshot:
          snapshotId,

        error:
          error instanceof Error
            ? error.message
            : error,
      }
    );

    // ========================================================
    // 15. Respuesta de error
    // ========================================================

    return NextResponse.json(
      {
        success: false,

        error:
          "no_disponible",

        plataforma:
          plat,

        usuario:
          user,

        details:
          error instanceof Error
            ? error.message
            : String(error),
      },
      {
        status: 502,

        headers: {
          "Cache-Control":
            "no-store",
        },
      }
    );
  }
}
