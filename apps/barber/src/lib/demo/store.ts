import type {
  Booking,
  Campaign,
  Customer,
  DashboardStats,
  Service,
  Shop,
  Transaction,
} from "@/lib/types";
import { generateId, generateReferralCode } from "@/lib/utils";

const DEFAULT_HOURS = {
  mon: { open: "09:00", close: "19:00" },
  tue: { open: "09:00", close: "19:00" },
  wed: { open: "09:00", close: "19:00" },
  thu: { open: "09:00", close: "19:00" },
  fri: { open: "09:00", close: "20:00" },
  sat: { open: "08:00", close: "18:00" },
  sun: { open: "00:00", close: "00:00", closed: true },
};

const shopId = "demo-shop";
const today = new Date().toISOString().slice(0, 10);

const demoShop: Shop = {
  id: shopId,
  slug: "fade-studio",
  name: "Fade Studio",
  ownerId: "demo-owner",
  email: "info@fadestudio.it",
  phone: "+39 333 123 4567",
  address: "Via Roma 42, Milano",
  description: "Barberia premium — tagli su misura, barba curata, atmosfera esclusiva.",
  plan: "pro",
  openingHours: DEFAULT_HOURS,
  createdAt: "2025-01-01T00:00:00Z",
};

const demoServices: Service[] = [
  { id: "svc-1", shopId, name: "Taglio Classico", durationMinutes: 30, priceCents: 2500, active: true },
  { id: "svc-2", shopId, name: "Taglio + Barba", durationMinutes: 45, priceCents: 3500, active: true },
  { id: "svc-3", shopId, name: "Rasatura Barba", durationMinutes: 20, priceCents: 1500, active: true },
  { id: "svc-4", shopId, name: "Trattamento Premium", durationMinutes: 60, priceCents: 5500, active: true, description: "Taglio, barba, massaggio e prodotti premium" },
];

const demoCustomers: Customer[] = [
  {
    id: "cust-1", shopId, name: "Marco Rossi", phone: "+39 340 111 2222", email: "marco@email.it",
    referralCode: "MARC8X2K", loyaltyPoints: 120, totalVisits: 8, totalSpentCents: 24000,
    lastVisitAt: "2025-06-28", createdAt: "2025-01-15T00:00:00Z",
  },
  {
    id: "cust-2", shopId, name: "Luca Bianchi", phone: "+39 340 333 4444", email: "luca@email.it",
    referralCode: "LUCA9P3M", referredBy: "MARC8X2K", loyaltyPoints: 45, totalVisits: 3, totalSpentCents: 9000,
    lastVisitAt: "2025-06-30", createdAt: "2025-03-10T00:00:00Z",
  },
  {
    id: "cust-3", shopId, name: "Andrea Verdi", phone: "+39 340 555 6666",
    referralCode: "ANDR7Q1N", loyaltyPoints: 200, totalVisits: 12, totalSpentCents: 42000,
    lastVisitAt: "2025-07-01", createdAt: "2024-11-20T00:00:00Z",
  },
];

const demoBookings: Booking[] = [
  {
    id: "bk-1", shopId, customerId: "cust-1", customerName: "Marco Rossi", customerPhone: "+39 340 111 2222",
    serviceId: "svc-2", serviceName: "Taglio + Barba", date: today, time: "10:00",
    durationMinutes: 45, priceCents: 3500, status: "confirmed", createdAt: new Date().toISOString(),
  },
  {
    id: "bk-2", shopId, customerId: "cust-3", customerName: "Andrea Verdi", customerPhone: "+39 340 555 6666",
    serviceId: "svc-4", serviceName: "Trattamento Premium", date: today, time: "14:30",
    durationMinutes: 60, priceCents: 5500, status: "pending", createdAt: new Date().toISOString(),
  },
  {
    id: "bk-3", shopId, customerId: "cust-2", customerName: "Luca Bianchi", customerPhone: "+39 340 333 4444",
    serviceId: "svc-1", serviceName: "Taglio Classico", date: today, time: "16:00",
    durationMinutes: 30, priceCents: 2500, status: "confirmed", createdAt: new Date().toISOString(),
  },
];

