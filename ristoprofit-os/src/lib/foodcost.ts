import type { Ingredient, Recipe, StaffShift } from "./types";

/**
 * Motore food cost di RistoProfit OS.
 * Tutti i calcoli monetari avvengono in centesimi interi.
 */

export interface FoodCostResult {
  recipeId: string;
  /** costo ingredienti + packaging per porzione, in centesimi */
  costPerPortionCents: number;
  /** prezzo di vendita al netto IVA, in centesimi */
  netSalePriceCents: number;
  /** food cost percentuale sul prezzo netto */
  foodCostPct: number;
  /** margine lordo per porzione, in centesimi */
  grossMarginCents: number;
  /** prezzo minimo consigliato (food cost 35%), IVA inclusa */
  minPriceCents: number;
  /** prezzo ideale consigliato (food cost 28%), IVA inclusa */
  idealPriceCents: number;
  status: "ottimo" | "buono" | "attenzione" | "critico";
}

const FOOD_COST_MIN_TARGET = 0.35;
const FOOD_COST_IDEAL_TARGET = 0.28;

/** Converte la quantità della ricetta nel costo in centesimi, considerando lo scarto. */
export function ingredientCostCents(
  ingredient: Ingredient,
  quantity: number,
  wastePct: number,
): number {
  if (quantity < 0 || wastePct < 0 || wastePct >= 100) {
    throw new Error("Quantità o scarto non validi");
  }
  // quantità effettiva da acquistare per ottenere la resa richiesta
  const effectiveQty = quantity / (1 - wastePct / 100);
  let units: number;
  switch (ingredient.unit) {
    case "kg":
    case "l":
      units = effectiveQty / 1000; // la ricetta usa g / ml
      break;
    case "g":
    case "ml":
      units = effectiveQty;
      break;
    case "pz":
      units = effectiveQty;
      break;
  }
  return Math.round(units * ingredient.priceCents);
}

export function computeFoodCost(
  recipe: Recipe,
  ingredients: Map<string, Ingredient>,
): FoodCostResult {
  if (recipe.portions <= 0) throw new Error("Porzioni deve essere maggiore di zero");
  if (recipe.salePriceCents <= 0) throw new Error("Prezzo di vendita non valido");

  let batchCostCents = 0;
  for (const item of recipe.items) {
    const ingredient = ingredients.get(item.ingredientId);
    if (!ingredient) throw new Error(`Ingrediente non trovato: ${item.ingredientId}`);
    batchCostCents += ingredientCostCents(ingredient, item.quantity, item.wastePct);
  }

  const costPerPortionCents = Math.round(
    batchCostCents / recipe.portions + recipe.packagingCents,
  );
  const netSalePriceCents = Math.round(
    recipe.salePriceCents / (1 + recipe.vatPct / 100),
  );
  const foodCostPct = (costPerPortionCents / netSalePriceCents) * 100;
  const grossMarginCents = netSalePriceCents - costPerPortionCents;

  const minPriceCents = Math.round(
    (costPerPortionCents / FOOD_COST_MIN_TARGET) * (1 + recipe.vatPct / 100),
  );
  const idealPriceCents = Math.round(
    (costPerPortionCents / FOOD_COST_IDEAL_TARGET) * (1 + recipe.vatPct / 100),
  );

  let status: FoodCostResult["status"];
  if (foodCostPct <= 25) status = "ottimo";
  else if (foodCostPct <= 33) status = "buono";
  else if (foodCostPct <= 40) status = "attenzione";
  else status = "critico";

  return {
    recipeId: recipe.id,
    costPerPortionCents,
    netSalePriceCents,
    foodCostPct,
    grossMarginCents,
    minPriceCents,
    idealPriceCents,
    status,
  };
}

export type MenuCategory = "Star" | "Puzzle" | "Cavallo da lavoro" | "Dog";

export interface MenuEngineeringResult {
  recipeId: string;
  name: string;
  soldLast30: number;
  grossMarginCents: number;
  category: MenuCategory;
  action: string;
}

const ACTIONS: Record<MenuCategory, string> = {
  Star: "Spingere: vende tanto e margina bene",
  Puzzle: "Migliorare descrizione e foto: margina bene ma vende poco",
  "Cavallo da lavoro": "Aumentare prezzo o ridurre costo: vende tanto ma margina poco",
  Dog: "Eliminare o sostituire: vende poco e margina poco",
};

/**
 * Classificazione menu engineering: confronta vendite e margine
 * di ogni piatto con la media del menu.
 */
export function menuEngineering(
  recipes: Recipe[],
  ingredients: Map<string, Ingredient>,
): MenuEngineeringResult[] {
  if (recipes.length === 0) return [];
  const withMargin = recipes.map((r) => ({
    recipe: r,
    result: computeFoodCost(r, ingredients),
  }));
  const avgSold =
    withMargin.reduce((s, x) => s + x.recipe.soldLast30, 0) / withMargin.length;
  const avgMargin =
    withMargin.reduce((s, x) => s + x.result.grossMarginCents, 0) / withMargin.length;

  return withMargin.map(({ recipe, result }) => {
    const highVolume = recipe.soldLast30 >= avgSold;
    const highMargin = result.grossMarginCents >= avgMargin;
    const category: MenuCategory = highVolume
      ? highMargin
        ? "Star"
        : "Cavallo da lavoro"
      : highMargin
        ? "Puzzle"
        : "Dog";
    return {
      recipeId: recipe.id,
      name: recipe.name,
      soldLast30: recipe.soldLast30,
      grossMarginCents: result.grossMarginCents,
      category,
      action: ACTIONS[category],
    };
  });
}

export interface LaborResult {
  laborCostCents: number;
  laborPct: number;
  costPerCoverCents: number;
  status: "ok" | "attenzione" | "critico";
}

/** Incidenza del costo del personale sull'incasso del giorno. */
export function laborIncidence(
  shifts: StaffShift[],
  revenueCents: number,
  covers: number,
): LaborResult {
  if (revenueCents <= 0) throw new Error("Incasso non valido");
  const laborCostCents = shifts.reduce(
    (sum, s) => sum + Math.round(s.hours * s.hourlyCostCents),
    0,
  );
  const laborPct = (laborCostCents / revenueCents) * 100;
  const costPerCoverCents = covers > 0 ? Math.round(laborCostCents / covers) : 0;
  const status: LaborResult["status"] =
    laborPct <= 30 ? "ok" : laborPct <= 38 ? "attenzione" : "critico";
  return { laborCostCents, laborPct, costPerCoverCents, status };
}

/** Variazione percentuale prezzo ingrediente rispetto all'acquisto precedente. */
export function priceVariationPct(ingredient: {
  priceCents: number;
  previousPriceCents: number;
}): number {
  if (ingredient.previousPriceCents <= 0) return 0;
  return (
    ((ingredient.priceCents - ingredient.previousPriceCents) /
      ingredient.previousPriceCents) *
    100
  );
}

/**
 * Produzione giornaliera consigliata: storico vendite + margine
 * di sicurezza del 15%, arrotondato per eccesso.
 */
export function suggestedProduction(soldSameDayLastWeek: number): number {
  return Math.ceil(soldSameDayLastWeek * 1.15);
}
