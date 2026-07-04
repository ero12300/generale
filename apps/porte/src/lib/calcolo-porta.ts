import type {
  Avvertenza,
  DimensioniAnta,
  DimensioniCoprifilo,
  DimensioniFisso,
  DimensioniInput,
  DimensioniSopraluce,
  DimensioniTelaio,
  ModelloPorta,
  OpzioniPorta,
  RisultatoCalcolo,
} from "./types";

/**
 * Costanti tecniche derivate dagli standard italiani per porte interne.
 * Fonti: DM 236/1989 (barriere architettoniche), Eclisse, Pivato, Idealista,
 * ShowroomInfissi, guida BonusCasaFacile 2026.
 *
 * Tolleranze di montaggio dichiarate dai principali produttori:
 * - Foro muro larghezza = anta + 10 cm (5 cm per lato: telaio ~3.3 cm + gioco)
 * - Foro muro altezza   = anta + 5 cm (dal pavimento finito)
 * - Telaio (stipite): spessore 33 mm, battuta 12 mm
 * - Coprifilo standard: 60-100 mm larghezza, spessore 10 mm
 * - Coprifilo telescopico: regolazione con passo 15 mm fino a muri di 580 mm
 * - Luce netta minima: 75 cm (interni), 80 cm (ingresso)
 */

const TELAIO_LARGHEZZA_PER_LATO_CM = 5; // 3.3 cm stipite + 1.7 cm tolleranza di posa
const TELAIO_ALTEZZA_SUPERIORE_CM = 5; // Stipite superiore + tolleranza (pavimento finito = 0)
const TELAIO_SPESSORE_STANDARD_MM = 33;
const TELAIO_BATTUTA_MM = 12;
const ANTA_SPESSORE_STANDARD_MM = 44;
const COPRIFILO_LARGHEZZA_STANDARD_MM = 70;
const COPRIFILO_SPESSORE_MM = 10;
const COPRIFILO_TELESCOPICO_MIN_MM = 80;
const COPRIFILO_TELESCOPICO_MAX_MM = 580;
const LUCE_NETTA_MINIMA_INTERNI_CM = 75;
const LUCE_NETTA_MINIMA_INGRESSO_CM = 80;
const SPESSORE_MURO_MINIMO_STANDARD_CM = 8;
const SPESSORE_MURO_MAX_STANDARD_CM = 15;
const ANTA_LARGHEZZA_STANDARD_MIN_CM = 60;
const ANTA_LARGHEZZA_STANDARD_MAX_CM = 120;
const ANTA_ALTEZZA_STANDARD_MIN_CM = 200;
const ANTA_ALTEZZA_STANDARD_MAX_CM = 288;

/**
 * Larghezze commerciali standard delle ante: quando la larghezza calcolata
 * è vicina a una di queste, la arrotondiamo per usare pannelli standard.
 */
const ANTE_LARGHEZZE_STANDARD_CM = [60, 65, 70, 75, 80, 85, 90, 100];
const ANTE_ALTEZZE_STANDARD_CM = [200, 210, 220, 240];

const TOLLERANZA_LARGHEZZA_CM = 1.5;
const TOLLERANZA_ALTEZZA_CM = 2.5;

function arrotondaAStandardOppureCm(
  valore: number,
  standard: number[],
  tolleranza: number,
): number {
  for (const s of standard) {
    if (Math.abs(valore - s) <= tolleranza) return s;
  }
  return Math.round(valore * 2) / 2; // arrotondo a 0.5 cm
}

interface CalcoloBase {
  antaLarghezza: number;
  antaAltezza: number;
  telaioLarghezza: number;
  telaioAltezza: number;
  descrizione: string;
}

function calcolaBaseBattente(dim: DimensioniInput): CalcoloBase {
  const antaLarghezzaGrezza = dim.foroLarghezzaCm - 2 * TELAIO_LARGHEZZA_PER_LATO_CM;
  const antaAltezzaGrezza = dim.foroAltezzaCm - TELAIO_ALTEZZA_SUPERIORE_CM;
  return {
    antaLarghezza: arrotondaAStandardOppureCm(
      antaLarghezzaGrezza,
      ANTE_LARGHEZZE_STANDARD_CM,
      TOLLERANZA_LARGHEZZA_CM,
    ),
    antaAltezza: arrotondaAStandardOppureCm(
      antaAltezzaGrezza,
      ANTE_ALTEZZE_STANDARD_CM,
      TOLLERANZA_ALTEZZA_CM,
    ),
    telaioLarghezza: dim.foroLarghezzaCm,
    telaioAltezza: dim.foroAltezzaCm,
    descrizione:
      "Porta a battente con telaio inserito nel foro muro. Coprifilo su entrambe le facce.",
  };
}

