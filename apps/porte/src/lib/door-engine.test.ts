import { describe, expect, it } from "vitest";
import {
  calcolaPorta,
  distintaProduzione,
  siglaManoVerso,
  type ConfigurazionePorta,
} from "./door-engine";

function baseConfig(overrides: Partial<ConfigurazionePorta> = {}): ConfigurazionePorta {
  return {
    vano: { larghezzaMm: 900, altezzaMm: 2200, spessoreParereMm: 105 },
    tipologia: "battente-singola",
    modello: "Liscia",
    mano: "destra",
    verso: "tirare",
    specchiatura: { presente: false, forma: "rettangolare", numeroPannelli: 1 },
    ovale: { presente: false, larghezzaMm: 300, altezzaMm: 200 },
    fissoLaterale: { presente: false, lato: "destro", larghezzaMm: 300, vetrato: true },
    fissoSuperiore: { presente: false, altezzaMm: 400, vetrato: true },
    ...overrides,
  };
}

describe("siglaManoVerso", () => {
  it("compone correttamente le 4 sigle UNI EN 12519", () => {
    expect(siglaManoVerso("destra", "tirare")).toBe("DT");
    expect(siglaManoVerso("destra", "spingere")).toBe("DS");
    expect(siglaManoVerso("sinistra", "tirare")).toBe("ST");
    expect(siglaManoVerso("sinistra", "spingere")).toBe("SS");
  });
});

describe("calcolaPorta — battente singola standard", () => {
  it("da vano 900×2200 calcola CT 880×2190, LP 760×2130, anta 800×2140", () => {
    const c = calcolaPorta(baseConfig());
    expect(c.controtelaio.larghezzaMm).toBe(880);
    expect(c.controtelaio.altezzaMm).toBe(2190);
    expect(c.lucePassaggio.larghezzaMm).toBe(760);
    expect(c.lucePassaggio.altezzaMm).toBe(2130);
    expect(c.anta.larghezzaMm).toBe(800);
    expect(c.anta.altezzaMm).toBe(2140);
  });

  it("suggerisce taglia standard 800×2100 per anta ~800×2140", () => {
    const c = calcolaPorta(baseConfig());
    expect(c.anta.tagliaStandardSuggerita).toEqual({
      larghezzaMm: 800,
      altezzaMm: 2100,
    });
  });

  it("marca fuori-serie quando l'altezza dell'anta si discosta dalla standard di > 20 mm", () => {
    const c = calcolaPorta(baseConfig());
    // anta 800×2140 vs standard 800×2100 → 40 mm di scarto → fuori serie
    expect(c.anta.fuoriSerie).toBe(true);
  });

  it("un vano 890×2160 produce anta 790×2100 → taglia standard esatta 750×2100", () => {
    const c = calcolaPorta(
      baseConfig({ vano: { larghezzaMm: 890, altezzaMm: 2160, spessoreParereMm: 105 } })
    );
    expect(c.anta.larghezzaMm).toBe(790);
    expect(c.anta.altezzaMm).toBe(2100);
    expect(c.anta.tagliaStandardSuggerita).toEqual({ larghezzaMm: 750, altezzaMm: 2100 });
    // 790 dista 40 mm da 750 → fuori serie
    expect(c.anta.fuoriSerie).toBe(true);
  });
});

describe("calcolaPorta — con fisso laterale (bussola)", () => {
  it("con fisso laterale 300 mm sottrae la larghezza al calcolo dell'anta", () => {
    const c = calcolaPorta(
      baseConfig({
        vano: { larghezzaMm: 1400, altezzaMm: 2200, spessoreParereMm: 105 },
        fissoLaterale: { presente: true, lato: "destro", larghezzaMm: 300, vetrato: true },
      })
    );
    // CT_L = 1400 - 20 = 1380; LP_L = 1380 - 120 - 300 = 960; anta L = 960 + 40 = 1000
    expect(c.controtelaio.larghezzaMm).toBe(1380);
    expect(c.lucePassaggio.larghezzaMm).toBe(960);
    expect(c.anta.larghezzaMm).toBe(1000);
    expect(c.fissoLaterale.presente).toBe(true);
    expect(c.fissoLaterale.lato).toBe("destro");
  });
});

