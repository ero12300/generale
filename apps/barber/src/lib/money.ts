// Utility monetarie: lavoriamo sempre con interi (centesimi) e formattiamo in EUR.

export function eur(cents: number): string {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

export function eurCompact(cents: number): string {
  const value = cents / 100;
  if (Math.abs(value) >= 1000) {
    return new Intl.NumberFormat("it-IT", {
      style: "currency",
      currency: "EUR",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);
  }
  return eur(cents);
}

export function parseEuroToCents(input: string): number {
  const cleaned = input.replace(/[^\d,.-]/g, "").replace(/\.(?=\d{3}(\D|$))/g, "").replace(",", ".");
  const value = Number.parseFloat(cleaned);
  if (Number.isNaN(value)) return 0;
  return Math.round(value * 100);
}

// Applica uno sconto (percentuale o fisso in centesimi) ritornando l'importo scontato in centesimi.
export function applyDiscount(
  priceCents: number,
  discountType: "percentuale" | "fisso",
  discountValue: number,
): { finalCents: number; discountCents: number } {
  let discountCents: number;
  if (discountType === "percentuale") {
    const pct = Math.max(0, Math.min(100, discountValue));
    discountCents = Math.round((priceCents * pct) / 100);
  } else {
    discountCents = Math.max(0, Math.min(priceCents, Math.round(discountValue)));
  }
  return { finalCents: priceCents - discountCents, discountCents };
}
