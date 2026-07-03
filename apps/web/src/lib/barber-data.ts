import type {
  BarberBooking,
  BarberCampaign,
  BarberClient,
  BarberService,
  BarberStaffMember,
  BarberSubscriptionPlan,
  BarberTransaction,
} from "@deal-desk/types";
import { isFirebaseConfigured } from "@/lib/firebase/config";
import { isStripeConfigured } from "@/lib/stripe/config";

const organizationId = "barber-org-demo";

function isoTodayAt(hours: number, minutes: number) {
  const value = new Date();
  value.setHours(hours, minutes, 0, 0);
  return value.toISOString();
}

export const barberStudio = {
  name: "Atelier Fade",
  city: "Milano",
  positioning: "Premium grooming studio per clienti high-value",
  monthlySubscriptionTarget: 249,
};

export const barberServices: BarberService[] = [
  {
    id: "service-signature-fade",
    name: "Signature Fade",
    category: "Taglio",
    duration_minutes: 45,
    price: 38,
    premium: false,
  },
  {
    id: "service-beard-ritual",
    name: "Beard Ritual",
    category: "Barba",
    duration_minutes: 25,
    price: 24,
    premium: false,
  },
  {
    id: "service-executive-package",
    name: "Executive Package",
    category: "Bundle",
    duration_minutes: 75,
    price: 68,
    premium: true,
  },
  {
    id: "service-skin-fade-color",
    name: "Skin Fade + Styling",
    category: "Premium",
    duration_minutes: 60,
    price: 54,
    premium: true,
  },
];

export const barberStaff: BarberStaffMember[] = [
  {
    id: "staff-marco",
    name: "Marco",
    role: "Founder Barber",
    utilization_rate: 0.92,
    rating: 4.9,
  },
  {
    id: "staff-luca",
    name: "Luca",
    role: "Senior Barber",
    utilization_rate: 0.87,
    rating: 4.8,
  },
  {
    id: "staff-giada",
    name: "Giada",
    role: "Front Desk & Retention",
    utilization_rate: 0.74,
    rating: 4.7,
  },
];

export const barberBookings: BarberBooking[] = [
  {
    id: "booking-001",
    organization_id: organizationId,
    client_name: "Alessandro R.",
    service_id: "service-executive-package",
    staff_id: "staff-marco",
    start_at: isoTodayAt(9, 30),
    end_at: isoTodayAt(10, 45),
    channel: "app",
    status: "confirmed",
    amount: 68,
    notes: "Cliente VIP, preferisce finish matte",
  },
  {
    id: "booking-002",
    organization_id: organizationId,
    client_name: "Davide T.",
    service_id: "service-signature-fade",
    staff_id: "staff-luca",
    start_at: isoTodayAt(11, 0),
    end_at: isoTodayAt(11, 45),
    channel: "instagram",
    status: "checked_in",
    amount: 38,
    notes: null,
  },
  {
    id: "booking-003",
    organization_id: organizationId,
    client_name: "Federico B.",
    service_id: "service-beard-ritual",
    staff_id: "staff-luca",
    start_at: isoTodayAt(13, 0),
    end_at: isoTodayAt(13, 25),
    channel: "whatsapp",
    status: "pending",
    amount: 24,
    notes: "Prima visita",
  },
  {
    id: "booking-004",
    organization_id: organizationId,
    client_name: "Nicolò M.",
    service_id: "service-skin-fade-color",
    staff_id: "staff-marco",
    start_at: isoTodayAt(17, 30),
    end_at: isoTodayAt(18, 30),
    channel: "app",
    status: "confirmed",
    amount: 54,
    notes: "Prenotato con referral code",
  },
];

export const barberClients: BarberClient[] = [
  {
    id: "client-001",
    organization_id: organizationId,
    full_name: "Alessandro Rinaldi",
    phone: "+39 333 100 1001",
    preferred_service: "Executive Package",
    last_visit_at: isoTodayAt(9, 30),
    total_spent: 1240,
    visit_count: 22,
    loyalty_points: 190,
    referred_friends: 3,
    tags: ["vip", "business", "recurring"],
  },
  {
    id: "client-002",
    organization_id: organizationId,
    full_name: "Davide Testa",
    phone: "+39 333 100 1002",
    preferred_service: "Signature Fade",
    last_visit_at: isoTodayAt(11, 0),
    total_spent: 460,
    visit_count: 11,
    loyalty_points: 80,
    referred_friends: 1,
    tags: ["upsell-products", "instagram"],
  },
  {
    id: "client-003",
    organization_id: organizationId,
    full_name: "Federico Bassi",
    phone: "+39 333 100 1003",
    preferred_service: "Beard Ritual",
    last_visit_at: isoTodayAt(13, 0),
    total_spent: 120,
    visit_count: 4,
    loyalty_points: 35,
    referred_friends: 0,
    tags: ["new-client", "promo-eligible"],
  },
  {
    id: "client-004",
    organization_id: organizationId,
    full_name: "Nicolò Moretti",
    phone: "+39 333 100 1004",
    preferred_service: "Skin Fade + Styling",
    last_visit_at: isoTodayAt(17, 30),
    total_spent: 820,
    visit_count: 16,
    loyalty_points: 125,
    referred_friends: 2,
    tags: ["referral", "premium"],
  },
];

