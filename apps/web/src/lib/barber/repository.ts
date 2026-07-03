import {
  BarberBooking,
  BarberCampaign,
  BarberCustomer,
  BarberDashboardSummary,
  BarberSubscriptionTier,
  BarberTransaction,
} from "@deal-desk/types";
import { getFirestoreDb, isFirebaseEnabled } from "@/lib/barber/firebase-admin";
import { BARBER_PRICING_PLANS } from "@/lib/barber/monetization";

type NewCustomerInput = Omit<
  BarberCustomer,
  "id" | "organization_id" | "total_spent_cents" | "visits_count" | "created_at"
>;
type NewBookingInput = Omit<BarberBooking, "id" | "organization_id" | "created_at">;
type NewTransactionInput = Omit<BarberTransaction, "id" | "organization_id" | "created_at">;
type NewCampaignInput = Omit<BarberCampaign, "id" | "organization_id" | "created_at">;

export interface BarberDashboardPayload {
  summary: BarberDashboardSummary;
  customers: BarberCustomer[];
  bookings: BarberBooking[];
  transactions: BarberTransaction[];
  campaigns: BarberCampaign[];
  plans: typeof BARBER_PRICING_PLANS;
  subscription_tier: BarberSubscriptionTier;
  persistence: "firebase" | "demo";
}

const organizationId = process.env.BARBER_ORGANIZATION_ID ?? "barber-demo-org";
const defaultTier: BarberSubscriptionTier =
  process.env.BARBER_DEFAULT_PLAN === "pro" ? "pro" : "base";

const now = new Date();
const todayISO = now.toISOString();

const demoDb: {
  customers: BarberCustomer[];
  bookings: BarberBooking[];
  transactions: BarberTransaction[];
  campaigns: BarberCampaign[];
} = {
  customers: [
    {
      id: "cst_001",
      organization_id: organizationId,
      full_name: "Marco Rossi",
      phone: "+39 333 111 2233",
      email: "marco.rossi@example.com",
      notes: "Taglio skin fade ogni 2 settimane",
      source: "instagram",
      total_spent_cents: 12600,
      visits_count: 6,
      referred_by_customer_id: null,
      created_at: todayISO,
    },
    {
      id: "cst_002",
      organization_id: organizationId,
      full_name: "Luca Bianchi",
      phone: "+39 333 999 0102",
      email: null,
      notes: null,
      source: "referral",
      total_spent_cents: 5400,
      visits_count: 3,
      referred_by_customer_id: "cst_001",
      created_at: todayISO,
    },
  ],
  bookings: [
    {
      id: "bkg_001",
      organization_id: organizationId,
      customer_id: "cst_001",
      service_name: "Skin Fade + Barba",
      start_at: new Date(now.getTime() + 60 * 60 * 1000).toISOString(),
      duration_minutes: 60,
      price_cents: 3500,
      status: "confirmed",
      notes: "Usare rasoio a lama",
      created_at: todayISO,
    },
  ],
  transactions: [
    {
      id: "txn_001",
      organization_id: organizationId,
      customer_id: "cst_001",
      booking_id: "bkg_001",
      type: "service_sale",
      amount_cents: 3500,
      payment_method: "card",
      description: "Pagamento taglio + barba",
      created_at: todayISO,
    },
  ],
  campaigns: [
    {
      id: "cmp_001",
      organization_id: organizationId,
      name: "Porta un amico Luglio",
      type: "bring_a_friend",
      code: "AMICO10",
      discount_percent: 10,
      reward_cents: 500,
      starts_at: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(),
      ends_at: new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString(),
      enabled: true,
      created_at: todayISO,
    },
  ],
};

function generateId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function sortByDateDesc<T extends { created_at: string }>(rows: T[]) {
  return [...rows].sort((a, b) => b.created_at.localeCompare(a.created_at));
}

function isCurrentMonth(isoDate: string) {
  const date = new Date(isoDate);
  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
}

function computeSummary(
  customers: BarberCustomer[],
  bookings: BarberBooking[],
  transactions: BarberTransaction[],
  campaigns: BarberCampaign[]
): BarberDashboardSummary {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  return {
    today_bookings_count: bookings.filter((booking) => new Date(booking.start_at) >= startOfToday).length,
    monthly_revenue_cents: transactions
      .filter((transaction) => transaction.amount_cents > 0 && isCurrentMonth(transaction.created_at))
      .reduce((acc, transaction) => acc + transaction.amount_cents, 0),
    active_customers_count: customers.filter((customer) => customer.visits_count > 0).length,
    referral_campaigns_count: campaigns.filter(
      (campaign) => campaign.enabled && campaign.type === "bring_a_friend"
    ).length,
  };
}

