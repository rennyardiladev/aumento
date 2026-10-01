"use server";

import { buscar } from "@/lib/perfiles";
import type { Plat, Perfil } from "@/lib/plataformas";

export interface PerfilActionResult extends Perfil {
  processing?: boolean;
  snapshotId?: string;
  running_time?: number;
  error?: string;
}

export async function consultarPerfil(
  plataforma: Plat,
  usuario: string,
  snapshotId?: string
): Promise<PerfilActionResult> {
  try {
    const result = await buscar(plataforma, usuario, snapshotId);
    return { ...result };
  } catch (error) {
    console.error(`[perfil] Error en ${plataforma}:`, error);
    return {
      existe: false,
      error: error instanceof Error ? error.message : "Error interno",
    };
  }
}