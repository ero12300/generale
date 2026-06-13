import { describe, it, expect } from "vitest";
import { computeMenuEngineering } from "./menu-engineering";

describe("computeMenuEngineering", () => {
  it("classifica correttamente le quattro categorie", () => {
    const result = computeMenuEngineering([
      // alta popolarità + alto margine = star
      { id: "star", name: "Pizza Pistacchio", unitsSold: 120, marginCents: 880 },
      // bassa popolarità + alto margine = puzzle
      { id: "puzzle", name: "Tagliere Aperitivo", unitsSold: 15, marginCents: 1500 },
      // alta popolarità + basso margine = cavallo
      { id: "cavallo", name: "Margherita", unitsSold: 110, marginCents: 300 },
      // bassa popolarità + basso margine = dog
      { id: "dog", name: "Insalata triste", unitsSold: 8, marginCents: 200 },
    ]);

    const byId = Object.fromEntries(result.items.map((i) => [i.id, i.category]));
    expect(byId.star).toBe("star");
    expect(byId.puzzle).toBe("puzzle");
    expect(byId.cavallo).toBe("cavallo");
    expect(byId.dog).toBe("dog");

    expect(result.counts.star).toBe(1);
    expect(result.counts.puzzle).toBe(1);
    expect(result.counts.cavallo).toBe(1);
    expect(result.counts.dog).toBe(1);
  });

  it("calcola quota popolarità e margine totale", () => {
    const result = computeMenuEngineering([
      { id: "a", name: "A", unitsSold: 50, marginCents: 500 },
      { id: "b", name: "B", unitsSold: 50, marginCents: 500 },
    ]);
    const a = result.items.find((i) => i.id === "a")!;
    expect(a.popularityShare).toBeCloseTo(0.5, 5);
    expect(a.totalMarginCents).toBe(25000);
    expect(result.averageMarginCents).toBe(500);
  });

  it("ritorna risultato vuoto coerente su lista vuota", () => {
    const result = computeMenuEngineering([]);
    expect(result.items).toHaveLength(0);
    expect(result.counts.star).toBe(0);
    expect(result.averageMarginCents).toBe(0);
  });

  it("assegna un'azione consigliata a ogni prodotto", () => {
    const result = computeMenuEngineering([
      { id: "a", name: "A", unitsSold: 100, marginCents: 900 },
    ]);
    expect(result.items[0].action.length).toBeGreaterThan(0);
  });
});
