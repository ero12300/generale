/**
 * Gestione importi monetari in centesimi interi.
 * Regola di progetto: mai usare float per il denaro.
 * Tutti gli importi sono salvati come numeri interi di centesimi (es. 1500 = 15,00 €).
 */

export type Cents = number;

/** Converte un valore in euro (numero o stringa "12,50") in centesimi interi. */
export function eurosToCents(value: number | string): Cents {
  if (typeof value === "number") {
    return Math.round(value * 100);
  }
  const normalized = value.trim().replace(/\./g, "").replace(",", ".");
  const parsed = Number(normalized);
  if (Number.isNaN(parsed)) return 0;
  return Math.round(parsed * 100);
}

/** Somma sicura di centesimi interi. */
export function sumCents(values: Cents[]): Cents {
  return values.reduce((acc, v) => acc + Math.round(v), 0);
}

/** Applica uno sconto percentuale (0-100) a un importo in centesimi. */
export function applyPercentDiscount(amount: Cents, percent: number): Cents {
  const clamped = Math.max(0, Math.min(100, percent));
  return Math.round(amount * (1 - clamped / 100));
}

/** Applica uno sconto fisso in centesimi, senza andare sotto zero. */
export function applyFixedDiscount(amount: Cents, discount: Cents): Cents {
  return Math.max(0, amount - Math.round(discount));
}

/** Formatta centesimi come valuta EUR italiana. */
export function formatCents(
  amount: Cents | null | undefined,
  opts: { withDecimals?: boolean } = {}
): string {
  if (amount == null) return "—";
  const { withDecimals = true } = opts;
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: withDecimals ? 2 : 0,
    maximumFractionDigits: withDecimals ? 2 : 0,
  }).format(amount / 100);
}
