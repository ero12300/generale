import { describe, expect, it } from "vitest";
import {
  computeFoodCost,
  ingredientCostCents,
  laborIncidence,
  menuEngineering,
  priceVariationPct,
  suggestedProduction,
} from "./foodcost";
import type { Ingredient, Recipe } from "./types";

const mozzarella: Ingredient = {
  id: "ing-mozzarella",
  name: "Mozzarella fiordilatte",
  unit: "kg",
  priceCents: 850, // 8,50 €/kg
  previousPriceCents: 780,
  supplierId: "sup-1",
  stockQty: 12,
  minStockQty: 5,
};

const farina: Ingredient = {
  id: "ing-farina",
  name: "Farina 00",
  unit: "kg",
  priceCents: 120,
  previousPriceCents: 120,
  supplierId: "sup-1",
  stockQty: 50,
  minStockQty: 20,
};

const ingredients = new Map<string, Ingredient>([
  [mozzarella.id, mozzarella],
  [farina.id, farina],
]);

const pizza: Recipe = {
  id: "rec-pizza",
  name: "Pizza Margherita",
  category: "Pizze",
  items: [
    { ingredientId: "ing-farina", quantity: 250, wastePct: 0 },
    { ingredientId: "ing-mozzarella", quantity: 120, wastePct: 5 },
  ],
  packagingCents: 20,
  salePriceCents: 900, // 9,00 € IVA inclusa
  vatPct: 10,
  portions: 1,
  soldLast30: 300,
};

describe("ingredientCostCents", () => {
  it("converte g in kg e applica il prezzo", () => {
    // 250 g di farina a 1,20 €/kg = 0,30 €
    expect(ingredientCostCents(farina, 250, 0)).toBe(30);
  });

  it("considera lo scarto", () => {
    // 120 g resa con 5% scarto -> 126,3 g effettivi a 8,50 €/kg ≈ 1,07 €
    expect(ingredientCostCents(mozzarella, 120, 5)).toBe(107);
  });

  it("rifiuta scarto non valido", () => {
    expect(() => ingredientCostCents(farina, 100, 100)).toThrow();
  });
});

describe("computeFoodCost", () => {
  it("calcola costo porzione, food cost e margine", () => {
    const result = computeFoodCost(pizza, ingredients);
    // 30 + 107 + 20 packaging = 157 centesimi
    expect(result.costPerPortionCents).toBe(157);
    // 9,00 € lordi con IVA 10% -> 8,18 € netti
    expect(result.netSalePriceCents).toBe(818);
    expect(result.foodCostPct).toBeCloseTo(19.19, 1);
    expect(result.grossMarginCents).toBe(661);
    expect(result.status).toBe("ottimo");
  });

  it("segnala food cost critico", () => {
    const cara: Recipe = { ...pizza, salePriceCents: 350 };
    const result = computeFoodCost(cara, ingredients);
    expect(result.status).toBe("critico");
    expect(result.minPriceCents).toBeGreaterThan(350);
  });

  it("rifiuta porzioni non valide", () => {
    expect(() => computeFoodCost({ ...pizza, portions: 0 }, ingredients)).toThrow();
  });
});

describe("menuEngineering", () => {
  it("classifica Star, Cavallo da lavoro, Puzzle e Dog", () => {
    const star = { ...pizza, id: "r1", name: "Star", soldLast30: 400 };
    const workhorse: Recipe = {
      ...pizza,
      id: "r2",
      name: "Workhorse",
      soldLast30: 380,
      salePriceCents: 300,
    };
    const puzzle = { ...pizza, id: "r3", name: "Puzzle", soldLast30: 20 };
    const dog: Recipe = {
      ...pizza,
      id: "r4",
      name: "Dog",
      soldLast30: 10,
      salePriceCents: 280,
    };
    const results = menuEngineering([star, workhorse, puzzle, dog], ingredients);
    const byName = new Map(results.map((r) => [r.name, r.category]));
    expect(byName.get("Star")).toBe("Star");
    expect(byName.get("Workhorse")).toBe("Cavallo da lavoro");
    expect(byName.get("Puzzle")).toBe("Puzzle");
    expect(byName.get("Dog")).toBe("Dog");
  });

  it("gestisce menu vuoto", () => {
    expect(menuEngineering([], ingredients)).toEqual([]);
  });
});

describe("laborIncidence", () => {
  it("riproduce l'esempio del documento (35,8%)", () => {
    const result = laborIncidence(
      [{ staffId: "s1", name: "Team", role: "sala", hours: 43, hourlyCostCents: 1000 }],
      120000,
      86,
    );
    expect(result.laborCostCents).toBe(43000);
    expect(result.laborPct).toBeCloseTo(35.8, 1);
    expect(result.status).toBe("attenzione");
  });
});

describe("priceVariationPct", () => {
  it("calcola l'aumento percentuale", () => {
    expect(priceVariationPct(mozzarella)).toBeCloseTo(8.97, 1);
  });
});

describe("suggestedProduction", () => {
  it("riproduce l'esempio brioche del documento (48 -> 56)", () => {
    expect(suggestedProduction(48)).toBe(56);
  });
});
