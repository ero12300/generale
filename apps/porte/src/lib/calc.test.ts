import { describe, expect, it } from "vitest";
import { calcolaPorta, validateInput } from "./calc";
import type { DoorInput } from "./types";

function baseInput(overrides: Partial<DoorInput> = {}): DoorInput {
  return {
    modelId: "classica-battente",
    tipoApertura: "battente",
    foroLarghezza: 900,
    foroAltezza: 2150,
    spessoreMuro: 105,
    verso: "sx",
    spinta: "spinge",
    compasso: false,
    antaFissa: false,
    antaFissaLarghezza: 0,
    vetro: false,
    oblo: "nessuno",
    note: "",
    ...overrides,
  };
}

describe("calcolaPorta - battente", () => {
  it("ricava l'anta 80x210 da un foro muro 90x215 (standard di mercato)", () => {
    const r = calcolaPorta(baseInput());
    expect(r.anta).toEqual({ larghezza: 800, altezza: 2100 });
    expect(r.telaio).toEqual({ larghezza: 880, altezza: 2135 });
    expect(r.lucePassaggio).toEqual({ larghezza: 780, altezza: 2090 });
  });

  it("mette la maniglia sul lato opposto alle cerniere", () => {
    expect(calcolaPorta(baseInput({ verso: "sx" })).latoManiglia).toBe("dx");
    expect(calcolaPorta(baseInput({ verso: "dx" })).latoManiglia).toBe("sx");
  });

  it("consiglia la profondità telaio standard >= spessore muro", () => {
    expect(calcolaPorta(baseInput({ spessoreMuro: 70 })).profonditaTelaio).toBe(70);
    expect(calcolaPorta(baseInput({ spessoreMuro: 105 })).profonditaTelaio).toBe(110);
    expect(calcolaPorta(baseInput({ spessoreMuro: 130 })).profonditaTelaio).toBe(120);
  });

  it("gestisce l'anta fissa ripartendo la larghezza", () => {
    const r = calcolaPorta(
      baseInput({ foroLarghezza: 1400, antaFissa: true, antaFissaLarghezza: 400 })
    );
    expect(r.anta.larghezza).toBe(900);
    expect(r.antaFissa).toEqual({ larghezza: 400, altezza: 2100 });
  });

  it("avvisa quando la luce di passaggio è sotto i 750 mm", () => {
    const r = calcolaPorta(baseInput({ foroLarghezza: 800 })); // anta 700 -> luce 680
    expect(r.lucePassaggio.larghezza).toBe(680);
    expect(r.messaggi.some((m) => m.severity === "warning")).toBe(true);
  });
});

describe("calcolaPorta - altri sistemi", () => {
  it("scomparsa: calcola l'ingombro controtelaio ~ 2·luce + 110", () => {
    const r = calcolaPorta(
      baseInput({ modelId: "scomparsa", tipoApertura: "scomparsa", foroLarghezza: 800, foroAltezza: 2100 })
    );
    expect(r.ingombroTotale.larghezza).toBe(1710);
    expect(r.ingombroTotale.altezza).toBe(2190);
  });

  it("scorrevole esterno: l'anta copre il foro e serve spazio laterale", () => {
    const r = calcolaPorta(
      baseInput({ modelId: "scorrevole-esterno", tipoApertura: "scorrevole_esterno", foroLarghezza: 800, foroAltezza: 2100 })
    );
    expect(r.anta.larghezza).toBe(860);
    expect(r.ingombroTotale.larghezza).toBe(1710);
  });
});

describe("validateInput", () => {
  it("accetta un input valido", () => {
    expect(validateInput(baseInput()).success).toBe(true);
  });

  it("rifiuta un foro troppo piccolo", () => {
    expect(validateInput(baseInput({ foroLarghezza: 100 })).success).toBe(false);
  });

  it("rifiuta valori non interi", () => {
    expect(validateInput(baseInput({ foroLarghezza: 900.5 })).success).toBe(false);
  });
});
