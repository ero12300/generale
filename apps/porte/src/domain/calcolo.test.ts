import { describe, expect, it } from "vitest";
import { calcolaPorta, etichettaVerso } from "./calcolo";
import type { InputPorta } from "./types";

const base: InputPorta = {
  modello: "battente-classic",
  foroL: 900,
  foroH: 2100,
  spessoreMuro: 105,
  numeroAnte: 1,
  tipoAntaSecondaria: "compasso",
  ripartizione: "simmetrica",
  verso: "destra",
  movimento: "spingere",
  conOblo: false,
  formaOblo: "tondo",
  conVetrina: false,
};

describe("calcolaPorta — porta singola battente", () => {
  it("calcola luce telaio e anta con le detrazioni del modello", () => {
    const esito = calcolaPorta(base);
    expect(esito.ok).toBe(true);
    const s = esito.scheda!;
    // 900 − 100 = 800 ; 2100 − 50 = 2050
    expect(s.luceTelaioL).toBe(800);
    expect(s.luceTelaioH).toBe(2050);
    // anta = luce + 2×battuta(12) = 824 ; h = 2050 + 12 − 7 = 2055
    expect(s.ante).toHaveLength(1);
    expect(s.ante[0].larghezza).toBe(824);
    expect(s.ante[0].altezza).toBe(2055);
    expect(s.ante[0].spessore).toBe(44);
    expect(s.lucePassaggioL).toBe(800);
  });

  it("calcola il controtelaio (opera morta) con la tolleranza di posa", () => {
    const s = calcolaPorta(base).scheda!;
    expect(s.controtelaioL).toBe(890);
    expect(s.controtelaioH).toBe(2095);
  });

  it("maniglia opposta alle cerniere: porta destra → maniglia a sinistra", () => {
    const s = calcolaPorta(base).scheda!;
    expect(s.latoCerniere).toBe("destra");
    expect(s.latoManiglia).toBe("sinistra");
  });

  it("porta sinistra → maniglia a destra", () => {
    const s = calcolaPorta({ ...base, verso: "sinistra" }).scheda!;
    expect(s.latoCerniere).toBe("sinistra");
    expect(s.latoManiglia).toBe("destra");
  });

  it("etichetta verso", () => {
    expect(etichettaVerso(base)).toBe("DX a spingere");
    expect(etichettaVerso({ ...base, verso: "sinistra", movimento: "tirare" })).toBe(
      "SX a tirare",
    );
  });
});

describe("calcolaPorta — validazioni", () => {
  it("rifiuta misure non intere o non positive", () => {
    expect(calcolaPorta({ ...base, foroL: 0 }).ok).toBe(false);
    expect(calcolaPorta({ ...base, foroH: -5 }).ok).toBe(false);
    expect(calcolaPorta({ ...base, foroL: 900.5 }).ok).toBe(false);
  });

  it("rifiuta foro fuori range del modello", () => {
    const stretto = calcolaPorta({ ...base, foroL: 500 });
    expect(stretto.ok).toBe(false);
    expect(stretto.errori[0]).toContain("fuori range");
    const basso = calcolaPorta({ ...base, foroH: 1500 });
    expect(basso.ok).toBe(false);
  });

  it("rifiuta vetrina su modelli REI e oblò su filo muro", () => {
    expect(
      calcolaPorta({ ...base, modello: "rei-60", conVetrina: true }).ok,
    ).toBe(false);
    expect(
      calcolaPorta({ ...base, modello: "filo-muro", conOblo: true }).ok,
    ).toBe(false);
  });

  it("rifiuta oblò + vetrina insieme", () => {
    expect(calcolaPorta({ ...base, conOblo: true, conVetrina: true }).ok).toBe(false);
  });

  it("rifiuta oblò su REI 1 anta con foro L > 1167 mm", () => {
    const esito = calcolaPorta({
      ...base,
      modello: "rei-60",
      foroL: 1200,
      conOblo: true,
    });
    expect(esito.ok).toBe(false);
    expect(esito.errori[0]).toContain("1167");
  });
});

describe("calcolaPorta — due ante", () => {
  const doppia: InputPorta = {
    ...base,
    foroL: 1400,
    numeroAnte: 2,
  };

  it("ripartizione simmetrica: le luci delle due ante coprono la luce telaio", () => {
    const s = calcolaPorta(doppia).scheda!;
    expect(s.ante).toHaveLength(2);
    const luceTelaio = s.luceTelaioL; // 1300
    expect(luceTelaio).toBe(1300);
    // somma larghezze ante = luce + 4×battuta + sormonto centrale
    const somma = s.ante[0].larghezza + s.ante[1].larghezza;
    expect(somma).toBe(luceTelaio + 4 * 12 + 30);
  });

  it("anta a compasso: luce di passaggio totale e avvertenza", () => {
    const s = calcolaPorta({ ...doppia, tipoAntaSecondaria: "compasso" }).scheda!;
    expect(s.ante[1].ruolo).toBe("semifissa");
    expect(s.lucePassaggioL).toBe(s.luceTelaioL);
    expect(s.avvertenze.join(" ")).toContain("compasso");
  });

  it("anta fissa: passaggio limitato alla sola anta principale", () => {
    const s = calcolaPorta({ ...doppia, tipoAntaSecondaria: "fissa" }).scheda!;
    expect(s.ante[1].ruolo).toBe("fissa");
    expect(s.lucePassaggioL).toBeLessThan(s.luceTelaioL);
    expect(s.avvertenze.join(" ")).toContain("fissa");
  });

  it("ripartizione asimmetrica: anta principale più larga della secondaria", () => {
    const s = calcolaPorta({ ...doppia, ripartizione: "asimmetrica" }).scheda!;
    expect(s.ante[0].larghezza).toBeGreaterThan(s.ante[1].larghezza);
  });
});

describe("calcolaPorta — oblò e vetrina", () => {
  it("oblò tondo su porta larga: 400 mm, centro a 1500 mm", () => {
    const s = calcolaPorta({ ...base, foroL: 1000, conOblo: true }).scheda!;
    expect(s.oblo).not.toBeNull();
    expect(s.oblo!.larghezza).toBe(400);
    expect(s.oblo!.quotaCentroDaPavimento).toBe(1500);
  });

  it("oblò ridotto a 300 mm su anta stretta", () => {
    const s = calcolaPorta({ ...base, foroL: 700, conOblo: true }).scheda!;
    // anta = 700 − 100 + 24 = 624 → 624 − 400 = 224 < 300 → riduci a 300
    expect(s.oblo!.larghezza).toBe(300);
  });

  it("oblò ovale usa dimensioni ovali", () => {
    const s = calcolaPorta({
      ...base,
      foroL: 1000,
      conOblo: true,
      formaOblo: "ovale",
    }).scheda!;
    expect(s.oblo!.forma).toBe("ovale");
    expect(s.oblo!.altezza).toBeGreaterThan(s.oblo!.larghezza);
  });

  it("vetrina calcolata dai bordi anta", () => {
    const s = calcolaPorta({ ...base, conVetrina: true }).scheda!;
    expect(s.vetrina).not.toBeNull();
    expect(s.vetrina!.larghezza).toBe(824 - 240);
    expect(s.vetrina!.quotaInferioreDaPavimento).toBe(900);
  });

  it("porta REI con oblò aggiunge avvertenza chiudiporta", () => {
    const s = calcolaPorta({
      ...base,
      modello: "rei-60",
      foroL: 1000,
      conOblo: true,
    }).scheda!;
    expect(s.avvertenze.join(" ")).toContain("chiudiporta");
  });
});
