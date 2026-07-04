/**
 * Calcolo dimensioni porte a partire dal foro muro.
 *
 * Le formule seguono le convenzioni pubbliche di produttori italiani (Eclisse,
 * Ermetika, Garofoli, FIP Porte). Sono regole di massima: per commesse
 * specifiche verificare sempre la scheda tecnica del produttore.
 *
 * Tutte le dimensioni sono in **millimetri**.
 */

import type {
  Avviso,
  ConfigurazionePorta,
  Dimensioni,
  LatoCerniere,
  ManovraApertura,
  RisultatoCalcolo,
  Tipologia,
} from "./types";

/**
 * Costanti di produzione. Valori medi rilevati da schede tecniche pubbliche.
 * Estraibili in configurazione per singolo produttore in futuro.
 */
export const COSTANTI = {
  /** Gioco laterale complessivo fra foro muro e controtelaio (battente). */
  giocoBatt_L: 20,
  /** Gioco in altezza fra foro muro e controtelaio (battente). */
  giocoBatt_H: 15,
  /** Spessore montante controtelaio in legno per battente. */
  spessoreControtelaioBatt: 12,
  /** Spessore montante telaio (cornice visibile) per battente. */
  spessoreMontanteTelaio: 45,
  /** Sfrido fra telaio interno e anta (mm complessivi lato per lato). */
  sfridoTelaioAnta_L: 6,
  /** Sfrido in altezza fra telaio interno e anta. */
  sfridoTelaioAnta_H: 8,

  /** Delta per porta scorrevole a scomparsa: 2L + delta. */
  scorrevoleScomparsa_delta_L: 110,
  scorrevoleScomparsa_delta_H: 90,

  /** Delta per porta scorrevole esterno muro (parete richiesta ≈ 2L + delta). */
  scorrevoleEsterno_delta_L: 100,

  /** Filo muro: telaio a scomparsa, meno tolleranze. */
  filoMuro_giocoL: 20,
  filoMuro_giocoH: 15,

  /** Sopraluce: telaio dedicato aggiunto sopra la porta. */
  sopraluce_delta_H: 30, // gap fra sopraluce e testata telaio

  /** Fisso laterale: gap fra fisso e telaio anta. */
  fisso_delta_L: 20,

  /** Larghezze standard anta (mm) — usate per suggerimenti/avvisi. */
  larghezzeStandard: [600, 700, 800, 900, 1000, 1100, 1200],
  altezzeStandard: [2000, 2100, 2400, 2700],
} as const;

/**
 * Somma delle dimensioni di un rettangolo (utility per la sintesi tecnica).
 */
export function areaRect(d: Dimensioni): number {
  return d.larghezza * d.altezza;
}

/**
 * Ritorna la stringa canonica del verso di apertura.
 * Es: `dx` + `spingere` → `"DX a spingere"`.
 */
export function versoApertura(
  lato: LatoCerniere,
  manovra: ManovraApertura
): string {
  const l = lato === "dx" ? "DX" : "SX";
  return `${l} a ${manovra}`;
}

/**
 * Deriva la posizione della maniglia dal lato cerniere.
 * Per convenzione: la maniglia sta sul lato OPPOSTO alle cerniere.
 */
export function posizioneManiglia(lato: LatoCerniere): LatoCerniere {
  return lato === "dx" ? "sx" : "dx";
}

/**
 * Verifica se una dimensione anta è "standard" per l'industria italiana.
 * Aggiunge avvisi se fuori range, ma non blocca il calcolo (le ante su misura
 * sono ammesse).
 */
function verificaAntaStandard(anta: Dimensioni, avvisi: Avviso[]): void {
  if (!COSTANTI.larghezzeStandard.includes(anta.larghezza as never)) {
    if (anta.larghezza < 550) {
      avvisi.push({
        livello: "warning",
        messaggio: `Larghezza anta ${anta.larghezza} mm sotto la minima raccomandata di 600 mm.`,
      });
    } else {
      avvisi.push({
        livello: "info",
        messaggio: `Larghezza anta ${anta.larghezza} mm non standard: sarà porta su misura.`,
      });
    }
  }
  if (!COSTANTI.altezzeStandard.includes(anta.altezza as never)) {
    avvisi.push({
      livello: "info",
      messaggio: `Altezza anta ${anta.altezza} mm non standard: sarà porta su misura.`,
    });
  }
}