export const barberTransactions: BarberTransaction[] = [
  {
    id: "txn-001",
    organization_id: organizationId,
    booking_id: "booking-001",
    label: "Executive Package",
    amount: 68,
    paid_at: isoTodayAt(10, 45),
    method: "card",
    category: "service",
  },
  {
    id: "txn-002",
    organization_id: organizationId,
    booking_id: "booking-002",
    label: "Signature Fade",
    amount: 38,
    paid_at: isoTodayAt(11, 45),
    method: "cash",
    category: "service",
  },
  {
    id: "txn-003",
    organization_id: organizationId,
    booking_id: null,
    label: "Pomade Premium",
    amount: 22,
    paid_at: isoTodayAt(12, 0),
    method: "card",
    category: "product",
  },
  {
    id: "txn-004",
    organization_id: organizationId,
    booking_id: null,
    label: "Abbonamento SaaS Pro",
    amount: 249,
    paid_at: isoTodayAt(8, 30),
    method: "stripe",
    category: "subscription",
  },
];

export const barberCampaigns: BarberCampaign[] = [
  {
    id: "campaign-001",
    organization_id: organizationId,
    title: "Porta un amico",
    offer: "Entrambi ricevono 10 EUR di credito",
    audience: "Clienti VIP e recurring",
    channel: "referral",
    status: "active",
    redemption_rate: 0.31,
    revenue_generated: 1280,
  },
  {
    id: "campaign-002",
    organization_id: organizationId,
    title: "Riattiva clienti dormienti",
    offer: "Taglio + barba -15%",
    audience: "Clienti assenti da oltre 45 giorni",
    channel: "whatsapp",
    status: "scheduled",
    redemption_rate: 0.18,
    revenue_generated: 640,
  },
  {
    id: "campaign-003",
    organization_id: organizationId,
    title: "Upgrade al pacchetto Executive",
    offer: "Upsell premium su taglio base",
    audience: "Clienti business",
    channel: "email",
    status: "active",
    redemption_rate: 0.27,
    revenue_generated: 940,
  },
];

export const barberPlans: BarberSubscriptionPlan[] = [
  {
    id: "plan-starter",
    tier: "starter",
    monthly_price: 39,
    yearly_price: 390,
    seats: "1 barber",
    booking_fee_percent: 2.4,
    features: ["Agenda online", "Schede clienti", "Incassi base", "Booking link"],
    recommended: false,
  },
  {
    id: "plan-pro",
    tier: "pro",
    monthly_price: 89,
    yearly_price: 890,
    seats: "Team fino a 4",
    booking_fee_percent: 1.1,
    features: ["CRM avanzato", "Referral", "Campagne sconto", "Analytics premium"],
    recommended: true,
  },
  {
    id: "plan-elite",
    tier: "elite",
    monthly_price: 179,
    yearly_price: 1790,
    seats: "Multi-store",
    booking_fee_percent: 0.7,
    features: ["White-label", "API", "Manager multi-sede", "Stripe Connect roadmap"],
    recommended: false,
  },
];

export const platformReadiness = {
  firebaseConfigured: isFirebaseConfigured(),
  stripeConfigured: isStripeConfigured(),
  deployment: "Vercel",
};

export function getServiceById(serviceId: string) {
  return barberServices.find((service) => service.id === serviceId);
}

export function getStaffById(staffId: string) {
  return barberStaff.find((member) => member.id === staffId);
}

export function getTodayRevenue() {
  return barberTransactions.reduce((total, item) => total + item.amount, 0);
}

export function getBookingsTodayCount() {
  return barberBookings.length;
}

export function getAverageTicket() {
  return Math.round(getTodayRevenue() / barberTransactions.length);
}

export function getReferralRevenue() {
  return barberCampaigns
    .filter((campaign) => campaign.channel === "referral")
    .reduce((total, campaign) => total + campaign.revenue_generated, 0);
}
