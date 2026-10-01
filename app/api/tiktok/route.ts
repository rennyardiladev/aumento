import { NextRequest, NextResponse } from 'next/server';

const BRIGHTDATA_API_KEY = process.env.BRIGHTDATA_API_KEY;
const DATASET_ID = 'gd_l1villgoiiidt09ci';
const BRIGHTDATA_API = 'https://api.brightdata.com';

function cleanTikTokUsername(input: string): string {
  return input
    .trim()
    .replace(/^https?:\/\/(www\.)?tiktok\.com\/@?/i, '')
    .replace(/^@/, '')
    .split('?')[0]
    .split('/')[0]
    .trim();
}

function extractProfile(data: any): any {
  if (!data) return null;
  
  if (Array.isArray(data)) return data[0];
  if (Array.isArray(data?.data)) return data.data[0];
  if (data?.data && typeof data.data === 'object') return data.data;
  if (data?.profile) return data.profile;
  if (data?.username || data?.unique_id || data?.uniqueId || data?.account_id || data?.nickname) return data;
  
  return null;
}

function normalizeProfile(profile: any, cleanUsername: string) {
  if (!profile) return null;

  if (profile.error) {
    if (profile.error_code === 'dead_page') return null;
    throw new Error(profile.error);
  }

  return {
    username: profile.username ?? profile.unique_id ?? profile.uniqueId ?? profile.account_id ?? cleanUsername,
    displayName: profile.nickname ?? profile.display_name ?? profile.displayName ?? profile.name ?? '',
    followers: profile.followers_count ?? profile.followersCount ?? profile.follower_count ?? profile.followers ?? profile.stats?.followers ?? profile.stats?.followerCount ?? 0,
    following: profile.following_count ?? profile.followingCount ?? profile.follow_count ?? profile.stats?.following ?? profile.stats?.followingCount ?? 0,
    likes: profile.heart_count ?? profile.heartCount ?? profile.likes_count ?? profile.likesCount ?? profile.total_likes ?? profile.stats?.likes ?? profile.stats?.heartCount ?? 0,
    videos: profile.video_count ?? profile.videoCount ?? profile.stats?.videos ?? profile.stats?.videoCount ?? 0,
    profilePic: profile.avatar_url ?? profile.avatarUrl ?? profile.avatar_larger ?? profile.avatarLarge ?? profile.avatar_medium ?? profile.avatarMedium ?? profile.avatar_thumb ?? profile.avatarThumb ?? profile.profile_pic_url_hd ?? profile.profile_pic_url ?? profile.profilePicUrl ?? '',
    bio: profile.signature ?? profile.bio ?? profile.description ?? '',
    verified: Boolean(profile.verified ?? profile.is_verified ?? profile.isVerified ?? false),
    externalUrl: `https://www.tiktok.com/@${cleanUsername}`,
  };
}

async function checkSnapshot(snapshotId: string) {
  const monitorUrl = `${BRIGHTDATA_API}/datasets/v3/snapshot/${encodeURIComponent(snapshotId)}`;
  
  const response = await fetch(monitorUrl, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${BRIGHTDATA_API_KEY}`,
      Accept: 'application/json',
    },
    cache: 'no-store',
  });

  const text = await response.text();
  let data: any;
  try { data = JSON.parse(text); } catch { data = text; }

  if (response.status === 202) {
    return { status: 'processing', data: null, runningTime: data?.running_time ?? data?.elapsed_time ?? 0 };
  }

  if (!response.ok) {
    throw new Error(`Error consultando snapshot: HTTP ${response.status} ${text}`);
  }

  if (data?.error) {
    if (data.error_code === 'dead_page') return { status: 'not_found', data: null };
    throw new Error(data.error);
  }

  const profile = extractProfile(data);
  if (profile) {
    return { status: 'ready', data: profile };
  }

  if (data?.status === 'running' || data?.status === 'pending' || data?.status === 'processing') {
    return { status: 'processing', data: null };
  }

  return { status: 'processing', data: null };
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const username = searchParams.get('user');
    const snapshotId = searchParams.get('snapshot');

    if (!username) {
      return NextResponse.json({ success: false, error: 'Parámetro "user" requerido' }, { status: 400 });
    }

    if (!BRIGHTDATA_API_KEY) {
      return NextResponse.json({ success: false, error: 'API key de Bright Data no configurada' }, { status: 500 });
    }

    const cleanUsername = cleanTikTokUsername(username);
    if (!cleanUsername) {
      return NextResponse.json({ success: false, error: 'Usuario de TikTok inválido' }, { status: 400 });
    }

    const tiktokUrl = `https://www.tiktok.com/@${cleanUsername}`;

    // Si hay snapshot_id, consultar estado
    if (snapshotId) {
      const result = await checkSnapshot(snapshotId);
      
      if (result.status === 'ready' && result.data) {
        return NextResponse.json({
          success: true,
          data: normalizeProfile(result.data, cleanUsername),
        });
      }

      return NextResponse.json({
        success: true,
        status: result.status,
        snapshotId,
        running_time: result.runningTime,
      });
    }

    // Primera petición: enviar a BrightData
    const scrapeUrl = `${BRIGHTDATA_API}/datasets/v3/scrape?dataset_id=${encodeURIComponent(DATASET_ID)}&notify=false&include_errors=true`;

    const response = await fetch(scrapeUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${BRIGHTDATA_API_KEY}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        input: [{ url: tiktokUrl, country: '' }],
        limit_per_input: 1,
      }),
      cache: 'no-store',
    });

    const responseText = await response.text();
    let data: any;
    try { data = JSON.parse(responseText); } catch { data = responseText; }

    if (!response.ok) {
      return NextResponse.json({ success: false, error: `Bright Data HTTP ${response.status}`, details: data }, { status: response.status });
    }

    if (data?.error) {
      if (data.error_code === 'dead_page') {
        return NextResponse.json({ success: false, error: 'Perfil no encontrado', code: 'dead_page' }, { status: 404 });
      }
      return NextResponse.json({ success: false, error: data.error, code: data.error_code }, { status: 502 });
    }

    // Caso 1: Datos directos
    let profile = extractProfile(data);
    if (profile) {
      return NextResponse.json({ success: true, data: normalizeProfile(profile, cleanUsername) });
    }

    // Caso 2: Snapshot ID (async)
    const snapshotIdFromResponse = data?.snapshot_id;
    if (snapshotIdFromResponse) {
      return NextResponse.json({
        success: true,
        status: 'processing',
        snapshotId: snapshotIdFromResponse,
        running_time: 0,
      });
    }

    // Caso 3: Formato inesperado
    return NextResponse.json({
      success: true,
      status: 'processing',
      snapshotId: null,
    });

  } catch (error) {
    console.error('Error TikTok:', error);
    return NextResponse.json({ success: false, error: 'Error interno', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}