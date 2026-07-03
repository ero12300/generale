/** Utility per importi monetari in centesimi (interi). */

export function formatEuro(cents: number): string {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

/** Converte una stringa "12,50" o "12.50" in centesimi. Lancia se non valida. */
export function parseEuroToCents(input: string): number {
  const normalized = input.trim().replace(",", ".");
  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) {
    throw new Error(`Importo non valido: ${input}`);
  }
  return Math.round(Number(normalized) * 100);
}

/** Applica uno sconto (percentuale o fisso) a un importo, senza mai andare sotto zero. */
export function applyDiscount(
  amountCents: number,
  opts: { discountPercent?: number; discountCents?: number }
): { finalCents: number; discountCents: number } {
  let discount = 0;
  if (opts.discountPercent && opts.discountPercent > 0) {
    discount += Math.round((amountCents * Math.min(opts.discountPercent, 100)) / 100);
  }
  if (opts.discountCents && opts.discountCents > 0) {
    discount += opts.discountCents;
  }
  discount = Math.min(discount, amountCents);
  return { finalCents: amountCents - discount, discountCents: discount };
}
