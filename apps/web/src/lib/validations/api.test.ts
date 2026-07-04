import { describe, expect, it } from "vitest";
import { createDealSchema, doorConfiguratorSchema, updateDealSchema } from "@/lib/validations/api";

describe("createDealSchema", () => {
  it("accetta un deal valido", () => {
    const result = createDealSchema.safeParse({
      title: "Trilocale Milano",
      strategy: "fix_flip",
    });
    expect(result.success).toBe(true);
  });

  it("rifiuta titolo vuoto", () => {
    const result = createDealSchema.safeParse({ title: "   " });
    expect(result.success).toBe(false);
  });
});

describe("updateDealSchema", () => {
  it("accetta cambio stage", () => {
    const result = updateDealSchema.safeParse({ stage: "offer" });
    expect(result.success).toBe(true);
  });

  it("rifiuta body vuoto", () => {
    const result = updateDealSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});

describe("doorConfiguratorSchema", () => {
  it("accetta misure porta valide", () => {
    const result = doorConfiguratorSchema.safeParse({
      projectName: "Cantiere Porta",
      roomName: "Camera",
      model: "hinged",
      openingDirection: "push",
      hingeSide: "left",
      wallOpening: {
        widthTopMm: 820,
        widthMiddleMm: 818,
        widthBottomMm: 819,
        heightLeftMm: 2100,
        heightRightMm: 2098,
        wallThicknessMm: 105,
      },
      options: {
        hasFixedPanel: false,
        hasCompassLeaf: false,
        hasDisplay: false,
        hasOval: true,
      },
      allowances: {
        installGapSideMm: 10,
        installGapTopMm: 10,
        undercutMm: 8,
        frameFaceMm: 25,
        deadWorkDepthMm: 30,
      },
    });

    expect(result.success).toBe(true);
  });

  it("rifiuta un vano troppo piccolo per la produzione", () => {
    const result = doorConfiguratorSchema.safeParse({
      projectName: "Cantiere Porta",
      roomName: "Ripostiglio",
      model: "hinged",
      openingDirection: "push",
      hingeSide: "left",
      wallOpening: {
        widthTopMm: 350,
        widthMiddleMm: 350,
        widthBottomMm: 350,
        heightLeftMm: 1800,
        heightRightMm: 1800,
        wallThicknessMm: 80,
      },
      options: {
        hasFixedPanel: false,
        hasCompassLeaf: false,
        hasDisplay: false,
        hasOval: false,
      },
      allowances: {
        installGapSideMm: 10,
        installGapTopMm: 10,
        undercutMm: 8,
        frameFaceMm: 25,
        deadWorkDepthMm: 30,
      },
    });

    expect(result.success).toBe(false);
  });
});
