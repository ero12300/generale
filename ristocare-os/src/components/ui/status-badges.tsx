import { Badge } from "@/components/ui/badge";
import {
  EQUIPMENT_STATUS_LABELS,
  TICKET_STATUS_LABELS,
  URGENCY_LABELS,
  WARRANTY_STATUS_LABELS,
} from "@/lib/labels";
import type {
  EquipmentStatus,
  TicketStatus,
  TicketUrgency,
  WarrantyStatus,
} from "@/lib/types";

type Tone = "neutral" | "green" | "gold" | "red" | "amber" | "blue";

const TICKET_TONE: Record<TicketStatus, Tone> = {
  nuovo: "blue",
  in_verifica: "amber",
  richiesta_informazioni: "amber",
  in_attesa_tecnico: "amber",
  preventivo_ricevuto: "gold",
  preventivo_inviato: "gold",
  accettato: "green",
  programmato: "blue",
  in_intervento: "blue",
  in_attesa_ricambio: "amber",
  risolto: "green",
  chiuso: "neutral",
  non_coperto_garanzia: "red",
  contestato: "red",
  annullato: "neutral",
};

const WARRANTY_TONE: Record<WarrantyStatus, Tone> = {
  attiva: "green",
  in_scadenza: "amber",
  scaduta: "red",
};

const EQUIPMENT_TONE: Record<EquipmentStatus, Tone> = {
  operativa: "green",
  in_assistenza: "amber",
  ferma: "red",
  dismessa: "neutral",
};

const URGENCY_TONE: Record<TicketUrgency, Tone> = {
  bassa: "neutral",
  media: "blue",
  alta: "amber",
  bloccante: "red",
};

export function TicketStatusBadge({ status }: { status: TicketStatus }) {
  return <Badge tone={TICKET_TONE[status]}>{TICKET_STATUS_LABELS[status]}</Badge>;
}

export function WarrantyBadge({ status }: { status: WarrantyStatus }) {
  return <Badge tone={WARRANTY_TONE[status]}>{WARRANTY_STATUS_LABELS[status]}</Badge>;
}

export function EquipmentStatusBadge({ status }: { status: EquipmentStatus }) {
  return <Badge tone={EQUIPMENT_TONE[status]}>{EQUIPMENT_STATUS_LABELS[status]}</Badge>;
}

export function UrgencyBadge({ urgency }: { urgency: TicketUrgency }) {
  return <Badge tone={URGENCY_TONE[urgency]}>Urgenza: {URGENCY_LABELS[urgency]}</Badge>;
}
