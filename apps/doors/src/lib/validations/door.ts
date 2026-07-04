import { z } from "zod";

export const doorConfigSchema = z
  .object({
    roughOpening: z.object({
      widthMm: z
        .number()
        .int()
        .min(600, "Il foro muro deve essere largo almeno 600 mm")
        .max(1800, "Il foro muro supera il limite gestito in questa versione"),
      heightMm: z
        .number()
        .int()
        .min(1800, "Il foro muro deve essere alto almeno 1800 mm")
        .max(2800, "Il foro muro supera il limite gestito in questa versione"),
      wallThicknessMm: z
        .number()
        .int()
        .min(70, "Lo spessore muro deve essere almeno 70 mm")
        .max(450, "Lo spessore muro supera il limite gestito in questa versione"),
    }),
    model: z.enum(["hinged", "compass", "fixed"]),
    hingeSide: z.enum(["left", "right"]),
    swing: z.enum(["in", "out"]),
    options: z.object({
      hasDisplay: z.boolean(),
      hasOvalWindow: z.boolean(),
      fixedPanel: z.enum(["auto", "forced", "none"]),
    }),
  })
  .superRefine((value, context) => {
    if (value.model === "fixed" && value.options.fixedPanel === "none") {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Una porta fissa deve produrre almeno un pannello fisso",
        path: ["options", "fixedPanel"],
      });
    }
  });

export type DoorConfigFormValues = z.infer<typeof doorConfigSchema>;
