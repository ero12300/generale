import type {
  FoodCostResult,
  FoodCostStatus,
  MenuEngineeringCategory,
  MenuEngineeringItem,
  Recipe,
  RecipeItem,
} from "@ristoprofit/types";

const TARGET_FOOD_COST_PERCENT = 30;
const IDEAL_FOOD_COST_PERCENT = 28;

function roundMoney(cents: number): number {
  return Math.round(cents);
}

function ingredientLineCostCents(item: RecipeItem): number {
  const unitPrice = item.unit_price_cents ?? 0;
  const waste = 1 + (item.waste_percent ?? 0) / 100;
  return roundMoney(unitPrice * item.quantity * waste);
}

export function classifyFoodCost(percent: number): FoodCostStatus {
  if (percent <= 28) return "excellent";
  if (percent <= 32) return "good";
  if (percent <= 38) return "warning";
  return "critical";
}

export function foodCostSuggestion(
  status: FoodCostStatus,
  recipeName: string,
  idealPriceCents: number,
  currentPriceCents: number
): string {
  switch (status) {
    case "excellent":
    case "good":
      return `Mantenere il prezzo di ${recipeName} o valutare un leggero aumento se aumentano gli ingredienti.`;
    case "warning":
      return `Valutare aumento a circa €${(idealPriceCents / 100).toFixed(2)} o ridurre grammatura su ${recipeName}.`;
    case "critical":
      return `Urgente: aumentare prezzo da €${(currentPriceCents / 100).toFixed(2)} a almeno €${(idealPriceCents / 100).toFixed(2)}.`;
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}

export function calculateFoodCost(
  recipe: Recipe,
  items: RecipeItem[]
): FoodCostResult {
  const totalIngredientCents = items.reduce(
    (sum, item) => sum + ingredientLineCostCents(item),
    0
  );
  const portions = Math.max(recipe.portions, 1);
  const costPerPortionCents = roundMoney(
    (totalIngredientCents + recipe.packaging_cost_cents) / portions
  );
  const salePriceCents = recipe.sale_price_cents;
  const foodCostPercent =
    salePriceCents > 0
      ? (costPerPortionCents / salePriceCents) * 100
      : 100;
  const grossMarginCents = salePriceCents - costPerPortionCents;
  const grossMarginPercent =
    salePriceCents > 0 ? (grossMarginCents / salePriceCents) * 100 : 0;
  const status = classifyFoodCost(foodCostPercent);
  const minRecommendedPriceCents = roundMoney(
    costPerPortionCents / (TARGET_FOOD_COST_PERCENT / 100)
  );
  const idealRecommendedPriceCents = roundMoney(
    costPerPortionCents / (IDEAL_FOOD_COST_PERCENT / 100)
  );

  return {
    recipe_id: recipe.id,
    recipe_name: recipe.name,
    sale_price_cents: salePriceCents,
    cost_per_portion_cents: costPerPortionCents,
    food_cost_percent: Math.round(foodCostPercent * 10) / 10,
    gross_margin_cents: grossMarginCents,
    gross_margin_percent: Math.round(grossMarginPercent * 10) / 10,
    status,
    min_recommended_price_cents: minRecommendedPriceCents,
    ideal_recommended_price_cents: idealRecommendedPriceCents,
    suggestion: foodCostSuggestion(
      status,
      recipe.name,
      idealRecommendedPriceCents,
      salePriceCents
    ),
  };
}

export function classifyMenuItem(
  salesCount: number,
  marginPercent: number,
  medianSales: number,
  medianMargin: number
): MenuEngineeringCategory {
  const highSales = salesCount >= medianSales;
  const highMargin = marginPercent >= medianMargin;
  if (highSales && highMargin) return "star";
  if (!highSales && highMargin) return "puzzle";
  if (highSales && !highMargin) return "workhorse";
  return "dog";
}

const CATEGORY_ACTIONS: Record<MenuEngineeringCategory, string> = {
  star: "Spingere in menu e promozioni",
  puzzle: "Migliorare descrizione, foto e posizionamento",
  workhorse: "Aumentare prezzo o ridurre costo ingredienti",
  dog: "Eliminare o sostituire dal menu",
};

export function buildMenuEngineering(
  foodCosts: FoodCostResult[],
  salesByRecipe: Record<string, number>
): MenuEngineeringItem[] {
  const items = foodCosts.map((fc) => ({
    recipe_id: fc.recipe_id,
    sales: salesByRecipe[fc.recipe_id] ?? 0,
    margin: fc.gross_margin_percent,
    fc,
  }));

  const salesValues = items.map((i) => i.sales).sort((a, b) => a - b);
  const marginValues = items.map((i) => i.margin).sort((a, b) => a - b);
  const medianSales =
    salesValues[Math.floor(salesValues.length / 2)] ?? 0;
  const medianMargin =
    marginValues[Math.floor(marginValues.length / 2)] ?? 0;

  return items.map(({ recipe_id, sales, margin, fc }) => {
    const category = classifyMenuItem(sales, margin, medianSales, medianMargin);
    return {
      recipe_id,
      recipe_name: fc.recipe_name,
      category,
      sales_count: sales,
      food_cost_percent: fc.food_cost_percent,
      gross_margin_cents: fc.gross_margin_cents,
      action: CATEGORY_ACTIONS[category],
    };
  });
}
