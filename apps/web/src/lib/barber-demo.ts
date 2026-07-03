import type {
  BarberAppointment,
  BarberCampaign,
  BarberClient,
  BarberDashboardSnapshot,
  BarberPayment,
  BarberService,
  BarberSubscriptionPlan,
  CreateBarberAppointmentInput,
} from "@deal-desk/types";

const DEMO_ORG_ID = "barber-demo-org";
const now = new Date();

function isoAtDay(hour: number, minute: number, offsetDays = 0) {
  const date = new Date(now);
  date.setDate(date.getDate() + offsetDays);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
}

export const barberDemoStore = {
  orgId: DEMO_ORG_ID,
  salonName: "Atelier Barber Suite",
};

const services: BarberService[] = [
  {
    id: "svc_signature_cut",
    name: "Signature Fade",
    category: "cut",
    duration_minutes: 45,
    price: 32,
    featured: true,
  },
  {
    id: "svc_beard_ritual",
    name: "Beard Ritual",
    category: "beard",
    duration_minutes: 25,
    price: 18,
  },
  {
    id: "svc_combo_club",
    name: "Cut + Beard Club",
    category: "combo",
    duration_minutes: 60,
    price: 44,
    featured: true,
  },
  {
    id: "svc_premium_steam",
    name: "Premium Steam Experience",
    category: "premium",
    duration_minutes: 75,
    price: 68,
    featured: true,
  },
  {
    id: "svc_color_refresh",
    name: "Color Refresh",
    category: "color",
    duration_minutes: 40,
    price: 35,
  },
];

let clients: BarberClient[] = [
  {
    id: "client-001",
    organization_id: DEMO_ORG_ID,
    full_name: "Luca Moretti",
    phone: "+39 340 555 1234",
    email: "luca@atelier-demo.it",
    tags: ["VIP", "Taglio settimanale"],
    total_visits: 19,
    total_spent: 836,
    last_visit_at: isoAtDay(11, 0, -7),
    preferred_barber: "Marco",
    preferences: ["Skin fade", "No attesa", "Promemoria WhatsApp"],
    referral_code: "LUCA10",
    referred_by_client_id: null,
    consent_marketing: true,
    notes: "Preferisce gli slot del mattino.",
    created_at: isoAtDay(9, 30, -180),
  },
  {
    id: "client-002",
    organization_id: DEMO_ORG_ID,
    full_name: "Gabriele Serra",
    phone: "+39 392 110 2200",
    email: "gabrieleserra@example.com",
    tags: ["Barba", "Pro"],
    total_visits: 11,
    total_spent: 472,
    last_visit_at: isoAtDay(16, 30, -14),
    preferred_barber: "Tony",
    preferences: ["Barba definita", "Pagamento carta"],
    referral_code: "GABRY15",
    referred_by_client_id: "client-001",
    consent_marketing: true,
    notes: null,
    created_at: isoAtDay(14, 0, -120),
  },
  {
    id: "client-003",
    organization_id: DEMO_ORG_ID,
    full_name: "Davide Rinaldi",
    phone: "+39 327 900 7788",
    email: null,
    tags: ["Nuovo", "Instagram"],
    total_visits: 3,
    total_spent: 114,
    last_visit_at: isoAtDay(18, 0, -3),
    preferred_barber: "Marco",
    preferences: ["Low fade"],
    referral_code: "DAVI5",
    referred_by_client_id: null,
    consent_marketing: false,
    notes: "Primo upsell su combo premium.",
    created_at: isoAtDay(12, 0, -25),
  },
  {
    id: "client-004",
    organization_id: DEMO_ORG_ID,
    full_name: "Alessio Villa",
    phone: "+39 333 780 4411",
    email: "alessio.villa@example.com",
    tags: ["Referral", "Combo"],
    total_visits: 7,
    total_spent: 298,
    last_visit_at: isoAtDay(15, 30, -1),
    preferred_barber: "Tony",
    preferences: ["Combo taglio e barba"],
    referral_code: "ALEX7",
    referred_by_client_id: "client-002",
    consent_marketing: true,
    notes: null,
    created_at: isoAtDay(10, 0, -60),
  },
];