function calcolaBaseFiloMuro(dim: DimensioniInput): CalcoloBase {
  // Il filo muro ha telaio nascosto: la riduzione anta è minore (~3 cm/lato).
  const antaLarghezzaGrezza = dim.foroLarghezzaCm - 6;
  const antaAltezzaGrezza = dim.foroAltezzaCm - 3;
  return {
    antaLarghezza: arrotondaAStandardOppureCm(
      antaLarghezzaGrezza,
      ANTE_LARGHEZZE_STANDARD_CM,
      TOLLERANZA_LARGHEZZA_CM,
    ),
    antaAltezza: arrotondaAStandardOppureCm(
      antaAltezzaGrezza,
      ANTE_ALTEZZE_STANDARD_CM,
      TOLLERANZA_ALTEZZA_CM,
    ),
    telaioLarghezza: dim.foroLarghezzaCm,
    telaioAltezza: dim.foroAltezzaCm,
    descrizione:
      "Porta filo muro con telaio nascosto, complanare alla parete. Nessun coprifilo a vista.",
  };
}

function calcolaBaseScorrevoleEsterno(dim: DimensioniInput): CalcoloBase {
  // L'anta copre il vano con sovrapposizione di 5 cm per lato per garantire chiusura.
  const antaLarghezza = arrotondaAStandardOppureCm(
    dim.foroLarghezzaCm + 5,
    ANTE_LARGHEZZE_STANDARD_CM,
    TOLLERANZA_LARGHEZZA_CM,
  );
  const antaAltezza = arrotondaAStandardOppureCm(
    dim.foroAltezzaCm + 3,
    ANTE_ALTEZZE_STANDARD_CM,
    TOLLERANZA_ALTEZZA_CM,
  );
  return {
    antaLarghezza,
    antaAltezza,
    telaioLarghezza: 0,
    telaioAltezza: 0,
    descrizione:
      "Porta scorrevole esterno muro con binario a vista. L'anta è più grande del vano per garantire copertura.",
  };
}

function calcolaBaseScorrevoleScomparsa(dim: DimensioniInput): CalcoloBase {
  // Il controtelaio a scomparsa richiede spazio pari alla luce di passaggio nel muro adiacente.
  // L'anta viene leggermente sottodimensionata per scorrere dentro il controtelaio.
  const antaLarghezzaGrezza = dim.foroLarghezzaCm - 2;
  const antaAltezzaGrezza = dim.foroAltezzaCm - 2;
  return {
    antaLarghezza: arrotondaAStandardOppureCm(
      antaLarghezzaGrezza,
      ANTE_LARGHEZZE_STANDARD_CM,
      TOLLERANZA_LARGHEZZA_CM,
    ),
    antaAltezza: arrotondaAStandardOppureCm(
      antaAltezzaGrezza,
      ANTE_ALTEZZE_STANDARD_CM,
      TOLLERANZA_ALTEZZA_CM,
    ),
    telaioLarghezza: dim.foroLarghezzaCm,
    telaioAltezza: dim.foroAltezzaCm,
    descrizione:
      "Porta scorrevole a scomparsa in controtelaio murato. Massimo ingombro ≈ 2× luce di passaggio.",
  };
}

function calcolaBase(modello: ModelloPorta, dim: DimensioniInput): CalcoloBase {
  switch (modello) {
    case "battente":
      return calcolaBaseBattente(dim);
    case "filo-muro":
      return calcolaBaseFiloMuro(dim);
    case "scorrevole-esterno":
      return calcolaBaseScorrevoleEsterno(dim);
    case "scorrevole-interno-scomparsa":
      return calcolaBaseScorrevoleScomparsa(dim);
    default: {
      const _exhaustive: never = modello;
      return _exhaustive;
    }
  }
}

function calcolaCoprifilo(
  opzioni: OpzioniPorta,
  spessoreMuroCm: number,
): DimensioniCoprifilo {
  const tipo = opzioni.coprifilo;
  if (tipo === "nessuno") {
    return {
      tipo: "nessuno",
      larghezzaMm: 0,
      spessoreMm: 0,
    };
  }
  if (tipo === "telescopico" || opzioni.bussola) {
    // Il coprifilo telescopico è consigliato quando c'è la bussola / muro non standard.
    const rangeMax = Math.max(spessoreMuroCm * 10, COPRIFILO_TELESCOPICO_MIN_MM);
    return {
      tipo: "telescopico",
      larghezzaMm: 80,
      spessoreMm: COPRIFILO_SPESSORE_MM,
      telescopicoRangeMm: [
        COPRIFILO_TELESCOPICO_MIN_MM,
        Math.min(rangeMax + 40, COPRIFILO_TELESCOPICO_MAX_MM),
      ],
    };
  }
  return {
    tipo: "dritto",
    larghezzaMm: COPRIFILO_LARGHEZZA_STANDARD_MM,
    spessoreMm: COPRIFILO_SPESSORE_MM,
  };
}

