import { describe, expect, it } from "vitest";
import { calcolaPorta } from "./calcolo";
import { GIOCHI_PREDEFINITI, configurazionePredefinita } from "./defaults";
import { configurazionePortaSchema } from "./types";
import type { ConfigurazionePorta } from "./types";

function configura(
  override: Partial<ConfigurazionePorta> = {},
): ConfigurazionePorta {
  const parsed = configurazionePortaSchema.parse({
    ...configurazionePredefinita("interna"),
    ...override,
  });
  return parsed;
}

describe("calcolaPorta – porta interna semplice", () => {
  // Foro muro 900 × 2160, giochi standard interna:
  // aria 10, montante/traverso 45, battuta 12, gioco pavimento 7.
  const risultato = calcolaPorta(configura());

  it("calcola l'esterno telaio detraendo l'aria di posa", () => {
    expect(risultato.telaio).toEqual({ larghezza: 880, altezza: 2150 });
  });

  it("calcola la luce netta detraendo il telaio", () => {
    // 880 − 2×45 = 790 ; 2150 − 45 = 2105
    expect(risultato.luceNetta).toEqual({ larghezza: 790, altezza: 2105 });
  });

  it("calcola l'anta con battute e gioco pavimento", () => {
    // 790 + 2×12 = 814 ; 2105 + 12 − 7 = 2110
    expect(risultato.anta.larghezza).toBe(814);
    expect(risultato.anta.altezza).toBe(2110);
    expect(risultato.anta.spessore).toBe(44);
  });

  it("non segnala errori e rispetta il minimo normativo (750 mm)", () => {
    expect(risultato.avvisi.filter((a) => a.livello === "errore")).toHaveLength(0);
    expect(
      risultato.avvisi.find((a) => a.codice === "LUCE_SOTTO_MINIMO"),
    ).toBeUndefined();
  });
});

describe("calcolaPorta – mano e verso", () => {
  it("mano destra: cerniere a destra, maniglia a sinistra", () => {
    const r = calcolaPorta(configura({ mano: "destra", verso: "spingere" }));
    expect(r.latoCerniere).toBe("destra");
    expect(r.latoManiglia).toBe("sinistra");
    expect(r.etichettaApertura).toBe("Destra a spingere");
  });

  it("mano sinistra a tirare", () => {
    const r = calcolaPorta(configura({ mano: "sinistra", verso: "tirare" }));
    expect(r.latoCerniere).toBe("sinistra");
    expect(r.latoManiglia).toBe("destra");
    expect(r.etichettaApertura).toBe("Sinistra a tirare");
  });
});

describe("calcolaPorta – fisso laterale", () => {
  it("detrae il fisso e il montante aggiuntivo dalla luce anta", () => {
    const r = calcolaPorta(
      configura({ foroLarghezza: 1400, fissoPosizione: "sinistra", fissoLarghezza: 400 }),
    );
    // telaio 1380 ; luce anta = 1380 − 3×45 − 400 = 845
    expect(r.telaio.larghezza).toBe(1380);
    expect(r.luceNetta.larghezza).toBe(845);
    expect(r.numeroFissi).toBe(1);
    expect(r.fisso).toEqual({ larghezza: 400, altezza: 2105 });
  });

  it("con due fissi detrae due moduli e quattro montanti", () => {
    const r = calcolaPorta(
      configura({ foroLarghezza: 2000, fissoPosizione: "entrambi", fissoLarghezza: 400 }),
    );
    // telaio 1980 ; luce anta = 1980 − 4×45 − 2×400 = 1000
    expect(r.luceNetta.larghezza).toBe(1000);
    expect(r.numeroFissi).toBe(2);
  });
});

describe("calcolaPorta – sopraluce", () => {
  it("detrae sopraluce e traverso aggiuntivo dall'altezza", () => {
    const r = calcolaPorta(
      configura({ foroAltezza: 2600, sopraluceTipo: "fisso", sopraluceAltezza: 350 }),
    );
    // telaio h 2590 ; luce anta = 2590 − 45 − 350 − 45 = 2150
    expect(r.luceNetta.altezza).toBe(2150);
    expect(r.sopraluce).toEqual({ larghezza: 790, altezza: 350, tipo: "fisso" });
  });

  it("sopraluce a compasso mantiene il tipo nel risultato", () => {
    const r = calcolaPorta(
      configura({ foroAltezza: 2600, sopraluceTipo: "compasso", sopraluceAltezza: 350 }),
    );
    expect(r.sopraluce?.tipo).toBe("compasso");
  });
});

