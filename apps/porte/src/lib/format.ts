import type { Config, Risultato } from "./types";

export function mm(v: number): string {
  return `${v} mm`;
}

/** Etichette leggibili per i valori di dominio. */
export const LABEL_OBLO: Record<Config["opzioni"]["oblo"], string> = {
  nessuno: "Nessuno",
  ovale: "Oblò ovale",
  rotondo: "Oblò rotondo",
  rettangolare: "Vetro rettangolare",
};

/** Scheda di produzione in formato piano (JSON serializzabile). */
export function schedaProduzione(risultato: Risultato, config: Config) {
  return {
    commessa: config.commessa || null,
    cliente: config.cliente || null,
    generatoIl: new Date().toISOString(),
    modello: { id: risultato.modello.id, nome: risultato.modello.nome, tipologia: risultato.modello.tipologia },
    foroMuro_mm: risultato.foro,
    spessoreParete_mm: config.spessoreParete,
    lucePassaggio_mm: risultato.lucePassaggio,
    anta_mm: risultato.anta,
    ingombroTotale_mm: risultato.ingombroTotale ?? null,
    apertura: {
      senso: risultato.sensoApertura,
      cerniere: risultato.latoCerniere,
      maniglia: risultato.latoManiglia,
      verso: risultato.verso,
      altezzaManiglia_mm: risultato.altezzaManiglia,
    },
    opzioni: {
      sopraluce: config.opzioni.sopraluce ? config.opzioni.sopraluceAltezza : false,
      antaFissa: config.opzioni.antaFissa ? config.opzioni.antaFissaLarghezza : false,
      bussola: config.opzioni.bussola
        ? { fiancoSx: config.opzioni.bussolaFiancoSx, fiancoDx: config.opzioni.bussolaFiancoDx }
        : false,
      oblo: LABEL_OBLO[config.opzioni.oblo],
    },
    avvisi: risultato.avvisi,
  };
}
