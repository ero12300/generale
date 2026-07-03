import type {
  Appointment,
  Barber,
  Campaign,
  Client,
  Payment,
  Service,
  ShopSettings,
} from "../types";
import { addDays, todayISO } from "../dates";

/** PRNG deterministico: il seed demo è stabile tra i riavvii nello stesso giorno. */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const SEED_SERVICES: Service[] = [
  {
    id: "srv-taglio",
    name: "Taglio Classico",
    description: "Taglio su misura con consulenza, shampoo e styling finale.",
    durationMin: 30,
    priceCents: 2500,
    category: "taglio",
  },
  {
    id: "srv-taglio-barba",
    name: "Taglio + Barba",
    description: "Il rituale completo: taglio sartoriale e barba scolpita a rasoio.",
    durationMin: 60,
    priceCents: 3800,
    category: "combo",
    popular: true,
  },
  {
    id: "srv-barba",
    name: "Barba Design",
    description: "Definizione barba con panno caldo, rasoio libero e oli premium.",
    durationMin: 30,
    priceCents: 1800,
    category: "barba",
  },
  {
    id: "srv-rasatura",
    name: "Rasatura Tradizionale",
    description: "Rasatura completa old-school con panni caldi e massaggio viso.",
    durationMin: 45,
    priceCents: 2200,
    category: "barba",
  },
  {
    id: "srv-trattamento",
    name: "Trattamento Hair Spa",
    description: "Detox cute e capelli con prodotti professionali e massaggio.",
    durationMin: 45,
    priceCents: 3000,
    category: "trattamento",
  },
  {
    id: "srv-deluxe",
    name: "Esperienza Deluxe",
    description: "Taglio, barba, trattamento viso e bevanda inclusa. Il top.",
    durationMin: 90,
    priceCents: 5500,
    category: "combo",
    popular: true,
  },
];

export const SEED_BARBERS: Barber[] = [
  { id: "brb-marco", name: "Marco", role: "Master Barber" },
  { id: "brb-luca", name: "Luca", role: "Barber & Stylist" },
];

export const SEED_SETTINGS: ShopSettings = {
  shopName: "BarberOS Demo Studio",
  plan: "base",
  openingHour: 9,
  closingHour: 19,
  slotMinutes: 30,
  closedWeekdays: [0], // domenica
};

const CLIENT_NAMES: [string, string][] = [
  ["Andrea Ferri", "333 111 2233"],
  ["Giulio Moretti", "334 222 3344"],
  ["Stefano Ricci", "335 333 4455"],
  ["Davide Colombo", "336 444 5566"],
  ["Matteo Greco", "337 555 6677"],
  ["Lorenzo Conti", "338 666 7788"],
  ["Simone Bruno", "339 777 8899"],
  ["Alessandro Villa", "340 888 9900"],
  ["Federico Gatti", "341 999 0011"],
  ["Riccardo Ferraro", "342 000 1122"],
  ["Tommaso Rinaldi", "343 123 4567"],
  ["Gabriele Caruso", "345 234 5678"],
];

export function referralCodeFor(name: string, rand: () => number): string {
  const first = name.split(" ")[0].toUpperCase().replace(/[^A-Z]/g, "").slice(0, 6);
  const suffix = Math.floor(rand() * 36 ** 3)
    .toString(36)
    .toUpperCase()
    .padStart(3, "0");
  return `${first}-${suffix}`;
}

export interface DemoData {
  services: Service[];
  barbers: Barber[];
  settings: ShopSettings;
  clients: Client[];
  appointments: Appointment[];
  payments: Payment[];
  campaigns: Campaign[];
}

