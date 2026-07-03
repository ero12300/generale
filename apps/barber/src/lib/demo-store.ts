"use client";

import {
  type Booking,
  type Campaign,
  type Client,
  type Organization,
  type Service,
  type Transaction,
} from "@/types";
import { generateId } from "./utils";

const STORAGE_KEY = "filo:demo:v1";
const DEMO_ORG_ID = "demo-org";

type Store = {
  organization: Organization;
  services: Service[];
  clients: Client[];
  bookings: Booking[];
  transactions: Transaction[];
  campaigns: Campaign[];
};

function daysAgo(days: number, hour = 10, min = 0): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(hour, min, 0, 0);
  return d.toISOString();
}

function todayAt(hour: number, min = 0, offsetDays = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  d.setHours(hour, min, 0, 0);
  return d.toISOString();
}

function addMinutes(iso: string, minutes: number): string {
  return new Date(new Date(iso).getTime() + minutes * 60_000).toISOString();
}

function buildSeed(): Store {
  const now = new Date().toISOString();
  const services: Service[] = [
    { id: "svc_taglio", organizationId: DEMO_ORG_ID, name: "Taglio Classico", durationMin: 30, price: 25, color: "#d4a72c", active: true },
    { id: "svc_barba", organizationId: DEMO_ORG_ID, name: "Rasatura Barba", durationMin: 25, price: 18, color: "#e6c14a", active: true },
    { id: "svc_combo", organizationId: DEMO_ORG_ID, name: "Combo Taglio + Barba", durationMin: 50, price: 38, color: "#f0d97e", active: true },
    { id: "svc_kids", organizationId: DEMO_ORG_ID, name: "Taglio Bambino", durationMin: 20, price: 15, color: "#8a91a3", active: true },
    { id: "svc_shampoo", organizationId: DEMO_ORG_ID, name: "Shampoo & Massaggio", durationMin: 15, price: 10, color: "#34d399", active: true },
    { id: "svc_royal", organizationId: DEMO_ORG_ID, name: "Trattamento Royal", durationMin: 75, price: 65, color: "#b8891f", active: true },
  ];

  const clients: Client[] = [
    { id: "cli_1", organizationId: DEMO_ORG_ID, fullName: "Marco Rossi",     phone: "+39 333 1234567", email: "marco.rossi@example.com",   tags: ["VIP", "abbonato"], notes: "Preferisce sfumatura media",           totalVisits: 24, totalSpent: 720, lastVisitAt: daysAgo(3),  loyaltyPoints: 24, createdAt: daysAgo(400) },
    { id: "cli_2", organizationId: DEMO_ORG_ID, fullName: "Luca Bianchi",    phone: "+39 340 9876543", email: "luca.b@example.com",         tags: ["VIP"],             notes: "Barba lunga stilizzata",              totalVisits: 18, totalSpent: 612, lastVisitAt: daysAgo(6),  loyaltyPoints: 18, createdAt: daysAgo(300) },
    { id: "cli_3", organizationId: DEMO_ORG_ID, fullName: "Giulia Ferrari",  phone: "+39 348 5551122", email: "giulia.f@example.com",       tags: ["nuovo"],           notes: "",                                     totalVisits: 3,  totalSpent: 78,  lastVisitAt: daysAgo(10), loyaltyPoints: 3,  createdAt: daysAgo(45)  },
    { id: "cli_4", organizationId: DEMO_ORG_ID, fullName: "Alessandro Conti",phone: "+39 335 4433221", email: "ale.conti@example.com",      tags: ["abbonato"],        notes: "Allergico ad alcuni after-shave",     totalVisits: 12, totalSpent: 336, lastVisitAt: daysAgo(2),  loyaltyPoints: 12, createdAt: daysAgo(220) },
    { id: "cli_5", organizationId: DEMO_ORG_ID, fullName: "Davide Marino",   phone: "+39 366 8899001", email: "davide.m@example.com",       tags: [],                  notes: "",                                     totalVisits: 8,  totalSpent: 200, lastVisitAt: daysAgo(15), loyaltyPoints: 8,  createdAt: daysAgo(120) },
    { id: "cli_6", organizationId: DEMO_ORG_ID, fullName: "Francesco Greco", phone: "+39 320 7654321", email: "",                            tags: ["porta-un-amico"], notes: "Portato da Marco Rossi",              totalVisits: 2,  totalSpent: 76,  lastVisitAt: daysAgo(20), loyaltyPoints: 2,  createdAt: daysAgo(28)  },
    { id: "cli_7", organizationId: DEMO_ORG_ID, fullName: "Riccardo Neri",   phone: "+39 351 1122334", email: "riccardo.n@example.com",     tags: ["VIP"],             notes: "Barba curata, prefers senior barber",  totalVisits: 30, totalSpent: 1140, lastVisitAt: daysAgo(4), loyaltyPoints: 30, createdAt: daysAgo(500) },
    { id: "cli_8", organizationId: DEMO_ORG_ID, fullName: "Simone Lombardi", phone: "+39 328 4455667", email: "simone.l@example.com",       tags: ["nuovo"],           notes: "",                                     totalVisits: 1,  totalSpent: 25,  lastVisitAt: daysAgo(1),  loyaltyPoints: 1,  createdAt: daysAgo(2)   },
  ];

  const staffName = "Antonio";
  const bookings: Booking[] = [
    { id: generateId("bkg"), organizationId: DEMO_ORG_ID, clientId: "cli_1", clientName: "Marco Rossi",       clientPhone: "+39 333 1234567", serviceId: "svc_combo",   serviceName: "Combo Taglio + Barba",     staffName, startAt: todayAt(9, 30),   endAt: addMinutes(todayAt(9, 30), 50),  price: 38, status: "confirmed",    notes: "", source: "internal", createdAt: daysAgo(2) },
    { id: generateId("bkg"), organizationId: DEMO_ORG_ID, clientId: "cli_4", clientName: "Alessandro Conti",  clientPhone: "+39 335 4433221", serviceId: "svc_taglio",  serviceName: "Taglio Classico",          staffName, startAt: todayAt(10, 45),  endAt: addMinutes(todayAt(10, 45), 30), price: 25, status: "confirmed",    notes: "", source: "internal", createdAt: daysAgo(1) },
    { id: generateId("bkg"), organizationId: DEMO_ORG_ID, clientId: "cli_2", clientName: "Luca Bianchi",      clientPhone: "+39 340 9876543", serviceId: "svc_royal",   serviceName: "Trattamento Royal",         staffName, startAt: todayAt(11, 30),  endAt: addMinutes(todayAt(11, 30), 75), price: 65, status: "in_progress",  notes: "", source: "public",   createdAt: daysAgo(3) },
    { id: generateId("bkg"), organizationId: DEMO_ORG_ID, clientId: "cli_7", clientName: "Riccardo Neri",     clientPhone: "+39 351 1122334", serviceId: "svc_barba",   serviceName: "Rasatura Barba",            staffName, startAt: todayAt(14, 0),   endAt: addMinutes(todayAt(14, 0), 25),  price: 18, status: "confirmed",    notes: "", source: "internal", createdAt: daysAgo(1) },
    { id: generateId("bkg"), organizationId: DEMO_ORG_ID, clientId: "cli_3", clientName: "Giulia Ferrari",    clientPhone: "+39 348 5551122", serviceId: "svc_shampoo", serviceName: "Shampoo & Massaggio",       staffName, startAt: todayAt(15, 30),  endAt: addMinutes(todayAt(15, 30), 15), price: 10, status: "confirmed",    notes: "", source: "public",   createdAt: daysAgo(0) },
    { id: generateId("bkg"), organizationId: DEMO_ORG_ID, clientId: "cli_5", clientName: "Davide Marino",     clientPhone: "+39 366 8899001", serviceId: "svc_taglio",  serviceName: "Taglio Classico",          staffName, startAt: todayAt(16, 30),  endAt: addMinutes(todayAt(16, 30), 30), price: 25, status: "confirmed",    notes: "", source: "internal", createdAt: daysAgo(1) },
    { id: generateId("bkg"), organizationId: DEMO_ORG_ID, clientId: "cli_8", clientName: "Simone Lombardi",   clientPhone: "+39 328 4455667", serviceId: "svc_combo",   serviceName: "Combo Taglio + Barba",     staffName, startAt: todayAt(17, 45),  endAt: addMinutes(todayAt(17, 45), 50), price: 38, status: "pending",      notes: "Prima visita",     source: "public",   createdAt: daysAgo(0) },
    { id: generateId("bkg"), organizationId: DEMO_ORG_ID, clientId: "cli_6", clientName: "Francesco Greco",   clientPhone: "+39 320 7654321", serviceId: "svc_taglio",  serviceName: "Taglio Classico",          staffName, startAt: todayAt(10, 0, 1), endAt: addMinutes(todayAt(10, 0, 1), 30),price: 25, status: "confirmed",    notes: "", source: "internal", createdAt: daysAgo(0) },
    { id: generateId("bkg"), organizationId: DEMO_ORG_ID, clientId: "cli_1", clientName: "Marco Rossi",       clientPhone: "+39 333 1234567", serviceId: "svc_barba",   serviceName: "Rasatura Barba",            staffName, startAt: todayAt(11, 0, 1), endAt: addMinutes(todayAt(11, 0, 1), 25),price: 18, status: "confirmed",    notes: "", source: "internal", createdAt: daysAgo(0) },
    { id: generateId("bkg"), organizationId: DEMO_ORG_ID, clientId: "cli_2", clientName: "Luca Bianchi",      clientPhone: "+39 340 9876543", serviceId: "svc_royal",   serviceName: "Trattamento Royal",         staffName, startAt: todayAt(15, 0, 2), endAt: addMinutes(todayAt(15, 0, 2), 75),price: 65, status: "confirmed",    notes: "", source: "public",   createdAt: daysAgo(0) },
  ];

  const transactions: Transaction[] = [];
  for (let d = 30; d >= 0; d--) {
    const perDay = d === 0 ? 5 : 6 + Math.floor(Math.random() * 6);
    for (let i = 0; i < perDay; i++) {
      const svc = services[Math.floor(Math.random() * services.length)]!;
      const client = clients[Math.floor(Math.random() * clients.length)]!;
      const method: "cash" | "card" = Math.random() > 0.55 ? "card" : "cash";
      const tip = Math.random() > 0.7 ? Math.round(Math.random() * 5) : 0;
      const now = new Date();
      const hour = d === 0
        ? Math.min(now.getHours(), 9 + Math.floor(Math.random() * Math.max(1, now.getHours() - 9)))
        : 10 + Math.floor(Math.random() * 8);
      transactions.push({
        id: generateId("tx"),
        organizationId: DEMO_ORG_ID,
        clientId: client.id,
        clientName: client.fullName,
        serviceName: svc.name,
        amount: svc.price,
        method,
        tipAmount: tip,
        discountAmount: 0,
        createdAt: daysAgo(d, hour, Math.floor(Math.random() * 60)),
      });
    }
  }

  const campaigns: Campaign[] = [
    { id: "cmp_welcome", organizationId: DEMO_ORG_ID, name: "Benvenuto - Prima visita",    kind: "discount",  code: "WELCOME10",   discountPercent: 10, discountAmount: 0, referralRewardEuro: 0, active: true, redemptions: 12, maxRedemptions: 100, createdAt: daysAgo(60), validUntil: daysAgo(-30) },
    { id: "cmp_referral", organizationId: DEMO_ORG_ID, name: "Porta un amico - 5€ a te",   kind: "referral",  code: "AMICO5",      discountPercent: 0,  discountAmount: 5, referralRewardEuro: 5, active: true, redemptions: 7,  createdAt: daysAgo(90) },
    { id: "cmp_loyalty",  organizationId: DEMO_ORG_ID, name: "Fedeltà - 10 tagli 1 gratis",kind: "loyalty",   code: "LOYAL10",     discountPercent: 100,discountAmount: 0, referralRewardEuro: 0, active: true, redemptions: 3,  createdAt: daysAgo(120) },
  ];

  const organization: Organization = {
    id: DEMO_ORG_ID,
    name: "Filo Barber Studio",
    slug: "filo-barber-studio",
    ownerUid: "demo-user",
    tier: "pro",
    timezone: "Europe/Rome",
    currency: "EUR",
    address: "Via Montenapoleone 12, Milano",
    phone: "+39 02 1234567",
    openingHours: [
      { weekday: 1, open: "09:00", close: "19:30", closed: false },
      { weekday: 2, open: "09:00", close: "19:30", closed: false },
      { weekday: 3, open: "09:00", close: "19:30", closed: false },
      { weekday: 4, open: "09:00", close: "20:00", closed: false },
      { weekday: 5, open: "09:00", close: "20:00", closed: false },
      { weekday: 6, open: "09:00", close: "18:00", closed: false },
      { weekday: 0, open: "10:00", close: "13:00", closed: true },
    ],
    createdAt: now,
  };

  return { organization, services, clients, bookings, transactions, campaigns };
}

