import type {
  BarberBooking,
  BarberCampaign,
  BarberClient,
  BarberPayment,
  BarberService,
  BarberSubscription,
} from "@deal-desk/types";

const DEMO_ORG_ID = "demo-org-001";

const services: BarberService[] = [
  {
    id: "srv-1",
    organization_id: DEMO_ORG_ID,
    name: "Taglio Premium",
    duration_minutes: 45,
    price_amount: 32,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "srv-2",
    organization_id: DEMO_ORG_ID,
    name: "Taglio + Barba Luxury",
    duration_minutes: 60,
    price_amount: 48,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

let clients: BarberClient[] = [
  {
    id: "cli-1",
    organization_id: DEMO_ORG_ID,
    full_name: "Marco Rossi",
    phone: "+39 333 1111111",
    email: "marco@example.com",
    notes: "Preferisce pomeriggio.",
    total_visits: 12,
    referral_code: "MARCOROSSI",
    referred_by_client_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "cli-2",
    organization_id: DEMO_ORG_ID,
    full_name: "Luca Bianchi",
    phone: "+39 333 2222222",
    email: null,
    notes: null,
    total_visits: 5,
    referral_code: "LUCABIANCHI",
    referred_by_client_id: "cli-1",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

let bookings: BarberBooking[] = [
  {
    id: "book-1",
    organization_id: DEMO_ORG_ID,
    client_id: "cli-1",
    service_id: "srv-2",
    barber_name: "Eros",
    starts_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    ends_at: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    status: "confirmed",
    source: "online",
    notes: null,
    price_amount: 48,
    deposit_amount: 10,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

let payments: BarberPayment[] = [
  {
    id: "pay-1",
    organization_id: DEMO_ORG_ID,
    booking_id: "book-1",
    client_id: "cli-1",
    amount: 48,
    method: "card",
    status: "paid",
    paid_at: new Date().toISOString(),
    stripe_payment_intent_id: null,
    created_at: new Date().toISOString(),
  },
];

let campaigns: BarberCampaign[] = [
  {
    id: "camp-1",
    organization_id: DEMO_ORG_ID,
    name: "Porta un amico estate",
    channel: "whatsapp",
    discount_type: "percent",
    discount_value: 20,
    referral_bonus: 10,
    message: "Invita un amico e ricevete entrambi -20%",
    starts_at: new Date().toISOString().split("T")[0],
    ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    status: "active",
    audience: "clienti_attivi_30gg",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const subscription: BarberSubscription = {
  organization_id: DEMO_ORG_ID,
  plan: "pro",
  status: "trialing",
  stripe_customer_id: null,
  stripe_subscription_id: null,
  trial_ends_at: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
  updated_at: new Date().toISOString(),
};

export const barberDemoStore = {
  listServices: () => [...services],
  listClients: () => [...clients],
  listBookings: () => [...bookings].sort((a, b) => a.starts_at.localeCompare(b.starts_at)),
  listPayments: () => [...payments].sort((a, b) => b.paid_at.localeCompare(a.paid_at)),
  listCampaigns: () => [...campaigns].sort((a, b) => b.created_at.localeCompare(a.created_at)),
  getSubscription: () => subscription,
  createClient: (client: BarberClient) => {
    clients = [client, ...clients];
    return client;
  },
  createBooking: (booking: BarberBooking) => {
    bookings = [booking, ...bookings];
    return booking;
  },
  updateBookingStatus: (id: string, status: BarberBooking["status"]) => {
    const idx = bookings.findIndex((b) => b.id === id);
    if (idx < 0) return null;
    bookings[idx] = { ...bookings[idx], status, updated_at: new Date().toISOString() };
    return bookings[idx];
  },
  createPayment: (payment: BarberPayment) => {
    payments = [payment, ...payments];
    return payment;
  },
  createCampaign: (campaign: BarberCampaign) => {
    campaigns = [campaign, ...campaigns];
    return campaign;
  },
};