export function buildDemoData(): DemoData {
  const rand = mulberry32(20260703);
  const today = todayISO();

  const clients: Client[] = CLIENT_NAMES.map(([name, phone], i) => ({
    id: `cli-${i + 1}`,
    name,
    phone,
    email: `${name.split(" ")[0].toLowerCase()}@example.com`,
    createdAt: new Date(
      Date.now() - Math.floor(rand() * 90) * 86400000,
    ).toISOString(),
    referralCode: referralCodeFor(name, rand),
  }));
  // Alcuni clienti arrivati tramite "porta un amico"
  clients[4].referredBy = clients[0].referralCode;
  clients[7].referredBy = clients[0].referralCode;
  clients[9].referredBy = clients[2].referralCode;

  const campaigns: Campaign[] = [
    {
      id: "cmp-benvenuto",
      type: "sconto",
      name: "Sconto Benvenuto",
      code: "BENVENUTO10",
      percentOff: 10,
      active: true,
      usageCount: 14,
      validUntil: addDays(today, 60),
      createdAt: new Date().toISOString(),
    },
    {
      id: "cmp-referral",
      type: "referral",
      name: "Porta un amico",
      code: "AMICO20",
      percentOff: 20,
      active: true,
      usageCount: 8,
      createdAt: new Date().toISOString(),
    },
  ];

  // Incassi degli ultimi 35 giorni (nessun incasso la domenica)
  const payments: Payment[] = [];
  let payId = 1;
  for (let back = 35; back >= 0; back--) {
    const date = addDays(today, -back);
    const weekday = new Date(`${date}T12:00:00`).getDay();
    if (weekday === 0) continue;
    const isWeekend = weekday === 6;
    const count = 3 + Math.floor(rand() * (isWeekend ? 7 : 5));
    for (let i = 0; i < count; i++) {
      const service = SEED_SERVICES[Math.floor(rand() * SEED_SERVICES.length)];
      const client = clients[Math.floor(rand() * clients.length)];
      const methodRoll = rand();
      payments.push({
        id: `pay-${payId++}`,
        clientName: client.name,
        serviceName: service.name,
        amountCents: service.priceCents,
        method: methodRoll < 0.45 ? "carta" : methodRoll < 0.85 ? "contanti" : "satispay",
        date,
        createdAt: new Date(`${date}T${10 + (i % 8)}:00:00`).toISOString(),
      });
    }
  }

  // Appuntamenti: oggi e prossimi giorni
  const appointments: Appointment[] = [];
  let aptId = 1;
  const plan: {
    dayOffset: number;
    time: string;
    serviceIdx: number;
    clientIdx: number;
    barberIdx: number;
    status: Appointment["status"];
  }[] = [
    { dayOffset: 0, time: "09:30", serviceIdx: 0, clientIdx: 0, barberIdx: 0, status: "completato" },
    { dayOffset: 0, time: "10:30", serviceIdx: 1, clientIdx: 1, barberIdx: 0, status: "completato" },
    { dayOffset: 0, time: "11:00", serviceIdx: 2, clientIdx: 2, barberIdx: 1, status: "confermato" },
    { dayOffset: 0, time: "15:00", serviceIdx: 5, clientIdx: 3, barberIdx: 0, status: "confermato" },
    { dayOffset: 0, time: "16:30", serviceIdx: 0, clientIdx: 4, barberIdx: 1, status: "in_attesa" },
    { dayOffset: 1, time: "09:00", serviceIdx: 1, clientIdx: 5, barberIdx: 0, status: "confermato" },
    { dayOffset: 1, time: "11:30", serviceIdx: 3, clientIdx: 6, barberIdx: 1, status: "in_attesa" },
    { dayOffset: 2, time: "10:00", serviceIdx: 4, clientIdx: 7, barberIdx: 0, status: "confermato" },
  ];
  for (const p of plan) {
    const service = SEED_SERVICES[p.serviceIdx];
    const client = clients[p.clientIdx];
    const barber = SEED_BARBERS[p.barberIdx];
    appointments.push({
      id: `apt-${aptId++}`,
      clientId: client.id,
      clientName: client.name,
      clientPhone: client.phone,
      serviceId: service.id,
      serviceName: service.name,
      barberId: barber.id,
      barberName: barber.name,
      date: addDays(today, p.dayOffset),
      time: p.time,
      durationMin: service.durationMin,
      priceCents: service.priceCents,
      discountCents: 0,
      status: p.status,
      createdAt: new Date().toISOString(),
    });
  }

  return {
    services: SEED_SERVICES,
    barbers: SEED_BARBERS,
    settings: { ...SEED_SETTINGS },
    clients,
    appointments,
    payments,
    campaigns,
  };
}
