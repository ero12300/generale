import { describe, it, expect } from "vitest";
import {
  eurosToCents,
  sumCents,
  applyPercentDiscount,
  applyFixedDiscount,
  formatCents,
} from "./money";

describe("money", () => {
  it("converte euro (numero) in centesimi interi", () => {
    expect(eurosToCents(20)).toBe(2000);
    expect(eurosToCents(18.5)).toBe(1850);
    expect(eurosToCents(0.1)).toBe(10);
  });

  it("converte stringhe con virgola e punto migliaia", () => {
    expect(eurosToCents("20,00")).toBe(2000);
    expect(eurosToCents("1.250,50")).toBe(125050);
    expect(eurosToCents("abc")).toBe(0);
  });

  it("somma centesimi senza errori di float", () => {
    expect(sumCents([10, 20, 30])).toBe(60);
    // 0.1 + 0.2 problem non deve verificarsi in centesimi interi
    expect(sumCents([eurosToCents(0.1), eurosToCents(0.2)])).toBe(30);
  });

  it("applica sconto percentuale", () => {
    expect(applyPercentDiscount(2000, 10)).toBe(1800);
    expect(applyPercentDiscount(2000, 0)).toBe(2000);
    expect(applyPercentDiscount(2000, 100)).toBe(0);
    // clamp fuori range
    expect(applyPercentDiscount(2000, 150)).toBe(0);
    expect(applyPercentDiscount(2000, -10)).toBe(2000);
  });

  it("applica sconto fisso senza andare sotto zero", () => {
    expect(applyFixedDiscount(2000, 500)).toBe(1500);
    expect(applyFixedDiscount(300, 500)).toBe(0);
  });

  it("formatta in valuta EUR italiana", () => {
    expect(formatCents(2000)).toContain("20,00");
    expect(formatCents(2000)).toContain("€");
    expect(formatCents(null)).toBe("—");
    expect(formatCents(2000, { withDecimals: false })).not.toContain(",00");
  });
});
