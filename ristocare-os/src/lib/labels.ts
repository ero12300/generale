import type {
  EquipmentCategory,
  EquipmentStatus,
  TicketStatus,
  TicketUrgency,
  WarrantyStatus,
  DocumentType,
} from "@/lib/types";

export const CATEGORY_LABELS: Record<EquipmentCategory, string> = {
  frigo: "Frigo",
  freezer: "Freezer",
  abbattitore: "Abbattitore",
  lavastoviglie: "Lavastoviglie",
  forno: "Forno",
  friggitrice: "Friggitrice",
  piano_cottura: "Piano cottura",
  vetrina_gelato: "Vetrina gelato",
  vetrina_refrigerata: "Vetrina refrigerata",
  banco_bar: "Banco bar",
  retrobanco: "Retrobanco",
  cappa: "Cappa",
  aspirazione: "Aspirazione",
  macchina_caffe: "Macchina caffè",
  macinacaffe: "Macinacaffè",
  addolcitore: "Addolcitore",
  impastatrice: "Impastatrice",
  planetaria: "Planetaria",
  affettatrice: "Affettatrice",
  registratore_cassa: "Registratore cassa",
  climatizzatore: "Climatizzatore",
  altro: "Altro",
};

export const EQUIPMENT_STATUS_LABELS: Record<EquipmentStatus, string> = {
  operativa: "Operativa",
  in_assistenza: "In assistenza",
  ferma: "Ferma",
  dismessa: "Dismessa",
};

export const WARRANTY_STATUS_LABELS: Record<WarrantyStatus, string> = {
  attiva: "Garanzia attiva",
  in_scadenza: "In scadenza",
  scaduta: "Scaduta",
};

export const URGENCY_LABELS: Record<TicketUrgency, string> = {
  bassa: "Bassa",
  media: "Media",
  alta: "Alta",
  bloccante: "Bloccante",
};

export const TICKET_STATUS_LABELS: Record<TicketStatus, string> = {
  nuovo: "Nuovo",
  in_verifica: "In verifica",
  richiesta_informazioni: "Richiesta informazioni",
  in_attesa_tecnico: "In attesa tecnico",
  preventivo_ricevuto: "Preventivo ricevuto",
  preventivo_inviato: "Preventivo inviato",
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

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  manuale: "Manuale",
  fattura: "Fattura",
  certificato: "Certificato",
  foto_macchina: "Foto macchina",
  foto_etichetta: "Foto etichetta",
  altro: "Altro",
};

// Ordine di avanzamento del flusso ticket per la timeline.
export const TICKET_FLOW: TicketStatus[] = [
  "nuovo",
  "in_verifica",
  "in_attesa_tecnico",
  "preventivo_ricevuto",
  "preventivo_inviato",
  "accettato",
  "programmato",
  "in_intervento",
  "risolto",
  "chiuso",
];
