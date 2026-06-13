import { TicketStatus, TICKET_STATUS_LABELS, TicketUrgency, TICKET_URGENCY_LABELS } from "@/lib/types";
import clsx from "clsx";

const STATUS_STYLES: Record<TicketStatus, string> = {
  nuovo: "bg-blue-100 text-blue-800",
  in_verifica: "bg-amber-100 text-amber-800",
  richiesta_informazioni: "bg-amber-100 text-amber-800",
  in_attesa_tecnico: "bg-violet-100 text-violet-800",
  preventivo_ricevuto: "bg-violet-100 text-violet-800",
  preventivo_inviato: "bg-cyan-100 text-cyan-800",
  accettato: "bg-tech-soft text-tech",
  programmato: "bg-tech-soft text-tech",
  in_intervento: "bg-tech-soft text-tech",
  in_attesa_ricambio: "bg-orange-100 text-orange-800",
  risolto: "bg-emerald-100 text-emerald-800",
  chiuso: "bg-stone-200 text-stone-700",
  non_coperto_garanzia: "bg-rose-100 text-rose-800",
  contestato: "bg-rose-100 text-rose-800",
  annullato: "bg-stone-200 text-stone-500",
};

export function TicketStatusBadge({ status }: { status: TicketStatus }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        STATUS_STYLES[status]
      )}
    >
      {TICKET_STATUS_LABELS[status]}
    </span>
  );
}

const URGENCY_STYLES: Record<TicketUrgency, string> = {
  bassa: "bg-stone-200 text-stone-700",
  media: "bg-amber-100 text-amber-800",
  alta: "bg-orange-100 text-orange-800",
  blocco_servizio: "bg-rose-100 text-rose-800",
};

export function UrgencyBadge({ urgency }: { urgency: TicketUrgency }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        URGENCY_STYLES[urgency]
      )}
    >
      {TICKET_URGENCY_LABELS[urgency]}
    </span>
  );
}
