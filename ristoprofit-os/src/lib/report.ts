/**
 * Generatore del Report Giornaliero di RistoProfit OS (vedi documento, modulo 7).
 * Funzione pura: trasforma i dati del giorno in un report leggibile e azionabile.
 */

import { type Recipe, computeFoodCost } from "./food-cost";
import { computeMenuEngineering } from "./menu-engineering";
import { type PriceTrend, type DailyKpi } from "./types";
import { roundCents } from "./money";

export interface DailyReport {
  date: string;
  revenueCents: number;
  covers: number;
  averageTicketCents: number;
  foodCostRatio: number;
  staffCostCents: number;
  staffIncidenceRatio: number;
  grossMarginCents: number;
  bestSeller: string;
  mostProfitable: string;
  criticalProduct: string | null;
  risingIngredients: PriceTrend[];
  actions: string[];
}

export function buildDailyReport(
  recipes: Recipe[],
  unitsSold: Record<string, number>,
  kpi: DailyKpi,
  priceTrends: PriceTrend[],
): DailyReport {
  const averageTicketCents =
    kpi.covers > 0 ? roundCents(kpi.revenueCents / kpi.covers) : 0;

  // Margine lordo stimato: incasso - food cost - costo personale.
  const foodCostCents = roundCents(kpi.revenueCents * kpi.foodCostRatio);
  const grossMarginCents = kpi.revenueCents - foodCostCents - kpi.staffCostCents;
  const staffIncidenceRatio =
    kpi.revenueCents > 0 ? kpi.staffCostCents / kpi.revenueCents : 0;

  const menuItems = recipes.map((r) => {
    const fc = computeFoodCost(r);
    return {
      id: r.id,
      name: r.name,
      unitsSold: unitsSold[r.id] ?? 0,
      marginCents: fc.grossMarginCents,
      foodCostRatio: fc.foodCostRatio,
    };
  });

  const bestSeller =
    [...menuItems].sort((a, b) => b.unitsSold - a.unitsSold)[0]?.name ?? "—";

  const mostProfitable =
    [...menuItems]
      .map((i) => ({ ...i, total: i.marginCents * i.unitsSold }))
      .sort((a, b) => b.total - a.total)[0]?.name ?? "—";

  const criticalItem = [...menuItems]
    .filter((i) => i.foodCostRatio > 0.42)
    .sort((a, b) => b.foodCostRatio - a.foodCostRatio)[0];
  const criticalProduct = criticalItem
    ? `${criticalItem.name}, food cost ${(criticalItem.foodCostRatio * 100).toFixed(0)}%`
    : null;

  const risingIngredients = priceTrends
    .filter((t) => t.changeRatio > 0)
    .sort((a, b) => b.changeRatio - a.changeRatio);

  const engineering = computeMenuEngineering(
    menuItems.map((i) => ({
      id: i.id,
      name: i.name,
      unitsSold: i.unitsSold,
      marginCents: i.marginCents,
    })),
  );

  const actions: string[] = [];
  if (criticalItem) {
    const fc = computeFoodCost(recipes.find((r) => r.id === criticalItem.id)!);
    actions.push(
      `Aumentare ${criticalItem.name}: prezzo consigliato ~${(fc.suggestedIdealPriceCents / 100).toFixed(2).replace(".", ",")} €.`,
    );
  }
  const star = engineering.items.find((i) => i.category === "star");
  if (star) actions.push(`Spingere ${star.name} nel weekend (prodotto Star).`);
  if (staffIncidenceRatio > 0.35) {
    actions.push(
      `Incidenza personale al ${(staffIncidenceRatio * 100).toFixed(1)}%: valuta i turni nelle fasce a basso incasso.`,
    );
  }
  if (risingIngredients[0]) {
    actions.push(
      `Controlla i fornitori: ${risingIngredients[0].ingredient} +${(risingIngredients[0].changeRatio * 100).toFixed(0)}%.`,
    );
  }

  return {
    date: kpi.date,
    revenueCents: kpi.revenueCents,
    covers: kpi.covers,
    averageTicketCents,
    foodCostRatio: kpi.foodCostRatio,
    staffCostCents: kpi.staffCostCents,
    staffIncidenceRatio,
    grossMarginCents,
    bestSeller,
    mostProfitable,
    criticalProduct,
    risingIngredients,
    actions,
  };
}
