"use server";

export interface SpotifyResult {
  existe: boolean;
  privada?: boolean;
  seguidores?: number | null;
  nombre?: string;
  foto?: string | null;
  error?: string;
}

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

function meta(html: string, property: string): string | null {
  const re = new RegExp(`<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']+)["']`, "i");
  const m = html.match(re);
  return m?.[1] ?? null;
}

export async function getSpotifyProfile(q: string): Promise<SpotifyResult> {
  const url = q.split("?")[0];
  
  try {
    // Try oEmbed first (no auth needed)
    const r = await fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`, { cache: "no-store" });
    if (r.status === 404) return { existe: false };
    
    let nombre: string | null = null;
    let foto: string | null = null;
    
    if (r.ok) {
      const d = await r.json();
      nombre = d.title ?? null;
      foto = d.thumbnail_url ?? null;
    }
    
    // Fallback: scrape HTML for og tags
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
    
  } catch (error) {
    console.error("[Spotify] ERROR:", error);
    return { existe: false, error: error instanceof Error ? error.message : String(error) };
  }
}