let appointments: BarberAppointment[] = [
  {
    id: "appt-001",
    organization_id: DEMO_ORG_ID,
    client_id: "client-001",
    service_ids: ["svc_signature_cut"],
    barber_name: "Marco",
    starts_at: isoAtDay(9, 30),
    duration_minutes: 45,
    status: "completed",
    total_price: 32,
    channel: "app",
    notes: "Cliente fedele.",
    referral_code_used: null,
    created_at: isoAtDay(8, 0, -2),
  },
  {
    id: "appt-002",
    organization_id: DEMO_ORG_ID,
    client_id: "client-002",
    service_ids: ["svc_combo_club"],
    barber_name: "Tony",
    starts_at: isoAtDay(11, 15),
    duration_minutes: 60,
    status: "confirmed",
    total_price: 44,
    channel: "instagram",
    notes: null,
    referral_code_used: "LUCA10",
    created_at: isoAtDay(21, 15, -1),
  },
  {
    id: "appt-003",
    organization_id: DEMO_ORG_ID,
    client_id: "client-004",
    service_ids: ["svc_premium_steam"],
    barber_name: "Marco",
    starts_at: isoAtDay(14, 30),
    duration_minutes: 75,
    status: "pending",
    total_price: 68,
    channel: "phone",
    notes: "Vuole attenzione a cute sensibile.",
    referral_code_used: "GABRY15",
    created_at: isoAtDay(18, 45, -1),
  },
  {
    id: "appt-004",
    organization_id: DEMO_ORG_ID,
    client_id: "client-003",
    service_ids: ["svc_beard_ritual", "svc_color_refresh"],
    barber_name: "Tony",
    starts_at: isoAtDay(17, 0),
    duration_minutes: 65,
    status: "confirmed",
    total_price: 53,
    channel: "walk_in",
    notes: null,
    referral_code_used: null,
    created_at: isoAtDay(16, 20, -2),
  },
  {
    id: "appt-005",
    organization_id: DEMO_ORG_ID,
    client_id: "client-001",
    service_ids: ["svc_combo_club"],
    barber_name: "Marco",
    starts_at: isoAtDay(10, 0, 1),
    duration_minutes: 60,
    status: "confirmed",
    total_price: 44,
    channel: "app",
    notes: null,
    referral_code_used: null,
    created_at: isoAtDay(11, 0, -1),
  },
];

const payments: BarberPayment[] = [
  {
    id: "pay-001",
    organization_id: DEMO_ORG_ID,
    appointment_id: "appt-001",
    client_id: "client-001",
    amount: 32,
    method: "card",
    created_at: isoAtDay(10, 30),
  },
  {
    id: "pay-002",
    organization_id: DEMO_ORG_ID,
    appointment_id: "appt-prev-001",
    client_id: "client-004",
    amount: 44,
    method: "cash",
    created_at: isoAtDay(15, 45, -1),
  },
  {
    id: "pay-003",
    organization_id: DEMO_ORG_ID,
    appointment_id: "appt-prev-002",
    client_id: "client-002",
    amount: 68,
    method: "card",
    created_at: isoAtDay(13, 0, -2),
  },
  {
    id: "pay-004",
    organization_id: DEMO_ORG_ID,
    appointment_id: "appt-prev-003",
    client_id: "client-001",
    amount: 32,
    method: "online",
    created_at: isoAtDay(12, 15, -6),
  },
];

const campaigns: BarberCampaign[] = [
  {
    id: "camp-001",
    organization_id: DEMO_ORG_ID,
    name: "Porta un amico",
    type: "referral",
    description: "Entrambi ricevono un upgrade barba o 10% sul combo premium.",
    reward: "10% combo premium",
    status: "active",
    conversions: 18,
    revenue_generated: 792,
  },
  {
    id: "camp-002",
    organization_id: DEMO_ORG_ID,
    name: "Ritorno 21 giorni",
    type: "reactivation",
    description: "Promo automatica per clienti inattivi da oltre 21 giorni.",
    reward: "Beard ritual incluso",
    status: "active",
    conversions: 9,
    revenue_generated: 318,
  },
  {
    id: "camp-003",
    organization_id: DEMO_ORG_ID,
    name: "Monday Fill Rate",
    type: "discount",
    description: "Sconto soft per riempire gli slot lenti del lunedi.",
    reward: "8% fascia 10-13",
    status: "draft",
    conversions: 0,
    revenue_generated: 0,
  },
];

const plans: BarberSubscriptionPlan[] = [
  {
    id: "starter",
    name: "Starter",
    monthly_price: 39,
    yearly_price: 390,
    description: "Per barber singolo che vuole agenda, clienti e incassi in ordine.",
    features: [
      "Agenda smart con reminder",
      "CRM clienti con storico visite",
      "Incassi giornalieri e ticket medio",
      "Landing prenotazioni integrata",
    ],
    cta: "Parti subito",
  },
  {
    id: "pro",
    name: "Pro",
    monthly_price: 89,
    yearly_price: 890,
    description: "Per saloni che vogliono retention, referral e automazioni.",
    features: [
      "Tutto Starter",
      "Campagne sconto automatiche",
      "Porta un amico con tracking",
      "Report margine e ritorno clienti",
      "Multi operatore",
    ],
    cta: "Sblocca Pro",
  },
  {
    id: "multi_store",
    name: "Multi-store",
    monthly_price: 179,
    yearly_price: 1790,
    description: "Per catene o franchising con piu sedi e controllo centralizzato.",
    features: [
      "Tutto Pro",
      "Multi sede e multi cassa",
      "Ruoli team e dashboard owner",
      "Benchmark tra sedi",
      "Supporto onboarding Stripe",
    ],
    cta: "Parla con noi",
  },
];

