import type { AuthContext } from "@/lib/auth/session";
import { getSupabaseClient } from "@/lib/auth/session";
import { calculateFoodCost } from "@/lib/food-cost/engine";
import type { ProfitRepository } from "./index";
import type { CustomerDashboard, Ingredient, Recipe, RecipeItem } from "@ristoprofit/types";

function mapIngredient(row: Record<string, unknown>): Ingredient {
  return {
    id: row.id as string,
    organization_id: row.organization_id as string,
    location_id: (row.location_id as string) ?? null,
    name: row.name as string,
    unit: row.unit as Ingredient["unit"],
    unit_price_cents: row.unit_price_cents as number,
    waste_percent: Number(row.waste_percent ?? 0),
    supplier_id: (row.supplier_id as string) ?? null,
    min_stock: row.min_stock != null ? Number(row.min_stock) : null,
    current_stock: row.current_stock != null ? Number(row.current_stock) : null,
    vat_rate: Number(row.vat_rate ?? 0.1),
    last_price_change_percent:
      row.last_price_change_percent != null
        ? Number(row.last_price_change_percent)
        : null,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  };
}

function mapRecipe(row: Record<string, unknown>): Recipe {
  return {
    id: row.id as string,
    organization_id: row.organization_id as string,
    location_id: (row.location_id as string) ?? null,
    name: row.name as string,
    category: (row.category as string) ?? null,
    sale_price_cents: row.sale_price_cents as number,
    vat_rate: Number(row.vat_rate ?? 0.1),
    portions: row.portions as number,
    packaging_cost_cents: row.packaging_cost_cents as number,
    description: (row.description as string) ?? null,
    is_active: row.is_active as boolean,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  };
}

export function supabaseRepository(auth: AuthContext): ProfitRepository {
  return {
    async listIngredients() {
      const supabase = await getSupabaseClient();
      const { data, error } = await supabase
        .schema("profit")
        .from("ingredients")
        .select("*")
        .eq("organization_id", auth.organizationId)
        .order("name");
      if (error) throw error;
      return (data ?? []).map(mapIngredient);
    },

    async createIngredient(input) {
      const supabase = await getSupabaseClient();
      const { data, error } = await supabase
        .schema("profit")
        .from("ingredients")
        .insert({
          organization_id: auth.organizationId,
          location_id: auth.locationId,
          name: input.name,
          unit: input.unit ?? "kg",
          unit_price_cents: input.unit_price_cents ?? 0,
          waste_percent: input.waste_percent ?? 0,
        })
        .select()
        .single();
      if (error) throw error;
      return mapIngredient(data);
    },

    async listRecipes() {
      const supabase = await getSupabaseClient();
      const { data, error } = await supabase
        .schema("profit")
        .from("recipes")
        .select("*")
        .eq("organization_id", auth.organizationId)
        .order("name");
      if (error) throw error;
      return (data ?? []).map(mapRecipe);
    },

    async createRecipe(input) {
      const supabase = await getSupabaseClient();
      const { data, error } = await supabase
        .schema("profit")
        .from("recipes")
        .insert({
          organization_id: auth.organizationId,
          location_id: auth.locationId,
          name: input.name,
          category: input.category,
          sale_price_cents: input.sale_price_cents ?? 0,
          portions: input.portions ?? 1,
          packaging_cost_cents: input.packaging_cost_cents ?? 0,
        })
        .select()
        .single();
      if (error) throw error;
      return mapRecipe(data);
    },

    async getFoodCosts() {
      const recipes = await this.listRecipes();
      if (recipes.length === 0) return [];

      const supabase = await getSupabaseClient();
      const recipeIds = recipes.map((r) => r.id);
      const { data: items, error } = await supabase
        .schema("profit")
        .from("recipe_items")
        .select("*, ingredient:ingredients(name, unit_price_cents, waste_percent)")
        .in("recipe_id", recipeIds);

      if (error) throw error;

      return recipes.map((recipe) => {
        const recipeItems: RecipeItem[] = (items ?? [])
          .filter((i) => i.recipe_id === recipe.id)
          .map((i) => ({
            id: i.id,
            recipe_id: i.recipe_id,
            ingredient_id: i.ingredient_id,
            quantity: Number(i.quantity),
            unit: i.unit,
            ingredient_name: i.ingredient?.name,
            unit_price_cents: i.ingredient?.unit_price_cents,
            waste_percent: i.ingredient?.waste_percent
              ? Number(i.ingredient.waste_percent)
              : 0,
          }));
        return calculateFoodCost(recipe, recipeItems);
      });
    },

    async getCustomerDashboard(): Promise<CustomerDashboard> {
      const foodCosts = await this.getFoodCosts();
      const ingredients = await this.listIngredients();
      const critical = foodCosts.filter(
        (fc) => fc.status === "warning" || fc.status === "critical"
      );

      return {
        today_revenue_cents: 0,
        estimated_margin_cents: 0,
        avg_food_cost_percent:
          foodCosts.length > 0
            ? foodCosts.reduce((s, f) => s + f.food_cost_percent, 0) / foodCosts.length
            : 0,
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
        staff_cost_percent: null,
        recommended_actions:
          critical.length > 0
            ? critical.map((c) => c.suggestion)
            : ["Inserisci ricette e ingredienti per iniziare il controllo margini."],
        last_report: null,
      };
    },
  };
}