function calcolaTelaio(base: CalcoloBase, spessoreMuroCm: number): DimensioniTelaio {
  const spessoreMuroMm = spessoreMuroCm * 10;
  // Il telaio va scelto per lo spessore del muro. Formato standard consigliato = spessore muro.
  return {
    larghezzaCm: base.telaioLarghezza,
    altezzaCm: base.telaioAltezza,
    profondita: {
      minMm: Math.max(80, spessoreMuroMm - 10),
      maxMm: spessoreMuroMm + 10,
      consigliatoMm: Math.round(spessoreMuroMm),
    },
    battutaMm: TELAIO_BATTUTA_MM,
  };
}

function calcolaFisso(
  opzioni: OpzioniPorta,
  base: CalcoloBase,
): DimensioniFisso | undefined {
  if (!opzioni.fisso) return undefined;
  const larghezza = opzioni.fissoLarghezzaCm ?? 40;
  return {
    larghezzaCm: larghezza,
    altezzaCm: base.antaAltezza,
  };
}

function calcolaSopraluce(
  opzioni: OpzioniPorta,
  base: CalcoloBase,
): DimensioniSopraluce | undefined {
  if (!opzioni.sopraluce) return undefined;
  const altezza = opzioni.sopraluceAltezzaCm ?? 30;
  return {
    larghezzaCm: base.telaioLarghezza,
    altezzaCm: altezza,
  };
}

function calcolaAvvertenze(
  dim: DimensioniInput,
  opzioni: OpzioniPorta,
  anta: DimensioniAnta,
  luceNettaCm: number,
  modello: ModelloPorta,
): Avvertenza[] {
  const out: Avvertenza[] = [];

  if (
    dim.foroLarghezzaCm < ANTA_LARGHEZZA_STANDARD_MIN_CM + 2 * TELAIO_LARGHEZZA_PER_LATO_CM
  ) {
    out.push({
      livello: "attenzione",
      messaggio: `Foro muro molto stretto: l'anta risultante è inferiore alla misura standard minima di ${ANTA_LARGHEZZA_STANDARD_MIN_CM} cm.`,
    });
  }
  if (dim.foroLarghezzaCm > ANTA_LARGHEZZA_STANDARD_MAX_CM + 2 * TELAIO_LARGHEZZA_PER_LATO_CM) {
    out.push({
      livello: "info",
      messaggio: `Anta oltre 100 cm: valutare doppia anta o richiedere lavorazione su misura.`,
    });
  }
  if (dim.foroAltezzaCm < ANTA_ALTEZZA_STANDARD_MIN_CM + TELAIO_ALTEZZA_SUPERIORE_CM) {
    out.push({
      livello: "attenzione",
      messaggio: `Foro muro basso: altezza inferiore al minimo standard (200 cm).`,
    });
  }
  if (dim.foroAltezzaCm > ANTA_ALTEZZA_STANDARD_MAX_CM + TELAIO_ALTEZZA_SUPERIORE_CM) {
    out.push({
      livello: "info",
      messaggio: `Altezza foro oltre lo standard: verificare disponibilità telaio maggiorato.`,
    });
  }
  if (luceNettaCm < LUCE_NETTA_MINIMA_INTERNI_CM) {
    out.push({
      livello: "errore",
      messaggio: `Luce netta di passaggio ${luceNettaCm.toFixed(1)} cm sotto il minimo normativo di ${LUCE_NETTA_MINIMA_INTERNI_CM} cm (DM 236/1989).`,
    });
  } else if (luceNettaCm < LUCE_NETTA_MINIMA_INGRESSO_CM) {
    out.push({
      livello: "info",
      messaggio: `Luce netta ${luceNettaCm.toFixed(1)} cm: OK per porta interna, non conforme per porta di ingresso (min 80 cm).`,
    });
  }
  if (
    dim.spessoreMuroCm < SPESSORE_MURO_MINIMO_STANDARD_CM ||
    dim.spessoreMuroCm > SPESSORE_MURO_MAX_STANDARD_CM
  ) {
    if (!opzioni.bussola && opzioni.coprifilo !== "telescopico") {
      out.push({
        livello: "attenzione",
        messaggio: `Spessore muro ${dim.spessoreMuroCm} cm fuori dallo standard 8-15 cm: consigliato coprifilo telescopico o sistema bussola.`,
      });
    }
  }
  if (opzioni.bussola && opzioni.coprifilo === "nessuno") {
    out.push({
      livello: "attenzione",
      messaggio: `Sistema bussola attivato senza coprifilo: verificare che l'imbotte copra tutto lo spessore muro.`,
    });
  }
  if (modello === "filo-muro" && opzioni.coprifilo !== "nessuno") {
    out.push({
      livello: "info",
      messaggio: `Porta filo muro: normalmente non prevede coprifilo. Verifica scelta.`,
    });
  }
  if (opzioni.sopraluce && (opzioni.sopraluceAltezzaCm ?? 0) < 15) {
    out.push({
      livello: "attenzione",
      messaggio: `Sopraluce sotto i 15 cm: verificare fattibilità con il produttore.`,
    });
  }
  if (opzioni.fisso && (opzioni.fissoLarghezzaCm ?? 0) < 20) {
    out.push({
      livello: "attenzione",
      messaggio: `Pannello fisso sotto i 20 cm: minimo consigliato per stabilità.`,
    });
  }
  if (anta.larghezzaCm < 40) {
    out.push({
      livello: "errore",
      messaggio: `Anta calcolata inferiore a 40 cm: dimensione non producibile.`,
    });
  }
  return out;
}

