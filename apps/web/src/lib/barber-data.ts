import { formatCurrency } from "@/lib/utils";

export type AppointmentStatus = "confirmed" | "checked-in" | "completed" | "no-show";
export type CampaignStatus = "active" | "scheduled" | "draft";
export type PlanTier = "basic" | "pro" | "elite";

export interface BarberService {
  id: string;
  name: string;
  durationMinutes: number;
  priceCents: number;
  popular?: boolean;
}

export interface BarberStaff {
  id: string;
  name: string;
  role: string;
  rating: number;
  nextSlot: string;
}

export interface BarberCustomer {
  id: string;
  name: string;
  phone: string;
  email: string;
  visits: number;
  lifetimeValueCents: number;
  lastVisit: string;
  tags: string[];
  referralCode: string;
}

export interface BarberAppointment {
  id: string;
  time: string;
  endTime: string;
  customerId: string;
  serviceId: string;
  staffId: string;
  status: AppointmentStatus;
  notes?: string;
}

export interface BarberPayment {
  id: string;
  customerId: string;
  serviceId: string;
  amountCents: number;
  tipCents: number;
  method: "card" | "cash" | "subscription";
  status: "paid" | "pending";
  paidAt: string;
}

export interface BarberCampaign {
  id: string;
  name: string;
  status: CampaignStatus;
  audience: string;
  offer: string;
  conversionRate: number;
  revenueCents: number;
}

export interface SaasPlan {
  id: PlanTier;
  name: string;
  priceCents: number;
  tagline: string;
  features: string[];
  highlighted?: boolean;
}

export const barberShop = {
  name: "Royal Fade Club",
  city: "Milano",
  rating: 4.9,
  bookingsThisMonth: 386,
  repeatRate: 0.72,
  subscriptionMrrCents: 289000,
};

export const services: BarberService[] = [
  { id: "cut", name: "Taglio premium", durationMinutes: 35, priceCents: 3500, popular: true },
  { id: "beard", name: "Barba ritual hot towel", durationMinutes: 25, priceCents: 2500 },
  { id: "combo", name: "Taglio + barba signature", durationMinutes: 60, priceCents: 5500, popular: true },
  { id: "color", name: "Color refresh uomo", durationMinutes: 45, priceCents: 4500 },
];

export const staff: BarberStaff[] = [
  { id: "marco", name: "Marco", role: "Master barber", rating: 4.98, nextSlot: "15:30" },
  { id: "leo", name: "Leo", role: "Fade specialist", rating: 4.92, nextSlot: "16:00" },
  { id: "amir", name: "Amir", role: "Beard artist", rating: 4.95, nextSlot: "17:15" },
];

export const customers: BarberCustomer[] = [
  {
    id: "c1",
    name: "Luca Bianchi",
    phone: "+39 333 118 7740",
    email: "luca@example.com",
    visits: 18,
    lifetimeValueCents: 83000,
    lastVisit: "Oggi",
    tags: ["VIP", "Abbonato Pro"],
    referralCode: "LUCA10",
  },
  {
    id: "c2",
    name: "Andrea Rossi",
    phone: "+39 340 912 5581",
    email: "andrea@example.com",
    visits: 7,
    lifetimeValueCents: 29500,
    lastVisit: "Ieri",
    tags: ["Referral"],
    referralCode: "ANDREA10",
  },
  {
    id: "c3",
    name: "Simone Verdi",
    phone: "+39 347 554 9021",
    email: "simone@example.com",
    visits: 3,
    lifetimeValueCents: 12200,
    lastVisit: "5 giorni fa",
    tags: ["Nuovo cliente"],
    referralCode: "SIMONE10",
  },
  {
    id: "c4",
    name: "Davide Neri",
    phone: "+39 392 414 7100",
    email: "davide@example.com",
    visits: 11,
    lifetimeValueCents: 52000,
    lastVisit: "1 settimana fa",
    tags: ["Barba"],
    referralCode: "DAVIDE10",
  },
];

