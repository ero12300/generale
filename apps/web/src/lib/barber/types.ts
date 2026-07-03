export type AppointmentStatus = "confirmed" | "completed" | "cancelled";

export type TierName = "basic" | "pro";

export interface BarberAppointment {
  id: string;
  customerId: string;
  customerName: string;
  serviceName: string;
  startsAt: string;
  durationMinutes: number;
  priceCents: number;
  status: AppointmentStatus;
}

export interface BarberCustomer {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  lastVisitAt: string;
  totalSpentCents: number;
  referralCode: string;
  referredCustomers: number;
}

export interface DiscountCampaign {
  id: string;
  title: string;
  description: string;
  discountPercent: number;
  active: boolean;
}

export interface RevenueSnapshot {
  monthRevenueCents: number;
  monthTargetCents: number;
  todayRevenueCents: number;
  pendingRevenueCents: number;
}

export interface SubscriptionPlan {
  tier: TierName;
  name: string;
  monthlyPriceCents: number;
  description: string;
  features: string[];
}

export interface BarberDashboardData {
  generatedAt: string;
  revenue: RevenueSnapshot;
  appointmentsToday: BarberAppointment[];
  customers: BarberCustomer[];
  campaigns: DiscountCampaign[];
  plans: SubscriptionPlan[];
}

export interface CreateAppointmentInput {
  customerName: string;
  serviceName: string;
  startsAt: string;
  durationMinutes: number;
  priceCents: number;
}
