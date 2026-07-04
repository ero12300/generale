import { describe, expect, it } from "vitest";
import { calcolaPorta } from "../calcolo";
import { CONFIG_INIZIALE, schemaConfigurazione } from "../schema";
import type { ConfigurazionePorta } from "../tipi";

function config(override: Partial<ConfigurazionePorta> = {}): ConfigurazionePorta {
  return {
    ...CONFIG_INIZIALE,
    commessa: "Test",
    ...override,
    foroMuro: { ...CONFIG_INIZIALE.foroMuro, ...override.foroMuro },
    apertura: { ...CONFIG_INIZIALE.apertura, ...override.apertura },
    fisso: { ...CONFIG_INIZIALE.fisso, ...override.fisso },
    display: { ...CONFIG_INIZIALE.display, ...override.display },
    oblo: { ...CONFIG_INIZIALE.oblo, ...override.oblo },
  };
}

describe("calcolaPorta — battente (tabella standard di settore)", () => {
  // Riferimento: foro muro 900×2150 → anta 800×2100, esterno telaio 880×2140.
  it("foro muro 900×2150 produce anta standard 800×2100", () => {
    const r = calcolaPorta(config());
    expect(r.ok).toBe(true);
    expect(r.anta).toEqual({ larghezza: 800, altezza: 2100 });
    expect(r.lucePassaggio).toEqual({ larghezza: 800, altezza: 2100 });
    expect(r.esternoTelaio).toEqual({ larghezza: 880, altezza: 2140 });
    expect(r.controtelaio).toEqual({ larghezza: 900, altezza: 2150 });
    expect(r.misuraStandard).toEqual({ esatta: true, larghezza: 800, altezza: 2100 });
  });

  it("foro muro 800×2150 produce anta standard 700×2100", () => {
    const r = calcolaPorta(config({ foroMuro: { larghezza: 800, altezza: 2150, spessoreMuro: 105 } }));
    expect(r.anta).toEqual({ larghezza: 700, altezza: 2100 });
  });

  it("misura non standard genera avviso su misura", () => {
    const r = calcolaPorta(config({ foroMuro: { larghezza: 930, altezza: 2150, spessoreMuro: 105 } }));
    expect(r.ok).toBe(true);
    expect(r.anta.larghezza).toBe(830);
    expect(r.misuraStandard?.esatta).toBe(false);
    expect(r.avvisi.some((a) => a.includes("fuori misura standard"))).toBe(true);
  });

  it("verso destra a spingere: cerniere a destra, maniglia a sinistra", () => {
    const r = calcolaPorta(config({ apertura: { lato: "destra", movimento: "spingere" } }));
    expect(r.ferramenta.latoCerniere).toBe("destra");
    expect(r.ferramenta.latoManiglia).toBe("sinistra");
    expect(r.ferramenta.descrizioneApertura).toBe("Destra a spingere");
    expect(r.ferramenta.numeroCerniere).toBe(3);
  });

  it("anta alta oltre 2200 richiede 4 cerniere", () => {
    const r = calcolaPorta(config({ foroMuro: { larghezza: 900, altezza: 2400, spessoreMuro: 105 } }));
    expect(r.anta.altezza).toBe(2350);
    expect(r.ferramenta.numeroCerniere).toBe(4);
  });

  it("anta troppo stretta blocca la produzione", () => {
    const r = calcolaPorta(config({ foroMuro: { larghezza: 450, altezza: 2150, spessoreMuro: 105 } }));
    expect(r.ok).toBe(false);
    expect(r.errori.some((e) => e.includes("troppo stretta"))).toBe(true);
  });

  it("muro oltre 110 mm segnala allargamenti telaio", () => {
    const r = calcolaPorta(config({ foroMuro: { larghezza: 900, altezza: 2150, spessoreMuro: 250 } }));
    expect(r.ok).toBe(true);
    expect(r.telaio.allargamentiNecessari).toBe(true);
    expect(r.avvisi.some((a) => a.includes("allargamenti"))).toBe(true);
  });
});

describe("calcolaPorta — bussola 2 ante", () => {
  it("foro muro 1700×2150 produce due ante 800×2100", () => {
    const r = calcolaPorta(
      config({ modello: "bussola", foroMuro: { larghezza: 1700, altezza: 2150, spessoreMuro: 105 } })
    );
    expect(r.ok).toBe(true);
    expect(r.anta).toEqual({ larghezza: 800, altezza: 2100 });
    expect(r.antaSemifissa).toEqual({ larghezza: 800, altezza: 2100 });
  });

  it("larghezza dispari: anta principale arrotondata per eccesso", () => {
    const r = calcolaPorta(
      config({ modello: "bussola", foroMuro: { larghezza: 1301, altezza: 2150, spessoreMuro: 105 } })
    );
    expect(r.anta.larghezza + (r.antaSemifissa?.larghezza ?? 0)).toBe(1201);
    expect(r.anta.larghezza).toBe(601);
  });
});

