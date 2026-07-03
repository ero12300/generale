/**
 * Modello dati condiviso per Barber Suite.
 * Multi-tenant: ogni record appartiene a un `organizationId` (il barbershop).
 * Importi monetari sempre in centesimi interi (vedi money.ts).
 */
import type { Cents } from "./money";

export type PlanId = "base" | "pro";

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "no_show";

export type PaymentMethod = "cash" | "card" | "transfer" | "other";

export type BookingSource = "internal" | "online";

export type CampaignType = "discount" | "referral";

export interface Service {
  id: string;
  organizationId: string;
  name: string;
  durationMin: number;
  priceCents: Cents;
  active: boolean;
}

export interface Staff {
  id: string;
  organizationId: string;
  name: string;
  role: string;
  color: string;
  active: boolean;
}

export interface Client {
  id: string;
  organizationId: string;
  name: string;
  phone: string;
  email: string | null;
  notes: string | null;
  tags: string[];
  visits: number;
  totalSpentCents: Cents;
  loyaltyPoints: number;
  referralCode: string;
  referredByCode: string | null;
  lastVisitAt: string | null;
  createdAt: string;
}

export interface Booking {
  id: string;
  organizationId: string;
  clientId: string | null;
  clientName: string;
  clientPhone: string;
  serviceId: string;
  serviceName: string;
  staffId: string;
  staffName: string;
  startAt: string; // ISO
  durationMin: number;
  priceCents: Cents;
  status: BookingStatus;
  source: BookingSource;
  notes: string | null;
  createdAt: string;
}

export interface Payment {
  id: string;
  organizationId: string;
  bookingId: string | null;
  clientId: string | null;
  amountCents: Cents;
  method: PaymentMethod;
  description: string;
  date: string; // ISO
}

export interface Campaign {
  id: string;
  organizationId: string;
  type: CampaignType;
  name: string;
  code: string;
  discountPercent: number | null;
  discountCents: Cents | null;
  active: boolean;
  usageCount: number;
  rewardDescription: string | null;
  createdAt: string;
}

export interface Subscription {
  organizationId: string;
  plan: PlanId;
  status: "active" | "trialing" | "canceled";
  renewsAt: string | null;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  ownerName: string;
  address: string;
  phone: string;
}

export interface WorkspaceData {
  organization: Organization;
  subscription: Subscription;
  services: Service[];
  staff: Staff[];
  clients: Client[];
  bookings: Booking[];
  payments: Payment[];
  campaigns: Campaign[];
}

/** Limiti dei piani di abbonamento. */
export const PLAN_LIMITS: Record<
  PlanId,
  {
    label: string;
    priceCents: Cents;
    maxStaff: number;
    maxActiveCampaigns: number;
    onlineBooking: boolean;
    analytics: boolean;
    referral: boolean;
  }
> = {
  base: {
    label: "Base",
    priceCents: 0,
    maxStaff: 1,
    maxActiveCampaigns: 1,
    onlineBooking: false,
    analytics: false,
    referral: false,
  },
  pro: {
    label: "Pro",
    priceCents: 2900,
    maxStaff: 10,
    maxActiveCampaigns: 50,
    onlineBooking: true,
    analytics: true,
    referral: true,
  },
};
