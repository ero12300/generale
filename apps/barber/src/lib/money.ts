/** Formatta centesimi in euro (it-IT). Gli importi restano interi fino alla resa. */
export function formatEuro(cents: number): string {
  const sign = cents < 0 ? "-" : "";
  const abs = Math.abs(cents);
  const euros = Math.floor(abs / 100);
  const rest = abs % 100;
  // Separatore migliaia manuale: indipendente dai dati ICU del runtime
  const eurosStr = euros.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${sign}€ ${eurosStr},${rest.toString().padStart(2, "0")}`;
}

/** Applica uno sconto percentuale a un importo in centesimi (arrotonda per difetto). */
export function applyPercentOff(amountCents: number, percentOff: number): number {
  const pct = Math.min(100, Math.max(0, Math.round(percentOff)));
  return Math.floor((amountCents * pct) / 100);
}
