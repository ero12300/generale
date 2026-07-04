import { describe, expect, it } from "vitest";
import { calculateDoorProductionSpec, type DoorProductionInput } from "./door-calculator";

const baseInput: DoorProductionInput = {
  openingWidthMm: 980,
  openingHeightMm: 2140,
  wallThicknessMm: 110,
  model: "single_hinged",
  hingeSide: "right",
  swing: "pull",
  installationGapWidthMm: 20,
  installationGapHeightMm: 12,
  frameProfileMm: 45,
  thresholdClearanceMm: 8,
  hasVisionPanel: false,
  hasDigitalViewer: false,
  hasOvalWindow: false,
};

describe("calculateDoorProductionSpec", () => {
  it("calcola telaio, anta, mano e maniglia per una porta battente singola", () => {
    const spec = calculateDoorProductionSpec(baseInput);

    expect(spec.unit.widthMm).toBe(960);
    expect(spec.unit.heightMm).toBe(2128);
    expect(spec.leaves).toEqual([
      {
        id: "anta",
        label: "Anta mobile",
        role: "active",
        widthMm: 870,
        heightMm: 2075,
      },
    ]);
    expect(spec.handing).toMatchObject({
      doorHand: "right",
      handleSide: "left",
      label: "Porta destra a tirare",
    });
    expect(spec.productionWarnings).toEqual([]);
  });

  it("divide una porta doppia in anta attiva e parte fissa con maniglia opposta alle cerniere", () => {
    const spec = calculateDoorProductionSpec({
      ...baseInput,
      openingWidthMm: 1420,
      model: "double_with_fixed",
      hingeSide: "left",
      activeLeafPercent: 60,
      hasVisionPanel: true,
      hasOvalWindow: true,
    });

    expect(spec.clearPassage.widthMm).toBe(1310);
    expect(spec.leaves).toEqual([
      {
        id: "anta-attiva",
        label: "Anta attiva",
        role: "active",
        widthMm: 786,
        heightMm: 2075,
      },
      {
        id: "parte-fissa",
        label: "Anta fissa / opera morta",
        role: "fixed",
        widthMm: 524,
        heightMm: 2075,
      },
    ]);
    expect(spec.handing.handleSide).toBe("right");
    expect(spec.accessories).toEqual(["Vetro/display visivo", "Oblo ovale"]);
  });

  it("segnala dimensioni non producibili quando il vano e troppo piccolo", () => {
    const spec = calculateDoorProductionSpec({
      ...baseInput,
      openingWidthMm: 520,
      openingHeightMm: 1800,
    });

    expect(spec.productionWarnings).toContain("Larghezza anta sotto 600 mm: verificare fattibilita con il produttore.");
    expect(spec.productionWarnings).toContain("Altezza anta sotto 1900 mm: verificare passaggio e norme locali.");
  });
});
