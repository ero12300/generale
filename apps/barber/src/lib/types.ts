export type Plan = "base" | "pro";

export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";
export type BookingSource = "interno" | "online";
export type PaymentMethod = "contanti" | "carta" | "altro";
export type CampaignType = "sconto" | "referral";

export interface Service {
  id: string;
  name: string;
  durationMin: number;
  price: number;
  category: string;
}

export interface Staff {
  id: string;
  name: string;
  role: string;
  color: string;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  notes: string | null;
  tags: string[];
  totalVisits: number;
  totalSpent: number;
  loyaltyPoints: number;
  referralCode: string;
  referredBy: string | null;
  createdAt: string;
  lastVisitAt: string | null;
}

export interface Booking {
  id: string;
  clientId: string | null;
  clientName: string;
  clientPhone: string;
  serviceId: string;
  serviceName: string;
  staffId: string | null;
  staffName: string | null;
  start: string;
  durationMin: number;
  price: number;
  status: BookingStatus;
  source: BookingSource;
  notes: string | null;
  createdAt: string;
}

export interface RevenueEntry {
  id: string;
  date: string;
  amount: number;
  method: PaymentMethod;
  serviceName: string | null;
  clientId: string | null;
  bookingId: string | null;
  note: string | null;
  createdAt: string;
}

export interface Campaign {
  id: string;
  name: string;
  type: CampaignType;
  description: string;
  discountPercent: number;
  code: string;
  active: boolean;
  redemptions: number;
  createdAt: string;
}

export interface Organization {
  id: string;
  name: string;
  plan: Plan;
  ownerName: string;
  slug: string;
}

export interface RevenueSummary {
  today: number;
  week: number;
  month: number;
  todayCount: number;
  monthCount: number;
  averageTicket: number;
  byMethod: Record<PaymentMethod, number>;
  last7Days: { date: string; label: string; amount: number }[];
}
