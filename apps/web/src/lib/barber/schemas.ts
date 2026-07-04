import { z } from "zod";

export const barberServices = [
  "taglio-premium",
  "barba-rituale",
  "combo-signature",
  "colore-style",
] as const;

export const barberPlanIds = ["basic", "pro"] as const;

export const barberCollections = {
  bookings: "barber_bookings",
  customers: "barber_customers",
  payments: "barber_payments",
  campaigns: "barber_campaigns",
} as const;

function normalizePreferredTime(value: unknown) {
  const raw = String(value ?? "").trim();
  const match = raw.match(/^(\d{1,2}):([0-5]\d)\s*([AP]M)$/i);

  if (!match) return raw;

  const hour = Number(match[1]);
  const minute = match[2];
  const period = match[3].toUpperCase();
  const normalizedHour =
    period === "PM" && hour < 12 ? hour + 12 : period === "AM" && hour === 12 ? 0 : hour;

  return `${String(normalizedHour).padStart(2, "0")}:${minute}`;
}

export const bookingLeadSchema = z.object({
  customerName: z.string().trim().min(2, "Inserisci nome e cognome"),
  phone: z
    .string()
    .trim()
    .min(6, "Inserisci un numero valido")
    .regex(/^[+0-9\s().-]+$/, "Usa solo numeri e simboli telefonici"),
  email: z.string().trim().email("Email non valida").optional().or(z.literal("")),
  service: z.enum(barberServices),
  preferredDate: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Usa formato YYYY-MM-DD"),
  preferredTime: z
    .preprocess(
      normalizePreferredTime,
      z.string().trim().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Usa formato HH:mm")
    ),
  referralCode: z.string().trim().max(24).optional().or(z.literal("")),
});

export const customerSchema = z.object({
  id: z.string(),
  fullName: z.string().min(2),
  phone: z.string().min(6),
  email: z.string().email().optional(),
  loyaltyPoints: z.number().int().min(0),
  referralCode: z.string().min(4),
  totalSpendCents: z.number().int().min(0),
  lastVisitAt: z.string().optional(),
});

export const campaignSchema = z.object({
  id: z.string(),
  name: z.string().min(2),
  type: z.enum(["discount", "referral"]),
  discountPercent: z.number().int().min(0).max(100),
  active: z.boolean(),
});

export const checkoutRequestSchema = z.object({
  planId: z.enum(barberPlanIds),
});

export type BookingLeadInput = z.infer<typeof bookingLeadSchema>;
export type BarberPlanId = z.infer<typeof checkoutRequestSchema>["planId"];
