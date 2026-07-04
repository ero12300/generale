import {
  ALTEZZA_MANIGLIA_MAX,
  ALTEZZA_MANIGLIA_MIN,
  ALTEZZE_STANDARD_ANTA,
  ANTA_MAX_ALTEZZA,
  ANTA_MAX_LARGHEZZA,
  ANTA_MIN_ALTEZZA,
  ANTA_MIN_LARGHEZZA,
  DETRAZIONE_ALTEZZA,
  DETRAZIONE_LARGHEZZA,
  DETRAZIONE_SCORREVOLE,
  DISPLAY_MAX_ALTEZZA,
  DISPLAY_MIN_ALTEZZA,
  EXTRA_ALTEZZA_SCOMPARSA,
  EXTRA_INGOMBRO_SCOMPARSA,
  FISSO_MAX_LARGHEZZA,
  FISSO_MIN_LARGHEZZA,
  LARGHEZZE_STANDARD_ANTA,
  MURO_MAX_ALLARGAMENTI,
  MURO_MIN,
  MURO_STANDARD_MAX,
  MURO_STANDARD_MIN,
  OBLO_MARGINE_BORDO,
  OBLO_MAX,
  OBLO_MIN,
  POSA_ALTEZZA,
  POSA_LARGHEZZA,
  SOGLIA_QUARTA_CERNIERA,
  SORMONTO_ESTERNO_MURO,
  TELAIO_ALTEZZA,
} from "./costanti";
import type {
  ConfigurazionePorta,
  Dimensione,
  LatoApertura,
  ModelloPorta,
  RisultatoCalcolo,
} from "./tipi";

export const ETICHETTE_MODELLO: Record<ModelloPorta, string> = {
  battente: "Battente 1 anta",
  bussola: "Bussola 2 ante",
  scorrevole_scomparsa: "Scorrevole a scomparsa",
  scorrevole_esterno: "Scorrevole esterno muro",
  ventola: "Va e vieni (ventola)",
};

function latoOpposto(lato: LatoApertura): LatoApertura {
  return lato === "destra" ? "sinistra" : "destra";
}

function descrizioneApertura(config: ConfigurazionePorta): string {
  const lato = config.apertura.lato === "destra" ? "Destra" : "Sinistra";
  switch (config.modello) {
    case "battente":
    case "bussola":
      return `${lato} a ${config.apertura.movimento === "spingere" ? "spingere" : "tirare"}`;
    case "ventola":
      return `Bidirezionale (va e vieni), cardini a ${lato.toLowerCase()}`;
    case "scorrevole_scomparsa":
    case "scorrevole_esterno":
      return `Scorrimento verso ${lato.toLowerCase()}`;
    default: {
      const esaustivo: never = config.modello;
      throw new Error(`Modello non gestito: ${esaustivo}`);
    }
  }
}

function piuVicino(valore: number, standard: number[]): number {
  return standard.reduce((migliore, attuale) =>
    Math.abs(attuale - valore) < Math.abs(migliore - valore) ? attuale : migliore
  );
}

/**
 * Motore di calcolo: dal foro muro (vano vuoto) alle misure di produzione.
 *
 * Regola base (battente, standard di settore):
 *   luce/anta  = foro muro − 100 mm in larghezza (80 telaio + 20 posa)
 *                foro muro −  50 mm in altezza  (40 telaio + 10 posa)
 *   esterno telaio = foro muro − aria di posa
 *   controtelaio (opera morta) = foro muro
 */
