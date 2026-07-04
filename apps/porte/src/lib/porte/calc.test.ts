import { describe, it, expect } from "vitest";
import {
  calcolaPorta,
  posizioneManiglia,
  versoApertura,
  COSTANTI,
} from "./calc";
import type { ConfigurazionePorta } from "./types";
import { CONFIG_DEFAULT } from "./presets";

function makeConfig(
  overrides: Partial<ConfigurazionePorta> = {}
): ConfigurazionePorta {
  return {
    tipologia: CONFIG_DEFAULT.tipologia,
    foroMuro: { ...CONFIG_DEFAULT.foroMuro },
    latoCerniere: CONFIG_DEFAULT.latoCerniere,
    manovra: CONFIG_DEFAULT.manovra,
    opzioni: {
      sopraluce: { presente: false },
      fissoLaterale: { presente: false },
      oblo: { presente: false },
      conControtelaio: true,
    },
    ...overrides,
  };
}

describe("versoApertura", () => {
  it("compone destra a spingere", () => {
    expect(versoApertura("dx", "spingere")).toBe("DX a spingere");
  });
  it("compone sinistra a tirare", () => {
    expect(versoApertura("sx", "tirare")).toBe("SX a tirare");
  });
});

describe("posizioneManiglia", () => {
  it("mette la maniglia sul lato opposto alle cerniere", () => {
    expect(posizioneManiglia("dx")).toBe("sx");
    expect(posizioneManiglia("sx")).toBe("dx");
  });
});

describe("calcolaPorta - battente", () => {
  it("calcola l'anta 80x210 partendo da foro muro 900x2150", () => {
    const cfg = makeConfig({
      tipologia: "battente",
      foroMuro: { larghezza: 900, altezza: 2150, spessoreMuro: 100 },
    });
    const r = calcolaPorta(cfg);

    // Con COSTANTI attuali (giochi 20/15, controtelaio 12, telaio 45, sfrido 6/8):
    // controtelaio esterno: 880 x 2135
    // controtelaio interno: 856 x 2123
    // telaio interno: 766 x 2078
    // anta: 772 x 2086
    expect(r.controtelaio.presente).toBe(true);
    if (r.controtelaio.presente) {
      expect(r.controtelaio.esterno).toEqual({ larghezza: 880, altezza: 2135 });
      expect(r.controtelaio.interno).toEqual({ larghezza: 856, altezza: 2123 });
    }
    expect(r.telaio.interno).toEqual({ larghezza: 766, altezza: 2078 });
    expect(r.anta).toEqual({ larghezza: 772, altezza: 2086 });
    expect(r.lucePassaggio).toEqual({ larghezza: 766, altezza: 2078 });
    expect(r.ingombroParete).toBeNull();
  });

  it("omette il controtelaio quando richiesto", () => {
    const cfg = makeConfig({
      tipologia: "battente",
      opzioni: {
        sopraluce: { presente: false },
        fissoLaterale: { presente: false },
        oblo: { presente: false },
        conControtelaio: false,
      },
    });
    const r = calcolaPorta(cfg);
    expect(r.controtelaio.presente).toBe(false);
  });

  it("aggiunge sopraluce con altezza specificata", () => {
    const cfg = makeConfig({
      tipologia: "battente",
      opzioni: {
        sopraluce: { presente: true, altezza: 400 },
        fissoLaterale: { presente: false },
        oblo: { presente: false },
        conControtelaio: true,
      },
    });
    const r = calcolaPorta(cfg);
    expect(r.sopraluce).not.toBeNull();
    expect(r.sopraluce!.altezza).toBe(400);
    expect(r.sopraluce!.larghezza).toBe(r.telaio.esterno.larghezza);
  });

  it("aggiunge fisso laterale a destra con larghezza indicata", () => {
    const cfg = makeConfig({
      tipologia: "battente",
      opzioni: {
        sopraluce: { presente: false },
        fissoLaterale: { presente: true, lato: "dx", larghezza: 500 },
        oblo: { presente: false },
        conControtelaio: true,
      },
    });
    const r = calcolaPorta(cfg);
    expect(r.fissoLaterale).not.toBeNull();
    expect(r.fissoLaterale!.lato).toBe("dx");
    expect(r.fissoLaterale!.larghezza).toBe(500);
    expect(r.fissoLaterale!.altezza).toBe(r.telaio.esterno.altezza);
  });

  it("segnala misure anta non standard con avviso info", () => {
    const cfg = makeConfig({
      tipologia: "battente",
      foroMuro: { larghezza: 950, altezza: 2200, spessoreMuro: 100 },
    });
    const r = calcolaPorta(cfg);
    expect(r.avvisi.some((a) => a.livello === "info")).toBe(true);
  });
});

describe("calcolaPorta - scorrevole a scomparsa", () => {
  it("calcola ingombro parete = 2L + delta", () => {
    const cfg = makeConfig({
      tipologia: "scorrevole_scomparsa",
      foroMuro: { larghezza: 800, altezza: 2100, spessoreMuro: 105 },
    });
    const r = calcolaPorta(cfg);
    expect(r.ingombroParete).not.toBeNull();
    expect(r.ingombroParete!.larghezza).toBe(
      2 * 800 + COSTANTI.scorrevoleScomparsa_delta_L
    );
    expect(r.ingombroParete!.altezza).toBe(
      2100 + COSTANTI.scorrevoleScomparsa_delta_H
    );
    expect(r.controtelaio.presente).toBe(true);
    expect(r.lucePassaggio).toEqual({ larghezza: 800, altezza: 2100 });
    // L'anta scorrevole è leggermente più larga della luce
    expect(r.anta.larghezza).toBeGreaterThan(r.lucePassaggio.larghezza);
  });
});

describe("calcolaPorta - scorrevole esterno muro", () => {
  it("non ha controtelaio e ha ingombro 2L + 100", () => {
    const cfg = makeConfig({
      tipologia: "scorrevole_esterno",
      foroMuro: { larghezza: 800, altezza: 2100, spessoreMuro: 100 },
    });
    const r = calcolaPorta(cfg);
    expect(r.controtelaio.presente).toBe(false);
    expect(r.ingombroParete!.larghezza).toBe(
      2 * 800 + COSTANTI.scorrevoleEsterno_delta_L
    );
  });
});

describe("calcolaPorta - validazione", () => {
  it("lancia se larghezza foro muro è ≤ 0", () => {
    const cfg = makeConfig({
      foroMuro: { larghezza: 0, altezza: 2100, spessoreMuro: 100 },
    });
    expect(() => calcolaPorta(cfg)).toThrow();
  });
  it("lancia se altezza foro muro è negativa", () => {
    const cfg = makeConfig({
      foroMuro: { larghezza: 900, altezza: -1, spessoreMuro: 100 },
    });
    expect(() => calcolaPorta(cfg)).toThrow();
  });
  it("avverte se il foro muro è molto piccolo ma non lancia", () => {
    const cfg = makeConfig({
      foroMuro: { larghezza: 500, altezza: 1800, spessoreMuro: 100 },
    });
    const r = calcolaPorta(cfg);
    expect(r.avvisi.some((a) => a.livello === "warning")).toBe(true);
  });
});

describe("calcolaPorta - verso apertura", () => {
  it("include il verso di apertura nel risultato", () => {
    const r = calcolaPorta(
      makeConfig({ latoCerniere: "sx", manovra: "tirare" })
    );
    expect(r.versoApertura).toBe("SX a tirare");
    expect(r.posizioneManiglia).toBe("dx");
  });
});
