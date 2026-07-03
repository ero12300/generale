import type { Booking, Campaign, ClientProfile, RevenueEntry, Service } from "./types";

export const services: Service[] = [
  {
    id: "cut-classic",
    name: "Taglio signature",
    durationMinutes: 35,
    priceCents: 2800,
  },
  {
    id: "beard-ritual",
    name: "Rituale barba premium",
    durationMinutes: 25,
    priceCents: 2200,
    isPremium: true,
  },
  {
    id: "full-experience",
    name: "Executive cut + barba",
    durationMinutes: 60,
    priceCents: 4900,
    isPremium: true,
  },
];

export const bookings: Booking[] = [
  {
    id: "booking-1",
    clientName: "Marco Bellini",
    serviceId: "full-experience",
    startsAt: "2026-07-04T09:30:00.000Z",
    status: "confirmed",
    source: "app",
  },
  {
    id: "booking-2",
    clientName: "Luca Ferri",
    serviceId: "cut-classic",
    startsAt: "2026-07-04T10:45:00.000Z",
    status: "waiting",
    source: "instagram",
  },
  {
    id: "booking-3",
    clientName: "Davide Costa",
    serviceId: "beard-ritual",
    startsAt: "2026-07-04T12:15:00.000Z",
    status: "confirmed",
    source: "app",
  },
];

export const clients: ClientProfile[] = [
  {
    id: "client-1",
    fullName: "Marco Bellini",
    phone: "+39 333 111 2244",
    visits: 18,
    lastVisit: "2026-06-28",
    lifetimeValueCents: 84000,
    referralCode: "MARCO20",
    status: "vip",
  },
  {
    id: "client-2",
    fullName: "Luca Ferri",
    phone: "+39 348 221 9088",
    visits: 7,
    lastVisit: "2026-06-21",
    lifetimeValueCents: 28600,
    referralCode: "LUCA10",
    status: "loyal",
  },
  {
    id: "client-3",
    fullName: "Davide Costa",
    phone: "+39 347 890 1212",
    visits: 2,
    lastVisit: "2026-07-01",
    lifetimeValueCents: 9300,
    referralCode: "DAVIDE10",
    status: "new",
  },
];

export const revenueEntries: RevenueEntry[] = [
  {
    id: "revenue-1",
    label: "Executive cut + barba",
    amountCents: 4900,
    paidAt: "2026-07-03T17:20:00.000Z",
    channel: "card",
  },
  {
    id: "revenue-2",
    label: "Gift card barba premium",
    amountCents: 6600,
    paidAt: "2026-07-03T16:05:00.000Z",
    channel: "stripe",
  },
  {
    id: "revenue-3",
    label: "Taglio signature",
    amountCents: 2800,
    paidAt: "2026-07-03T11:40:00.000Z",
    channel: "cash",
  },
];

export const campaigns: Campaign[] = [
  {
    id: "campaign-1",
    name: "Porta un amico",
    audience: "Clienti VIP",
    reward: "-20% al cliente e -10% all'amico",
    redemptions: 24,
    revenueCents: 312000,
  },
  {
    id: "campaign-2",
    name: "Ritorna entro 21 giorni",
    audience: "Clienti taglio signature",
    reward: "Rituale barba a 15 euro",
    redemptions: 17,
    revenueCents: 185000,
  },
];

export const monthlyRevenueCents = 1842000;
export const projectedSubscriptionRevenueCents = 12900 * 84;
