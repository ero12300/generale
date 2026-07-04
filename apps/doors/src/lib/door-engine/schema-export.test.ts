import { describe, expect, it } from "vitest";
import { calculateDoorPlan } from "./formulas";
import { createDoorExport } from "./schema-export";

describe("createDoorExport", () => {
  it("creates deterministic JSON and SVG with production labels", () => {
    const plan = calculateDoorPlan({
      roughOpening: { widthMm: 1280, heightMm: 2150, wallThicknessMm: 145 },
      model: "compass",
      hingeSide: "right",
      swing: "in",
      options: {
        hasDisplay: true,
        hasOvalWindow: true,
        fixedPanel: "auto",
      },
    });

    const exported = createDoorExport(plan);

    expect(exported.fileName).toBe("porta-compasso-destra-a-tirare-1260x2133.json");
    expect(exported.json.modelLabel).toBe("Porta a compasso");
    expect(exported.json.frame).toEqual({
      outerWidthMm: 1260,
      outerHeightMm: 2133,
      depthMm: 145,
    });
    expect(exported.svg).toContain("<title>Schema Porta a compasso");
    expect(exported.svg).toContain("Maniglia: sinistra");
    expect(exported.svg).toContain("Oblo ovale");
    expect(exported.svg).toContain("Display");
  });
});
