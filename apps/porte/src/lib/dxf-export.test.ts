import { describe, expect, it } from "vitest";
import { getDoorModel } from "./door-models";
import { calculateDoor } from "./door-engine";
import { generateDoorDxf } from "./dxf-export";

describe("dxf-export", () => {
  const opening = { widthMm: 900, heightMm: 2150, wallThicknessMm: 120 };
  const deadWork = { widthMm: 100, heightMm: 50, floorClearanceMm: 10 };

  it("genera DXF valido con sezioni standard", () => {
    const model = getDoorModel("battente-display")!;
    const door = calculateDoor(opening, deadWork, model, "dx_tirare");
    const dxf = generateDoorDxf(door);

    expect(dxf).toContain("SECTION");
    expect(dxf).toContain("ENTITIES");
    expect(dxf).toContain("EOF");
    expect(dxf).toContain("AC1015");
    expect(dxf).toContain("TELAIO");
    expect(dxf).toContain("ANTA");
    expect(dxf).toContain("VETRO");
    expect(dxf).toContain("DISPLAY");
    expect(dxf).toContain("QUOTE");
  });

  it("include layer ferramenta per porta battente", () => {
    const model = getDoorModel("battente-liscia")!;
    const door = calculateDoor(opening, deadWork, model, "sx_tirare");
    const dxf = generateDoorDxf(door);

    expect(dxf).toContain("FERRAMENTA");
    expect(dxf).toContain("Maniglia a destra");
    expect(dxf).toContain("Cerniere a sinistra");
  });

  it("include layer fissa per bussola", () => {
    const model = getDoorModel("bussola-fissa")!;
    const door = calculateDoor(opening, deadWork, model, "dx_tirare");
    const dxf = generateDoorDxf(door);

    expect(dxf).toContain("FISSA");
  });
});
