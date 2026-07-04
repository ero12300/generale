import { describe, expect, it } from "vitest";
import { buildDoorScheme, computeDoorConfiguration, type DoorConfiguratorInput } from "@/lib/door-configurator";

describe("door configurator", () => {
  it("calcola una porta a compasso con riduzioni opera morta", () => {
    const input: DoorConfiguratorInput = {
      model: "compasso",
      wallOpeningWidthMm: 1000,
      wallOpeningHeightMm: 2150,
      deadWorkSideMm: 10,
      deadWorkTopMm: 10,
      deadWorkBottomMm: 10,
      hasDisplayPanel: false,
      hasOvalWindow: false,
      openingDirection: "destra",
      swingType: "spinge",
      handleSide: "sinistra",
    };

    const result = computeDoorConfiguration(input);
    expect(result.netFrameWidthMm).toBe(952);
    expect(result.netFrameHeightMm).toBe(2112);
    expect(result.leafWidthMm).toBe(946);
    expect(result.leafHeightMm).toBe(2101);
    expect(result.fixedPanelWidthMm).toBeNull();
  });

  it("calcola compasso con fisso e inserisce il pannello fisso nello schema", () => {
    const input: DoorConfiguratorInput = {
      model: "compasso_fisso",
      wallOpeningWidthMm: 1300,
      wallOpeningHeightMm: 2200,
      deadWorkSideMm: 12,
      deadWorkTopMm: 10,
      deadWorkBottomMm: 10,
      hasDisplayPanel: true,
      hasOvalWindow: true,
      openingDirection: "sinistra",
      swingType: "tira",
      handleSide: "destra",
    };

    const result = computeDoorConfiguration(input);
    expect(result.fixedPanelWidthMm).toBe(399);
    expect(result.leafWidthMm).toBe(839);

    const scheme = buildDoorScheme(input, result);
    expect(scheme).toContain("Pannello fisso: 399 mm");
    expect(scheme).toContain("Display/vetrata: SI");
    expect(scheme).toContain("Oblo ovale: SI");
  });
});
