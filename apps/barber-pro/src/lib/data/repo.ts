// -----------------------------------------------------------------------------
// Repository layer: espone API tipate per accedere ai dati.
// Se le variabili Firebase non sono configurate, fallback trasparente su store demo.
// In produzione (con Firebase configurato) userà Firestore.
// -----------------------------------------------------------------------------
import type {
  Booking,
  Client,
  Coupon,
  DashboardKpis,
  Payment,
  ReferralEvent,
  Service,
  Shop,
  Staff,
} from "../types";
import { newId, store } from "../demo/store";
import { startOfDay, startOfMonth, addMinutes } from "../utils";

export function isFirebaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  );
}

// Il repo demo lavora su un singolo shop (`demo-shop`) — sufficient a mostrare il prodotto end-to-end.
export const DEMO_SHOP_ID = "demo-shop";

// -----------------------------------------------------------------------------
// Shop
// -----------------------------------------------------------------------------
export async function getShop(shopId: string = DEMO_SHOP_ID): Promise<Shop | null> {
  return store().shops.get(shopId) ?? null;
}

export async function getShopBySlug(slug: string): Promise<Shop | null> {
  for (const s of store().shops.values()) {
    if (s.slug === slug) return s;
  }
  return null;
}

export async function updateShopPlan(
  shopId: string,
  patch: Partial<Pick<Shop, "plan" | "stripeCustomerId" | "stripeSubscriptionId" | "currentPeriodEnd">>,
): Promise<Shop | null> {
  const s = store().shops.get(shopId);
  if (!s) return null;
  const next = { ...s, ...patch };
  store().shops.set(shopId, next);
  return next;
}

// -----------------------------------------------------------------------------
// Services
// -----------------------------------------------------------------------------
export async function listServices(shopId: string = DEMO_SHOP_ID): Promise<Service[]> {
  return Array.from(store().services.values()).filter((s) => s.shopId === shopId);
}

export async function createService(input: Omit<Service, "id">): Promise<Service> {
  const item: Service = { ...input, id: newId("svc") };
  store().services.set(item.id, item);
  return item;
}

export async function updateService(id: string, patch: Partial<Service>): Promise<Service | null> {
  const s = store().services.get(id);
  if (!s) return null;
  const next = { ...s, ...patch };
  store().services.set(id, next);
  return next;
}

export async function deleteService(id: string): Promise<boolean> {
  return store().services.delete(id);
}

// -----------------------------------------------------------------------------
// Staff
// -----------------------------------------------------------------------------
export async function listStaff(shopId: string = DEMO_SHOP_ID): Promise<Staff[]> {
  return Array.from(store().staff.values()).filter((s) => s.shopId === shopId);
}

export async function createStaff(input: Omit<Staff, "id">): Promise<Staff> {
  const item: Staff = { ...input, id: newId("stf") };
  store().staff.set(item.id, item);
  return item;
}

