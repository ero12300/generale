// Tipi di dominio condivisi RistoCare OS.
// Unica fonte di verità per le entità del MVP (sez. 24 documento strategico).

export type UserRole =
  | "super_admin"
  | "operator"
  | "customer_admin"
  | "customer_staff"
  | "technician"
  | "referral_partner";

export type PlanId = "start" | "pro" | "premium" | "enterprise";

export type EquipmentCategory =
  | "frigo"
  | "freezer"
  | "abbattitore"
  | "lavastoviglie"
  | "forno"
  | "friggitrice"
  | "piano_cottura"
  | "vetrina_gelato"
  | "vetrina_refrigerata"
  | "banco_bar"
  | "retrobanco"
  | "cappa"
  | "aspirazione"
  | "macchina_caffe"
  | "macinacaffe"
  | "addolcitore"
  | "impastatrice"
  | "planetaria"
  | "affettatrice"
  | "registratore_cassa"
  | "climatizzatore"
  | "altro";

export type WarrantyStatus = "attiva" | "in_scadenza" | "scaduta";

export type EquipmentStatus = "operativa" | "in_assistenza" | "ferma" | "dismessa";

export type TicketUrgency = "bassa" | "media" | "alta" | "bloccante";

// Stati ticket — flusso operativo completo (sez. 12 documento).
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

export type DocumentType =
  | "manuale"
  | "fattura"
  | "certificato"
  | "foto_macchina"
  | "foto_etichetta"
  | "altro";

export interface Organization {
  id: string;
  name: string;
  vatNumber: string;
  billingEmail: string;
  phone: string;
  city: string;
  province: string;
  region: string;
  plan: PlanId;
  status: "attivo" | "trial" | "sospeso";
  createdAt: string;
}

export interface Location {
  id: string;
  organizationId: string;
  name: string;
  address: string;
  city: string;
  province: string;
  managerName: string;
}

export interface EquipmentDocument {
  id: string;
  equipmentId: string;
  documentType: DocumentType;
  fileName: string;
  uploadedBy: string;
  createdAt: string;
}

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
  deliveryDate: string;
  installationDate: string;
  warrantyStart: string;
  warrantyEnd: string;
  area: string;
  notes: string;
  qrToken: string;
  status: EquipmentStatus;
  documents: EquipmentDocument[];
  createdAt: string;
}

export interface TicketAttachment {
  id: string;
  fileName: string;
  fileType: string;
  uploadedBy: string;
  createdAt: string;
}

export interface TicketEvent {
  id: string;
  status: TicketStatus;
  note: string;
  author: string;
  createdAt: string;
}

export interface Technician {
  id: string;
  name: string;
  companyName: string;
  phone: string;
  categories: EquipmentCategory[];
  city: string;
  province: string;
  ratingInternal: number;
  active: boolean;
}

export interface Quote {
  // Vista interna: costo tecnico e margine (mai mostrati al cliente).
  internalCost: number;
  margin: number;
  // Vista cliente: prezzo finale.
  customerPrice: number;
  status: "bozza" | "inviato" | "accettato" | "rifiutato";
  validUntil: string;
}

export interface Ticket {
  id: string;
  code: string;
  organizationId: string;
  locationId: string;
  equipmentId: string;
  title: string;
  description: string;
  urgency: TicketUrgency;
  status: TicketStatus;
  warrantyCheck: WarrantyStatus | "da_verificare";
  openedBy: string;
  assignedOperatorId: string | null;
  assignedTechnicianId: string | null;
  quote: Quote | null;
  attachments: TicketAttachment[];
  events: TicketEvent[];
  createdAt: string;
  updatedAt: string;
}

export interface Referral {
  id: string;
  partnerName: string;
  partnerType: string;
  phone: string;
  email: string;
  referredCompany: string;
  referredContact: string;
  city: string;
  notes: string;
  status: "nuovo" | "contattato" | "in_trattativa" | "vinto" | "perso";
  planSold: PlanId | null;
  rewardAmount: number;
  rewardStatus: "in_attesa" | "maturato" | "pagato";
  createdAt: string;
}

export interface ContactRequest {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  city: string;
  requestType: "demo" | "preventivo" | "censimento" | "tecnico" | "referral";
  message: string;
  createdAt: string;
}
