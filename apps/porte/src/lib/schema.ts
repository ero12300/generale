import { z } from "zod";
import {
  ALTEZZA_MANIGLIA_STANDARD,
  MURO_MAX_ALLARGAMENTI,
  OBLO_CENTRO_STANDARD,
} from "./costanti";
import type { ConfigurazionePorta } from "./tipi";

const misuraMm = (min: number, max: number, campo: string) =>
  z
    .number({ invalid_type_error: `${campo}: inserire un numero in millimetri.` })
    .int(`${campo}: usare millimetri interi.`)
    .min(min, `${campo}: minimo ${min} mm.`)
    .max(max, `${campo}: massimo ${max} mm.`);

export const schemaConfigurazione = z.object({
  commessa: z.string().trim().min(1, "Inserire il nome della commessa o del cliente."),
  modello: z.enum(["battente", "bussola", "scorrevole_scomparsa", "scorrevole_esterno", "ventola"]),
  foroMuro: z.object({
    larghezza: misuraMm(500, 4000, "Larghezza foro muro"),
    altezza: misuraMm(1800, 3200, "Altezza foro muro"),
    spessoreMuro: misuraMm(60, MURO_MAX_ALLARGAMENTI, "Spessore muro"),
  }),
  apertura: z.object({
    lato: z.enum(["destra", "sinistra"]),
    movimento: z.enum(["spingere", "tirare"]),
  }),
  fisso: z.object({
    presente: z.boolean(),
    lato: z.enum(["destra", "sinistra"]),
    larghezza: z.number().int().min(0).max(1500),
  }),
  display: z.object({
    presente: z.boolean(),
    altezza: z.number().int().min(0).max(800),
  }),
  oblo: z.object({
    presente: z.boolean(),
    forma: z.enum(["tondo", "quadro"]),
    dimensione: z.number().int().min(0).max(600),
    altezzaCentro: z.number().int().min(0).max(2500),
  }),
  altezzaManiglia: misuraMm(500, 1500, "Quota maniglia"),
}) satisfies z.ZodType<ConfigurazionePorta>;

export const CONFIG_INIZIALE: ConfigurazionePorta = {
  commessa: "",
  modello: "battente",
  foroMuro: { larghezza: 900, altezza: 2150, spessoreMuro: 105 },
  apertura: { lato: "destra", movimento: "spingere" },
  fisso: { presente: false, lato: "sinistra", larghezza: 400 },
  display: { presente: false, altezza: 300 },
  oblo: { presente: false, forma: "tondo", dimensione: 350, altezzaCentro: OBLO_CENTRO_STANDARD },
  altezzaManiglia: ALTEZZA_MANIGLIA_STANDARD,
};
