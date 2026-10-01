import { NextRequest, NextResponse } from "next/server";
import { buscar } from "@/lib/perfiles";
import type { Plat } from "@/lib/plataformas";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const plataforma = searchParams.get("plataforma") as Plat;
  const usuario = searchParams.get("usuario");
  const snapshotId = searchParams.get("snapshot");

  if (!plataforma || !usuario) {
    return NextResponse.json({ error: "Faltan parámetros" }, { status: 400 });
  }

  try {
    const result = await buscar(plataforma, usuario, snapshotId || undefined);
    return NextResponse.json(result);
  } catch (error) {
    console.error(`[API/perfil] Error en ${plataforma}:`, error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error interno" },
      { status: 500 }
    );
  }
}