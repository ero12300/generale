import { describe, expect, it } from "vitest";
import { z } from "zod";
import { calcola } from "./engine";
import { generaSvg } from "./scheme";
import { configSchema, type Config } from "./types";

function cfg(overrides: Partial<z.input<typeof configSchema>> = {}): Config {
  return configSchema.parse({
    modelloId: "battente-classica",
    foroLarghezza: 900,
    foroAltezza: 2110,
    ...overrides,
  });
}

describe("generaSvg", () => {
  it("produce un SVG valido senza valori NaN", () => {
    const c = cfg();
    const svg = generaSvg(calcola(c), c);
    expect(svg.startsWith("<svg")).toBe(true);
    expect(svg).toContain("</svg>");
    expect(svg).not.toMatch(/NaN/);
    expect(svg).toContain("Foro L = 900 mm");
    expect(svg).toContain("DESTRA A SPINGERE");
  });

  it("disegna l'oblo' ovale quando selezionato", () => {
    const c = cfg({ opzioni: { oblo: "ovale" } });
    const svg = generaSvg(calcola(c), c);
    expect(svg).toContain("<ellipse");
  });

  it("disegna il sopraluce quando abilitato", () => {
    const c = cfg({ foroAltezza: 2500, opzioni: { sopraluce: true } });
    const svg = generaSvg(calcola(c), c);
    expect(svg).toContain("SOPRALUCE");
  });
});