let cache: Store | null = null;

function loadStore(): Store {
  if (cache) return cache;
  if (typeof window === "undefined") {
    cache = buildSeed();
    return cache;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      cache = JSON.parse(raw) as Store;
      return cache;
    }
  } catch {
    // fallthrough
  }
  cache = buildSeed();
  saveStore();
  return cache;
}

function saveStore() {
  if (typeof window === "undefined" || !cache) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  } catch {
    // ignore quota
  }
}

export const demoStore = {
  reset(): void {
    cache = buildSeed();
    saveStore();
  },
  getOrganization(): Organization {
    return loadStore().organization;
  },
  updateOrganization(patch: Partial<Organization>): Organization {
    const s = loadStore();
    s.organization = { ...s.organization, ...patch };
    saveStore();
    return s.organization;
  },
  listServices(): Service[] {
    return loadStore().services;
  },
  upsertService(svc: Service): Service {
    const s = loadStore();
    const idx = s.services.findIndex((x) => x.id === svc.id);
    if (idx >= 0) s.services[idx] = svc;
    else s.services.push(svc);
    saveStore();
    return svc;
  },
  deleteService(id: string): void {
    const s = loadStore();
    s.services = s.services.filter((x) => x.id !== id);
    saveStore();
  },
  listClients(): Client[] {
    return loadStore().clients.sort((a, b) => a.fullName.localeCompare(b.fullName));
  },
  getClient(id: string): Client | undefined {
    return loadStore().clients.find((x) => x.id === id);
  },
  upsertClient(client: Client): Client {
    const s = loadStore();
    const idx = s.clients.findIndex((x) => x.id === client.id);
    if (idx >= 0) s.clients[idx] = client;
    else s.clients.push(client);
    saveStore();
    return client;
  },
  deleteClient(id: string): void {
    const s = loadStore();
    s.clients = s.clients.filter((x) => x.id !== id);
    saveStore();
  },
  listBookings(): Booking[] {
    return loadStore().bookings.sort((a, b) => a.startAt.localeCompare(b.startAt));
  },
  upsertBooking(booking: Booking): Booking {
    const s = loadStore();
    const idx = s.bookings.findIndex((x) => x.id === booking.id);
    if (idx >= 0) s.bookings[idx] = booking;
    else s.bookings.push(booking);
    saveStore();
    return booking;
  },
  deleteBooking(id: string): void {
    const s = loadStore();
    s.bookings = s.bookings.filter((x) => x.id !== id);
    saveStore();
  },
  updateBookingStatus(id: string, status: Booking["status"]): Booking | undefined {
    const s = loadStore();
    const b = s.bookings.find((x) => x.id === id);
    if (b) {
      b.status = status;
      saveStore();
    }
    return b;
  },
  listTransactions(): Transaction[] {
    return loadStore().transactions.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },
  addTransaction(tx: Transaction): Transaction {
    const s = loadStore();
    s.transactions.unshift(tx);
    saveStore();
    return tx;
  },
  deleteTransaction(id: string): void {
    const s = loadStore();
    s.transactions = s.transactions.filter((x) => x.id !== id);
    saveStore();
  },
  listCampaigns(): Campaign[] {
    return loadStore().campaigns;
  },
  upsertCampaign(cmp: Campaign): Campaign {
    const s = loadStore();
    const idx = s.campaigns.findIndex((x) => x.id === cmp.id);
    if (idx >= 0) s.campaigns[idx] = cmp;
    else s.campaigns.push(cmp);
    saveStore();
    return cmp;
  },
  deleteCampaign(id: string): void {
    const s = loadStore();
    s.campaigns = s.campaigns.filter((x) => x.id !== id);
    saveStore();
  },
  incrementCampaignRedemption(id: string): void {
    const s = loadStore();
    const c = s.campaigns.find((x) => x.id === id);
    if (c) {
      c.redemptions += 1;
      saveStore();
    }
  },
};

export { DEMO_ORG_ID };
