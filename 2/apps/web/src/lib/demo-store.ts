import type {
  AdminKpis,
  CustomerDashboard,
  DailyReport,
  FoodCostResult,
  Ingredient,
  Recipe,
  RecipeItem,
  ReferralLead,
  SalesAgent,
} from "@ristoprofit/types";
import { calculateFoodCost, buildMenuEngineering } from "@/lib/food-cost/engine";

const DEMO_ORG_ID = "demo-org-ristoprofit";
const DEMO_LOCATION_ID = "demo-loc-messina";

const ingredients: Ingredient[] = [
  {
    id: "ing-1",
    organization_id: DEMO_ORG_ID,
    location_id: DEMO_LOCATION_ID,
    name: "Mozzarella",
    unit: "kg",
    unit_price_cents: 920,
    waste_percent: 3,
    supplier_id: "sup-1",
    min_stock: 5,
    current_stock: 3.2,
    vat_rate: 0.1,
    last_price_change_percent: 8,
    created_at: "",
    updated_at: "",
  },
  {
    id: "ing-2",
    organization_id: DEMO_ORG_ID,
    location_id: DEMO_LOCATION_ID,
    name: "Pistacchio",
    unit: "kg",
    unit_price_cents: 4800,
    waste_percent: 2,
    supplier_id: "sup-2",
    min_stock: 2,
    current_stock: 1.5,
    vat_rate: 0.1,
    last_price_change_percent: 12,
    created_at: "",
    updated_at: "",
  },
  {
    id: "ing-3",
    organization_id: DEMO_ORG_ID,
    location_id: DEMO_LOCATION_ID,
    name: "Impasto pizza",
    unit: "kg",
    unit_price_cents: 180,
    waste_percent: 5,
    supplier_id: "sup-1",
    min_stock: 10,
    current_stock: 8,
    vat_rate: 0.1,
    last_price_change_percent: null,
    created_at: "",
    updated_at: "",
  },
  {
    id: "ing-4",
    organization_id: DEMO_ORG_ID,
    location_id: DEMO_LOCATION_ID,
    name: "Carne burger",
    unit: "kg",
    unit_price_cents: 1250,
    waste_percent: 8,
    supplier_id: "sup-3",
    min_stock: 3,
    current_stock: 4,
    vat_rate: 0.1,
    last_price_change_percent: 5,
    created_at: "",
    updated_at: "",
  },
];

const recipes: Recipe[] = [
  {
    id: "rec-1",
    organization_id: DEMO_ORG_ID,
    location_id: DEMO_LOCATION_ID,
    name: "Pizza Pistacchio",
    category: "Pizze",
    sale_price_cents: 1300,
    vat_rate: 0.1,
    portions: 1,
    packaging_cost_cents: 15,
    description: "Pizza gourmet con crema di pistacchio",
    is_active: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "rec-2",
    organization_id: DEMO_ORG_ID,
    location_id: DEMO_LOCATION_ID,
    name: "Pizza Bufala",
    category: "Pizze",
    sale_price_cents: 1100,
    vat_rate: 0.1,
    portions: 1,
    packaging_cost_cents: 15,
    description: null,
    is_active: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "rec-3",
    organization_id: DEMO_ORG_ID,
    location_id: DEMO_LOCATION_ID,
    name: "Burger Special",
    category: "Secondi",
    sale_price_cents: 1100,
    vat_rate: 0.1,
    portions: 1,
    packaging_cost_cents: 25,
    description: null,
    is_active: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "rec-4",
    organization_id: DEMO_ORG_ID,
    location_id: DEMO_LOCATION_ID,
    name: "Tagliere Aperitivo",
    category: "Antipasti",
    sale_price_cents: 1800,
    vat_rate: 0.1,
    portions: 1,
    packaging_cost_cents: 30,
    description: null,
    is_active: true,
    created_at: "",
    updated_at: "",
  },
];

const recipeItems: RecipeItem[] = [
  { id: "ri-1", recipe_id: "rec-1", ingredient_id: "ing-3", quantity: 0.28, unit: "kg" },
  { id: "ri-2", recipe_id: "rec-1", ingredient_id: "ing-2", quantity: 0.06, unit: "kg" },
  { id: "ri-3", recipe_id: "rec-2", ingredient_id: "ing-3", quantity: 0.28, unit: "kg" },
  { id: "ri-4", recipe_id: "rec-2", ingredient_id: "ing-1", quantity: 0.15, unit: "kg" },
  { id: "ri-5", recipe_id: "rec-3", ingredient_id: "ing-4", quantity: 0.18, unit: "kg" },
  { id: "ri-6", recipe_id: "rec-4", ingredient_id: "ing-1", quantity: 0.12, unit: "kg" },
];

