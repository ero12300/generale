import { BarberDataState } from "@/lib/barber/types";

export const BARBER_STORAGE_KEY = "barber_os_state_v1";

export function generateEntityId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID()}`;
}

export function createInitialBarberData(): BarberDataState {
  const now = new Date();
  const sameDay = (hoursFromNow: number) =>
    new Date(now.getTime() + hoursFromNow * 60 * 60 * 1000).toISOString();

  return {
    subscriptionTier: "basic",
    bookings: [
      {
        id: generateEntityId("booking"),
        clientName: "Marco Rinaldi",
        clientPhone: "+39 348 1122334",
        serviceName: "Taglio + Barba Premium",
        startsAtIso: sameDay(2),
        status: "confirmed",
        source: "internal",
      },
      {
        id: generateEntityId("booking"),
        clientName: "Luca P.",
        clientPhone: "+39 347 8877665",
        serviceName: "Fade + Styling",
        startsAtIso: sameDay(5),
        status: "new",
        source: "public",
      },
    ],
    clients: [
      {
        id: "client_marco",
        fullName: "Marco Rinaldi",
        phone: "+39 348 1122334",
        email: "marco@email.com",
        visits: 12,
        lastVisitIso: new Date(now.getTime() - 9 * 24 * 60 * 60 * 1000).toISOString(),
        referredByClientId: null,
        notes: "Preferisce appuntamenti serali.",
      },
      {
        id: "client_luca",
        fullName: "Luca Pagani",
        phone: "+39 347 8877665",
        email: "",
        visits: 2,
        lastVisitIso: new Date(now.getTime() - 35 * 24 * 60 * 60 * 1000).toISOString(),
        referredByClientId: "client_marco",
        notes: "Acquisito da campagna porta-un-amico.",
      },
    ],
    payments: [
      {
        id: generateEntityId("payment"),
        amountCents: 3800,
        method: "card",
        createdAtIso: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
        bookingId: null,
        note: "Taglio premium",
      },
      {
        id: generateEntityId("payment"),
        amountCents: 2500,
        method: "cash",
        createdAtIso: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString(),
        bookingId: null,
        note: "Ritocco barba",
      },
    ],
    campaigns: [
      {
        id: generateEntityId("campaign"),
        title: "Benvenuto Nuovi Clienti",
        type: "discount",
        incentiveText: "15% sul primo trattamento",
        active: true,
        createdAtIso: now.toISOString(),
      },
      {
        id: generateEntityId("campaign"),
        title: "Porta un Amico",
        type: "referral",
        incentiveText: "10EUR di credito per entrambi",
        active: true,
        createdAtIso: now.toISOString(),
      },
    ],
  };
}

export function readBarberStorage(): BarberDataState {
  if (typeof window === "undefined") {
    return createInitialBarberData();
  }

  const raw = window.localStorage.getItem(BARBER_STORAGE_KEY);
  if (!raw) {
    const initial = createInitialBarberData();
    window.localStorage.setItem(BARBER_STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }

  try {
    return JSON.parse(raw) as BarberDataState;
  } catch {
    const initial = createInitialBarberData();
    window.localStorage.setItem(BARBER_STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
}

export function writeBarberStorage(state: BarberDataState): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(BARBER_STORAGE_KEY, JSON.stringify(state));
}
