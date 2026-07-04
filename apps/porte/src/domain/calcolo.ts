import { MODELLI } from "./modelli";
import type {
  Anta,
  DettaglioOblo,
  DettaglioVetrina,
  EsitoCalcolo,
  InputPorta,
  SchedaProduzione,
} from "./types";

const ALTEZZA_MANIGLIA = 1050;

/** Numero cerniere in funzione di altezza e peso presunto dell'anta. */
function numeroCerniere(altezzaAnta: number, tagliafuoco: boolean): number {
  if (tagliafuoco) return altezzaAnta > 2400 ? 3 : 2;
  return altezzaAnta > 2200 ? 4 : 3;
}

function validaInput(input: InputPorta): string[] {
  const errori: string[] = [];
  const m = MODELLI[input.modello];

  if (!Number.isInteger(input.foroL) || !Number.isInteger(input.foroH)) {
    errori.push("Le misure del foro muro devono essere numeri interi in millimetri.");
    return errori;
  }
  if (input.foroL <= 0 || input.foroH <= 0) {
    errori.push("Larghezza e altezza del foro muro devono essere maggiori di zero.");
    return errori;
  }
  if (!Number.isInteger(input.spessoreMuro) || input.spessoreMuro <= 0) {
    errori.push("Lo spessore muro deve essere un numero intero positivo in millimetri.");
  } else if (input.spessoreMuro < 80 || input.spessoreMuro > 500) {
    errori.push("Spessore muro fuori range produzione (80–500 mm).");
  }

  const minL = input.numeroAnte === 1 ? m.minL1 : m.minL2;
  const maxL = input.numeroAnte === 1 ? m.maxL1 : m.maxL2;
  if (input.foroL < minL || input.foroL > maxL) {
    errori.push(
      `Foro muro larghezza ${input.foroL} mm fuori range per ${m.nome} a ${input.numeroAnte} anta/e (min ${minL} – max ${maxL} mm).`,
    );
  }
  if (input.foroH < m.minH || input.foroH > m.maxH) {
    errori.push(
      `Foro muro altezza ${input.foroH} mm fuori range per ${m.nome} (min ${m.minH} – max ${m.maxH} mm).`,
    );
  }

  if (input.numeroAnte === 2 && !m.consenteDueAnte) {
    errori.push(`Il modello ${m.nome} non è disponibile a due ante.`);
  }
  if (input.conOblo && !m.consenteOblo) {
    errori.push(`Il modello ${m.nome} non prevede l'oblò.`);
  }
  if (input.conVetrina && !m.consenteVetrina) {
    errori.push(`Il modello ${m.nome} non prevede la vetrina/display.`);
  }
  if (input.conOblo && input.conVetrina) {
    errori.push("Oblò e vetrina non possono coesistere sulla stessa anta.");
  }
  if (
    input.conOblo &&
    m.maxL1ConOblo !== null &&
    input.numeroAnte === 1 &&
    input.foroL > m.maxL1ConOblo
  ) {
    errori.push(
      `Oblò non ammesso su ${m.nome} a 1 anta con foro muro L > ${m.maxL1ConOblo} mm (certificazione).`,
    );
  }
  return errori;
}

/** Larghezza anta a partire dalla luce netta che deve coprire. */
function larghezzaAnta(luce: number, battuta: number, gioco: number): number {
  return battuta > 0 ? luce + 2 * battuta : luce - 2 * gioco;
}

function altezzaAnta(
  luceH: number,
  battutaSup: number,
  giocoSup: number,
  giocoPavimento: number,
): number {
  const sopra = battutaSup > 0 ? battutaSup : -giocoSup;
  return luceH + sopra - giocoPavimento;
}

function calcolaOblo(input: InputPorta, antaRef: Anta): {
  oblo: DettaglioOblo | null;
  errore: string | null;
} {
  if (!input.conOblo) return { oblo: null, errore: null };
  const bordoMinimo = 150;
  const tondo = input.formaOblo === "tondo";
  let larghezza = tondo ? 400 : 300;
  let altezza = tondo ? 400 : 500;
  // riduci a taglie certificate inferiori se l'anta è stretta
  if (antaRef.larghezza - larghezza < 2 * bordoMinimo) {
    larghezza = tondo ? 300 : 250;
    altezza = tondo ? 300 : 400;
  }
  if (antaRef.larghezza - larghezza < 2 * bordoMinimo) {
    return {
      oblo: null,
      errore: `Anta troppo stretta (${antaRef.larghezza} mm) per l'oblò: servono almeno ${bordoMinimo} mm di bordo per lato.`,
    };
  }
  // Quota standard: centro oblò a 1500 mm da pavimento, ridotta su porte basse.
  const quotaCentro = Math.min(1500, antaRef.altezza - altezza / 2 - 200);
  return {
    oblo: {
      forma: input.formaOblo,
      larghezza,
      altezza,
      quotaCentroDaPavimento: quotaCentro,
    },
    errore: null,
  };
}

function calcolaVetrina(input: InputPorta, antaRef: Anta): {
  vetrina: DettaglioVetrina | null;
  errore: string | null;
} {
  if (!input.conVetrina) return { vetrina: null, errore: null };
  const bordoLaterale = 120;
  const larghezza = antaRef.larghezza - 2 * bordoLaterale;
  if (larghezza < 200) {
    return {
      vetrina: null,
      errore: `Anta troppo stretta (${antaRef.larghezza} mm) per la vetrina: larghezza vetro risultante < 200 mm.`,
    };
  }
  const quotaInferiore = 900;
  const altezza = antaRef.altezza - quotaInferiore - 250;
  if (altezza < 300) {
    return {
      vetrina: null,
      errore: "Anta troppo bassa per la vetrina: altezza vetro risultante < 300 mm.",
    };
  }
  return {
    vetrina: { larghezza, altezza, quotaInferioreDaPavimento: quotaInferiore },
    errore: null,
  };
}