describe("calcolaPorta — scorrevoli", () => {
  it("scomparsa: anta con sormonto e ingombro controtelaio 2L+110", () => {
    const r = calcolaPorta(
      config({
        modello: "scorrevole_scomparsa",
        foroMuro: { larghezza: 900, altezza: 2150, spessoreMuro: 125 },
      })
    );
    expect(r.anta).toEqual({ larghezza: 850, altezza: 2150 });
    expect(r.lucePassaggio).toEqual({ larghezza: 800, altezza: 2100 });
    expect(r.ingombroScorrevole).toEqual({ larghezza: 1710, altezza: 2240 });
    expect(r.ferramenta.numeroCerniere).toBe(0);
    expect(r.ferramenta.latoManiglia).toBeNull();
  });

  it("esterno muro: anta copre il vano con sormonto 50 mm per lato", () => {
    const r = calcolaPorta(
      config({
        modello: "scorrevole_esterno",
        foroMuro: { larghezza: 900, altezza: 2150, spessoreMuro: 105 },
      })
    );
    expect(r.anta).toEqual({ larghezza: 1000, altezza: 2200 });
    expect(r.ferramenta.descrizioneApertura).toContain("Scorrimento verso");
  });

  it("fisso laterale su scorrevole viene ignorato con avviso", () => {
    const r = calcolaPorta(
      config({
        modello: "scorrevole_scomparsa",
        fisso: { presente: true, lato: "sinistra", larghezza: 400 },
      })
    );
    expect(r.pannelloFisso).toBeNull();
    expect(r.avvisi.some((a) => a.includes("scorrevoli"))).toBe(true);
  });
});

describe("calcolaPorta — opzioni fisso, display, oblò", () => {
  it("fisso laterale riduce la larghezza dell'anta", () => {
    const r = calcolaPorta(
      config({
        foroMuro: { larghezza: 1300, altezza: 2150, spessoreMuro: 105 },
        fisso: { presente: true, lato: "sinistra", larghezza: 400 },
      })
    );
    expect(r.ok).toBe(true);
    expect(r.anta).toEqual({ larghezza: 800, altezza: 2100 });
    expect(r.pannelloFisso).toEqual({ larghezza: 400, altezza: 2100, lato: "sinistra" });
  });

  it("display riduce l'altezza dell'anta e calcola il taglio vetro", () => {
    const r = calcolaPorta(
      config({
        foroMuro: { larghezza: 900, altezza: 2450, spessoreMuro: 105 },
        display: { presente: true, altezza: 300 },
      })
    );
    expect(r.ok).toBe(true);
    expect(r.anta).toEqual({ larghezza: 800, altezza: 2100 });
    expect(r.vetroDisplay).toEqual({ larghezza: 800, altezza: 260 });
  });

  it("oblò valido viene confermato", () => {
    const r = calcolaPorta(
      config({ oblo: { presente: true, forma: "tondo", dimensione: 350, altezzaCentro: 1550 } })
    );
    expect(r.ok).toBe(true);
    expect(r.oblo?.forma).toBe("tondo");
  });

  it("oblò troppo grande per l'anta blocca la produzione", () => {
    const r = calcolaPorta(
      config({
        foroMuro: { larghezza: 650, altezza: 2150, spessoreMuro: 105 },
        oblo: { presente: true, forma: "tondo", dimensione: 400, altezzaCentro: 1550 },
      })
    );
    expect(r.ok).toBe(false);
    expect(r.errori.some((e) => e.includes("Oblò"))).toBe(true);
  });

  it("oblò troppo in alto blocca la produzione", () => {
    const r = calcolaPorta(
      config({ oblo: { presente: true, forma: "tondo", dimensione: 350, altezzaCentro: 2050 } })
    );
    expect(r.ok).toBe(false);
    expect(r.errori.some((e) => e.includes("centro oblò"))).toBe(true);
  });
});

describe("schemaConfigurazione", () => {
  it("accetta la configurazione iniziale con commessa", () => {
    const esito = schemaConfigurazione.safeParse({ ...CONFIG_INIZIALE, commessa: "Cliente Rossi" });
    expect(esito.success).toBe(true);
  });

  it("rifiuta commessa vuota e misure non intere", () => {
    const esito = schemaConfigurazione.safeParse({
      ...CONFIG_INIZIALE,
      commessa: "",
      foroMuro: { larghezza: 900.5, altezza: 2150, spessoreMuro: 105 },
    });
    expect(esito.success).toBe(false);
  });
});
