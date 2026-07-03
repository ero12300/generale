import {
  BarberAppointment,
  BarberCustomer,
  CreateAppointmentInput,
  DiscountCampaign,
  SubscriptionPlan,
} from "@/lib/barber/types";

const demoCustomers: BarberCustomer[] = [
  {
    id: "cst_001",
    fullName: "Marco Bianchi",
    phone: "+39 333 123 4567",
    email: "marco@barberos.demo",
    lastVisitAt: "2026-07-01T09:30:00.000Z",
    totalSpentCents: 172000,
    referralCode: "MARCO10",
    referredCustomers: 3,
  },
  {
    id: "cst_002",
    fullName: "Luca Rossi",
    phone: "+39 339 222 4488",
    email: "luca@barberos.demo",
    lastVisitAt: "2026-07-02T11:10:00.000Z",
    totalSpentCents: 98000,
    referralCode: "LUCA15",
    referredCustomers: 1,
  },
  {
    id: "cst_003",
    fullName: "Simone Verdi",
    phone: "+39 320 888 9911",
    email: "simone@barberos.demo",
    lastVisitAt: "2026-06-30T17:15:00.000Z",
    totalSpentCents: 121500,
    referralCode: "SIMO5",
    referredCustomers: 2,
  },
];

const demoAppointments: BarberAppointment[] = [
  {
    id: "apt_001",
    customerId: "cst_001",
    customerName: "Marco Bianchi",
    serviceName: "Taglio + Barba Premium",
    startsAt: "2026-07-03T08:30:00.000Z",
    durationMinutes: 50,
    priceCents: 4200,
    status: "completed",
  },
  {
    id: "apt_002",
    customerId: "cst_002",
    customerName: "Luca Rossi",
    serviceName: "Skin Fade",
    startsAt: "2026-07-03T11:00:00.000Z",
    durationMinutes: 45,
    priceCents: 3500,
    status: "confirmed",
  },
  {
    id: "apt_003",
    customerId: "cst_003",
    customerName: "Simone Verdi",
    serviceName: "Taglio Executive",
    startsAt: "2026-07-03T15:30:00.000Z",
    durationMinutes: 40,
    priceCents: 3000,
    status: "confirmed",
  },
];

const demoCampaigns: DiscountCampaign[] = [
  {
    id: "cmp_001",
    title: "Porta un amico",
    description: "15% a te e 15% al cliente invitato sul prossimo servizio.",
    discountPercent: 15,
    active: true,
  },
  {
    id: "cmp_002",
    title: "Happy hour feriale",
    description: "Sconto 10% dal martedi al giovedi tra le 13:00 e le 16:00.",
    discountPercent: 10,
    active: true,
  },
];

export const demoPlans: SubscriptionPlan[] = [
  {
    tier: "basic",
    name: "Basic",
    monthlyPriceCents: 2900,
    description: "Per iniziare con agenda smart e incassi in ordine.",
    features: ["Agenda online", "Anagrafica clienti", "Report incassi mensile"],
  },
  {
    tier: "pro",
    name: "Pro",
    monthlyPriceCents: 7900,
    description: "Per scalare con automazioni marketing e referral.",
    features: [
      "Tutto del piano Basic",
      "Campagne sconto automatiche",
      "Referral porta un amico",
      "Insight avanzati + export",
    ],
  },
];

let inMemoryAppointments = [...demoAppointments];
let inMemoryCustomers = [...demoCustomers];

function createCustomer(customerName: string): BarberCustomer {
  const id = `cst_${Math.random().toString(36).slice(2, 10)}`;
  const newCustomer: BarberCustomer = {
    id,
    fullName: customerName,
    phone: "n/d",
    email: `${id}@barberos.demo`,
    lastVisitAt: new Date().toISOString(),
    totalSpentCents: 0,
    referralCode: customerName.slice(0, 4).toUpperCase().replaceAll(" ", "") || "NEWC",
    referredCustomers: 0,
  };
  inMemoryCustomers = [newCustomer, ...inMemoryCustomers];
  return newCustomer;
}

export function listDemoAppointments(): BarberAppointment[] {
  return [...inMemoryAppointments].sort((a, b) => a.startsAt.localeCompare(b.startsAt));
}

export function listDemoCustomers(): BarberCustomer[] {
  return [...inMemoryCustomers];
}

export function listDemoCampaigns(): DiscountCampaign[] {
  return [...demoCampaigns];
}

export function createDemoAppointment(input: CreateAppointmentInput): BarberAppointment {
  let customer = inMemoryCustomers.find((entry) => entry.fullName.toLowerCase() === input.customerName.toLowerCase());

  if (!customer) {
    customer = createCustomer(input.customerName);
  }

  const appointment: BarberAppointment = {
    id: `apt_${Math.random().toString(36).slice(2, 10)}`,
    customerId: customer.id,
    customerName: customer.fullName,
    serviceName: input.serviceName,
    startsAt: input.startsAt,
    durationMinutes: input.durationMinutes,
    priceCents: input.priceCents,
    status: "confirmed",
  };

  inMemoryAppointments = [appointment, ...inMemoryAppointments];

  return appointment;
}
