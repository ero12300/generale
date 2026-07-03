import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  deleteDoc,
  where,
  orderBy,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/client";
import type {
  Booking,
  BookingStatus,
  Campaign,
  Customer,
  DashboardStats,
  Service,
  Shop,
  Transaction,
} from "@/lib/types";

function db() {
  const firestore = getFirebaseDb();
  if (!firestore) throw new Error("Firebase non configurato");
  return firestore;
}

function shopRef(shopId: string) {
  return doc(db(), "shops", shopId);
}

export const firebaseRepository = {
  async getShop(shopId: string): Promise<Shop | null> {
    const snap = await getDoc(shopRef(shopId));
    return snap.exists() ? (snap.data() as Shop) : null;
  },

  async getShopBySlug(slug: string): Promise<Shop | null> {
    const q = query(collection(db(), "shops"), where("slug", "==", slug));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return snap.docs[0].data() as Shop;
  },

  async getShopByOwner(ownerId: string): Promise<Shop | null> {
    const q = query(collection(db(), "shops"), where("ownerId", "==", ownerId));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return snap.docs[0].data() as Shop;
  },

  async updateShop(
    shopId: string,
    data: Partial<Pick<Shop, "name" | "email" | "phone" | "address" | "slug" | "description" | "openingHours" | "plan">>
  ): Promise<Shop> {
    const ref = shopRef(shopId);
    await updateDoc(ref, { ...data, updatedAt: new Date().toISOString() });
    const snap = await getDoc(ref);
    return snap.data() as Shop;
  },

  async createShop(data: Shop): Promise<Shop> {
    await setDoc(shopRef(data.id), data);
    return data;
  },

  async getServices(shopId: string): Promise<Service[]> {
    const snap = await getDocs(collection(db(), "shops", shopId, "services"));
    return snap.docs.map((d) => d.data() as Service);
  },

  async updateService(
    shopId: string,
    id: string,
    data: Partial<Pick<Service, "name" | "description" | "durationMinutes" | "priceCents" | "active">>
  ): Promise<Service | undefined> {
    const ref = doc(db(), "shops", shopId, "services", id);
    await updateDoc(ref, data);
    const snap = await getDoc(ref);
    return snap.exists() ? (snap.data() as Service) : undefined;
  },

  async addService(data: Service): Promise<Service> {
    const ref = doc(db(), "shops", data.shopId, "services", data.id);
    await setDoc(ref, data);
    return data;
  },

  async deleteService(shopId: string, id: string): Promise<boolean> {
    await deleteDoc(doc(db(), "shops", shopId, "services", id));
    return true;
  },

  async getCustomers(shopId: string): Promise<Customer[]> {
    const snap = await getDocs(collection(db(), "shops", shopId, "customers"));
    return snap.docs.map((d) => d.data() as Customer);
  },

  async createCustomer(data: Customer): Promise<Customer> {
    const ref = doc(db(), "shops", data.shopId, "customers", data.id);
    await setDoc(ref, data);
    return data;
  },

  async getBookings(shopId: string): Promise<Booking[]> {
    const q = query(
      collection(db(), "shops", shopId, "bookings"),
      orderBy("date"),
      orderBy("time")
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as Booking);
  },

  async createBooking(data: Booking): Promise<Booking> {
    const ref = doc(db(), "shops", data.shopId, "bookings", data.id);
    await setDoc(ref, data);
    return data;
  },

  async updateBookingStatus(
    shopId: string,
    id: string,
    status: BookingStatus
  ): Promise<Booking | undefined> {
    const ref = doc(db(), "shops", shopId, "bookings", id);
    await updateDoc(ref, { status });
    const snap = await getDoc(ref);
    return snap.exists() ? (snap.data() as Booking) : undefined;
  },

  async getTransactions(shopId: string): Promise<Transaction[]> {
    const q = query(collection(db(), "shops", shopId, "transactions"), orderBy("date", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as Transaction);
  },

  async createTransaction(data: Transaction): Promise<Transaction> {
    const ref = doc(db(), "shops", data.shopId, "transactions", data.id);
    await setDoc(ref, data);
    return data;
  },

  async getCampaigns(shopId: string): Promise<Campaign[]> {
    const snap = await getDocs(collection(db(), "shops", shopId, "campaigns"));
    return snap.docs.map((d) => d.data() as Campaign);
  },

  async createCampaign(data: Campaign): Promise<Campaign> {
    const ref = doc(db(), "shops", data.shopId, "campaigns", data.id);
    await setDoc(ref, data);
    return data;
  },

  async toggleCampaign(shopId: string, id: string): Promise<Campaign | undefined> {
    const ref = doc(db(), "shops", shopId, "campaigns", id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return undefined;
    const current = snap.data() as Campaign;
    await updateDoc(ref, { active: !current.active });
    return { ...current, active: !current.active };
  },

  async getStats(shopId: string): Promise<DashboardStats> {
    const today = new Date().toISOString().slice(0, 10);
    const monthStart = new Date();
    monthStart.setDate(1);
    const monthStartStr = monthStart.toISOString().slice(0, 10);

    const [transactions, bookings, customers, campaigns] = await Promise.all([
      this.getTransactions(shopId),
      this.getBookings(shopId),
      this.getCustomers(shopId),
      this.getCampaigns(shopId),
    ]);

    return {
      todayRevenueCents: transactions
        .filter((t) => t.date === today)
        .reduce((s, t) => s + t.amountCents, 0),
      monthRevenueCents: transactions
        .filter((t) => t.date >= monthStartStr)
        .reduce((s, t) => s + t.amountCents, 0),
      todayBookings: bookings.filter((b) => b.date === today).length,
      pendingBookings: bookings.filter((b) => b.status === "pending").length,
      totalCustomers: customers.length,
      activeCampaigns: campaigns.filter((c) => c.active).length,
    };
  },
};
