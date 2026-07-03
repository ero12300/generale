import type { BookingStatus, PaymentMethod } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

const BOOKING_LABELS: Record<BookingStatus, { label: string; variant: "default" | "success" | "warning" | "danger" | "neutral" | "info" }> = {
  pending: { label: "In attesa", variant: "warning" },
  confirmed: { label: "Confermata", variant: "info" },
  completed: { label: "Completata", variant: "success" },
  cancelled: { label: "Annullata", variant: "neutral" },
  no_show: { label: "No show", variant: "danger" },
};

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  const s = BOOKING_LABELS[status];
  return <Badge variant={s.variant}>{s.label}</Badge>;
}

const METHOD_LABELS: Record<PaymentMethod, string> = {
  cash: "Contanti",
  card: "Carta",
  transfer: "Bonifico",
  other: "Altro",
};

export function methodLabel(m: PaymentMethod): string {
  return METHOD_LABELS[m];
}
