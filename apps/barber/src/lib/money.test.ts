import { describe, expect, it } from "vitest";
import { formatEuro, parseEuroInput, percentOf } from "./money";

describe("parseEuroInput", () => {
  it("accetta interi", () => {
    expect(parseEuroInput("25")).toBe(2500);
  });
  it("accetta virgola italiana", () => {
    expect(parseEuroInput("24,50")).toBe(2450);
  });
  it("accetta punto decimale", () => {
    expect(parseEuroInput("24.50")).toBe(2450);
  });
  it("rifiuta input non numerici", () => {
    expect(parseEuroInput("abc")).toBeNull();
    expect(parseEuroInput("")).toBeNull();
    expect(parseEuroInput("-5")).toBeNull();
  });
  it("rifiuta più di due decimali", () => {
    expect(parseEuroInput("1,999")).toBeNull();
  });
});

describe("percentOf", () => {
  it("calcola la percentuale con arrotondamento", () => {
    expect(percentOf(2500, 10)).toBe(250);
    expect(percentOf(3333, 10)).toBe(333);
    expect(percentOf(2500, 33)).toBe(825);
  });
});

describe("formatEuro", () => {
  it("formatta in euro italiano", () => {
    const out = formatEuro(2450);
    expect(out).toContain("24,50");
    expect(out).toContain("€");
  });
});
