import { ANTE_STANDARD, getModello } from "./models";
import type {
  ConfigPorta,
  EsitoCalcolo,
  Lato,
  ModelloPorta,
  Quota,
  QuotaAnta,
  SchedaProduzione,
} from "./types";
import { TIPOLOGIA_LABEL } from "./types";

const TOLLERANZA_STANDARD_MM = 25;

function latoOpposto(lato: Lato): Lato {
  return lato === "destra" ? "sinistra" : "destra";
}

function descriviApertura(config: ConfigPorta): string {
  const lato = config.latoCerniere.toUpperCase();
  switch (config.tipologia) {
    case "battente":
    case "doppia_battente":
    case "battente_fisso":
      return `Porta ${lato} a ${config.verso === "spingere" ? "spingere" : "tirare"}`;
    case "scorrevole_scomparsa":
    case "scorrevole_esterno":
      return `Anta scorrevole verso ${config.latoCerniere}`;
    default: {
      const esaustivo: never = config.tipologia;
      throw new Error(`Tipologia non gestita: ${esaustivo}`);
    }
  }
}

function misuraStandardVicina(anta: Quota): string | undefined {
  for (const [w, h] of ANTE_STANDARD) {
    if (
      Math.abs(anta.larghezza - w) <= TOLLERANZA_STANDARD_MM &&
      Math.abs(anta.altezza - h) <= TOLLERANZA_STANDARD_MM
    ) {
      return `${w} × ${h} mm`;
    }
  }
  return undefined;
}

function erroriPreliminari(config: ConfigPorta, modello: ModelloPorta | undefined): string[] {
  const errori: string[] = [];
  if (!modello) {
    errori.push(`Modello "${config.modelloId}" non trovato a catalogo.`);
    return errori;
  }
  if (!modello.tipologie.includes(config.tipologia)) {
    errori.push(
      `Il modello ${modello.nome} non è disponibile in tipologia "${TIPOLOGIA_LABEL[config.tipologia]}".`
    );
  }
  const { vano, opzioni } = config;
  if (vano.larghezza < modello.vanoMin.larghezza || vano.larghezza > modello.vanoMax.larghezza) {
    errori.push(
      `Larghezza vano ${vano.larghezza} mm fuori range per ${modello.nome} (${modello.vanoMin.larghezza}–${modello.vanoMax.larghezza} mm).`
    );
  }
  if (vano.altezza < modello.vanoMin.altezza || vano.altezza > modello.vanoMax.altezza) {
    errori.push(
      `Altezza vano ${vano.altezza} mm fuori range per ${modello.nome} (${modello.vanoMin.altezza}–${modello.vanoMax.altezza} mm).`
    );
  }
  if (vano.spessoreMuro < modello.spessoreMuroMin || vano.spessoreMuro > modello.spessoreMuroMax) {
    errori.push(
      `Spessore muro ${vano.spessoreMuro} mm fuori range per ${modello.nome} (${modello.spessoreMuroMin}–${modello.spessoreMuroMax} mm).`
    );
  }
  if (opzioni.sopraluce !== "nessuno" && !modello.supportaSopraluce) {
    errori.push(`Il modello ${modello.nome} non supporta il sopraluce.`);
  }
  if (opzioni.vetro && !modello.supportaVetro) {
    errori.push(`Il modello ${modello.nome} non supporta la specchiatura vetrata.`);
  }
  if (opzioni.oblo && !modello.supportaOblo) {
    errori.push(`Il modello ${modello.nome} non supporta l'oblò.`);
  }
  if (opzioni.sopraluce !== "nessuno") {
    if (opzioni.altezzaSopraluce < 150) {
      errori.push("L'altezza del sopraluce deve essere di almeno 150 mm.");
    }
    const altezzaResidua = vano.altezza - opzioni.altezzaSopraluce;
    if (altezzaResidua < modello.vanoMin.altezza) {
      errori.push(
        `Con sopraluce di ${opzioni.altezzaSopraluce} mm restano ${altezzaResidua} mm per la porta: insufficienti (minimo ${modello.vanoMin.altezza} mm).`
      );
    }
  }
  if (config.tipologia === "battente_fisso" && opzioni.larghezzaFisso > 0) {
    if (vano.larghezza - opzioni.larghezzaFisso < modello.vanoMin.larghezza) {
      errori.push(
        `Fianco fisso di ${opzioni.larghezzaFisso} mm troppo largo: alla parte apribile restano ${vano.larghezza - opzioni.larghezzaFisso} mm (minimo ${modello.vanoMin.larghezza} mm).`
      );
    }
  }
  return errori;
}