function startOfToday() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

function endOfToday() {
  const date = new Date();
  date.setHours(23, 59, 59, 999);
  return date;
}

function startOfMonth() {
  const date = new Date();
  date.setDate(1);
  date.setHours(0, 0, 0, 0);
  return date;
}

function normalizePhone(phone: string) {
  return phone.replace(/\s+/g, "").trim();
}

function sumServicePrice(serviceIds: string[]) {
  return serviceIds.reduce((sum, serviceId) => {
    const service = services.find((item) => item.id === serviceId);
    return sum + (service?.price ?? 0);
  }, 0);
}

function sumServiceDuration(serviceIds: string[]) {
  return serviceIds.reduce((sum, serviceId) => {
    const service = services.find((item) => item.id === serviceId);
    return sum + (service?.duration_minutes ?? 0);
  }, 0);
}

export function listBarberServices() {
  return services;
}

export function listBarberClients() {
  return [...clients].sort((a, b) => b.total_spent - a.total_spent);
}

export function getBarberClient(clientId: string) {
  return clients.find((client) => client.id === clientId) ?? null;
}

export function listBarberAppointments() {
  return [...appointments].sort(
    (a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime()
  );
}

export function listBarberPayments() {
  return [...payments].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export function listBarberCampaigns() {
  return campaigns;
}

export function listBarberPlans() {
  return plans;
}

export function createBarberAppointment(input: CreateBarberAppointmentInput) {
  const normalized = normalizePhone(input.phone);
  const existingClient = clients.find(
    (client) => normalizePhone(client.phone) === normalized
  );

  const client =
    existingClient ??
    {
      id: `client-${Date.now()}`,
      organization_id: DEMO_ORG_ID,
      full_name: input.client_name,
      phone: input.phone,
      email: input.email ?? null,
      tags: ["Nuovo lead"],
      total_visits: 0,
      total_spent: 0,
      last_visit_at: null,
      preferred_barber: input.barber_name,
      preferences: [],
      referral_code: `${input.client_name.slice(0, 4).toUpperCase()}${String(Date.now()).slice(-2)}`,
      referred_by_client_id: null,
      consent_marketing: true,
      notes: null,
      created_at: new Date().toISOString(),
    };

  if (!existingClient) {
    clients = [client, ...clients];
  }

  const appointment: BarberAppointment = {
    id: `appt-${Date.now()}`,
    organization_id: DEMO_ORG_ID,
    client_id: client.id,
    service_ids: input.service_ids,
    barber_name: input.barber_name,
    starts_at: input.starts_at,
    duration_minutes: sumServiceDuration(input.service_ids),
    status: "pending",
    total_price: sumServicePrice(input.service_ids),
    channel: input.channel ?? "app",
    notes: input.notes ?? null,
    referral_code_used: input.referral_code ?? null,
    created_at: new Date().toISOString(),
  };

  appointments = [...appointments, appointment];
  return { appointment, client };
}

export function getBarberDashboardSnapshot(): BarberDashboardSnapshot {
  const today = startOfToday();
  const todayEnd = endOfToday();
  const month = startOfMonth();
  const todayAppointments = appointments.filter(
    (item) => new Date(item.starts_at) >= today && new Date(item.starts_at) <= todayEnd
  );
  const todayPayments = payments.filter(
    (item) => new Date(item.created_at) >= today && new Date(item.created_at) <= todayEnd
  );
  const monthPayments = payments.filter((item) => new Date(item.created_at) >= month);
  const completedAppointments = appointments.filter((item) => item.status === "completed");
  const occupiedMinutes = todayAppointments.reduce(
    (sum, item) =>
      sum +
      (item.status === "no_show" ? 0 : item.duration_minutes),
    0
  );
  const repeatClients = clients.filter((item) => item.total_visits >= 2).length;
  const referralRevenue = monthPayments
    .filter((payment) => {
      const appointment = appointments.find((item) => item.id === payment.appointment_id);
      return Boolean(appointment?.referral_code_used);
    })
    .reduce((sum, payment) => sum + payment.amount, 0);

  return {
    revenue_today: todayPayments.reduce((sum, payment) => sum + payment.amount, 0),
    revenue_month: monthPayments.reduce((sum, payment) => sum + payment.amount, 0),
    appointments_today: todayAppointments.length,
    occupancy_rate: occupiedMinutes / (8 * 60 * 2),
    repeat_rate: clients.length > 0 ? repeatClients / clients.length : 0,
    average_ticket:
      completedAppointments.length > 0
        ? completedAppointments.reduce((sum, item) => sum + item.total_price, 0) /
          completedAppointments.length
        : 0,
    new_clients_month: clients.filter((item) => new Date(item.created_at) >= month).length,
    referral_revenue_month: referralRevenue,
  };
}
