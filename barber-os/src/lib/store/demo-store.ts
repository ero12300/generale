import type {
  Booking,
  Campaign,
  Customer,
  Service,
  ShopSettings,
  Transaction,
} from "../types";
import { todayISO } from "../types";
import type { DataStore } from "./datastore";

const STORAGE_KEY = "barber-os-demo-v1";

interface DemoData {
  services: Service[];
  customers: Customer[];
  bookings: Booking[];
  transactions: Transaction[];
  campaigns: Campaign[];
  settings: ShopSettings;
}

function isoDaysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

function seedData(): DemoData {
  const services: Service[] = [
    {
      id: "svc-taglio",
      name: "Taglio Classico",
      description: "Taglio su misura con consulenza stile e rifinitura",
      durationMin: 30,
      priceCents: 2500,
    },
    {
      id: "svc-barba",
      name: "Barba Tradizionale",
      description: "Rasatura con panno caldo, olio e balsamo",
      durationMin: 30,
      priceCents: 2000,
    },
    {
      id: "svc-combo",
      name: "Taglio + Barba",
      description: "Il rituale completo del gentiluomo",
      durationMin: 60,
      priceCents: 4000,
    },
    {
      id: "svc-bimbo",
      name: "Taglio Bimbo",
      description: "Per i piccoli gentiluomini fino a 12 anni",
      durationMin: 20,
      priceCents: 1500,
    },
  ];

  const customers: Customer[] = [
    {
      id: "cust-1",
      name: "Marco Rossi",
      phone: "333 1234567",
      email: "marco.rossi@example.com",
      notes: "Preferisce sfumatura bassa",
      createdAt: isoDaysAgo(60),
      referralCode: "MARC-A1B2",
      referredBy: null,
    },
    {
      id: "cust-2",
      name: "Luca Bianchi",
      phone: "347 7654321",
      email: "",
      notes: "",
      createdAt: isoDaysAgo(30),
      referralCode: "LUCA-C3D4",
      referredBy: "MARC-A1B2",
    },
    {
      id: "cust-3",
      name: "Giovanni Verdi",
      phone: "339 9876543",
      email: "g.verdi@example.com",
      notes: "Barba lunga, cliente storico",
      createdAt: isoDaysAgo(120),
      referralCode: "GIOV-E5F6",
      referredBy: null,
    },
  ];

  const bookings: Booking[] = [
    {
      id: "bk-1",
      customerName: "Marco Rossi",
      phone: "333 1234567",
      serviceId: "svc-combo",
      date: isoDaysAgo(1),
      time: "10:00",
      status: "completata",
      priceCents: 4000,
      discountCode: null,
      finalPriceCents: 4000,
      createdAt: isoDaysAgo(3),
    },
    {
      id: "bk-2",
      customerName: "Luca Bianchi",
      phone: "347 7654321",
      serviceId: "svc-taglio",
      date: todayISO(),
      time: "15:00",
      status: "confermata",
      priceCents: 2500,
      discountCode: "BENVENUTO10",
      finalPriceCents: 2250,
      createdAt: isoDaysAgo(2),
    },
  ];

  const transactions: Transaction[] = [
    {
      id: "tx-1",
      date: isoDaysAgo(1),
      amountCents: 4000,
      method: "carta",
      description: "Taglio + Barba — Marco Rossi",
      bookingId: "bk-1",
    },
    {
      id: "tx-2",
      date: isoDaysAgo(1),
      amountCents: 2500,
      method: "contanti",
      description: "Taglio Classico — cliente di passaggio",
      bookingId: null,
    },
    {
      id: "tx-3",
      date: isoDaysAgo(2),
      amountCents: 2000,
      method: "contanti",
      description: "Barba Tradizionale — Giovanni Verdi",
      bookingId: null,
    },
  ];

  const campaigns: Campaign[] = [
    {
      id: "camp-1",
      name: "Benvenuto nuovi clienti",
      type: "sconto",
      code: "BENVENUTO10",
      discountPct: 10,
      active: true,
      uses: 1,
      createdAt: isoDaysAgo(30),
    },
    {
      id: "camp-2",
      name: "Porta un amico",
      type: "referral",
      code: "AMICO15",
      discountPct: 15,
      active: true,
      uses: 0,
      createdAt: isoDaysAgo(15),
    },
  ];

  return {
    services,
    customers,
    bookings,
    transactions,
    campaigns,
    settings: {
      id: "settings",
      plan: "pro",
      shopName: "BarberOS Demo",
      openingHour: 9,
      closingHour: 19,
      slotMinutes: 30,
    },
  };
}

function load(): DemoData {
  if (typeof window === "undefined") return seedData();
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const data = seedData();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return data;
  }
  try {
    return JSON.parse(raw) as DemoData;
  } catch {
    const data = seedData();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return data;
  }
}

function save(data: DemoData): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function upsert<T extends { id: string }>(list: T[], item: T): T[] {
  const idx = list.findIndex((x) => x.id === item.id);
  if (idx === -1) return [...list, item];
  const next = [...list];
  next[idx] = item;
  return next;
}

export class DemoStore implements DataStore {
  async listServices(): Promise<Service[]> {
    return load().services;
  }
  async saveService(service: Service): Promise<void> {
    const data = load();
    data.services = upsert(data.services, service);
    save(data);
  }
  async deleteService(id: string): Promise<void> {
    const data = load();
    data.services = data.services.filter((s) => s.id !== id);
    save(data);
  }

  async listCustomers(): Promise<Customer[]> {
    return load().customers;
  }
  async saveCustomer(customer: Customer): Promise<void> {
    const data = load();
    data.customers = upsert(data.customers, customer);
    save(data);
  }
  async deleteCustomer(id: string): Promise<void> {
    const data = load();
    data.customers = data.customers.filter((c) => c.id !== id);
    save(data);
  }

  async listBookings(): Promise<Booking[]> {
    return load().bookings;
  }
  async saveBooking(booking: Booking): Promise<void> {
    const data = load();
    data.bookings = upsert(data.bookings, booking);
    save(data);
  }
  async deleteBooking(id: string): Promise<void> {
    const data = load();
    data.bookings = data.bookings.filter((b) => b.id !== id);
    save(data);
  }

  async listTransactions(): Promise<Transaction[]> {
    return load().transactions;
  }
  async saveTransaction(tx: Transaction): Promise<void> {
    const data = load();
    data.transactions = upsert(data.transactions, tx);
    save(data);
  }
  async deleteTransaction(id: string): Promise<void> {
    const data = load();
    data.transactions = data.transactions.filter((t) => t.id !== id);
    save(data);
  }

  async listCampaigns(): Promise<Campaign[]> {
    return load().campaigns;
  }
  async saveCampaign(campaign: Campaign): Promise<void> {
    const data = load();
    data.campaigns = upsert(data.campaigns, campaign);
    save(data);
  }
  async deleteCampaign(id: string): Promise<void> {
    const data = load();
    data.campaigns = data.campaigns.filter((c) => c.id !== id);
    save(data);
  }

  async getSettings(): Promise<ShopSettings> {
    return load().settings;
  }
  async saveSettings(settings: ShopSettings): Promise<void> {
    const data = load();
    data.settings = settings;
    save(data);
  }
}
