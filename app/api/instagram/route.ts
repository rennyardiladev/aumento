import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

// ============================================================
// CACHE INTELIGENTE
// ============================================================

const CACHE_DIR = path.join(process.cwd(), ".cache");
const CACHE_FILE = path.join(CACHE_DIR, "instagram.json");
const CACHE_TTL = 24 * 60 * 60 * 1000;

interface CacheEntry {
  data: any;
  timestamp: number;
}

function ensureCacheDir() {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }
}

function loadCache(): Record<string, CacheEntry> {
  ensureCacheDir();
  if (!fs.existsSync(CACHE_FILE)) return {};
  try {
    return JSON.parse(fs.readFileSync(CACHE_FILE, "utf-8"));
  } catch {
    return {};
  }
}

function saveCache(cache: Record<string, CacheEntry>) {
  ensureCacheDir();
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
}

function getFromCache(username: string): any | null {
  const cache = loadCache();
  const entry = cache[username.toLowerCase()];
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL) return null;
  console.log("[Instagram] CACHE HIT:", username);
  return entry.data;
}

function setCache(username: string, data: any) {
  const cache = loadCache();
  cache[username.toLowerCase()] = { data, timestamp: Date.now() };
  saveCache(cache);
  console.log("[Instagram] CACHE SET:", username);
}

// ============================================================
// CONFIGURACIÓN BRIGHT DATA
// ============================================================

const BRIGHTDATA_API_KEY = process.env.BRIGHTDATA_API_KEY;
// Dataset ID para Instagram (proporcionado por el usuario)
const DATASET_ID = "gd_l1vikfch901nx3by4";
const BRIGHTDATA_API = "https://api.brightdata.com";

function cleanIgUsername(value: string): string {
  return value
    .trim()
    .replace(/^https?:\/\/(www\.)?instagram\.com\/@?/i, "")
    .replace(/^@/, "")
    .split("?")[0]
    .split("/")[0]
    .trim();
}

async function leerJson(response: Response): Promise<any> {
  const text = await response.text();
  if (!text) return null;
  try { return JSON.parse(text); } catch { return text; }
}

function normalizarPerfil(profile: any, username: string) {
  if (!profile) return null;
  if (profile.error) {
    if (profile.error_code === "dead_page") return null;
    throw new Error(profile.error);
  }
  return {
    existe: true,
    username: profile.username ?? profile.user_name ?? profile.handle ?? username,
    nombre: profile.full_name ?? profile.name ?? profile.display_name ?? username,
    seguidores: profile.follower_count ?? profile.followers_count ?? profile.edge_followed_by?.count ?? profile.followers ?? 0,
    foto: profile.profile_image_link ?? profile.profile_pic_url_hd ?? profile.profile_pic_url ?? profile.hd_profile_pic_url_info?.url ?? profile.hd_profile_pic_url_info ?? profile.profile_photo ?? profile.profile_picture_url ?? profile.profile_picture ?? profile.avatar_url ?? profile.image_url ?? "",
    privada: Boolean(profile.is_private ?? profile.private_account ?? false),
    externalUrl: `https://www.instagram.com/${username}/`,
  };
}

function encontrarPerfil(data: any, username: string) {
  if (!data) return null;
  if (Array.isArray(data)) return normalizarPerfil(data[0], username);
  if (Array.isArray(data?.data)) return normalizarPerfil(data.data[0], username);
  if (data?.data && typeof data.data === "object") return normalizarPerfil(data.data, username);
  if (data?.profile) return normalizarPerfil(data.profile, username);
  if (data?.username || data?.user_name || data?.full_name || data?.follower_count) return normalizarPerfil(data, username);
  return null;
}