describe("calcolaPorta – avvisi", () => {
  it("segnala luce netta sotto il minimo normativo", () => {
    const r = calcolaPorta(configura({ foroLarghezza: 800 }));
    // luce = 800 − 20 − 90 = 690 < 750
    expect(r.luceNetta.larghezza).toBe(690);
    expect(r.avvisi.some((a) => a.codice === "LUCE_SOTTO_MINIMO")).toBe(true);
  });

  it("segnala errore per foro troppo piccolo", () => {
    const r = calcolaPorta(configura({ foroLarghezza: 450 }));
    expect(r.avvisi.some((a) => a.codice === "FORO_INSUFFICIENTE")).toBe(true);
  });

  it("segnala anta pesante oltre 1000 mm", () => {
    const r = calcolaPorta(configura({ foroLarghezza: 1300 }));
    expect(r.anta.larghezza).toBeGreaterThan(1000);
    expect(r.avvisi.some((a) => a.codice === "ANTA_PESANTE")).toBe(true);
  });

  it("porta ingresso richiede minimo 800 mm", () => {
    const base = configurazionePredefinita("ingresso");
    const r = calcolaPorta(
      configurazionePortaSchema.parse({ ...base, foroLarghezza: 940 }),
    );
    // telaio 920 ; luce = 920 − 120 = 800 → ok
    expect(r.luceNetta.larghezza).toBe(800);
    expect(r.avvisi.some((a) => a.codice === "LUCE_SOTTO_MINIMO")).toBe(false);

    const r2 = calcolaPorta(
      configurazionePortaSchema.parse({ ...base, foroLarghezza: 930 }),
    );
    expect(r2.avvisi.some((a) => a.codice === "LUCE_SOTTO_MINIMO")).toBe(true);
  });

  it("riconosce la misura commerciale standard 80 × 210", () => {
    // anta 800 ⇒ luce 776 ⇒ telaio 866 ⇒ foro 886
    // anta h 2100 ⇒ luce 2095 ⇒ telaio 2140 ⇒ foro 2150
    const r = calcolaPorta(configura({ foroLarghezza: 886, foroAltezza: 2150 }));
    expect(r.anta.larghezza).toBe(800);
    expect(r.anta.altezza).toBe(2100);
    expect(r.misuraStandard).toBe("80 × 210 cm");
  });
});

describe("validazione configurazione", () => {
  it("rifiuta un fisso che non lascia spazio all'anta", () => {
    const parsed = configurazionePortaSchema.safeParse({
      ...configurazionePredefinita("interna"),
      foroLarghezza: 900,
      fissoPosizione: "sinistra",
      fissoLarghezza: 400,
    });
    expect(parsed.success).toBe(false);
  });

  it("rifiuta un sopraluce che riduce troppo la luce di passaggio", () => {
    const parsed = configurazionePortaSchema.safeParse({
      ...configurazionePredefinita("interna"),
      foroAltezza: 2160,
      sopraluceTipo: "fisso",
      sopraluceAltezza: 400,
    });
    expect(parsed.success).toBe(false);
  });

  it("accetta la configurazione predefinita di entrambi i modelli", () => {
    expect(
      configurazionePortaSchema.safeParse(configurazionePredefinita("interna")).success,
    ).toBe(true);
    expect(
      configurazionePortaSchema.safeParse(configurazionePredefinita("ingresso")).success,
    ).toBe(true);
  });

  it("i giochi predefiniti rispettano lo schema", () => {
    expect(GIOCHI_PREDEFINITI.interna.battuta).toBeGreaterThan(0);
    expect(GIOCHI_PREDEFINITI.ingresso.montanteTelaio).toBeGreaterThan(0);
  });
});