/**
 * Calcolo per porta a battente.
 * Catena dimensionale (dall'esterno verso l'interno):
 *
 *   foro muro (L,H)
 *   ─ 2·(muratura/schiuma, gioco laterale) ─→ controtelaio esterno
 *   ─ 2·spessore montante controtelaio       ─→ luce controtelaio
 *   ─ 2·spessore montante telaio             ─→ luce telaio (≈ luce di passaggio)
 *   ─ sfrido battuta                          ─→ anta
 */
function calcolaBattente(
  cfg: ConfigurazionePorta,
  avvisi: Avviso[]
): Pick<
  RisultatoCalcolo,
  "controtelaio" | "telaio" | "anta" | "lucePassaggio" | "ingombroParete"
> {
  const { foroMuro, opzioni } = cfg;

  const controtelaioEsterno: Dimensioni = {
    larghezza: foroMuro.larghezza - COSTANTI.giocoBatt_L,
    altezza: foroMuro.altezza - COSTANTI.giocoBatt_H,
  };
  const controtelaioInterno: Dimensioni = {
    larghezza: controtelaioEsterno.larghezza - 2 * COSTANTI.spessoreControtelaioBatt,
    altezza: controtelaioEsterno.altezza - COSTANTI.spessoreControtelaioBatt,
  };

  const telaioEsterno: Dimensioni = { ...controtelaioInterno };
  const telaioInterno: Dimensioni = {
    larghezza: telaioEsterno.larghezza - 2 * COSTANTI.spessoreMontanteTelaio,
    altezza: telaioEsterno.altezza - COSTANTI.spessoreMontanteTelaio,
  };

  const anta: Dimensioni = {
    larghezza: telaioInterno.larghezza + COSTANTI.sfridoTelaioAnta_L,
    altezza: telaioInterno.altezza + COSTANTI.sfridoTelaioAnta_H,
  };

  const lucePassaggio: Dimensioni = { ...telaioInterno };

  verificaAntaStandard(anta, avvisi);

  return {
    controtelaio: opzioni.conControtelaio
      ? { presente: true, esterno: controtelaioEsterno, interno: controtelaioInterno }
      : { presente: false },
    telaio: {
      esterno: telaioEsterno,
      interno: telaioInterno,
      spessoreMontante: COSTANTI.spessoreMontanteTelaio,
    },
    anta,
    lucePassaggio,
    ingombroParete: null,
  };
}

/**
 * Filo muro: il telaio è nascosto (a filo intonaco). Meno gioco.
 */
function calcolaFiloMuro(
  cfg: ConfigurazionePorta,
  avvisi: Avviso[]
): Pick<
  RisultatoCalcolo,
  "controtelaio" | "telaio" | "anta" | "lucePassaggio" | "ingombroParete"
> {
  const { foroMuro, opzioni } = cfg;
  const spessoreTelaio = 30;

  const controtelaioEsterno: Dimensioni = {
    larghezza: foroMuro.larghezza - COSTANTI.filoMuro_giocoL,
    altezza: foroMuro.altezza - COSTANTI.filoMuro_giocoH,
  };
  const controtelaioInterno: Dimensioni = {
    larghezza: controtelaioEsterno.larghezza - 2 * spessoreTelaio,
    altezza: controtelaioEsterno.altezza - spessoreTelaio,
  };

  const telaioEsterno = { ...controtelaioInterno };
  const telaioInterno = {
    larghezza: telaioEsterno.larghezza - 2 * 5,
    altezza: telaioEsterno.altezza - 5,
  };
  const anta: Dimensioni = { ...telaioInterno };
  const lucePassaggio: Dimensioni = { ...telaioInterno };

  verificaAntaStandard(anta, avvisi);

  return {
    controtelaio: opzioni.conControtelaio
      ? { presente: true, esterno: controtelaioEsterno, interno: controtelaioInterno }
      : { presente: false },
    telaio: {
      esterno: telaioEsterno,
      interno: telaioInterno,
      spessoreMontante: spessoreTelaio,
    },
    anta,
    lucePassaggio,
    ingombroParete: null,
  };
}

/**
 * Scorrevole a scomparsa (Eclisse, Ermetika, Eurocassonetto).
 * Il "foro muro" indicato dall'utente è la LUCE DI PASSAGGIO desiderata.
 * L'ingombro reale in parete è ≈ 2L + delta.
 */
function calcolaScorrevoleScomparsa(
  cfg: ConfigurazionePorta,
  avvisi: Avviso[]
): Pick<
  RisultatoCalcolo,
  "controtelaio" | "telaio" | "anta" | "lucePassaggio" | "ingombroParete"
