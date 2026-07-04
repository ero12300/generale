import { z } from "zod";

const mm = (min: number, max: number, campo: string) =>
  z
    .number({ invalid_type_error: `${campo}: inserire un numero in mm.` })
    .int(`${campo}: usare millimetri interi.`)
    .min(min, `${campo}: minimo ${min} mm.`)
    .max(max, `${campo}: massimo ${max} mm.`);

export const misureVanoSchema = z.object({
  larghezza: mm(400, 3000, "Larghezza vano"),
  altezza: mm(1500, 3200, "Altezza vano"),
  spessoreMuro: mm(60, 600, "Spessore muro"),
});

export const configPortaSchema = z.object({
  nome: z.string().trim().min(1, "Inserire un riferimento commessa o cliente.").max(80),
  modelloId: z.string().min(1),
  tipologia: z.enum([
    "battente",
    "doppia_battente",
    "battente_fisso",
    "scorrevole_scomparsa",
    "scorrevole_esterno",
  ]),
  vano: misureVanoSchema,
  latoCerniere: z.enum(["destra", "sinistra"]),
  verso: z.enum(["spingere", "tirare"]),
  opzioni: z.object({
    sopraluce: z.enum(["nessuno", "vetrato", "cieco"]),
    altezzaSopraluce: mm(0, 1200, "Altezza sopraluce"),
    vetro: z.boolean(),
    oblo: z.boolean(),
    latoFisso: z.enum(["destra", "sinistra"]),
    larghezzaFisso: mm(0, 1500, "Larghezza fianco fisso"),
    ripartizioneAnte: z.enum(["simmetrica", "asimmetrica"]),
  }),
});

export type ConfigPortaInput = z.infer<typeof configPortaSchema>;

export function validaConfig(input: unknown): { ok: true; data: ConfigPortaInput } | { ok: false; errori: string[] } {
  const res = configPortaSchema.safeParse(input);
  if (res.success) return { ok: true, data: res.data };
  return {
    ok: false,
    errori: res.error.issues.map((i) => i.message),
  };
}