async function listFirebaseCollection<T>(collectionName: string): Promise<T[]> {
  const db = getFirestoreDb();
  if (!db) return [];
  const snapshot = await db
    .collection(collectionName)
    .where("organization_id", "==", organizationId)
    .get();
  return snapshot.docs.map((doc) => doc.data() as T);
}

async function setFirebaseDoc<T extends { id: string }>(collectionName: string, value: T) {
  const db = getFirestoreDb();
  if (!db) return;
  await db.collection(collectionName).doc(value.id).set(value, { merge: true });
}

async function getDataSource() {
  const firebaseMode = isFirebaseEnabled();
  if (!firebaseMode) {
    return {
      persistence: "demo" as const,
      customers: demoDb.customers,
      bookings: demoDb.bookings,
      transactions: demoDb.transactions,
      campaigns: demoDb.campaigns,
    };
  }

  const [customers, bookings, transactions, campaigns] = await Promise.all([
    listFirebaseCollection<BarberCustomer>("barber_customers"),
    listFirebaseCollection<BarberBooking>("barber_bookings"),
    listFirebaseCollection<BarberTransaction>("barber_transactions"),
    listFirebaseCollection<BarberCampaign>("barber_campaigns"),
  ]);

  return {
    persistence: "firebase" as const,
    customers,
    bookings,
    transactions,
    campaigns,
  };
}

export async function getBarberDashboard(): Promise<BarberDashboardPayload> {
  const data = await getDataSource();

  return {
    summary: computeSummary(data.customers, data.bookings, data.transactions, data.campaigns),
    customers: sortByDateDesc(data.customers),
    bookings: sortByDateDesc(data.bookings),
    transactions: sortByDateDesc(data.transactions),
    campaigns: sortByDateDesc(data.campaigns),
    plans: BARBER_PRICING_PLANS,
    subscription_tier: defaultTier,
    persistence: data.persistence,
  };
}

export async function createBarberCustomer(input: NewCustomerInput) {
  const customer: BarberCustomer = {
    id: generateId("cst"),
    organization_id: organizationId,
    full_name: input.full_name,
    phone: input.phone,
    email: input.email ?? null,
    notes: input.notes ?? null,
    source: input.source,
    total_spent_cents: 0,
    visits_count: 0,
    referred_by_customer_id: input.referred_by_customer_id ?? null,
    created_at: new Date().toISOString(),
  };

  if (isFirebaseEnabled()) {
    await setFirebaseDoc("barber_customers", customer);
  } else {
    demoDb.customers.unshift(customer);
  }
  return customer;
}

export async function createBarberBooking(input: NewBookingInput) {
  const booking: BarberBooking = {
    id: generateId("bkg"),
    organization_id: organizationId,
    customer_id: input.customer_id,
    service_name: input.service_name,
    start_at: input.start_at,
    duration_minutes: input.duration_minutes,
    price_cents: input.price_cents,
    status: input.status,
    notes: input.notes ?? null,
    created_at: new Date().toISOString(),
  };

  if (isFirebaseEnabled()) {
    await setFirebaseDoc("barber_bookings", booking);
  } else {
    demoDb.bookings.unshift(booking);
  }
  return booking;
}

export async function createBarberTransaction(input: NewTransactionInput) {
  const transaction: BarberTransaction = {
    id: generateId("txn"),
    organization_id: organizationId,
    customer_id: input.customer_id ?? null,
    booking_id: input.booking_id ?? null,
    type: input.type,
    amount_cents: input.amount_cents,
    payment_method: input.payment_method,
    description: input.description,
    created_at: new Date().toISOString(),
  };

  if (isFirebaseEnabled()) {
    await setFirebaseDoc("barber_transactions", transaction);
  } else {
    demoDb.transactions.unshift(transaction);
  }
  return transaction;
}

export async function createBarberCampaign(input: NewCampaignInput) {
  const campaign: BarberCampaign = {
    id: generateId("cmp"),
    organization_id: organizationId,
    name: input.name,
    type: input.type,
    code: input.code,
    discount_percent: input.discount_percent,
    reward_cents: input.reward_cents,
    starts_at: input.starts_at,
    ends_at: input.ends_at,
    enabled: input.enabled,
    created_at: new Date().toISOString(),
  };

  if (isFirebaseEnabled()) {
    await setFirebaseDoc("barber_campaigns", campaign);
  } else {
    demoDb.campaigns.unshift(campaign);
  }
  return campaign;
}