const salesByRecipe: Record<string, number> = {
  "rec-1": 48,
  "rec-2": 35,
  "rec-3": 22,
  "rec-4": 18,
};

function enrichItems(recipeId: string): RecipeItem[] {
  return recipeItems
    .filter((ri) => ri.recipe_id === recipeId)
    .map((ri) => {
      const ing = ingredients.find((i) => i.id === ri.ingredient_id);
      return {
        ...ri,
        ingredient_name: ing?.name,
        unit_price_cents: ing?.unit_price_cents,
        waste_percent: ing?.waste_percent,
      };
    });
}

function computeFoodCosts(): FoodCostResult[] {
  return recipes.map((r) => calculateFoodCost(r, enrichItems(r.id)));
}

const lastReport: DailyReport = {
  id: "rep-1",
  organization_id: DEMO_ORG_ID,
  location_id: DEMO_LOCATION_ID,
  report_date: new Date().toISOString().slice(0, 10),
  revenue_cents: 243000,
  covers: 86,
  avg_ticket_cents: 2825,
  estimated_food_cost_percent: 31,
  estimated_staff_cost_cents: 52000,
  estimated_gross_margin_cents: 115000,
  top_seller: "Pizza Pistacchio",
  most_profitable: "Tagliere Aperitivo",
  critical_product: "Burger Special, food cost 44%",
  price_increases: [
    { name: "Pistacchio", change_percent: 12 },
    { name: "Mozzarella", change_percent: 8 },
  ],
  recommended_actions: [
    "Aumentare Burger Special da 11€ a 13€",
    "Spingere Tagliere Aperitivo nel weekend",
    "Ridurre grammatura mozzarella su Pizza Bufala",
    "Riordinare farina e passata",
  ],
};

export const demoStore = {
  orgId: DEMO_ORG_ID,
  orgName: "Pizzeria La Lumachina S.r.l.",
  locationName: "La Lumachina Messina",
  planTier: "pro" as const,

  listIngredients(): Ingredient[] {
    return [...ingredients];
  },

  listRecipes(): Recipe[] {
    return [...recipes];
  },

  getRecipe(id: string): Recipe | undefined {
    return recipes.find((r) => r.id === id);
  },

  getRecipeItems(recipeId: string): RecipeItem[] {
    return enrichItems(recipeId);
  },

  getFoodCosts(): FoodCostResult[] {
    return computeFoodCosts();
  },

  getMenuEngineering() {
    return buildMenuEngineering(computeFoodCosts(), salesByRecipe);
  },

  getCustomerDashboard(): CustomerDashboard {
    const foodCosts = computeFoodCosts();
    const critical = foodCosts.filter(
      (fc) => fc.status === "warning" || fc.status === "critical"
    );
    return {
      today_revenue_cents: 243000,
      estimated_margin_cents: 115000,
      avg_food_cost_percent: 31,
      critical_products: critical,
      price_increases: ingredients
        .filter((i) => i.last_price_change_percent && i.last_price_change_percent > 5)
        .map((i) => ({
          name: i.name,
          change_percent: i.last_price_change_percent!,
        })),
      low_stock: ingredients
        .filter((i) => i.min_stock && i.current_stock && i.current_stock < i.min_stock)
        .map((i) => ({
          name: i.name,
          current: i.current_stock!,
          min: i.min_stock!,
        })),
      staff_cost_percent: 35.8,
      recommended_actions: lastReport.recommended_actions,
      last_report: lastReport,
    };
  },

  getAdminKpis(): AdminKpis {
    return {
      mrr_cents: 387000,
      new_clients_month: 3,
      active_clients: 12,
      trial_clients: 2,
      churned_month: 0,
      setups_sold_month: 4,
      conversion_rate: 42,
      top_module: "Food Cost Pro",
    };
  },

  getSalesAgent(): SalesAgent {
    return {
      id: "agent-1",
      user_id: "user-agent",
      name: "Marco Venditore",
      email: "marco@emotive.it",
      is_senior: false,
      active_clients: 5,
      mrr_cents: 64500,
      pending_commission_cents: 28500,
    };
  },

  getReferralLeads(): ReferralLead[] {
    return [
      {
        id: "ref-1",
        partner_id: "partner-1",
        client_name: "Bar Centrale",
        phone: "+39 333 1234567",
        city: "Messina",
        status: "demo_scheduled",
        plan_tier: "pro",
        reward_cents: 10000,
        created_at: new Date().toISOString(),
      },
      {
        id: "ref-2",
        partner_id: "partner-1",
        client_name: "Gelateria Artigianale",
        phone: "+39 333 7654321",
        city: "Milazzo",
        status: "won",
        plan_tier: "premium",
        reward_cents: 20000,
        created_at: new Date().toISOString(),
      },
    ];
  },
};
