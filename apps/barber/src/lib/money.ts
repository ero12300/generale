/**
 * Gli importi monetari sono SEMPRE espressi in centesimi (interi).
 * Mai usare float per il denaro: 24,50 € => 2450.
 */

export type Cents = number;

export function formatEuro(cents: Cents): string {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

/** Converte input utente tipo "24,50" o "24.50" in centesimi. Ritorna null se non valido. */
export function parseEuroInput(input: string): Cents | null {
  const normalized = input.trim().replace(/\./g, "").replace(",", ".");
  // consenti anche "24.50" diretto
  const simple = input.trim().replace(",", ".");
  const candidate = /^\d+(\.\d{1,2})?$/.test(simple) ? simple : normalized;
  if (!/^\d+(\.\d{1,2})?$/.test(candidate)) return null;
  const value = Math.round(parseFloat(candidate) * 100);
  return Number.isSafeInteger(value) && value >= 0 ? value : null;
}

/** Percentuale su centesimi con arrotondamento commerciale, senza float intermedi pericolosi. */
export function percentOf(cents: Cents, percent: number): Cents {
  return Math.round((cents * percent) / 100);
}
