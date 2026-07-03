import type {
  Booking,
  BookingStatus,
  Campaign,
  Client,
  Organization,
  PaymentMethod,
  Plan,
  RevenueEntry,
  RevenueSummary,
  Service,
  Staff,
} from "./types";
import { PLAN_FEATURES } from "./plan";

/**
 * Store in-memory per la modalità demo (nessuna config Firebase richiesta).
 * Espone la stessa interfaccia che l'adapter Firestore dovrà implementare,
 * così il passaggio a Firebase reale non richiede modifiche alle API/UI.
 * Usa una singola istanza globale per sopravvivere all'HMR in sviluppo.
 */

function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

function iso(d: Date): string {
  return d.toISOString();
}

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

function atTime(base: Date, hour: number, minute = 0): Date {
  const d = new Date(base);
  d.setHours(hour, minute, 0, 0);
  return d;
}

function randomCode(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}

interface StoreData {
  org: Organization;
  services: Service[];
  staff: Staff[];
  clients: Client[];
  bookings: Booking[];
  revenue: RevenueEntry[];
  campaigns: Campaign[];
  seq: number;
}

export class BarberStore {
  private data: StoreData;

  constructor() {
    this.data = this.seed();
  }

  private nextId(prefix: string): string {
    this.data.seq += 1;
    return `${prefix}-${this.data.seq.toString().padStart(4, "0")}`;
  }

