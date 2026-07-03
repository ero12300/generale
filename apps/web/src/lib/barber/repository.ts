import type {
  BarberBooking,
  BarberCampaign,
  BarberCustomer,
  BarberDashboardMetrics,
  BarberPlan,
  BarberService,
  CreateBarberBookingInput,
  CreateBarberCustomerInput,
} from "@deal-desk/types";
import type { Firestore } from "firebase-admin/firestore";
import {
  BARBER_DEMO_ORG_ID,
  BARBER_DEMO_ORG_NAME,
  barberPlans,
  demoBookings,
  demoCampaigns,
  demoCustomers,
  demoServices,
} from "@/lib/barber/demo-data";
import { calculateBarberDashboardMetrics } from "@/lib/barber/metrics";
import { getFirebaseAdminDb } from "@/lib/firebase/admin";

interface BarberDemoStore {
  services: BarberService[];
  customers: BarberCustomer[];
  bookings: BarberBooking[];
  campaigns: BarberCampaign[];
}

declare global {
  var __barberDemoStore: BarberDemoStore | undefined;
}

export interface BarberRepository {
  readonly context: {
    mode: "demo" | "firebase";
    organizationId: string;
    organizationName: string;
  };

  listServices(): Promise<BarberService[]>;
  listCustomers(): Promise<BarberCustomer[]>;
  listBookings(): Promise<BarberBooking[]>;
  listCampaigns(): Promise<BarberCampaign[]>;
  listPlans(): Promise<BarberPlan[]>;
  getDashboardMetrics(): Promise<BarberDashboardMetrics>;
  createBooking(input: CreateBarberBookingInput): Promise<BarberBooking>;
  createCustomer(input: CreateBarberCustomerInput): Promise<BarberCustomer>;
}

function getDemoStore() {
  globalThis.__barberDemoStore ??= {
    services: [...demoServices],
    customers: [...demoCustomers],
    bookings: [...demoBookings],
    campaigns: [...demoCampaigns],
  };
  return globalThis.__barberDemoStore;
}

function makeReferralCode(fullName: string) {
  return fullName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, 8)
    .toUpperCase()
    .padEnd(4, "X");
}

