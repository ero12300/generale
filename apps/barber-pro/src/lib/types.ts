// -----------------------------------------------------------------------------
// Domain model condiviso — usato sia dal fallback demo che dall'adapter Firebase.
// Amounts in cents (integer) per evitare drift float. Formattazione con formatEUR.
// -----------------------------------------------------------------------------

export type Plan = "free" | "pro" | "business";

export interface Shop {
  id: string;
  slug: string;
  name: string;
  ownerUid: string;
  address?: string;
  phone?: string;
  plan: Plan;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  currentPeriodEnd?: string | null;
  createdAt: string;
  brandColor?: string;
  timezone?: string;
}

export interface Service {
  id: string;
  shopId: string;
  name: string;
  durationMin: number;
  priceCents: number;
  active: boolean;
  description?: string;
}

export interface Staff {
  id: string;
  shopId: string;
  name: string;
  role?: string;
  color?: string;
  active: boolean;
}

export interface Client {
  id: string;
  shopId: string;
  name: string;
  phone?: string;
  email?: string;
  notes?: string;
  tags: string[];
  vip: boolean;
  referralCode: string;
  referredByClientId?: string | null;
  totalSpentCents: number;
  visits: number;
  loyaltyPoints: number;
  createdAt: string;
}

export type BookingStatus = "confirmed" | "completed" | "cancelled" | "no_show";

export interface Booking {
  id: string;
  shopId: string;
  clientId: string;
  staffId: string;
  serviceId: string;
  startAt: string; // ISO
  endAt: string;   // ISO
  status: BookingStatus;
  priceCents: number;
  notes?: string;
  couponCode?: string;
  discountCents?: number;
  createdAt: string;
  source: "internal" | "public";
}

export type PaymentMethod = "cash" | "card" | "transfer" | "other";

export interface Payment {
  id: string;
  shopId: string;
  bookingId?: string;
  clientId?: string;
  amountCents: number;
  method: PaymentMethod;
  createdAt: string;
  note?: string;
}

export interface Coupon {
  id: string;
  shopId: string;
  code: string;
  discountPercent?: number;
  discountCents?: number;
  active: boolean;
  redemptions: number;
  maxRedemptions?: number;
  expiresAt?: string | null;
  createdAt: string;
}

export interface ReferralEvent {
  id: string;
  shopId: string;
  referrerClientId: string;
  newClientId: string;
  status: "pending" | "rewarded";
  createdAt: string;
  rewardCents: number;
}

export interface DashboardKpis {
  revenueTodayCents: number;
  revenueMonthCents: number;
  bookingsToday: number;
  bookingsWeek: number;
  clientsTotal: number;
  clientsNewMonth: number;
  topClients: Array<{ id: string; name: string; totalSpentCents: number; visits: number }>;
  upcoming: Array<{ id: string; clientName: string; serviceName: string; staffName: string; startAt: string; priceCents: number }>;
}
