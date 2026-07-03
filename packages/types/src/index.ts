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

export type BarberPlan = "basic" | "pro";

export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "in_service"
  | "completed"
  | "cancelled"
  | "no_show";

export type PaymentMethod = "cash" | "card" | "online";

export type ClientSegment = "new" | "loyal" | "vip" | "inactive";

export type CampaignChannel = "sms" | "whatsapp" | "email" | "qr";

export type CampaignStatus = "draft" | "scheduled" | "active" | "completed";

export interface StudioProfile {
  id: string;
  name: string;
  city: string;
  plan: BarberPlan;
  seats: number;
  team_size: number;
  opening_hours: string;
  primary_goal: string;
}

export interface ServiceMenuItem {
  id: string;
  name: string;
  duration_minutes: number;
  price_cents: number;
  category: "haircut" | "beard" | "combo" | "premium" | "color";
  description: string;
}

export interface ClientProfile {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  segment: ClientSegment;
  visits_count: number;
  lifetime_value_cents: number;
  last_visit_at: string | null;
  preferred_service_id: string | null;
  referred_by: string | null;
  notes: string | null;
  consent_marketing: boolean;
}

export interface Appointment {
  id: string;
  client_id: string;
  service_id: string;
  barber_name: string;
  starts_at: string;
  ends_at: string;
  status: AppointmentStatus;
  payment_method: PaymentMethod | null;
  amount_cents: number;
  source: "widget" | "staff" | "instagram" | "walk_in";
}

export interface RevenueSnapshot {
  id: string;
  date: string;
  gross_cents: number;
  tips_cents: number;
  product_sales_cents: number;
  refunds_cents: number;
  bookings_count: number;
  occupancy_ratio: number;
}

export interface ReferralCampaign {
  id: string;
  title: string;
  reward_referrer: string;
  reward_friend: string;
  channel: CampaignChannel;
  status: CampaignStatus;
  conversions: number;
  revenue_cents: number;
  launch_date: string;
}

export interface SubscriptionTier {
  id: BarberPlan | "enterprise";
  name: string;
  monthly_price_cents: number;
  yearly_price_cents: number;
  target: string;
  features: string[];
  stripe_price_lookup_key: string;
}

export const APPOINTMENT_STATUSES: { value: AppointmentStatus; label: string }[] = [
  { value: "pending", label: "In attesa" },
  { value: "confirmed", label: "Confermato" },
  { value: "in_service", label: "In servizio" },
  { value: "completed", label: "Completato" },
  { value: "cancelled", label: "Annullato" },
  { value: "no_show", label: "No-show" },
];

export const CLIENT_SEGMENTS: { value: ClientSegment; label: string }[] = [
  { value: "new", label: "Nuovo" },
  { value: "loyal", label: "Fedele" },
  { value: "vip", label: "VIP" },
  { value: "inactive", label: "Dormiente" },
];