> {
  const { foroMuro } = cfg;

  const lucePassaggio: Dimensioni = {
    larghezza: foroMuro.larghezza,
    altezza: foroMuro.altezza,
  };

  const ingombroParete: Dimensioni = {
    larghezza: 2 * foroMuro.larghezza + COSTANTI.scorrevoleScomparsa_delta_L,
    altezza: foroMuro.altezza + COSTANTI.scorrevoleScomparsa_delta_H,
  };

  const controtelaioEsterno: Dimensioni = { ...ingombroParete };
  const controtelaioInterno: Dimensioni = {
    larghezza: foroMuro.larghezza,
    altezza: foroMuro.altezza,
  };

  const telaioEsterno: Dimensioni = {
    larghezza: foroMuro.larghezza + 20,
    altezza: foroMuro.altezza + 10,
  };
  const telaioInterno = { ...lucePassaggio };

  const anta: Dimensioni = {
    larghezza: foroMuro.larghezza + 30,
    altezza: foroMuro.altezza + 10,
  };

  verificaAntaStandard(
    { larghezza: foroMuro.larghezza, altezza: foroMuro.altezza },
    avvisi
  );

  avvisi.push({
    livello: "info",
    messaggio: `Servono almeno ${ingombroParete.larghezza} mm di parete libera per il cassonetto.`,
  });

  return {
    controtelaio: { presente: true, esterno: controtelaioEsterno, interno: controtelaioInterno },
    telaio: {
      esterno: telaioEsterno,
      interno: telaioInterno,
      spessoreMontante: 10,
    },
    anta,
    lucePassaggio,
    ingombroParete,
  };
}

/**
 * Scorrevole esterno muro: nessun controtelaio, binario a vista.
 * L'anta scorre lungo la parete e la copre lateralmente.
 */
function calcolaScorrevoleEsterno(
  cfg: ConfigurazionePorta,
  avvisi: Avviso[]
): Pick<
  RisultatoCalcolo,
  "controtelaio" | "telaio" | "anta" | "lucePassaggio" | "ingombroParete"
> {
  const { foroMuro } = cfg;

  const lucePassaggio: Dimensioni = {
    larghezza: foroMuro.larghezza,
    altezza: foroMuro.altezza,
  };

  const ingombroParete: Dimensioni = {
    larghezza: 2 * foroMuro.larghezza + COSTANTI.scorrevoleEsterno_delta_L,
    altezza: foroMuro.altezza + 100,
  };

  const anta: Dimensioni = {
    larghezza: foroMuro.larghezza + 100,
    altezza: foroMuro.altezza + 50,
  };

  verificaAntaStandard(lucePassaggio, avvisi);

  avvisi.push({
    livello: "info",
    messaggio: `L'anta scorre a vista: servono ${ingombroParete.larghezza} mm di parete libera.`,
  });

  return {
    controtelaio: { presente: false },
    telaio: {
      esterno: { larghezza: foroMuro.larghezza + 20, altezza: foroMuro.altezza + 10 },
      interno: lucePassaggio,
      spessoreMontante: 10,
    },
    anta,
    lucePassaggio,
    ingombroParete,
  };
}

/**
 * Pieghevole / a libro. Ingombro ridotto: l'anta si piega su sé stessa.
 * Approssimazione: anta unica divisa in 2 pannelli.
 */
function calcolaPieghevole(
  cfg: ConfigurazionePorta,
  avvisi: Avviso[]
): Pick<
  RisultatoCalcolo,
  "controtelaio" | "telaio" | "anta" | "lucePassaggio" | "ingombroParete"
> {
  const { foroMuro, opzioni } = cfg;

  const controtelaioEsterno: Dimensioni = {
    larghezza: foroMuro.larghezza - COSTANTI.giocoBatt_L,
    altezza: foroMuro.altezza - COSTANTI.giocoBatt_H,
  };
  const controtelaioInterno: Dimensioni = {
    larghezza: controtelaioEsterno.larghezza - 2 * COSTANTI.spessoreControtelaioBatt,
    altezza: controtelaioEsterno.altezza - COSTANTI.spessoreControtelaioBatt,
  };

  const telaioEsterno = { ...controtelaioInterno };
  const spessoreTelaioPieg = 30;
  const telaioInterno = {
    larghezza: telaioEsterno.larghezza - 2 * spessoreTelaioPieg,
    altezza: telaioEsterno.altezza - spessoreTelaioPieg,
  };

  const anta: Dimensioni = { ...telaioInterno };
  const lucePassaggio: Dimensioni = {
    larghezza: telaioInterno.larghezza - 30,
    altezza: telaioInterno.altezza,
  };

  verificaAntaStandard(anta, avvisi);
  avvisi.push({
    livello: "info",
    messaggio: "Anta divisa in 2 pannelli con cerniera centrale.",
  });

  return {
    controtelaio: opzioni.conControtelaio
      ? { presente: true, esterno: controtelaioEsterno, interno: controtelaioInterno }
      : { presente: false },
    telaio: {
      esterno: telaioEsterno,
      interno: telaioInterno,
      spessoreMontante: spessoreTelaioPieg,
    },
    anta,
    lucePassaggio,
    ingombroParete: null,
  };
}

