import { toIsoDate } from "./logic";
import type {
  AppState,
} from "./store/state";

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return toIsoDate(d);
}

function daysAhead(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return toIsoDate(d);
}

export function createSeedState(): AppState {
  const now = new Date().toISOString();
  return {
    settings: {
      name: "Officina del Barbiere",
      plan: "pro",
      subscriptionStatus: "trialing",
      openingHour: 9,
      closingHour: 19,
      slotMinutes: 30,
      closedWeekdays: [0, 1],
    },
    services: [
      {
        id: "srv-taglio",
        name: "Taglio Classico",
        description: "Taglio su misura con consulenza, shampoo e styling finale.",
        priceCents: 2500,
        durationMinutes: 30,
        active: true,
      },
      {
        id: "srv-barba",
        name: "Rasatura Tradizionale",
        description: "Panno caldo, rasoio a mano libera e trattamento after-shave.",
        priceCents: 2000,
        durationMinutes: 30,
        active: true,
      },
      {
        id: "srv-combo",
        name: "Taglio + Barba",
        description: "Il rituale completo: taglio sartoriale e rasatura tradizionale.",
        priceCents: 4000,
        durationMinutes: 60,
        active: true,
      },
      {
        id: "srv-trattamento",
        name: "Trattamento Premium",
        description: "Maschera viso, massaggio del cuoio capelluto e styling luxury.",
        priceCents: 5500,
        durationMinutes: 60,
        active: true,
      },
    ],
    barbers: [
      { id: "brb-luca", name: "Luca", role: "Master Barber", active: true },
      { id: "brb-marco", name: "Marco", role: "Senior Barber", active: true },
    ],
    customers: [
      {
        id: "cst-rossi",
        name: "Giulio Rossi",
        phone: "+39 333 1234567",
        email: "giulio.rossi@example.com",
        referralCode: "GIULI421",
        createdAt: now,
        marketingConsent: true,
      },
      {
        id: "cst-bianchi",
        name: "Andrea Bianchi",
        phone: "+39 347 7654321",
        referralCode: "ANDRE118",
        referredById: "cst-rossi",
        createdAt: now,
        marketingConsent: false,
      },
    ],
    bookings: [
      {
        id: "bkg-demo1",
        customerId: "cst-rossi",
        customerName: "Giulio Rossi",
        customerPhone: "+39 333 1234567",
        serviceId: "srv-combo",
        serviceName: "Taglio + Barba",
        barberId: "brb-luca",
        barberName: "Luca",
        date: daysAhead(1),
        time: "10:00",
        priceCents: 4000,
        discountCents: 0,
        status: "confermata",
        createdAt: now,
      },
    ],
    sales: [
      {
        id: "sal-1",
        date: daysAgo(0),
        serviceName: "Taglio Classico",
        barberId: "brb-luca",
        barberName: "Luca",
        customerId: "cst-rossi",
        customerName: "Giulio Rossi",
        amountCents: 2500,
        method: "carta",
        createdAt: now,
      },
      {
        id: "sal-2",
        date: daysAgo(0),
        serviceName: "Rasatura Tradizionale",
        barberId: "brb-marco",
        barberName: "Marco",
        amountCents: 2000,
        method: "contanti",
        createdAt: now,
      },
      {
        id: "sal-3",
        date: daysAgo(1),
        serviceName: "Taglio + Barba",
        barberId: "brb-luca",
        barberName: "Luca",
        customerId: "cst-bianchi",
        customerName: "Andrea Bianchi",
        amountCents: 4000,
        method: "satispay",
        createdAt: now,
      },
      {
        id: "sal-4",
        date: daysAgo(2),
        serviceName: "Trattamento Premium",
        barberId: "brb-marco",
        barberName: "Marco",
        amountCents: 5500,
        method: "carta",
        createdAt: now,
      },
      {
        id: "sal-5",
        date: daysAgo(4),
        serviceName: "Taglio Classico",
        barberId: "brb-luca",
        barberName: "Luca",
        amountCents: 2500,
        method: "contanti",
        createdAt: now,
      },
      {
        id: "sal-6",
        date: daysAgo(5),
        serviceName: "Taglio + Barba",
        barberId: "brb-marco",
        barberName: "Marco",
        amountCents: 4000,
        method: "carta",
        createdAt: now,
      },
    ],
    campaigns: [
      {
        id: "cmp-benvenuto",
        name: "Benvenuto -10%",
        kind: "percentuale",
        code: "BENVENUTO10",
        value: 10,
        active: true,
        usageCount: 3,
        createdAt: now,
      },
      {
        id: "cmp-referral",
        name: "Porta un amico -5€",
        kind: "referral",
        code: "AMICO",
        value: 500,
        active: true,
        usageCount: 1,
        createdAt: now,
      },
    ],
  };
}