describe("calcolaPorta — con fisso superiore (sopraluce)", () => {
  it("con sopraluce da 400 mm calcola l'anta di altezza normale", () => {
    const c = calcolaPorta(
      baseConfig({
        vano: { larghezzaMm: 900, altezzaMm: 2600, spessoreParereMm: 105 },
        fissoSuperiore: { presente: true, altezzaMm: 400, vetrato: true },
      })
    );
    // CT_H = 2600 - 10 = 2590; LP_H = 2590 - 60 - 400 = 2130; anta H = 2140
    expect(c.controtelaio.altezzaMm).toBe(2590);
    expect(c.lucePassaggio.altezzaMm).toBe(2130);
    expect(c.anta.altezzaMm).toBe(2140);
    expect(c.fissoSuperiore.altezzaMm).toBe(400);
  });
});

describe("calcolaPorta — battente doppia", () => {
  it("da un vano 1600 doppia anta divide la luce di passaggio a metà per ogni anta", () => {
    const c = calcolaPorta(
      baseConfig({
        vano: { larghezzaMm: 1600, altezzaMm: 2200, spessoreParereMm: 105 },
        tipologia: "battente-doppia",
      })
    );
    // CT_L 1580, LP_L 1460, anta ognuna ≈ (1460 + 40) / 2 = 750
    expect(c.lucePassaggio.larghezzaMm).toBe(1460);
    expect(c.anta.larghezzaMm).toBe(750);
    expect(c.anta.tagliaStandardSuggerita?.larghezzaMm).toBe(750);
  });
});

describe("calcolaPorta — avvisi", () => {
  it("emette warning quando l'anta singola supera la larghezza massima standard", () => {
    const c = calcolaPorta(
      baseConfig({ vano: { larghezzaMm: 1250, altezzaMm: 2200, spessoreParereMm: 105 } })
    );
    // anta 1150 mm → warning "considera doppia anta o fisso laterale"
    expect(c.anta.larghezzaMm).toBe(1150);
    expect(c.avvisi.some((a) => /doppia anta o.*fisso/i.test(a.messaggio))).toBe(true);
  });

  it("emette warning quando spessore parete è fuori range comune", () => {
    const c = calcolaPorta(
      baseConfig({ vano: { larghezzaMm: 900, altezzaMm: 2200, spessoreParereMm: 50 } })
    );
    expect(c.avvisi.some((a) => /spessore parete/i.test(a.messaggio))).toBe(true);
  });

  it("emette error su vano non valido", () => {
    const c = calcolaPorta(
      baseConfig({ vano: { larghezzaMm: 0, altezzaMm: 2200, spessoreParereMm: 105 } })
    );
    expect(c.avvisi.some((a) => a.livello === "error")).toBe(true);
  });

  it("emette warning se la luce di passaggio è sotto i 500 mm", () => {
    const c = calcolaPorta(
      baseConfig({ vano: { larghezzaMm: 620, altezzaMm: 2200, spessoreParereMm: 105 } })
    );
    expect(c.avvisi.some((a) => /Luce di passaggio/i.test(a.messaggio))).toBe(true);
  });
});

describe("distintaProduzione", () => {
  it("include sezioni chiave del disegno: controtelaio, anta, apertura", () => {
    const config = baseConfig({
      mano: "sinistra",
      verso: "spingere",
      specchiatura: { presente: true, forma: "rettangolare", numeroPannelli: 2 },
      ovale: { presente: true, larghezzaMm: 300, altezzaMm: 200 },
      fissoLaterale: { presente: true, lato: "sinistro", larghezzaMm: 250, vetrato: true },
      fissoSuperiore: { presente: true, altezzaMm: 400, vetrato: false },
      note: "Cliente Rossi — consegna 15/09",
    });
    const c = calcolaPorta(config);
    const testo = distintaProduzione(config, c).join("\n");
    expect(testo).toContain("CONTROTELAIO");
    expect(testo).toContain("ANTA");
    expect(testo).toContain("APERTURA & FERRAMENTA");
    expect(testo).toContain("Sigla UNI EN 12519: SS");
    expect(testo).toContain("FISSO LATERALE (BUSSOLA)");
    expect(testo).toContain("FISSO SUPERIORE (SOPRALUCE)");
    expect(testo).toContain("SPECCHIATURA");
    expect(testo).toContain("OVALE");
    expect(testo).toContain("Cliente Rossi");
  });
});
