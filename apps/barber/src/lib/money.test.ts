import { describe, expect, it } from "vitest";
import { applyDiscount, formatEuro, parseEuroToCents } from "./money";

describe("parseEuroToCents", () => {
  it("converte importi con virgola", () => {
    expect(parseEuroToCents("25,00")).toBe(2500);
    expect(parseEuroToCents("12,5")).toBe(1250);
  });

  it("converte importi con punto decimale", () => {
    expect(parseEuroToCents("25.00")).toBe(2500);
    expect(parseEuroToCents("9.99")).toBe(999);
  });

  it("converte interi", () => {
    expect(parseEuroToCents("30")).toBe(3000);
  });

  it("rifiuta importi non validi", () => {
    expect(() => parseEuroToCents("abc")).toThrow();
    expect(() => parseEuroToCents("-5")).toThrow();
    expect(() => parseEuroToCents("")).toThrow();
  });
});

describe("applyDiscount", () => {
  it("applica sconto percentuale", () => {
    expect(applyDiscount(2000, { discountPercent: 20 })).toEqual({
      finalCents: 1600,
      discountCents: 400,
    });
  });

  it("applica sconto fisso", () => {
    expect(applyDiscount(2000, { discountCents: 500 })).toEqual({
      finalCents: 1500,
      discountCents: 500,
    });
  });

  it("non va mai sotto zero", () => {
    expect(applyDiscount(500, { discountCents: 1000 })).toEqual({
      finalCents: 0,
      discountCents: 500,
    });
  });

  it("limita la percentuale al 100%", () => {
    expect(applyDiscount(1000, { discountPercent: 150 }).finalCents).toBe(0);
  });
});

describe("formatEuro", () => {
  it("formatta in EUR", () => {
    expect(formatEuro(2500)).toContain("25,00");
    expect(formatEuro(2500)).toContain("€");
  });
});
