import { describe, expect, it } from "vitest";
import { calculateDoorSpec, createDoorExport } from "./door-calculator";

describe("calculateDoorSpec", () => {
  it("usa la misura minore del vano e calcola una porta battente pronta produzione", () => {
    const spec = calculateDoorSpec({
      projectName: "Trilocale Milano",
      roomName: "Camera 1",
      model: "hinged",
      openingDirection: "push",
      hingeSide: "right",
      wallOpening: {
        widthTopMm: 820,
        widthMiddleMm: 815,
        widthBottomMm: 818,
        heightLeftMm: 2110,
        heightRightMm: 2104,
        wallThicknessMm: 105,
      },
      options: {
        hasFixedPanel: false,
        hasCompassLeaf: false,
        hasDisplay: true,
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

    expect(spec.clearOpening.widthMm).toBe(815);
    expect(spec.clearOpening.heightMm).toBe(2104);
    expect(spec.production.frameOuterWidthMm).toBe(795);
    expect(spec.production.frameOuterHeightMm).toBe(2094);
    expect(spec.production.leafWidthMm).toBe(745);
    expect(spec.production.leafHeightMm).toBe(2086);
    expect(spec.handing.handleSide).toBe("left");
    expect(spec.handing.label).toBe("A spingere destra, maniglia a sinistra");
    expect(spec.production.deadWork.widthMm).toBe(845);
    expect(spec.warnings).toContain("Verifica vetro di sicurezza per display/ovale.");
  });

  it("calcola porta scorrevole a scomparsa con anta ricavata dal mezzo vano", () => {
    const spec = calculateDoorSpec({
      projectName: "Bagno",
      roomName: "Bagno ospiti",
      model: "pocket",
      openingDirection: "slide",
      hingeSide: "left",
      wallOpening: {
        widthTopMm: 1710,
        widthMiddleMm: 1700,
        widthBottomMm: 1706,
        heightLeftMm: 2140,
        heightRightMm: 2130,
        wallThicknessMm: 125,
      },
      options: {
        hasFixedPanel: false,
        hasCompassLeaf: false,
        hasDisplay: false,
        hasOval: true,
      },
      allowances: {
        installGapSideMm: 10,
        installGapTopMm: 20,
        undercutMm: 12,
        frameFaceMm: 20,
        deadWorkDepthMm: 45,
      },
    });

    expect(spec.production.leafWidthMm).toBe(830);
    expect(spec.production.frameOuterWidthMm).toBe(1680);
    expect(spec.handing.label).toBe("Scorre verso sinistra, presa a destra");
    expect(spec.hardware).toContain("Kit controtelaio/scrigno");
    expect(spec.warnings).toContain("Serve parete libera laterale almeno pari alla larghezza anta.");
  });
});

describe("createDoorExport", () => {
  it("produce uno schema testuale con misure, verso e accessori", () => {
    const spec = calculateDoorSpec({
      projectName: "Export",
      roomName: "Ingresso",
      model: "hinged",
      openingDirection: "pull",
      hingeSide: "left",
      wallOpening: {
        widthTopMm: 900,
        widthMiddleMm: 900,
        widthBottomMm: 898,
        heightLeftMm: 2200,
        heightRightMm: 2194,
        wallThicknessMm: 110,
      },
      options: {
        hasFixedPanel: true,
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

    const exported = createDoorExport(spec);

    expect(exported).toContain("SCHEMA PORTA - Export");
    expect(exported).toContain("Ambiente: Ingresso");
    expect(exported).toContain("Verso: A tirare sinistra, maniglia a destra");
    expect(exported).toContain("Anta fissa: sì");
    expect(exported).toContain("Ovale: sì");
    expect(exported).toContain("Anta produzione:");
  });
});
