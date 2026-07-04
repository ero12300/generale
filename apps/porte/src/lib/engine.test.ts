import { describe, expect, it } from "vitest";
import { z } from "zod";
import { calcola } from "./engine";
import { configSchema, type Config } from "./types";

function makeConfig(overrides: Partial<z.input<typeof configSchema>> = {}): Config {
  return configSchema.parse({
    modelloId: "battente-classica",
    foroLarghezza: 900,
    foroAltezza: 2110,
    ...overrides,
  });
}

describe("calcola - deduzioni base", () => {
  it("ricava luce di passaggio e anta piu' piccole del foro (battente classica)", () => {
    const r = calcola(makeConfig());
    expect(r.lucePassaggio).toEqual({ larghezza: 750, altezza: 2035 });
    expect(r.anta).toEqual({ larghezza: 742, altezza: 2027 });
    // l'anta e' sempre piu' piccola del foro
    expect(r.anta.larghezza).toBeLessThan(r.foro.larghezza);
    expect(r.anta.altezza).toBeLessThan(r.foro.altezza);
    expect(r.avvisi).toHaveLength(0);
  });

  it("il filo muro deduce meno del telaio classico", () => {
    const classica = calcola(makeConfig());
    const filo = calcola(makeConfig({ modelloId: "battente-filomuro" }));
    expect(filo.lucePassaggio.larghezza).toBeGreaterThan(classica.lucePassaggio.larghezza);
  });

  it("rispetta l'override manuale delle deduzioni", () => {
    const r = calcola(makeConfig({ deduzioniOverride: { telaioLarghezza: 100 } }));
    expect(r.lucePassaggio.larghezza).toBe(800);
  });
});

describe("calcola - mano e verso", () => {
  it("la maniglia e' sul lato opposto alle cerniere", () => {
    const dx = calcola(makeConfig({ mano: "destra" }));
    expect(dx.latoCerniere).toBe("destra");
    expect(dx.latoManiglia).toBe("sinistra");
    expect(dx.sensoApertura).toBe("Destra a spingere");

    const sx = calcola(makeConfig({ mano: "sinistra", verso: "tirare" }));
    expect(sx.latoManiglia).toBe("destra");
    expect(sx.sensoApertura).toBe("Sinistra a tirare");
  });
});

describe("calcola - opzioni", () => {
  it("il sopraluce riduce l'altezza dell'anta", () => {
    const base = calcola(makeConfig({ foroAltezza: 2500 }));
    const conSopraluce = calcola(
      makeConfig({
        foroAltezza: 2500,
        opzioni: { sopraluce: true, sopraluceAltezza: 400 },
      }),
    );
    expect(conSopraluce.anta.altezza).toBe(base.anta.altezza - 400);
    expect(conSopraluce.pannelli.some((p) => p.tipo === "sopraluce")).toBe(true);
  });

  it("l'anta fissa riduce la larghezza dell'anta mobile e crea il pannello fisso", () => {
    const r = calcola(
      makeConfig({
        foroLarghezza: 1600,
        opzioni: { antaFissa: true, antaFissaLarghezza: 500 },
        mano: "destra",
      }),
    );
    // luce 1450, mobile = 1450 - 500 = 950, anta = 950 - 8
    expect(r.anta.larghezza).toBe(942);
    const fissa = r.pannelli.find((p) => p.tipo === "fissa");
    expect(fissa?.larghezza).toBe(500);
    // cerniere a destra -> fissa a sinistra (x minimo)
    expect(fissa?.x).toBe(75);
  });

  it("posiziona l'anta fissa a destra quando le cerniere sono a sinistra", () => {
    const r = calcola(
      makeConfig({
        foroLarghezza: 1600,
        opzioni: { antaFissa: true, antaFissaLarghezza: 500 },
        mano: "sinistra",
      }),
    );
    const fissa = r.pannelli.find((p) => p.tipo === "fissa");
    const anta = r.pannelli.find((p) => p.tipo === "anta");
    expect(fissa!.x).toBeGreaterThan(anta!.x);
  });
});

describe("calcola - scorrevole a scomparsa", () => {
  it("calcola l'ingombro totale circa doppio della luce", () => {
    const r = calcola(makeConfig({ modelloId: "scorrevole-scomparsa" }));
    expect(r.lucePassaggio.larghezza).toBe(790);
    expect(r.ingombroTotale).toEqual({ larghezza: 1690, altezza: 2110 });
  });
});

describe("calcola - avvisi", () => {
  it("avvisa se la luce e' sotto il minimo di legge", () => {
    const r = calcola(makeConfig({ foroLarghezza: 880 }));
    expect(r.lucePassaggio.larghezza).toBe(730);
    expect(r.avvisi.join(" ")).toMatch(/minimo di legge/);
  });
});
