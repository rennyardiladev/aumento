"use server";

import { NextResponse } from "next/server";

const BRIGHTDATA_API_KEY = process.env.BRIGHTDATA_API_KEY;
const DATASET_ID = "gd_l1vikfch901nx3by4";
const BRIGHTDATA_API = "https://api.brightdata.com";

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
  running_time?: number;
}

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

export async function getInstagramProfile(user: string, snapshotId?: string): Promise<InstagramResult> {
  try {
    if (!BRIGHTDATA_API_KEY) {
      return { existe: false, error: "BRIGHTDATA_API_KEY no configurada" };
    }

    const username = cleanIgUsername(user);
    if (!username) {
      return { existe: false, error: "Usuario de Instagram inválido" };
    }

    const igUrl = `https://www.instagram.com/${username}/`;

    if (snapshotId) {
      const result = await checkSnapshot(snapshotId);
      if (result.status === "ready" && result.data) {
        return result.data;
      }
      return { existe: false, processing: true, snapshotId };
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
      return { existe: false, error: `Bright Data HTTP ${response.status}`, processing: false };
    }

    if (data?.error?.error_code === "dead_page") {
      return { existe: false, error: "Perfil no encontrado", processing: false };
    }

    // Datos directos
    let profile = encontrarPerfil(data, username);
    if (profile) {
      return profile;
    }

    // Snapshot async
    const newSnapshotId = data?.snapshot_id ?? data?.snapshotId;
    if (newSnapshotId) {
      return { existe: false, processing: true, snapshotId: newSnapshotId };
    }

    return { existe: false, processing: true, snapshotId: null };

  } catch (error) {
    console.error("[Instagram] ERROR:", error);
    return { existe: false, error: error instanceof Error ? error.message : String(error), processing: false };
  }
}