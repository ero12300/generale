import { describe, expect, it } from "vitest";
import { calcolaScheda } from "./calc";
import { validaConfig } from "./validate";
import type { ConfigPorta } from "./types";

function configBase(overrides: Partial<ConfigPorta> = {}): ConfigPorta {
  return {
    nome: "Test",
    modelloId: "classica-legno",
    tipologia: "battente",
    vano: { larghezza: 880, altezza: 2150, spessoreMuro: 105 },
    latoCerniere: "destra",
    verso: "spingere",
    opzioni: {
      sopraluce: "nessuno",
      altezzaSopraluce: 0,
      vetro: false,
      oblo: false,
      latoFisso: "sinistra",
      larghezzaFisso: 0,
      ripartizioneAnte: "simmetrica",
    },
    ...overrides,
  };
}

describe("calcolaScheda — battente", () => {
  it("vano standard 880×2150 produce anta 800×2100 (misura standard)", () => {
    const esito = calcolaScheda(configBase());
    expect(esito.ok).toBe(true);
    const s = esito.scheda!;
    expect(s.ante).toHaveLength(1);
    expect(s.ante[0].larghezza).toBe(800);
    expect(s.ante[0].altezza).toBe(2100);
    expect(s.misuraStandardVicina).toBe("800 × 2100 mm");
    expect(s.falsoTelaio.larghezza).toBe(870);
    expect(s.falsoTelaio.altezza).toBe(2145);
    expect(s.falsoTelaio.profondita).toBe(105);
    expect(s.lucePassaggio.larghezza).toBe(800 - 24);
    expect(s.lucePassaggio.altezza).toBe(2100 - 12);
  });

  it("cerniere a destra ⇒ porta DESTRA con maniglia a sinistra", () => {
    const esito = calcolaScheda(configBase({ latoCerniere: "destra", verso: "spingere" }));
    const s = esito.scheda!;
    expect(s.aperturaDescrizione).toBe("Porta DESTRA a spingere");
    expect(s.latoCerniere).toBe("destra");
    expect(s.latoManiglia).toBe("sinistra");
  });

  it("cerniere a sinistra a tirare ⇒ porta SINISTRA con maniglia a destra", () => {
    const esito = calcolaScheda(configBase({ latoCerniere: "sinistra", verso: "tirare" }));
    const s = esito.scheda!;
    expect(s.aperturaDescrizione).toBe("Porta SINISTRA a tirare");
    expect(s.latoManiglia).toBe("destra");
  });

  it("sopraluce riduce l'altezza dell'anta", () => {
    const esito = calcolaScheda(
      configBase({
        vano: { larghezza: 880, altezza: 2450, spessoreMuro: 105 },
        opzioni: { ...configBase().opzioni, sopraluce: "vetrato", altezzaSopraluce: 300 },
      })
    );
    expect(esito.ok).toBe(true);
    const s = esito.scheda!;
    expect(s.sopraluce).toEqual({ larghezza: 870, altezza: 300, tipo: "vetrato" });
    expect(s.ante[0].altezza).toBe(2450 - 300 - 50);
  });

  it("vano fuori range del modello ⇒ errore", () => {
    const esito = calcolaScheda(configBase({ vano: { larghezza: 500, altezza: 2150, spessoreMuro: 105 } }));
    expect(esito.ok).toBe(false);
    expect(esito.errori.join(" ")).toContain("Larghezza vano 500 mm fuori range");
  });

  it("anta fuori standard genera avviso su misura", () => {
    const esito = calcolaScheda(configBase({ vano: { larghezza: 1030, altezza: 2150, spessoreMuro: 105 } }));
    expect(esito.ok).toBe(true);
    expect(esito.scheda!.misuraStandardVicina).toBeUndefined();
    expect(esito.scheda!.avvisi.join(" ")).toContain("fuori misura standard");
  });

  it("oblò su modello che non lo supporta ⇒ errore", () => {
    const esito = calcolaScheda(
      configBase({
        modelloId: "filomuro",
        vano: { larghezza: 900, altezza: 2150, spessoreMuro: 120 },
        opzioni: { ...configBase().opzioni, oblo: true },
      })
    );
    expect(esito.ok).toBe(false);
    expect(esito.errori.join(" ")).toContain("non supporta l'oblò");
  });
});

