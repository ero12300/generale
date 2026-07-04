import { describe, expect, it } from "vitest";
import { calculateDoorConfiguration } from "@/lib/doors/configurator";
import { buildDoorSchemaSvg } from "@/lib/doors/schema-svg";

const baseInput = {
  roomName: "Soggiorno",
  model: "hinged_with_fixed_panel" as const,
  openingDirection: "right" as const,
  wallOpening: {
    widthTopMm: 1280,
    widthMiddleMm: 1278,
    widthBottomMm: 1276,
    heightLeftMm: 2150,
    heightRightMm: 2150,
    wallDepthMm: 110,
    finishedFloor: true,
  },
  accessories: {
    hasDisplay: false,
    hasOvalWindow: false,
    hasFixedPanel: true,
  },
  fixedPanelSpec: {
    manualWidthMm: 900,
    leafGapMm: 10,
  },
};

describe("buildDoorSchemaSvg", () => {
  it("genera un SVG con quote anta, fisso e aria", () => {
    const result = calculateDoorConfiguration(baseInput);
    const svg = buildDoorSchemaSvg(result);

    expect(svg).toContain("<svg");
    expect(svg).toContain("Soggiorno");
    expect(svg).toContain("aria 10");
    expect(svg).toContain(">900<");
    expect(svg).toContain(">267<");
  });
});
