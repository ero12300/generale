import { z } from "zod";

export const bookingRequestSchema = z.object({
  clientName: z.string().trim().min(2, "Inserisci il nome del cliente").max(120),
  barberName: z.string().trim().min(2, "Seleziona un barber").max(120),
  serviceId: z.string().trim().min(1, "Seleziona un servizio"),
  bookingDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data non valida"),
  bookingTime: z.string().regex(/^\d{2}:\d{2}$/, "Ora non valida"),
  referralCode: z.string().trim().max(40).optional().or(z.literal("")),
});

export const checkoutRequestSchema = z.object({
  plan: z.enum(["basic", "pro", "enterprise"]),
  billingCycle: z.enum(["monthly", "yearly"]).default("monthly"),
  originPath: z.string().trim().default("/growth"),
});

export type BookingRequest = z.infer<typeof bookingRequestSchema>;
export type CheckoutRequest = z.infer<typeof checkoutRequestSchema>;
