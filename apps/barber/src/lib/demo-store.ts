"use client";

/**
 * Demo store: dati in-memory per far girare l'app senza Firebase.
 * Persistiti in localStorage così le modifiche restano tra i refresh.
 */

import type {
  Booking,
  Campaign,
  Client,
  Payment,
  Service,
  Shop,
} from "@/types";
import { slugify } from "@/lib/utils";

const STORAGE_KEY = "barberpro:demo:v1";

type State = {
  shop: Shop;
  services: Service[];
  clients: Client[];
  bookings: Booking[];
  campaigns: Campaign[];
  payments: Payment[];
};

// -----------------------------------------------------------------------------
// Seed iniziale — un barbershop premium di esempio
// -----------------------------------------------------------------------------

function iso(daysOffset: number, hour: number, minute = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

function makeSeed(): State {
  const shop: Shop = {
    id: "shop_demo",
    ownerId: "user_demo",
    slug: "barberia-del-corso",
    name: "Barberia del Corso",
    city: "Milano",
    address: "Via del Corso 12, 20121 Milano",
    phone: "+39 02 1234 5678",
    logoUrl: undefined,
    colorAccent: "#c9a24b",
    openingHours: {
      0: null,
      1: { open: "09:00", close: "19:00" },
      2: { open: "09:00", close: "19:00" },
      3: { open: "09:00", close: "19:00" },
      4: { open: "09:00", close: "20:00" },
      5: { open: "09:00", close: "20:00" },
      6: { open: "09:00", close: "18:00" },
    },
    plan: "pro",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90).toISOString(),
  };

  const services: Service[] = [
    {
      id: "svc_taglio",
      shopId: shop.id,
      name: "Taglio Signature",
      durationMinutes: 45,
      priceCents: 3500,
      description: "Taglio personalizzato con consulenza look e styling finale.",
      featured: true,
      active: true,
    },
    {
      id: "svc_barba",
      shopId: shop.id,
      name: "Barba tradizionale",
      durationMinutes: 30,
      priceCents: 2500,
      description: "Rasatura classica con panno caldo, olio e balsamo.",
      active: true,
    },
    {
      id: "svc_combo",
      shopId: shop.id,
      name: "Taglio + Barba Deluxe",
      durationMinutes: 75,
      priceCents: 5500,
      description: "L'esperienza completa: taglio signature e rituale barba.",
      featured: true,
      active: true,
    },
    {
      id: "svc_kids",
      shopId: shop.id,
      name: "Taglio bambino",
      durationMinutes: 30,
      priceCents: 2000,
      description: "Taglio per under 10, con caramella finale.",
      active: true,
    },
    {
      id: "svc_ritual",
      shopId: shop.id,
      name: "Rituale VIP",
      durationMinutes: 90,
      priceCents: 8500,
      description:
        "Shampoo, massaggio cranio, taglio, barba, skincare finale. 90 minuti di puro relax.",
      active: true,
    },
  ];

  const clients: Client[] = [
    {
      id: "cli_marco",
      shopId: shop.id,
      name: "Marco Bianchi",
      phone: "+39 333 1234567",
      email: "marco.bianchi@example.com",
      notes: "Preferisce taglio corto ai lati, sfumatura media.",
      totalVisits: 14,
      totalSpentCents: 49500,
      lastVisitAt: iso(-8, 15),
      createdAt: iso(-180, 10),
      referralCode: "MARCO-234",
      tags: ["VIP", "Fedele"],
    },
    {
      id: "cli_luca",
      shopId: shop.id,
      name: "Luca Ferrari",
      phone: "+39 348 9876543",
      email: "luca@example.com",
      notes: "Barba sempre curata, viene ogni 2 settimane.",
      totalVisits: 22,
      totalSpentCents: 82000,
      lastVisitAt: iso(-2, 11),
      createdAt: iso(-260, 15),
      referralCode: "LUCA-891",
      tags: ["VIP"],
    },
    {
      id: "cli_andrea",
      shopId: shop.id,
      name: "Andrea Ricci",
      phone: "+39 320 5551122",
      email: "a.ricci@example.com",
      notes: "Nuovo cliente, invitato da Marco.",
      totalVisits: 2,
      totalSpentCents: 6000,
      lastVisitAt: iso(-15, 17),
      createdAt: iso(-45, 12),
      referralCode: "ANDREA-556",
      referredBy: "cli_marco",
    },
    {
      id: "cli_paolo",
      shopId: shop.id,
      name: "Paolo Verdi",
      phone: "+39 331 4433221",
      email: "paolo.verdi@example.com",
      totalVisits: 5,
      totalSpentCents: 18500,
      lastVisitAt: iso(-30, 10),
      createdAt: iso(-95, 14),
      referralCode: "PAOLO-102",
      tags: ["Fedele"],
    },
    {
      id: "cli_stefano",
      shopId: shop.id,
      name: "Stefano Costa",
      phone: "+39 349 7788990",
      totalVisits: 1,
      totalSpentCents: 3500,
      lastVisitAt: iso(-1, 16),
      createdAt: iso(-1, 16),
      referralCode: "STEF-771",
      tags: ["Nuovo"],
    },
  ];

  const bookings: Booking[] = [
    {
      id: "bk_1",
      shopId: shop.id,
      clientId: "cli_marco",
      clientName: "Marco Bianchi",
      clientPhone: "+39 333 1234567",
      serviceId: "svc_taglio",
      serviceName: "Taglio Signature",
      priceCents: 3500,
      startsAt: iso(0, 15),
      endsAt: iso(0, 15, 45),
      status: "confirmed",
      createdAt: iso(-2, 10),
      source: "internal",
    },
    {
      id: "bk_2",
      shopId: shop.id,
      clientId: "cli_luca",
      clientName: "Luca Ferrari",
      clientPhone: "+39 348 9876543",
      serviceId: "svc_combo",
      serviceName: "Taglio + Barba Deluxe",
      priceCents: 5500,
      startsAt: iso(0, 17),
      endsAt: iso(0, 18, 15),
      status: "confirmed",
      createdAt: iso(-3, 9),
      source: "public",
    },
    {
      id: "bk_3",
      shopId: shop.id,
      clientId: "cli_andrea",
      clientName: "Andrea Ricci",
      clientPhone: "+39 320 5551122",
      serviceId: "svc_barba",
      serviceName: "Barba tradizionale",
      priceCents: 2500,
      startsAt: iso(1, 11),
      endsAt: iso(1, 11, 30),
      status: "pending",
      createdAt: iso(-1, 20),
      source: "referral",
      discountCents: 500,
      discountReason: "Codice referral MARCO-234",
    },
    {
      id: "bk_4",
      shopId: shop.id,
      clientId: "cli_paolo",
      clientName: "Paolo Verdi",
      serviceId: "svc_ritual",
      serviceName: "Rituale VIP",
      priceCents: 8500,
      startsAt: iso(2, 16),
      endsAt: iso(2, 17, 30),
      status: "confirmed",
      createdAt: iso(-5, 14),
      source: "internal",
    },
    // Prenotazioni passate completate — servono per gli incassi
    ...Array.from({ length: 18 }).map((_, i): Booking => {
      const day = -1 - Math.floor(i / 3);
      const hour = 10 + (i % 6);
      const price = [2500, 3500, 5500, 2000, 8500][i % 5];
      const svcId = ["svc_barba", "svc_taglio", "svc_combo", "svc_kids", "svc_ritual"][i % 5];
      const svcName = [
        "Barba tradizionale",
        "Taglio Signature",
        "Taglio + Barba Deluxe",
        "Taglio bambino",
        "Rituale VIP",
      ][i % 5];
      const names = [
        "Marco Bianchi",
        "Luca Ferrari",
        "Paolo Verdi",
        "Andrea Ricci",
        "Stefano Costa",
      ];
      return {
        id: `bk_past_${i}`,
        shopId: shop.id,
        clientName: names[i % names.length],
        serviceId: svcId,
        serviceName: svcName,
        priceCents: price,
        startsAt: iso(day, hour),
        endsAt: iso(day, hour + 1),
        status: "completed",
        createdAt: iso(day, hour - 1),
        source: i % 4 === 0 ? "public" : "internal",
      };
    }),
  ];

  const campaigns: Campaign[] = [
    {
      id: "cmp_referral",
      shopId: shop.id,
      type: "referral",
      name: "Porta un amico — 5€ per entrambi",
      active: true,
      discountValue: 500,
      discountKind: "fixed",
      redemptions: 3,
      maxRedemptions: 50,
      createdAt: iso(-30, 10),
      description:
        "Il cliente che invita e l'amico invitato ricevono 5€ di sconto sul prossimo servizio.",
    },
    {
      id: "cmp_welcome",
      shopId: shop.id,
      type: "discount",
      name: "Benvenuto — 15% sul primo taglio",
      active: true,
      discountValue: 15,
      discountKind: "percent",
      code: "BENVENUTO15",
      redemptions: 8,
      maxRedemptions: 100,
      createdAt: iso(-60, 10),
      description: "Sconto per i nuovi clienti sulla prima prenotazione.",
    },
  ];

  const payments: Payment[] = bookings
    .filter((b) => b.status === "completed")
    .map((b) => ({
      id: `pay_${b.id}`,
      shopId: shop.id,
      bookingId: b.id,
      clientId: b.clientId,
      amountCents: b.priceCents - (b.discountCents ?? 0),
      method: (["cash", "card", "card", "card"] as const)[
        Math.abs(b.id.length) % 4
      ],
      createdAt: b.startsAt,
    }));

  return { shop, services, clients, bookings, campaigns, payments };
}

