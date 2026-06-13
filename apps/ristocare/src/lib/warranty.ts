import { WarrantyStatus } from "@/lib/types";

const NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1000;

export function warrantyStatus(warrantyEnd: string, now: Date = new Date()): WarrantyStatus {
  const end = new Date(`${warrantyEnd}T23:59:59Z`);
  if (end.getTime() < now.getTime()) return "scaduta";
  if (end.getTime() - now.getTime() < NINETY_DAYS_MS) return "in_scadenza";
  return "attiva";
}

export const WARRANTY_LABELS: Record<WarrantyStatus, string> = {
  attiva: "Garanzia attiva",
  in_scadenza: "Garanzia in scadenza",
  scaduta: "Garanzia scaduta",
};
