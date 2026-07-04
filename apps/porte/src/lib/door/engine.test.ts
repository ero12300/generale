import { describe, expect, it } from "vitest";
import { calcolaPorta } from "./engine";
import { inputPortaSchema, type InputPorta, type OpzioniPorta } from "./types";

const opzioniBase: OpzioniPorta = {
  antaFissa: false,
  sopraluce: false,
  vetro: false,
  oblo: "nessuno",
};

function inputBase(overrides: Partial<InputPorta> = {}): InputPorta {
  return {
    foroLarghezzaMm: 900,
    foroAltezzaMm: 2150,
    spessoreMuroMm: 105,
    tipoApertura: "battente",
    latoCerniere: "sinistra",
    versoApertura: "tiro",
    opzioni: opzioniBase,
    ...overrides,
  };
}

describe("calcolaPorta - catena dimensionale battente", () => {
  it("riduce dal foro all'anta con i default e resta vicino allo standard 80x210", () => {
    const r = calcolaPorta(inputBase());
    // foro 900 -> controtelaio 880 -> telaio 870 -> luce 790 -> anta ~808
    expect(r.controtelaio).toEqual({ larghezzaMm: 880, altezzaMm: 2140 });
    expect(r.telaioEsterno).toEqual({ larghezzaMm: 870, altezzaMm: 2135 });
    expect(r.lucePassaggio.larghezzaMm).toBe(790);
    expect(r.anta.larghezzaMm).toBe(808);
    // ogni stadio è più piccolo del precedente (porta "più piccola" fino a entrare)
    expect(r.controtelaio.larghezzaMm).toBeLessThan(r.foro.larghezzaMm);
    expect(r.telaioEsterno.larghezzaMm).toBeLessThan(r.controtelaio.larghezzaMm);
    expect(r.lucePassaggio.larghezzaMm).toBeLessThan(r.telaioEsterno.larghezzaMm);
    expect(r.misuraStandardVicina.etichetta).toBe("80 × 210");
  });

  it("usa solo millimetri interi in tutti i componenti", () => {
    const r = calcolaPorta(inputBase({ foroLarghezzaMm: 903, foroAltezzaMm: 2147 }));
    for (const comp of [r.foro, r.controtelaio, r.telaioEsterno, r.lucePassaggio, r.anta]) {
      expect(Number.isInteger(comp.larghezzaMm)).toBe(true);
      expect(Number.isInteger(comp.altezzaMm)).toBe(true);
    }
  });
});

describe("calcolaPorta - verso e maniglia (DIN 107)", () => {
  it("cerniere a sinistra => DIN SX e maniglia a destra", () => {
    const r = calcolaPorta(inputBase({ latoCerniere: "sinistra" }));
    expect(r.din).toBe("SX");
    expect(r.latoManiglia).toBe("destra");
    expect(r.descrizioneApertura).toContain("DIN SX");
    expect(r.descrizioneApertura).toContain("maniglia a destra");
  });

  it("cerniere a destra => DIN DX e maniglia a sinistra", () => {
    const r = calcolaPorta(inputBase({ latoCerniere: "destra", versoApertura: "spinta" }));
    expect(r.din).toBe("DX");
    expect(r.latoManiglia).toBe("sinistra");
    expect(r.descrizioneApertura).toContain("apertura a spingere");
  });
});

describe("calcolaPorta - opzioni modello", () => {
  it("sopraluce sottrae altezza all'anta e genera il componente sopraluce", () => {
    const senza = calcolaPorta(inputBase());
    const con = calcolaPorta(
      inputBase({
        opzioni: { ...opzioniBase, sopraluce: true, altezzaSopraluceMm: 400 },
      }),
    );
    expect(con.sopraluce).toBeDefined();
    expect(con.sopraluce?.altezzaMm).toBe(400);
    expect(con.anta.altezzaMm).toBeLessThan(senza.anta.altezzaMm);
  });

  it("anta fissa riduce la larghezza dell'anta mobile e crea l'anta fissa", () => {
    const r = calcolaPorta(
      inputBase({
        foroLarghezzaMm: 1400,
        opzioni: { ...opzioniBase, antaFissa: true, larghezzaAntaFissaMm: 400 },
      }),
    );
    expect(r.antaFissa).toBeDefined();
    // luce totale 1400-20-10-80 = 1290; mobile = 1290-400-60 = 830
    expect(r.lucePassaggio.larghezzaMm).toBe(830);
  });

  it("oblò ovale viene riportato con la forma corretta", () => {
    const r = calcolaPorta(
      inputBase({ opzioni: { ...opzioniBase, oblo: "ovale", obloLarghezzaMm: 300, obloAltezzaMm: 450 } }),
    );
    expect(r.oblo?.forma).toBe("ovale");
    expect(r.oblo?.altezzaMm).toBe(450);
  });
});

describe("calcolaPorta - sistemi diversi", () => {
  it("scorrevole a scomparsa calcola la luce come metà dell'ingombro", () => {
    const r = calcolaPorta(inputBase({ tipoApertura: "scorrevole_scomparsa", foroLarghezzaMm: 1710 }));
    // (1710 - 110) / 2 = 800
    expect(r.lucePassaggio.larghezzaMm).toBe(800);
    expect(r.avvisi.some((a) => a.includes("scomparsa"))).toBe(true);
  });

  it("segnala il fuori misura quando la luce è lontana dallo standard", () => {
    const r = calcolaPorta(inputBase({ foroLarghezzaMm: 760 }));
    expect(r.fuoriMisura).toBe(true);
    expect(r.avvisi.some((a) => a.includes("fuori standard"))).toBe(true);
  });

  it("avvisa se lo spessore muro supera i telai standard", () => {
    const r = calcolaPorta(inputBase({ spessoreMuroMm: 200 }));
    expect(r.avvisi.some((a) => a.includes("allargamenti"))).toBe(true);
  });
});

describe("inputPortaSchema - validazione", () => {
  it("accetta un input valido", () => {
    expect(inputPortaSchema.safeParse(inputBase()).success).toBe(true);
  });

  it("rifiuta un foro troppo piccolo", () => {
    expect(inputPortaSchema.safeParse(inputBase({ foroLarghezzaMm: 100 })).success).toBe(false);
  });

  it("rifiuta misure non intere", () => {
    expect(inputPortaSchema.safeParse(inputBase({ foroAltezzaMm: 2150.5 })).success).toBe(false);
  });
});
