import { z } from "zod";
import { getModel, PROFONDITA_TELAIO } from "./models";
import type {
  CalcMessage,
  DoorInput,
  DoorResult,
  OpeningType,
  Verso,
} from "./types";
import { OPENING_TYPES } from "./types";

/** Altezza consigliata maniglia da pavimento finito (mm). */
const ALTEZZA_MANIGLIA = 950;
/** Luce netta minima consigliata (mm) — porte secondarie. */
const LUCE_MIN = 750;
/** Luce netta minima assoluta di legge per locali secondari (mm). */
const LUCE_MIN_ASSOLUTA = 600;

export const doorInputSchema = z.object({
  modelId: z.string().min(1, "Seleziona un modello"),
  tipoApertura: z.enum(OPENING_TYPES as [OpeningType, ...OpeningType[]]),
  foroLarghezza: z
    .number({ invalid_type_error: "Inserisci la larghezza del foro" })
    .int()
    .min(300, "Larghezza foro troppo piccola (min 300 mm)")
    .max(3000, "Larghezza foro troppo grande (max 3000 mm)"),
  foroAltezza: z
    .number({ invalid_type_error: "Inserisci l'altezza del foro" })
    .int()
    .min(300, "Altezza foro troppo piccola (min 300 mm)")
    .max(3000, "Altezza foro troppo grande (max 3000 mm)"),
  spessoreMuro: z
    .number({ invalid_type_error: "Inserisci lo spessore del muro" })
    .int()
    .min(40, "Spessore muro troppo piccolo (min 40 mm)")
    .max(400, "Spessore muro troppo grande (max 400 mm)"),
  verso: z.enum(["sx", "dx"]),
  spinta: z.enum(["spinge", "tira"]),
  compasso: z.boolean(),
  antaFissa: z.boolean(),
  antaFissaLarghezza: z
    .number()
    .int()
    .min(0)
    .max(2000, "Anta fissa troppo grande (max 2000 mm)"),
  vetro: z.boolean(),
  oblo: z.enum(["nessuno", "tondo", "ovale"]),
  note: z.string().max(500),
});

export type DoorInputRaw = z.input<typeof doorInputSchema>;

export function validateInput(raw: unknown) {
  return doorInputSchema.safeParse(raw);
}

function oppostoVerso(v: Verso): Verso {
  return v === "sx" ? "dx" : "sx";
}

/** Profondità telaio standard più vicina >= spessore muro. */
function profonditaConsigliata(spessoreMuro: number): number {
  const fit = PROFONDITA_TELAIO.find((p) => p >= spessoreMuro);
  return fit ?? PROFONDITA_TELAIO[PROFONDITA_TELAIO.length - 1];
}

function clampPos(n: number): number {
  return Math.max(0, Math.round(n));
}

/**
 * Calcola tutte le misure di produzione della porta a partire dal foro muro.
 * L'input deve essere già validato con `validateInput`.
 */
