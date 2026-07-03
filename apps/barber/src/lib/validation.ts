import { z } from "zod";

export const bookingInputSchema = z.object({
  customerName: z.string().trim().min(2, "Inserisci il nome completo").max(80),
  customerPhone: z
    .string()
    .trim()
    .regex(/^\+?[0-9 ]{6,20}$/, "Numero di telefono non valido"),
  customerEmail: z
    .string()
    .trim()
    .email("Email non valida")
    .optional()
    .or(z.literal("")),
  serviceId: z.string().min(1, "Scegli un servizio"),
  barberId: z.string().min(1, "Scegli un barbiere"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data non valida"),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Orario non valido"),
  promoCode: z.string().trim().max(20).optional().or(z.literal("")),
  marketingConsent: z.boolean().default(false),
});

export type BookingInput = z.infer<typeof bookingInputSchema>;

export const saleInputSchema = z.object({
  serviceName: z.string().trim().min(1, "Descrizione obbligatoria").max(80),
  barberId: z.string().min(1, "Scegli il barbiere"),
  amountInput: z.string().trim().min(1, "Importo obbligatorio"),
  method: z.enum(["contanti", "carta", "satispay", "altro"]),
  customerId: z.string().optional().or(z.literal("")),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export type SaleInput = z.infer<typeof saleInputSchema>;

export const customerInputSchema = z.object({
  name: z.string().trim().min(2, "Nome troppo corto").max(80),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9 ]{6,20}$/, "Numero di telefono non valido"),
  email: z.string().trim().email("Email non valida").optional().or(z.literal("")),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
  marketingConsent: z.boolean().default(false),
});

export type CustomerInput = z.infer<typeof customerInputSchema>;

export const campaignInputSchema = z.object({
  name: z.string().trim().min(2, "Nome troppo corto").max(60),
  kind: z.enum(["percentuale", "fisso", "referral"]),
  code: z
    .string()
    .trim()
    .min(3, "Codice troppo corto")
    .max(20)
    .regex(/^[A-Za-z0-9-]+$/, "Solo lettere, numeri e trattini"),
  valueInput: z.string().trim().min(1, "Valore obbligatorio"),
});

export type CampaignInput = z.infer<typeof campaignInputSchema>;
