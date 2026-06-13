const eur = new Intl.NumberFormat("it-IT", {
  style: "currency",
  currency: "EUR",
});

/** Formatta centesimi in euro (es. 1320 -> "13,20 €"). */
export function formatEuro(cents: number): string {
  return eur.format(cents / 100);
}

export function formatPct(value: number, decimals = 1): string {
  return `${value.toFixed(decimals).replace(".", ",")}%`;
}
