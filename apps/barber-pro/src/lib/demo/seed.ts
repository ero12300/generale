import type {
  Booking,
  Client,
  Coupon,
  Payment,
  ReferralEvent,
  Service,
  Shop,
  Staff,
} from "../types";
import { addMinutes, generateReferralCode, slugify } from "../utils";

const now = new Date();
function isoAt(dayOffset: number, hour: number, minute = 0): string {
  const d = new Date(now);
  d.setDate(d.getDate() + dayOffset);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

export interface DemoDataset {
  shop: Shop;
  services: Service[];
  staff: Staff[];
  clients: Client[];
  bookings: Booking[];
  payments: Payment[];
  coupons: Coupon[];
  referrals: ReferralEvent[];
}

export function createDemoDataset(shopId = "demo-shop"): DemoDataset {
  const shop: Shop = {
    id: shopId,
    slug: "salone-demo",
    name: "Salone Demo — BarberPro",
    ownerUid: "demo-user",
    address: "Via Roma 12, Milano",
    phone: "+39 02 1234 5678",
    plan: "pro",
    createdAt: now.toISOString(),
    brandColor: "#c9a24a",
    timezone: "Europe/Rome",
  };

  const services: Service[] = [
    { id: "svc-1", shopId, name: "Taglio Classico", durationMin: 30, priceCents: 2500, active: true, description: "Taglio con macchinetta e forbici, styling incluso." },
    { id: "svc-2", shopId, name: "Taglio + Barba", durationMin: 45, priceCents: 3800, active: true, description: "Il combo completo." },
    { id: "svc-3", shopId, name: "Barba Scolpita", durationMin: 25, priceCents: 1800, active: true },
    { id: "svc-4", shopId, name: "Rasatura Tradizionale", durationMin: 40, priceCents: 3000, active: true, description: "Con panno caldo, olio pre-barba, rasoio a mano libera." },
    { id: "svc-5", shopId, name: "Trattamento Capelli", durationMin: 30, priceCents: 2000, active: true },
  ];

  const staff: Staff[] = [
    { id: "stf-1", shopId, name: "Marco", role: "Master Barber", color: "#c9a24a", active: true },
    { id: "stf-2", shopId, name: "Luca", role: "Barber", color: "#8b5cf6", active: true },
    { id: "stf-3", shopId, name: "Giulia", role: "Barber", color: "#10b981", active: true },
  ];

  const clientSeeds: Array<Omit<Client, "id" | "shopId" | "referralCode" | "createdAt" | "tags" | "vip" | "totalSpentCents" | "visits" | "loyaltyPoints">> = [
    { name: "Andrea Bianchi", phone: "+39 333 1112223", email: "andrea@example.com", notes: "Preferisce Marco. Sfumatura bassa." },
    { name: "Federico Conte", phone: "+39 333 2223334", email: "fede@example.com" },
    { name: "Giovanni Russo", phone: "+39 335 5556667" },
    { name: "Matteo Ricci", phone: "+39 340 1234567", notes: "Allergie: profumazioni forti." },
    { name: "Simone Ferri", phone: "+39 348 9876543" },
    { name: "Davide Marino", phone: "+39 320 4455667", email: "davide@example.com" },
    { name: "Luca Rossi", phone: "+39 331 3344556" },
    { name: "Antonio Greco", phone: "+39 349 8877665" },
  ];

  const clients: Client[] = clientSeeds.map((c, i) => ({
    id: `cli-${i + 1}`,
    shopId,
    name: c.name,
    phone: c.phone,
    email: c.email,
    notes: c.notes,
    tags: i < 3 ? ["fidelizzato"] : [],
    vip: i === 0,
    referralCode: generateReferralCode(c.name),
    referredByClientId: null,
    totalSpentCents: [12500, 9500, 7000, 4500, 3800, 8100, 2500, 6200][i] ?? 0,
    visits: [5, 4, 3, 2, 2, 4, 1, 3][i] ?? 0,
    loyaltyPoints: [50, 38, 28, 18, 15, 32, 10, 24][i] ?? 0,
    createdAt: isoAt(-30 + i * 2, 10),
  }));

  const bookings: Booking[] = [
    // oggi
    ...[9, 10, 11, 12, 14, 15, 16, 17].map((h, i) => {
      const svc = services[i % services.length];
      const cli = clients[i % clients.length];
      const stf = staff[i % staff.length];
      const start = new Date(isoAt(0, h, i % 2 === 0 ? 0 : 30));
      const end = addMinutes(start, svc.durationMin);
      const status: Booking["status"] = h <= now.getHours() ? "completed" : "confirmed";
      return {
        id: `bk-today-${i}`,
        shopId,
        clientId: cli.id,
        staffId: stf.id,
        serviceId: svc.id,
        startAt: start.toISOString(),
        endAt: end.toISOString(),
        status,
        priceCents: svc.priceCents,
        createdAt: isoAt(-1, 9),
        source: (i % 3 === 0 ? "public" : "internal") as Booking["source"],
      };
    }),
    // ieri (completate)
    ...[10, 11, 14, 16].map((h, i) => {
      const svc = services[(i + 1) % services.length];
      const cli = clients[(i + 2) % clients.length];
      const stf = staff[(i + 1) % staff.length];
      const start = new Date(isoAt(-1, h));
      const end = addMinutes(start, svc.durationMin);
      return {
        id: `bk-yest-${i}`,
        shopId,
        clientId: cli.id,
        staffId: stf.id,
        serviceId: svc.id,
        startAt: start.toISOString(),
        endAt: end.toISOString(),
        status: "completed" as const,
        priceCents: svc.priceCents,
        createdAt: isoAt(-2, 12),
        source: "internal" as const,
      };
    }),
    // prossimi giorni
    ...[1, 1, 2, 2, 3, 4].map((day, i) => {
      const h = 10 + i;
      const svc = services[i % services.length];
      const cli = clients[(i + 3) % clients.length];
      const stf = staff[i % staff.length];
      const start = new Date(isoAt(day, h));
      const end = addMinutes(start, svc.durationMin);
      return {
        id: `bk-next-${i}`,
        shopId,
        clientId: cli.id,
        staffId: stf.id,
        serviceId: svc.id,
        startAt: start.toISOString(),
        endAt: end.toISOString(),
        status: "confirmed" as const,
        priceCents: svc.priceCents,
        createdAt: isoAt(0, 8),
        source: i % 2 === 0 ? "public" as const : "internal" as const,
      };
    }),
  ];

  const payments: Payment[] = bookings
    .filter((b) => b.status === "completed")
    .map((b, i) => ({
      id: `pay-${i + 1}`,
      shopId,
      bookingId: b.id,
      clientId: b.clientId,
      amountCents: b.priceCents,
      method: (["cash", "card", "card", "cash"] as const)[i % 4],
      createdAt: b.endAt,
    }));

  const coupons: Coupon[] = [
    {
      id: "cp-1",
      shopId,
      code: "BENVENUTO10",
      discountPercent: 10,
      active: true,
      redemptions: 12,
      maxRedemptions: 100,
      createdAt: isoAt(-45, 12),
    },
    {
      id: "cp-2",
      shopId,
      code: "ESTATE5",
      discountCents: 500,
      active: true,
      redemptions: 34,
      createdAt: isoAt(-20, 12),
    },
  ];

  const referrals: ReferralEvent[] = [
    { id: "rf-1", shopId, referrerClientId: clients[0].id, newClientId: clients[3].id, status: "rewarded", createdAt: isoAt(-10, 15), rewardCents: 500 },
    { id: "rf-2", shopId, referrerClientId: clients[1].id, newClientId: clients[4].id, status: "pending", createdAt: isoAt(-3, 15), rewardCents: 500 },
  ];

  return { shop, services, staff, clients, bookings, payments, coupons, referrals };
}

export const demoShopSlug = slugify("Salone Demo");
