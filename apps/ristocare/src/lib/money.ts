// Importi gestiti come interi in centesimi: nessun float monetario.

export function formatEuroCents(cents: number): string {
  const value = cents / 100;
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

/**
 * Calcola il prezzo cliente partendo dal costo tecnico interno
 * applicando un margine percentuale (in punti base interi, es. 2500 = 25%).
 * Arrotonda per eccesso al centesimo.
 */
export function applyMarginBp(internalCostCents: number, marginBp: number): number {
  if (!Number.isInteger(internalCostCents) || internalCostCents < 0) {
    throw new Error("internalCostCents deve essere un intero >= 0");
  }
  if (!Number.isInteger(marginBp) || marginBp < 0) {
    throw new Error("marginBp deve essere un intero >= 0");
  }
  return internalCostCents + Math.ceil((internalCostCents * marginBp) / 10000);
}

/** Margine assoluto in centesimi tra prezzo cliente e costo interno. */
export function marginCents(customerPriceCents: number, internalCostCents: number): number {
  return customerPriceCents - internalCostCents;
}
