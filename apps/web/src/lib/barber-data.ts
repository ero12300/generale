import type {
  Appointment,
  ClientProfile,
  ReferralCampaign,
  RevenueSnapshot,
  ServiceMenuItem,
  StudioProfile,
  SubscriptionTier,
} from "@deal-desk/types";

export const barberStudio: StudioProfile = {
  id: "studio-atelier-01",
  name: "Atelier Barber Club",
  city: "Milano",
  plan: "pro",
  seats: 4,
  team_size: 6,
  opening_hours: "Lun-Sab · 09:00-20:00",
  primary_goal: "Massimizzare riempimento agenda e ritorno clienti premium",
};

export const serviceMenu: ServiceMenuItem[] = [
  {
    id: "svc-signature-fade",
    name: "Signature Fade",
    duration_minutes: 45,
    price_cents: 3500,
    category: "haircut",
    description: "Fade premium con consulenza styling e finish finale.",
  },
  {
    id: "svc-beard-ritual",
    name: "Beard Ritual",
    duration_minutes: 30,
    price_cents: 2200,
    category: "beard",
    description: "Rifinitura barba, panno caldo e olio signature.",
  },
  {
    id: "svc-executive-combo",
    name: "Executive Combo",
    duration_minutes: 75,
    price_cents: 5200,
    category: "combo",
    description: "Capelli + barba con check immagine completa.",
  },
  {
    id: "svc-black-mask",
    name: "Black Mask Experience",
    duration_minutes: 25,
    price_cents: 1800,
    category: "premium",
    description: "Upgrade skincare veloce ad alto margine.",
  },
];

export const clients: ClientProfile[] = [
  {
    id: "cli-001",
    full_name: "Luca Rinaldi",
    phone: "+39 347 111 2233",
    email: "luca@atelierdemo.it",
    segment: "vip",
    visits_count: 18,
    lifetime_value_cents: 93600,
    last_visit_at: "2026-07-02T16:30:00.000Z",
    preferred_service_id: "svc-executive-combo",
    referred_by: "Instagram Ads",
    notes: "Preferisce fascia 18:00 e upgrade skincare.",
    consent_marketing: true,
  },
  {
    id: "cli-002",
    full_name: "Davide Serra",
    phone: "+39 348 222 3344",
    email: "davide@atelierdemo.it",
    segment: "loyal",
    visits_count: 10,
    lifetime_value_cents: 41200,
    last_visit_at: "2026-07-01T10:15:00.000Z",
    preferred_service_id: "svc-signature-fade",
    referred_by: "Porta un amico",
    notes: "Ha portato 2 amici nel trimestre.",
    consent_marketing: true,
  },
  {
    id: "cli-003",
    full_name: "Matteo Galli",
    phone: "+39 349 555 8811",
    email: null,
    segment: "new",
    visits_count: 1,
    lifetime_value_cents: 3500,
    last_visit_at: "2026-06-28T14:00:00.000Z",
    preferred_service_id: "svc-signature-fade",
    referred_by: "Google Maps",
    notes: "Prima visita, da invitare a follow-up + recensione.",
    consent_marketing: false,
  },
  {
    id: "cli-004",
    full_name: "Gianluca De Santis",
    phone: "+39 392 888 1112",
    email: "gianluca@atelierdemo.it",
    segment: "inactive",
    visits_count: 6,
    lifetime_value_cents: 18900,
    last_visit_at: "2026-05-01T12:45:00.000Z",
    preferred_service_id: "svc-beard-ritual",
    referred_by: "Passaparola",
    notes: "Dormiente da 63 giorni, da riattivare.",
    consent_marketing: true,
  },
];

export const appointments: Appointment[] = [
  {
    id: "apt-001",
    client_id: "cli-001",
    service_id: "svc-executive-combo",
    barber_name: "Michele",
    starts_at: "2026-07-03T09:15:00.000Z",
    ends_at: "2026-07-03T10:30:00.000Z",
    status: "completed",
    payment_method: "card",
    amount_cents: 5200,
    source: "widget",
  },
  {
    id: "apt-002",
    client_id: "cli-002",
    service_id: "svc-signature-fade",
    barber_name: "Lorenzo",
    starts_at: "2026-07-03T11:00:00.000Z",
    ends_at: "2026-07-03T11:45:00.000Z",
    status: "confirmed",
    payment_method: null,
    amount_cents: 3500,
    source: "instagram",
  },
  {
    id: "apt-003",
    client_id: "cli-003",
    service_id: "svc-black-mask",
    barber_name: "Michele",
    starts_at: "2026-07-03T14:00:00.000Z",
    ends_at: "2026-07-03T14:25:00.000Z",
    status: "pending",
    payment_method: null,
    amount_cents: 1800,
    source: "widget",
  },
  {
    id: "apt-004",
    client_id: "cli-004",
    service_id: "svc-beard-ritual",
    barber_name: "Samuele",
    starts_at: "2026-07-03T18:15:00.000Z",
    ends_at: "2026-07-03T18:45:00.000Z",
    status: "confirmed",
    payment_method: null,
    amount_cents: 2200,
    source: "staff",
  },
];