/**
 * Calcola la scheda di produzione a partire dal foro muro.
 *
 * Flusso: foro muro → luce netta telaio (detrazioni modello) → dimensioni
 * anta/e (battute o giochi) → luce di passaggio → controtelaio (opera morta).
 */
export function calcolaPorta(input: InputPorta): EsitoCalcolo {
  const errori = validaInput(input);
  if (errori.length > 0) return { ok: false, errori, scheda: null };

  const m = MODELLI[input.modello];
  const avvertenze: string[] = [];

  const luceTelaioL = input.foroL - m.detrazioneTelaioL;
  const luceTelaioH = input.foroH - m.detrazioneTelaioH;

  const ante: Anta[] = [];

  if (input.numeroAnte === 1) {
    ante.push({
      ruolo: "unica",
      larghezza: larghezzaAnta(luceTelaioL, m.battutaLaterale, m.giocoLaterale),
      altezza: altezzaAnta(luceTelaioH, m.battutaSuperiore, m.giocoLaterale, m.giocoPavimento),
      spessore: m.spessoreAnta,
    });
  } else {
    // Porta a due ante: la luce si ripartisce tra anta principale e secondaria,
    // con sormonto centrale in battuta tra le due.
    const h = altezzaAnta(luceTelaioH, m.battutaSuperiore, m.giocoLaterale, m.giocoPavimento);
    let lucePrincipale: number;
    let luceSecondaria: number;
    if (input.ripartizione === "simmetrica") {
      lucePrincipale = Math.ceil(luceTelaioL / 2);
      luceSecondaria = luceTelaioL - lucePrincipale;
    } else {
      // Asimmetrica 2/3 – 1/3, con anta principale mai sotto 600 mm.
      lucePrincipale = Math.max(600, Math.round((luceTelaioL * 2) / 3));
      luceSecondaria = luceTelaioL - lucePrincipale;
      if (luceSecondaria < 300) {
        avvertenze.push(
          "Ripartizione asimmetrica: l'anta secondaria risulta molto stretta (< 300 mm di luce).",
        );
      }
    }
    const larghPrincipale =
      larghezzaAnta(lucePrincipale, m.battutaLaterale, m.giocoLaterale) +
      Math.ceil(m.sormontoCentrale / 2);
    const larghSecondaria =
      larghezzaAnta(luceSecondaria, m.battutaLaterale, m.giocoLaterale) +
      Math.floor(m.sormontoCentrale / 2);

    ante.push({
      ruolo: "principale",
      larghezza: larghPrincipale,
      altezza: h,
      spessore: m.spessoreAnta,
    });
    ante.push({
      ruolo: input.tipoAntaSecondaria === "compasso" ? "semifissa" : "fissa",
      larghezza: larghSecondaria,
      altezza: h,
      spessore: m.spessoreAnta,
    });
  }

  // Luce di passaggio: con due ante, se la secondaria è fissa passa solo la principale.
  const antaPrincipale = ante[0];
  let lucePassaggioL: number;
  if (input.numeroAnte === 1) {
    lucePassaggioL = luceTelaioL;
  } else if (input.tipoAntaSecondaria === "fissa") {
    lucePassaggioL = antaPrincipale.larghezza - m.sormontoCentrale;
    avvertenze.push(
      "Anta secondaria fissa: la luce di passaggio è limitata alla sola anta principale.",
    );
  } else {
    lucePassaggioL = luceTelaioL;
    avvertenze.push(
      "Anta a compasso (semifissa): apribile con leva di sblocco per il passaggio totale.",
    );
  }
  const lucePassaggioH = luceTelaioH;

  if (lucePassaggioL < 600) {
    avvertenze.push(
      `Luce di passaggio ${lucePassaggioL} mm inferiore ai 600 mm raccomandati per il transito.`,
    );
  }

  const { oblo, errore: erroreOblo } = calcolaOblo(input, antaPrincipale);
  if (erroreOblo) return { ok: false, errori: [erroreOblo], scheda: null };

  const { vetrina, errore: erroreVetrina } = calcolaVetrina(input, antaPrincipale);
  if (erroreVetrina) return { ok: false, errori: [erroreVetrina], scheda: null };

  if ((input.modello === "rei-60" || input.modello === "rei-120") && input.conOblo) {
    avvertenze.push(
      "Porta REI con oblò: prevedere chiudiporta a chiusura controllata (raccomandazione certificazione).",
    );
  }

  // Convenzione: guardando dal lato a spingere, la maniglia è opposta alle cerniere.
  const latoCerniere = input.verso;
  const latoManiglia = input.verso === "destra" ? "sinistra" : "destra";

  const tagliafuoco = input.modello === "rei-60" || input.modello === "rei-120";

  const scheda: SchedaProduzione = {
    input,
    modello: m,
    luceTelaioL,
    luceTelaioH,
    lucePassaggioL,
    lucePassaggioH,
    ante,
    latoCerniere,
    latoManiglia,
    numeroCerniere: numeroCerniere(antaPrincipale.altezza, tagliafuoco),
    altezzaManiglia: ALTEZZA_MANIGLIA,
    oblo,
    vetrina,
    controtelaioL: input.foroL - 2 * m.tolleranzaPosa,
    controtelaioH: input.foroH - m.tolleranzaPosa,
    avvertenze,
  };
  return { ok: true, errori: [], scheda };
}

/** Etichetta breve del verso, es. "DX a spingere". */
export function etichettaVerso(input: InputPorta): string {
  const lato = input.verso === "destra" ? "DX" : "SX";
  return `${lato} a ${input.movimento}`;
}