/**
 * Entry point: dato l'input completo del configuratore, restituisce
 * il dettaglio dimensionale.
 *
 * @throws Error se le misure sono non valide (≤ 0 o insufficienti).
 */
export function calcolaPorta(cfg: ConfigurazionePorta): RisultatoCalcolo {
  const avvisi: Avviso[] = [];
  validaConfigurazione(cfg, avvisi);

  let parziale: ReturnType<typeof calcolaBattente>;
  switch (cfg.tipologia) {
    case "battente":
      parziale = calcolaBattente(cfg, avvisi);
      break;
    case "filo_muro":
      parziale = calcolaFiloMuro(cfg, avvisi);
      break;
    case "scorrevole_scomparsa":
      parziale = calcolaScorrevoleScomparsa(cfg, avvisi);
      break;
    case "scorrevole_esterno":
      parziale = calcolaScorrevoleEsterno(cfg, avvisi);
      break;
    case "pieghevole":
      parziale = calcolaPieghevole(cfg, avvisi);
      break;
    default: {
      const _exhaustive: never = cfg.tipologia;
      throw new Error(`Tipologia non gestita: ${String(_exhaustive)}`);
    }
  }

  const sopraluce =
    cfg.opzioni.sopraluce.presente
      ? {
          larghezza: parziale.telaio.esterno.larghezza,
          altezza: cfg.opzioni.sopraluce.altezza,
        }
      : null;

  const fissoLaterale = cfg.opzioni.fissoLaterale.presente
    ? {
        lato: cfg.opzioni.fissoLaterale.lato,
        larghezza: cfg.opzioni.fissoLaterale.larghezza,
        altezza: parziale.telaio.esterno.altezza,
      }
    : null;

  const oblo = cfg.opzioni.oblo.presente
    ? oboloDimensioniDefault(cfg.opzioni.oblo.forma)
    : null;

  return {
    tipologia: cfg.tipologia,
    foroMuro: cfg.foroMuro,
    ...parziale,
    sopraluce,
    fissoLaterale,
    oblo,
    versoApertura: versoApertura(cfg.latoCerniere, cfg.manovra),
    posizioneManiglia: posizioneManiglia(cfg.latoCerniere),
    avvisi,
  };
}

function oboloDimensioniDefault(forma: "tondo" | "ovale") {
  if (forma === "tondo") {
    return { forma, larghezza: 250, altezza: 250 };
  }
  return { forma, larghezza: 350, altezza: 200 };
}

/**
 * Verifica sanity check dei numeri in ingresso. Non blocca (aggiunge avvisi)
 * ma lancia se il foro muro è manifestamente invalido.
 */
function validaConfigurazione(
  cfg: ConfigurazionePorta,
  avvisi: Avviso[]
): void {
  const { foroMuro, tipologia } = cfg;
  if (!Number.isFinite(foroMuro.larghezza) || foroMuro.larghezza <= 0) {
    throw new Error("Larghezza foro muro non valida.");
  }
  if (!Number.isFinite(foroMuro.altezza) || foroMuro.altezza <= 0) {
    throw new Error("Altezza foro muro non valida.");
  }

  const minL: Record<Tipologia, number> = {
    battente: 620,
    filo_muro: 620,
    pieghevole: 700,
    scorrevole_esterno: 600,
    scorrevole_scomparsa: 600,
  };
  const minH: Record<Tipologia, number> = {
    battente: 1900,
    filo_muro: 1900,
    pieghevole: 1900,
    scorrevole_esterno: 1900,
    scorrevole_scomparsa: 1900,
  };
  if (foroMuro.larghezza < minL[tipologia]) {
    avvisi.push({
      livello: "warning",
      messaggio: `Foro muro molto stretto (${foroMuro.larghezza} mm) per una porta ${tipologia}.`,
    });
  }
  if (foroMuro.altezza < minH[tipologia]) {
    avvisi.push({
      livello: "warning",
      messaggio: `Foro muro molto basso (${foroMuro.altezza} mm): standard è ≥ 2100 mm.`,
    });
  }
}