export const revenueSnapshots: RevenueSnapshot[] = [
  {
    id: "rev-01",
    date: "2026-07-03",
    gross_cents: 28400,
    tips_cents: 3200,
    product_sales_cents: 5900,
    refunds_cents: 0,
    bookings_count: 14,
    occupancy_ratio: 0.86,
  },
  {
    id: "rev-02",
    date: "2026-07-02",
    gross_cents: 26100,
    tips_cents: 2900,
    product_sales_cents: 4300,
    refunds_cents: 0,
    bookings_count: 13,
    occupancy_ratio: 0.81,
  },
  {
    id: "rev-03",
    date: "2026-07-01",
    gross_cents: 24700,
    tips_cents: 2600,
    product_sales_cents: 3800,
    refunds_cents: 1200,
    bookings_count: 12,
    occupancy_ratio: 0.77,
  },
];

export const referralCampaigns: ReferralCampaign[] = [
  {
    id: "cmp-001",
    title: "Porta un amico Gold",
    reward_referrer: "10EUR wallet credit",
    reward_friend: "15% primo taglio",
    channel: "qr",
    status: "active",
    conversions: 17,
    revenue_cents: 49300,
    launch_date: "2026-06-10",
  },
  {
    id: "cmp-002",
    title: "Reactivation 45 giorni",
    reward_referrer: "N/A",
    reward_friend: "Upgrade black mask",
    channel: "whatsapp",
    status: "scheduled",
    conversions: 8,
    revenue_cents: 18800,
    launch_date: "2026-07-05",
  },
  {
    id: "cmp-003",
    title: "VIP Friday",
    reward_referrer: "N/A",
    reward_friend: "Drink + styling finish",
    channel: "sms",
    status: "completed",
    conversions: 11,
    revenue_cents: 33100,
    launch_date: "2026-06-20",
  },
];

export const subscriptionTiers: SubscriptionTier[] = [
  {
    id: "basic",
    name: "Basic",
    monthly_price_cents: 3900,
    yearly_price_cents: 39000,
    target: "Studio singolo che vuole agenda, clienti e incassi ordinati.",
    features: [
      "Agenda online con widget prenotazioni",
      "CRM clienti con note e storico visite",
      "Report giornaliero incassi",
      "1 campagna referral attiva",
    ],
    stripe_price_lookup_key: "barber_basic_monthly",
  },
  {
    id: "pro",
    name: "Pro",
    monthly_price_cents: 9900,
    yearly_price_cents: 99000,
    target: "Barber shop premium con team, upsell e campagne automatiche.",
    features: [
      "Tutto Basic",
      "Automazioni WhatsApp/SMS",
      "No-show protection e depositi",
      "Dashboard marginalita e occupazione",
      "Multi-staff + ruoli",
    ],
    stripe_price_lookup_key: "barber_pro_monthly",
  },
  {
    id: "enterprise",
    name: "Multi-location",
    monthly_price_cents: 24900,
    yearly_price_cents: 249000,
    target: "Catene o format in abbonamento da rivendere ad altri barber.",
    features: [
      "Tutto Pro",
      "Più sedi con reporting consolidato",
      "Billing centralizzato Stripe",
      "White-label e onboarding guidato",
      "API e integrazioni custom",
    ],
    stripe_price_lookup_key: "barber_enterprise_monthly",
  },
];

export function getServiceName(serviceId: string) {
  return serviceMenu.find((service) => service.id === serviceId)?.name ?? "Servizio";
}

export function getClient(clientId: string) {
  return clients.find((client) => client.id === clientId) ?? null;
}

export function getTodaySnapshot() {
  return revenueSnapshots[0];
}

export function getKpis() {
  const today = getTodaySnapshot();
  const activeCampaignRevenue = referralCampaigns
    .filter((campaign) => campaign.status === "active" || campaign.status === "scheduled")
    .reduce((sum, campaign) => sum + campaign.revenue_cents, 0);

  return {
    todayRevenueCents: today.gross_cents + today.product_sales_cents - today.refunds_cents,
    occupancyRatio: today.occupancy_ratio,
    bookingsToday: today.bookings_count,
    repeatClientRatio: 0.72,
    activeCampaignRevenue,
    noShowRiskCount: appointments.filter((item) => item.status === "pending").length,
    marketingReach: clients.filter((client) => client.consent_marketing).length,
  };
}
