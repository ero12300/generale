import type {
  BarberState,
  Booking,
  Client,
  PaymentMethod,
  BookingStatus,
} from "./types";
import { referralCode, uid } from "./utils";

function isoAt(dayOffset: number, hour: number, minute = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + dayOffset);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

const SERVICES = [
  { id: "svc_taglio", name: "Taglio uomo", category: "capelli" as const, durationMin: 30, priceCents: 2000, active: true },
  { id: "svc_barba", name: "Barba modellata", category: "barba" as const, durationMin: 20, priceCents: 1500, active: true },
  { id: "svc_combo", name: "Taglio + Barba", category: "combo" as const, durationMin: 45, priceCents: 3000, active: true },
  { id: "svc_shave", name: "Rasatura tradizionale", category: "barba" as const, durationMin: 30, priceCents: 2500, active: true },
  { id: "svc_kids", name: "Taglio bambino", category: "capelli" as const, durationMin: 20, priceCents: 1500, active: true },
  { id: "svc_trattamento", name: "Trattamento capelli", category: "trattamenti" as const, durationMin: 40, priceCents: 3500, active: true },
];

const BARBERS = [
  { id: "brb_marco", name: "Marco", role: "Master Barber", color: "#c9a349", active: true },
  { id: "brb_luca", name: "Luca", role: "Barber", color: "#5b8def", active: true },
];

function makeClient(
  firstName: string,
  lastName: string,
  phone: string,
  opts: Partial<Client> = {},
): Client {
  return {
    id: uid("cli"),
    firstName,
    lastName,
    phone,
    email: opts.email,
    tier: opts.tier ?? "abituale",
    createdAt: opts.createdAt ?? isoAt(-90, 10),
    totalSpentCents: opts.totalSpentCents ?? 0,
    visits: opts.visits ?? 0,
    loyaltyPoints: opts.loyaltyPoints ?? 0,
    referralCode: referralCode(firstName),
    marketingConsent: opts.marketingConsent ?? true,
    notes: opts.notes,
    referredByCode: opts.referredByCode,
  };
}

export function createSeedState(): BarberState {
  const clients: Client[] = [
    makeClient("Giuseppe", "Rossi", "+39 333 1112233", { tier: "vip", totalSpentCents: 48000, visits: 16, loyaltyPoints: 160, email: "giuseppe.rossi@email.it" }),
    makeClient("Andrea", "Bianchi", "+39 340 2223344", { tier: "abituale", totalSpentCents: 21000, visits: 7, loyaltyPoints: 70 }),
    makeClient("Francesco", "Esposito", "+39 349 4445566", { tier: "abituale", totalSpentCents: 18000, visits: 6, loyaltyPoints: 60, email: "f.esposito@email.it" }),
    makeClient("Matteo", "Romano", "+39 320 5556677", { tier: "vip", totalSpentCents: 39000, visits: 13, loyaltyPoints: 130 }),
    makeClient("Davide", "Ferrari", "+39 328 6667788", { tier: "nuovo", totalSpentCents: 3000, visits: 1, loyaltyPoints: 10 }),
    makeClient("Luca", "Greco", "+39 366 7778899", { tier: "abituale", totalSpentCents: 15000, visits: 5, loyaltyPoints: 50 }),
  ];

  const findClient = (i: number) => clients[i];

  const bookingsSpec: Array<{
    ci: number;
    svc: number;
    barber: number;
    day: number;
    hour: number;
    minute?: number;
    status: BookingStatus;
    pay: PaymentMethod;
    discountCents?: number;
    source?: "online" | "interno";
  }> = [
    // Oggi
    { ci: 0, svc: 2, barber: 0, day: 0, hour: 9, status: "completata", pay: "carta", source: "online" },
    { ci: 1, svc: 0, barber: 1, day: 0, hour: 10, status: "completata", pay: "contanti" },
    { ci: 2, svc: 3, barber: 0, day: 0, hour: 11, status: "confermata", pay: "non_pagato", source: "online" },
    { ci: 4, svc: 0, barber: 1, day: 0, hour: 15, status: "confermata", pay: "non_pagato", source: "online" },
    { ci: 3, svc: 2, barber: 0, day: 0, hour: 17, minute: 30, status: "richiesta", pay: "non_pagato", source: "online" },
    // Domani
    { ci: 5, svc: 1, barber: 1, day: 1, hour: 10, status: "confermata", pay: "non_pagato", source: "online" },
    { ci: 0, svc: 0, barber: 0, day: 1, hour: 16, status: "confermata", pay: "non_pagato" },
    // Ieri e giorni scorsi (storico incassi)
    { ci: 1, svc: 2, barber: 0, day: -1, hour: 11, status: "completata", pay: "carta" },
    { ci: 3, svc: 5, barber: 0, day: -1, hour: 15, status: "completata", pay: "app", source: "online" },
    { ci: 2, svc: 0, barber: 1, day: -2, hour: 10, status: "completata", pay: "contanti", discountCents: 200 },
    { ci: 0, svc: 3, barber: 0, day: -2, hour: 12, status: "completata", pay: "carta" },
    { ci: 5, svc: 2, barber: 1, day: -3, hour: 17, status: "completata", pay: "contanti" },
    { ci: 4, svc: 0, barber: 1, day: -4, hour: 9, status: "completata", pay: "carta", source: "online" },
    { ci: 3, svc: 2, barber: 0, day: -5, hour: 16, status: "completata", pay: "app", source: "online" },
    { ci: 1, svc: 1, barber: 1, day: -6, hour: 10, status: "no_show", pay: "non_pagato" },
  ];

  const bookings: Booking[] = bookingsSpec.map((b) => {
    const svc = SERVICES[b.svc];
    const barber = BARBERS[b.barber];
    const client = findClient(b.ci);
    const discountCents = b.discountCents ?? 0;
    return {
      id: uid("bkg"),
      clientId: client.id,
      clientName: `${client.firstName} ${client.lastName}`,
      clientPhone: client.phone,
      serviceId: svc.id,
      serviceName: svc.name,
      barberId: barber.id,
      barberName: barber.name,
      start: isoAt(b.day, b.hour, b.minute ?? 0),
      durationMin: svc.durationMin,
      priceCents: svc.priceCents,
      status: b.status,
      paymentMethod: b.pay,
      discountCents,
      notes: undefined,
      createdAt: isoAt(b.day - 1, 12),
      source: b.source ?? "interno",
    };
  });

  return {
    settings: {
      shopName: "Barberia Da Eros",
      ownerName: "Eros",
      address: "Via Roma 42, Milano",
      phone: "+39 02 1234567",
      openHour: 9,
      closeHour: 20,
      slotMinutes: 30,
      workingDays: [1, 2, 3, 4, 5, 6],
    },
    subscription: {
      plan: "free",
      status: "active",
    },
    services: SERVICES,
    barbers: BARBERS,
    clients,
    bookings,
    campaigns: [
      {
        id: uid("cmp"),
        name: "Benvenuto -20%",
        type: "sconto",
        code: "BENVENUTO20",
        discountType: "percentuale",
        discountValue: 20,
        active: true,
        redemptions: 8,
        refereeRewardCents: 0,
        createdAt: isoAt(-40, 10),
      },
      {
        id: uid("cmp"),
        name: "Porta un amico",
        type: "porta_amico",
        code: "AMICO",
        discountType: "fisso",
        discountValue: 500,
        active: true,
        redemptions: 3,
        refereeRewardCents: 500,
        createdAt: isoAt(-25, 10),
      },
    ],
  };
}
