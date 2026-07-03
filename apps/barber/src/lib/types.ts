export type PlanTier = "starter" | "pro" | "elite";

export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled" | "no_show";

export type CampaignType = "discount" | "referral" | "loyalty";

export interface Shop {
  id: string;
  slug: string;
  name: string;
  ownerId: string;
  email: string;
  phone?: string;
  address?: string;
  description?: string;
  plan: PlanTier;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  openingHours: OpeningHours;
  createdAt: string;
}

export interface OpeningHours {
  mon: DayHours;
  tue: DayHours;
  wed: DayHours;
  thu: DayHours;
  fri: DayHours;
  sat: DayHours;
  sun: DayHours;
}

export interface DayHours {
  open: string;
  close: string;
  closed?: boolean;
}

export interface Service {
  id: string;
  shopId: string;
  name: string;
  description?: string;
  durationMinutes: number;
  priceCents: number;
  active: boolean;
}

export interface Customer {
  id: string;
  shopId: string;
  name: string;
  email?: string;
  phone: string;
  notes?: string;
  referralCode: string;
  referredBy?: string;
  loyaltyPoints: number;
  totalVisits: number;
  totalSpentCents: number;
  lastVisitAt?: string;
  createdAt: string;
}

export interface Booking {
  id: string;
  shopId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  serviceId: string;
  serviceName: string;
  date: string;
  time: string;
  durationMinutes: number;
  priceCents: number;
  status: BookingStatus;
  notes?: string;
  campaignId?: string;
  discountCents?: number;
  createdAt: string;
}

export interface Transaction {
  id: string;
  shopId: string;
  bookingId?: string;
  customerId?: string;
  customerName: string;
  amountCents: number;
  paymentMethod: "cash" | "card" | "transfer" | "other";
  description: string;
  date: string;
  createdAt: string;
}

export interface Campaign {
  id: string;
  shopId: string;
  name: string;
  type: CampaignType;
  description?: string;
  discountPercent?: number;
  discountCents?: number;
  referralRewardCents?: number;
  minVisits?: number;
  code?: string;
  active: boolean;
  startsAt?: string;
  endsAt?: string;
  usageCount: number;
  createdAt: string;
}

export interface DashboardStats {
  todayRevenueCents: number;
  monthRevenueCents: number;
  todayBookings: number;
  pendingBookings: number;
  totalCustomers: number;
  activeCampaigns: number;
}

export const PLAN_LIMITS: Record<PlanTier, {
  maxCustomers: number;
  campaigns: boolean;
  referral: boolean;
  analytics: boolean;
  multiBarber: boolean;
}> = {
  starter: {
    maxCustomers: 50,
    campaigns: false,
    referral: false,
    analytics: false,
    multiBarber: false,
  },
  pro: {
    maxCustomers: 500,
    campaigns: true,
    referral: true,
    analytics: true,
    multiBarber: false,
  },
  elite: {
    maxCustomers: Infinity,
    campaigns: true,
    referral: true,
    analytics: true,
    multiBarber: true,
  },
};