  private seed(): StoreData {
    const org: Organization = {
      id: "org-demo",
      name: "Lama d'Oro Barbershop",
      plan: "pro",
      ownerName: "Eros",
      slug: "lama-doro",
    };

    const services: Service[] = [
      { id: "svc-taglio", name: "Taglio Uomo", durationMin: 30, price: 20, category: "Capelli" },
      { id: "svc-taglio-barba", name: "Taglio + Barba", durationMin: 45, price: 30, category: "Combo" },
      { id: "svc-barba", name: "Barba Scultura", durationMin: 20, price: 15, category: "Barba" },
      { id: "svc-rasatura", name: "Rasatura Tradizionale", durationMin: 30, price: 25, category: "Barba" },
      { id: "svc-bimbo", name: "Taglio Bimbo", durationMin: 25, price: 15, category: "Capelli" },
      { id: "svc-styling", name: "Shampoo & Styling", durationMin: 20, price: 12, category: "Extra" },
    ];

    const staff: Staff[] = [
      { id: "staff-marco", name: "Marco", role: "Master Barber", color: "#c9a24b" },
      { id: "staff-luca", name: "Luca", role: "Barber", color: "#7dd3fc" },
    ];

    const clientSeed = [
      { name: "Giuseppe Rossi", phone: "+39 340 1112233", visits: 14, spent: 380, referred: false },
      { name: "Antonio Bianchi", phone: "+39 347 2223344", visits: 8, spent: 240, referred: true },
      { name: "Luca Verdi", phone: "+39 333 3334455", visits: 22, spent: 610, referred: false },
      { name: "Marco Esposito", phone: "+39 320 4445566", visits: 3, spent: 75, referred: true },
      { name: "Davide Conti", phone: "+39 388 5556677", visits: 11, spent: 300, referred: false },
      { name: "Francesco Ricci", phone: "+39 366 6667788", visits: 6, spent: 150, referred: false },
      { name: "Simone Greco", phone: "+39 349 7778899", visits: 2, spent: 45, referred: true },
      { name: "Alessandro Moro", phone: "+39 351 8889900", visits: 18, spent: 500, referred: false },
    ];

    const clients: Client[] = clientSeed.map((c, i) => ({
      id: `cli-${(i + 1).toString().padStart(4, "0")}`,
      name: c.name,
      phone: c.phone,
      email: `${c.name.split(" ")[0].toLowerCase()}@example.com`,
      notes: null,
      tags: c.visits > 12 ? ["VIP"] : [],
      totalVisits: c.visits,
      totalSpent: c.spent,
      loyaltyPoints: c.visits * 10,
      referralCode: randomCode("AMICO"),
      referredBy: c.referred ? "cli-0001" : null,
      createdAt: iso(daysAgo(120 - i * 8)),
      lastVisitAt: iso(daysAgo(i * 3 + 1)),
    }));

    const today = new Date();
    const bookings: Booking[] = [
      {
        id: "bkg-0001",
        clientId: "cli-0001",
        clientName: "Giuseppe Rossi",
        clientPhone: "+39 340 1112233",
        serviceId: "svc-taglio-barba",
        serviceName: "Taglio + Barba",
        staffId: "staff-marco",
        staffName: "Marco",
        start: iso(atTime(today, Math.min(23, today.getHours() + 1), 0)),
        durationMin: 45,
        price: 30,
        status: "confirmed",
        source: "online",
        notes: null,
        createdAt: iso(daysAgo(1)),
      },
      {
        id: "bkg-0002",
        clientId: "cli-0003",
        clientName: "Luca Verdi",
        clientPhone: "+39 333 3334455",
        serviceId: "svc-taglio",
        serviceName: "Taglio Uomo",
        staffId: "staff-luca",
        staffName: "Luca",
        start: iso(atTime(today, Math.min(23, today.getHours() + 2), 30)),
        durationMin: 30,
        price: 20,
        status: "confirmed",
        source: "interno",
        notes: "Sfumatura alta",
        createdAt: iso(daysAgo(2)),
      },
      {
        id: "bkg-0003",
        clientId: "cli-0005",
        clientName: "Davide Conti",
        clientPhone: "+39 388 5556677",
        serviceId: "svc-barba",
        serviceName: "Barba Scultura",
        staffId: "staff-marco",
        staffName: "Marco",
        start: iso(atTime(daysAgo(-1), 10, 0)),
        durationMin: 20,
        price: 15,
        status: "confirmed",
        source: "online",
        notes: null,
        createdAt: iso(new Date()),
      },
    ];

    // Incassi storici degli ultimi 30 giorni
    const revenue: RevenueEntry[] = [];
    let seq = 0;
    const methods: PaymentMethod[] = ["contanti", "carta", "carta", "contanti"];
    for (let d = 30; d >= 0; d--) {
      const day = daysAgo(d);
      if (day.getDay() === 1) continue; // lunedì chiuso
      const entries = 3 + (d % 4);
      for (let k = 0; k < entries; k++) {
        seq += 1;
        const svc = services[(d + k) % services.length];
        revenue.push({
          id: `rev-${seq.toString().padStart(4, "0")}`,
          date: iso(atTime(day, 9 + (k % 8), (k * 15) % 60)),
          amount: svc.price,
          method: methods[(d + k) % methods.length],
          serviceName: svc.name,
          clientId: clients[(d + k) % clients.length].id,
          bookingId: null,
          note: null,
          createdAt: iso(day),
        });
      }
    }

    const campaigns: Campaign[] = [
      {
        id: "camp-0001",
        name: "Sconto Primo Taglio",
        type: "sconto",
        description: "20% di sconto sul primo taglio per i nuovi clienti.",
        discountPercent: 20,
        code: "BENVENUTO20",
        active: true,
        redemptions: 12,
        createdAt: iso(daysAgo(20)),
      },
      {
        id: "camp-0002",
        name: "Porta un Amico",
        type: "referral",
        description: "Tu e il tuo amico ricevete 5€ di sconto sul prossimo servizio.",
        discountPercent: 0,
        code: "AMICO5",
        active: true,
        redemptions: 7,
        createdAt: iso(daysAgo(15)),
      },
    ];

    return {
      org,
      services,
      staff,
      clients,
      bookings,
      revenue,
      campaigns,
      seq: 1000,
    };
  }

  // --- Organizzazione / piano ---
  getOrg(): Organization {
    return { ...this.data.org };
  }

  setPlan(plan: Plan): Organization {
    this.data.org.plan = plan;
    return this.getOrg();
  }

  // --- Cataloghi ---
  listServices(): Service[] {
    return [...this.data.services];
  }

  listStaff(): Staff[] {
    return [...this.data.staff];
  }

  // --- Clienti ---
  listClients(): Client[] {
    return [...this.data.clients].sort((a, b) => a.name.localeCompare(b.name));
  }

  getClient(id: string): Client | undefined {
    return this.data.clients.find((c) => c.id === id);
  }

