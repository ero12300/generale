import {
  type Componente,
  type InputPorta,
  type Lato,
  type MisuraStandard,
  type ParametriGioco,
  type RisultatoPorta,
  PARAMETRI_DEFAULT,
} from "./types";

/** Larghezze standard di luce di passaggio (mm). */
const LARGHEZZE_STANDARD = [600, 700, 800, 900, 1000];
/** Altezze standard di luce di passaggio (mm). */
const ALTEZZE_STANDARD = [2000, 2100];
/** Tolleranza oltre la quale la porta è considerata "fuori misura". */
const TOLLERANZA_STANDARD_MM = 20;

function clampMin(valore: number, minimo: number): number {
  return valore < minimo ? minimo : valore;
}

function etichettaCm(larghezzaMm: number, altezzaMm: number): string {
  const l = Math.round(larghezzaMm / 10);
  const h = Math.round(altezzaMm / 10);
  return `${l} × ${h}`;
}

function trovaPiuVicino(valore: number, opzioni: number[]): number {
  return opzioni.reduce((best, cur) =>
    Math.abs(cur - valore) < Math.abs(best - valore) ? cur : best,
  );
}

function misuraStandardVicina(luce: Componente): MisuraStandard {
  const larghezzaMm = trovaPiuVicino(luce.larghezzaMm, LARGHEZZE_STANDARD);
  const altezzaMm = trovaPiuVicino(luce.altezzaMm, ALTEZZE_STANDARD);
  return {
    larghezzaMm,
    altezzaMm,
    etichetta: etichettaCm(larghezzaMm, altezzaMm),
  };
}

function descriviApertura(latoCerniere: Lato, verso: "tiro" | "spinta"): string {
  const din = latoCerniere === "sinistra" ? "DIN SX" : "DIN DX";
  const cerniere = latoCerniere === "sinistra" ? "cerniere a sinistra" : "cerniere a destra";
  const maniglia = latoCerniere === "sinistra" ? "maniglia a destra" : "maniglia a sinistra";
  const azione = verso === "tiro" ? "apertura a tirare" : "apertura a spingere";
  return `${din} — ${cerniere}, ${maniglia}, ${azione}`;
}

/**
 * Motore di calcolo porta.
 *
 * Partendo dal FORO MURO sottrae, stadio per stadio, i giochi e gli spessori
 * fino ad arrivare all'anta (pannello) pronta per la produzione:
 *
 *   foro muro → controtelaio → telaio esterno → luce passaggio → anta
 *
 * Per le scorrevoli a scomparsa il foro rappresenta il "massimo ingombro":
 * la luce di passaggio è circa (ingombro − 110 mm) / 2.
 */
