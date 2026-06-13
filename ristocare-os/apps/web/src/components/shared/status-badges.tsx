import type { TicketStatus, TicketUrgency } from "@ristocare/types";
import { TICKET_STATUS_LABELS } from "@ristocare/types";
import { Badge } from "@/components/ui/badge";

export function TicketStatusBadge({ status }: { status: TicketStatus }) {
  const variant =
    status === "closed" || status === "resolved"
      ? "success"
      : status === "new"
        ? "info"
        : status === "cancelled" || status === "not_covered"
          ? "danger"
          : status === "quote_sent" || status === "info_requested"
            ? "warning"
            : "default";
  return <Badge variant={variant}>{TICKET_STATUS_LABELS[status]}</Badge>;
}

export function UrgencyBadge({ urgency }: { urgency: TicketUrgency }) {
  const labels = { low: "Bassa", medium: "Media", high: "Alta", critical: "Critica" };
  const variant =
    urgency === "critical" || urgency === "high"
      ? "danger"
      : urgency === "medium"
        ? "warning"
        : "default";
  return <Badge variant={variant}>{labels[urgency]}</Badge>;
}

export function WarrantyBadge({ status }: { status: string }) {
  const labels: Record<string, string> = {
    active: "In garanzia",
    expiring: "In scadenza",
    expired: "Scaduta",
    unknown: "Da verificare",
  };
  const variant =
    status === "active" ? "success" : status === "expiring" ? "warning" : status === "expired" ? "danger" : "default";
  return <Badge variant={variant}>{labels[status] ?? status}</Badge>;
}
