import { describe, expect, it } from "vitest";
import { buildDoorExportText, calculateDoorConfiguration } from "@/lib/door-configurator";

describe("door configurator", () => {
  it("calcola misura produzione e verso porta", () => {
    const result = calculateDoorConfiguration({
      modelId: "compasso",
      openingWidthMm: 1000,
      openingHeightMm: 2200,
      wallThicknessMm: 120,
      deadWorkSideMm: 10,
      deadWorkTopMm: 8,
      deadWorkBottomMm: 5,
      hingeSide: "right",
      openingMovement: "pull",
      hasVisionPanel: true,
      hasOvalWindow: false,
      hasFixedLeaf: false,
      includeDisplay: false,
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.productionWidthMm).toBe(930);
    expect(result.data.productionHeightMm).toBe(2123);
    expect(result.data.openingSideLabel).toBe("destra");
    expect(result.data.handleSideLabel).toBe("sinistra");
    expect(result.data.handingLabel).toBe("destra a tirare");
  });

  it("aggiunge riduzione extra quando presente fisso", () => {
    const base = calculateDoorConfiguration({
      modelId: "compasso_fisso",
      openingWidthMm: 1400,
      openingHeightMm: 2300,
      wallThicknessMm: 140,
      deadWorkSideMm: 8,
      deadWorkTopMm: 8,
      deadWorkBottomMm: 8,
      hingeSide: "left",
      openingMovement: "push",
      hasVisionPanel: false,
      hasOvalWindow: false,
      hasFixedLeaf: false,
      includeDisplay: true,
    });
    const withFixed = calculateDoorConfiguration({
      modelId: "compasso_fisso",
      openingWidthMm: 1400,
      openingHeightMm: 2300,
      wallThicknessMm: 140,
      deadWorkSideMm: 8,
      deadWorkTopMm: 8,
      deadWorkBottomMm: 8,
      hingeSide: "left",
      openingMovement: "push",
      hasVisionPanel: false,
      hasOvalWindow: false,
      hasFixedLeaf: true,
      includeDisplay: true,
    });

    expect(base.ok).toBe(true);
    expect(withFixed.ok).toBe(true);
    if (!base.ok || !withFixed.ok) return;
    expect(base.data.productionWidthMm - withFixed.data.productionWidthMm).toBe(30);
  });

  it("genera export testuale leggibile", () => {
    const result = calculateDoorConfiguration({
      modelId: "fisso",
      openingWidthMm: 900,
      openingHeightMm: 2100,
      wallThicknessMm: 100,
      deadWorkSideMm: 10,
      deadWorkTopMm: 10,
      deadWorkBottomMm: 10,
      hingeSide: "left",
      openingMovement: "pull",
      hasVisionPanel: false,
      hasOvalWindow: true,
      hasFixedLeaf: true,
      includeDisplay: false,
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const text = buildDoorExportText(result.data);
    expect(text).toContain("SCHEDA PRODUZIONE PORTA");
    expect(text).toContain("Oblò ovale: Sì");
    expect(text).toContain(`Misura produzione (LxH): ${result.data.productionWidthMm} x ${result.data.productionHeightMm} mm`);
  });
});