export function calcolaPorta(input: DoorInput): DoorResult {
  const modello = getModel(input.modelId);
  if (!modello) {
    throw new Error(`Modello non trovato: ${input.modelId}`);
  }

  const d = modello.deduzioni;
  const messaggi: CalcMessage[] = [];
  const { foroLarghezza: FL, foroAltezza: FH } = input;

  let anta = { larghezza: 0, altezza: 0 };
  let antaFissa: DoorResult["antaFissa"] = null;
  let telaio = { larghezza: 0, altezza: 0 };
  let lucePassaggio = { larghezza: 0, altezza: 0 };
  let ingombroTotale = { larghezza: 0, altezza: 0 };

  switch (input.tipoApertura) {
    case "battente":
    case "compasso": {
      telaio = {
        larghezza: clampPos(FL - d.telaioLarghezza),
        altezza: clampPos(FH - d.telaioAltezza),
      };
      const altezzaAnta = clampPos(FH - d.antaAltezza);
      let larghezzaAntaMobile = clampPos(FL - d.antaLarghezza);

      if (input.antaFissa && input.antaFissaLarghezza > 0) {
        larghezzaAntaMobile = clampPos(
          FL - d.antaLarghezza - input.antaFissaLarghezza
        );
        antaFissa = {
          larghezza: input.antaFissaLarghezza,
          altezza: altezzaAnta,
        };
      }

      anta = { larghezza: larghezzaAntaMobile, altezza: altezzaAnta };
      lucePassaggio = {
        larghezza: clampPos(anta.larghezza - 2 * d.battutaPerLato),
        altezza: clampPos(anta.altezza - d.battutaPerLato),
      };
      ingombroTotale = { ...telaio };

      if (input.tipoApertura === "compasso") {
        messaggi.push({
          severity: "info",
          testo:
            "Cerniere a compasso: verificare battuta e senso di recupero dello spazio in fase di posa.",
        });
      }
      break;
    }

    case "scorrevole_esterno": {
      // L'anta copre il foro: le detrazioni negative diventano maggiorazioni.
      anta = {
        larghezza: clampPos(FL - d.antaLarghezza),
        altezza: clampPos(FH - d.antaAltezza),
      };
      telaio = { ...anta };
      lucePassaggio = { larghezza: FL, altezza: FH };
      ingombroTotale = {
        larghezza: clampPos(FL + anta.larghezza + 50),
        altezza: clampPos(anta.altezza + 80),
      };
      messaggi.push({
        severity: "info",
        testo: `Serve spazio libero a parete di almeno ${ingombroTotale.larghezza} mm per lo scorrimento dell'anta.`,
      });
      break;
    }

    case "scomparsa": {
      // Il foro immesso è la luce di passaggio desiderata.
      anta = {
        larghezza: clampPos(FL - d.antaLarghezza),
        altezza: clampPos(FH - d.antaAltezza),
      };
      lucePassaggio = { larghezza: FL, altezza: FH };
      // Ingombro controtelaio a scomparsa: ~ 2·luce + 110 (largh.), +90 (alt.).
      ingombroTotale = {
        larghezza: clampPos(2 * FL + 110),
        altezza: clampPos(FH + 90),
      };
      telaio = { ...ingombroTotale };
      if (input.spessoreMuro < 90) {
        messaggi.push({
          severity: "warning",
          testo:
            "Muro sottile per una scomparsa: il controtelaio richiede in genere 90–150 mm di spessore parete.",
        });
      }
      messaggi.push({
        severity: "info",
        testo: `Ingombro controtelaio da murare: ${ingombroTotale.larghezza} × ${ingombroTotale.altezza} mm.`,
      });
      break;
    }

    default: {
      const _exhaustive: never = input.tipoApertura;
      throw new Error(`Tipo apertura non gestito: ${_exhaustive}`);
    }
  }

  const profonditaTelaio = profonditaConsigliata(input.spessoreMuro);
  const latoManiglia = oppostoVerso(input.verso);

  // Controlli di coerenza / avvisi produzione.
  if (anta.larghezza <= 0) {
    messaggi.push({
      severity: "error",
      testo:
        "L'anta risulta di larghezza nulla o negativa: verifica foro muro e anta fissa.",
    });
  }
  if (input.antaFissa && anta.larghezza > 0 && anta.larghezza < 500) {
    messaggi.push({
      severity: "warning",
      testo: `Anta mobile stretta (${anta.larghezza} mm): valutare la ripartizione con l'anta fissa.`,
    });
  }
  if (
    lucePassaggio.larghezza < LUCE_MIN &&
    lucePassaggio.larghezza >= LUCE_MIN_ASSOLUTA
  ) {
    messaggi.push({
      severity: "warning",
      testo: `Luce di passaggio ${lucePassaggio.larghezza} mm: sotto i 750 mm consigliati per un buon comfort.`,
    });
  }
  if (lucePassaggio.larghezza < LUCE_MIN_ASSOLUTA) {
    messaggi.push({
      severity: "warning",
      testo: `Luce di passaggio ${lucePassaggio.larghezza} mm molto ridotta: verifica requisiti minimi del locale.`,
    });
  }
  if (input.spessoreMuro > 120) {
    messaggi.push({
      severity: "info",
      testo: `Spessore muro ${input.spessoreMuro} mm oltre gli standard: telaio/coprifili su misura.`,
    });
  }
  if (
    (input.tipoApertura === "battente" || input.tipoApertura === "compasso") &&
    telaio.larghezza > FL
  ) {
    messaggi.push({
      severity: "error",
      testo: "Il telaio non entra nel foro muro: rivedere le detrazioni.",
    });
  }
  if (messaggi.every((m) => m.severity === "info")) {
    messaggi.unshift({
      severity: "info",
      testo: "Misure coerenti: scheda pronta per la produzione.",
    });
  }

  return {
    input,
    modello,
    anta,
    antaFissa,
    telaio,
    lucePassaggio,
    profonditaTelaio,
    ingombroTotale,
    latoManiglia,
    altezzaManiglia: ALTEZZA_MANIGLIA,
    messaggi,
  };
}
