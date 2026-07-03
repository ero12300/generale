import { describe, expect, it } from "vitest";
import { applyPercentOff, formatEuro } from "./money";

describe("formatEuro", () => {
  it("formatta i centesimi in euro", () => {
    expect(formatEuro(2500)).toBe("€ 25,00");
    expect(formatEuro(3850)).toBe("€ 38,50");
    expect(formatEuro(5)).toBe("€ 0,05");
    expect(formatEuro(0)).toBe("€ 0,00");
  });

  it("gestisce importi negativi e migliaia", () => {
    expect(formatEuro(-1500)).toBe("-€ 15,00");
    expect(formatEuro(123456)).toBe("€ 1.234,56");
  });
});

describe("applyPercentOff", () => {
  it("calcola lo sconto percentuale in interi", () => {
    expect(applyPercentOff(2500, 10)).toBe(250);
    expect(applyPercentOff(3800, 20)).toBe(760);
    expect(applyPercentOff(2500, 15)).toBe(375);
  });

  it("arrotonda per difetto e limita il range 0-100", () => {
    expect(applyPercentOff(999, 33)).toBe(329);
    expect(applyPercentOff(1000, 150)).toBe(1000);
    expect(applyPercentOff(1000, -5)).toBe(0);
  });
});
