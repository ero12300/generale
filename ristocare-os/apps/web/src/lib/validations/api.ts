import { z } from "zod";

export const ticketUrgencySchema = z.enum(["low", "medium", "high", "critical"]);

export const createTicketSchema = z.object({
  title: z.string().min(3, "Titolo troppo corto").max(200),
  description: z.string().min(10, "Descrivi il problema con più dettaglio").max(5000),
  urgency: ticketUrgencySchema,
  equipment_id: z.string().optional().nullable(),
  location_id: z.string().optional(),
});

export const contactFormSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6).optional(),
  company: z.string().optional(),
  message: z.string().min(10),
  request_type: z.enum(["demo", "quote", "census", "technician", "referral"]),
});

export const referralFormSchema = z.object({
  partner_name: z.string().min(2),
  partner_type: z.string().min(2),
  phone: z.string().min(6),
  email: z.string().email(),
  referred_company: z.string().min(2),
  referred_contact: z.string().optional(),
  city: z.string().min(2),
  notes: z.string().optional(),
});

export const quoteFormSchema = z.object({
  ticket_id: z.string(),
  internal_cost: z.number().min(0),
  margin: z.number().min(0),
});

export type CreateTicketInput = z.infer<typeof createTicketSchema>;
export type ContactFormInput = z.infer<typeof contactFormSchema>;
export type ReferralFormInput = z.infer<typeof referralFormSchema>;
