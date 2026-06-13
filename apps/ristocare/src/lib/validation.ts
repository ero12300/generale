import { z } from "zod";

export const ticketCreateSchema = z.object({
  equipmentId: z.string().min(1, "Attrezzatura obbligatoria"),
  title: z.string().min(3, "Titolo troppo corto").max(120),
  description: z.string().min(10, "Descrivi il problema (minimo 10 caratteri)").max(2000),
  urgency: z.enum(["bassa", "media", "alta", "blocco_servizio"]),
  machineDown: z.boolean().default(false),
  openedBy: z.string().min(2, "Indica il tuo nome").max(80),
});

export type TicketCreateInput = z.infer<typeof ticketCreateSchema>;

export const referralCreateSchema = z.object({
  partnerName: z.string().min(2, "Nome partner obbligatorio").max(80),
  partnerType: z.string().min(2).max(60),
  referredCompany: z.string().min(2, "Nome locale obbligatorio").max(120),
  referredContact: z.string().min(2, "Referente obbligatorio").max(120),
  city: z.string().min(2).max(80),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Autorizzazione al contatto obbligatoria" }),
  }),
});

export type ReferralCreateInput = z.infer<typeof referralCreateSchema>;
