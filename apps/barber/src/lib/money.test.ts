import { describe, it, expect } from "vitest";
import { eur, parseEuroToCents, applyDiscount } from "./money";

describe("money", () => {
  it("formatta centesimi in EUR", () => {
    expect(eur(2000)).toContain("20,00");
    expect(eur(0)).toContain("0,00");
    expect(eur(150)).toContain("1,50");
  });

  it("converte stringhe euro in centesimi senza usare float", () => {
    expect(parseEuroToCents("20,00")).toBe(2000);
    expect(parseEuroToCents("€ 25")).toBe(2500);
    expect(parseEuroToCents("1.234,50")).toBe(123450);
    expect(parseEuroToCents("abc")).toBe(0);
  });

  it("applica sconto percentuale correttamente", () => {
    const r = applyDiscount(2000, "percentuale", 20);
    expect(r.discountCents).toBe(400);
    expect(r.finalCents).toBe(1600);
  });

  it("applica sconto fisso senza andare sotto zero", () => {
    const r = applyDiscount(2000, "fisso", 500);
    expect(r.discountCents).toBe(500);
    expect(r.finalCents).toBe(1500);

    const capped = applyDiscount(2000, "fisso", 5000);
    expect(capped.discountCents).toBe(2000);
    expect(capped.finalCents).toBe(0);
  });

  it("limita la percentuale tra 0 e 100", () => {
    expect(applyDiscount(2000, "percentuale", 150).finalCents).toBe(0);
    expect(applyDiscount(2000, "percentuale", -10).discountCents).toBe(0);
  });
});
