import { describe, expect, it } from "vitest";
import { calcolaMano, calcolaPorta } from "./engine";
import { ACCESSORI_DEFAULT, getSistema } from "./systems";
import type { ConfigurazionePorta } from "./types";

const battente = getSistema("battente-standard");

function baseConfig(over: Partial<ConfigurazionePorta> = {}): ConfigurazionePorta {
  return {
    sistemaId: "battente-standard",
    foroMuro: { larghezza: 900, altezza: 2170, spessoreMuro: 105 },
    latoCerniere: "sinistra",
    sensoApertura: "tiro",
    accessori: { ...ACCESSORI_DEFAULT },
    ...over,
  };
}

describe("calcolaMano", () => {
  it("mette la maniglia sul lato opposto alle cerniere", () => {
    expect(calcolaMano("sinistra", "tiro").latoManiglia).toBe("destra");
    expect(calcolaMano("destra", "spinta").latoManiglia).toBe("sinistra");
  });

  it("assegna la convenzione DIN dal lato cerniere", () => {
    expect(calcolaMano("sinistra", "tiro").din).toBe("DIN sinistra");
    expect(calcolaMano("destra", "tiro").din).toBe("DIN destra");
  });

  it("espone il verso destra/sinistra", () => {
    expect(calcolaMano("destra", "tiro").verso).toBe("destra");
    expect(calcolaMano("sinistra", "tiro").verso).toBe("sinistra");
  });
});

describe("calcolaPorta - battente standard", () => {
  const r = calcolaPorta(baseConfig(), battente);

  it("il controtelaio è più piccolo del foro muro", () => {
    expect(r.controtelaio.larghezza).toBeLessThan(900);
    expect(r.controtelaio.altezza).toBeLessThan(2170);
  });

  it("la luce di passaggio è più piccola del controtelaio", () => {
    expect(r.lucePassaggio.larghezza).toBeLessThan(r.luceControtelaio.larghezza);
    expect(r.lucePassaggio.altezza).toBeLessThan(r.luceControtelaio.altezza);
  });

  it("l'anta è più piccola del foro muro (entra nell'opera morta)", () => {
    expect(r.anta.larghezza).toBeLessThan(900);
    expect(r.anta.altezza).toBeLessThan(2170);
  });

  it("catena decrescente: foro > controtelaio > luce controtelaio > luce passaggio", () => {
    expect(900).toBeGreaterThan(r.controtelaio.larghezza);
    expect(r.controtelaio.larghezza).toBeGreaterThan(r.luceControtelaio.larghezza);
    expect(r.luceControtelaio.larghezza).toBeGreaterThan(r.lucePassaggio.larghezza);
  });

  it("produce una sola anta e nessun avviso per un foro standard", () => {
    expect(r.numeroAnte).toBe(1);
    expect(r.avvisi).toHaveLength(0);
  });

  it("restituisce valori interi (mm)", () => {
    expect(Number.isInteger(r.anta.larghezza)).toBe(true);
    expect(Number.isInteger(r.anta.altezza)).toBe(true);
  });
});

describe("calcolaPorta - accessori", () => {
  it("bussola genera due ante", () => {
    const r = calcolaPorta(
      baseConfig({ foroMuro: { larghezza: 1600, altezza: 2170, spessoreMuro: 105 }, accessori: { ...ACCESSORI_DEFAULT, bussola: true } }),
      battente
    );
    expect(r.numeroAnte).toBe(2);
    expect(r.antaSecondaria).toBeDefined();
    expect(r.anta.larghezza).toBeLessThan(r.lucePassaggio.larghezza / 2 + 50);
  });

  it("fisso laterale riduce la larghezza dell'anta", () => {
    const senza = calcolaPorta(baseConfig(), battente);
    const con = calcolaPorta(
      baseConfig({ accessori: { ...ACCESSORI_DEFAULT, fissoLaterale: true, larghezzaFisso: 400 } }),
      battente
    );
    expect(con.fisso).toBeDefined();
    expect(con.anta.larghezza).toBeLessThan(senza.anta.larghezza);
  });

  it("sopraluce riduce l'altezza dell'anta e produce un pannello", () => {
    const senza = calcolaPorta(baseConfig(), battente);
    const con = calcolaPorta(
      baseConfig({ accessori: { ...ACCESSORI_DEFAULT, sopraluce: true, altezzaSopraluce: 400 } }),
      battente
    );
    expect(con.sopraluce).toBeDefined();
    expect(con.anta.altezza).toBeLessThan(senza.anta.altezza);
  });
});

describe("calcolaPorta - scorrevoli", () => {
  it("scorrevole esterno calcola l'ingombro di parete", () => {
    const r = calcolaPorta(baseConfig({ sistemaId: "scorrevole-esterno" }), getSistema("scorrevole-esterno"));
    expect(r.ingombroParete).toBeDefined();
    expect(r.ingombroParete!).toBeGreaterThan(r.anta.larghezza);
  });

  it("scorrevole a scomparsa calcola l'ingombro totale (~2x luce)", () => {
    const r = calcolaPorta(baseConfig({ sistemaId: "scorrevole-scomparsa" }), getSistema("scorrevole-scomparsa"));
    expect(r.ingombroScomparsa).toBeDefined();
    expect(r.ingombroScomparsa!.larghezza).toBeGreaterThan(2 * r.lucePassaggio.larghezza);
  });

  it("avvisa se il muro è troppo sottile per la scomparsa", () => {
    const r = calcolaPorta(
      baseConfig({ sistemaId: "scorrevole-scomparsa", foroMuro: { larghezza: 900, altezza: 2170, spessoreMuro: 80 } }),
      getSistema("scorrevole-scomparsa")
    );
    expect(r.avvisi.some((a) => a.includes("Spessore muro"))).toBe(true);
  });
});

describe("calcolaPorta - avvisi dimensionali", () => {
  it("avvisa se il foro è troppo piccolo", () => {
    const r = calcolaPorta(baseConfig({ foroMuro: { larghezza: 400, altezza: 2170, spessoreMuro: 105 } }), battente);
    expect(r.avvisi.some((a) => a.includes("750 mm"))).toBe(true);
  });

  it("override delle deduzioni modifica il risultato", () => {
    const base = calcolaPorta(baseConfig(), battente);
    const custom = calcolaPorta(baseConfig({ deduzioniOverride: { ingombroTelaioLato: 30 } }), battente);
    expect(custom.lucePassaggio.larghezza).toBeLessThan(base.lucePassaggio.larghezza);
  });
});
