export function mm(value: number): string {
  return `${Math.round(value)} mm`;
}

export function cm(value: number): string {
  return `${(value / 10).toLocaleString("it-IT", { maximumFractionDigits: 1 })} cm`;
}

export function dimLabel(larghezza: number, altezza: number): string {
  return `${Math.round(larghezza)} × ${Math.round(altezza)} mm`;
}

export function nowIso(): string {
  return new Date().toISOString();
}

export function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("it-IT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export function uid(): string {
  return `p_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}
