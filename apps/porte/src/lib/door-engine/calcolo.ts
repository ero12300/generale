import {
  ANTE_STANDARD,
  LUCE_NETTA_MINIMA,
  SPESSORE_ANTA,
} from "./defaults";
import type {
  Avviso,
  ConfigurazionePorta,
  Mano,
  RigaCalcolo,
  RisultatoPorta,
  Verso,
} from "./types";

const TOLLERANZA_STANDARD_MM = 5;

function manoOpposta(mano: Mano): Mano {
  return mano === "destra" ? "sinistra" : "destra";
}

function etichettaApertura(mano: Mano, verso: Verso): string {
  const manoLabel = mano === "destra" ? "Destra" : "Sinistra";
  return `${manoLabel} a ${verso}`;
}

function trovaMisuraStandard(larghezza: number, altezza: number): string | null {
  const match = ANTE_STANDARD.find(
    (s) =>
      Math.abs(s.larghezza - larghezza) <= TOLLERANZA_STANDARD_MM &&
      Math.abs(s.altezza - altezza) <= TOLLERANZA_STANDARD_MM,
  );
  if (!match) return null;
  return `${match.larghezza / 10} × ${match.altezza / 10} cm`;
}

/**
 * Calcola la porta finita a partire dal foro muro, detraendo l'opera morta
 * (aria di posa + telaio) e aggiungendo le battute dell'anta.
 *
 * Schema orizzontale (esempio con fisso a sinistra):
 *   aria | montante | fisso | montante | luce anta | montante | aria
 * Schema verticale (esempio con sopraluce):
 *   aria | traverso | sopraluce | traverso | luce anta ... pavimento
 */
