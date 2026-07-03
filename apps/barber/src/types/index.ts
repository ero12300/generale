export type PlanId = "free" | "base" | "pro";

export type Feature =
  | "bookings.public_page"
  | "bookings.calendar"
  | "clients.crm"
  | "clients.notes"
  | "revenue.pos"
  | "revenue.reports"
  | "campaigns.discounts"
  | "campaigns.referral"
  | "staff.multi"
  | "export.csv";

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  createdAt: string;
  plan: PlanId;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  stripeSubscriptionStatus?: string;
  currentPeriodEnd?: string;
  shopSlug: string;
  shopName: string;
}

export interface BarbershopProfile {
  ownerUid: string;
  slug: string;
  name: string;
  city?: string;
  address?: string;
  phone?: string;
  email?: string;
  services: Service[];
  hours: WeeklyHours;
  slotMinutes: number;
  currency: "EUR";
  updatedAt: string;
}

export interface Service {
  id: string;
  name: string;
  durationMin: number;
  priceEur: number;
  color?: string;
  active: boolean;
}

export interface DayHours {
  open: boolean;
  from: string; // "09:00"
  to: string;   // "19:00"
}

export type WeeklyHours = {
  mon: DayHours;
  tue: DayHours;
  wed: DayHours;
  thu: DayHours;
  fri: DayHours;
  sat: DayHours;
  sun: DayHours;
};

export interface Client {
  id: string;
  firstName: string;
  lastName?: string;
  phone?: string;
  email?: string;
  notes?: string;
  tags: string[];
  totalVisits: number;
  totalSpentEur: number;
  lastVisitAt?: string;
  referralCode: string;
  referredByClientId?: string;
  createdAt: string;
}

export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled" | "no_show";

export interface Booking {
  id: string;
  clientId?: string;
  clientName: string;
  clientPhone?: string;
  clientEmail?: string;
  serviceId: string;
  serviceName: string;
  priceEur: number;
  durationMin: number;
  startAt: string;
  endAt: string;
  status: BookingStatus;
  note?: string;
  source: "public" | "manual";
  createdAt: string;
}

export type PaymentMethod = "cash" | "card" | "transfer" | "other";

export interface Revenue {
  id: string;
  bookingId?: string;
  clientId?: string;
  clientName?: string;
  serviceName?: string;
  amountEur: number;
  tipEur: number;
  method: PaymentMethod;
  discountCodeId?: string;
  discountAmountEur: number;
  createdAt: string;
  note?: string;
}

export type CampaignKind = "discount" | "referral";

export interface Campaign {
  id: string;
  kind: CampaignKind;
  name: string;
  code?: string;
  percentOff?: number;
  amountOffEur?: number;
  referralRewardEur?: number;
  minSpendEur?: number;
  active: boolean;
  validFrom?: string;
  validTo?: string;
  usageCount: number;
  createdAt: string;
}

export interface DashboardSummary {
  todayRevenueEur: number;
  todayBookings: number;
  weekRevenueEur: number;
  monthRevenueEur: number;
  clientsCount: number;
  upcomingCount: number;
  topServices: { serviceName: string; count: number; revenueEur: number }[];
  last7Days: { date: string; revenueEur: number; bookings: number }[];
}
