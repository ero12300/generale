import { z } from "zod";

export const createClientSchema = z.object({
  name: z.string().min(2, "Il nome deve avere almeno 2 caratteri"),
  phone: z.string().min(5, "Inserisci un numero di telefono valido"),
  email: z.string().email("Email non valida").optional().or(z.literal("")),
  notes: z.string().max(500).optional().or(z.literal("")),
  referredByCode: z.string().optional().or(z.literal("")),
});

export const createBookingSchema = z.object({
  clientId: z.string().optional().nullable(),
  clientName: z.string().min(2, "Inserisci il nome del cliente"),
  clientPhone: z.string().min(5, "Inserisci un telefono valido"),
  serviceId: z.string().min(1, "Seleziona un servizio"),
  staffId: z.string().optional().nullable(),
  start: z.string().min(1, "Seleziona data e ora"),
  source: z.enum(["interno", "online"]).optional(),
  notes: z.string().max(500).optional().or(z.literal("")),
});

export const updateBookingSchema = z.object({
  status: z.enum(["pending", "confirmed", "completed", "cancelled"]),
});

export const createRevenueSchema = z.object({
  amount: z.number().positive("L'importo deve essere maggiore di zero"),
  method: z.enum(["contanti", "carta", "altro"]),
  serviceName: z.string().optional().or(z.literal("")),
  clientId: z.string().optional().nullable(),
  note: z.string().max(300).optional().or(z.literal("")),
});

export const createCampaignSchema = z.object({
  name: z.string().min(2, "Inserisci un nome per la campagna"),
  type: z.enum(["sconto", "referral"]),
  description: z.string().min(4, "Aggiungi una descrizione"),
  discountPercent: z.number().min(0).max(100).optional(),
});

export const checkoutSchema = z.object({
  plan: z.enum(["base", "pro"]),
});

export const loginSchema = z.object({
  email: z.string().email("Email non valida"),
  name: z.string().optional(),
});