export function calcolaPorta(
  modello: ModelloPorta,
  dim: DimensioniInput,
  opzioni: OpzioniPorta,
): RisultatoCalcolo {
  const base = calcolaBase(modello, dim);

  const anta: DimensioniAnta = {
    larghezzaCm: base.antaLarghezza,
    altezzaCm: base.antaAltezza,
    spessoreMm: ANTA_SPESSORE_STANDARD_MM,
  };

  const telaio = calcolaTelaio(base, dim.spessoreMuroCm);
  const coprifilo = calcolaCoprifilo(opzioni, dim.spessoreMuroCm);
  const fisso = calcolaFisso(opzioni, base);
  const sopraluce = calcolaSopraluce(opzioni, base);

  const luceNettaCm =
    modello === "scorrevole-esterno"
      ? dim.foroLarghezzaCm
      : anta.larghezzaCm - TELAIO_BATTUTA_MM / 10 - 2;

  const ingombroTotaleLarghezzaCm =
    modello === "scorrevole-esterno"
      ? dim.foroLarghezzaCm + anta.larghezzaCm + 5
      : modello === "scorrevole-interno-scomparsa"
        ? dim.foroLarghezzaCm * 2
        : dim.foroLarghezzaCm +
          (coprifilo.tipo === "nessuno" ? 0 : (coprifilo.larghezzaMm / 10) * 2) +
          (fisso ? fisso.larghezzaCm + 4 : 0);

  const ingombroTotaleAltezzaCm =
    dim.foroAltezzaCm +
    (coprifilo.tipo === "nessuno" ? 0 : coprifilo.larghezzaMm / 10) +
    (sopraluce ? sopraluce.altezzaCm + 4 : 0);

  const avvertenze = calcolaAvvertenze(dim, opzioni, anta, luceNettaCm, modello);

  return {
    anta,
    telaio,
    coprifilo,
    fisso,
    sopraluce,
    luceNettaCm: Math.max(0, Math.round(luceNettaCm * 10) / 10),
    ingombroTotaleLarghezzaCm: Math.round(ingombroTotaleLarghezzaCm * 10) / 10,
    ingombroTotaleAltezzaCm: Math.round(ingombroTotaleAltezzaCm * 10) / 10,
    avvertenze,
    descrizioneModello: base.descrizione,
  };
}

export const COSTANTI_TECNICHE = {
  TELAIO_LARGHEZZA_PER_LATO_CM,
  TELAIO_ALTEZZA_SUPERIORE_CM,
  TELAIO_SPESSORE_STANDARD_MM,
  TELAIO_BATTUTA_MM,
  ANTA_SPESSORE_STANDARD_MM,
  COPRIFILO_LARGHEZZA_STANDARD_MM,
  COPRIFILO_SPESSORE_MM,
  COPRIFILO_TELESCOPICO_MIN_MM,
  COPRIFILO_TELESCOPICO_MAX_MM,
  LUCE_NETTA_MINIMA_INTERNI_CM,
  LUCE_NETTA_MINIMA_INGRESSO_CM,
} as const;
