import { z } from "zod";

const mm = (min: number, max: number, label: string) =>
  z
    .number({ invalid_type_error: `${label}: inserisci un numero in mm` })
    .int(`${label}: usa millimetri interi`)
    .min(min, `${label}: minimo ${min} mm`)
    .max(max, `${label}: massimo ${max} mm`);

export const foroMuroSchema = z.object({
  larghezza: mm(300, 3000, "Larghezza foro muro"),
  altezza: mm(1000, 3000, "Altezza foro muro"),
  spessoreMuro: mm(60, 500, "Spessore muro"),
});

export const accessoriSchema = z.object({
  bussola: z.boolean(),
  fissoLaterale: z.boolean(),
  larghezzaFisso: mm(100, 2000, "Larghezza fisso"),
  sopraluce: z.boolean(),
  altezzaSopraluce: mm(100, 1500, "Altezza sopraluce"),
  vetro: z.boolean(),
  ovale: z.boolean(),
});

export const configurazioneSchema = z.object({
  sistemaId: z.string().min(1),
  foroMuro: foroMuroSchema,
  latoCerniere: z.enum(["sinistra", "destra"]),
  sensoApertura: z.enum(["tiro", "spinta"]),
  accessori: accessoriSchema,
});

export type ConfigurazioneInput = z.infer<typeof configurazioneSchema>;
