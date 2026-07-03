import {
  db,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
  onSnapshot,
  type QueryConstraint,
} from "./firebase";
import type {
  BarberShop,
  Client,
  Booking,
  Transaction,
  Campaign,
  DashboardStats,
  RevenueData,
  Service,
} from "@/types";
import { format, startOfDay, endOfDay, startOfMonth, endOfMonth, subDays } from "date-fns";

// ─── Shops ────────────────────────────────────────────────────────────────────

export async function getShop(shopId: string): Promise<BarberShop | null> {
  const snap = await getDoc(doc(db, "shops", shopId));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as BarberShop;
}

export async function getShopByOwner(ownerId: string): Promise<BarberShop | null> {
  const q = query(collection(db, "shops"), where("ownerId", "==", ownerId), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() } as BarberShop;
}

export async function createShop(ownerId: string, name: string): Promise<BarberShop> {
  const now = new Date().toISOString();
  const shopRef = doc(collection(db, "shops"));
  const shop: Omit<BarberShop, "id"> = {
    name,
    ownerId,
    plan: "free",
    createdAt: now,
    updatedAt: now,
    settings: {
      currency: "EUR",
      timezone: "Europe/Rome",
      bookingSlotMinutes: 30,
      workingHours: {
        monday: { open: true, from: "09:00", to: "19:00" },
        tuesday: { open: true, from: "09:00", to: "19:00" },
        wednesday: { open: true, from: "09:00", to: "19:00" },
        thursday: { open: true, from: "09:00", to: "19:00" },
        friday: { open: true, from: "09:00", to: "19:00" },
        saturday: { open: true, from: "09:00", to: "17:00" },
        sunday: { open: false, from: "09:00", to: "17:00" },
      },
      services: [
        { id: "s1", name: "Taglio", duration: 30, price: 15, active: true },
        { id: "s2", name: "Taglio + Barba", duration: 45, price: 25, active: true },
        { id: "s3", name: "Barba", duration: 20, price: 12, active: true },
        { id: "s4", name: "Trattamento Capelli", duration: 60, price: 35, active: true },
      ],
      staff: [
        { id: "staff1", name: "Il Barbiere", active: true, services: ["s1", "s2", "s3", "s4"] },
      ],
      notificationsEmail: true,
      referralBonus: 5,
      loyaltyPointsPerEuro: 1,
    },
  };
  await setDoc(shopRef, shop);
  return { id: shopRef.id, ...shop };
}

export async function updateShop(shopId: string, data: Partial<BarberShop>): Promise<void> {
  await updateDoc(doc(db, "shops", shopId), { ...data, updatedAt: new Date().toISOString() });
}

// ─── Clients ──────────────────────────────────────────────────────────────────

export function generateReferralCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export async function getClients(shopId: string): Promise<Client[]> {
  const q = query(
    collection(db, "clients"),
    where("shopId", "==", shopId),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Client));
}

export async function getClient(clientId: string): Promise<Client | null> {
  const snap = await getDoc(doc(db, "clients", clientId));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Client;
}

export async function createClient(shopId: string, data: Omit<Client, "id" | "shopId" | "createdAt" | "updatedAt" | "referralCode" | "totalVisits" | "totalSpent" | "loyaltyPoints">): Promise<Client> {
  const now = new Date().toISOString();
  const clientRef = doc(collection(db, "clients"));
  const client: Omit<Client, "id"> = {
    ...data,
    shopId,
    loyaltyPoints: 0,
    totalVisits: 0,
    totalSpent: 0,
    referralCode: generateReferralCode(),
    tags: data.tags ?? [],
    createdAt: now,
    updatedAt: now,
  };
  await setDoc(clientRef, client);
  return { id: clientRef.id, ...client };
}

export async function updateClient(clientId: string, data: Partial<Client>): Promise<void> {
  await updateDoc(doc(db, "clients", clientId), { ...data, updatedAt: new Date().toISOString() });
}

export async function deleteClient(clientId: string): Promise<void> {
  await deleteDoc(doc(db, "clients", clientId));
}

// ─── Bookings ─────────────────────────────────────────────────────────────────

export async function getBookings(shopId: string, dateFrom?: string, dateTo?: string): Promise<Booking[]> {
  const constraints: QueryConstraint[] = [where("shopId", "==", shopId)];
  if (dateFrom) constraints.push(where("date", ">=", dateFrom));
  if (dateTo) constraints.push(where("date", "<=", dateTo));
  constraints.push(orderBy("date", "asc"), orderBy("startTime", "asc"));

  const q = query(collection(db, "bookings"), ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Booking));
}

export async function getTodayBookings(shopId: string): Promise<Booking[]> {
  const today = format(new Date(), "yyyy-MM-dd");
  return getBookings(shopId, today, today);
}

export async function createBooking(data: Omit<Booking, "id" | "createdAt" | "updatedAt">): Promise<Booking> {
  const now = new Date().toISOString();
  const ref = doc(collection(db, "bookings"));
  const booking: Omit<Booking, "id"> = { ...data, createdAt: now, updatedAt: now };
  await setDoc(ref, booking);
  return { id: ref.id, ...booking };
}

export async function updateBooking(bookingId: string, data: Partial<Booking>): Promise<void> {
  await updateDoc(doc(db, "bookings", bookingId), { ...data, updatedAt: new Date().toISOString() });
}