function sortBookings(bookings: BarberBooking[]) {
  return [...bookings].sort(
    (a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime()
  );
}

function sortCustomers(customers: BarberCustomer[]) {
  return [...customers].sort(
    (a, b) => b.total_spent_cents - a.total_spent_cents || a.full_name.localeCompare(b.full_name)
  );
}

class DemoBarberRepository implements BarberRepository {
  readonly context = {
    mode: "demo" as const,
    organizationId: BARBER_DEMO_ORG_ID,
    organizationName: BARBER_DEMO_ORG_NAME,
  };

  async listServices() {
    return getDemoStore().services.filter((service) => service.active);
  }

  async listCustomers() {
    return sortCustomers(getDemoStore().customers);
  }

  async listBookings() {
    return sortBookings(getDemoStore().bookings);
  }

  async listCampaigns() {
    return [...getDemoStore().campaigns].sort((a, b) => Number(b.active) - Number(a.active));
  }

  async listPlans() {
    return barberPlans;
  }

  async getDashboardMetrics() {
    return calculateBarberDashboardMetrics({
      bookings: await this.listBookings(),
      customers: await this.listCustomers(),
      campaigns: await this.listCampaigns(),
    });
  }

  async createBooking(input: CreateBarberBookingInput) {
    const store = getDemoStore();
    const service = store.services.find((item) => item.id === input.service_id && item.active);
    if (!service) throw new Error("Servizio non disponibile");

    const existingCustomer = store.customers.find(
      (customer) => customer.phone.replace(/\s/g, "") === input.customer_phone.replace(/\s/g, "")
    );

    const booking: BarberBooking = {
      id: `book-${Date.now()}`,
      organization_id: this.context.organizationId,
      customer_id: existingCustomer?.id ?? null,
      customer_name: input.customer_name,
      customer_phone: input.customer_phone,
      service_id: service.id,
      service_name: service.name,
      starts_at: input.starts_at,
      duration_minutes: service.duration_minutes,
      price_cents: service.price_cents,
      status: "requested",
      referral_code: input.referral_code ?? null,
      notes: input.notes ?? null,
      created_at: new Date().toISOString(),
    };

    store.bookings = [...store.bookings, booking];
    return booking;
  }

  async createCustomer(input: CreateBarberCustomerInput) {
    const store = getDemoStore();
    const customer: BarberCustomer = {
      id: `cus-${Date.now()}`,
      organization_id: this.context.organizationId,
      full_name: input.full_name,
      phone: input.phone,
      email: input.email ?? null,
      segment: input.segment ?? "new",
      referral_code: input.referral_code ?? makeReferralCode(input.full_name),
      referred_by_customer_id: null,
      total_spent_cents: 0,
      visits_count: 0,
      last_visit_at: null,
      notes: input.notes ?? null,
      created_at: new Date().toISOString(),
    };
    store.customers = [customer, ...store.customers];
    return customer;
  }
}

class FirebaseBarberRepository implements BarberRepository {
  readonly context = {
    mode: "firebase" as const,
    organizationId: process.env.BARBER_ORGANIZATION_ID ?? BARBER_DEMO_ORG_ID,
    organizationName: process.env.BARBER_ORGANIZATION_NAME ?? BARBER_DEMO_ORG_NAME,
  };

  constructor(private readonly db: Firestore) {}

  private collection(name: string) {
    return this.db.collection("organizations").doc(this.context.organizationId).collection(name);
  }

  private async listCollection<T>(name: string) {
    const snapshot = await this.collection(name).get();
    return snapshot.docs.map((doc) => doc.data() as T);
  }

  async listServices() {
    const services = await this.listCollection<BarberService>("barber_services");
    return services.filter((service) => service.active);
  }

  async listCustomers() {
    return sortCustomers(await this.listCollection<BarberCustomer>("barber_customers"));
  }

  async listBookings() {
    return sortBookings(await this.listCollection<BarberBooking>("barber_bookings"));
  }

  async listCampaigns() {
    const campaigns = await this.listCollection<BarberCampaign>("barber_campaigns");
    return campaigns.sort((a, b) => Number(b.active) - Number(a.active));
  }

  async listPlans() {
    return barberPlans;
  }

  async getDashboardMetrics() {
    return calculateBarberDashboardMetrics({
      bookings: await this.listBookings(),
      customers: await this.listCustomers(),
      campaigns: await this.listCampaigns(),
    });
  }

  async createBooking(input: CreateBarberBookingInput) {
    const services = await this.listServices();
    const service = services.find((item) => item.id === input.service_id);
    if (!service) throw new Error("Servizio non disponibile");

    const customers = await this.listCustomers();
    const existingCustomer = customers.find(
      (customer) => customer.phone.replace(/\s/g, "") === input.customer_phone.replace(/\s/g, "")
    );

    const booking: BarberBooking = {
      id: `book-${Date.now()}`,
      organization_id: this.context.organizationId,
      customer_id: existingCustomer?.id ?? null,
      customer_name: input.customer_name,
      customer_phone: input.customer_phone,
      service_id: service.id,
      service_name: service.name,
      starts_at: input.starts_at,
      duration_minutes: service.duration_minutes,
      price_cents: service.price_cents,
      status: "requested",
      referral_code: input.referral_code ?? null,
      notes: input.notes ?? null,
      created_at: new Date().toISOString(),
    };

    await this.collection("barber_bookings").doc(booking.id).set(booking);
    return booking;
  }

  async createCustomer(input: CreateBarberCustomerInput) {
    const customer: BarberCustomer = {
      id: `cus-${Date.now()}`,
      organization_id: this.context.organizationId,
      full_name: input.full_name,
      phone: input.phone,
      email: input.email ?? null,
      segment: input.segment ?? "new",
      referral_code: input.referral_code ?? makeReferralCode(input.full_name),
      referred_by_customer_id: null,
      total_spent_cents: 0,
      visits_count: 0,
      last_visit_at: null,
      notes: input.notes ?? null,
      created_at: new Date().toISOString(),
    };

    await this.collection("barber_customers").doc(customer.id).set(customer);
    return customer;
  }
}

export async function getBarberRepository(): Promise<BarberRepository> {
  const db = getFirebaseAdminDb();
  if (!db) return new DemoBarberRepository();
  return new FirebaseBarberRepository(db);
}
