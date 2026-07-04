/** Formatta millimetri come "814 mm (81,4 cm)". */
export function mm(valore: number): string {
  return `${valore} mm`;
}

export function mmConCm(valore: number): string {
  const cm = (valore / 10).toLocaleString("it-IT", { maximumFractionDigits: 1 });
  return `${valore} mm (${cm} cm)`;
}

export function dimensioni(larghezza: number, altezza: number): string {
  return `${larghezza} × ${altezza} mm`;
}
