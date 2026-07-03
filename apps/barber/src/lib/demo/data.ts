import type {
  Booking,
  Campaign,
  Client,
  Revenue,
  Service,
  WeeklyHours,
} from "@/types";
import { addDays, generateReferralCode } from "@/lib/utils";

export const DEMO_SERVICES: Service[] = [
  { id: "svc_taglio", name: "Taglio uomo", durationMin: 30, priceEur: 22, color: "#e7bb47", active: true },
  { id: "svc_barba", name: "Barba scolpita", durationMin: 25, priceEur: 18, color: "#d18a5b", active: true },
  { id: "svc_taglio_barba", name: "Taglio + barba", durationMin: 55, priceEur: 35, color: "#b8871a", active: true },
  { id: "svc_kids", name: "Taglio bambino", durationMin: 25, priceEur: 15, color: "#8f6613", active: true },
  { id: "svc_shampoo", name: "Rituale shampoo & massaggio", durationMin: 20, priceEur: 12, color: "#f4e2a8", active: true },
];

export const DEMO_HOURS: WeeklyHours = {
  mon: { open: false, from: "09:00", to: "19:00" },
  tue: { open: true, from: "09:00", to: "19:30" },
  wed: { open: true, from: "09:00", to: "19:30" },
  thu: { open: true, from: "09:00", to: "20:00" },
  fri: { open: true, from: "09:00", to: "20:00" },
  sat: { open: true, from: "09:00", to: "18:00" },
  sun: { open: false, from: "10:00", to: "13:00" },
};

const NAMES: [string, string][] = [
  ["Marco", "Bianchi"],
  ["Luca", "Ferrari"],
  ["Alessandro", "De Luca"],
  ["Andrea", "Ricci"],
  ["Giovanni", "Marino"],
  ["Davide", "Colombo"],
  ["Matteo", "Greco"],
  ["Francesco", "Bruno"],
  ["Riccardo", "Barbieri"],
  ["Simone", "Costa"],
  ["Stefano", "Fontana"],
  ["Filippo", "Villa"],
];

function iso(d: Date) {
  return d.toISOString();
}

export function buildDemoDataset() {
  const now = new Date();
  const clients: Client[] = NAMES.map(([first, last], i) => {
    const visits = 1 + ((i * 3) % 12);
    const spent = visits * (18 + ((i * 7) % 20));
    return {
      id: `cli_${i + 1}`,
      firstName: first,
      lastName: last,
      phone: `+39 3${(30 + i) % 100}${String(1000000 + i * 7331).slice(0, 7)}`,
      email: `${first.toLowerCase()}.${last.toLowerCase().replace(/\s/g, "")}@example.it`,
      notes: i % 3 === 0 ? "Preferisce sfumatura alta, fissa martedì mattina." : undefined,
      tags: i % 4 === 0 ? ["VIP"] : i % 5 === 0 ? ["Barba"] : [],
      totalVisits: visits,
      totalSpentEur: spent,
      lastVisitAt: iso(addDays(now, -((i * 3) % 20))),
      referralCode: generateReferralCode(first),
      createdAt: iso(addDays(now, -60 - i * 3)),
    };
  });

  const bookings: Booking[] = [];
  for (let dayOffset = -14; dayOffset <= 21; dayOffset++) {
    const perDay = Math.max(0, Math.round(6 + Math.sin(dayOffset / 2) * 3));
    for (let i = 0; i < perDay; i++) {
      const svc = DEMO_SERVICES[(dayOffset + i + 5) % DEMO_SERVICES.length];
      const cli = clients[(dayOffset + i * 3 + 7 + clients.length) % clients.length];
      const start = addDays(now, dayOffset);
      start.setHours(9 + i, (i * 15) % 60, 0, 0);
      const end = new Date(start.getTime() + svc.durationMin * 60_000);
      const isPast = start < now;
      bookings.push({
        id: `bk_${dayOffset}_${i}`,
        clientId: cli.id,
        clientName: `${cli.firstName} ${cli.lastName ?? ""}`.trim(),
        clientPhone: cli.phone,
        clientEmail: cli.email,
        serviceId: svc.id,
        serviceName: svc.name,
        priceEur: svc.priceEur,
        durationMin: svc.durationMin,
        startAt: iso(start),
        endAt: iso(end),
        status: isPast ? "completed" : dayOffset === 0 ? "confirmed" : "confirmed",
        source: i % 3 === 0 ? "public" : "manual",
        createdAt: iso(addDays(start, -3)),
      });
    }
  }

  const revenues: Revenue[] = bookings
    .filter((b) => b.status === "completed")
    .map((b, i) => ({
      id: `rev_${b.id}`,
      bookingId: b.id,
      clientId: b.clientId,
      clientName: b.clientName,
      serviceName: b.serviceName,
      amountEur: b.priceEur,
      tipEur: i % 4 === 0 ? 2 : 0,
      method: (["cash", "card", "card", "cash", "transfer"] as const)[i % 5],
      discountAmountEur: 0,
      createdAt: b.endAt,
    }));

  const campaigns: Campaign[] = [
    {
      id: "cmp_welcome10",
      kind: "discount",
      name: "Benvenuto -10%",
      code: "BENVENUTO10",
      percentOff: 10,
      minSpendEur: 15,
      active: true,
      usageCount: 12,
      createdAt: iso(addDays(now, -30)),
    },
    {
      id: "cmp_referral",
      kind: "referral",
      name: "Porta un amico — 5€ per entrambi",
      referralRewardEur: 5,
      active: true,
      usageCount: 3,
      createdAt: iso(addDays(now, -20)),
    },
  ];

  return { clients, bookings, revenues, campaigns };
}
