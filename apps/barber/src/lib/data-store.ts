import { demoStore } from "@/lib/demo/store";
import { isFirebaseConfigured } from "@/lib/firebase/client";
import { firebaseRepository } from "@/lib/firebase/repository";
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

export function useDemoMode(): boolean {
  return !isFirebaseConfigured();
}

async function resolveShopId(): Promise<string> {
  if (!isFirebaseConfigured()) return DEMO_SHOP_ID;
  const { getFirebaseAuth } = await import("@/lib/firebase/client");
  const auth = getFirebaseAuth();
  const uid = auth?.currentUser?.uid;
  if (uid) {
    const shop = await firebaseRepository.getShopByOwner(uid);
    if (shop) return shop.id;
  }
  return DEMO_SHOP_ID;
}

export const dataStore = {
  async getShop(): Promise<Shop> {
    if (!isFirebaseConfigured()) return demoStore.getShop();
    const shopId = await resolveShopId();
    if (shopId === DEMO_SHOP_ID) return demoStore.getShop();
    const shop = await firebaseRepository.getShop(shopId);
    return shop ?? demoStore.getShop();
  },

  async getShopBySlug(slug: string): Promise<Shop | null> {
    if (!isFirebaseConfigured()) return demoStore.getShopBySlug(slug);
    return firebaseRepository.getShopBySlug(slug);
  },

  async getServices(shopId: string): Promise<Service[]> {
    if (!isFirebaseConfigured() || shopId === DEMO_SHOP_ID) {
      return demoStore.getServices().filter((s) => s.shopId === shopId);
    }
    return firebaseRepository.getServices(shopId);
  },

  async getCustomers(shopId: string): Promise<Customer[]> {
    if (!isFirebaseConfigured() || shopId === DEMO_SHOP_ID) {
      return demoStore.getCustomers().filter((c) => c.shopId === shopId);
    }
    return firebaseRepository.getCustomers(shopId);
  },

  async getBookings(shopId: string): Promise<Booking[]> {
    if (!isFirebaseConfigured() || shopId === DEMO_SHOP_ID) {
      return demoStore.getBookings().filter((b) => b.shopId === shopId);
    }
    return firebaseRepository.getBookings(shopId);
  },

  async getTransactions(shopId: string): Promise<Transaction[]> {
    if (!isFirebaseConfigured() || shopId === DEMO_SHOP_ID) {
      return demoStore.getTransactions().filter((t) => t.shopId === shopId);
    }
    return firebaseRepository.getTransactions(shopId);
  },

  async getCampaigns(shopId: string): Promise<Campaign[]> {
    if (!isFirebaseConfigured() || shopId === DEMO_SHOP_ID) {
      return demoStore.getCampaigns().filter((c) => c.shopId === shopId);
    }
    return firebaseRepository.getCampaigns(shopId);
  },

  async getStats(shopId: string): Promise<DashboardStats> {
    if (!isFirebaseConfigured() || shopId === DEMO_SHOP_ID) return demoStore.getStats();
    return firebaseRepository.getStats(shopId);
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

    if (!isFirebaseConfigured() || data.shopId === DEMO_SHOP_ID) {
      const { shopId, ...rest } = data;
      void shopId;
      return demoStore.addCustomer(rest);
    }
    return firebaseRepository.createCustomer(customer);
  },

  async createBooking(data: Omit<Booking, "id" | "createdAt" | "status">): Promise<Booking> {
    const booking: Booking = {
      ...data,
      id: generateId(),
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    if (!isFirebaseConfigured() || data.shopId === DEMO_SHOP_ID) {
      return demoStore.addBooking(booking);
    }
    return firebaseRepository.createBooking(booking);
  },

  async updateBookingStatus(id: string, status: BookingStatus): Promise<Booking | undefined> {
    if (!isFirebaseConfigured()) return demoStore.updateBookingStatus(id, status);
    const shop = await this.getShop();
    if (shop.id === DEMO_SHOP_ID) return demoStore.updateBookingStatus(id, status);
    return firebaseRepository.updateBookingStatus(shop.id, id, status);
  },

  async createTransaction(data: Omit<Transaction, "id" | "createdAt">): Promise<Transaction> {
    const tx: Transaction = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };

    if (!isFirebaseConfigured() || data.shopId === DEMO_SHOP_ID) {
      return demoStore.addTransaction(tx);
    }
    return firebaseRepository.createTransaction(tx);
  },

  async createCampaign(data: Omit<Campaign, "id" | "usageCount" | "createdAt">): Promise<Campaign> {
    const campaign: Campaign = {
      ...data,
      id: generateId(),
      usageCount: 0,
      createdAt: new Date().toISOString(),
    };

    if (!isFirebaseConfigured() || data.shopId === DEMO_SHOP_ID) {
      return demoStore.addCampaign(campaign);
    }
    return firebaseRepository.createCampaign(campaign);
  },

  async toggleCampaign(id: string): Promise<Campaign | undefined> {
    if (!isFirebaseConfigured()) return demoStore.toggleCampaign(id);
    const shop = await this.getShop();
    if (shop.id === DEMO_SHOP_ID) return demoStore.toggleCampaign(id);
    return firebaseRepository.toggleCampaign(shop.id, id);
  },

  async updateShop(
    shopId: string,
    data: Partial<Pick<Shop, "name" | "email" | "phone" | "address" | "slug" | "description" | "openingHours">>
  ): Promise<Shop> {
    if (!isFirebaseConfigured() || shopId === DEMO_SHOP_ID) {
      return demoStore.updateShop(data);
    }
    return firebaseRepository.updateShop(shopId, data);
  },

  async updateService(
    id: string,
    data: Partial<Pick<Service, "name" | "description" | "durationMinutes" | "priceCents" | "active">>
  ): Promise<Service | undefined> {
    if (!isFirebaseConfigured()) return demoStore.updateService(id, data);
    const shop = await this.getShop();
    if (shop.id === DEMO_SHOP_ID) return demoStore.updateService(id, data);
    return firebaseRepository.updateService(shop.id, id, data);
  },

  async addService(data: Omit<Service, "id">): Promise<Service> {
    const service: Service = { ...data, id: generateId() };

    if (!isFirebaseConfigured() || data.shopId === DEMO_SHOP_ID) {
      return demoStore.addService(service);
    }
    return firebaseRepository.addService(service);
  },

  async deleteService(id: string): Promise<boolean> {
    if (!isFirebaseConfigured()) return demoStore.deleteService(id);
    const shop = await this.getShop();
    if (shop.id === DEMO_SHOP_ID) return demoStore.deleteService(id);
    return firebaseRepository.deleteService(shop.id, id);
  },

  async provisionShopForUser(
    ownerId: string,
    shopName: string,
    email: string
  ): Promise<Shop> {
    const slug = shopName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40) || "mio-salone";

    const defaultHours = demoStore.getShop().openingHours;
    const shop: Shop = {
      id: generateId(),
      slug,
      name: shopName,
      ownerId,
      email,
      plan: "starter",
      openingHours: defaultHours,
      createdAt: new Date().toISOString(),
    };

    if (!isFirebaseConfigured()) {
      demoStore.updateShop({
        name: shop.name,
        slug: shop.slug,
        email: shop.email,
        ownerId: shop.ownerId,
      });
      return { ...demoStore.getShop(), ...shop };
    }

    await firebaseRepository.createShop(shop);

    const defaultServices = demoStore.getServices();
    for (const svc of defaultServices) {
      await firebaseRepository.addService({
        ...svc,
        id: generateId(),
        shopId: shop.id,
      });
    }

    const defaultCampaigns = demoStore.getCampaigns();
    for (const camp of defaultCampaigns) {
      await firebaseRepository.createCampaign({
        ...camp,
        id: generateId(),
        shopId: shop.id,
        usageCount: 0,
        createdAt: new Date().toISOString(),
      });
    }

    return shop;
  },
};
