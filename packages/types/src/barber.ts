export type BarberBookingStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "no_show";

export type BarberBookingSource = "online" | "walk_in" | "phone" | "instagram";

export type BarberPaymentMethod = "cash" | "card" | "online" | "bank_transfer";

export type BarberPaymentStatus = "pending" | "paid" | "refunded";

export type BarberCampaignChannel = "sms" | "email" | "whatsapp" | "in_app";

export type BarberCampaignDiscountType = "percent" | "fixed";

export type BarberCampaignStatus = "draft" | "active" | "completed";

export type BarberPlan = "basic" | "pro";

export interface BarberService {
  id: string;
  organization_id: string;
  name: string;
  duration_minutes: number;
  price_amount: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BarberClient {
  id: string;
  organization_id: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  notes: string | null;
  total_visits: number;
  referral_code: string;
  referred_by_client_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface BarberBooking {
  id: string;
  organization_id: string;
  client_id: string;
  service_id: string;
  barber_name: string | null;
  starts_at: string;
  ends_at: string;
  status: BarberBookingStatus;
  source: BarberBookingSource;
  notes: string | null;
  price_amount: number;
  deposit_amount: number;
  created_at: string;
  updated_at: string;
}

export interface BarberPayment {
  id: string;
  organization_id: string;
  booking_id: string | null;
  client_id: string | null;
  amount: number;
  method: BarberPaymentMethod;
  status: BarberPaymentStatus;
  paid_at: string;
  stripe_payment_intent_id: string | null;
  created_at: string;
}

export interface BarberCampaign {
  id: string;
  organization_id: string;
  name: string;
  channel: BarberCampaignChannel;
  discount_type: BarberCampaignDiscountType;
  discount_value: number;
  referral_bonus: number;
  message: string | null;
  starts_at: string;
  ends_at: string;
  status: BarberCampaignStatus;
  audience: string;
  created_at: string;
  updated_at: string;
}

export interface BarberSubscription {
  organization_id: string;
  plan: BarberPlan;
  status: "trialing" | "active" | "past_due" | "cancelled";
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  trial_ends_at: string | null;
  updated_at: string;
}

export interface BarberDashboardOverview {
  todayBookings: number;
  confirmedBookings: number;
  weekRevenue: number;
  activeClients: number;
  activeCampaigns: number;
  noShowRate: number;
  topServiceName: string | null;
  subscriptionPlan: BarberPlan;
}

export interface CreateBarberClientInput {
  full_name: string;
  phone?: string | null;
  email?: string | null;
  notes?: string | null;
}

export interface CreateBarberBookingInput {
  client_id: string;
  service_id: string;
  barber_name?: string | null;
  starts_at: string;
  ends_at: string;
  source?: BarberBookingSource;
  notes?: string | null;
  price_amount: number;
  deposit_amount?: number;
}

export interface CreateBarberPaymentInput {
  booking_id?: string | null;
  client_id?: string | null;
  amount: number;
  method: BarberPaymentMethod;
  status?: BarberPaymentStatus;
  paid_at?: string;
  stripe_payment_intent_id?: string | null;
}

export interface CreateBarberCampaignInput {
  name: string;
  channel: BarberCampaignChannel;
  discount_type: BarberCampaignDiscountType;
  discount_value: number;
  referral_bonus?: number;
  message?: string | null;
  starts_at: string;
  ends_at: string;
  audience: string;
}