export function calcolaPorta(input: InputPorta): RisultatoPorta {
  const p: ParametriGioco = { ...PARAMETRI_DEFAULT, ...(input.parametri ?? {}) };
  const avvisi: string[] = [];

  const foro: Componente = {
    larghezzaMm: input.foroLarghezzaMm,
    altezzaMm: input.foroAltezzaMm,
  };

  // 1) Controtelaio (luce interna del controtelaio dentro il foro murario)
  const controtelaio: Componente = {
    larghezzaMm: clampMin(foro.larghezzaMm - 2 * p.giocoMuraturaLatoMm, 0),
    altezzaMm: clampMin(foro.altezzaMm - p.giocoMuraturaAltoMm, 0),
  };

  // 2) Telaio esterno (ingombro del telaio dentro il controtelaio)
  const telaioEsterno: Componente = {
    larghezzaMm: clampMin(
      controtelaio.larghezzaMm - 2 * p.giocoTelaioControtelaioLatoMm,
      0,
    ),
    altezzaMm: clampMin(
      controtelaio.altezzaMm - p.giocoTelaioControtelaioAltoMm,
      0,
    ),
  };

  // Altezza dedicata al sopraluce (sottratta dal blocco anta)
  let altezzaSopraluce = 0;
  if (input.opzioni.sopraluce) {
    altezzaSopraluce = input.opzioni.altezzaSopraluceMm ?? 400;
  }

  // 3) Luce di passaggio netta (tra i montanti/traversi del telaio)
  const luceLarghezzaTotale = clampMin(
    telaioEsterno.larghezzaMm - 2 * p.spessoreTelaioMm,
    0,
  );
  const luceAltezza = clampMin(
    telaioEsterno.altezzaMm - p.spessoreTelaioMm - altezzaSopraluce -
      (altezzaSopraluce > 0 ? p.traversoSopraluceMm : 0),
    0,
  );

  // Per le scorrevoli a scomparsa la luce è circa metà dell'ingombro.
  let luceLarghezza = luceLarghezzaTotale;
  if (input.tipoApertura === "scorrevole_scomparsa") {
    luceLarghezza = clampMin(Math.round((foro.larghezzaMm - 110) / 2), 0);
    avvisi.push(
      "Scorrevole a scomparsa: il foro è il massimo ingombro. La luce di passaggio è circa (ingombro − 110 mm) / 2.",
    );
  }

  // Anta fissa laterale: sottrae la sua luce + il montante centrale
  let antaFissaComp: Componente | undefined;
  let luceAntaMobile = luceLarghezza;
  if (input.opzioni.antaFissa) {
    const luceFissa = input.opzioni.larghezzaAntaFissaMm ?? 400;
    luceAntaMobile = clampMin(luceLarghezza - luceFissa - p.montanteCentraleMm, 0);
    antaFissaComp = {
      larghezzaMm: clampMin(luceFissa + 2 * p.battutaTelaioMm - 2 * p.giocoAntaTelaioMm, 0),
      altezzaMm: clampMin(luceAltezza + p.battutaTelaioMm - p.giocoAntaTelaioMm, 0),
    };
    if (luceAntaMobile <= 0) {
      avvisi.push(
        "L'anta fissa richiesta è troppo larga per il foro: l'anta mobile risulterebbe nulla.",
      );
    }
  }

  const lucePassaggio: Componente = {
    larghezzaMm: luceAntaMobile,
    altezzaMm: luceAltezza,
  };

  // 4) Anta (pannello) — leggermente più grande della luce perché copre la battuta
  const anta: Componente = {
    larghezzaMm: clampMin(
      luceAntaMobile + 2 * p.battutaTelaioMm - 2 * p.giocoAntaTelaioMm,
      0,
    ),
    altezzaMm: clampMin(
      luceAltezza + p.battutaTelaioMm - p.giocoAntaTelaioMm - p.giocoPavimentoMm,
      0,
    ),
  };

  // Sopraluce come componente a sé
  let sopraluceComp: Componente | undefined;
  if (input.opzioni.sopraluce) {
    sopraluceComp = {
      larghezzaMm: luceLarghezza,
      altezzaMm: altezzaSopraluce,
    };
  }

  // Oblò
  let obloComp: (Componente & { forma: typeof input.opzioni.oblo }) | undefined;
  if (input.opzioni.oblo !== "nessuno") {
    obloComp = {
      forma: input.opzioni.oblo,
      larghezzaMm: input.opzioni.obloLarghezzaMm ?? 300,
      altezzaMm: input.opzioni.obloAltezzaMm ?? (input.opzioni.oblo === "tondo" ? 300 : 450),
    };
    if (obloComp.larghezzaMm > anta.larghezzaMm - 100) {
      avvisi.push("L'oblò è quasi largo quanto l'anta: verificare gli spazi.");
    }
  }

  // DIN + maniglia
  const din: "SX" | "DX" = input.latoCerniere === "sinistra" ? "SX" : "DX";
  const latoManiglia: Lato = input.latoCerniere === "sinistra" ? "destra" : "sinistra";

  // Misura standard più vicina + fuori misura
  const misuraStd = misuraStandardVicina({
    larghezzaMm: luceAntaMobile,
    altezzaMm: luceAltezza,
  });
  const fuoriMisura =
    Math.abs(luceAntaMobile - misuraStd.larghezzaMm) > TOLLERANZA_STANDARD_MM ||
    Math.abs(luceAltezza - misuraStd.altezzaMm) > TOLLERANZA_STANDARD_MM;
  if (fuoriMisura) {
    avvisi.push(
      `Misura fuori standard: la luce ${etichettaCm(luceAntaMobile, luceAltezza)} cm non coincide con lo standard ${misuraStd.etichetta} cm.`,
    );
  }

  if (input.spessoreMuroMm > 130) {
    avvisi.push(
      `Spessore muro ${Math.round(input.spessoreMuroMm / 10)} cm: oltre i telai standard (8,5/11 cm) servono allargamenti.`,
    );
  }

  return {
    input,
    parametri: p,
    foro,
    controtelaio,
    telaioEsterno,
    lucePassaggio,
    anta,
    antaFissa: antaFissaComp,
    sopraluce: sopraluceComp,
    oblo: obloComp,
    spessoreTelaioMuroMm: input.spessoreMuroMm,
    din,
    latoManiglia,
    descrizioneApertura: descriviApertura(input.latoCerniere, input.versoApertura),
    misuraStandardVicina: misuraStd,
    fuoriMisura,
    avvisi,
  };
}
