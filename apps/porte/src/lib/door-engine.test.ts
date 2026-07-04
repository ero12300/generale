import { describe, expect, it } from "vitest";
import {
  calculateDoor,
  calculatePanelDimensions,
  resolveHardwareSides,
  roundToProductionMm,
  validateOpening,
} from "./door-engine";
import { getDoorModel } from "./door-models";

describe("door-engine", () => {
  const standardOpening = {
    widthMm: 900,
    heightMm: 2150,
    wallThicknessMm: 120,
  };

  const standardDeadWork = {
    widthMm: 100,
    heightMm: 50,
    floorClearanceMm: 10,
  };

  it("calcola anta 800x2100 da foro 900x2150 con lavoro morto standard", () => {
    const result = calculatePanelDimensions(standardOpening, standardDeadWork);
    expect(result.panelWidthMm).toBe(800);
    expect(result.panelHeightMm).toBe(2090);
  });

  it("arrotonda al multiplo di 5 mm", () => {
    expect(roundToProductionMm(803)).toBe(805);
    expect(roundToProductionMm(802)).toBe(800);
  });

  it("risolve maniglia opposta alle cerniere", () => {
    expect(resolveHardwareSides("dx_tirare")).toEqual({
      hingeSide: "right",
      handleSide: "left",
    });
    expect(resolveHardwareSides("sx_spingere")).toEqual({
      hingeSide: "left",
      handleSide: "right",
    });
  });

  it("genera porta completa con modello battente", () => {
    const model = getDoorModel("battente-liscia")!;
    const door = calculateDoor(
      standardOpening,
      standardDeadWork,
      model,
      "dx_tirare",
    );
    expect(door.panelWidthMm).toBe(800);
    expect(door.hingeSide).toBe("right");
    expect(door.handleSide).toBe("left");
    expect(door.openingLabel).toBe("Destra a tirare");
  });

  it("porta fissa non richiede apertura", () => {
    const model = getDoorModel("fissa-liscia")!;
    const door = calculateDoor(standardOpening, standardDeadWork, model, null);
    expect(door.openingDirection).toBeNull();
    expect(door.handleSide).toBeNull();
  });

  it("valida foro troppo stretto", () => {
    const result = validateOpening(
      { widthMm: 500, heightMm: 2150, wallThicknessMm: 120 },
      standardDeadWork,
    );
    expect(result.valid).toBe(false);
  });
});
