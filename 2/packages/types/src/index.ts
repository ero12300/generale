/** Ruoli piattaforma RistoProfit / RistoSuite */
export type UserRole =
  | "super_admin"
  | "admin_emotive"
  | "operator_emotive"
  | "sales_agent"
  | "customer_owner"
  | "customer_manager"
  | "customer_staff"
  | "accountant"
  | "referral_partner";

export type PlanTier = "start" | "pro" | "premium" | "enterprise";

export type SubscriptionStatus = "trial" | "active" | "past_due" | "cancelled";

export type MenuEngineeringCategory = "star" | "puzzle" | "workhorse" | "dog";

export type FoodCostStatus = "excellent" | "good" | "warning" | "critical";

export type LeadStatus =
  | "new"
  | "contacted"
  | "demo_scheduled"
  | "quote_sent"
  | "negotiating"
  | "won"
  | "lost"
  | "invalid"
  | "duplicate"
  | "reward_pending"
  | "reward_paid";

export type UnitOfMeasure =
  | "g"
  | "kg"
  | "ml"
  | "l"
  | "pz"
  | "conf";

/** Importi in centesimi per evitare float */
export type MoneyCents = number;

export interface Organization {
  id: string;
  name: string;
  vat_number: string | null;
  city: string | null;
  province: string | null;
  settings: Record<string, unknown>;
  created_at: string;
}

export interface Location {
  id: string;
  organization_id: string;
  name: string;
  address: string | null;
  city: string | null;
  province: string | null;
  business_type: string | null;
  is_primary: boolean;
  created_at: string;
}

export interface Plan {
  id: string;
  tier: PlanTier;
  name: string;
  monthly_price_cents: MoneyCents;
  setup_price_cents: MoneyCents;
  max_recipes: number | null;
  max_ingredients: number | null;
  max_users: number;
  max_locations: number;
  features: string[];
}

export interface Subscription {
  id: string;
  organization_id: string;
  plan_id: string;
  status: SubscriptionStatus;
  modules: string[];
  started_at: string;
  ends_at: string | null;
}

export interface Ingredient {
  id: string;
  organization_id: string;
  location_id: string | null;
  name: string;
  unit: UnitOfMeasure;
  unit_price_cents: MoneyCents;
  waste_percent: number;
  supplier_id: string | null;
  min_stock: number | null;
  current_stock: number | null;
  vat_rate: number;
  last_price_change_percent: number | null;
  created_at: string;
  updated_at: string;
}

export interface Supplier {
  id: string;
  organization_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  notes: string | null;
  created_at: string;
}

export interface Recipe {
  id: string;
  organization_id: string;
  location_id: string | null;
  name: string;
  category: string | null;
  sale_price_cents: MoneyCents;
  vat_rate: number;
  portions: number;
  packaging_cost_cents: MoneyCents;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface RecipeItem {
  id: string;
  recipe_id: string;
  ingredient_id: string;
  quantity: number;
  unit: UnitOfMeasure;
  ingredient_name?: string;
  unit_price_cents?: MoneyCents;
  waste_percent?: number;
}

export interface FoodCostResult {
  recipe_id: string;
  recipe_name: string;
  sale_price_cents: MoneyCents;
  cost_per_portion_cents: MoneyCents;
  food_cost_percent: number;
  gross_margin_cents: MoneyCents;
  gross_margin_percent: number;
  status: FoodCostStatus;
  min_recommended_price_cents: MoneyCents;
  ideal_recommended_price_cents: MoneyCents;
  suggestion: string;
}

export interface MenuEngineeringItem {
  recipe_id: string;
  recipe_name: string;
  category: MenuEngineeringCategory;
  sales_count: number;
  food_cost_percent: number;
  gross_margin_cents: MoneyCents;
  action: string;
}

export interface DailyReport {
  id: string;
  organization_id: string;
  location_id: string;
  report_date: string;
  revenue_cents: MoneyCents;
  covers: number;
  avg_ticket_cents: MoneyCents;
  estimated_food_cost_percent: number;
  estimated_staff_cost_cents: MoneyCents;
  estimated_gross_margin_cents: MoneyCents;
  top_seller: string | null;
  most_profitable: string | null;
  critical_product: string | null;
  price_increases: { name: string; change_percent: number }[];
  recommended_actions: string[];
}

export interface SalesAgent {
  id: string;
  user_id: string;
  name: string;
  email: string;
  is_senior: boolean;
  active_clients: number;
  mrr_cents: MoneyCents;
  pending_commission_cents: MoneyCents;
}

export interface ReferralPartner {
  id: string;
  user_id: string;
  name: string;
  partner_code: string;
  total_referrals: number;
  pending_reward_cents: MoneyCents;
  paid_reward_cents: MoneyCents;
}

export interface ReferralLead {
  id: string;
  partner_id: string;
  client_name: string;
  phone: string;
  city: string;
  status: LeadStatus;
  plan_tier: PlanTier | null;
  reward_cents: MoneyCents | null;
  created_at: string;
}

export interface AdminKpis {
  mrr_cents: MoneyCents;
  new_clients_month: number;
  active_clients: number;
  trial_clients: number;
  churned_month: number;
  setups_sold_month: number;
  conversion_rate: number;
  top_module: string;
}

export interface CustomerDashboard {
  today_revenue_cents: MoneyCents;
  estimated_margin_cents: MoneyCents;
  avg_food_cost_percent: number;
  critical_products: FoodCostResult[];
  price_increases: { name: string; change_percent: number }[];
  low_stock: { name: string; current: number; min: number }[];
  staff_cost_percent: number | null;
  recommended_actions: string[];
  last_report: DailyReport | null;
}

export const PLANS: Plan[] = [
  {
    id: "plan-start",
    tier: "start",
    name: "Start",
    monthly_price_cents: 5900,
    setup_price_cents: 49000,
    max_recipes: 30,
    max_ingredients: 100,
    max_users: 1,
    max_locations: 1,
    features: [
      "Food cost base",
      "Dashboard",
      "Report settimanale",
      "Caricamento fatture manuale",
      "Supporto email",
    ],
  },
  {
    id: "plan-pro",
    tier: "pro",
    name: "Pro",
    monthly_price_cents: 12900,
    setup_price_cents: 99000,
    max_recipes: 100,
    max_ingredients: null,
    max_users: 3,
    max_locations: 1,
    features: [
      "Food cost avanzato",
      "Menu engineering",
      "Report giornaliero",
      "Fatture fornitori",
      "Magazzino semplice",
      "Suggerimenti prezzo",
      "Supporto prioritario",
    ],
  },
  {
    id: "plan-premium",
    tier: "premium",
    name: "Premium",
    monthly_price_cents: 24900,
    setup_price_cents: 199000,
    max_recipes: null,
    max_ingredients: null,
    max_users: 10,
    max_locations: 1,
    features: [
      "Tutto Pro",
      "Report WhatsApp/Telegram",
      "Controllo personale",
      "Produzione giornaliera",
      "AI advisor",
      "Report PDF mensile",
      "Call mensile controllo",
    ],
  },
  {
    id: "plan-enterprise",
    tier: "enterprise",
    name: "Enterprise",
    monthly_price_cents: 0,
    setup_price_cents: 300000,
    max_recipes: null,
    max_ingredients: null,
    max_users: 999,
    max_locations: 99,
    features: [
      "Multi-sede",
      "Dashboard gruppo",
      "Account manager",
      "Integrazioni personalizzate",
    ],
  },
];

export function formatEuro(cents: MoneyCents): string {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}