async function checkSnapshot(snapshotId: string) {
  const monitorUrl = `${BRIGHTDATA_API}/datasets/v3/progress/${encodeURIComponent(snapshotId)}`;
  const response = await fetch(monitorUrl, {
    method: "GET",
    headers: { Authorization: `Bearer ${BRIGHTDATA_API_KEY}`, Accept: "application/json" },
    cache: "no-store",
  });
  const data = await leerJson(response);
  if (!response.ok) throw new Error(`Progress HTTP ${response.status}`);
  const status = String(data?.status ?? data?.state ?? "").toLowerCase();
  const procesando = ["running", "pending", "processing", "starting", "created", "queued", ""].includes(status);
  if (procesando) return { status: "processing", runningTime: data?.running_time ?? 0 };
  if (["failed", "error", "cancelled"].includes(status)) throw new Error("Bright Data failed");
  const downloadUrl = `${BRIGHTDATA_API}/datasets/v3/snapshot/${encodeURIComponent(snapshotId)}?format=json`;
  const download = await fetch(downloadUrl, {
    headers: { Authorization: `Bearer ${BRIGHTDATA_API_KEY}`, Accept: "application/json" },
    cache: "no-store",
  });
  const downloadData = await leerJson(download);
  const profile = encontrarPerfil(downloadData, "");
  return profile ? { status: "ready", data: profile } : { status: "processing", runningTime: 0 };
}

// ============================================================
// GET
// ============================================================

export async function GET(request: NextRequest) {
  try {
    if (!BRIGHTDATA_API_KEY) {
      return NextResponse.json({ success: false, error: "BRIGHTDATA_API_KEY no configurada" }, { status: 500 });
    }

    const searchParams = request.nextUrl.searchParams;
    const rawUser = searchParams.get("user");
    const snapshotId = searchParams.get("snapshot");

    if (!rawUser) {
      return NextResponse.json({ success: false, error: 'Parámetro "user" requerido' }, { status: 400 });
    }

    const username = cleanIgUsername(rawUser);
    if (!username) {
      return NextResponse.json({ success: false, error: "Usuario de Instagram inválido" }, { status: 400 });
    }

    const igUrl = `https://www.instagram.com/${username}/`;

    if (snapshotId) {
      const result = await checkSnapshot(snapshotId);
      if (result.status === "ready" && result.data) {
        setCache(username, result.data);
        return NextResponse.json({ success: true, data: result.data });
      }
      return NextResponse.json({
        success: true,
        status: result.status,
        snapshotId,
        running_time: result.runningTime,
      });
    }

    // Cache check
    const cached = getFromCache(username);
    if (cached) {
      return NextResponse.json({ success: true, data: cached, cached: true });
    }

    // Trigger scrape
    const scrapeUrl = `${BRIGHTDATA_API}/datasets/v3/scrape?dataset_id=${encodeURIComponent(DATASET_ID)}&notify=false&include_errors=true`;
    const response = await fetch(scrapeUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${BRIGHTDATA_API_KEY}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ input: [{ url: igUrl }], limit_per_input: 1 }),
      cache: "no-store",
    });

    const data = await leerJson(response);

    if (!response.ok) {
      return NextResponse.json({ success: false, error: `Bright Data HTTP ${response.status}`, details: data }, { status: response.status });
    }

    if (data?.error?.error_code === "dead_page") {
      return NextResponse.json({ success: false, error: "Perfil no encontrado", code: "dead_page" }, { status: 404 });
    }

    // Datos directos
    let profile = encontrarPerfil(data, username);
    if (profile) {
      setCache(username, profile);
      return NextResponse.json({ success: true, data: profile });
    }

    // Snapshot async
    const newSnapshotId = data?.snapshot_id ?? data?.snapshotId;
    if (newSnapshotId) {
      return NextResponse.json({
        success: true,
        status: "processing",
        snapshotId: newSnapshotId,
        username,
        externalUrl: igUrl,
        running_time: 0,
      });
    }

    return NextResponse.json({ success: true, status: "processing", snapshotId: null, running_time: 0 });

  } catch (error) {
    console.error("[Instagram] ERROR:", error);
    return NextResponse.json({ success: false, error: "Error interno", details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}