import { percentOf, type Cents } from "./money";
import type { Booking, Campaign, Customer, Sale, Service } from "./types";

/** Calcola lo sconto in centesimi applicando una campagna a un prezzo. */
export function computeDiscount(priceCents: Cents, campaign: Campaign): Cents {
  if (!campaign.active) return 0;
  let discount: Cents;
  switch (campaign.kind) {
    case "percentuale":
      discount = percentOf(priceCents, campaign.value);
      break;
    case "fisso":
    case "referral":
      discount = Math.round(campaign.value);
      break;
    default: {
      const _exhaustive: never = campaign.kind;
      return _exhaustive;
    }
  }
  return Math.min(Math.max(discount, 0), priceCents);
}

export function findCampaignByCode(
  campaigns: Campaign[],
  code: string,
): Campaign | undefined {
  const normalized = code.trim().toUpperCase();
  if (!normalized) return undefined;
  return campaigns.find(
    (c) => c.active && c.code.toUpperCase() === normalized,
  );
}

/** Genera un codice referral leggibile a partire dal nome cliente. */
export function generateReferralCode(name: string, existing: Set<string>): string {
  const base = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z]/g, "")
    .toUpperCase()
    .slice(0, 5)
    .padEnd(3, "X");
  for (let i = 0; i < 1000; i++) {
    const suffix = String(Math.floor(Math.random() * 900) + 100);
    const candidate = `${base}${suffix}`;
    if (!existing.has(candidate)) return candidate;
  }
  return `${base}${Date.now() % 100000}`;
}

export function findCustomerByReferralCode(
  customers: Customer[],
  code: string,
): Customer | undefined {
  const normalized = code.trim().toUpperCase();
  if (!normalized) return undefined;
  return customers.find((c) => c.referralCode.toUpperCase() === normalized);
}

export interface RevenueKpi {
  totalCents: Cents;
  count: number;
  averageTicketCents: Cents;
  byMethod: Record<string, Cents>;
  byBarber: Record<string, Cents>;
}

export function computeRevenueKpi(sales: Sale[]): RevenueKpi {
  const byMethod: Record<string, Cents> = {};
  const byBarber: Record<string, Cents> = {};
  let totalCents = 0;
  for (const sale of sales) {
    totalCents += sale.amountCents;
    byMethod[sale.method] = (byMethod[sale.method] ?? 0) + sale.amountCents;
    byBarber[sale.barberName] = (byBarber[sale.barberName] ?? 0) + sale.amountCents;
  }
  return {
    totalCents,
    count: sales.length,
    averageTicketCents: sales.length ? Math.round(totalCents / sales.length) : 0,
    byMethod,
    byBarber,
  };
}

export function salesInRange(sales: Sale[], fromDate: string, toDate: string): Sale[] {
  return sales.filter((s) => s.date >= fromDate && s.date <= toDate);
}

/** Ultimi N giorni (incluso oggi) come coppie [data, totale]. */
export function dailyRevenueSeries(
  sales: Sale[],
  days: number,
  today: Date = new Date(),
): Array<{ date: string; totalCents: Cents }> {
  const series: Array<{ date: string; totalCents: Cents }> = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const iso = toIsoDate(d);
    const totalCents = sales
      .filter((s) => s.date === iso)
      .reduce((acc, s) => acc + s.amountCents, 0);
    series.push({ date: iso, totalCents });
  }
  return series;
}

export function toIsoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export interface SlotParams {
  date: string; // YYYY-MM-DD
  openingHour: number;
  closingHour: number;
  slotMinutes: number;
  closedWeekdays: number[];
  service: Pick<Service, "durationMinutes">;
  barberId: string;
  bookings: Booking[];
  /** Per filtrare slot già passati quando la data è oggi. */
  now?: Date;
}

/** Ritorna gli orari HH:mm liberi per un barbiere in una data. */
export function availableSlots(params: SlotParams): string[] {
  const {
    date,
    openingHour,
    closingHour,
    slotMinutes,
    closedWeekdays,
    service,
    barberId,
    bookings,
    now,
  } = params;

  const weekday = new Date(`${date}T00:00:00`).getDay();
  if (closedWeekdays.includes(weekday)) return [];

  const dayBookings = bookings.filter(
    (b) => b.date === date && b.barberId === barberId && b.status !== "annullata",
  );

  const busy: Array<[number, number]> = dayBookings.map((b) => {
    const start = timeToMinutes(b.time);
    return [start, start + slotMinutes];
  });

  const openMin = openingHour * 60;
  const closeMin = closingHour * 60;
  const duration = Math.max(service.durationMinutes, slotMinutes);
  const slots: string[] = [];

  const nowRef = now ?? new Date();
  const isToday = toIsoDate(nowRef) === date;
  const nowMin = nowRef.getHours() * 60 + nowRef.getMinutes();

  for (let start = openMin; start + duration <= closeMin; start += slotMinutes) {
    if (isToday && start <= nowMin) continue;
    const end = start + duration;
    const overlaps = busy.some(([bStart, bEnd]) => start < bEnd && end > bStart);
    if (!overlaps) slots.push(minutesToTime(start));
  }
  return slots;
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function minutesToTime(min: number): string {
  const h = String(Math.floor(min / 60)).padStart(2, "0");
  const m = String(min % 60).padStart(2, "0");
  return `${h}:${m}`;
}

export function newId(): string {
  return (
    Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
  ).toUpperCase();
}
