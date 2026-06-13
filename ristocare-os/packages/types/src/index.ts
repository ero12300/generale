export type UserRole =
  | "super_admin"
  | "operator"
  | "customer_admin"
  | "customer_staff"
  | "technician"
  | "referral_partner";

export type SubscriptionPlan = "start" | "pro" | "premium" | "enterprise";

export type OrganizationStatus = "active" | "trial" | "suspended" | "cancelled";

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

export type WarrantyStatus = "active" | "expiring" | "expired" | "unknown";

export type EquipmentStatus = "active" | "maintenance" | "broken" | "retired";

export type TicketStatus =
  | "new"
  | "in_review"
  | "info_requested"
  | "awaiting_technician"
  | "quote_received"
  | "quote_sent"
  | "accepted"
  | "scheduled"
  | "in_progress"
  | "awaiting_spare"
  | "resolved"
  | "closed"
  | "not_covered"
  | "disputed"
  | "cancelled";

export type TicketUrgency = "low" | "medium" | "high" | "critical";

export type DocumentType =
  | "manual"
  | "invoice"
  | "certificate"
  | "photo"
  | "label_photo"
  | "report"
  | "quote"
  | "other";

export type QuoteStatus = "draft" | "sent" | "accepted" | "rejected" | "expired";

export type ReferralStatus = "lead" | "contacted" | "converted" | "rejected" | "duplicate";

export type RewardStatus = "pending" | "approved" | "paid" | "cancelled";

export interface Organization {
  id: string;
  name: string;
  vat_number: string | null;
  fiscal_code: string | null;
  billing_email: string | null;
  phone: string | null;
  address: string | null;
  city: string;
  province: string;
  region: string;
  status: OrganizationStatus;
  plan: SubscriptionPlan;
  created_at: string;
}

export interface Location {
  id: string;
  organization_id: string;
  name: string;
  address: string;
  city: string;
  province: string;
  phone: string | null;
  manager_name: string | null;
  created_at: string;
}

export interface Equipment {
  id: string;
  organization_id: string;
  location_id: string;
  name: string;
  category: EquipmentCategory;
  brand: string | null;
  model: string | null;
  serial_number: string | null;
  supplier: string | null;
  purchase_date: string | null;
  delivery_date: string | null;
  installation_date: string | null;
  warranty_start: string | null;
  warranty_end: string | null;
  warranty_status: WarrantyStatus;
  area: string | null;
  notes: string | null;
  qr_token: string;
  status: EquipmentStatus;
  created_at: string;
}

export interface EquipmentDocument {
  id: string;
  equipment_id: string;
  document_type: DocumentType;
  file_url: string;
  file_name: string;
  uploaded_by: string | null;
  created_at: string;
}

export interface Ticket {
  id: string;
  organization_id: string;
  location_id: string;
  equipment_id: string | null;
  title: string;
  description: string;
  urgency: TicketUrgency;
  status: TicketStatus;
  warranty_check: boolean | null;
  customer_visible_status: string | null;
  internal_notes: string | null;
  opened_by: string | null;
  assigned_operator_id: string | null;
  assigned_technician_id: string | null;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
}

export interface TicketAttachment {
  id: string;
  ticket_id: string;
  file_url: string;
  file_type: string;
  uploaded_by: string | null;
  created_at: string;
}

export interface Technician {
  id: string;
  name: string;
  company_name: string | null;
  phone: string;
  email: string | null;
  categories: EquipmentCategory[];
  city: string;
  province: string;
  rating_internal: number;
  notes_internal: string | null;
  active: boolean;
  created_at: string;
}

export interface TechnicianRequest {
  id: string;
  ticket_id: string;
  technician_id: string;
  internal_price: number | null;
  availability: string | null;
  response_status: "pending" | "accepted" | "rejected";
  notes: string | null;
  created_at: string;
}

export interface Quote {
  id: string;
  ticket_id: string;
  internal_cost: number;
  customer_price: number;
  margin: number;
  status: QuoteStatus;
  accepted_at: string | null;
  valid_until: string | null;
  pdf_url: string | null;
  created_at: string;
}

export interface Referral {
  id: string;
  partner_name: string;
  partner_type: string;
  phone: string | null;
  email: string | null;
  referred_company: string;
  referred_contact: string | null;
  status: ReferralStatus;
  plan_sold: SubscriptionPlan | null;
  reward_amount: number | null;
  reward_status: RewardStatus;
  created_at: string;
}

export interface CustomerDashboardStats {
  equipment_count: number;
  open_tickets: number;
  pending_tickets: number;
  expiring_warranties: number;
  upcoming_maintenance: number;
}

export interface AdminDashboardStats {
  new_tickets: number;
  urgent_tickets: number;
  awaiting_technician: number;
  awaiting_customer: number;
  quotes_to_send: number;
  scheduled_interventions: number;
  active_clients: number;
}

export const TICKET_STATUS_LABELS: Record<TicketStatus, string> = {
  new: "Nuovo",
  in_review: "In verifica",
  info_requested: "Richiesta informazioni",
  awaiting_technician: "In attesa tecnico",
  quote_received: "Preventivo ricevuto",
  quote_sent: "Preventivo inviato",
  accepted: "Accettato",
  scheduled: "Programmato",
  in_progress: "In intervento",
  awaiting_spare: "In attesa ricambio",
  resolved: "Risolto",
  closed: "Chiuso",
  not_covered: "Non coperto da garanzia",
  disputed: "Contestato",
  cancelled: "Annullato",
};

export const EQUIPMENT_CATEGORY_LABELS: Record<EquipmentCategory, string> = {
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

export const PLAN_LABELS: Record<SubscriptionPlan, string> = {
  start: "RistoCare Start",
  pro: "RistoCare Pro",
  premium: "RistoCare Premium",
  enterprise: "RistoCare Enterprise",
};

export const PLAN_PRICES: Record<SubscriptionPlan, { monthly: number; setup: number; equipment_limit: number }> = {
  start: { monthly: 49, setup: 300, equipment_limit: 10 },
  pro: { monthly: 99, setup: 700, equipment_limit: 30 },
  premium: { monthly: 199, setup: 1500, equipment_limit: 70 },
  enterprise: { monthly: 0, setup: 0, equipment_limit: 999 },
};
