export type DealStage =
  | "lead"
  | "analysis"
  | "offer"
  | "renovation"
  | "rental"
  | "exit"
  | "archived";

export type DealStrategy =
  | "fix_flip"
  | "buy_renovate_rent"
  | "buy_hold_sell";

export type PropertyStatus = "draft" | "confirmed";

export type WorkCategory =
  | "demolition"
  | "masonry"
  | "electrical"
  | "plumbing"
  | "hvac"
  | "windows"
  | "drywall"
  | "flooring"
  | "tiling"
  | "painting"
  | "bathroom"
  | "kitchen"
  | "doors"
  | "lighting"
  | "furnishing"
  | "disposal"
  | "inspection";

export type WorkStatus = "planned" | "in_progress" | "done" | "cancelled";

export type OrgRole = "owner" | "admin" | "analyst" | "viewer";

export interface Organization {
  id: string;
  name: string;
  vat_number: string | null;
  settings: Record<string, unknown>;
  created_at: string;
}

export interface Deal {
  id: string;
  organization_id: string;
  title: string;
  stage: DealStage;
  strategy: DealStrategy;
  source_url: string | null;
  assigned_to: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface NormalizedProperty {
  id: string;
  deal_id: string;
  organization_id: string;
  status: PropertyStatus;
  price_asked: number | null;
  surface_sqm: number | null;
  address: string | null;
  zone: string | null;
  city: string | null;
  province: string | null;
  property_type: string | null;
  condition: string | null;
  rooms: number | null;
  floor: string | null;
  energy_class: string | null;
  condo_fees_monthly: number | null;
  has_elevator: boolean | null;
  has_terrace: boolean | null;
  has_parking: boolean | null;
  description: string | null;
  media_urls: string[];
  raw_fields: Record<string, unknown>;
  confirmed_at: string | null;
  confirmed_by: string | null;
}

export interface TaxProfile {
  id: string;
  organization_id: string;
  name: string;
  ires_rate: number;
  irap_rate: number;
  registration_tax_rate: number;
  vat_rate: number;
  seller_type: "private" | "company";
  tax_regime: "registry" | "vat";
  rental_registration_rate: number;
  is_default: boolean;
  metadata: Record<string, unknown>;
}

export interface AnalysisScenario {
  initial_capital_required: number;
  total_project_cost: number;
  gross_sale_margin: number | null;
  net_sale_margin: number | null;
  annual_net_rental_income: number | null;
  monthly_cash_flow: number | null;
  ltv: number | null;
  dscr: number | null;
  npv: number | null;
  irr: number | null;
  sensitivity_signal: "green" | "amber" | "red";
  assumptions_used: Record<string, unknown>;
}

export interface AnalysisResult {
  base_case: AnalysisScenario;
  prudent_case: AnalysisScenario;
  stress_case: AnalysisScenario;
  sensitivity_summary: string;
}

export interface WorkItem {
  id: string;
  deal_id: string;
  organization_id: string;
  room: string | null;
  category: WorkCategory;
  description: string;
  unit: string;
  quantity: number;
  unit_price: number;
  supplier: string | null;
  priority: number;
  status: WorkStatus;
  requires_permit: boolean;
}

export interface FreedomSnapshot {
  id: string;
  organization_id: string;
  snapshot_date: string;
  active_income: number;
  passive_income: number;
  fixed_expenses: number;
  liquidity: number;
  reserves: number;
  coverage_ratio: number;
}

export interface OfferLetter {
  id: string;
  deal_id: string;
  organization_id: string;
  version: number;
  offered_price: number;
  commercial_text: string;
  legal_placeholders: Record<string, unknown>[];
  status: "draft" | "sent" | "accepted" | "rejected";
  created_at: string;
}

export interface AnalysisRun {
  id: string;
  deal_id: string;
  organization_id: string;
  version: number;
  assumptions: Record<string, unknown>;
  results: AnalysisResult;
  created_at: string;
}

export interface OrganizationMember {
  id: string;
  organization_id: string;
  user_id: string;
  role: OrgRole;
  created_at: string;
}

export interface AuthContext {
  mode: "demo" | "supabase";
  userId: string | null;
  email: string | null;
  organizationId: string;
  organizationName: string;
}

export interface CreateDealInput {
  title: string;
  strategy?: DealStrategy;
  source_url?: string | null;
  stage?: DealStage;
  notes?: string | null;
}

export interface UpdateDealPatch {
  title?: string;
  stage?: DealStage;
  strategy?: DealStrategy;
  notes?: string | null;
  assigned_to?: string | null;
}

export interface DealDetail {
  deal: Deal;
  property: NormalizedProperty | null;
  analysis: AnalysisResult | null;
  workItems: WorkItem[];
  offerLetter: OfferLetter | null;
}

export const DEAL_STAGES: { value: DealStage; label: string }[] = [
  { value: "lead", label: "Lead" },
  { value: "analysis", label: "Analisi" },
  { value: "offer", label: "Offerta" },
  { value: "renovation", label: "Cantiere" },
  { value: "rental", label: "Locazione" },
  { value: "exit", label: "Exit" },
  { value: "archived", label: "Archiviato" },
];

export const DEAL_STRATEGIES: { value: DealStrategy; label: string }[] = [
  { value: "fix_flip", label: "Fix & Flip" },
  { value: "buy_renovate_rent", label: "Compra-Ristruttura-Affitta" },
  { value: "buy_hold_sell", label: "Buy & Hold" },
];

export const WORK_CATEGORIES: { value: WorkCategory; label: string }[] = [
  { value: "demolition", label: "Demolizioni" },
  { value: "masonry", label: "Opere murarie" },
  { value: "electrical", label: "Impianto elettrico" },
  { value: "plumbing", label: "Impianto idrico" },
  { value: "hvac", label: "Climatizzazione" },
  { value: "windows", label: "Infissi" },
  { value: "drywall", label: "Cartongesso" },
  { value: "flooring", label: "Pavimenti" },
  { value: "tiling", label: "Rivestimenti" },
  { value: "painting", label: "Tinteggiatura" },
  { value: "bathroom", label: "Bagni" },
  { value: "kitchen", label: "Cucina" },
  { value: "doors", label: "Porte" },
  { value: "lighting", label: "Illuminazione" },
  { value: "furnishing", label: "Arredi" },
  { value: "disposal", label: "Smaltimenti" },
  { value: "inspection", label: "Collaudi" },
];

export type BarberAppointmentStatus =
  | "pending"
  | "confirmed"
  | "in_service"
  | "completed"
  | "no_show";

export type BarberServiceCategory =
  | "cut"
  | "beard"
  | "combo"
  | "premium"
  | "color"
  | "care";

export type BarberCampaignType = "discount" | "referral" | "reactivation";

export type BarberChannel = "app" | "instagram" | "phone" | "walk_in";

export type BarberSubscriptionTier = "starter" | "pro" | "multi_store";

export interface BarberService {
  id: string;
  name: string;
  category: BarberServiceCategory;
  duration_minutes: number;
  price: number;
  featured?: boolean;
}

export interface BarberClient {
  id: string;
  organization_id: string;
  full_name: string;
  phone: string;
  email: string | null;
  tags: string[];
  total_visits: number;
  total_spent: number;
  last_visit_at: string | null;
  preferred_barber: string | null;
  preferences: string[];
  referral_code: string;
  referred_by_client_id: string | null;
  consent_marketing: boolean;
  notes: string | null;
  created_at: string;
}

export interface BarberAppointment {
  id: string;
  organization_id: string;
  client_id: string;
  service_ids: string[];
  barber_name: string;
  starts_at: string;
  duration_minutes: number;
  status: BarberAppointmentStatus;
  total_price: number;
  channel: BarberChannel;
  notes: string | null;
  referral_code_used: string | null;
  created_at: string;
}

export interface BarberPayment {
  id: string;
  organization_id: string;
  appointment_id: string;
  client_id: string;
  amount: number;
  method: "cash" | "card" | "online";
  created_at: string;
}

export interface BarberCampaign {
  id: string;
  organization_id: string;
  name: string;
  type: BarberCampaignType;
  description: string;
  reward: string;
  status: "draft" | "active" | "paused";
  conversions: number;
  revenue_generated: number;
}

export interface BarberSubscriptionPlan {
  id: BarberSubscriptionTier;
  name: string;
  monthly_price: number;
  yearly_price: number;
  description: string;
  features: string[];
  cta: string;
}

export interface BarberDashboardSnapshot {
  revenue_today: number;
  revenue_month: number;
  appointments_today: number;
  occupancy_rate: number;
  repeat_rate: number;
  average_ticket: number;
  new_clients_month: number;
  referral_revenue_month: number;
}

export interface CreateBarberAppointmentInput {
  client_name: string;
  phone: string;
  email?: string | null;
  service_ids: string[];
  barber_name: string;
  starts_at: string;
  notes?: string | null;
  channel?: BarberChannel;
  referral_code?: string | null;
}

export const BARBER_APPOINTMENT_STATUSES: {
  value: BarberAppointmentStatus;
  label: string;
}[] = [
  { value: "pending", label: "In attesa" },
  { value: "confirmed", label: "Confermato" },
  { value: "in_service", label: "In poltrona" },
  { value: "completed", label: "Completato" },
  { value: "no_show", label: "No show" },
];

export const BARBER_SERVICE_CATEGORIES: {
  value: BarberServiceCategory;
  label: string;
}[] = [
  { value: "cut", label: "Taglio" },
  { value: "beard", label: "Barba" },
  { value: "combo", label: "Combo" },
  { value: "premium", label: "Premium" },
  { value: "color", label: "Colore" },
  { value: "care", label: "Trattamento" },
];
