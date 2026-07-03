/**
 * Tipi di dominio BarberOS.
 * Tutti gli importi monetari sono espressi in centesimi (interi) — mai float.
 */

export type PlanId = "base" | "pro";

export interface Service {
  id: string;
  name: string;
  description: string;
  durationMin: number;
  priceCents: number;
  category: "taglio" | "barba" | "combo" | "trattamento";
  popular?: boolean;
}

export interface Barber {
  id: string;
  name: string;
  role: string;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  notes?: string;
  createdAt: string; // ISO
  referralCode: string;
  referredBy?: string; // referralCode di chi lo ha portato
}

export type AppointmentStatus =
  | "in_attesa"
  | "confermato"
  | "completato"
  | "annullato";

export interface Appointment {
  id: string;
  clientId?: string;
  clientName: string;
  clientPhone: string;
  serviceId: string;
  serviceName: string;
  barberId: string;
  barberName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  durationMin: number;
  priceCents: number;
  discountCents: number;
  discountCode?: string;
  status: AppointmentStatus;
  createdAt: string;
}

export type PaymentMethod = "contanti" | "carta" | "satispay";

export interface Payment {
  id: string;
  appointmentId?: string;
  clientName: string;
  serviceName: string;
  amountCents: number;
  method: PaymentMethod;
  date: string; // YYYY-MM-DD
  createdAt: string;
}

export type CampaignType = "sconto" | "referral";

export interface Campaign {
  id: string;
  type: CampaignType;
  name: string;
  code: string;
  percentOff: number; // 0-100
  active: boolean;
  usageCount: number;
  validUntil?: string; // YYYY-MM-DD
  createdAt: string;
}

export interface ShopSettings {
  shopName: string;
  plan: PlanId;
  /** Riempito quando l'abbonamento è gestito da Stripe */
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  openingHour: number; // es. 9
  closingHour: number; // es. 19
  slotMinutes: number; // es. 30
  closedWeekdays: number[]; // 0=domenica ... 6=sabato
}

export interface DashboardStats {
  todayCents: number;
  weekCents: number;
  monthCents: number;
  monthCount: number;
  avgTicketCents: number;
  todayAppointments: number;
  pendingAppointments: number;
  totalClients: number;
  newClientsMonth: number;
  revenueByDay: { date: string; label: string; amountCents: number }[];
  topServices: { serviceName: string; count: number; amountCents: number }[];
  methodBreakdown: { method: PaymentMethod; amountCents: number }[];
}
