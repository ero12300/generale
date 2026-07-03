import { z } from "zod";

// Gli importi monetari sono SEMPRE in centesimi (interi), mai float.

export const serviceSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  description: z.string(),
  durationMin: z.number().int().positive(),
  priceCents: z.number().int().nonnegative(),
});
export type Service = z.infer<typeof serviceSchema>;

export const customerSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Il nome è obbligatorio"),
  phone: z.string().min(5, "Numero di telefono non valido"),
  email: z.string().email("Email non valida").or(z.literal("")),
  notes: z.string(),
  createdAt: z.string(),
  referralCode: z.string(),
  referredBy: z.string().nullable(),
});
export type Customer = z.infer<typeof customerSchema>;

export const bookingStatusSchema = z.enum([
  "confermata",
  "completata",
  "annullata",
]);
export type BookingStatus = z.infer<typeof bookingStatusSchema>;

export const bookingSchema = z.object({
  id: z.string(),
  customerName: z.string().min(1, "Il nome è obbligatorio"),
  phone: z.string().min(5, "Numero di telefono non valido"),
  serviceId: z.string().min(1, "Scegli un servizio"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data non valida"),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Orario non valido"),
  status: bookingStatusSchema,
  priceCents: z.number().int().nonnegative(),
  discountCode: z.string().nullable(),
  finalPriceCents: z.number().int().nonnegative(),
  createdAt: z.string(),
});
export type Booking = z.infer<typeof bookingSchema>;

export const paymentMethodSchema = z.enum(["contanti", "carta", "altro"]);
export type PaymentMethod = z.infer<typeof paymentMethodSchema>;

export const transactionSchema = z.object({
  id: z.string(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data non valida"),
  amountCents: z.number().int(),
  method: paymentMethodSchema,
  description: z.string(),
  bookingId: z.string().nullable(),
});
export type Transaction = z.infer<typeof transactionSchema>;

export const campaignTypeSchema = z.enum(["sconto", "referral"]);
export type CampaignType = z.infer<typeof campaignTypeSchema>;

export const campaignSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Il nome è obbligatorio"),
  type: campaignTypeSchema,
  code: z.string().min(3, "Codice di almeno 3 caratteri"),
  discountPct: z.number().int().min(1).max(100),
  active: z.boolean(),
  uses: z.number().int().nonnegative(),
  createdAt: z.string(),
});
export type Campaign = z.infer<typeof campaignSchema>;

export const planIdSchema = z.enum(["base", "pro"]);
export type PlanId = z.infer<typeof planIdSchema>;

export interface ShopSettings {
  id: string;
  plan: PlanId;
  shopName: string;
  openingHour: number;
  closingHour: number;
  slotMinutes: number;
}

export type CollectionName =
  | "services"
  | "customers"
  | "bookings"
  | "transactions"
  | "campaigns"
  | "settings";

export function formatEuro(cents: number): string {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}
