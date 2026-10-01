# aumentodeseguidores.com (Next.js + TypeScript)

## Arrancar
```bash
npm install
cp .env.example .env.local   # rellena YT_KEY, SPOTIFY_ID, SPOTIFY_SECRET y WhatsApp
npm run dev                  # http://localhost:3000
```

## Estructura
- `app/actions/perfil.ts` — server action `consultarPerfil(plataforma, usuario, snapshotId?)` usada por el cliente
- `app/actions/` — consultas a Bright Data (Instagram, TikTok, Facebook) y Spotify
- `lib/perfiles.ts` — consulta de cada red (YouTube y Spotify con API oficial; Instagram, TikTok y Facebook leyendo la página pública)
- `lib/plataformas.ts` — colores, textos y paquetes/precios
- `lib/config.ts` — Nequi, PayPal, WhatsApp, TRM y enlaces a tus redes
- `components/` — Home (flujo completo), Logos, Footer

## Publicar
Sube el proyecto a GitHub, impórtalo en Vercel, añade las variables de `.env.example` y conecta el dominio aumentodeseguidores.com.
