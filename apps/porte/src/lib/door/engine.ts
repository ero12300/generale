import type {
  ConfigurazionePorta,
  DeduzioniSistema,
  Dimensione,
  Lato,
  ManoPorta,
  RisultatoCalcolo,
  SensoApertura,
  SistemaPorta,
} from "./types";

function latoOpposto(lato: Lato): Lato {
  return lato === "sinistra" ? "destra" : "sinistra";
}

/**
 * Determina la "mano" della porta (verso di apertura, lato cerniere e maniglia)
 * a partire dal lato delle cerniere e dal senso di apertura.
 * La maniglia è sempre sul lato opposto alle cerniere.
 * Convenzione DIN: il lato delle cerniere identifica DIN sinistra/destra
 * osservando la porta dal lato verso cui si apre (lato di tiro).
 */
export function calcolaMano(latoCerniere: Lato, sensoApertura: SensoApertura): ManoPorta {
  const latoManiglia = latoOpposto(latoCerniere);
  const din = latoCerniere === "sinistra" ? "DIN sinistra" : "DIN destra";
  const verso = latoCerniere === "destra" ? "destra" : "sinistra";
  const apertura =
    sensoApertura === "tiro"
      ? "l'anta si apre verso l'osservatore (tiro)"
      : "l'anta si apre in allontanamento (spinta)";
  const descrizione = `Porta ${verso.toUpperCase()} · cerniere a ${latoCerniere}, maniglia a ${latoManiglia}. ${apertura}. Convenzione: ${din}.`;
  return { latoCerniere, latoManiglia, sensoApertura, din, verso, descrizione };
}

function dim(larghezza: number, altezza: number): Dimensione {
  return { larghezza: Math.round(larghezza), altezza: Math.round(altezza) };
}

/**
 * Motore di calcolo: dal foro muro alle misure di produzione.
 * Restituisce l'intera catena (controtelaio → luce → anta) più accessori,
 * la mano della porta e gli eventuali avvisi.
 */
export function calcolaPorta(
  config: ConfigurazionePorta,
  sistema: SistemaPorta
): RisultatoCalcolo {
  const d: DeduzioniSistema = { ...sistema.deduzioni, ...config.deduzioniOverride };
  const { larghezza: Lf, altezza: Hf, spessoreMuro } = config.foroMuro;
  const avvisi: string[] = [];

  const mano = calcolaMano(config.latoCerniere, config.sensoApertura);

  // 1) Controtelaio consigliato (misura esterna da ordinare).
  const controtelaio = dim(Lf - 2 * d.giocoPosaLato, Hf - d.giocoPosaSuperiore);

  // 2) Luce interna del controtelaio.
  const luceControtelaio = dim(
    controtelaio.larghezza - 2 * d.spessoreControtelaio,
    controtelaio.altezza - d.spessoreControtelaio
  );

  // 3) Luce di passaggio netta (a porta aperta), tolto il telaio.
  const lucePassaggio = dim(
    luceControtelaio.larghezza - 2 * d.ingombroTelaioLato,
    luceControtelaio.altezza - d.ingombroTelaioSuperiore
  );

  // 4) Ripartizione della luce tra anta, fisso laterale e sopraluce.
  let luceAntaL = lucePassaggio.larghezza;
  let luceAntaH = lucePassaggio.altezza;

  let sopraluce: Dimensione | undefined;
  if (config.accessori.sopraluce) {
    const hSopra = config.accessori.altezzaSopraluce;
    sopraluce = dim(luceAntaL, hSopra);
    luceAntaH = luceAntaH - hSopra - d.traversoIntermedio;
  }

  let fisso: Dimensione | undefined;
  if (config.accessori.fissoLaterale) {
    const wFisso = config.accessori.larghezzaFisso;
    fisso = dim(wFisso, luceAntaH);
    luceAntaL = luceAntaL - wFisso - d.montanteIntermedio;
  }

  // 5) Calcolo anta/e in base alla tipologia.
  let anta: Dimensione;
  let antaSecondaria: Dimensione | undefined;
  let numeroAnte = 1;
  let ingombroParete: number | undefined;
  let ingombroScomparsa: Dimensione | undefined;

  if (sistema.tipologia === "scorrevole_esterno") {
    // L'anta ricopre la luce con margine per lato; niente telaio a battuta.
    anta = dim(luceAntaL + 2 * d.ricoperturaScorrevole, luceAntaH + d.ricoperturaScorrevole);
    ingombroParete = anta.larghezza + 50; // spazio libero necessario a fianco del vano
  } else if (sistema.tipologia === "scorrevole_scomparsa") {
    anta = dim(luceAntaL + 2 * d.ricoperturaScorrevole, luceAntaH + d.ricoperturaScorrevole);
    // Ingombro totale del controtelaio a scomparsa: circa 2 * luce + 110 mm.
    ingombroScomparsa = dim(2 * luceAntaL + 110, luceAntaH + 90);
    if (spessoreMuro < (sistema.spessoreMuroMin ?? 105)) {
      avvisi.push(
        `Spessore muro ${spessoreMuro} mm insufficiente: il sistema a scomparsa richiede almeno ${sistema.spessoreMuroMin ?? 105} mm.`
      );
    }
  } else if (config.accessori.bussola) {
    // Doppia anta (bussola): due ante che si incontrano al centro.
    numeroAnte = 2;
    const luceMezza = (luceAntaL - d.giocoCentraleBussola) / 2;
    anta = dim(luceMezza + 2 * d.sormontoAnta - 2 * d.giocoAnta, luceAntaH + d.sormontoAnta - d.giocoAnta);
    antaSecondaria = { ...anta };
  } else {
    // Battente ad anta singola.
    anta = dim(
      luceAntaL + 2 * d.sormontoAnta - 2 * d.giocoAnta,
      luceAntaH + d.sormontoAnta - d.giocoAnta
    );
  }

  // 6) Controlli di coerenza.
  if (lucePassaggio.larghezza <= 0 || lucePassaggio.altezza <= 0) {
    avvisi.push("Foro muro troppo piccolo: la luce di passaggio risulta nulla o negativa.");
  }
  if (anta.larghezza <= 0 || anta.altezza <= 0) {
    avvisi.push("Le dimensioni dell'anta risultano non valide: verifica foro muro e accessori.");
  }
  if (lucePassaggio.larghezza > 0 && lucePassaggio.larghezza < 750) {
    avvisi.push(
      `Luce di passaggio ${lucePassaggio.larghezza} mm < 750 mm: sotto il minimo di legge per l'accessibilità (D.M. 236/89).`
    );
  }
  if (config.accessori.fissoLaterale && luceAntaL <= 0) {
    avvisi.push("Il fisso laterale è troppo largo rispetto al foro muro.");
  }
  if (config.accessori.sopraluce && luceAntaH <= 0) {
    avvisi.push("Il sopraluce è troppo alto rispetto al foro muro.");
  }

  return {
    tipologia: sistema.tipologia,
    sistemaNome: sistema.nome,
    foroMuro: config.foroMuro,
    controtelaio,
    luceControtelaio,
    lucePassaggio,
    anta,
    numeroAnte,
    antaSecondaria,
    fisso,
    sopraluce,
    mano,
    ingombroParete,
    ingombroScomparsa,
    avvisi,
    deduzioni: d,
    accessori: config.accessori,
  };
}