export const appointments: BarberAppointment[] = [
  {
    id: "a1",
    time: "09:30",
    endTime: "10:05",
    customerId: "c1",
    serviceId: "cut",
    staffId: "marco",
    status: "completed",
    notes: "Preferisce sfumatura bassa e finish matte.",
  },
  {
    id: "a2",
    time: "10:15",
    endTime: "11:15",
    customerId: "c2",
    serviceId: "combo",
    staffId: "leo",
    status: "checked-in",
  },
  {
    id: "a3",
    time: "12:00",
    endTime: "12:25",
    customerId: "c4",
    serviceId: "beard",
    staffId: "amir",
    status: "confirmed",
  },
  {
    id: "a4",
    time: "15:30",
    endTime: "16:30",
    customerId: "c3",
    serviceId: "combo",
    staffId: "marco",
    status: "confirmed",
    notes: "Arriva da campagna porta un amico.",
  },
];

export const payments: BarberPayment[] = [
  {
    id: "p1",
    customerId: "c1",
    serviceId: "cut",
    amountCents: 3500,
    tipCents: 500,
    method: "card",
    status: "paid",
    paidAt: "09:58",
  },
  {
    id: "p2",
    customerId: "c2",
    serviceId: "combo",
    amountCents: 5500,
    tipCents: 0,
    method: "subscription",
    status: "pending",
    paidAt: "10:15",
  },
  {
    id: "p3",
    customerId: "c4",
    serviceId: "beard",
    amountCents: 2500,
    tipCents: 300,
    method: "cash",
    status: "paid",
    paidAt: "12:24",
  },
];

export const campaigns: BarberCampaign[] = [
  {
    id: "camp1",
    name: "Porta un amico",
    status: "active",
    audience: "Clienti VIP + abbonati",
    offer: "-10 euro a entrambi dopo il primo taglio",
    conversionRate: 0.18,
    revenueCents: 124000,
  },
  {
    id: "camp2",
    name: "Ritorno entro 21 giorni",
    status: "active",
    audience: "Clienti taglio premium",
    offer: "-15% sul refill barba",
    conversionRate: 0.24,
    revenueCents: 86000,
  },
  {
    id: "camp3",
    name: "Black card founder",
    status: "scheduled",
    audience: "Top 50 clienti per spesa",
    offer: "Abbonamento Elite a prezzo founder",
    conversionRate: 0.12,
    revenueCents: 0,
  },
];

export const saasPlans: SaasPlan[] = [
  {
    id: "basic",
    name: "Basic",
    priceCents: 2900,
    tagline: "Agenda online e CRM essenziale",
    features: ["Prenotazioni illimitate", "Database clienti", "Reminder email", "Dashboard incassi"],
  },
  {
    id: "pro",
    name: "Pro",
    priceCents: 7900,
    tagline: "Automazioni e crescita del salone",
    highlighted: true,
    features: ["Campagne sconti", "Porta un amico", "Stripe Checkout", "Report staff e servizi"],
  },
  {
    id: "elite",
    name: "Elite",
    priceCents: 14900,
    tagline: "Multi-sede e brand premium",
    features: ["Multi barber shop", "Revenue forecasting", "Concierge onboarding", "API e integrazioni"],
  },
];

export function formatCents(cents: number): string {
  return formatCurrency(cents / 100);
}

export function getCustomer(id: string) {
  return customers.find((customer) => customer.id === id);
}

export function getService(id: string) {
  return services.find((service) => service.id === id);
}

export function getStaffMember(id: string) {
  return staff.find((member) => member.id === id);
}

export function getTodayRevenueCents() {
  return payments
    .filter((payment) => payment.status === "paid")
    .reduce((total, payment) => total + payment.amountCents + payment.tipCents, 0);
}

export function getPendingRevenueCents() {
  return payments
    .filter((payment) => payment.status === "pending")
    .reduce((total, payment) => total + payment.amountCents + payment.tipCents, 0);
}
