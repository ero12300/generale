import { describe, it, expect } from "vitest";
import {
  computeFoodCost,
  type Recipe,
  DEFAULT_THRESHOLDS,
} from "./food-cost";
import { toCents } from "./money";

describe("computeFoodCost", () => {
  it("riproduce l'esempio Pizza Pistacchio dal documento (food cost ~32,3%)", () => {
    // Ingredienti che costano 4,20 € a porzione, prezzo vendita 13,00 €.
    const recipe: Recipe = {
      id: "pizza-pistacchio",
      name: "Pizza Pistacchio",
      salePriceCents: toCents(13),
      portions: 1,
      ingredients: [
        // 1 confezione da 1000g a 4,20 € usata interamente.
        { name: "Mix ingredienti", packPriceCents: 420, packSize: 1000, quantity: 1000, unit: "g" },
      ],
    };

    const r = computeFoodCost(recipe);
    expect(r.costPerPortionCents).toBe(420);
    expect(r.grossMarginCents).toBe(880);
    expect(r.foodCostRatio).toBeCloseTo(0.3231, 3);
    expect(r.status).toBe("buono");
    expect(r.alert).toBeNull();
  });

  it("distribuisce il costo sulle porzioni e somma il packaging", () => {
    const recipe: Recipe = {
      id: "test-batch",
      name: "Impasto 10 porzioni",
      salePriceCents: toCents(8),
      portions: 10,
      packagingCents: 20, // 0,20 € a porzione (asporto)
      ingredients: [
        { name: "Farina", packPriceCents: 1000, packSize: 1000, quantity: 1000, unit: "g" },
      ],
    };

    const r = computeFoodCost(recipe);
    // 1000 cent ingredienti / 10 porzioni = 100, + 20 packaging = 120 a porzione
    expect(r.totalIngredientsCents).toBe(1000);
    expect(r.totalBatchCents).toBe(1200);
    expect(r.costPerPortionCents).toBe(120);
  });

  it("applica lo scarto aumentando il costo effettivo", () => {
    const base: Recipe = {
      id: "no-waste",
      name: "Senza scarto",
      salePriceCents: toCents(10),
      portions: 1,
      ingredients: [
        { name: "Pesce", packPriceCents: 2000, packSize: 1000, quantity: 100, unit: "g" },
      ],
    };
    const withWaste: Recipe = {
      ...base,
      id: "with-waste",
      ingredients: [{ ...base.ingredients[0], wastePct: 20 }],
    };

    const noWaste = computeFoodCost(base).costPerPortionCents;
    const waste = computeFoodCost(withWaste).costPerPortionCents;
    // 200 cent senza scarto, 250 cent con scarto del 20% (100/0.8 = 125g)
    expect(noWaste).toBe(200);
    expect(waste).toBe(250);
  });

  it("classifica come critico un food cost troppo alto e produce un alert", () => {
    const recipe: Recipe = {
      id: "burger-special",
      name: "Burger Special",
      salePriceCents: toCents(11),
      portions: 1,
      ingredients: [
        { name: "Ingredienti", packPriceCents: 484, packSize: 1, quantity: 1, unit: "pz" },
      ],
    };
    const r = computeFoodCost(recipe);
    // 4,84 / 11 = 44%
    expect(r.foodCostRatio).toBeCloseTo(0.44, 2);
    expect(r.status).toBe("critico");
    expect(r.alert).toContain("critico");
  });

  it("calcola prezzo minimo e ideale coerenti con le soglie", () => {
    const recipe: Recipe = {
      id: "p",
      name: "Prodotto",
      salePriceCents: toCents(10),
      portions: 1,
      ingredients: [
        { name: "x", packPriceCents: 300, packSize: 1, quantity: 1, unit: "pz" },
      ],
    };
    const r = computeFoodCost(recipe);
    // costo 3,00 €: minimo a target 35% = 8,57 €, ideale a 30% = 10,00 €
    expect(r.suggestedMinPriceCents).toBe(
      Math.round(300 / DEFAULT_THRESHOLDS.prezzoMinimoTarget),
    );
    expect(r.suggestedIdealPriceCents).toBe(1000);
  });

  it("gestisce porzioni a zero senza esplodere", () => {
    const recipe: Recipe = {
      id: "z",
      name: "Zero",
      salePriceCents: toCents(5),
      portions: 0,
      ingredients: [
        { name: "x", packPriceCents: 100, packSize: 1, quantity: 1, unit: "pz" },
      ],
    };
    const r = computeFoodCost(recipe);
    expect(Number.isFinite(r.costPerPortionCents)).toBe(true);
    expect(r.costPerPortionCents).toBe(100);
  });
});