// -----------------------------------------------------------------------------
// Clients
// -----------------------------------------------------------------------------
export async function listClients(shopId: string = DEMO_SHOP_ID): Promise<Client[]> {
  return Array.from(store().clients.values())
    .filter((c) => c.shopId === shopId)
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function getClient(id: string): Promise<Client | null> {
  return store().clients.get(id) ?? null;
}

export async function getClientByReferralCode(shopId: string, code: string): Promise<Client | null> {
  const upper = code.trim().toUpperCase();
  for (const c of store().clients.values()) {
    if (c.shopId === shopId && c.referralCode === upper) return c;
  }
  return null;
}

export async function createClient(input: Omit<Client, "id">): Promise<Client> {
  const item: Client = { ...input, id: newId("cli") };
  store().clients.set(item.id, item);
  return item;
}

export async function updateClient(id: string, patch: Partial<Client>): Promise<Client | null> {
  const c = store().clients.get(id);
  if (!c) return null;
  const next = { ...c, ...patch };
  store().clients.set(id, next);
  return next;
}

// -----------------------------------------------------------------------------
// Bookings
// -----------------------------------------------------------------------------
export async function listBookings(shopId: string = DEMO_SHOP_ID): Promise<Booking[]> {
  return Array.from(store().bookings.values())
    .filter((b) => b.shopId === shopId)
    .sort((a, b) => a.startAt.localeCompare(b.startAt));
}

export async function getBooking(id: string): Promise<Booking | null> {
  return store().bookings.get(id) ?? null;
}

export async function createBooking(input: Omit<Booking, "id">): Promise<Booking> {
  const item: Booking = { ...input, id: newId("bk") };
  store().bookings.set(item.id, item);
  return item;
}

export async function updateBooking(id: string, patch: Partial<Booking>): Promise<Booking | null> {
  const b = store().bookings.get(id);
  if (!b) return null;
  const next = { ...b, ...patch };
  store().bookings.set(id, next);
  return next;
}

// -----------------------------------------------------------------------------
// Payments
// -----------------------------------------------------------------------------
export async function listPayments(shopId: string = DEMO_SHOP_ID): Promise<Payment[]> {
  return Array.from(store().payments.values())
    .filter((p) => p.shopId === shopId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function createPayment(input: Omit<Payment, "id">): Promise<Payment> {
  const item: Payment = { ...input, id: newId("pay") };
  store().payments.set(item.id, item);
  if (item.clientId) {
    const c = store().clients.get(item.clientId);
    if (c) {
      store().clients.set(c.id, {
        ...c,
        totalSpentCents: c.totalSpentCents + item.amountCents,
        visits: c.visits + 1,
        loyaltyPoints: c.loyaltyPoints + Math.floor(item.amountCents / 100),
      });
    }
  }
  return item;
}

// -----------------------------------------------------------------------------
// Coupons
// -----------------------------------------------------------------------------
export async function listCoupons(shopId: string = DEMO_SHOP_ID): Promise<Coupon[]> {
  return Array.from(store().coupons.values()).filter((c) => c.shopId === shopId);
}

export async function getCouponByCode(shopId: string, code: string): Promise<Coupon | null> {
  const upper = code.trim().toUpperCase();
  for (const c of store().coupons.values()) {
    if (c.shopId === shopId && c.code === upper && c.active) return c;
  }
  return null;
}

export async function createCoupon(input: Omit<Coupon, "id">): Promise<Coupon> {
  const item: Coupon = { ...input, id: newId("cp"), code: input.code.toUpperCase() };
  store().coupons.set(item.id, item);
  return item;
}

export async function toggleCoupon(id: string, active: boolean): Promise<Coupon | null> {
  const c = store().coupons.get(id);
  if (!c) return null;
  const next = { ...c, active };
  store().coupons.set(id, next);
  return next;
}

// -----------------------------------------------------------------------------
// Referrals
// -----------------------------------------------------------------------------
export async function listReferrals(shopId: string = DEMO_SHOP_ID): Promise<ReferralEvent[]> {
  return Array.from(store().referrals.values())
    .filter((r) => r.shopId === shopId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function createReferral(input: Omit<ReferralEvent, "id">): Promise<ReferralEvent> {
  const item: ReferralEvent = { ...input, id: newId("rf") };
  store().referrals.set(item.id, item);
  return item;
}

// -----------------------------------------------------------------------------
// KPIs
// -----------------------------------------------------------------------------
export async function getDashboardKpis(shopId: string = DEMO_SHOP_ID): Promise<DashboardKpis> {
  const [bookings, payments, clients, services, staff] = await Promise.all([
    listBookings(shopId),
    listPayments(shopId),
    listClients(shopId),
    listServices(shopId),
    listStaff(shopId),
  ]);
  const now = new Date();
  const today = startOfDay(now);
  const tomorrow = addMinutes(today, 24 * 60);
  const monthStart = startOfMonth(now);
  const weekStart = addMinutes(today, -6 * 24 * 60);

  const revenueTodayCents = payments
    .filter((p) => new Date(p.createdAt) >= today && new Date(p.createdAt) < tomorrow)
    .reduce((s, p) => s + p.amountCents, 0);
  const revenueMonthCents = payments
    .filter((p) => new Date(p.createdAt) >= monthStart)
    .reduce((s, p) => s + p.amountCents, 0);

  const bookingsToday = bookings.filter(
    (b) => new Date(b.startAt) >= today && new Date(b.startAt) < tomorrow && b.status !== "cancelled",
  ).length;
  const bookingsWeek = bookings.filter(
    (b) => new Date(b.startAt) >= weekStart && b.status !== "cancelled",
  ).length;

  const clientsNewMonth = clients.filter((c) => new Date(c.createdAt) >= monthStart).length;

  const topClients = [...clients]
    .sort((a, b) => b.totalSpentCents - a.totalSpentCents)
    .slice(0, 5)
    .map((c) => ({ id: c.id, name: c.name, totalSpentCents: c.totalSpentCents, visits: c.visits }));

  const upcoming = bookings
    .filter((b) => new Date(b.startAt) >= now && b.status === "confirmed")
    .slice(0, 6)
    .map((b) => {
      const cli = clients.find((c) => c.id === b.clientId);
      const svc = services.find((s) => s.id === b.serviceId);
      const stf = staff.find((s) => s.id === b.staffId);
      return {
        id: b.id,
        clientName: cli?.name ?? "—",
        serviceName: svc?.name ?? "—",
        staffName: stf?.name ?? "—",
        startAt: b.startAt,
        priceCents: b.priceCents,
      };
    });

  return {
    revenueTodayCents,
    revenueMonthCents,
    bookingsToday,
    bookingsWeek,
    clientsTotal: clients.length,
    clientsNewMonth,
    topClients,
    upcoming,
  };
}