// -----------------------------------------------------------------------------
// Store: carica/salva su localStorage
// -----------------------------------------------------------------------------

function loadState(): State {
  if (typeof window === "undefined") return makeSeed();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as State;
  } catch {
    // fallback al seed
  }
  const seed = makeSeed();
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
  } catch {
    // ignore
  }
  return seed;
}

function saveState(state: State) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent("barberpro:store:changed"));
  } catch {
    // storage pieno? ignora silenziosamente
  }
}

// -----------------------------------------------------------------------------
// API pubblica del demo store
// -----------------------------------------------------------------------------

export const demoStore = {
  getState(): State {
    return loadState();
  },
  reset() {
    const seed = makeSeed();
    saveState(seed);
    return seed;
  },
  update(fn: (state: State) => State) {
    const next = fn(loadState());
    saveState(next);
    return next;
  },
  subscribe(cb: () => void) {
    if (typeof window === "undefined") return () => {};
    window.addEventListener("barberpro:store:changed", cb);
    window.addEventListener("storage", cb);
    return () => {
      window.removeEventListener("barberpro:store:changed", cb);
      window.removeEventListener("storage", cb);
    };
  },

  // ----------------------------------------------------- Services
  createService(svc: Omit<Service, "id" | "shopId">): Service {
    const state = loadState();
    const created: Service = {
      ...svc,
      id: `svc_${Date.now()}`,
      shopId: state.shop.id,
    };
    saveState({ ...state, services: [...state.services, created] });
    return created;
  },
  updateService(id: string, patch: Partial<Service>) {
    demoStore.update((s) => ({
      ...s,
      services: s.services.map((sv) => (sv.id === id ? { ...sv, ...patch } : sv)),
    }));
  },
  deleteService(id: string) {
    demoStore.update((s) => ({
      ...s,
      services: s.services.filter((sv) => sv.id !== id),
    }));
  },

  // ----------------------------------------------------- Clients
  createClient(
    payload: Omit<Client, "id" | "shopId" | "totalVisits" | "totalSpentCents" | "createdAt" | "referralCode">
  ): Client {
    const state = loadState();
    const created: Client = {
      ...payload,
      id: `cli_${Date.now()}`,
      shopId: state.shop.id,
      totalVisits: 0,
      totalSpentCents: 0,
      createdAt: new Date().toISOString(),
      referralCode: `${slugify(payload.name).toUpperCase().slice(0, 8)}-${Math.floor(Math.random() * 900 + 100)}`,
    };
    saveState({ ...state, clients: [...state.clients, created] });
    return created;
  },
  updateClient(id: string, patch: Partial<Client>) {
    demoStore.update((s) => ({
      ...s,
      clients: s.clients.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    }));
  },
  deleteClient(id: string) {
    demoStore.update((s) => ({
      ...s,
      clients: s.clients.filter((c) => c.id !== id),
    }));
  },

  // ----------------------------------------------------- Bookings
  createBooking(
    payload: Omit<Booking, "id" | "shopId" | "createdAt" | "status" | "source"> & {
      status?: Booking["status"];
      source?: Booking["source"];
    }
  ): Booking {
    const state = loadState();
    const created: Booking = {
      ...payload,
      id: `bk_${Date.now()}`,
      shopId: state.shop.id,
      createdAt: new Date().toISOString(),
      status: payload.status ?? "pending",
      source: payload.source ?? "internal",
    };
    saveState({ ...state, bookings: [created, ...state.bookings] });
    return created;
  },
  updateBooking(id: string, patch: Partial<Booking>) {
    demoStore.update((s) => {
      const next = {
        ...s,
        bookings: s.bookings.map((b) => (b.id === id ? { ...b, ...patch } : b)),
      };
      // Se completata, crea pagamento e aggiorna cliente
      const b = next.bookings.find((x) => x.id === id);
      if (b && patch.status === "completed") {
        const existingPayment = next.payments.find((p) => p.bookingId === b.id);
        if (!existingPayment) {
          const net = b.priceCents - (b.discountCents ?? 0);
          next.payments = [
            ...next.payments,
            {
              id: `pay_${Date.now()}`,
              shopId: s.shop.id,
              bookingId: b.id,
              clientId: b.clientId,
              amountCents: net,
              method: "card",
              createdAt: new Date().toISOString(),
            },
          ];
          if (b.clientId) {
            next.clients = next.clients.map((c) =>
              c.id === b.clientId
                ? {
                    ...c,
                    totalVisits: c.totalVisits + 1,
                    totalSpentCents: c.totalSpentCents + net,
                    lastVisitAt: new Date().toISOString(),
                  }
                : c
            );
          }
        }
      }
      return next;
    });
  },
  deleteBooking(id: string) {
    demoStore.update((s) => ({
      ...s,
      bookings: s.bookings.filter((b) => b.id !== id),
      payments: s.payments.filter((p) => p.bookingId !== id),
    }));
  },

  // ----------------------------------------------------- Campaigns
  createCampaign(payload: Omit<Campaign, "id" | "shopId" | "createdAt" | "redemptions">): Campaign {
    const state = loadState();
    const created: Campaign = {
      ...payload,
      id: `cmp_${Date.now()}`,
      shopId: state.shop.id,
      createdAt: new Date().toISOString(),
      redemptions: 0,
    };
    saveState({ ...state, campaigns: [...state.campaigns, created] });
    return created;
  },
  updateCampaign(id: string, patch: Partial<Campaign>) {
    demoStore.update((s) => ({
      ...s,
      campaigns: s.campaigns.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    }));
  },
  deleteCampaign(id: string) {
    demoStore.update((s) => ({
      ...s,
      campaigns: s.campaigns.filter((c) => c.id !== id),
    }));
  },

  // ----------------------------------------------------- Shop
  updateShop(patch: Partial<Shop>) {
    demoStore.update((s) => ({ ...s, shop: { ...s.shop, ...patch } }));
  },
};
