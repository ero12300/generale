/**
 * Motore di calcolo porte per interni — standard italiano.
 *
 * Convenzioni:
 *  - Tutte le misure sono in millimetri (mm).
 *  - Vano murario (VM) = apertura grezza nel muro (larghezza × altezza).
 *  - Controtelaio (CT) = struttura in legno da murare. Sta dentro il vano
 *    con un gioco di posa (default 10 mm per lato in larghezza, 10 mm
 *    sopra in altezza).
 *  - Luce di passaggio (LP) = passaggio netto una volta finito il telaio.
 *  - Anta (A) = pannello porta grezza. LP + sormonto/battuta.
 *
 * Formule di riferimento (medie industria italiana):
 *    CT_L = LP + 120     LP = CT_L - 120
 *    CT_H = LP + 60      LP = CT_H - 60
 *    A_L  = LP + 40      A_H = LP + 10
 *
 *  Cioè, dato il vano murario:
 *    CT_L max = VM_L - 2 * gioco_posa_lat        (default 10 mm)
 *    CT_H max = VM_H - gioco_posa_sup            (default 10 mm)
 *    LP_L     = CT_L - 120
 *    LP_H     = CT_H - 60
 *    A_L      = LP_L + 40
 *    A_H      = LP_H + 10
 *
 * Le taglie standard di anta prodotte in serie in Italia (larghezza):
 *   600, 700, 750, 800, 850, 900, 1000 mm.  Altezza: 2100 (standard),
 *   2200, 2400.
 */

export const ANTA_TAGLIE_STANDARD_L = [600, 700, 750, 800, 850, 900, 1000] as const;
export const ANTA_TAGLIE_STANDARD_H = [2100, 2200, 2400] as const;
export const ANTA_LARGHEZZA_MAX_STANDARD = 1050; // mm — oltre serve doppia anta o fisso
export const ANTA_ALTEZZA_MAX_STANDARD = 2450;

export const DEFAULT_GIOCO_POSA_LATERALE = 10;
export const DEFAULT_GIOCO_POSA_SUPERIORE = 10;
export const DEFAULT_INGOMBRO_TELAIO_L = 120; // CT_L - LP_L
export const DEFAULT_INGOMBRO_TELAIO_H = 60; // CT_H - LP_H
export const DEFAULT_SORMONTO_ANTA_L = 40; // A_L - LP_L
export const DEFAULT_SORMONTO_ANTA_H = 10; // A_H - LP_H

export type Mano = "sinistra" | "destra";
export type Verso = "tirare" | "spingere";
export type TipologiaApertura = "battente-singola" | "battente-doppia";

export type FormaSpecchiatura = "rettangolare" | "quadrata" | "verticale-alta";

export interface Specchiatura {
  presente: boolean;
  forma: FormaSpecchiatura;
  numeroPannelli: 1 | 2 | 3 | 4;
}

export interface Ovale {
  presente: boolean;
  larghezzaMm: number; // dimensione ovale (asse maggiore orizzontale)
  altezzaMm: number;
}

export interface FissoLaterale {
  presente: boolean;
  lato: "sinistro" | "destro";
  larghezzaMm: number;
  vetrato: boolean;
}

export interface FissoSuperiore {
  presente: boolean;
  altezzaMm: number;
  vetrato: boolean;
}

export interface VanoMurario {
  larghezzaMm: number;
  altezzaMm: number;
  spessoreParereMm: number; // spessore parete finita (per scegliere controtelaio)
}

export interface ParametriCalcolo {
  giocoPosaLateraleMm: number;
  giocoPosaSuperioreMm: number;
  ingombroTelaioLarghezzaMm: number;
  ingombroTelaioAltezzaMm: number;
  sormontoAntaLarghezzaMm: number;
  sormontoAntaAltezzaMm: number;
}

export const PARAMETRI_DEFAULT: ParametriCalcolo = {
  giocoPosaLateraleMm: DEFAULT_GIOCO_POSA_LATERALE,
  giocoPosaSuperioreMm: DEFAULT_GIOCO_POSA_SUPERIORE,
  ingombroTelaioLarghezzaMm: DEFAULT_INGOMBRO_TELAIO_L,
  ingombroTelaioAltezzaMm: DEFAULT_INGOMBRO_TELAIO_H,
  sormontoAntaLarghezzaMm: DEFAULT_SORMONTO_ANTA_L,
  sormontoAntaAltezzaMm: DEFAULT_SORMONTO_ANTA_H,
};

