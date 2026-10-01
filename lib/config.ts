export const CFG = {
  nequi: process.env.NEXT_PUBLIC_NEQUI ?? "3219412929",
  paypal: process.env.NEXT_PUBLIC_PAYPAL_EMAIL ?? "fabricadepeluchesmundodisney@gmail.com",
  wa: process.env.NEXT_PUBLIC_WA ?? "573000000000", // WhatsApp con indicativo, sin +
  trm: Number(process.env.NEXT_PUBLIC_TRM ?? 4000), // COP por 1 USD
  moneda: "COP",
  // Cambia por tus perfiles reales
  redes: {
    instagram: "https://www.instagram.com/",
    facebook: "https://www.facebook.com/",
    tiktok: "https://www.tiktok.com/",
    youtube: "https://www.youtube.com/",
  } as Record<string, string>,
};
