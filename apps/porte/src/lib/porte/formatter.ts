/**
 * Utility per formattare le misure per l'UI e per la scheda tecnica.
 * Internamente tutto è in mm; l'export mostra sia mm sia cm.
 */

import type { Dimensioni, Tipologia } from "./types";

export function mmToCm(mm: number): number {
  return Math.round(mm) / 10;
}

/** Formatta una singola misura come "900 mm (90.0 cm)". */
export function fmtMm(mm: number): string {
  const cm = mmToCm(mm).toFixed(1);
  return `${Math.round(mm)} mm (${cm} cm)`;
}

/** Formatta un rettangolo come "900 × 2150 mm". */
export function fmtDim(d: Dimensioni): string {
  return `${Math.round(d.larghezza)} × ${Math.round(d.altezza)} mm`;
}

/** Etichetta breve tipologia. */
export function labelTipologia(t: Tipologia): string {
  switch (t) {
    case "battente":
      return "Battente";
    case "scorrevole_esterno":
      return "Scorrevole esterno muro";
    case "scorrevole_scomparsa":
      return "Scorrevole a scomparsa";
    case "filo_muro":
      return "Filo muro";
    case "pieghevole":
      return "A libro";
    default: {
      const _exhaustive: never = t;
      return String(_exhaustive);
    }
  }
}
