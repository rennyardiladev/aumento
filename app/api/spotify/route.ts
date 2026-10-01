import { NextRequest, NextResponse } from 'next/server';

function extractSpotifyUserId(input: string): string | null {
  const urlPattern = /open\.spotify\.com\/user\/([a-zA-Z0-9]+)/;
  const match = input.match(urlPattern);
  if (match) return match[1];
  
  const idPattern = /^[a-zA-Z0-9]{22}$/;
  if (idPattern.test(input.trim())) return input.trim();
  
  return null;
}

async function getSpotifyAccessToken(): Promise<string | null> {
  const clientId = process.env.SPOTIFY_ID;
  const clientSecret = process.env.SPOTIFY_SECRET;
  
  if (!clientId || !clientSecret) return null;
  
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
    },
    body: 'grant_type=client_credentials',
  });
  
  if (!response.ok) return null;
  
  const data = await response.json();
  return data.access_token;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const input = searchParams.get('user');
  
  if (!input) {
    return NextResponse.json({ success: false, error: 'Parámetro "user" requerido (URL o ID de Spotify)' }, { status: 400 });
  }
  
  const userId = extractSpotifyUserId(input);
  if (!userId) {
    return NextResponse.json({ success: false, error: 'Formato inválido. Usa una URL de perfil (open.spotify.com/user/ID) o el ID de 22 caracteres' }, { status: 400 });
  }
  
  const token = await getSpotifyAccessToken();
  if (!token) {
    return NextResponse.json({ success: false, error: 'Error de autenticación con Spotify' }, { status: 500 });
  }
  
  try {
    const response = await fetch(`https://api.spotify.com/v1/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      next: { revalidate: 3600 },
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ success: false, error: 'Usuario no encontrado' }, { status: 404 });
      }
      throw new Error('Error en la API de Spotify');
    }
    
    const data = await response.json();
    
    const result = {
      name: data.display_name || 'Sin nombre',
      id: data.id,
      followers: data.followers?.total || 0,
      profilePic: data.images?.[0]?.url || null,
      uri: data.uri,
      externalUrl: data.external_urls?.spotify,
    };
    
    return NextResponse.json({ success: true, data: result });
    
  } catch (error) {
    console.error('Error fetching Spotify user:', error);
    return NextResponse.json({ success: false, error: 'Error al consultar Spotify' }, { status: 500 });
  }
}