  createClient(input: {
    name: string;
    phone: string;
    email?: string | null;
    notes?: string | null;
    referredByCode?: string | null;
  }): { client?: Client; error?: string } {
    const limit = PLAN_FEATURES[this.data.org.plan].maxClients;
    if (this.data.clients.length >= limit) {
      return {
        error: `Hai raggiunto il limite di ${limit} clienti del piano Base. Passa a Pro per clienti illimitati.`,
      };
    }
    let referredBy: string | null = null;
    if (input.referredByCode) {
      const referrer = this.data.clients.find(
        (c) => c.referralCode.toLowerCase() === input.referredByCode!.toLowerCase()
      );
      if (referrer) {
        referredBy = referrer.id;
        referrer.loyaltyPoints += 50;
      }
    }
    const client: Client = {
      id: this.nextId("cli"),
      name: input.name,
      phone: input.phone,
      email: input.email ?? null,
      notes: input.notes ?? null,
      tags: [],
      totalVisits: 0,
      totalSpent: 0,
      loyaltyPoints: referredBy ? 50 : 0,
      referralCode: randomCode("AMICO"),
      referredBy,
      createdAt: iso(new Date()),
      lastVisitAt: null,
    };
    this.data.clients.push(client);
    return { client };
  }

  updateClient(id: string, patch: Partial<Pick<Client, "name" | "phone" | "email" | "notes" | "tags">>): Client | undefined {
    const client = this.data.clients.find((c) => c.id === id);
    if (!client) return undefined;
    Object.assign(client, patch);
    return client;
  }

