import { describe, expect, it } from "vitest";
import { calculateFoodCost, classifyFoodCost, buildMenuEngineering } from "./engine";
import type { Recipe, RecipeItem } from "@ristoprofit/types";

const pizzaRecipe: Recipe = {
  id: "r1",
  organization_id: "org1",
  location_id: null,
  name: "Pizza Pistacchio",
  category: "Pizze",
  sale_price_cents: 1300,
  vat_rate: 0.1,
  portions: 1,
  packaging_cost_cents: 20,
  description: null,
  is_active: true,
  created_at: "",
  updated_at: "",
};

const pizzaItems: RecipeItem[] = [
  {
    id: "ri1",
    recipe_id: "r1",
    ingredient_id: "i1",
    quantity: 0.25,
    unit: "kg",
    ingredient_name: "Impasto",
    unit_price_cents: 180,
    waste_percent: 5,
  },
  {
    id: "ri2",
    recipe_id: "r1",
    ingredient_id: "i2",
    quantity: 0.08,
    unit: "kg",
    ingredient_name: "Pistacchio",
    unit_price_cents: 4500,
    waste_percent: 2,
  },
];

describe("calculateFoodCost", () => {
  it("calcola food cost e margine per pizza pistacchio", () => {
    const result = calculateFoodCost(pizzaRecipe, pizzaItems);
    expect(result.cost_per_portion_cents).toBeGreaterThan(0);
    expect(result.food_cost_percent).toBeGreaterThan(0);
    expect(result.gross_margin_cents).toBeLessThan(pizzaRecipe.sale_price_cents);
    expect(result.min_recommended_price_cents).toBeGreaterThanOrEqual(
      result.cost_per_portion_cents
    );
  });
});

describe("classifyFoodCost", () => {
  it("classifica stati correttamente", () => {
    expect(classifyFoodCost(25)).toBe("excellent");
    expect(classifyFoodCost(30)).toBe("good");
    expect(classifyFoodCost(36)).toBe("warning");
    expect(classifyFoodCost(45)).toBe("critical");
  });
});

describe("buildMenuEngineering", () => {
  it("assegna categorie star/workhorse/puzzle/dog", () => {
    const recipes: Recipe[] = [
      { ...pizzaRecipe, id: "a", name: "Star", sale_price_cents: 1500 },
      { ...pizzaRecipe, id: "b", name: "Dog", sale_price_cents: 800 },
    ];
    const itemsA = pizzaItems.map((i) => ({ ...i, recipe_id: "a" }));
    const itemsB = pizzaItems.map((i) => ({
      ...i,
      recipe_id: "b",
      unit_price_cents: (i.unit_price_cents ?? 0) * 2,
    }));
    const costs = [
      calculateFoodCost(recipes[0], itemsA),
      calculateFoodCost(recipes[1], itemsB),
    ];
    const engineering = buildMenuEngineering(costs, { a: 100, b: 5 });
    expect(engineering).toHaveLength(2);
    expect(engineering.find((e) => e.recipe_id === "a")?.category).toBe("star");
  });
});