export async function deleteBooking(bookingId: string): Promise<void> {
  await deleteDoc(doc(db, "bookings", bookingId));
}

// ─── Transactions ─────────────────────────────────────────────────────────────

export async function getTransactions(shopId: string, dateFrom?: string, dateTo?: string): Promise<Transaction[]> {
  const constraints: QueryConstraint[] = [where("shopId", "==", shopId)];
  if (dateFrom) constraints.push(where("date", ">=", dateFrom));
  if (dateTo) constraints.push(where("date", "<=", dateTo));
  constraints.push(orderBy("date", "desc"), orderBy("createdAt", "desc"));

  const q = query(collection(db, "transactions"), ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Transaction));
}

export async function createTransaction(data: Omit<Transaction, "id" | "createdAt">): Promise<Transaction> {
  const now = new Date().toISOString();
  const ref = doc(collection(db, "transactions"));
  const tx: Omit<Transaction, "id"> = { ...data, createdAt: now };
  await setDoc(ref, tx);
  return { id: ref.id, ...tx };
}

// ─── Campaigns ────────────────────────────────────────────────────────────────

export async function getCampaigns(shopId: string): Promise<Campaign[]> {
  const q = query(
    collection(db, "campaigns"),
    where("shopId", "==", shopId),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Campaign));
}

export async function createCampaign(data: Omit<Campaign, "id" | "createdAt" | "usedCount">): Promise<Campaign> {
  const now = new Date().toISOString();
  const ref = doc(collection(db, "campaigns"));
  const campaign: Omit<Campaign, "id"> = { ...data, usedCount: 0, createdAt: now };
  await setDoc(ref, campaign);
  return { id: ref.id, ...campaign };
}

export async function updateCampaign(campaignId: string, data: Partial<Campaign>): Promise<void> {
  await updateDoc(doc(db, "campaigns", campaignId), data);
}

export async function deleteCampaign(campaignId: string): Promise<void> {
  await deleteDoc(doc(db, "campaigns", campaignId));
}

export async function validateCoupon(shopId: string, code: string): Promise<Campaign | null> {
  const q = query(
    collection(db, "campaigns"),
    where("shopId", "==", shopId),
    where("code", "==", code.toUpperCase()),
    where("active", "==", true)
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const campaign = { id: snap.docs[0].id, ...snap.docs[0].data() } as Campaign;

  const now = new Date().toISOString();
  if (campaign.validTo && campaign.validTo < now) return null;
  if (campaign.maxUses && campaign.usedCount >= campaign.maxUses) return null;

  return campaign;
}

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

export async function getDashboardStats(shopId: string): Promise<DashboardStats> {
  const today = format(new Date(), "yyyy-MM-dd");
  const monthStart = format(startOfMonth(new Date()), "yyyy-MM-dd");
  const monthEnd = format(endOfMonth(new Date()), "yyyy-MM-dd");

  const [todayBookings, monthBookings, allClients, todayTx, monthTx] = await Promise.all([
    getBookings(shopId, today, today),
    getBookings(shopId, monthStart, monthEnd),
    getClients(shopId),
    getTransactions(shopId, today, today),
    getTransactions(shopId, monthStart, monthEnd),
  ]);

  const todayRevenue = todayTx.reduce((sum, t) => sum + t.total, 0);
  const monthRevenue = monthTx.reduce((sum, t) => sum + t.total, 0);

  const thirtyDaysAgo = format(subDays(new Date(), 30), "yyyy-MM-dd");
  const newClientsThisMonth = allClients.filter(
    (c) => c.createdAt >= monthStart
  ).length;
  const newClientsToday = allClients.filter(
    (c) => c.createdAt.startsWith(today)
  ).length;

  return {
    todayRevenue,
    todayBookings: todayBookings.filter((b) => b.status !== "cancelled").length,
    todayNewClients: newClientsToday,
    monthRevenue,
    monthBookings: monthBookings.filter((b) => b.status !== "cancelled").length,
    monthNewClients: newClientsThisMonth,
    totalClients: allClients.length,
    pendingBookings: todayBookings.filter((b) => b.status === "pending").length,
  };
}

export async function getRevenueData(shopId: string, days: number = 30): Promise<RevenueData[]> {
  const dateFrom = format(subDays(new Date(), days), "yyyy-MM-dd");
  const dateTo = format(new Date(), "yyyy-MM-dd");
  const transactions = await getTransactions(shopId, dateFrom, dateTo);
  const bookings = await getBookings(shopId, dateFrom, dateTo);

  const map = new Map<string, { revenue: number; bookings: number }>();
  for (let i = days; i >= 0; i--) {
    const d = format(subDays(new Date(), i), "yyyy-MM-dd");
    map.set(d, { revenue: 0, bookings: 0 });
  }

  for (const tx of transactions) {
    const existing = map.get(tx.date) ?? { revenue: 0, bookings: 0 };
    map.set(tx.date, { ...existing, revenue: existing.revenue + tx.total });
  }
  for (const b of bookings) {
    if (b.status === "completed") {
      const existing = map.get(b.date) ?? { revenue: 0, bookings: 0 };
      map.set(b.date, { ...existing, bookings: existing.bookings + 1 });
    }
  }

  return Array.from(map.entries()).map(([date, data]) => ({ date, ...data }));
}
