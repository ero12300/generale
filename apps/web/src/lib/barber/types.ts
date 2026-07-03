export type BookingStatus = "new" | "confirmed" | "completed" | "cancelled";
export type SubscriptionTier = "basic" | "pro";
export type CampaignType = "discount" | "referral";

export interface BarberBooking {
  id: string;
  clientName: string;
  clientPhone: string;
  serviceName: string;
  startsAtIso: string;
  status: BookingStatus;
  source: "internal" | "public";
}

export interface BarberClient {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  visits: number;
  lastVisitIso: string | null;
  referredByClientId: string | null;
  notes: string;
}

export interface BarberPayment {
  id: string;
  amountCents: number;
  method: "cash" | "card" | "bank_transfer";
  createdAtIso: string;
  bookingId: string | null;
  note: string;
}

export interface BarberCampaign {
  id: string;
  title: string;
  type: CampaignType;
  incentiveText: string;
  active: boolean;
  createdAtIso: string;
}

export interface BarberDataState {
  bookings: BarberBooking[];
  clients: BarberClient[];
  payments: BarberPayment[];
  campaigns: BarberCampaign[];
  subscriptionTier: SubscriptionTier;
}
