import { describe, expect, it } from "vitest";
import { calculateDoorConfiguration } from "@/lib/doors/configurator";

const baseInput = {
  roomName: "Bagno ospiti",
  model: "hinged_single",
  openingDirection: "right",
  wallOpening: {
    widthTopMm: 902,
    widthMiddleMm: 900,
    widthBottomMm: 898,
    heightLeftMm: 2152,
    heightRightMm: 2150,
    wallDepthMm: 110,
    finishedFloor: true,
  },
  accessories: {
    hasDisplay: false,
    hasOvalWindow: false,
    hasFixedPanel: false,
  },
} as const;

describe("calculateDoorConfiguration", () => {
  it("usa la misura piu piccola del foro e calcola una porta battente pronta per produzione", () => {
    const result = calculateDoorConfiguration(baseInput);

    expect(result.clearOpening.widthMm).toBe(898);
    expect(result.clearOpening.heightMm).toBe(2150);
    expect(result.leaf.widthMm).toBe(809);
    expect(result.leaf.heightMm).toBe(2100);
    expect(result.handleSide).toBe("left");
    expect(result.productionWarnings).toContain(
      "Rilevare sempre tre larghezze e due altezze: il calcolo usa la quota piu piccola."
    );
  });

  it("genera opera morta/fisso laterale quando il foro supera la larghezza massima dell'anta", () => {
    const result = calculateDoorConfiguration({
      ...baseInput,
      model: "hinged_with_fixed_panel",
      wallOpening: {
        ...baseInput.wallOpening,
        widthTopMm: 1280,
        widthMiddleMm: 1278,
        widthBottomMm: 1276,
      },
      accessories: {
        ...baseInput.accessories,
        hasFixedPanel: true,
      },
    });

    expect(result.leaf.widthMm).toBe(900);
    expect(result.fixedPanel?.widthMm).toBe(277);
    expect(result.fixedPanel?.side).toBe("left");
  });

  it("calcola anta scorrevole esterno muro con sormonto sul foro e maniglia a conchiglia", () => {
    const result = calculateDoorConfiguration({
      ...baseInput,
      model: "sliding_external",
      openingDirection: "left",
      wallOpening: {
        ...baseInput.wallOpening,
        widthTopMm: 900,
        widthMiddleMm: 900,
        widthBottomMm: 900,
      },
      accessories: {
        hasDisplay: true,
        hasOvalWindow: true,
        hasFixedPanel: false,
      },
    });

    expect(result.leaf.widthMm).toBe(1000);
    expect(result.handleSide).toBe("left");
    expect(result.hardwareNotes).toContain("Maniglia a conchiglia lato sinistro");
    expect(result.schemeLines).toContain("Display: si");
    expect(result.schemeLines).toContain("Ovale: si");
  });
});