export interface ConfigurazionePorta {
  vano: VanoMurario;
  tipologia: TipologiaApertura;
  modello: string;
  mano: Mano;
  verso: Verso;
  specchiatura: Specchiatura;
  ovale: Ovale;
  fissoLaterale: FissoLaterale;
  fissoSuperiore: FissoSuperiore;
  parametri?: Partial<ParametriCalcolo>;
  note?: string;
}

export type LivelloAvviso = "info" | "warning" | "error";

export interface Avviso {
  livello: LivelloAvviso;
  messaggio: string;
}

export interface CalcoloPorta {
  vano: VanoMurario;
  controtelaio: { larghezzaMm: number; altezzaMm: number; spessoreMm: number };
  lucePassaggio: { larghezzaMm: number; altezzaMm: number };
  anta: {
    larghezzaMm: number;
    altezzaMm: number;
    tagliaStandardSuggerita: { larghezzaMm: number; altezzaMm: number } | null;
    fuoriSerie: boolean;
  };
  fissoLaterale: {
    presente: boolean;
    lato: "sinistro" | "destro" | null;
    larghezzaMm: number;
  };
  fissoSuperiore: { presente: boolean; altezzaMm: number };
  ingombroTotale: { larghezzaMm: number; altezzaMm: number };
  mano: Mano;
  verso: Verso;
  descrizioneManoVerso: string;
  siglaManoVerso: string;
  avvisi: Avviso[];
}

/**
 * Restituisce la sigla UNI EN 12519 per mano + verso di apertura.
 * DT = Destra Tirare, DS = Destra Spingere,
 * ST = Sinistra Tirare, SS = Sinistra Spingere.
 */
export function siglaManoVerso(mano: Mano, verso: Verso): string {
  const m = mano === "destra" ? "D" : "S";
  const v = verso === "tirare" ? "T" : "S";
  return `${m}${v}`;
}

export function descrizioneManoVerso(mano: Mano, verso: Verso): string {
  const manoLabel = mano === "destra" ? "Destra" : "Sinistra";
  const versoLabel = verso === "tirare" ? "tirare (apre verso l'osservatore)" : "spingere (apre lontano dall'osservatore)";
  return `${manoLabel} ${versoLabel} — cerniere a ${mano === "destra" ? "destra" : "sinistra"}, maniglia a ${mano === "destra" ? "sinistra" : "destra"}`;
}

function scegliTagliaStandard(mm: number, taglie: readonly number[]): number | null {
  let candidato: number | null = null;
  for (const t of taglie) {
    if (t <= mm) candidato = t;
  }
  return candidato;
}

function suggerisciTagliaStandard(
  antaL: number,
  antaH: number
): { larghezzaMm: number; altezzaMm: number } | null {
  const l = scegliTagliaStandard(antaL, ANTA_TAGLIE_STANDARD_L);
  const h = scegliTagliaStandard(antaH, ANTA_TAGLIE_STANDARD_H);
  if (l === null || h === null) return null;
  return { larghezzaMm: l, altezzaMm: h };
}

/**
 * Calcola l'intera scheda tecnica della porta a partire da vano murario
 * e configurazione. Nessun side-effect: puramente funzionale.
 */
