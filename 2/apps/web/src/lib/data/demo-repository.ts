import { demoStore } from "@/lib/demo-store";
import type { ProfitRepository } from "./index";

export const demoRepository: ProfitRepository = {
  listIngredients: async () => demoStore.listIngredients(),
  createIngredient: async (input) => {
    const ing = {
      id: `ing-${Date.now()}`,
      organization_id: demoStore.orgId,
      location_id: null,
      name: input.name ?? "Nuovo ingrediente",
      unit: input.unit ?? "kg",
      unit_price_cents: input.unit_price_cents ?? 0,
      waste_percent: input.waste_percent ?? 0,
      supplier_id: null,
      min_stock: null,
      current_stock: null,
      vat_rate: 0.1,
      last_price_change_percent: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    return ing;
  },
  listRecipes: async () => demoStore.listRecipes(),
  createRecipe: async (input) => ({
    id: `rec-${Date.now()}`,
    organization_id: demoStore.orgId,
    location_id: null,
    name: input.name ?? "Nuova ricetta",
    category: input.category ?? null,
    sale_price_cents: input.sale_price_cents ?? 0,
    vat_rate: 0.1,
    portions: input.portions ?? 1,
    packaging_cost_cents: input.packaging_cost_cents ?? 0,
    description: null,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }),
  getFoodCosts: async () => demoStore.getFoodCosts(),
  getCustomerDashboard: async () => demoStore.getCustomerDashboard(),
};
