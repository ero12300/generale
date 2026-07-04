import { demoStore } from "@/lib/demo/store";
import { isFirebaseConfigured } from "@/lib/firebase/client";
import { firebaseRepository } from "@/lib/firebase/repository";
import { FADE_STUDIO_SHOP_ID, isSupabaseConfigured } from "@/lib/supabase/client";
import { supabaseRepository } from "@/lib/supabase/repository";
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
import { generateId, generateReferralCode } from "@/lib/utils";

const DEMO_SHOP_ID = "demo-shop";

type Backend = "supabase" | "firebase" | "demo";

function getBackend(): Backend {
  if (isSupabaseConfigured()) return "supabase";
  if (isFirebaseConfigured()) return "firebase";
  return "demo";
}

export function useDemoMode(): boolean {
  return getBackend() === "demo";
}

async function resolveShopId(): Promise<string> {
  const backend = getBackend();

  if (backend === "supabase") {
    const { getSupabase } = await import("@/lib/supabase/client");
    const supabase = getSupabase();
    const uid = (await supabase?.auth.getUser())?.data.user?.id;
    if (uid) {
      const shop = await supabaseRepository.getShopByOwner(uid);
      if (shop) return shop.id;
    }
    return FADE_STUDIO_SHOP_ID;
  }

  if (backend === "firebase") {
    const { getFirebaseAuth } = await import("@/lib/firebase/client");
    const auth = getFirebaseAuth();
    const uid = auth?.currentUser?.uid;
    if (uid) {
      const shop = await firebaseRepository.getShopByOwner(uid);
      if (shop) return shop.id;
    }
    return DEMO_SHOP_ID;
  }

  return DEMO_SHOP_ID;
}

