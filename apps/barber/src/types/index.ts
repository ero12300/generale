import { z } from "zod";

export const SubscriptionTierSchema = z.enum(["free", "pro", "elite"]);
export type SubscriptionTier = z.infer<typeof SubscriptionTierSchema>;

export const TIER_LIMITS: Record<
  SubscriptionTier,
  {
    label: string;
    priceMonthly: number;
    bookingsPerMonth: number | "unlimited";
    clients: number | "unlimited";
    staff: number | "unlimited";
    campaigns: boolean;
    analytics: boolean;
    customBranding: boolean;
    multiLocation: boolean;
    prioritySupport: boolean;
    highlight?: boolean;
    ctaLabel: string;
    features: string[];
  }
> = {
  free: {
    label: "Starter",
    priceMonthly: 0,
    bookingsPerMonth: 30,
    clients: 100,
    staff: 1,
    campaigns: false,
    analytics: false,
    customBranding: false,
    multiLocation: false,
    prioritySupport: false,
    ctaLabel: "Inizia gratis",
    features: [
      "1 barbiere",
      "Fino a 30 prenotazioni / mese",
      "100 clienti in rubrica",
      "Registro incassi base",
      "Pagina prenotazione pubblica",
    ],
  },
  pro: {
    label: "Pro",
    priceMonthly: 29,
    bookingsPerMonth: "unlimited",
    clients: "unlimited",
    staff: 3,
    campaigns: true,
    analytics: true,
    customBranding: false,
    multiLocation: false,
    prioritySupport: false,
    highlight: true,
    ctaLabel: "Passa a Pro",
    features: [
      "Fino a 3 barbieri",
      "Prenotazioni illimitate",
      "Rubrica clienti illimitata",
      "Campagne sconti & porta-un-amico",
      "Analytics avanzate incassi",
      "Reminder automatici clienti",
    ],
  },
  elite: {
    label: "Elite",
    priceMonthly: 79,
    bookingsPerMonth: "unlimited",
    clients: "unlimited",
    staff: "unlimited",
    campaigns: true,
    analytics: true,
    customBranding: true,
    multiLocation: true,
    prioritySupport: true,
    ctaLabel: "Diventa Elite",
    features: [
      "Barbieri e sedi illimitati",
      "Branding personalizzato",
      "API + esportazioni fiscali",
      "WhatsApp reminder inclusi",
      "Account manager dedicato",
      "SLA priority support",
    ],
  },
};

export const ClientSchema = z.object({
  id: z.string(),
  organizationId: z.string(),
  fullName: z.string().min(2),
  phone: z.string().optional().default(""),
  email: z.string().email().optional().or(z.literal("")),
  tags: z.array(z.string()).default([]),
  notes: z.string().default(""),
  totalVisits: z.number().int().nonnegative().default(0),
  totalSpent: z.number().nonnegative().default(0),
  lastVisitAt: z.string().datetime().optional(),
  referredBy: z.string().optional(),
  referralCode: z.string().optional(),
  loyaltyPoints: z.number().int().nonnegative().default(0),
  createdAt: z.string().datetime(),
});
export type Client = z.infer<typeof ClientSchema>;

export const ServiceSchema = z.object({
  id: z.string(),
  organizationId: z.string(),
  name: z.string().min(2),
  durationMin: z.number().int().positive(),
  price: z.number().nonnegative(),
  color: z.string().default("#d4a72c"),
  active: z.boolean().default(true),
});
export type Service = z.infer<typeof ServiceSchema>;

export const BookingStatusSchema = z.enum([
  "pending",
  "confirmed",
  "in_progress",
  "completed",
  "cancelled",
  "no_show",
]);
export type BookingStatus = z.infer<typeof BookingStatusSchema>;

export const BookingSchema = z.object({
  id: z.string(),
  organizationId: z.string(),
  clientId: z.string().optional(),
  clientName: z.string(),
  clientPhone: z.string().optional().default(""),
  serviceId: z.string(),
  serviceName: z.string(),
  staffId: z.string().optional(),
  staffName: z.string().optional(),
  startAt: z.string().datetime(),
  endAt: z.string().datetime(),
  price: z.number().nonnegative(),
  status: BookingStatusSchema.default("confirmed"),
  notes: z.string().default(""),
  source: z.enum(["internal", "public", "walkin"]).default("internal"),
  createdAt: z.string().datetime(),
});
export type Booking = z.infer<typeof BookingSchema>;

export const PaymentMethodSchema = z.enum(["cash", "card", "transfer", "other"]);
export type PaymentMethod = z.infer<typeof PaymentMethodSchema>;

export const TransactionSchema = z.object({
  id: z.string(),
  organizationId: z.string(),
  bookingId: z.string().optional(),
  clientId: z.string().optional(),
  clientName: z.string().optional(),
  serviceName: z.string(),
  amount: z.number(),
  method: PaymentMethodSchema.default("cash"),
  tipAmount: z.number().nonnegative().default(0),
  discountAmount: z.number().nonnegative().default(0),
  campaignCode: z.string().optional(),
  createdAt: z.string().datetime(),
});
export type Transaction = z.infer<typeof TransactionSchema>;

export const CampaignKindSchema = z.enum(["discount", "referral", "loyalty"]);
export type CampaignKind = z.infer<typeof CampaignKindSchema>;

export const CampaignSchema = z.object({
  id: z.string(),
  organizationId: z.string(),
  name: z.string().min(2),
  kind: CampaignKindSchema,
  code: z.string(),
  discountPercent: z.number().min(0).max(100).default(0),
  discountAmount: z.number().nonnegative().default(0),
  referralRewardEuro: z.number().nonnegative().default(0),
  active: z.boolean().default(true),
  redemptions: z.number().int().nonnegative().default(0),
  maxRedemptions: z.number().int().positive().optional(),
  validFrom: z.string().datetime().optional(),
  validUntil: z.string().datetime().optional(),
  createdAt: z.string().datetime(),
});
export type Campaign = z.infer<typeof CampaignSchema>;

export const OrganizationSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  ownerUid: z.string(),
  tier: SubscriptionTierSchema.default("free"),
  stripeCustomerId: z.string().optional(),
  stripeSubscriptionId: z.string().optional(),
  currentPeriodEnd: z.string().datetime().optional(),
  timezone: z.string().default("Europe/Rome"),
  currency: z.string().default("EUR"),
  address: z.string().default(""),
  phone: z.string().default(""),
  openingHours: z
    .array(
      z.object({
        weekday: z.number().int().min(0).max(6),
        open: z.string(),
        close: z.string(),
        closed: z.boolean().default(false),
      })
    )
    .default([]),
  createdAt: z.string().datetime(),
});
export type Organization = z.infer<typeof OrganizationSchema>;
