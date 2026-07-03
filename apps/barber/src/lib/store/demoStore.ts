import type {
  Booking,
  Campaign,
  Client,
  Sale,
  Service,
  Shop,
} from "../types";
import { generateReferralCode } from "../referral";
import type { DataStore } from "./types";

/**
 * Store demo in-memory. Persiste per la durata del processo Next.js:
 * perfetto per provare l'app senza Firebase. In produzione viene
 * sostituito da FirestoreStore.
 */

let counter = 1000;
function id(prefix: string): string {
  counter += 1;
  return `${prefix}_${counter}`;
}

function dateStr(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

function seedShop(): Shop {
  return {
    id: "shop_demo",
    name: "Officina del Barbiere",
    plan: "base",
    createdAt: new Date().toISOString(),
  };
}

function seedServices(): Service[] {
  const rows: [string, number, number][] = [
    ["Taglio classico", 2200, 30],
    ["Taglio + barba", 3500, 50],
    ["Rasatura tradizionale", 1800, 25],
    ["Barba e contorni", 1500, 20],
    ["Trattamento premium (taglio, barba, maschera)", 5500, 75],
  ];
  return rows.map(([name, priceCents, durationMin], i) => ({
    id: `svc_${i + 1}`,
    shopId: "shop_demo",
    name,
    priceCents,
    durationMin,
    active: true,
  }));
}

function seedClients(): Client[] {
  const rows: [string, string, number, number, number][] = [
    // nome, telefono, visite, speso, giorni fa (creazione)
    ["Marco Rossi", "+39 333 111 2233", 14, 42000, 210],
    ["Luca Bianchi", "+39 347 222 3344", 9, 28500, 160],
    ["Andrea Ferrari", "+39 320 333 4455", 6, 19800, 120],
    ["Giuseppe Esposito", "+39 366 444 5566", 4, 9400, 75],
    ["Davide Romano", "+39 389 555 6677", 2, 7000, 30],
  ];
  return rows.map(([fullName, phone, visits, totalSpentCents, daysAgo], i) => ({
    id: `cli_${i + 1}`,
    shopId: "shop_demo",
    fullName,
    phone,
    referralCode: generateReferralCode(fullName, i * 7919 + 123),
    visits,
    totalSpentCents,
    createdAt: new Date(Date.now() - daysAgo * 86400000).toISOString(),
  }));
}

function seedSales(services: Service[], clients: Client[]): Sale[] {
  const sales: Sale[] = [];
  // Vendite distribuite sugli ultimi 30 giorni per popolare la dashboard
  const pattern = [
    [0, 0, 1], [0, 1, 0], [0, 4, 2],
    [1, 0, 4], [1, 2, 3],
    [2, 1, 1], [2, 3, 0],
    [3, 0, 2], [3, 4, 1],
    [4, 2, 4], [5, 1, 2], [6, 0, 0],
    [8, 3, 3], [10, 1, 1], [12, 0, 2],
    [15, 4, 0], [18, 2, 1], [21, 0, 3],
    [24, 1, 0], [27, 3, 4],
  ];
  const methods: Sale["method"][] = ["carta", "contanti", "carta"];
  pattern.forEach(([daysAgo, svcIdx, cliIdx], i) => {
    const svc = services[svcIdx];
    const cli = clients[cliIdx];
    sales.push({
      id: `sale_${i + 1}`,
      shopId: "shop_demo",
      clientId: cli.id,
      clientName: cli.fullName,
      serviceId: svc.id,
      description: svc.name,
      amountCents: svc.priceCents,
      discountCents: 0,
      method: methods[i % methods.length],
      date: dateStr(daysAgo),
      createdAt: new Date(Date.now() - daysAgo * 86400000).toISOString(),
    });
  });
  return sales;
}

function seedBookings(services: Service[], clients: Client[]): Booking[] {
  const mk = (
    i: number,
    cliIdx: number,
    svcIdx: number,
    daysFromNow: number,
    time: string,
    status: Booking["status"],
    source: Booking["source"]
  ): Booking => ({
    id: `bkg_${i}`,
    shopId: "shop_demo",
    clientId: clients[cliIdx].id,
    clientName: clients[cliIdx].fullName,
    clientPhone: clients[cliIdx].phone,
    serviceId: services[svcIdx].id,
    serviceName: services[svcIdx].name,
    date: dateStr(-daysFromNow),
    time,
    status,
    source,
    createdAt: new Date().toISOString(),
  });
  return [
    mk(1, 0, 1, 0, "10:00", "confermata", "interno"),
    mk(2, 2, 0, 0, "11:30", "confermata", "online"),
    mk(3, 1, 4, 0, "15:00", "confermata", "interno"),
    mk(4, 3, 2, 1, "09:30", "confermata", "online"),
    mk(5, 4, 0, 1, "17:00", "confermata", "interno"),
    mk(6, 0, 0, -1, "16:00", "completata", "interno"),
    mk(7, 1, 3, -2, "10:30", "completata", "interno"),
  ];
}

function seedCampaigns(): Campaign[] {
  return [
    {
      id: "cmp_1",
      shopId: "shop_demo",
      kind: "sconto",
      name: "Sconto benvenuto -20%",
      discountPercent: 20,
      active: true,
      redemptions: 12,
      createdAt: new Date().toISOString(),
    },
    {
      id: "cmp_2",
      shopId: "shop_demo",
      kind: "referral",
      name: "Porta un Amico: 10€ a testa",
      discountCents: 1000,
      referrerRewardCents: 1000,
      active: true,
      redemptions: 7,
      createdAt: new Date().toISOString(),
    },
  ];
}

interface DemoDb {
  shop: Shop;
  services: Service[];
  clients: Client[];
  bookings: Booking[];
  sales: Sale[];
  campaigns: Campaign[];
}

function createDb(): DemoDb {
  const services = seedServices();
  const clients = seedClients();
  return {
    shop: seedShop(),
    services,
    clients,
    bookings: seedBookings(services, clients),
    sales: seedSales(services, clients),
    campaigns: seedCampaigns(),
  };
}

// Conserva lo store tra gli hot-reload di Next.js in dev
const globalRef = globalThis as unknown as { __barberDemoDb?: DemoDb };
function db(): DemoDb {
  if (!globalRef.__barberDemoDb) {
    globalRef.__barberDemoDb = createDb();
  }
  return globalRef.__barberDemoDb;
}

export class DemoStore implements DataStore {
  async getShop(): Promise<Shop> {
    return db().shop;
  }

  async setPlan(
    plan: Shop["plan"],
    stripeIds?: { customerId?: string; subscriptionId?: string }
  ): Promise<Shop> {
    const shop = db().shop;
    shop.plan = plan;
    if (stripeIds?.customerId) shop.stripeCustomerId = stripeIds.customerId;
    if (stripeIds?.subscriptionId)
      shop.stripeSubscriptionId = stripeIds.subscriptionId;
    return shop;
  }

  async listServices(): Promise<Service[]> {
    return db().services.filter((s) => s.active);
  }

  async listClients(): Promise<Client[]> {
    return [...db().clients].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  async getClientByReferralCode(code: string): Promise<Client | null> {
    const normalized = code.trim().toUpperCase();
    return (
      db().clients.find((c) => c.referralCode.toUpperCase() === normalized) ?? null
    );
  }

  async createClient(
    input: Omit<Client, "id" | "createdAt" | "visits" | "totalSpentCents" | "referralCode"> & {
      referralCode?: string;
    }
  ): Promise<Client> {
    const client: Client = {
      ...input,
      id: id("cli"),
      referralCode: input.referralCode ?? generateReferralCode(input.fullName),
      visits: 0,
      totalSpentCents: 0,
      createdAt: new Date().toISOString(),
    };
    db().clients.push(client);
    return client;
  }

  async listBookings(): Promise<Booking[]> {
    return [...db().bookings].sort((a, b) =>
      `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`)
    );
  }

  async createBooking(input: Omit<Booking, "id" | "createdAt">): Promise<Booking> {
    const booking: Booking = {
      ...input,
      id: id("bkg"),
      createdAt: new Date().toISOString(),
    };
    db().bookings.push(booking);
    return booking;
  }

  async updateBookingStatus(
    bookingId: string,
    status: Booking["status"]
  ): Promise<Booking | null> {
    const booking = db().bookings.find((b) => b.id === bookingId);
    if (!booking) return null;
    booking.status = status;
    return booking;
  }

  async listSales(): Promise<Sale[]> {
    return [...db().sales].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  async createSale(input: Omit<Sale, "id" | "createdAt">): Promise<Sale> {
    const sale: Sale = {
      ...input,
      id: id("sale"),
      createdAt: new Date().toISOString(),
    };
    db().sales.push(sale);
    return sale;
  }

  async listCampaigns(): Promise<Campaign[]> {
    return db().campaigns;
  }

  async createCampaign(
    input: Omit<Campaign, "id" | "createdAt" | "redemptions">
  ): Promise<Campaign> {
    const campaign: Campaign = {
      ...input,
      id: id("cmp"),
      redemptions: 0,
      createdAt: new Date().toISOString(),
    };
    db().campaigns.push(campaign);
    return campaign;
  }

  async toggleCampaign(campaignId: string, active: boolean): Promise<Campaign | null> {
    const campaign = db().campaigns.find((c) => c.id === campaignId);
    if (!campaign) return null;
    campaign.active = active;
    return campaign;
  }

  async incrementCampaignRedemptions(campaignId: string): Promise<void> {
    const campaign = db().campaigns.find((c) => c.id === campaignId);
    if (campaign) campaign.redemptions += 1;
  }

  async recordClientVisit(clientId: string, spentCents: number): Promise<void> {
    const client = db().clients.find((c) => c.id === clientId);
    if (client) {
      client.visits += 1;
      client.totalSpentCents += spentCents;
    }
  }
}
