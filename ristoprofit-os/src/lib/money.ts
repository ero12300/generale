/**
 * Gestione importi monetari in centesimi interi.
 *
 * Regola di prodotto: gli importi NON usano float. Tutto viene rappresentato in
 * centesimi (numeri interi) e arrotondato a un solo punto, così da evitare gli
 * errori di arrotondamento tipici della virgola mobile (es. 0,1 + 0,2 !== 0,3).
 */

export type Cents = number;

/** Converte un importo in euro (numero) nell'intero più vicino in centesimi. */
export function toCents(euro: number): Cents {
  return Math.round(euro * 100);
}

/** Converte centesimi interi in euro (numero) per il calcolo/visualizzazione. */
export function toEuro(cents: Cents): number {
  return cents / 100;
}

/** Arrotonda un valore in centesimi (eventualmente frazionario) all'intero. */
export function roundCents(value: number): Cents {
  return Math.round(value);
}

/** Formatta centesimi interi come valuta italiana, es. 1300 -> "13,00 €". */
export function formatCents(
  cents: Cents | null | undefined,
  maximumFractionDigits = 2,
): string {
  if (cents == null || Number.isNaN(cents)) return "—";
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: maximumFractionDigits,
    maximumFractionDigits,
  }).format(cents / 100);
}

/** Formatta un rapporto (0..1) come percentuale italiana, es. 0.323 -> "32,3%". */
export function formatRatio(
  ratio: number | null | undefined,
  digits = 1,
): string {
  if (ratio == null || Number.isNaN(ratio)) return "—";
  return `${(ratio * 100).toLocaleString("it-IT", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}%`;
}
