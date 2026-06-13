/**
 * Motore Food Cost di RistoProfit OS.
 *
 * Funzioni pure (nessun side effect, nessun accesso a rete o DB): ricevono dati
 * in ingresso e restituiscono il risultato del calcolo. Questo permette test
 * deterministici e un futuro spostamento del motore in un servizio dedicato.
 *
 * Tutti gli importi sono in CENTESIMI interi (vedi `money.ts`).
 */

import { type Cents, roundCents } from "./money";

export type Unit = "g" | "kg" | "ml" | "l" | "pz";

export interface RecipeIngredient {
  /** Nome ingrediente, es. "Mozzarella di bufala". */
  name: string;
  /** Prezzo della confezione/acquisto in centesimi, es. 1200 = 12,00 €. */
  packPriceCents: Cents;
  /** Quantità contenuta nella confezione, nella stessa unità di `quantity`. */
  packSize: number;
  /** Quantità usata nella ricetta (per l'intera produzione). */
  quantity: number;
  /** Unità di misura della quantità. */
  unit: Unit;
  /** Scarto in percentuale (0..100), es. 10 = 10% di sfrido. */
  wastePct?: number;
}

export interface Recipe {
  id: string;
  name: string;
  /** Prezzo di vendita a porzione in centesimi. */
  salePriceCents: Cents;
  /** Numero di porzioni prodotte da questa ricetta. */
  portions: number;
  /** Costo packaging a porzione (asporto), in centesimi. */
  packagingCents?: Cents;
  ingredients: RecipeIngredient[];
}

export type FoodCostStatus = "ottimo" | "buono" | "attenzione" | "critico";

export interface FoodCostThresholds {
  /** Soglia food cost considerata ottima (sotto = ottimo). */
  ottimo: number;
  /** Soglia food cost massima "buona". */
  buono: number;
  /** Soglia oltre la quale è "attenzione" (oltre ancora = critico). */
  attenzione: number;
  /** Food cost target usato per il prezzo "ideale" consigliato. */
  prezzoIdealeTarget: number;
  /** Food cost massimo accettato usato per il prezzo "minimo" consigliato. */
  prezzoMinimoTarget: number;
}

export const DEFAULT_THRESHOLDS: FoodCostThresholds = {
  ottimo: 0.28,
  buono: 0.35,
  attenzione: 0.42,
  prezzoIdealeTarget: 0.3,
  prezzoMinimoTarget: 0.35,
};

export interface IngredientCost {
  name: string;
  /** Costo totale dell'ingrediente per l'intera produzione, in centesimi. */
  costCents: Cents;
}

export interface FoodCostResult {
  recipeId: string;
  recipeName: string;
  /** Costo totale ingredienti dell'intera produzione, in centesimi. */
  totalIngredientsCents: Cents;
  /** Costo totale produzione (ingredienti + packaging * porzioni), in centesimi. */
  totalBatchCents: Cents;
  /** Costo per singola porzione, in centesimi. */
  costPerPortionCents: Cents;
  salePriceCents: Cents;
  /** Food cost come rapporto 0..1 (es. 0.323 = 32,3%). */
  foodCostRatio: number;
  /** Margine lordo a porzione, in centesimi. */
  grossMarginCents: Cents;
  /** Margine lordo come rapporto 0..1. */
  grossMarginRatio: number;
  /** Prezzo minimo consigliato a porzione, in centesimi. */
  suggestedMinPriceCents: Cents;
  /** Prezzo ideale consigliato a porzione, in centesimi. */
  suggestedIdealPriceCents: Cents;
  status: FoodCostStatus;
  alert: string | null;
  breakdown: IngredientCost[];
}

/** Costo (centesimi, valore frazionario) di un singolo ingrediente sull'intera produzione. */
function rawIngredientCost(ing: RecipeIngredient): number {
  if (ing.packSize <= 0) return 0;
  const waste = Math.min(Math.max(ing.wastePct ?? 0, 0), 99) / 100;
  const effectiveQty = waste > 0 ? ing.quantity / (1 - waste) : ing.quantity;
  return (ing.packPriceCents * effectiveQty) / ing.packSize;
}

function statusFor(ratio: number, t: FoodCostThresholds): FoodCostStatus {
  if (ratio <= t.ottimo) return "ottimo";
  if (ratio <= t.buono) return "buono";
  if (ratio <= t.attenzione) return "attenzione";
  return "critico";
}

function alertFor(
  status: FoodCostStatus,
  ratio: number,
  suggestedIdealPriceCents: Cents,
): string | null {
  if (status === "ottimo" || status === "buono") return null;
  const pct = (ratio * 100).toFixed(1).replace(".", ",");
  const prezzo = (suggestedIdealPriceCents / 100)
    .toFixed(2)
    .replace(".", ",");
  if (status === "attenzione") {
    return `Food cost al ${pct}%: margine sotto pressione. Valuta un prezzo intorno a ${prezzo} € o riduci la grammatura.`;
  }
  return `Food cost critico al ${pct}%: stai perdendo margine. Aumenta il prezzo (consigliato ~${prezzo} €) o rivedi gli ingredienti.`;
}

/**
 * Calcola il food cost completo di una ricetta.
 * Tutti gli importi restituiti sono in centesimi interi.
 */
export function computeFoodCost(
  recipe: Recipe,
  thresholds: FoodCostThresholds = DEFAULT_THRESHOLDS,
): FoodCostResult {
  const portions = recipe.portions > 0 ? recipe.portions : 1;
  const packagingPerPortion = recipe.packagingCents ?? 0;

  const breakdown: IngredientCost[] = recipe.ingredients.map((ing) => ({
    name: ing.name,
    costCents: roundCents(rawIngredientCost(ing)),
  }));

  const totalIngredientsRaw = recipe.ingredients.reduce(
    (sum, ing) => sum + rawIngredientCost(ing),
    0,
  );
  const totalIngredientsCents = roundCents(totalIngredientsRaw);

  const totalBatchCents = totalIngredientsCents + packagingPerPortion * portions;
  const costPerPortionCents = roundCents(totalBatchCents / portions);

  const salePriceCents = recipe.salePriceCents;
  const foodCostRatio =
    salePriceCents > 0 ? costPerPortionCents / salePriceCents : 0;
  const grossMarginCents = salePriceCents - costPerPortionCents;
  const grossMarginRatio =
    salePriceCents > 0 ? grossMarginCents / salePriceCents : 0;

  const suggestedMinPriceCents = roundCents(
    costPerPortionCents / thresholds.prezzoMinimoTarget,
  );
  const suggestedIdealPriceCents = roundCents(
    costPerPortionCents / thresholds.prezzoIdealeTarget,
  );

  const status = statusFor(foodCostRatio, thresholds);

  return {
    recipeId: recipe.id,
    recipeName: recipe.name,
    totalIngredientsCents,
    totalBatchCents,
    costPerPortionCents,
    salePriceCents,
    foodCostRatio,
    grossMarginCents,
    grossMarginRatio,
    suggestedMinPriceCents,
    suggestedIdealPriceCents,
    status,
    alert: alertFor(status, foodCostRatio, suggestedIdealPriceCents),
    breakdown,
  };
}
