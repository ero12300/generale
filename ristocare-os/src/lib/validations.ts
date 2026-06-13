import { z } from "zod";

// Validazione input — apertura ticket (sez. 12, step 1).
export const createTicketSchema = z.object({
  equipmentId: z.string().min(1, "Seleziona un'attrezzatura"),
  title: z.string().min(3, "Inserisci un titolo (min 3 caratteri)").max(120),
  description: z.string().min(5, "Descrivi il problema (min 5 caratteri)").max(2000),
  urgency: z.enum(["bassa", "media", "alta", "bloccante"]),
  openedBy: z.string().min(2, "Indica chi apre il ticket").max(120),
});

export type CreateTicketInput = z.infer<typeof createTicketSchema>;

// Validazione input — segnalazione referral (sez. 35).
export const createReferralSchema = z.object({
  partnerName: z.string().min(2, "Nome partner obbligatorio").max(120),
  partnerType: z.string().min(2, "Tipo partner obbligatorio").max(80),
  phone: z.string().min(5, "Telefono obbligatorio").max(40),
  email: z.string().email("Email non valida"),
  referredCompany: z.string().min(2, "Nome locale obbligatorio").max(160),
  referredContact: z.string().min(2, "Referente obbligatorio").max(160),
  city: z.string().min(2, "Città obbligatoria").max(80),
  notes: z.string().max(1000).optional().default(""),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Devi autorizzare il contatto" }),
  }),
});

export type CreateReferralInput = z.infer<typeof createReferralSchema>;

// Validazione input — richiesta contatto (sez. 17).
export const createContactSchema = z.object({
  name: z.string().min(2, "Nome obbligatorio").max(120),
  company: z.string().min(2, "Nome locale obbligatorio").max(160),
  email: z.string().email("Email non valida"),
  phone: z.string().min(5, "Telefono obbligatorio").max(40),
  city: z.string().min(2, "Città obbligatoria").max(80),
  requestType: z.enum(["demo", "preventivo", "censimento", "tecnico", "referral"]),
  message: z.string().max(2000).optional().default(""),
});

export type CreateContactInput = z.infer<typeof createContactSchema>;
