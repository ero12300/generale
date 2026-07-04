import { describe, expect, it } from "vitest";
import type { DoorConfigurationResult } from "@deal-desk/types";
import { buildDoorVisualLayout } from "./visual-layout";

function baseResult(overrides: Partial<DoorConfigurationResult> = {}): DoorConfigurationResult {
  return {
    input: {
      roomName: "Test",
      model: "hinged_with_fixed_panel",
      openingDirection: "right",
      wallOpening: {
        widthTopMm: 1200,
        widthMiddleMm: 1200,
        widthBottomMm: 1200,
        heightLeftMm: 2100,
        heightRightMm: 2100,
        wallDepthMm: 100,
        finishedFloor: true,
      },
      accessories: { hasDisplay: false, hasOvalWindow: false, hasFixedPanel: true },
      fixedPanelSpec: { manualWidthMm: 900, leafGapMm: 10 },
    },
    modelLabel: "Battente con fisso",
    clearOpening: { widthMm: 1200, heightMm: 2100, wallDepthMm: 100 },
    frame: { outsideWidthMm: 1200, outsideHeightMm: 2100, passageWidthMm: 1177, passageHeightMm: 2077 },
    leaf: { widthMm: 267, heightMm: 2100, quantity: 1 },
    fixedPanel: { widthMm: 900, heightMm: 2077, side: "left", leafGapMm: 10 },
    openingDirection: "right",
    handleSide: "left",
    hardwareNotes: [],
    productionWarnings: [],
    schemeLines: [],
    schemaSvg: "",
    ...overrides,
  };
}

describe("buildDoorVisualLayout", () => {
  it("ordina opera morta, aria e anta da sinistra quando il fisso è a sinistra", () => {
    const layout = buildDoorVisualLayout(baseResult());
    expect(layout.segments.map((segment) => segment.kind)).toEqual(["fixed", "gap", "leaf"]);
    expect(layout.segments.map((segment) => segment.widthMm)).toEqual([900, 10, 267]);
  });

  it("mette l'anta prima dell'opera morta se il fisso è a destra", () => {
    const layout = buildDoorVisualLayout(
      baseResult({
        fixedPanel: { widthMm: 500, heightMm: 2077, side: "right", leafGapMm: 8 },
        leaf: { widthMm: 669, heightMm: 2100, quantity: 1 },
      })
    );
    expect(layout.segments.map((segment) => segment.kind)).toEqual(["leaf", "gap", "fixed"]);
  });
});