export function calcolaPorta(config: ConfigurazionePorta): CalcoloPorta {
  const p: ParametriCalcolo = { ...PARAMETRI_DEFAULT, ...(config.parametri ?? {}) };
  const avvisi: Avviso[] = [];

  const vm = config.vano;

  if (vm.larghezzaMm <= 0 || vm.altezzaMm <= 0) {
    avvisi.push({ livello: "error", messaggio: "Vano murario non valido: larghezza e altezza devono essere > 0." });
  }
  if (vm.spessoreParereMm < 80 || vm.spessoreParereMm > 300) {
    avvisi.push({
      livello: "warning",
      messaggio: `Spessore parete ${vm.spessoreParereMm} mm fuori dal range comune (80–300 mm). Verificare il controtelaio.`,
    });
  }

  // 1. Controtelaio: massimo ingombro nel vano meno gioco di posa
  const larghezzaCT = Math.max(0, vm.larghezzaMm - 2 * p.giocoPosaLateraleMm);
  const altezzaCT = Math.max(0, vm.altezzaMm - p.giocoPosaSuperioreMm);

  // 2. Fisso superiore (sopraluce)
  const fissoSup = config.fissoSuperiore.presente
    ? Math.max(0, config.fissoSuperiore.altezzaMm)
    : 0;
  if (config.fissoSuperiore.presente && fissoSup < 200) {
    avvisi.push({
      livello: "warning",
      messaggio: "Fisso superiore < 200 mm: valuta se ha senso strutturalmente (minimo consigliato 250 mm).",
    });
  }

  // 3. Fisso laterale (bussola)
  const fissoLat = config.fissoLaterale.presente
    ? Math.max(0, config.fissoLaterale.larghezzaMm)
    : 0;
  if (config.fissoLaterale.presente && fissoLat < 200) {
    avvisi.push({
      livello: "warning",
      messaggio: "Fisso laterale < 200 mm: minimo consigliato 250 mm per una lavorazione pulita.",
    });
  }

  // 4. Luce di passaggio (solo anta, escluso fisso)
  const larghezzaLP = Math.max(0, larghezzaCT - p.ingombroTelaioLarghezzaMm - fissoLat);
  const altezzaLP = Math.max(0, altezzaCT - p.ingombroTelaioAltezzaMm - fissoSup);

  // 5. Anta
  let antaL = Math.max(0, larghezzaLP + p.sormontoAntaLarghezzaMm);
  const antaH = Math.max(0, altezzaLP + p.sormontoAntaAltezzaMm);

  if (config.tipologia === "battente-doppia") {
    // Anta simmetrica: ognuna metà della luce di passaggio + sormonto centrale
    antaL = Math.max(0, Math.round((larghezzaLP + p.sormontoAntaLarghezzaMm) / 2));
  }

  const tagliaStandard = suggerisciTagliaStandard(antaL, antaH);
  const fuoriSerie =
    tagliaStandard === null ||
    Math.abs(tagliaStandard.larghezzaMm - antaL) > 15 ||
    Math.abs(tagliaStandard.altezzaMm - antaH) > 20;

  if (antaL > ANTA_LARGHEZZA_MAX_STANDARD && config.tipologia === "battente-singola") {
    avvisi.push({
      livello: "warning",
      messaggio: `Anta singola larga ${antaL} mm > ${ANTA_LARGHEZZA_MAX_STANDARD} mm: considera doppia anta o aggiungi un fisso laterale (bussola).`,
    });
  }

  if (antaH > ANTA_ALTEZZA_MAX_STANDARD && !config.fissoSuperiore.presente) {
    avvisi.push({
      livello: "warning",
      messaggio: `Anta alta ${antaH} mm > ${ANTA_ALTEZZA_MAX_STANDARD} mm: aggiungi un sopraluce per rientrare in taglie standard.`,
    });
  }

  if (fuoriSerie && tagliaStandard !== null) {
    avvisi.push({
      livello: "info",
      messaggio: `Anta calcolata ${antaL}×${antaH} mm — taglia standard più vicina ${tagliaStandard.larghezzaMm}×${tagliaStandard.altezzaMm} mm. Sarà prodotta su misura.`,
    });
  }

  if (larghezzaLP < 500) {
    avvisi.push({
      livello: "warning",
      messaggio: `Luce di passaggio ${larghezzaLP} mm < 500 mm: sotto la larghezza minima abitualmente prodotta.`,
    });
  }

  const ingombroTotL = larghezzaCT;
  const ingombroTotH = altezzaCT;

  const specSuiFissi: Avviso[] = [];
  if (config.specchiatura.presente && config.ovale.presente) {
    specSuiFissi.push({
      livello: "info",
      messaggio: "Configurazione con specchiatura + ovale: l'ovale sarà collocato in una delle campiture.",
    });
  }

  return {
    vano: vm,
    controtelaio: {
      larghezzaMm: larghezzaCT,
      altezzaMm: altezzaCT,
      spessoreMm: vm.spessoreParereMm,
    },
    lucePassaggio: { larghezzaMm: larghezzaLP, altezzaMm: altezzaLP },
    anta: {
      larghezzaMm: antaL,
      altezzaMm: antaH,
      tagliaStandardSuggerita: tagliaStandard,
      fuoriSerie,
    },
    fissoLaterale: {
      presente: config.fissoLaterale.presente,
      lato: config.fissoLaterale.presente ? config.fissoLaterale.lato : null,
      larghezzaMm: fissoLat,
    },
    fissoSuperiore: {
      presente: config.fissoSuperiore.presente,
      altezzaMm: fissoSup,
    },
    ingombroTotale: { larghezzaMm: ingombroTotL, altezzaMm: ingombroTotH },
    mano: config.mano,
    verso: config.verso,
    descrizioneManoVerso: descrizioneManoVerso(config.mano, config.verso),
    siglaManoVerso: siglaManoVerso(config.mano, config.verso),
    avvisi: [...avvisi, ...specSuiFissi],
  };
}

