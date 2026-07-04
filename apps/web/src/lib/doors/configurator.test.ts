import { describe, expect, it } from "vitest";
import { buildDoorProductionExport, calculateDoorConfiguration } from "@/lib/doors/configurator";

describe("calculateDoorConfiguration", () => {
  it("calcola correttamente un caso filomuro standard", () => {
    const result = calculateDoorConfiguration({
      model: "filomuro",
      roughOpeningWidthMm: 810,
      roughOpeningHeightMm: 2160,
      wallThicknessMm: 100,
      deadWorkMm: 0,
      openingDirection: "destra",
      handleSide: "destra",
      hasGlass: false,
      hasOval: false,
      hasDisplay: false,
      includeFixedPanel: false,
    });

    expect(result.production.frameWidthMm).toBe(800);
    expect(result.production.frameHeightMm).toBe(2150);
    expect(result.production.leafWidthMm).toBe(700);
    expect(result.production.leafHeightMm).toBe(2100);
    expect(result.handing.hingeSide).toBe("sinistra");
  });

  it("calcola pannello fisso e anta attiva", () => {
    const result = calculateDoorConfiguration({
      model: "battente_con_fisso",
      roughOpeningWidthMm: 1400,
      roughOpeningHeightMm: 2160,
      wallThicknessMm: 120,
      deadWorkMm: 5,
      openingDirection: "sinistra",
      handleSide: "sinistra",
      hasGlass: true,
      hasOval: false,
      hasDisplay: true,
      includeFixedPanel: true,
      fixedPanelWidthMm: 320,
    });

    expect(result.production.fixedPanelWidthMm).toBe(320);
    expect(result.production.activeLeafWidthMm).toBeGreaterThan(600);
    expect(result.handing.hingeSide).toBe("destra");
  });
});

describe("buildDoorProductionExport", () => {
  it("include heading e sezioni principali", () => {
    const result = calculateDoorConfiguration({
      model: "battente_compasso",
      roughOpeningWidthMm: 900,
      roughOpeningHeightMm: 2160,
      wallThicknessMm: 100,
      deadWorkMm: 5,
      openingDirection: "destra",
      handleSide: "destra",
      hasGlass: false,
      hasOval: false,
      hasDisplay: false,
      includeFixedPanel: false,
    });
    const output = buildDoorProductionExport(result);
    expect(output).toContain("SCHEMA PRODUZIONE PORTA");
    expect(output).toContain("MISURE PRODUZIONE");
    expect(output).toContain("CONFIGURAZIONE");
  });
});
