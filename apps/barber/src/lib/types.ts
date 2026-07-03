// Tipi dominio BarberOS. Importi monetari SEMPRE in centesimi (interi) per evitare float.

export type PlanId = "free" | "pro";

export type ServiceCategory = "capelli" | "barba" | "combo" | "trattamenti" | "altro";

export interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  durationMin: number;
  priceCents: number;
  active: boolean;
}

export interface Barber {
  id: string;
  name: string;
  role: string;
  color: string;
  active: boolean;
}

export type ClientTier = "nuovo" | "abituale" | "vip";

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  notes?: string;
  tier: ClientTier;
  createdAt: string;
  totalSpentCents: number;
  visits: number;
  loyaltyPoints: number;
  referredByCode?: string;
  referralCode: string;
  marketingConsent: boolean;
}

export type BookingStatus = "richiesta" | "confermata" | "completata" | "annullata" | "no_show";
export type PaymentMethod = "contanti" | "carta" | "app" | "non_pagato";

export interface Booking {
  id: string;
  clientId?: string;
  clientName: string;
  clientPhone: string;
  serviceId: string;
  serviceName: string;
  barberId: string;
  barberName: string;
  start: string; // ISO datetime
  durationMin: number;
  priceCents: number;
  status: BookingStatus;
  paymentMethod: PaymentMethod;
  discountCents: number;
  couponCode?: string;
  notes?: string;
  createdAt: string;
  source: "online" | "interno";
}

export type CampaignType = "sconto" | "porta_amico";
export type DiscountType = "percentuale" | "fisso";

export interface Campaign {
  id: string;
  name: string;
  type: CampaignType;
  code: string;
  discountType: DiscountType;
  discountValue: number; // % (0-100) o centesimi se fisso
  active: boolean;
  redemptions: number;
  refereeRewardCents: number; // premio per chi invita (porta_amico)
  createdAt: string;
  expiresAt?: string;
}

export interface Subscription {
  plan: PlanId;
  status: "active" | "trialing" | "canceled" | "past_due";
  currentPeriodEnd?: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
}

export interface ShopSettings {
  shopName: string;
  ownerName: string;
  address: string;
  phone: string;
  openHour: number; // 9
  closeHour: number; // 20
  slotMinutes: number; // 30
  workingDays: number[]; // 0=dom ... 6=sab
}

export interface BarberState {
  settings: ShopSettings;
  subscription: Subscription;
  services: Service[];
  barbers: Barber[];
  clients: Client[];
  bookings: Booking[];
  campaigns: Campaign[];
}
