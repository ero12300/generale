import { z } from "zod";

export const bookingRequestSchema = z.object({
  fullName: z.string().trim().min(2, "Inserisci nome e cognome"),
  phone: z.string().trim().min(8, "Inserisci un numero valido"),
  serviceId: z.string().trim().min(1, "Scegli un servizio"),
  preferredDate: z.string().trim().min(1, "Scegli una data"),
  preferredTime: z.string().trim().min(1, "Scegli un orario"),
  referralCode: z.string().trim().max(24).optional().or(z.literal("")),
});

export const checkoutRequestSchema = z.object({
  plan: z.enum(["basic", "pro"]),
});

export type BookingRequest = z.infer<typeof bookingRequestSchema>;
export type CheckoutRequest = z.infer<typeof checkoutRequestSchema>;
