/**
 * Tipi di dominio BarberFlow.
 * Tutti gli importi monetari sono espressi in centesimi (interi) per evitare
 * errori di arrotondamento con i float.
 */

export type PlanId = "base" | "pro";

export interface Shop {
  id: string;
  name: string;
  plan: PlanId;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  createdAt: string;
}

export interface Service {
  id: string;
  shopId: string;
  name: string;
  priceCents: number;
  durationMin: number;
  active: boolean;
}

export interface Client {
  id: string;
  shopId: string;
  fullName: string;
  phone: string;
  email?: string;
  notes?: string;
  referralCode: string;
  referredById?: string;
  visits: number;
  totalSpentCents: number;
  createdAt: string;
}

export type BookingStatus = "confermata" | "completata" | "annullata";

export interface Booking {
  id: string;
  shopId: string;
  clientId?: string;
  clientName: string;
  clientPhone: string;
  serviceId: string;
  serviceName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  status: BookingStatus;
  source: "interno" | "online";
  createdAt: string;
}

export type PaymentMethod = "contanti" | "carta" | "altro";

export interface Sale {
  id: string;
  shopId: string;
  clientId?: string;
  clientName?: string;
  serviceId?: string;
  description: string;
  amountCents: number;
  discountCents: number;
  method: PaymentMethod;
  campaignId?: string;
  date: string; // YYYY-MM-DD
  createdAt: string;
}

export type CampaignKind = "sconto" | "referral";

export interface Campaign {
  id: string;
  shopId: string;
  kind: CampaignKind;
  name: string;
  /** Percentuale di sconto (0-100) oppure importo fisso in centesimi. */
  discountPercent?: number;
  discountCents?: number;
  /** Per referral: premio per chi porta l'amico, in centesimi. */
  referrerRewardCents?: number;
  active: boolean;
  redemptions: number;
  createdAt: string;
}
