import { describe, expect, it } from "vitest";
import { applyMarginBp, formatEuroCents, marginCents } from "./money";

describe("applyMarginBp", () => {
  it("applica il 25% di margine a 180,00 €", () => {
    expect(applyMarginBp(18000, 2500)).toBe(22500);
  });

  it("arrotonda per eccesso al centesimo", () => {
    // 10,01 € + 15% = 11,5115 € -> 11,52 €
    expect(applyMarginBp(1001, 1500)).toBe(1152);
  });

  it("margine zero restituisce il costo", () => {
    expect(applyMarginBp(5000, 0)).toBe(5000);
  });

  it("rifiuta valori non interi o negativi", () => {
    expect(() => applyMarginBp(10.5, 2000)).toThrow();
    expect(() => applyMarginBp(-1, 2000)).toThrow();
    expect(() => applyMarginBp(100, -5)).toThrow();
  });
});

describe("marginCents", () => {
  it("calcola il margine assoluto", () => {
    expect(marginCents(22500, 18000)).toBe(4500);
  });
});

describe("formatEuroCents", () => {
  it("formatta in euro italiano", () => {
    expect(formatEuroCents(22500)).toMatch(/225[,.]00/);
  });
});
