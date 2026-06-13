import {
  ingredients,
  recipes,
  todaySales,
  todayShifts,
} from "./demo-data";
import {
  computeFoodCost,
  laborIncidence,
  menuEngineering,
  priceVariationPct,
  type FoodCostResult,
} from "./foodcost";
import type { Ingredient, Recipe } from "./types";

export const ingredientMap = new Map<string, Ingredient>(
  ingredients.map((i) => [i.id, i]),
);

export interface RecipeWithCost {
  recipe: Recipe;
  cost: FoodCostResult;
}

export function recipesWithCost(): RecipeWithCost[] {
  return recipes.map((recipe) => ({
    recipe,
    cost: computeFoodCost(recipe, ingredientMap),
  }));
}

export function demoDashboard() {
  const withCost = recipesWithCost();
  const labor = laborIncidence(todayShifts, todaySales.revenueCents, todaySales.covers);
  const engineering = menuEngineering(recipes, ingredientMap);

  // food cost medio ponderato sulle vendite
  const totalSold = withCost.reduce((s, r) => s + r.recipe.soldLast30, 0);
  const avgFoodCostPct =
    withCost.reduce((s, r) => s + r.cost.foodCostPct * r.recipe.soldLast30, 0) /
    totalSold;

  const critical = withCost
    .filter((r) => r.cost.status === "critico" || r.cost.status === "attenzione")
    .sort((a, b) => b.cost.foodCostPct - a.cost.foodCostPct);

  const risingIngredients = ingredients
    .map((i) => ({ ingredient: i, variationPct: priceVariationPct(i) }))
    .filter((x) => x.variationPct > 1)
    .sort((a, b) => b.variationPct - a.variationPct);

  const lowStock = ingredients.filter((i) => i.stockQty < i.minStockQty);

  const bestSeller = [...withCost].sort(
    (a, b) => b.recipe.soldLast30 - a.recipe.soldLast30,
  )[0];
  const mostProfitable = [...withCost].sort(
    (a, b) => b.cost.grossMarginCents - a.cost.grossMarginCents,
  )[0];

  const avgTicketCents = Math.round(todaySales.revenueCents / todaySales.covers);
  const estGrossMarginCents = Math.round(
    todaySales.revenueCents * (1 - avgFoodCostPct / 100) - labor.laborCostCents,
  );

  return {
    withCost,
    labor,
    engineering,
    avgFoodCostPct,
    critical,
    risingIngredients,
    lowStock,
    bestSeller,
    mostProfitable,
    avgTicketCents,
    estGrossMarginCents,
  };
}

/** Azioni consigliate per il report giornaliero. */
export function suggestedActions(): string[] {
  const { critical, risingIngredients, lowStock } = demoDashboard();
  const actions: string[] = [];
  for (const c of critical.slice(0, 2)) {
    actions.push(
      `Aumentare ${c.recipe.name}: food cost ${c.cost.foodCostPct.toFixed(1).replace(".", ",")}%, prezzo minimo consigliato ${(c.cost.minPriceCents / 100).toFixed(2).replace(".", ",")} €`,
    );
  }
  for (const r of risingIngredients.slice(0, 2)) {
    actions.push(
      `Verificare ricette con ${r.ingredient.name}: prezzo +${r.variationPct.toFixed(0)}% rispetto all'ultimo acquisto`,
    );
  }
  if (lowStock.length > 0) {
    actions.push(`Riordinare: ${lowStock.map((i) => i.name).join(", ")}`);
  }
  return actions;
}
