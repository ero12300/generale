export type Plan = "free" | "pro" | "enterprise";

export interface BarberShop {
  id: string;
  name: string;
  ownerId: string;
  address?: string;
  phone?: string;
  email?: string;
  logoUrl?: string;
  plan: Plan;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  subscriptionStatus?: "active" | "canceled" | "past_due" | "trialing";
  trialEndsAt?: string;
  createdAt: string;
  updatedAt: string;
  settings: ShopSettings;
}

export interface ShopSettings {
  currency: string;
  timezone: string;
  bookingSlotMinutes: number;
  workingHours: WorkingHours;
  services: Service[];
  staff: StaffMember[];
  notificationsEmail: boolean;
  referralBonus: number;
  loyaltyPointsPerEuro: number;
}

export interface WorkingHours {
  [day: string]: {
    open: boolean;
    from: string;
    to: string;
  };
}

export interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
  description?: string;
  active: boolean;
}

export interface StaffMember {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  active: boolean;
  services: string[];
}

export interface Client {
  id: string;
  shopId: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  notes?: string;
  loyaltyPoints: number;
  totalVisits: number;
  totalSpent: number;
  lastVisit?: string;
  referredBy?: string;
  referralCode: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled" | "no_show";

export interface Booking {
  id: string;
  shopId: string;
  clientId?: string;
  clientName: string;
  clientPhone?: string;
  clientEmail?: string;
  staffId?: string;
  staffName?: string;
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  serviceDuration: number;
  date: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  notes?: string;
  source: "manual" | "online" | "phone";
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type PaymentMethod = "cash" | "card" | "transfer" | "other";

export interface Transaction {
  id: string;
  shopId: string;
  bookingId?: string;
  clientId?: string;
  clientName?: string;
  staffId?: string;
  staffName?: string;
  description: string;
  amount: number;
  paymentMethod: PaymentMethod;
  services: { name: string; price: number }[];
  products: { name: string; price: number }[];
  discount: number;
  discountCode?: string;
  total: number;
  date: string;
  createdAt: string;
}

export type CampaignType = "discount" | "referral" | "loyalty" | "seasonal";

export interface Campaign {
  id: string;
  shopId: string;
  name: string;
  description?: string;
  type: CampaignType;
  code?: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minPurchase?: number;
  maxUses?: number;
  usedCount: number;
  validFrom: string;
  validTo?: string;
  active: boolean;
  targetClients?: string[];
  createdAt: string;
}

export interface DashboardStats {
  todayRevenue: number;
  todayBookings: number;
  todayNewClients: number;
  monthRevenue: number;
  monthBookings: number;
  monthNewClients: number;
  totalClients: number;
  pendingBookings: number;
}

export interface RevenueData {
  date: string;
  revenue: number;
  bookings: number;
}

export const PLAN_LIMITS = {
  free: {
    maxClients: 50,
    maxBookingsPerMonth: 30,
    campaigns: false,
    reports: "basic",
    staff: 1,
    publicBooking: false,
    smsNotifications: false,
    exportData: false,
  },
  pro: {
    maxClients: -1,
    maxBookingsPerMonth: -1,
    campaigns: true,
    reports: "advanced",
    staff: -1,
    publicBooking: true,
    smsNotifications: true,
    exportData: true,
  },
  enterprise: {
    maxClients: -1,
    maxBookingsPerMonth: -1,
    campaigns: true,
    reports: "advanced",
    staff: -1,
    publicBooking: true,
    smsNotifications: true,
    exportData: true,
  },
} as const;

export const PLAN_PRICES = {
  pro: {
    monthly: 2900,
    yearly: 24900,
    monthlyId: process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID || "",
    yearlyId: process.env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID || "",
  },
} as const;
