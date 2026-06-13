export type EquipmentCategory =
  | "frigo"
  | "freezer"
  | "abbattitore"
  | "lavastoviglie"
  | "forno"
  | "friggitrice"
  | "vetrina_gelato"
  | "vetrina_refrigerata"
  | "banco_bar"
  | "cappa"
  | "macchina_caffe"
  | "macinacaffe"
  | "addolcitore"
  | "impastatrice"
  | "affettatrice"
  | "climatizzatore"
  | "altro";

export const EQUIPMENT_CATEGORY_LABELS: Record<EquipmentCategory, string> = {
  frigo: "Frigo",
  freezer: "Freezer",
  abbattitore: "Abbattitore",
  lavastoviglie: "Lavastoviglie",
  forno: "Forno",
  friggitrice: "Friggitrice",
  vetrina_gelato: "Vetrina gelato",
  vetrina_refrigerata: "Vetrina refrigerata",
  banco_bar: "Banco bar",
  cappa: "Cappa",
  macchina_caffe: "Macchina caffè",
  macinacaffe: "Macinacaffè",
  addolcitore: "Addolcitore",
  impastatrice: "Impastatrice",
  affettatrice: "Affettatrice",
  climatizzatore: "Climatizzatore",
  altro: "Altro",
};

export type TicketStatus =
  | "nuovo"
  | "in_verifica"
  | "richiesta_informazioni"
  | "in_attesa_tecnico"
  | "preventivo_ricevuto"
  | "preventivo_inviato"
  | "accettato"
  | "programmato"
  | "in_intervento"
  | "in_attesa_ricambio"
  | "risolto"
  | "chiuso"
  | "non_coperto_garanzia"
  | "contestato"
  | "annullato";

export const TICKET_STATUS_LABELS: Record<TicketStatus, string> = {
  nuovo: "Nuovo",
  in_verifica: "In verifica",
  richiesta_informazioni: "Richiesta informazioni",
  in_attesa_tecnico: "In attesa tecnico",
  preventivo_ricevuto: "Preventivo ricevuto",
  preventivo_inviato: "Preventivo inviato al cliente",
  accettato: "Accettato",
  programmato: "Programmato",
  in_intervento: "In intervento",
  in_attesa_ricambio: "In attesa ricambio",
  risolto: "Risolto",
  chiuso: "Chiuso",
  non_coperto_garanzia: "Non coperto da garanzia",
  contestato: "Contestato",
  annullato: "Annullato",
};

export type TicketUrgency = "bassa" | "media" | "alta" | "blocco_servizio";

export const TICKET_URGENCY_LABELS: Record<TicketUrgency, string> = {
  bassa: "Bassa",
  media: "Media",
  alta: "Alta",
  blocco_servizio: "Blocca il servizio",
};

export type PlanId = "start" | "pro" | "premium" | "enterprise";

export interface Organization {
  id: string;
  name: string;
  city: string;
  province: string;
  plan: PlanId;
  createdAt: string;
}

export interface Location {
  id: string;
  organizationId: string;
  name: string;
  address: string;
  city: string;
}

export type WarrantyStatus = "attiva" | "in_scadenza" | "scaduta";

export interface Equipment {
  id: string;
  organizationId: string;
  locationId: string;
  name: string;
  category: EquipmentCategory;
  brand: string;
  model: string;
  serialNumber: string;
  supplier: string;
  purchaseDate: string;
  warrantyEnd: string;
  area: string;
  qrToken: string;
  notes?: string;
}

export interface EquipmentDocument {
  id: string;
  equipmentId: string;
  documentType: "manuale" | "fattura" | "certificato" | "foto_etichetta" | "altro";
  fileName: string;
}

export interface Ticket {
  id: string;
  organizationId: string;
  equipmentId: string;
  title: string;
  description: string;
  urgency: TicketUrgency;
  status: TicketStatus;
  machineDown: boolean;
  openedBy: string;
  createdAt: string;
  internalNotes?: string;
  assignedTechnicianId?: string;
}

export interface Technician {
  id: string;
  name: string;
  companyName: string;
  phone: string;
  categories: EquipmentCategory[];
  city: string;
  ratingInternal: number; // 1-5, visibile solo a RistoCare
  active: boolean;
}

export interface Quote {
  id: string;
  ticketId: string;
  internalCostCents: number;
  customerPriceCents: number;
  status: "bozza" | "inviato" | "accettato" | "rifiutato";
  validUntil: string;
  createdAt: string;
}

export interface Referral {
  id: string;
  partnerName: string;
  partnerType: string;
  referredCompany: string;
  referredContact: string;
  city: string;
  status: "nuovo" | "contattato" | "convertito" | "scartato";
  planSold?: PlanId;
  rewardAmountCents?: number;
  createdAt: string;
}
