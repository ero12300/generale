import type { BookingStatus } from "@/lib/types";
import { cn } from "@/lib/format";

const CONFIG: Record<BookingStatus, { label: string; className: string }> = {
  pending: { label: "In attesa", className: "border-amber-500/40 bg-amber-500/10 text-amber-300" },
  confirmed: { label: "Confermata", className: "border-sky-500/40 bg-sky-500/10 text-sky-300" },
  completed: { label: "Completata", className: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300" },
  cancelled: { label: "Annullata", className: "border-red-500/40 bg-red-500/10 text-red-300" },
  no_show: { label: "No show", className: "border-zinc-500/40 bg-zinc-500/10 text-zinc-300" },
};

export function StatusBadge({ status }: { status: BookingStatus }) {
  const c = CONFIG[status];
  return <span className={cn("badge", c.className)}>{c.label}</span>;
}

export const BOOKING_STATUS_OPTIONS: { value: BookingStatus; label: string }[] = (
  Object.keys(CONFIG) as BookingStatus[]
).map((value) => ({ value, label: CONFIG[value].label }));
