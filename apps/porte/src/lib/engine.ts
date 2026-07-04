import { getModello } from "./catalog";
import type {
  Config,
  Deduzioni,
  Mano,
  ModelloPorta,
  Pannello,
  Risultato,
} from "./types";

/** Luce netta minima di legge (DM 236/89): 750 mm porte interne, 800 mm ingresso. */
const LUCE_MINIMA_INTERNE = 750;
const ALTEZZA_MANIGLIA_MM = 1000;

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function latoOpposto(m: Mano): Mano {
  return m === "destra" ? "sinistra" : "destra";
}

function deduzioniEffettive(modello: ModelloPorta, config: Config): Deduzioni {
  const o = config.deduzioniOverride ?? {};
  return {
    ...modello.deduzioni,
    telaioLarghezza: o.telaioLarghezza ?? modello.deduzioni.telaioLarghezza,
    telaioAltezza: o.telaioAltezza ?? modello.deduzioni.telaioAltezza,
    giocoAntaLarghezza: o.giocoAntaLarghezza ?? modello.deduzioni.giocoAntaLarghezza,
    giocoAntaAltezza: o.giocoAntaAltezza ?? modello.deduzioni.giocoAntaAltezza,
  };
}

/**
 * Calcola le quote di produzione e i pannelli dello schema a partire dal
 * foro muro misurato "al morto". La porta risulta sempre piu' piccola del
 * foro perche' vengono dedotti telaio/controtelaio e i giochi di posa.
 */
export function calcola(config: Config): Risultato {
  const modello = getModello(config.modelloId);
  if (!modello) {
    throw new Error(`Modello non trovato: ${config.modelloId}`);
  }

  const ded = deduzioniEffettive(modello, config);
  const opz = config.opzioni;
  const avvisi: string[] = [];

  const foro = { larghezza: config.foroLarghezza, altezza: config.foroAltezza };

  // 1) Luce di passaggio = foro - deduzioni telaio/controtelaio.
  const luceW = foro.larghezza - ded.telaioLarghezza;
  const luceH = foro.altezza - ded.telaioAltezza;
  const lucePassaggio = { larghezza: luceW, altezza: luceH };

  // 2) Geometria in coordinate foro (origine in alto a sinistra, y verso il basso).
  const insetX = Math.round(ded.telaioLarghezza / 2);
  const insetTop = ded.telaioAltezza;
  const luceX = insetX;
  const luceY = insetTop;

  const pannelli: Pannello[] = [];

  // Le opzioni valgono solo se il modello le supporta.
  const conSopraluce = opz.sopraluce && modello.opzioni.sopraluce;
  const conAntaFissa = opz.antaFissa && modello.opzioni.antaFissa;
  const conBussola = opz.bussola && modello.opzioni.bussola;

  const sopraluceH = conSopraluce ? opz.sopraluceAltezza : 0;
  if (conSopraluce) {
    pannelli.push({
      tipo: "sopraluce",
      x: luceX,
      y: luceY,
      larghezza: luceW,
      altezza: sopraluceH,
    });
  }

  // Regione porte (sotto l'eventuale sopraluce).
  let regionX = luceX;
  let regionW = luceW;
  const regionY = luceY + sopraluceH;
  const regionH = luceH - sopraluceH;

  // Fianchi fissi della bussola.
  if (conBussola) {
    const sx = opz.bussolaFiancoSx;
    const dx = opz.bussolaFiancoDx;
    if (sx > 0) {
      pannelli.push({ tipo: "fianco", x: regionX, y: regionY, larghezza: sx, altezza: regionH });
    }
    if (dx > 0) {
      pannelli.push({
        tipo: "fianco",
        x: regionX + regionW - dx,
        y: regionY,
        larghezza: dx,
        altezza: regionH,
      });
    }
    regionX += sx;
    regionW -= sx + dx;
  }

  // Anta fissa (semifissa) accanto all'anta mobile.
  // Convenzione: l'anta mobile sta dal lato delle cerniere, la fissa sul lato opposto.
  let mobileX = regionX;
  let mobileW = regionW;
  if (conAntaFissa) {
    const fissaW = opz.antaFissaLarghezza;
    mobileW = regionW - fissaW;
    if (config.mano === "destra") {
      // cerniere a destra -> anta mobile a destra, fissa a sinistra
      pannelli.push({ tipo: "fissa", x: regionX, y: regionY, larghezza: fissaW, altezza: regionH });
      mobileX = regionX + fissaW;
    } else {
      // cerniere a sinistra -> anta mobile a sinistra, fissa a destra
      mobileX = regionX;
      pannelli.push({
        tipo: "fissa",
        x: regionX + mobileW,
        y: regionY,
        larghezza: fissaW,
        altezza: regionH,
      });
    }
  }

  // Anta mobile (regione geometrica: la quota finita e' ridotta dei giochi).
  pannelli.push({
    tipo: "anta",
    x: mobileX,
    y: regionY,
    larghezza: Math.max(0, mobileW),
    altezza: Math.max(0, regionH),
  });

  // 3) Quota di produzione dell'anta finita.
  const anta = {
    larghezza: mobileW - ded.giocoAntaLarghezza,
    altezza: regionH - ded.giocoAntaAltezza,
  };

  // 4) Ingombro totale per gli scorrevoli a scomparsa.
  let ingombroTotale: Risultato["ingombroTotale"];
  if (modello.tipologia === "scorrevole_scomparsa" && ded.ingombroFattore) {
    ingombroTotale = {
      larghezza: Math.round(luceW * ded.ingombroFattore + (ded.ingombroExtra ?? 0)),
      altezza: luceH + 90,
    };
  }

  // 5) Verso di apertura e maniglia.
  const latoCerniere = config.mano;
  const latoManiglia = latoOpposto(config.mano);
  const sensoApertura = `${capitalize(config.mano)} a ${config.verso}`;

  // 6) Avvisi non bloccanti.
  if (luceW < LUCE_MINIMA_INTERNE) {
    avvisi.push(
      `Luce di passaggio ${luceW} mm sotto il minimo di legge (${LUCE_MINIMA_INTERNE} mm per porte interne, DM 236/89).`,
    );
  }
  if (anta.larghezza <= 0 || anta.altezza <= 0) {
    avvisi.push(
      "Le deduzioni superano le dimensioni del foro: verifica misure e opzioni (anta non producibile).",
    );
  }
  if (conAntaFissa && mobileW <= 0) {
    avvisi.push("L'anta fissa e' piu' larga della luce disponibile: riduci la larghezza dell'anta fissa.");
  }

  return {
    modello,
    foro,
    lucePassaggio,
    anta,
    ingombroTotale,
    latoManiglia,
    latoCerniere,
    verso: config.verso,
    sensoApertura,
    altezzaManiglia: ALTEZZA_MANIGLIA_MM,
    pannelli,
    avvisi,
  };
}