export function calcolaPorta(config: ConfigurazionePorta): RisultatoPorta {
  const { giochi } = config;
  const avvisi: Avviso[] = [];
  const dettaglio: RigaCalcolo[] = [];

  const numeroFissi =
    config.fissoPosizione === "nessuno" ? 0 : config.fissoPosizione === "entrambi" ? 2 : 1;

  // --- Telaio (esterno telaio) ---
  const telaioLarghezza = config.foroLarghezza - 2 * giochi.ariaLaterale;
  const telaioAltezza = config.foroAltezza - giochi.ariaSuperiore;
  dettaglio.push({
    voce: "Esterno telaio – larghezza",
    formula: `foro muro ${config.foroLarghezza} − 2 × aria ${giochi.ariaLaterale}`,
    risultato: `${telaioLarghezza} mm`,
  });
  dettaglio.push({
    voce: "Esterno telaio – altezza",
    formula: `foro muro ${config.foroAltezza} − aria sup. ${giochi.ariaSuperiore}`,
    risultato: `${telaioAltezza} mm`,
  });

  // --- Suddivisione orizzontale ---
  const numeroMontanti = 2 + numeroFissi;
  const luceAntaLarghezza =
    telaioLarghezza - numeroMontanti * giochi.montanteTelaio - numeroFissi * config.fissoLarghezza;
  dettaglio.push({
    voce: "Luce anta – larghezza",
    formula:
      `telaio ${telaioLarghezza} − ${numeroMontanti} × montante ${giochi.montanteTelaio}` +
      (numeroFissi > 0 ? ` − ${numeroFissi} × fisso ${config.fissoLarghezza}` : ""),
    risultato: `${luceAntaLarghezza} mm`,
  });

  // --- Suddivisione verticale ---
  const haSopraluce = config.sopraluceTipo !== "nessuno";
  const altezzaSopraluceOccupata = haSopraluce
    ? config.sopraluceAltezza + giochi.traversoTelaio
    : 0;
  const luceAntaAltezza = telaioAltezza - giochi.traversoTelaio - altezzaSopraluceOccupata;
  dettaglio.push({
    voce: "Luce anta – altezza",
    formula:
      `telaio ${telaioAltezza} − traverso ${giochi.traversoTelaio}` +
      (haSopraluce
        ? ` − sopraluce ${config.sopraluceAltezza} − traverso ${giochi.traversoTelaio}`
        : ""),
    risultato: `${luceAntaAltezza} mm`,
  });

  // --- Anta di produzione ---
  const antaLarghezza = luceAntaLarghezza + 2 * giochi.battuta;
  const antaAltezza = luceAntaAltezza + giochi.battuta - giochi.giocoPavimento;
  dettaglio.push({
    voce: "Anta – larghezza",
    formula: `luce ${luceAntaLarghezza} + 2 × battuta ${giochi.battuta}`,
    risultato: `${antaLarghezza} mm`,
  });
  dettaglio.push({
    voce: "Anta – altezza",
    formula: `luce ${luceAntaAltezza} + battuta ${giochi.battuta} − gioco pav. ${giochi.giocoPavimento}`,
    risultato: `${antaAltezza} mm`,
  });

  // --- Luce netta di passaggio ---
  const luceNetta = { larghezza: luceAntaLarghezza, altezza: luceAntaAltezza };

  // --- Avvisi ---
  if (luceAntaLarghezza < 350 || luceAntaAltezza < 1500) {
    avvisi.push({
      livello: "errore",
      codice: "FORO_INSUFFICIENTE",
      messaggio:
        "Il foro muro è troppo piccolo per questa configurazione: riduci fissi/sopraluce o verifica le misure.",
    });
  }

  const minimoNormativa = LUCE_NETTA_MINIMA[config.modello];
  if (luceAntaLarghezza < minimoNormativa) {
    avvisi.push({
      livello: "avviso",
      codice: "LUCE_SOTTO_MINIMO",
      messaggio: `Luce netta ${luceAntaLarghezza} mm sotto il minimo di ${minimoNormativa} mm previsto dal DM 236/1989 per porte di tipo "${config.modello}".`,
    });
  }

  if (antaLarghezza > 1000) {
    avvisi.push({
      livello: "avviso",
      codice: "ANTA_PESANTE",
      messaggio:
        "Anta oltre 1000 mm di larghezza: prevedere cerniere maggiorate e verifica del peso.",
    });
  }

  if (config.modello === "interna" && (config.spessoreMuro < 100 || config.spessoreMuro > 120)) {
    avvisi.push({
      livello: "info",
      codice: "TELAIO_FUORI_STANDARD",
      messaggio: `Spessore muro ${config.spessoreMuro} mm fuori dallo standard 100–120 mm: prevedere telaio su misura o coprifili telescopici.`,
    });
  }

  if (config.vetroDisplay && config.oblo) {
    avvisi.push({
      livello: "info",
      codice: "DISPLAY_E_OBLO",
      messaggio:
        "Display vetrato e oblò insieme: verificare in produzione la distanza minima tra le lavorazioni.",
    });
  }

  const misuraStandard = trovaMisuraStandard(antaLarghezza, antaAltezza);
  if (misuraStandard) {
    avvisi.push({
      livello: "info",
      codice: "MISURA_STANDARD",
      messaggio: `L'anta corrisponde alla misura commerciale standard ${misuraStandard}.`,
    });
  }

  return {
    telaio: { larghezza: telaioLarghezza, altezza: telaioAltezza },
    anta: {
      larghezza: antaLarghezza,
      altezza: antaAltezza,
      spessore: SPESSORE_ANTA[config.modello],
    },
    luceNetta,
    fisso:
      numeroFissi > 0
        ? { larghezza: config.fissoLarghezza, altezza: luceAntaAltezza }
        : null,
    numeroFissi,
    sopraluce: haSopraluce
      ? {
          larghezza: telaioLarghezza - 2 * giochi.montanteTelaio,
          altezza: config.sopraluceAltezza,
          tipo: config.sopraluceTipo as "fisso" | "compasso",
        }
      : null,
    latoCerniere: config.mano,
    latoManiglia: manoOpposta(config.mano),
    etichettaApertura: etichettaApertura(config.mano, config.verso),
    misuraStandard,
    avvisi,
    dettaglioCalcolo: dettaglio,
  };
}