/**
 * Restituisce una distinta di produzione stampabile (linee di testo).
 */
export function distintaProduzione(config: ConfigurazionePorta, calcolo: CalcoloPorta): string[] {
  const l: string[] = [];
  l.push("DISTINTA DI PRODUZIONE — PORTA INTERNA");
  l.push("=".repeat(48));
  l.push(`Modello: ${config.modello}`);
  l.push(`Tipologia: ${config.tipologia === "battente-doppia" ? "Battente doppia anta" : "Battente singola anta"}`);
  l.push("");
  l.push("VANO MURARIO");
  l.push(`  Larghezza: ${calcolo.vano.larghezzaMm} mm`);
  l.push(`  Altezza:   ${calcolo.vano.altezzaMm} mm`);
  l.push(`  Spessore parete: ${calcolo.vano.spessoreParereMm} mm`);
  l.push("");
  l.push("CONTROTELAIO");
  l.push(`  Larghezza esterna: ${calcolo.controtelaio.larghezzaMm} mm`);
  l.push(`  Altezza esterna:   ${calcolo.controtelaio.altezzaMm} mm`);
  l.push(`  Spessore struttura: ${calcolo.controtelaio.spessoreMm} mm`);
  l.push("");
  l.push("LUCE DI PASSAGGIO NETTA");
  l.push(`  Larghezza: ${calcolo.lucePassaggio.larghezzaMm} mm`);
  l.push(`  Altezza:   ${calcolo.lucePassaggio.altezzaMm} mm`);
  l.push("");
  l.push("ANTA");
  l.push(`  Dimensioni calcolate: ${calcolo.anta.larghezzaMm} × ${calcolo.anta.altezzaMm} mm`);
  if (calcolo.anta.tagliaStandardSuggerita) {
    l.push(
      `  Taglia standard più vicina: ${calcolo.anta.tagliaStandardSuggerita.larghezzaMm} × ${calcolo.anta.tagliaStandardSuggerita.altezzaMm} mm`
    );
  }
  l.push(`  Produzione: ${calcolo.anta.fuoriSerie ? "SU MISURA" : "TAGLIA STANDARD"}`);
  l.push("");
  if (calcolo.fissoLaterale.presente) {
    l.push("FISSO LATERALE (BUSSOLA)");
    l.push(`  Lato: ${calcolo.fissoLaterale.lato}`);
    l.push(`  Larghezza: ${calcolo.fissoLaterale.larghezzaMm} mm`);
    l.push(`  Altezza:   ${calcolo.lucePassaggio.altezzaMm} mm`);
    l.push(`  Vetrato: ${config.fissoLaterale.vetrato ? "SI" : "NO"}`);
    l.push("");
  }
  if (calcolo.fissoSuperiore.presente) {
    l.push("FISSO SUPERIORE (SOPRALUCE)");
    l.push(`  Altezza: ${calcolo.fissoSuperiore.altezzaMm} mm`);
    l.push(`  Larghezza: ${calcolo.controtelaio.larghezzaMm - DEFAULT_INGOMBRO_TELAIO_L} mm`);
    l.push(`  Vetrato: ${config.fissoSuperiore.vetrato ? "SI" : "NO"}`);
    l.push("");
  }
  if (config.specchiatura.presente) {
    l.push("SPECCHIATURA");
    l.push(`  Forma: ${config.specchiatura.forma}`);
    l.push(`  Numero pannelli: ${config.specchiatura.numeroPannelli}`);
    l.push("");
  }
  if (config.ovale.presente) {
    l.push("OVALE");
    l.push(`  Larghezza vetro: ${config.ovale.larghezzaMm} mm`);
    l.push(`  Altezza vetro:   ${config.ovale.altezzaMm} mm`);
    l.push("");
  }
  l.push("APERTURA & FERRAMENTA");
  l.push(`  Verso di apertura: ${calcolo.descrizioneManoVerso}`);
  l.push(`  Sigla UNI EN 12519: ${calcolo.siglaManoVerso}`);
  l.push(`  Cerniere: 3 cerniere lato ${calcolo.mano}`);
  l.push(`  Maniglia: lato ${calcolo.mano === "destra" ? "sinistro" : "destro"}`);
  l.push("");
  if (calcolo.avvisi.length > 0) {
    l.push("AVVISI");
    for (const a of calcolo.avvisi) {
      l.push(`  [${a.livello.toUpperCase()}] ${a.messaggio}`);
    }
    l.push("");
  }
  if (config.note) {
    l.push("NOTE");
    l.push(config.note);
  }
  return l;
}
