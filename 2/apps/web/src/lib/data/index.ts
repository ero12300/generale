import type { AuthContext } from "@/lib/auth/session";
import type {
  CustomerDashboard,
  FoodCostResult,
  Ingredient,
  Recipe,
} from "@ristoprofit/types";

export interface ProfitRepository {
  listIngredients(): Promise<Ingredient[]>;
  createIngredient(input: Partial<Ingredient>): Promise<Ingredient>;
  listRecipes(): Promise<Recipe[]>;
  createRecipe(input: Partial<Recipe>): Promise<Recipe>;
  getFoodCosts(): Promise<FoodCostResult[]>;
  getCustomerDashboard(): Promise<CustomerDashboard>;
}

export async function getProfitRepository(
  auth: AuthContext
): Promise<ProfitRepository> {
  if (auth.mode === "demo") {
    const { demoRepository } = await import("./demo-repository");
    return demoRepository;
  }
  const { supabaseRepository } = await import("./supabase-repository");
  return supabaseRepository(auth);
}
