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

export type BarberBookingStatus =
  | "requested"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "no_show";

export type BarberCampaignType = "discount" | "referral" | "reactivation" | "vip";

export type BarberCustomerSegment =
  | "new"
  | "regular"
  | "vip"
  | "at_risk"
  | "referred";

export type BarberPlanId = "basic" | "pro" | "elite";

export interface BarberService {
  id: string;
  organization_id: string;
  name: string;
  description: string;
  duration_minutes: number;
  price_cents: number;
  active: boolean;
  created_at: string;
}

export interface BarberCustomer {
  id: string;
  organization_id: string;
  full_name: string;
  phone: string;
  email: string | null;
  segment: BarberCustomerSegment;
  referral_code: string;
  referred_by_customer_id: string | null;
  total_spent_cents: number;
  visits_count: number;
  last_visit_at: string | null;
  notes: string | null;
  created_at: string;
}

export interface BarberBooking {
  id: string;
  organization_id: string;
  customer_id: string | null;
  customer_name: string;
  customer_phone: string;
  service_id: string;
  service_name: string;
  starts_at: string;
  duration_minutes: number;
  price_cents: number;
  status: BarberBookingStatus;
  referral_code: string | null;
  notes: string | null;
  created_at: string;
}

export interface BarberCampaign {
  id: string;
  organization_id: string;
  name: string;
  type: BarberCampaignType;
  audience: BarberCustomerSegment | "all";
  incentive: string;
  message: string;
  active: boolean;
  expected_redemptions: number;
  revenue_target_cents: number;
  created_at: string;
}

export interface BarberDashboardMetrics {
  today_revenue_cents: number;
  month_revenue_cents: number;
  confirmed_bookings_today: number;
  average_ticket_cents: number;
  occupancy_rate: number;
  customers_total: number;
  referral_customers: number;
  active_campaigns: number;
}

export interface BarberPlan {
  id: BarberPlanId;
  name: string;
  tagline: string;
  monthly_price_cents: number;
  stripe_price_env: string;
  highlighted: boolean;
  features: string[];
  limits: {
    seats: number;
    monthly_bookings: number | null;
    automations: number;
  };
}

export interface CreateBarberBookingInput {
  customer_name: string;
  customer_phone: string;
  service_id: string;
  starts_at: string;
  referral_code?: string | null;
  notes?: string | null;
}

export interface CreateBarberCustomerInput {
  full_name: string;
  phone: string;
  email?: string | null;
  segment?: BarberCustomerSegment;
  referral_code?: string | null;
  notes?: string | null;
}
