import { z } from "zod";

export const createBarberClientSchema = z.object({
  full_name: z.string().trim().min(2, "Nome cliente obbligatorio").max(120),
  phone: z.string().trim().max(30).nullable().optional(),
  email: z.string().email("Email non valida").nullable().optional(),
  notes: z.string().max(1000).nullable().optional(),
});

export const createBarberBookingSchema = z
  .object({
    client_id: z.string().min(1, "Cliente obbligatorio"),
    service_id: z.string().min(1, "Servizio obbligatorio"),
    barber_name: z.string().max(100).nullable().optional(),
    starts_at: z.string().datetime("Data inizio non valida"),
    ends_at: z.string().datetime("Data fine non valida"),
    source: z.enum(["online", "walk_in", "phone", "instagram"]).optional(),
    notes: z.string().max(1000).nullable().optional(),
    price_amount: z.number().min(0),
    deposit_amount: z.number().min(0).optional(),
  })
  .refine((value) => new Date(value.ends_at).getTime() > new Date(value.starts_at).getTime(), {
    message: "La fine appuntamento deve essere successiva all'inizio",
    path: ["ends_at"],
  });

export const updateBookingStatusSchema = z.object({
  status: z.enum(["pending", "confirmed", "completed", "cancelled", "no_show"]),
});

export const createBarberPaymentSchema = z.object({
  booking_id: z.string().nullable().optional(),
  client_id: z.string().nullable().optional(),
  amount: z.number().positive("Importo obbligatorio"),
  method: z.enum(["cash", "card", "online", "bank_transfer"]),
  status: z.enum(["pending", "paid", "refunded"]).optional(),
  paid_at: z.string().datetime().optional(),
  stripe_payment_intent_id: z.string().nullable().optional(),
});

export const createBarberCampaignSchema = z.object({
  name: z.string().trim().min(3).max(120),
  channel: z.enum(["sms", "email", "whatsapp", "in_app"]),
  discount_type: z.enum(["percent", "fixed"]),
  discount_value: z.number().min(0),
  referral_bonus: z.number().min(0).optional(),
  message: z.string().max(1000).nullable().optional(),
  starts_at: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  ends_at: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  audience: z.string().trim().min(2).max(120),
});

export const stripeCheckoutSchema = z.object({
  plan: z.enum(["basic", "pro"]),
  success_url: z.string().url().optional(),
  cancel_url: z.string().url().optional(),
});
