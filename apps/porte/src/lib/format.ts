/** Conversione e formattazione misure. Interno in mm, display in mm/cm. */

export function mmToCm(mm: number): number {
  return Math.round((mm / 10) * 10) / 10;
}

export function formatCm(mm: number): string {
  const cm = mmToCm(mm);
  const s = Number.isInteger(cm) ? String(cm) : cm.toFixed(1).replace(".", ",");
  return `${s} cm`;
}

export function formatMm(mm: number): string {
  return `${Math.round(mm)} mm`;
}

export function formatDim(w: number, h: number): string {
  return `${Math.round(w)} × ${Math.round(h)} mm`;
}

export function formatDimCm(w: number, h: number): string {
  return `${formatCm(w).replace(" cm", "")} × ${formatCm(h)}`;
}