  // --- Prenotazioni ---
  listBookings(): Booking[] {
    return [...this.data.bookings].sort(
      (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
    );
  }

  createBooking(input: {
    clientId?: string | null;
    clientName: string;
    clientPhone: string;
    serviceId: string;
    staffId?: string | null;
    start: string;
    source?: "interno" | "online";
    notes?: string | null;
  }): { booking?: Booking; error?: string } {
    const service = this.data.services.find((s) => s.id === input.serviceId);
    if (!service) return { error: "Servizio non trovato" };
    const staff = input.staffId
      ? this.data.staff.find((s) => s.id === input.staffId)
      : undefined;

    const booking: Booking = {
      id: this.nextId("bkg"),
      clientId: input.clientId ?? null,
      clientName: input.clientName,
      clientPhone: input.clientPhone,
      serviceId: service.id,
      serviceName: service.name,
      staffId: staff?.id ?? null,
      staffName: staff?.name ?? null,
      start: input.start,
      durationMin: service.durationMin,
      price: service.price,
      status: input.source === "online" ? "pending" : "confirmed",
      source: input.source ?? "interno",
      notes: input.notes ?? null,
      createdAt: iso(new Date()),
    };
    this.data.bookings.push(booking);
    return { booking };
  }

  setBookingStatus(id: string, status: BookingStatus): Booking | undefined {
    const booking = this.data.bookings.find((b) => b.id === id);
    if (!booking) return undefined;
    booking.status = status;

    // Quando una prenotazione è completata: registra incasso, fedeltà e statistiche
    if (status === "completed") {
      const already = this.data.revenue.some((r) => r.bookingId === booking.id);
      if (!already) {
        this.data.revenue.push({
          id: this.nextId("rev"),
          date: iso(new Date()),
          amount: booking.price,
          method: "carta",
          serviceName: booking.serviceName,
          clientId: booking.clientId,
          bookingId: booking.id,
          note: null,
          createdAt: iso(new Date()),
        });
        if (booking.clientId) {
          const client = this.data.clients.find((c) => c.id === booking.clientId);
          if (client) {
            client.totalVisits += 1;
            client.totalSpent = round2(client.totalSpent + booking.price);
            client.loyaltyPoints += 10;
            client.lastVisitAt = iso(new Date());
          }
        }
      }
    }
    return booking;
  }

  // --- Incassi ---
  listRevenue(): RevenueEntry[] {
    return [...this.data.revenue].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  createRevenue(input: {
    amount: number;
    method: PaymentMethod;
    serviceName?: string | null;
    clientId?: string | null;
    note?: string | null;
  }): RevenueEntry {
    const entry: RevenueEntry = {
      id: this.nextId("rev"),
      date: iso(new Date()),
      amount: round2(input.amount),
      method: input.method,
      serviceName: input.serviceName ?? null,
      clientId: input.clientId ?? null,
      bookingId: null,
      note: input.note ?? null,
      createdAt: iso(new Date()),
    };
    this.data.revenue.push(entry);
    if (input.clientId) {
      const client = this.data.clients.find((c) => c.id === input.clientId);
      if (client) {
        client.totalSpent = round2(client.totalSpent + entry.amount);
        client.totalVisits += 1;
        client.loyaltyPoints += 10;
        client.lastVisitAt = entry.date;
      }
    }
    return entry;
  }

  revenueSummary(): RevenueSummary {
    const now = new Date();
    const todayStart = startOfDay(now).getTime();
    const weekStart = startOfDay(daysAgo(6)).getTime();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

    let today = 0;
    let week = 0;
    let month = 0;
    let todayCount = 0;
    let monthCount = 0;
    const byMethod: Record<PaymentMethod, number> = { contanti: 0, carta: 0, altro: 0 };

    const dayBuckets = new Map<string, number>();
    for (let i = 6; i >= 0; i--) {
      dayBuckets.set(startOfDay(daysAgo(i)).toISOString(), 0);
    }

    for (const r of this.data.revenue) {
      const t = new Date(r.date).getTime();
      if (t >= todayStart) {
        today += r.amount;
        todayCount += 1;
      }
      if (t >= weekStart) {
        week += r.amount;
        const key = startOfDay(new Date(r.date)).toISOString();
        if (dayBuckets.has(key)) dayBuckets.set(key, (dayBuckets.get(key) ?? 0) + r.amount);
      }
      if (t >= monthStart) {
        month += r.amount;
        monthCount += 1;
        byMethod[r.method] += r.amount;
      }
    }

    const labels = ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"];
    const last7Days = Array.from(dayBuckets.entries()).map(([date, amount]) => ({
      date,
      label: labels[new Date(date).getDay()],
      amount: round2(amount),
    }));

    return {
      today: round2(today),
      week: round2(week),
      month: round2(month),
      todayCount,
      monthCount,
      averageTicket: monthCount > 0 ? round2(month / monthCount) : 0,
      byMethod: {
        contanti: round2(byMethod.contanti),
        carta: round2(byMethod.carta),
        altro: round2(byMethod.altro),
      },
      last7Days,
    };
  }

  // --- Campagne ---
  listCampaigns(): Campaign[] {
    return [...this.data.campaigns].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  createCampaign(input: {
    name: string;
    type: "sconto" | "referral";
    description: string;
    discountPercent?: number;
  }): { campaign?: Campaign; error?: string } {
    const features = PLAN_FEATURES[this.data.org.plan];
    if (input.type === "referral" && !features.referralProgram) {
      return {
        error: 'Il programma "Porta un amico" è disponibile solo nel piano Pro.',
      };
    }
    const activeCount = this.data.campaigns.filter((c) => c.active).length;
    if (activeCount >= features.maxActiveCampaigns) {
      return {
        error: `Il piano Base consente ${features.maxActiveCampaigns} campagna attiva. Passa a Pro per campagne illimitate.`,
      };
    }
    const campaign: Campaign = {
      id: this.nextId("camp"),
      name: input.name,
      type: input.type,
      description: input.description,
      discountPercent: input.discountPercent ?? 0,
      code: randomCode(input.type === "referral" ? "AMICO" : "PROMO"),
      active: true,
      redemptions: 0,
      createdAt: iso(new Date()),
    };
    this.data.campaigns.push(campaign);
    return { campaign };
  }

  toggleCampaign(id: string): Campaign | undefined {
    const campaign = this.data.campaigns.find((c) => c.id === id);
    if (!campaign) return undefined;
    campaign.active = !campaign.active;
    return campaign;
  }
}

// Singleton globale (sopravvive all'HMR di Next in sviluppo)
const globalForStore = globalThis as unknown as { __barberStore?: BarberStore };

export const store: BarberStore =
  globalForStore.__barberStore ?? (globalForStore.__barberStore = new BarberStore());
