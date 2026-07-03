"use client";

import { demoStore } from "@/lib/demo/store";
import { isFirebaseConfigured } from "@/lib/firebase/client";
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

export function useDemoMode(): boolean {
  return !isFirebaseConfigured();
}

export const dataStore = {
  async getShop(): Promise<Shop> {
    return demoStore.getShop();
  },

  async getShopBySlug(slug: string): Promise<Shop | null> {
    return demoStore.getShopBySlug(slug);
  },

  async getServices(shopId: string): Promise<Service[]> {
    return demoStore.getServices().filter((s) => s.shopId === shopId);
  },

  async getCustomers(shopId: string): Promise<Customer[]> {
    return demoStore.getCustomers().filter((c) => c.shopId === shopId);
  },

  async getBookings(shopId: string): Promise<Booking[]> {
    return demoStore.getBookings().filter((b) => b.shopId === shopId);
  },

  async getTransactions(shopId: string): Promise<Transaction[]> {
    return demoStore.getTransactions().filter((t) => t.shopId === shopId);
  },

  async getCampaigns(shopId: string): Promise<Campaign[]> {
    return demoStore.getCampaigns().filter((c) => c.shopId === shopId);
  },

  async getStats(shopId: string): Promise<DashboardStats> {
    void shopId;
    return demoStore.getStats();
  },

  async createCustomer(
    data: Omit<Customer, "id" | "shopId" | "referralCode" | "loyaltyPoints" | "totalVisits" | "totalSpentCents" | "createdAt"> & { shopId: string }
  ): Promise<Customer> {
    const { shopId, ...rest } = data;
    void shopId;
    return demoStore.addCustomer(rest);
  },

  async createBooking(
    data: Omit<Booking, "id" | "createdAt" | "status">
  ): Promise<Booking> {
    return demoStore.addBooking(data);
  },

  async updateBookingStatus(id: string, status: BookingStatus): Promise<Booking | undefined> {
    return demoStore.updateBookingStatus(id, status);
  },

  async createTransaction(
    data: Omit<Transaction, "id" | "createdAt">
  ): Promise<Transaction> {
    return demoStore.addTransaction(data);
  },

  async createCampaign(
    data: Omit<Campaign, "id" | "usageCount" | "createdAt">
  ): Promise<Campaign> {
    return demoStore.addCampaign(data);
  },

  async toggleCampaign(id: string): Promise<Campaign | undefined> {
    return demoStore.toggleCampaign(id);
  },
};
