"use client";

import type {
  BarbershopProfile,
  Booking,
  Campaign,
  Client,
  DashboardSummary,
  Revenue,
  Service,
  WeeklyHours,
} from "@/types";
import type { DataStore } from "./types";
import {
  DEMO_HOURS,
  DEMO_SERVICES,
  buildDemoDataset,
} from "@/lib/demo/data";
import {
  addDays,
  endOfDay,
  generateReferralCode,
  isSameDay,
  slugify,
  startOfDay,
  startOfWeek,
} from "@/lib/utils";

const KEY = "barber.demo.v1";

interface Snapshot {
  shop: BarbershopProfile;
  clients: Client[];
  bookings: Booking[];
  revenues: Revenue[];
  campaigns: Campaign[];
}

function defaultShop(): BarbershopProfile {
  return {
    ownerUid: "demo-owner",
    slug: "demo-shop",
    name: "Barber Studio Milano",
    city: "Milano",
    address: "Corso Como 12, 20154",
    phone: "+39 02 1234 5678",
    email: "info@barberstudio.demo",
    services: DEMO_SERVICES,
    hours: DEMO_HOURS,
    slotMinutes: 15,
    currency: "EUR",
    updatedAt: new Date().toISOString(),
  };
}

function loadSnapshot(): Snapshot {
  if (typeof window === "undefined") {
    return {
      shop: defaultShop(),
      ...buildDemoDataset(),
    };
  }
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as Snapshot;
  } catch {}
  const initial: Snapshot = { shop: defaultShop(), ...buildDemoDataset() };
  window.localStorage.setItem(KEY, JSON.stringify(initial));
  return initial;
}

function persist(snap: Snapshot) {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(snap));
    } catch {}
  }
}