/**
 * Calcola la scheda di produzione a partire dal vano murario.
 *
 * Convenzione verso di apertura: si guarda la porta dal lato in cui l'anta
 * si muove verso di sé; cerniere a destra = porta DESTRA, cerniere a
 * sinistra = porta SINISTRA. La maniglia è sul lato opposto alle cerniere.
 */
export function calcolaScheda(config: ConfigPorta): EsitoCalcolo {
  const modello = getModello(config.modelloId);
  const errori = erroriPreliminari(config, modello);
  if (errori.length > 0 || !modello) {
    return { ok: false, errori };
  }

  const { vano, opzioni, tipologia } = config;
  const d = modello.detrazioni;
  const avvisi: string[] = [];

  const conSopraluce = opzioni.sopraluce !== "nessuno";
  const altezzaUtile = vano.altezza - (conSopraluce ? opzioni.altezzaSopraluce : 0);

  const falsoTelaio = {
    larghezza: vano.larghezza - 2 * d.giocoFalsoTelaio,
    altezza: vano.altezza - d.giocoFalsoTelaio,
    profondita: vano.spessoreMuro,
  };

  let ante: QuotaAnta[] = [];
  let lucePassaggio: Quota;
  let fisso: SchedaProduzione["fisso"];
  let ingombroControtelaio: Quota | undefined;
  let lunghezzaBinario: number | undefined;

  switch (tipologia) {
    case "battente": {
      const anta: QuotaAnta = {
        larghezza: vano.larghezza - d.antaLarghezza,
        altezza: altezzaUtile - d.antaAltezza,
        spessore: modello.spessoreAnta,
        ruolo: "principale",
      };
      ante = [anta];
      lucePassaggio = {
        larghezza: anta.larghezza - 2 * d.sormontoBattuta,
        altezza: anta.altezza - d.sormontoBattuta,
      };
      break;
    }
    case "doppia_battente": {
      const larghezzaAnteTotale = vano.larghezza - d.antaLarghezza + d.battutaCentrale;
      const altezzaAnta = altezzaUtile - d.antaAltezza;
      let principaleL: number;
      let semifissaL: number;
      if (opzioni.ripartizioneAnte === "simmetrica") {
        semifissaL = Math.floor(larghezzaAnteTotale / 2);
        principaleL = larghezzaAnteTotale - semifissaL;
      } else {
        semifissaL = Math.round(larghezzaAnteTotale / 3);
        principaleL = larghezzaAnteTotale - semifissaL;
      }
      ante = [
        { larghezza: principaleL, altezza: altezzaAnta, spessore: modello.spessoreAnta, ruolo: "principale" },
        { larghezza: semifissaL, altezza: altezzaAnta, spessore: modello.spessoreAnta, ruolo: "semifissa" },
      ];
      lucePassaggio = {
        larghezza: principaleL + semifissaL - d.battutaCentrale - 2 * d.sormontoBattuta,
        altezza: altezzaAnta - d.sormontoBattuta,
      };
      avvisi.push(
        "Doppia anta: l'anta principale è incernierata sul lato indicato, la semifissa sul lato opposto con catenacci a leva."
      );
      break;
    }
    case "battente_fisso": {
      const larghezzaFisso =
        opzioni.larghezzaFisso > 0 ? opzioni.larghezzaFisso : Math.round(vano.larghezza / 3);
      const vanoApribile = vano.larghezza - larghezzaFisso;
      const anta: QuotaAnta = {
        larghezza: vanoApribile - d.antaLarghezza,
        altezza: altezzaUtile - d.antaAltezza,
        spessore: modello.spessoreAnta,
        ruolo: "principale",
      };
      ante = [anta];
      fisso = {
        larghezza: larghezzaFisso,
        altezza: anta.altezza,
        lato: opzioni.latoFisso,
      };
      lucePassaggio = {
        larghezza: anta.larghezza - 2 * d.sormontoBattuta,
        altezza: anta.altezza - d.sormontoBattuta,
      };
      if (opzioni.latoFisso === config.latoCerniere) {
        avvisi.push(
          "Il fianco fisso è sullo stesso lato delle cerniere: verificare l'ingombro dell'anta in apertura."
        );
      }
      break;
    }
    case "scorrevole_scomparsa": {
      const anta: QuotaAnta = {
        larghezza: vano.larghezza + d.sormontoScorrevoleLarghezza,
        altezza: vano.altezza + d.sormontoScorrevoleAltezza,
        spessore: modello.spessoreAnta,
        ruolo: "principale",
      };
      ante = [anta];
      lucePassaggio = { larghezza: vano.larghezza, altezza: vano.altezza };
      ingombroControtelaio = {
        larghezza: 2 * vano.larghezza + 110,
        altezza: vano.altezza + 90,
      };
      avvisi.push(
        `Verificare parete libera lato ${config.latoCerniere} di almeno ${vano.larghezza + 110} mm, senza impianti, per l'inserimento del controtelaio.`
      );
      break;
    }
    case "scorrevole_esterno": {
      const anta: QuotaAnta = {
        larghezza: vano.larghezza + d.sormontoScorrevoleLarghezza,
        altezza: vano.altezza + d.sormontoScorrevoleAltezza,
        spessore: modello.spessoreAnta,
        ruolo: "principale",
      };
      ante = [anta];
      lucePassaggio = { larghezza: vano.larghezza, altezza: vano.altezza };
      lunghezzaBinario = 2 * anta.larghezza;
      avvisi.push(
        `Verificare parete libera lato ${config.latoCerniere} di almeno ${anta.larghezza} mm per lo scorrimento dell'anta a vista.`
      );
      break;
    }
    default: {
      const esaustivo: never = tipologia;
      throw new Error(`Tipologia non gestita: ${esaustivo}`);
    }
  }

  // Minimi di produzione: la semifissa può essere più stretta (es. 80+30).
  const minimi = { principale: 500, semifissa: 250 } as const;
  for (const anta of ante) {
    const antaMin = minimi[anta.ruolo];
    if (anta.larghezza < antaMin) {
      errori.push(
        `Anta ${anta.ruolo} di ${anta.larghezza} mm: sotto il minimo di produzione (${antaMin} mm). Aumentare il vano o rivedere la configurazione.`
      );
    }
  }
  if (errori.length > 0) {
    return { ok: false, errori };
  }

  const telaio: Quota = {
    larghezza: falsoTelaio.larghezza,
    altezza: altezzaUtile - d.giocoFalsoTelaio,
  };

  const antaPrincipale = ante[0];
  const standard = misuraStandardVicina(antaPrincipale);
  if (!standard && (tipologia === "battente" || tipologia === "doppia_battente" || tipologia === "battente_fisso")) {
    avvisi.push(
      "Anta fuori misura standard: produzione su misura, tempi e costi maggiori."
    );
  }

  if (opzioni.vetro && opzioni.oblo) {
    avvisi.push("Vetro e oblò insieme: verificare fattibilità estetica con l'ufficio tecnico.");
  }

  const isScorrevole = tipologia === "scorrevole_scomparsa" || tipologia === "scorrevole_esterno";
  const latoManiglia = latoOpposto(config.latoCerniere);

  const scheda: SchedaProduzione = {
    config,
    modello,
    falsoTelaio,
    telaio,
    ante,
    fisso,
    sopraluce: conSopraluce
      ? {
          larghezza: telaio.larghezza,
          altezza: opzioni.altezzaSopraluce,
          tipo: opzioni.sopraluce as "vetrato" | "cieco",
        }
      : undefined,
    lucePassaggio,
    ingombroControtelaio,
    lunghezzaBinario,
    aperturaDescrizione: descriviApertura(config),
    latoManiglia,
    latoCerniere: config.latoCerniere,
    misuraStandardVicina: standard,
    avvisi: isScorrevole
      ? avvisi
      : [
          ...avvisi,
          `Maniglia a ${latoManiglia} guardando la porta dal lato ${config.verso === "spingere" ? "di spinta" : "di tiro"}.`,
        ],
    generataIl: new Date().toISOString(),
  };

  return { ok: true, errori: [], scheda };
}