export const dataStore = {
  async getShop(): Promise<Shop> {
    const backend = getBackend();
    if (backend === "demo") return demoStore.getShop();

    const shopId = await resolveShopId();
    if (backend === "supabase") {
      const shop = await supabaseRepository.getShop(shopId);
      if (shop) return shop;
      const bySlug = await supabaseRepository.getShopBySlug("fade-studio");
      return bySlug ?? demoStore.getShop();
    }

    if (shopId === DEMO_SHOP_ID) return demoStore.getShop();
    const shop = await firebaseRepository.getShop(shopId);
    return shop ?? demoStore.getShop();
  },

  async getShopBySlug(slug: string): Promise<Shop | null> {
    const backend = getBackend();
    if (backend === "supabase") return supabaseRepository.getShopBySlug(slug);
    if (backend === "firebase") return firebaseRepository.getShopBySlug(slug);
    return demoStore.getShopBySlug(slug);
  },

  async getServices(shopId: string): Promise<Service[]> {
    const backend = getBackend();
    if (backend === "supabase") return supabaseRepository.getServices(shopId);
    if (backend === "firebase" && shopId !== DEMO_SHOP_ID) return firebaseRepository.getServices(shopId);
    return demoStore.getServices().filter((s) => s.shopId === shopId || backend === "demo");
  },

  async getCustomers(shopId: string): Promise<Customer[]> {
    const backend = getBackend();
    if (backend === "supabase") return supabaseRepository.getCustomers(shopId);
    if (backend === "firebase" && shopId !== DEMO_SHOP_ID) return firebaseRepository.getCustomers(shopId);
    return demoStore.getCustomers().filter((c) => c.shopId === shopId || backend === "demo");
  },

  async getBookings(shopId: string): Promise<Booking[]> {
    const backend = getBackend();
    if (backend === "supabase") return supabaseRepository.getBookings(shopId);
    if (backend === "firebase" && shopId !== DEMO_SHOP_ID) return firebaseRepository.getBookings(shopId);
    return demoStore.getBookings().filter((b) => b.shopId === shopId || backend === "demo");
  },

  async getTransactions(shopId: string): Promise<Transaction[]> {
    const backend = getBackend();
    if (backend === "supabase") return supabaseRepository.getTransactions(shopId);
    if (backend === "firebase" && shopId !== DEMO_SHOP_ID) return firebaseRepository.getTransactions(shopId);
    return demoStore.getTransactions().filter((t) => t.shopId === shopId || backend === "demo");
  },

  async getCampaigns(shopId: string): Promise<Campaign[]> {
    const backend = getBackend();
    if (backend === "supabase") return supabaseRepository.getCampaigns(shopId);
    if (backend === "firebase" && shopId !== DEMO_SHOP_ID) return firebaseRepository.getCampaigns(shopId);
    return demoStore.getCampaigns().filter((c) => c.shopId === shopId || backend === "demo");
  },

  async getStats(shopId: string): Promise<DashboardStats> {
    const backend = getBackend();
    if (backend === "supabase") return supabaseRepository.getStats(shopId);
    if (backend === "firebase" && shopId !== DEMO_SHOP_ID) return firebaseRepository.getStats(shopId);
    return demoStore.getStats();
  },

  async createCustomer(
    data: Omit<Customer, "id" | "referralCode" | "loyaltyPoints" | "totalVisits" | "totalSpentCents" | "createdAt"> & {
      shopId: string;
    }
  ): Promise<Customer> {
    const customer: Customer = {
      ...data,
      id: generateId(),
      referralCode: generateReferralCode(data.name),
      loyaltyPoints: 0,
      totalVisits: 0,
      totalSpentCents: 0,
      createdAt: new Date().toISOString(),
    };

    const backend = getBackend();
    if (backend === "supabase") return supabaseRepository.createCustomer(customer);
    if (backend === "firebase" && data.shopId !== DEMO_SHOP_ID) return firebaseRepository.createCustomer(customer);
    const { shopId, ...rest } = data;
    void shopId;
    return demoStore.addCustomer(rest);
  },

  async createBooking(data: Omit<Booking, "id" | "createdAt" | "status">): Promise<Booking> {
    const booking: Booking = {
      ...data,
      id: generateId(),
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    const backend = getBackend();
    if (backend === "supabase") return supabaseRepository.createBooking(booking);
    if (backend === "firebase" && data.shopId !== DEMO_SHOP_ID) return firebaseRepository.createBooking(booking);
    return demoStore.addBooking(booking);
  },

  async updateBookingStatus(id: string, status: BookingStatus): Promise<Booking | undefined> {
    const backend = getBackend();
    if (backend === "supabase") return supabaseRepository.updateBookingStatus(id, status);
    if (backend === "firebase") {
      const shop = await this.getShop();
      if (shop.id !== DEMO_SHOP_ID) return firebaseRepository.updateBookingStatus(shop.id, id, status);
    }
    return demoStore.updateBookingStatus(id, status);
  },

  async createTransaction(data: Omit<Transaction, "id" | "createdAt">): Promise<Transaction> {
    const tx: Transaction = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };

    const backend = getBackend();
    if (backend === "supabase") return supabaseRepository.createTransaction(tx);
    if (backend === "firebase" && data.shopId !== DEMO_SHOP_ID) return firebaseRepository.createTransaction(tx);
    return demoStore.addTransaction(tx);
  },

  async createCampaign(data: Omit<Campaign, "id" | "usageCount" | "createdAt">): Promise<Campaign> {
    const campaign: Campaign = {
      ...data,
      id: generateId(),
      usageCount: 0,
      createdAt: new Date().toISOString(),
    };

    const backend = getBackend();
    if (backend === "firebase" && data.shopId !== DEMO_SHOP_ID) return firebaseRepository.createCampaign(campaign);
    return demoStore.addCampaign(campaign);
  },

  async toggleCampaign(id: string): Promise<Campaign | undefined> {
    const backend = getBackend();
    if (backend === "supabase") return supabaseRepository.toggleCampaign(id);
    if (backend === "firebase") {
      const shop = await this.getShop();
      if (shop.id !== DEMO_SHOP_ID) return firebaseRepository.toggleCampaign(shop.id, id);
    }
    return demoStore.toggleCampaign(id);
  },

  async updateShop(
    shopId: string,
    data: Partial<Pick<Shop, "name" | "email" | "phone" | "address" | "slug" | "description" | "openingHours">>
  ): Promise<Shop> {
    const backend = getBackend();
    if (backend === "supabase") return supabaseRepository.updateShop(shopId, data);
    if (backend === "firebase" && shopId !== DEMO_SHOP_ID) return firebaseRepository.updateShop(shopId, data);
    return demoStore.updateShop(data);
  },

  async updateService(
    id: string,
    data: Partial<Pick<Service, "name" | "description" | "durationMinutes" | "priceCents" | "active">>
  ): Promise<Service | undefined> {
    const backend = getBackend();
    if (backend === "supabase") return supabaseRepository.updateService(id, data);
    if (backend === "firebase") {
      const shop = await this.getShop();
      if (shop.id !== DEMO_SHOP_ID) return firebaseRepository.updateService(shop.id, id, data);
    }
    return demoStore.updateService(id, data);
  },

  async addService(data: Omit<Service, "id">): Promise<Service> {
    const service: Service = { ...data, id: generateId() };
    const backend = getBackend();
    if (backend === "supabase") return supabaseRepository.addService(service);
    if (backend === "firebase" && data.shopId !== DEMO_SHOP_ID) return firebaseRepository.addService(service);
    return demoStore.addService(service);
  },

  async deleteService(id: string): Promise<boolean> {
    const backend = getBackend();
    if (backend === "supabase") return supabaseRepository.deleteService(id);
    if (backend === "firebase") {
      const shop = await this.getShop();
      if (shop.id !== DEMO_SHOP_ID) return firebaseRepository.deleteService(shop.id, id);
    }
    return demoStore.deleteService(id);
  },

  async provisionShopForUser(ownerId: string, shopName: string, email: string): Promise<Shop> {
    const slug = shopName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40) || "mio-salone";

    const shop: Shop = {
      id: generateId(),
      slug,
      name: shopName,
      ownerId,
      email,
      plan: "starter",
      openingHours: demoStore.getShop().openingHours,
      createdAt: new Date().toISOString(),
    };

    const backend = getBackend();
    if (backend === "supabase") {
      const created = await supabaseRepository.createShop(shop);
      for (const svc of demoStore.getServices()) {
        await supabaseRepository.addService({
          ...svc,
          id: generateId(),
          shopId: created.id,
        });
      }
      return created;
    }

    if (backend === "firebase") {
      await firebaseRepository.createShop(shop);
      for (const svc of demoStore.getServices()) {
        await firebaseRepository.addService({ ...svc, id: generateId(), shopId: shop.id });
      }
      return shop;
    }

    demoStore.updateShop({ name: shop.name, slug: shop.slug, email: shop.email, ownerId: shop.ownerId });
    return { ...demoStore.getShop(), ...shop };
  },
};