const demoTransactions: Transaction[] = [
  { id: "tx-1", shopId, customerId: "cust-1", customerName: "Marco Rossi", amountCents: 3500, paymentMethod: "card", description: "Taglio + Barba", date: today, createdAt: new Date().toISOString() },
  { id: "tx-2", shopId, customerId: "cust-3", customerName: "Andrea Verdi", amountCents: 5500, paymentMethod: "cash", description: "Trattamento Premium", date: "2025-07-01", createdAt: "2025-07-01T18:00:00Z" },
  { id: "tx-3", shopId, customerName: "Walk-in", amountCents: 2500, paymentMethod: "cash", description: "Taglio Classico", date: "2025-07-01", createdAt: "2025-07-01T12:00:00Z" },
  { id: "tx-4", shopId, customerId: "cust-2", customerName: "Luca Bianchi", amountCents: 2500, paymentMethod: "card", description: "Taglio Classico", date: "2025-06-30", createdAt: "2025-06-30T17:00:00Z" },
  { id: "tx-5", shopId, customerId: "cust-1", customerName: "Marco Rossi", amountCents: 3500, paymentMethod: "card", description: "Taglio + Barba", date: "2025-06-28", createdAt: "2025-06-28T11:00:00Z" },
];

const demoCampaigns: Campaign[] = [
  {
    id: "camp-1", shopId, name: "Estate -15%", type: "discount", description: "Sconto su tutti i servizi",
    discountPercent: 15, code: "ESTATE15", active: true, usageCount: 23,
    startsAt: "2025-06-01", endsAt: "2025-08-31", createdAt: "2025-05-20T00:00:00Z",
  },
  {
    id: "camp-2", shopId, name: "Porta un Amico", type: "referral",
    description: "Tu e il tuo amico ricevete €5 di sconto",
    referralRewardCents: 500, active: true, usageCount: 8, createdAt: "2025-01-01T00:00:00Z",
  },
  {
    id: "camp-3", shopId, name: "Fedeltà 10 visite", type: "loyalty",
    description: "Taglio gratis dopo 10 visite", minVisits: 10, discountPercent: 100,
    active: true, usageCount: 2, createdAt: "2025-01-01T00:00:00Z",
  },
];

function computeStats(): DashboardStats {
  const monthStart = new Date();
  monthStart.setDate(1);
  const monthStartStr = monthStart.toISOString().slice(0, 10);

  return {
    todayRevenueCents: demoTransactions
      .filter((t) => t.date === today)
      .reduce((s, t) => s + t.amountCents, 0),
    monthRevenueCents: demoTransactions
      .filter((t) => t.date >= monthStartStr)
      .reduce((s, t) => s + t.amountCents, 0),
    todayBookings: demoBookings.filter((b) => b.date === today).length,
    pendingBookings: demoBookings.filter((b) => b.status === "pending").length,
    totalCustomers: demoCustomers.length,
    activeCampaigns: demoCampaigns.filter((c) => c.active).length,
  };
}

export const demoStore = {
  getShop: () => demoShop,
  getShopBySlug: (slug: string) => (slug === demoShop.slug ? demoShop : null),
  getServices: () => [...demoServices],
  getCustomers: () => [...demoCustomers],
  getBookings: () => [...demoBookings].sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`)),
  getTransactions: () => [...demoTransactions].sort((a, b) => b.date.localeCompare(a.date)),
  getCampaigns: () => [...demoCampaigns],
  getStats: computeStats,

  addCustomer(data: Omit<Customer, "id" | "shopId" | "referralCode" | "loyaltyPoints" | "totalVisits" | "totalSpentCents" | "createdAt">) {
    const customer: Customer = {
      ...data,
      id: generateId(),
      shopId,
      referralCode: generateReferralCode(data.name),
      loyaltyPoints: 0,
      totalVisits: 0,
      totalSpentCents: 0,
      createdAt: new Date().toISOString(),
    };
    demoCustomers.push(customer);
    return customer;
  },

  addBooking(data: Omit<Booking, "id" | "shopId" | "createdAt" | "status">) {
    const booking: Booking = {
      ...data,
      id: generateId(),
      shopId,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    demoBookings.push(booking);
    return booking;
  },

  updateBookingStatus(id: string, status: Booking["status"]) {
    const booking = demoBookings.find((b) => b.id === id);
    if (booking) booking.status = status;
    return booking;
  },

  addTransaction(data: Omit<Transaction, "id" | "shopId" | "createdAt">) {
    const tx: Transaction = {
      ...data,
      id: generateId(),
      shopId,
      createdAt: new Date().toISOString(),
    };
    demoTransactions.unshift(tx);
    return tx;
  },

  addCampaign(data: Omit<Campaign, "id" | "shopId" | "usageCount" | "createdAt">) {
    const campaign: Campaign = {
      ...data,
      id: generateId(),
      shopId,
      usageCount: 0,
      createdAt: new Date().toISOString(),
    };
    demoCampaigns.push(campaign);
    return campaign;
  },

  toggleCampaign(id: string) {
    const campaign = demoCampaigns.find((c) => c.id === id);
    if (campaign) campaign.active = !campaign.active;
    return campaign;
  },
};
