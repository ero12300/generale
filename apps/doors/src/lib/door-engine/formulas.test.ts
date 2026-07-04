import { describe, expect, it } from "vitest";
import { calculateDoorPlan } from "./formulas";

describe("calculateDoorPlan", () => {
  it("reduces the rough wall opening into production dimensions for a hinged door", () => {
    const plan = calculateDoorPlan({
      roughOpening: { widthMm: 900, heightMm: 2100, wallThicknessMm: 120 },
      model: "hinged",
      hingeSide: "right",
      swing: "in",
      options: {
        hasDisplay: true,
        hasOvalWindow: false,
        fixedPanel: "auto",
      },
    });

    expect(plan.frame.outerWidthMm).toBe(880);
    expect(plan.frame.outerHeightMm).toBe(2083);
    expect(plan.frame.depthMm).toBe(120);
    expect(plan.activeLeaf.widthMm).toBe(786);
    expect(plan.activeLeaf.heightMm).toBe(2028);
    expect(plan.deadWork.widthMm).toBe(0);
    expect(plan.handing.handleSide).toBe("left");
    expect(plan.productionNotes).toContain("Porta battente destra a tirare");
  });

  it("adds dead work on the handle side when the active leaf would be too wide", () => {
    const plan = calculateDoorPlan({
      roughOpening: { widthMm: 1280, heightMm: 2150, wallThicknessMm: 145 },
      model: "hinged",
      hingeSide: "left",
      swing: "out",
      options: {
        hasDisplay: false,
        hasOvalWindow: true,
        fixedPanel: "auto",
      },
    });

    expect(plan.activeLeaf.widthMm).toBe(920);
    expect(plan.deadWork).toEqual({
      side: "right",
      widthMm: 246,
      reason: "Lavoro morto aggiunto per limite anta 920 mm",
    });
    expect(plan.handing.handleSide).toBe("right");
    expect(plan.handing.openingLabel).toBe("sinistra a spingere");
  });

  it("keeps a fixed model as a production panel without handle or swing clearance", () => {
    const plan = calculateDoorPlan({
      roughOpening: { widthMm: 760, heightMm: 2050, wallThicknessMm: 100 },
      model: "fixed",
      hingeSide: "left",
      swing: "in",
      options: {
        hasDisplay: false,
        hasOvalWindow: true,
        fixedPanel: "forced",
      },
    });

    expect(plan.activeLeaf.widthMm).toBe(660);
    expect(plan.deadWork.widthMm).toBe(0);
    expect(plan.handing.handleSide).toBe("none");
    expect(plan.hardware).toContain("Pannello fisso senza ferramenta di apertura");
  });
});
