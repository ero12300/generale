import type { FormaOblo, TipoApertura, VersoApertura } from "./types";

export const LABEL_TIPO_APERTURA: Record<TipoApertura, string> = {
  battente: "Battente",
  scorrevole_esterno: "Scorrevole esterno muro",
  scorrevole_scomparsa: "Scorrevole a scomparsa",
};

export const LABEL_VERSO: Record<VersoApertura, string> = {
  tiro: "A tirare",
  spinta: "A spingere",
};

export const LABEL_OBLO: Record<FormaOblo, string> = {
  nessuno: "Nessuno",
  ovale: "Ovale",
  tondo: "Tondo",
  rettangolare: "Rettangolare",
};

/** Preset di foro muro comodi da tastiera/touch (larghezza × altezza in mm). */
export const PRESET_FORO: { etichetta: string; larghezzaMm: number; altezzaMm: number }[] = [
  { etichetta: "70 × 210", larghezzaMm: 800, altezzaMm: 2150 },
  { etichetta: "80 × 210", larghezzaMm: 900, altezzaMm: 2150 },
  { etichetta: "90 × 210", larghezzaMm: 1000, altezzaMm: 2150 },
];

/** Spessori muro tipici (mm). */
export const PRESET_SPESSORE_MURO = [85, 105, 110, 125, 150];

export function formattaCm(mm: number): string {
  return (mm / 10).toLocaleString("it-IT", { maximumFractionDigits: 1 });
}
