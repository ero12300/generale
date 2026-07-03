/**
 * Modelli del dominio BarberPro.
 * Vengono usati sia in demo mode (in-memory) sia con Firestore.
 */

export type PlanTier = "free" | "pro" | "business";

export type Shop = {
  id: string;
  ownerId: string;
  slug: string;
  name: string;
  city: string;
  address: string;
  phone?: string;
  logoUrl?: string;
  colorAccent?: string;
  openingHours: OpeningHours;
  plan: PlanTier;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  createdAt: string;
};

export type OpeningHours = {
  // 0 = domenica, 6 = sabato
  [day: number]: { open: string; close: string } | null;
};

export type Service = {
  id: string;
  shopId: string;
  name: string;
  durationMinutes: number;
  priceCents: number;
  description?: string;
  featured?: boolean;
  active: boolean;
};

export type Client = {
  id: string;
  shopId: string;
  name: string;
  phone?: string;
  email?: string;
  notes?: string;
  totalVisits: number;
  totalSpentCents: number;
  lastVisitAt?: string;
  createdAt: string;
  /** Codice referral unico del cliente (per campagna "porta un amico"). */
  referralCode: string;
  /** ID del cliente che ha invitato questo cliente (se applicabile). */
  referredBy?: string;
  tags?: string[];
};

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "no_show";

export type Booking = {
  id: string;
  shopId: string;
  clientId?: string;
  clientName: string;
  clientPhone?: string;
  clientEmail?: string;
  serviceId: string;
  serviceName: string;
  priceCents: number;
  startsAt: string; // ISO
  endsAt: string; // ISO
  status: BookingStatus;
  notes?: string;
  discountCents?: number;
  discountReason?: string;
  createdAt: string;
  source: "internal" | "public" | "referral";
};

export type Campaign = {
  id: string;
  shopId: string;
  type: "referral" | "discount";
  name: string;
  active: boolean;
  /** Sconto in centesimi (fisso) o percentuale (0-100). */
  discountValue: number;
  discountKind: "fixed" | "percent";
  /** Codice sconto opzionale, o per referral il prefisso codice. */
  code?: string;
  /** Numero massimo di utilizzi. */
  maxRedemptions?: number;
  redemptions: number;
  createdAt: string;
  description?: string;
};

export type Payment = {
  id: string;
  shopId: string;
  bookingId?: string;
  clientId?: string;
  amountCents: number;
  method: "cash" | "card" | "other";
  createdAt: string;
  note?: string;
};

/** Aggregati per dashboard: incassi giornalieri/mensili. */
export type RevenueSlice = {
  label: string;
  amountCents: number;
  bookings: number;
};

/** Feature gate: cosa ogni piano include. */
export type PlanConfig = {
  tier: PlanTier;
  name: string;
  priceCentsMonthly: number;
  tagline: string;
  bookingsPerMonth: number | "unlimited";
  maxBarbers: number;
  publicBookingPage: boolean;
  clientDatabase: boolean;
  revenueAnalytics: boolean;
  referralCampaigns: boolean;
  smsReminders: boolean;
  customBranding: boolean;
  multiLocation: boolean;
  apiAccess: boolean;
  prioritySupport: boolean;
  highlight?: boolean;
  cta: string;
};
