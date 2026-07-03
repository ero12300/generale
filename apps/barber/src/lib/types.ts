import type { Cents } from "./money";

export type PlanId = "base" | "pro";

export interface ShopSettings {
  name: string;
  plan: PlanId;
  /** Stato abbonamento SaaS del barbiere (chi usa il gestionale). */
  subscriptionStatus: "active" | "trialing" | "canceled";
  stripeCustomerId?: string;
  openingHour: number; // ora apertura (0-23)
  closingHour: number; // ora chiusura (0-23)
  slotMinutes: number; // durata slot prenotazione
  closedWeekdays: number[]; // 0 = domenica ... 6 = sabato
}

export interface Service {
  id: string;
  name: string;
  description: string;
  priceCents: Cents;
  durationMinutes: number;
  active: boolean;
}

export interface Barber {
  id: string;
  name: string;
  role: string;
  active: boolean;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  notes?: string;
  referralCode: string;
  referredById?: string;
  createdAt: string; // ISO
  marketingConsent: boolean;
}

export type BookingStatus = "confermata" | "completata" | "annullata";

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  serviceId: string;
  serviceName: string;
  barberId: string;
  barberName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  priceCents: Cents;
  discountCents: Cents;
  campaignCode?: string;
  status: BookingStatus;
  createdAt: string;
}

export type PaymentMethod = "contanti" | "carta" | "satispay" | "altro";

export interface Sale {
  id: string;
  date: string; // YYYY-MM-DD
  serviceName: string;
  barberId: string;
  barberName: string;
  customerId?: string;
  customerName?: string;
  amountCents: Cents;
  method: PaymentMethod;
  bookingId?: string;
  createdAt: string;
}

export type CampaignKind = "percentuale" | "fisso" | "referral";

export interface Campaign {
  id: string;
  name: string;
  kind: CampaignKind;
  code: string;
  /** percentuale (0-100) se kind=percentuale, centesimi se kind=fisso o referral */
  value: number;
  active: boolean;
  usageCount: number;
  createdAt: string;
}

export interface PlanFeatures {
  id: PlanId;
  label: string;
  priceMonthlyCents: Cents;
  maxCustomers: number | null;
  maxBarbers: number | null;
  campaigns: boolean;
  referralProgram: boolean;
  csvExport: boolean;
}

export const PLANS: Record<PlanId, PlanFeatures> = {
  base: {
    id: "base",
    label: "Base",
    priceMonthlyCents: 1900,
    maxCustomers: 100,
    maxBarbers: 2,
    campaigns: false,
    referralProgram: false,
    csvExport: false,
  },
  pro: {
    id: "pro",
    label: "Pro",
    priceMonthlyCents: 4900,
    maxCustomers: null,
    maxBarbers: null,
    campaigns: true,
    referralProgram: true,
    csvExport: true,
  },
};
