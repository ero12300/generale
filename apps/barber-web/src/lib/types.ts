export type PlanId = "basic" | "pro";

export interface Service {
  id: string;
  name: string;
  durationMinutes: number;
  priceCents: number;
  isPremium?: boolean;
}

export interface ClientProfile {
  id: string;
  fullName: string;
  phone: string;
  visits: number;
  lastVisit: string;
  lifetimeValueCents: number;
  referralCode: string;
  status: "new" | "loyal" | "vip";
}

export interface Booking {
  id: string;
  clientName: string;
  serviceId: string;
  startsAt: string;
  status: "confirmed" | "waiting" | "completed";
  source: "app" | "walk-in" | "instagram";
}

export interface RevenueEntry {
  id: string;
  label: string;
  amountCents: number;
  paidAt: string;
  channel: "card" | "cash" | "stripe";
}

export interface Campaign {
  id: string;
  name: string;
  audience: string;
  reward: string;
  redemptions: number;
  revenueCents: number;
}

export interface PlanFeature {
  label: string;
  basic: boolean | string;
  pro: boolean | string;
}