export function calcolaPorta(config: ConfigurazionePorta): RisultatoCalcolo {
  const errori: string[] = [];
  const avvisi: string[] = [];
  const { foroMuro, modello } = config;

  if (foroMuro.larghezza <= 0 || foroMuro.altezza <= 0) {
    errori.push("Inserire larghezza e altezza del foro muro maggiori di zero.");
  }
  if (foroMuro.spessoreMuro < MURO_MIN) {
    errori.push(`Spessore muro minimo gestibile: ${MURO_MIN} mm.`);
  }
  if (foroMuro.spessoreMuro > MURO_MAX_ALLARGAMENTI) {
    errori.push(`Spessore muro oltre il limite di ${MURO_MAX_ALLARGAMENTI} mm anche con allargamenti.`);
  }

  // Larghezza utile per il blocco porta al netto del fisso laterale.
  let larghezzaUtile = foroMuro.larghezza;
  let pannelloFisso: RisultatoCalcolo["pannelloFisso"] = null;
  if (config.fisso.presente) {
    if (modello === "scorrevole_scomparsa" || modello === "scorrevole_esterno") {
      avvisi.push("Fisso laterale non previsto sulle porte scorrevoli: verrà ignorato.");
    } else if (
      config.fisso.larghezza < FISSO_MIN_LARGHEZZA ||
      config.fisso.larghezza > FISSO_MAX_LARGHEZZA
    ) {
      errori.push(
        `Larghezza fisso laterale fuori limite (${FISSO_MIN_LARGHEZZA}–${FISSO_MAX_LARGHEZZA} mm).`
      );
    } else {
      larghezzaUtile -= config.fisso.larghezza;
    }
  }

  // Altezza utile al netto del display (sopraluce vetrato).
  let altezzaUtile = foroMuro.altezza;
  let vetroDisplay: Dimensione | null = null;
  if (config.display.presente) {
    if (config.display.altezza < DISPLAY_MIN_ALTEZZA || config.display.altezza > DISPLAY_MAX_ALTEZZA) {
      errori.push(`Altezza display fuori limite (${DISPLAY_MIN_ALTEZZA}–${DISPLAY_MAX_ALTEZZA} mm).`);
    } else {
      altezzaUtile -= config.display.altezza;
    }
  }

  // Luce netta di passaggio a serramento finito.
  const lucePassaggio: Dimensione = {
    larghezza: Math.max(0, larghezzaUtile - DETRAZIONE_LARGHEZZA),
    altezza: Math.max(0, altezzaUtile - DETRAZIONE_ALTEZZA),
  };

  let anta: Dimensione = { ...lucePassaggio };
  let antaSemifissa: Dimensione | null = null;
  let ingombroScorrevole: Dimensione | null = null;

  switch (modello) {
    case "battente":
    case "ventola":
      break;
    case "bussola": {
      const totale = lucePassaggio.larghezza;
      const principale = Math.ceil(totale / 2);
      anta = { larghezza: principale, altezza: lucePassaggio.altezza };
      antaSemifissa = { larghezza: totale - principale, altezza: lucePassaggio.altezza };
      break;
    }
    case "scorrevole_scomparsa": {
      // L'anta sormonta lo stipite: +50 mm in L e H rispetto alla luce.
      anta = {
        larghezza: lucePassaggio.larghezza + DETRAZIONE_SCORREVOLE,
        altezza: lucePassaggio.altezza + DETRAZIONE_SCORREVOLE,
      };
      ingombroScorrevole = {
        larghezza: 2 * lucePassaggio.larghezza + EXTRA_INGOMBRO_SCOMPARSA,
        altezza: foroMuro.altezza + EXTRA_ALTEZZA_SCOMPARSA,
      };
      break;
    }
    case "scorrevole_esterno": {
      // L'anta copre il vano con sormonto per lato; binario doppio.
      anta = {
        larghezza: foroMuro.larghezza + 2 * SORMONTO_ESTERNO_MURO,
        altezza: foroMuro.altezza + SORMONTO_ESTERNO_MURO,
      };
      ingombroScorrevole = { larghezza: 2 * anta.larghezza, altezza: anta.altezza + 100 };
      break;
    }
    default: {
      const esaustivo: never = modello;
      throw new Error(`Modello non gestito: ${esaustivo}`);
    }
  }

  // Verifiche di fabbricazione anta.
  if (anta.larghezza < ANTA_MIN_LARGHEZZA) {
    errori.push(
      `Anta troppo stretta (${anta.larghezza} mm): il minimo producibile è ${ANTA_MIN_LARGHEZZA} mm. Ridurre fisso/telaio o allargare il foro muro.`
    );
  }
  if (anta.larghezza > ANTA_MAX_LARGHEZZA) {
    errori.push(
      `Anta troppo larga (${anta.larghezza} mm): il massimo producibile è ${ANTA_MAX_LARGHEZZA} mm. Valutare bussola a 2 ante o fisso laterale.`
    );
  }
  if (anta.altezza < ANTA_MIN_ALTEZZA) {
    errori.push(
      `Anta troppo bassa (${anta.altezza} mm): il minimo producibile è ${ANTA_MIN_ALTEZZA} mm.`
    );
  }
  if (anta.altezza > ANTA_MAX_ALTEZZA) {
    errori.push(
      `Anta troppo alta (${anta.altezza} mm): il massimo producibile è ${ANTA_MAX_ALTEZZA} mm. Valutare un display/sopraluce per ridurre l'anta.`
    );
  }

  // Vetro display: taglio = larghezza luce totale × altezza display − traverso.
  if (config.display.presente && errori.length === 0) {
    vetroDisplay = {
      larghezza: Math.max(0, larghezzaUtile - DETRAZIONE_LARGHEZZA),
      altezza: Math.max(0, config.display.altezza - TELAIO_ALTEZZA),
    };
  }

  // Pannello fisso laterale: stessa altezza dell'anta.
  if (
    config.fisso.presente &&
    modello !== "scorrevole_scomparsa" &&
    modello !== "scorrevole_esterno" &&
    config.fisso.larghezza >= FISSO_MIN_LARGHEZZA &&
    config.fisso.larghezza <= FISSO_MAX_LARGHEZZA
  ) {
    pannelloFisso = {
      larghezza: config.fisso.larghezza,
      altezza: anta.altezza,
      lato: config.fisso.lato,
    };
  }

  // Oblò: deve stare dentro l'anta con margine dai bordi.
  let oblo: RisultatoCalcolo["oblo"] = null;
  if (config.oblo.presente) {
    const d = config.oblo.dimensione;
    if (d < OBLO_MIN || d > OBLO_MAX) {
      errori.push(`Dimensione oblò fuori limite (${OBLO_MIN}–${OBLO_MAX} mm).`);
    } else if (d + 2 * OBLO_MARGINE_BORDO > anta.larghezza) {
      errori.push(
        `Oblò da ${d} mm troppo grande per un'anta da ${anta.larghezza} mm (servono ${OBLO_MARGINE_BORDO} mm di margine per lato).`
      );
    } else {
      const bordoInferiore = config.oblo.altezzaCentro - d / 2;
      const bordoSuperiore = config.oblo.altezzaCentro + d / 2;
      if (bordoInferiore < OBLO_MARGINE_BORDO || bordoSuperiore > anta.altezza - OBLO_MARGINE_BORDO) {
        errori.push(
          `Quota centro oblò ${config.oblo.altezzaCentro} mm non valida: l'oblò deve stare tra ${
            OBLO_MARGINE_BORDO + d / 2
          } e ${anta.altezza - OBLO_MARGINE_BORDO - d / 2} mm da terra.`
        );
      } else {
        oblo = { ...config.oblo, presente: true };
      }
    }
  }

  // Ferramenta e verso di apertura.
  const scorrevole = modello === "scorrevole_scomparsa" || modello === "scorrevole_esterno";
  const latoCerniere = scorrevole ? null : config.apertura.lato;
  const latoManiglia = scorrevole
    ? null
    : modello === "ventola"
      ? null
      : latoOpposto(config.apertura.lato);
  const numeroCerniere = scorrevole ? 0 : anta.altezza > SOGLIA_QUARTA_CERNIERA ? 4 : 3;

  if (
    config.altezzaManiglia < ALTEZZA_MANIGLIA_MIN ||
    config.altezzaManiglia > ALTEZZA_MANIGLIA_MAX
  ) {
    avvisi.push(
      `Quota maniglia ${config.altezzaManiglia} mm fuori dallo standard ergonomico (${ALTEZZA_MANIGLIA_MIN}–${ALTEZZA_MANIGLIA_MAX} mm).`
    );
  }

  // Telaio e spessore muro.
  const fuoriStandardMuro =
    foroMuro.spessoreMuro < MURO_STANDARD_MIN || foroMuro.spessoreMuro > MURO_STANDARD_MAX;
  const allargamentiNecessari = foroMuro.spessoreMuro > MURO_STANDARD_MAX;
  if (allargamentiNecessari) {
    avvisi.push(
      `Spessore muro ${foroMuro.spessoreMuro} mm oltre il telaio standard (${MURO_STANDARD_MAX} mm): prevedere allargamenti telaio.`
    );
  } else if (fuoriStandardMuro && foroMuro.spessoreMuro >= MURO_MIN) {
    avvisi.push(
      `Spessore muro ${foroMuro.spessoreMuro} mm sotto lo standard (${MURO_STANDARD_MIN}–${MURO_STANDARD_MAX} mm): telaio su misura.`
    );
  }

  // Confronto con le misure standard di produzione.
  let misuraStandard: RisultatoCalcolo["misuraStandard"] = null;
  if (!scorrevole || modello === "scorrevole_scomparsa") {
    const largheStd = piuVicino(anta.larghezza, LARGHEZZE_STANDARD_ANTA);
    const alteStd = piuVicino(anta.altezza, ALTEZZE_STANDARD_ANTA);
    const esatta = largheStd === anta.larghezza && alteStd === anta.altezza;
    misuraStandard = { esatta, larghezza: largheStd, altezza: alteStd };
    if (!esatta) {
      avvisi.push(
        `Anta ${anta.larghezza}×${anta.altezza} mm fuori misura standard: produzione su misura (standard più vicino ${largheStd}×${alteStd} mm).`
      );
    }
  }

  const esternoTelaio: Dimensione = {
    larghezza: Math.max(0, foroMuro.larghezza - POSA_LARGHEZZA),
    altezza: Math.max(0, foroMuro.altezza - POSA_ALTEZZA),
  };

  return {
    ok: errori.length === 0,
    errori,
    avvisi,
    lucePassaggio,
    anta,
    antaSemifissa,
    esternoTelaio,
    controtelaio: { larghezza: foroMuro.larghezza, altezza: foroMuro.altezza },
    pannelloFisso,
    vetroDisplay,
    oblo,
    ferramenta: {
      numeroCerniere,
      latoCerniere,
      latoManiglia,
      altezzaManiglia: config.altezzaManiglia,
      descrizioneApertura: descrizioneApertura(config),
    },
    telaio: {
      spessoreMuro: foroMuro.spessoreMuro,
      fuoriStandard: fuoriStandardMuro,
      allargamentiNecessari,
    },
    ingombroScorrevole,
    misuraStandard,
  };
}
