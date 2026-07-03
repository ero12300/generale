// -----------------------------------------------------------------------------
// Store demo in-memory. Persistente per la durata del processo Node del server.
// Sostituibile con l'adapter Firestore (vedi src/lib/data/repo.ts).
// -----------------------------------------------------------------------------
import type {
  Booking,
  Client,
  Coupon,
  Payment,
  ReferralEvent,
  Service,
  Shop,
  Staff,
} from "../types";
import { createDemoDataset } from "./seed";

interface Store {
  shops: Map<string, Shop>;
  services: Map<string, Service>;
  staff: Map<string, Staff>;
  clients: Map<string, Client>;
  bookings: Map<string, Booking>;
  payments: Map<string, Payment>;
  coupons: Map<string, Coupon>;
  referrals: Map<string, ReferralEvent>;
}

declare global {
  // eslint-disable-next-line no-var
  var __barberProDemoStore: Store | undefined;
}

function fresh(): Store {
  const ds = createDemoDataset();
  return {
    shops: new Map([[ds.shop.id, ds.shop]]),
    services: new Map(ds.services.map((s) => [s.id, s])),
    staff: new Map(ds.staff.map((s) => [s.id, s])),
    clients: new Map(ds.clients.map((c) => [c.id, c])),
    bookings: new Map(ds.bookings.map((b) => [b.id, b])),
    payments: new Map(ds.payments.map((p) => [p.id, p])),
    coupons: new Map(ds.coupons.map((c) => [c.id, c])),
    referrals: new Map(ds.referrals.map((r) => [r.id, r])),
  };
}

export function store(): Store {
  if (!globalThis.__barberProDemoStore) {
    globalThis.__barberProDemoStore = fresh();
  }
  return globalThis.__barberProDemoStore;
}

export function resetDemoStore() {
  globalThis.__barberProDemoStore = fresh();
}

export function newId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}
