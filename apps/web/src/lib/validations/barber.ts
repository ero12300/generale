import { z } from "zod";

const sourceSchema = z.enum(["instagram", "referral", "walk_in", "google", "other"]);
const bookingStatusSchema = z.enum(["requested", "confirmed", "completed", "cancelled"]);
const transactionTypeSchema = z.enum(["service_sale", "product_sale", "subscription", "refund"]);
const paymentMethodSchema = z.enum(["cash", "card", "digital_wallet", "bank_transfer"]);
const campaignTypeSchema = z.enum(["discount", "bring_a_friend"]);

export const createBarberCustomerSchema = z.object({
  full_name: z.string().trim().min(2, "Nome cliente obbligatorio").max(120),
  phone: z.string().trim().min(5, "Telefono obbligatorio").max(30),
  email: z.string().email("Email non valida").nullable().optional(),
  notes: z.string().max(500).nullable().optional(),
  source: sourceSchema.default("walk_in"),
  referred_by_customer_id: z.string().nullable().optional(),
});

export const createBarberBookingSchema = z.object({
  customer_id: z.string().trim().min(1, "Seleziona un cliente"),
  service_name: z.string().trim().min(2, "Servizio obbligatorio").max(120),
  start_at: z.string().datetime("Data/ora non valida"),
  duration_minutes: z.number().int().min(15).max(240),
  price_cents: z.number().int().min(0),
  status: bookingStatusSchema.default("confirmed"),
  notes: z.string().max(500).nullable().optional(),
});

export const createBarberTransactionSchema = z.object({
  customer_id: z.string().nullable().optional(),
  booking_id: z.string().nullable().optional(),
  type: transactionTypeSchema.default("service_sale"),
  amount_cents: z.number().int().min(1),
  payment_method: paymentMethodSchema.default("card"),
  description: z.string().trim().min(2).max(200),
});

export const createBarberCampaignSchema = z.object({
  name: z.string().trim().min(3).max(120),
  type: campaignTypeSchema.default("discount"),
  code: z.string().trim().min(3).max(30),
  discount_percent: z.number().min(0).max(100).default(0),
  reward_cents: z.number().int().min(0).default(0),
  starts_at: z.string().datetime("Data inizio non valida"),
  ends_at: z.string().datetime("Data fine non valida"),
  enabled: z.boolean().default(true),
});

export const createBarberCheckoutSchema = z.object({
  plan_id: z.enum(["base", "pro"]),
  customer_email: z.string().email("Email non valida").optional(),
});
