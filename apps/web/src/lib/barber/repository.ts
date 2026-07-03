import {
  createDemoAppointment,
  demoPlans,
  listDemoAppointments,
  listDemoCampaigns,
  listDemoCustomers,
} from "@/lib/barber/demo-store";
import { getFirestoreDb } from "@/lib/barber/firebase-admin";
import {
  BarberAppointment,
  BarberCustomer,
  BarberDashboardData,
  CreateAppointmentInput,
  DiscountCampaign,
} from "@/lib/barber/types";

const BOOKING_COLLECTION = "barber_bookings";
const CUSTOMER_COLLECTION = "barber_customers";
const CAMPAIGN_COLLECTION = "barber_campaigns";

interface BarberRepository {
  getDashboardData(): Promise<BarberDashboardData>;
  listAppointments(): Promise<BarberAppointment[]>;
  createAppointment(input: CreateAppointmentInput): Promise<BarberAppointment>;
}

function mapRevenue(appointments: BarberAppointment[]) {
  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthRevenueCents = appointments
    .filter((entry) => entry.status !== "cancelled" && entry.startsAt.slice(0, 7) === currentMonth)
    .reduce((acc, entry) => acc + entry.priceCents, 0);

  const todayIso = new Date().toISOString().slice(0, 10);
  const todayRevenueCents = appointments
    .filter((entry) => entry.status === "completed" && entry.startsAt.slice(0, 10) === todayIso)
    .reduce((acc, entry) => acc + entry.priceCents, 0);

  const pendingRevenueCents = appointments
    .filter((entry) => entry.status === "confirmed")
    .reduce((acc, entry) => acc + entry.priceCents, 0);

  return {
    monthRevenueCents,
    monthTargetCents: 450000,
    todayRevenueCents,
    pendingRevenueCents,
  };
}

function buildDashboardData(
  appointments: BarberAppointment[],
  customers: BarberCustomer[],
  campaigns: DiscountCampaign[]
): BarberDashboardData {
  const todayIso = new Date().toISOString().slice(0, 10);
  const appointmentsToday = appointments.filter((entry) => entry.startsAt.slice(0, 10) === todayIso);

  return {
    generatedAt: new Date().toISOString(),
    revenue: mapRevenue(appointments),
    appointmentsToday,
    customers: customers.slice(0, 8),
    campaigns,
    plans: demoPlans,
  };
}

const demoRepository: BarberRepository = {
  async getDashboardData() {
    return buildDashboardData(listDemoAppointments(), listDemoCustomers(), listDemoCampaigns());
  },
  async listAppointments() {
    return listDemoAppointments();
  },
  async createAppointment(input) {
    return createDemoAppointment(input);
  },
};

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function asNumber(value: unknown): number {
  return typeof value === "number" ? value : 0;
}

function asAppointment(value: Record<string, unknown>, id: string): BarberAppointment {
  return {
    id,
    customerId: asString(value.customerId),
    customerName: asString(value.customerName),
    serviceName: asString(value.serviceName),
    startsAt: asString(value.startsAt),
    durationMinutes: asNumber(value.durationMinutes),
    priceCents: asNumber(value.priceCents),
    status: (asString(value.status) as BarberAppointment["status"]) || "confirmed",
  };
}

function asCustomer(value: Record<string, unknown>, id: string): BarberCustomer {
  return {
    id,
    fullName: asString(value.fullName),
    phone: asString(value.phone),
    email: asString(value.email),
    lastVisitAt: asString(value.lastVisitAt),
    totalSpentCents: asNumber(value.totalSpentCents),
    referralCode: asString(value.referralCode),
    referredCustomers: asNumber(value.referredCustomers),
  };
}

function asCampaign(value: Record<string, unknown>, id: string): DiscountCampaign {
  return {
    id,
    title: asString(value.title),
    description: asString(value.description),
    discountPercent: asNumber(value.discountPercent),
    active: Boolean(value.active),
  };
}

const firebaseRepository: BarberRepository = {
  async getDashboardData() {
    const db = getFirestoreDb();
    if (!db) return demoRepository.getDashboardData();

    const [appointmentsSnap, customersSnap, campaignsSnap] = await Promise.all([
      db.collection(BOOKING_COLLECTION).get(),
      db.collection(CUSTOMER_COLLECTION).get(),
      db.collection(CAMPAIGN_COLLECTION).get(),
    ]);

    const appointments = appointmentsSnap.docs.map((doc) => asAppointment(doc.data(), doc.id));
    const customers = customersSnap.docs.map((doc) => asCustomer(doc.data(), doc.id));
    const campaigns = campaignsSnap.docs.map((doc) => asCampaign(doc.data(), doc.id));

    if (appointments.length === 0 || customers.length === 0 || campaigns.length === 0) {
      return demoRepository.getDashboardData();
    }

    return buildDashboardData(appointments, customers, campaigns);
  },
  async listAppointments() {
    const db = getFirestoreDb();
    if (!db) return demoRepository.listAppointments();

    const snapshot = await db.collection(BOOKING_COLLECTION).orderBy("startsAt", "asc").get();
    if (snapshot.empty) return demoRepository.listAppointments();

    return snapshot.docs.map((doc) => asAppointment(doc.data(), doc.id));
  },
  async createAppointment(input) {
    const db = getFirestoreDb();
    if (!db) return demoRepository.createAppointment(input);

    const doc = await db.collection(BOOKING_COLLECTION).add({
      customerId: "",
      customerName: input.customerName,
      serviceName: input.serviceName,
      startsAt: input.startsAt,
      durationMinutes: input.durationMinutes,
      priceCents: input.priceCents,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    });

    return {
      id: doc.id,
      customerId: "",
      customerName: input.customerName,
      serviceName: input.serviceName,
      startsAt: input.startsAt,
      durationMinutes: input.durationMinutes,
      priceCents: input.priceCents,
      status: "confirmed",
    };
  },
};

export function getBarberRepository(): BarberRepository {
  return getFirestoreDb() ? firebaseRepository : demoRepository;
}
