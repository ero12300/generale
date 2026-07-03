import type {
  Booking,
  Campaign,
  Client,
  Payment,
  Service,
  Staff,
  WorkspaceData,
} from "./types";

const ORG_ID = "demo-barbershop";

function isoDaysFromNow(days: number, hour = 10, minute = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

function isoDaysAgo(days: number, hour = 10, minute = 0): string {
  return isoDaysFromNow(-days, hour, minute);
}

const services: Service[] = [
  { id: "svc-taglio", organizationId: ORG_ID, name: "Taglio Uomo", durationMin: 30, priceCents: 2000, active: true },
  { id: "svc-barba", organizationId: ORG_ID, name: "Barba & Rasatura", durationMin: 20, priceCents: 1500, active: true },
  { id: "svc-combo", organizationId: ORG_ID, name: "Taglio + Barba", durationMin: 45, priceCents: 3000, active: true },
  { id: "svc-bimbo", organizationId: ORG_ID, name: "Taglio Bimbo", durationMin: 20, priceCents: 1500, active: true },
  { id: "svc-vip", organizationId: ORG_ID, name: "Rituale VIP (Taglio+Barba+Trattamento)", durationMin: 60, priceCents: 4500, active: true },
];

const staff: Staff[] = [
  { id: "staff-marco", organizationId: ORG_ID, name: "Marco", role: "Master Barber", color: "#d97706", active: true },
  { id: "staff-luca", organizationId: ORG_ID, name: "Luca", role: "Barber", color: "#0ea5e9", active: true },
];

const clients: Client[] = [
  { id: "cli-001", organizationId: ORG_ID, name: "Giuseppe Verdi", phone: "+39 340 1112233", email: "g.verdi@example.com", notes: "Preferisce sfumatura alta", tags: ["fedele"], visits: 24, totalSpentCents: 60000, loyaltyPoints: 240, referralCode: "GIUSE-4821", referredByCode: null, lastVisitAt: isoDaysAgo(6), createdAt: isoDaysAgo(400) },
  { id: "cli-002", organizationId: ORG_ID, name: "Andrea Rossi", phone: "+39 333 4455667", email: "andrea.rossi@example.com", notes: null, tags: ["barba"], visits: 12, totalSpentCents: 30000, loyaltyPoints: 120, referralCode: "ANDRE-1093", referredByCode: "GIUSE-4821", lastVisitAt: isoDaysAgo(12), createdAt: isoDaysAgo(200) },
  { id: "cli-003", organizationId: ORG_ID, name: "Francesco Bianchi", phone: "+39 348 9988776", email: null, notes: "Cliente VIP", tags: ["vip", "fedele"], visits: 40, totalSpentCents: 150000, loyaltyPoints: 500, referralCode: "FRANC-7720", referredByCode: null, lastVisitAt: isoDaysAgo(3), createdAt: isoDaysAgo(600) },
  { id: "cli-004", organizationId: ORG_ID, name: "Matteo Esposito", phone: "+39 366 2211003", email: "matteo.e@example.com", notes: null, tags: ["nuovo"], visits: 2, totalSpentCents: 4000, loyaltyPoints: 20, referralCode: "MATTE-3341", referredByCode: "FRANC-7720", lastVisitAt: isoDaysAgo(20), createdAt: isoDaysAgo(45) },
  { id: "cli-005", organizationId: ORG_ID, name: "Davide Romano", phone: "+39 351 7766554", email: "d.romano@example.com", notes: "Allergico a profumazioni forti", tags: ["barba"], visits: 8, totalSpentCents: 18000, loyaltyPoints: 80, referralCode: "DAVID-5567", referredByCode: null, lastVisitAt: isoDaysAgo(9), createdAt: isoDaysAgo(150) },
];

function makePayment(id: string, amountCents: number, method: Payment["method"], daysAgo: number, clientId: string | null, desc: string): Payment {
  return { id, organizationId: ORG_ID, bookingId: null, clientId, amountCents, method, description: desc, date: isoDaysAgo(daysAgo, 11, 0) };
}

// Storico incassi ultimi 30 giorni (mix carte/contanti)
const payments: Payment[] = [
  makePayment("pay-001", 3000, "card", 0, "cli-003", "Taglio + Barba"),
  makePayment("pay-002", 2000, "cash", 0, "cli-001", "Taglio Uomo"),
  makePayment("pay-003", 4500, "card", 1, "cli-003", "Rituale VIP"),
  makePayment("pay-004", 1500, "cash", 1, "cli-005", "Barba & Rasatura"),
  makePayment("pay-005", 2000, "card", 2, "cli-002", "Taglio Uomo"),
  makePayment("pay-006", 3000, "card", 3, "cli-001", "Taglio + Barba"),
  makePayment("pay-007", 1500, "cash", 4, "cli-004", "Taglio Bimbo"),
  makePayment("pay-008", 4500, "card", 5, "cli-003", "Rituale VIP"),
  makePayment("pay-009", 2000, "cash", 7, "cli-005", "Taglio Uomo"),
  makePayment("pay-010", 3000, "card", 9, "cli-002", "Taglio + Barba"),
  makePayment("pay-011", 1500, "cash", 12, "cli-001", "Barba & Rasatura"),
  makePayment("pay-012", 4500, "card", 15, "cli-003", "Rituale VIP"),
  makePayment("pay-013", 3000, "card", 18, "cli-005", "Taglio + Barba"),
  makePayment("pay-014", 2000, "cash", 22, "cli-002", "Taglio Uomo"),
  makePayment("pay-015", 3000, "card", 27, "cli-001", "Taglio + Barba"),
];

const bookings: Booking[] = [
  { id: "bk-001", organizationId: ORG_ID, clientId: "cli-003", clientName: "Francesco Bianchi", clientPhone: "+39 348 9988776", serviceId: "svc-vip", serviceName: "Rituale VIP", staffId: "staff-marco", staffName: "Marco", startAt: isoDaysFromNow(0, 9, 30), durationMin: 60, priceCents: 4500, status: "confirmed", source: "internal", notes: null, createdAt: isoDaysAgo(2) },
  { id: "bk-002", organizationId: ORG_ID, clientId: "cli-001", clientName: "Giuseppe Verdi", clientPhone: "+39 340 1112233", serviceId: "svc-combo", serviceName: "Taglio + Barba", staffId: "staff-luca", staffName: "Luca", startAt: isoDaysFromNow(0, 11, 0), durationMin: 45, priceCents: 3000, status: "confirmed", source: "online", notes: "Sfumatura alta", createdAt: isoDaysAgo(1) },
  { id: "bk-003", organizationId: ORG_ID, clientId: "cli-005", clientName: "Davide Romano", clientPhone: "+39 351 7766554", serviceId: "svc-barba", serviceName: "Barba & Rasatura", staffId: "staff-marco", staffName: "Marco", startAt: isoDaysFromNow(1, 15, 0), durationMin: 20, priceCents: 1500, status: "pending", source: "online", notes: null, createdAt: isoDaysAgo(0) },
  { id: "bk-004", organizationId: ORG_ID, clientId: "cli-002", clientName: "Andrea Rossi", clientPhone: "+39 333 4455667", serviceId: "svc-taglio", serviceName: "Taglio Uomo", staffId: "staff-luca", staffName: "Luca", startAt: isoDaysFromNow(2, 10, 30), durationMin: 30, priceCents: 2000, status: "confirmed", source: "internal", notes: null, createdAt: isoDaysAgo(0) },
  { id: "bk-005", organizationId: ORG_ID, clientId: "cli-004", clientName: "Matteo Esposito", clientPhone: "+39 366 2211003", serviceId: "svc-bimbo", serviceName: "Taglio Bimbo", staffId: "staff-marco", staffName: "Marco", startAt: isoDaysFromNow(3, 16, 0), durationMin: 20, priceCents: 1500, status: "pending", source: "online", notes: null, createdAt: isoDaysAgo(0) },
];

const campaigns: Campaign[] = [
  { id: "camp-001", organizationId: ORG_ID, type: "discount", name: "Sconto Nuovo Cliente", code: "BENVENUTO10", discountPercent: 10, discountCents: null, active: true, usageCount: 14, rewardDescription: "10% sul primo taglio", createdAt: isoDaysAgo(90) },
  { id: "camp-002", organizationId: ORG_ID, type: "referral", name: "Porta un Amico", code: "AMICO", discountPercent: null, discountCents: 500, active: true, usageCount: 8, rewardDescription: "5€ di sconto a te e all'amico", createdAt: isoDaysAgo(60) },
  { id: "camp-003", organizationId: ORG_ID, type: "discount", name: "Martedì della Barba", code: "BARBADAY", discountPercent: 20, discountCents: null, active: false, usageCount: 31, rewardDescription: "20% sulla barba ogni martedì", createdAt: isoDaysAgo(120) },
];

export function createDemoData(): WorkspaceData {
  return {
    organization: {
      id: ORG_ID,
      name: "Barber Studio Eros",
      slug: "barber-studio-eros",
      ownerName: "Eros",
      address: "Via Roma 1, Milano",
      phone: "+39 02 1234567",
    },
    subscription: {
      organizationId: ORG_ID,
      plan: "pro",
      status: "trialing",
      renewsAt: isoDaysFromNow(14),
      stripeCustomerId: null,
      stripeSubscriptionId: null,
    },
    services,
    staff,
    clients,
    bookings,
    payments,
    campaigns,
  };
}

export const DEMO_ORG_ID = ORG_ID;