function nid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export function createLocalStore(
  setSnapshot: (updater: (prev: Snapshot) => Snapshot) => void,
  getSnapshot: () => Snapshot
): DataStore {
  const mutate = async (updater: (prev: Snapshot) => Snapshot) => {
    let next: Snapshot | null = null;
    setSnapshot((prev) => {
      next = updater(prev);
      return next;
    });
    if (next) persist(next);
  };

  return {
    ready: true,
    mode: "demo",
    get shop() {
      return getSnapshot().shop;
    },
    async updateShop(patch) {
      await mutate((prev) => ({
        ...prev,
        shop: { ...prev.shop, ...patch, slug: patch.name ? slugify(patch.name) : prev.shop.slug, updatedAt: new Date().toISOString() },
      }));
    },
    async updateServices(services: Service[]) {
      await mutate((prev) => ({ ...prev, shop: { ...prev.shop, services, updatedAt: new Date().toISOString() } }));
    },
    async updateHours(hours: WeeklyHours) {
      await mutate((prev) => ({ ...prev, shop: { ...prev.shop, hours, updatedAt: new Date().toISOString() } }));
    },
    get clients() {
      return getSnapshot().clients;
    },
    async createClient(input) {
      const client: Client = {
        id: nid("cli"),
        firstName: input.firstName,
        lastName: input.lastName,
        phone: input.phone,
        email: input.email,
        notes: input.notes,
        tags: input.tags ?? [],
        totalVisits: 0,
        totalSpentEur: 0,
        referralCode: generateReferralCode(input.firstName),
        referredByClientId: input.referredByClientId,
        createdAt: new Date().toISOString(),
      };
      await mutate((prev) => ({ ...prev, clients: [client, ...prev.clients] }));
      return client;
    },
    async updateClient(id, patch) {
      await mutate((prev) => ({
        ...prev,
        clients: prev.clients.map((c) => (c.id === id ? { ...c, ...patch } : c)),
      }));
    },
    async deleteClient(id) {
      await mutate((prev) => ({ ...prev, clients: prev.clients.filter((c) => c.id !== id) }));
    },
    get bookings() {
      return getSnapshot().bookings;
    },
    async createBooking(input) {
      const booking: Booking = {
        id: nid("bk"),
        ...input,
        status: input.status ?? "confirmed",
        source: input.source ?? "manual",
        createdAt: new Date().toISOString(),
      };
      await mutate((prev) => ({ ...prev, bookings: [booking, ...prev.bookings] }));
      return booking;
    },
    async updateBooking(id, patch) {
      await mutate((prev) => {
        const bookings = prev.bookings.map((b) => (b.id === id ? { ...b, ...patch } : b));
        let revenues = prev.revenues;
        let clients = prev.clients;
        const updated = bookings.find((b) => b.id === id);
        if (updated && patch.status === "completed" && !prev.revenues.find((r) => r.bookingId === id)) {
          revenues = [
            {
              id: nid("rev"),
              bookingId: updated.id,
              clientId: updated.clientId,
              clientName: updated.clientName,
              serviceName: updated.serviceName,
              amountEur: updated.priceEur,
              tipEur: 0,
              method: "cash",
              discountAmountEur: 0,
              createdAt: new Date().toISOString(),
            },
            ...prev.revenues,
          ];
          if (updated.clientId) {
            clients = prev.clients.map((c) =>
              c.id === updated.clientId
                ? {
                    ...c,
                    totalVisits: c.totalVisits + 1,
                    totalSpentEur: c.totalSpentEur + updated.priceEur,
                    lastVisitAt: updated.endAt,
                  }
                : c,
            );
          }
        }
        return { ...prev, bookings, revenues, clients };
      });
    },
    async deleteBooking(id) {
      await mutate((prev) => ({ ...prev, bookings: prev.bookings.filter((b) => b.id !== id) }));
    },
    get revenues() {
      return getSnapshot().revenues;
    },
    async createRevenue(input) {
      const rev: Revenue = {
        id: nid("rev"),
        ...input,
        createdAt: new Date().toISOString(),
      };
      await mutate((prev) => {
        let clients = prev.clients;
        if (rev.clientId) {
          clients = prev.clients.map((c) =>
            c.id === rev.clientId
              ? {
                  ...c,
                  totalVisits: c.totalVisits + 1,
                  totalSpentEur: c.totalSpentEur + rev.amountEur + rev.tipEur - rev.discountAmountEur,
                  lastVisitAt: rev.createdAt,
                }
              : c,
          );
        }
        return { ...prev, revenues: [rev, ...prev.revenues], clients };
      });
      return rev;
    },
    async deleteRevenue(id) {
      await mutate((prev) => ({ ...prev, revenues: prev.revenues.filter((r) => r.id !== id) }));
    },
    get campaigns() {
      return getSnapshot().campaigns;
    },
    async createCampaign(input) {
      const cmp: Campaign = { id: nid("cmp"), ...input, usageCount: 0, createdAt: new Date().toISOString() };
      await mutate((prev) => ({ ...prev, campaigns: [cmp, ...prev.campaigns] }));
      return cmp;
    },
    async updateCampaign(id, patch) {
      await mutate((prev) => ({
        ...prev,
        campaigns: prev.campaigns.map((c) => (c.id === id ? { ...c, ...patch } : c)),
      }));
    },
    async deleteCampaign(id) {
      await mutate((prev) => ({ ...prev, campaigns: prev.campaigns.filter((c) => c.id !== id) }));
    },
    summary(): DashboardSummary {
      const snap = getSnapshot();
      const now = new Date();
      const weekStart = startOfWeek(now);
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const todayRev = snap.revenues.filter((r) => isSameDay(new Date(r.createdAt), now));
      const todayBookings = snap.bookings.filter((b) => isSameDay(new Date(b.startAt), now));
      const weekRev = snap.revenues.filter((r) => new Date(r.createdAt) >= weekStart);
      const monthRev = snap.revenues.filter((r) => new Date(r.createdAt) >= monthStart);
      const upcoming = snap.bookings.filter(
        (b) => new Date(b.startAt) >= startOfDay(now) && b.status === "confirmed",
      );

      const svcMap = new Map<string, { count: number; revenueEur: number }>();
      for (const r of snap.revenues) {
        if (!r.serviceName) continue;
        const cur = svcMap.get(r.serviceName) ?? { count: 0, revenueEur: 0 };
        cur.count += 1;
        cur.revenueEur += r.amountEur;
        svcMap.set(r.serviceName, cur);
      }
      const topServices = [...svcMap.entries()]
        .map(([serviceName, v]) => ({ serviceName, ...v }))
        .sort((a, b) => b.revenueEur - a.revenueEur)
        .slice(0, 5);

      const last7Days: DashboardSummary["last7Days"] = [];
      for (let i = 6; i >= 0; i--) {
        const day = addDays(now, -i);
        const rev = snap.revenues
          .filter((r) => isSameDay(new Date(r.createdAt), day))
          .reduce((s, r) => s + r.amountEur + r.tipEur - r.discountAmountEur, 0);
        const bk = snap.bookings.filter(
          (b) => isSameDay(new Date(b.startAt), day) && (b.status === "completed" || b.status === "confirmed"),
        ).length;
        last7Days.push({
          date: startOfDay(day).toISOString(),
          revenueEur: rev,
          bookings: bk,
        });
      }
      void endOfDay;

      return {
        todayRevenueEur: todayRev.reduce((s, r) => s + r.amountEur + r.tipEur - r.discountAmountEur, 0),
        todayBookings: todayBookings.length,
        weekRevenueEur: weekRev.reduce((s, r) => s + r.amountEur + r.tipEur - r.discountAmountEur, 0),
        monthRevenueEur: monthRev.reduce((s, r) => s + r.amountEur + r.tipEur - r.discountAmountEur, 0),
        clientsCount: snap.clients.length,
        upcomingCount: upcoming.length,
        topServices,
        last7Days,
      };
    },
    resetDemo() {
      const initial: Snapshot = { shop: defaultShop(), ...buildDemoDataset() };
      setSnapshot(() => initial);
      persist(initial);
    },
  };
}

export function initialSnapshot(): Snapshot {
  return loadSnapshot();
}
