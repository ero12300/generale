import { describe, expect, it } from "vitest";
import {
  buildDoorExportPayload,
  calculateDoorConfiguration,
  createDoorSchemaSvg,
} from "@/lib/configurator";

describe("calculateDoorConfiguration", () => {
  it("riduce il vano muro secondo il modello e deriva il lato maniglia", () => {
    const result = calculateDoorConfiguration({
      modelId: "classic-battente",
      openingWidthMm: 900,
      openingHeightMm: 2100,
      wallThicknessMm: 110,
      composition: "single",
      glassVariant: "none",
      hasOvalWindow: false,
      hingeSide: "right",
      swingDirection: "push",
    });

    expect(result.model.name).toBe("Classic battente");
    expect(result.production.frameWidthMm).toBe(760);
    expect(result.production.frameHeightMm).toBe(2010);
    expect(result.production.leafWidthMm).toBe(760);
    expect(result.production.leafHeightMm).toBe(2000);
    expect(result.orientation.handleSide).toBe("left");
    expect(result.orientation.openingLabel).toBe("Destra a spingere");
  });

  it("gestisce una porta con pannello fisso e divide correttamente le misure", () => {
    const result = calculateDoorConfiguration({
      modelId: "glass-suite",
      openingWidthMm: 1400,
      openingHeightMm: 2150,
      wallThicknessMm: 125,
      composition: "single-fixed-left",
      glassVariant: "full",
      hasOvalWindow: false,
      hingeSide: "left",
      swingDirection: "pull",
    });

    expect(result.production.frameWidthMm).toBe(1260);
    expect(result.production.fixedPanelWidthMm).toBe(360);
    expect(result.production.leafWidthMm).toBe(900);
    expect(result.orientation.handleSide).toBe("right");
    expect(result.summary.features).toContain("Fisso sinistro");
    expect(result.summary.features).toContain("Vetrata intera");
  });

  it("blocca configurazioni con muro troppo sottile", () => {
    expect(() =>
      calculateDoorConfiguration({
        modelId: "classic-battente",
        openingWidthMm: 900,
        openingHeightMm: 2100,
        wallThicknessMm: 70,
        composition: "single",
        glassVariant: "none",
        hasOvalWindow: false,
        hingeSide: "right",
        swingDirection: "push",
      })
    ).toThrow("Spessore muro insufficiente");
  });
});

describe("door export", () => {
  it("genera una scheda produzione con i campi principali", () => {
    const configuration = calculateDoorConfiguration({
      modelId: "atelier-oval",
      openingWidthMm: 1000,
      openingHeightMm: 2200,
      wallThicknessMm: 120,
      composition: "single",
      glassVariant: "slit",
      hasOvalWindow: true,
      hingeSide: "left",
      swingDirection: "push",
    });

    const payload = buildDoorExportPayload(configuration);

    expect(payload.fileName).toBe("porta-atelier-oval-1000x2200.svg");
    expect(payload.productionSheet).toContain("Modello: Atelier ovale");
    expect(payload.productionSheet).toContain("Apertura: Sinistra a spingere");
    expect(payload.productionSheet).toContain("Maniglia: destra");
    expect(payload.productionSheet).toContain("Oblo ovale: si");
  });

  it("crea uno schema SVG esportabile", () => {
    const configuration = calculateDoorConfiguration({
      modelId: "classic-battente",
      openingWidthMm: 1300,
      openingHeightMm: 2100,
      wallThicknessMm: 110,
      composition: "single-fixed-right",
      glassVariant: "none",
      hasOvalWindow: false,
      hingeSide: "right",
      swingDirection: "push",
    });

    const svg = createDoorSchemaSvg(configuration);

    expect(svg.startsWith("<svg")).toBe(true);
    expect(svg).toContain("Classic battente");
    expect(svg).toContain("Fisso destro");
  });

  it("disegna un arco diverso tra spingere e tirare", () => {
    const pushConfiguration = calculateDoorConfiguration({
      modelId: "classic-battente",
      openingWidthMm: 1000,
      openingHeightMm: 2100,
      wallThicknessMm: 110,
      composition: "single",
      glassVariant: "none",
      hasOvalWindow: false,
      hingeSide: "left",
      swingDirection: "push",
    });

    const pullConfiguration = calculateDoorConfiguration({
      ...pushConfiguration.input,
      swingDirection: "pull",
    });

    const pushArc = createDoorSchemaSvg(pushConfiguration).match(/<path d="([^"]+)"/)?.[1];
    const pullArc = createDoorSchemaSvg(pullConfiguration).match(/<path d="([^"]+)"/)?.[1];

    expect(pushArc).toBeTruthy();
    expect(pullArc).toBeTruthy();
    expect(pushArc).not.toBe(pullArc);
  });
});