describe("calcolaScheda — doppia battente", () => {
  it("ripartizione simmetrica divide la larghezza tra le ante", () => {
    const esito = calcolaScheda(
      configBase({
        tipologia: "doppia_battente",
        vano: { larghezza: 1330, altezza: 2150, spessoreMuro: 105 },
      })
    );
    expect(esito.ok).toBe(true);
    const s = esito.scheda!;
    expect(s.ante).toHaveLength(2);
    const totale = 1330 - 80 + 25;
    expect(s.ante[0].larghezza + s.ante[1].larghezza).toBe(totale);
    expect(Math.abs(s.ante[0].larghezza - s.ante[1].larghezza)).toBeLessThanOrEqual(1);
    expect(s.ante[1].ruolo).toBe("semifissa");
  });

  it("ripartizione asimmetrica: semifissa ≈ 1/3", () => {
    const esito = calcolaScheda(
      configBase({
        tipologia: "doppia_battente",
        vano: { larghezza: 1330, altezza: 2150, spessoreMuro: 105 },
        opzioni: { ...configBase().opzioni, ripartizioneAnte: "asimmetrica" },
      })
    );
    const s = esito.scheda!;
    expect(s.ante[1].larghezza).toBe(Math.round((1330 - 80 + 25) / 3));
  });
});

describe("calcolaScheda — battente con fianco fisso", () => {
  it("fisso automatico = 1/3 del vano, anta sul resto", () => {
    const esito = calcolaScheda(
      configBase({
        tipologia: "battente_fisso",
        vano: { larghezza: 1200, altezza: 2150, spessoreMuro: 105 },
      })
    );
    expect(esito.ok).toBe(true);
    const s = esito.scheda!;
    expect(s.fisso!.larghezza).toBe(400);
    expect(s.ante[0].larghezza).toBe(1200 - 400 - 80);
  });

  it("fisso troppo largo ⇒ errore", () => {
    const esito = calcolaScheda(
      configBase({
        tipologia: "battente_fisso",
        vano: { larghezza: 1200, altezza: 2150, spessoreMuro: 105 },
        opzioni: { ...configBase().opzioni, larghezzaFisso: 700 },
      })
    );
    expect(esito.ok).toBe(false);
    expect(esito.errori.join(" ")).toContain("troppo largo");
  });
});

describe("calcolaScheda — scorrevoli", () => {
  it("scomparsa: anta con sormonto e ingombro controtelaio 2L+110 / H+90", () => {
    const esito = calcolaScheda(
      configBase({
        modelloId: "scorrevole-scomparsa",
        tipologia: "scorrevole_scomparsa",
        vano: { larghezza: 800, altezza: 2100, spessoreMuro: 120 },
      })
    );
    expect(esito.ok).toBe(true);
    const s = esito.scheda!;
    expect(s.ante[0].larghezza).toBe(850);
    expect(s.ante[0].altezza).toBe(2140);
    expect(s.ingombroControtelaio).toEqual({ larghezza: 2 * 800 + 110, altezza: 2100 + 90 });
    expect(s.lucePassaggio).toEqual({ larghezza: 800, altezza: 2100 });
    expect(s.aperturaDescrizione).toBe("Anta scorrevole verso destra");
  });

  it("esterno muro: binario = 2 × larghezza anta", () => {
    const esito = calcolaScheda(
      configBase({
        modelloId: "scorrevole-esterno",
        tipologia: "scorrevole_esterno",
        vano: { larghezza: 800, altezza: 2100, spessoreMuro: 120 },
      })
    );
    expect(esito.ok).toBe(true);
    expect(esito.scheda!.lunghezzaBinario).toBe(2 * 900);
  });
});

describe("validaConfig", () => {
  it("accetta configurazione valida", () => {
    const res = validaConfig(configBase());
    expect(res.ok).toBe(true);
  });

  it("rifiuta misure non intere o fuori range", () => {
    const res = validaConfig(
      configBase({ vano: { larghezza: 880.5, altezza: 100, spessoreMuro: 105 } })
    );
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.errori.join(" ")).toContain("millimetri interi");
      expect(res.errori.join(" ")).toContain("Altezza vano");
    }
  });

  it("rifiuta nome vuoto", () => {
    const res = validaConfig(configBase({ nome: "  " }));
    expect(res.ok).toBe(false);
  });
});
