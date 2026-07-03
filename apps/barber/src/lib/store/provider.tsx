"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { firebaseConfigured } from "../firebase";
import {
  computeDiscount,
  findCampaignByCode,
  findCustomerByReferralCode,
  generateReferralCode,
  newId,
  toIsoDate,
} from "../logic";
import { parseEuroInput } from "../money";
import { createSeedState } from "../seed";
import {
  PLANS,
  type Booking,
  type Campaign,
  type Customer,
  type PlanId,
  type Sale,
} from "../types";
import type {
  BookingInput,
  CampaignInput,
  CustomerInput,
  SaleInput,
} from "../validation";
import { createLocalAdapter } from "./localAdapter";
import type { AppState, PersistenceAdapter, StateKey } from "./state";

export type ActionResult<T = undefined> =
  | { ok: true; data: T }
  | { ok: false; error: string };

interface StoreContextValue {
  state: AppState | null;
  loading: boolean;
  mode: "demo" | "firebase";
  addBooking: (input: BookingInput) => ActionResult<Booking>;
  completeBooking: (id: string, method: Sale["method"]) => ActionResult;
  cancelBooking: (id: string) => ActionResult;
  addSale: (input: SaleInput) => ActionResult<Sale>;
  addCustomer: (input: CustomerInput, referredByCode?: string) => ActionResult<Customer>;
  addCampaign: (input: CampaignInput) => ActionResult<Campaign>;
  toggleCampaign: (id: string) => ActionResult;
  setPlan: (plan: PlanId) => void;
  resetDemo: () => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const adapterRef = useRef<PersistenceAdapter | null>(null);
  const [state, setState] = useState<AppState | null>(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"demo" | "firebase">("demo");

  useEffect(() => {
    let cancelled = false;
    async function boot() {
      let adapter: PersistenceAdapter;
      if (firebaseConfigured()) {
        try {
          const { createFirebaseAdapter } = await import("./firebaseAdapter");
          adapter = createFirebaseAdapter();
        } catch {
          adapter = createLocalAdapter();
        }
      } else {
        adapter = createLocalAdapter();
      }
      adapterRef.current = adapter;
      let loaded: AppState | null = null;
      try {
        loaded = await adapter.load();
      } catch {
        loaded = null;
      }
      if (!loaded) {
        loaded = createSeedState();
        try {
          await adapter.reset(loaded);
        } catch {
          // resta in memoria
        }
      }
      if (!cancelled) {
        setState(loaded);
        setMode(adapter.mode);
        setLoading(false);
      }
    }
    boot();
    return () => {
      cancelled = true;
    };
  }, []);

  const persist = useCallback(
    <K extends StateKey>(key: K, value: AppState[K]) => {
      adapterRef.current?.save(key, value).catch(() => {
        // errore di rete Firestore: lo stato locale resta coerente
      });
    },
    [],
  );

  const mutate = useCallback(
    (updates: Partial<AppState>) => {
      setState((prev) => {
        if (!prev) return prev;
        const next = { ...prev, ...updates };
        (Object.keys(updates) as StateKey[]).forEach((key) => {
          persist(key, next[key]);
        });
        return next;
      });
    },
    [persist],
  );

  const addBooking = useCallback(
    (input: BookingInput): ActionResult<Booking> => {
      if (!state) return { ok: false, error: "Dati non ancora caricati" };
      const service = state.services.find((s) => s.id === input.serviceId);
      const barber = state.barbers.find((b) => b.id === input.barberId);
      if (!service || !barber) {
        return { ok: false, error: "Servizio o barbiere non valido" };
      }

      const conflict = state.bookings.some(
        (b) =>
          b.date === input.date &&
          b.time === input.time &&
          b.barberId === input.barberId &&
          b.status !== "annullata",
      );
      if (conflict) {
        return { ok: false, error: "Orario appena occupato, scegline un altro" };
      }

      const plan = PLANS[state.settings.plan];
      let discountCents = 0;
      let campaignCode: string | undefined;
      let usedCampaign: Campaign | undefined;
      let referrer: Customer | undefined;

      const promo = (input.promoCode ?? "").trim();
      if (promo && plan.campaigns) {
        usedCampaign = findCampaignByCode(state.campaigns, promo);
        if (usedCampaign) {
          discountCents = computeDiscount(service.priceCents, usedCampaign);
          campaignCode = usedCampaign.code;
        } else if (plan.referralProgram) {
          referrer = findCustomerByReferralCode(state.customers, promo);
          if (referrer) {
            const referralCampaign = state.campaigns.find(
              (c) => c.kind === "referral" && c.active,
            );
            if (referralCampaign) {
              discountCents = computeDiscount(service.priceCents, referralCampaign);
              campaignCode = referrer.referralCode;
              usedCampaign = referralCampaign;
            }
          }
        }
        if (promo && !usedCampaign && !referrer) {
          return { ok: false, error: "Codice sconto non valido o scaduto" };
        }
      }

      // trova o crea il cliente per telefono
      const normalizedPhone = input.customerPhone.replace(/\s/g, "");
      let customer = state.customers.find(
        (c) => c.phone.replace(/\s/g, "") === normalizedPhone,
      );
      let customers = state.customers;
      if (!customer) {
        if (
          plan.maxCustomers !== null &&
          state.customers.length >= plan.maxCustomers
        ) {
          return {
            ok: false,
            error:
              "Limite clienti del piano Base raggiunto: passa al piano Pro per clienti illimitati",
          };
        }
        const existingCodes = new Set(state.customers.map((c) => c.referralCode));
        customer = {
          id: newId(),
          name: input.customerName,
          phone: input.customerPhone,
          email: input.customerEmail || undefined,
          referralCode: generateReferralCode(input.customerName, existingCodes),
          referredById: referrer?.id,
          createdAt: new Date().toISOString(),
          marketingConsent: input.marketingConsent,
        };
        customers = [...state.customers, customer];
      }

      const booking: Booking = {
        id: newId(),
        customerId: customer.id,
        customerName: customer.name,
        customerPhone: customer.phone,
        serviceId: service.id,
        serviceName: service.name,
        barberId: barber.id,
        barberName: barber.name,
        date: input.date,
        time: input.time,
        priceCents: service.priceCents,
        discountCents,
        campaignCode,
        status: "confermata",
        createdAt: new Date().toISOString(),
      };

      const campaigns = usedCampaign
        ? state.campaigns.map((c) =>
            c.id === usedCampaign.id ? { ...c, usageCount: c.usageCount + 1 } : c,
          )
        : state.campaigns;

      mutate({
        bookings: [...state.bookings, booking],
        customers,
        campaigns,
      });
      return { ok: true, data: booking };
    },
    [state, mutate],
  );

  const completeBooking = useCallback(
    (id: string, method: Sale["method"]): ActionResult => {
      if (!state) return { ok: false, error: "Dati non ancora caricati" };
      const booking = state.bookings.find((b) => b.id === id);
      if (!booking) return { ok: false, error: "Prenotazione non trovata" };
      if (booking.status !== "confermata") {
        return { ok: false, error: "Prenotazione già chiusa" };
      }
      const sale: Sale = {
        id: newId(),
        date: booking.date,
        serviceName: booking.serviceName,
        barberId: booking.barberId,
        barberName: booking.barberName,
        customerId: booking.customerId,
        customerName: booking.customerName,
        amountCents: booking.priceCents - booking.discountCents,
        method,
        bookingId: booking.id,
        createdAt: new Date().toISOString(),
      };
      mutate({
        bookings: state.bookings.map((b) =>
          b.id === id ? { ...b, status: "completata" } : b,
        ),
        sales: [...state.sales, sale],
      });
      return { ok: true, data: undefined };
    },
    [state, mutate],
  );

  const cancelBooking = useCallback(
    (id: string): ActionResult => {
      if (!state) return { ok: false, error: "Dati non ancora caricati" };
      const booking = state.bookings.find((b) => b.id === id);
      if (!booking) return { ok: false, error: "Prenotazione non trovata" };
      mutate({
        bookings: state.bookings.map((b) =>
          b.id === id ? { ...b, status: "annullata" } : b,
        ),
      });
      return { ok: true, data: undefined };
    },
    [state, mutate],
  );

  const addSale = useCallback(
    (input: SaleInput): ActionResult<Sale> => {
      if (!state) return { ok: false, error: "Dati non ancora caricati" };
      const amountCents = parseEuroInput(input.amountInput);
      if (amountCents === null || amountCents === 0) {
        return { ok: false, error: "Importo non valido (es. 25 o 24,50)" };
      }
      const barber = state.barbers.find((b) => b.id === input.barberId);
      if (!barber) return { ok: false, error: "Barbiere non valido" };
      const customer = input.customerId
        ? state.customers.find((c) => c.id === input.customerId)
        : undefined;
      const sale: Sale = {
        id: newId(),
        date: input.date || toIsoDate(new Date()),
        serviceName: input.serviceName,
        barberId: barber.id,
        barberName: barber.name,
        customerId: customer?.id,
        customerName: customer?.name,
        amountCents,
        method: input.method,
        createdAt: new Date().toISOString(),
      };
      mutate({ sales: [...state.sales, sale] });
      return { ok: true, data: sale };
    },
    [state, mutate],
  );

  const addCustomer = useCallback(
    (input: CustomerInput, referredByCode?: string): ActionResult<Customer> => {
      if (!state) return { ok: false, error: "Dati non ancora caricati" };
      const plan = PLANS[state.settings.plan];
      if (plan.maxCustomers !== null && state.customers.length >= plan.maxCustomers) {
        return {
          ok: false,
          error: "Limite clienti del piano Base raggiunto: passa al piano Pro",
        };
      }
      const normalizedPhone = input.phone.replace(/\s/g, "");
      if (
        state.customers.some((c) => c.phone.replace(/\s/g, "") === normalizedPhone)
      ) {
        return { ok: false, error: "Esiste già un cliente con questo telefono" };
      }
      const referrer = referredByCode
        ? findCustomerByReferralCode(state.customers, referredByCode)
        : undefined;
      const existingCodes = new Set(state.customers.map((c) => c.referralCode));
      const customer: Customer = {
        id: newId(),
        name: input.name,
        phone: input.phone,
        email: input.email || undefined,
        notes: input.notes || undefined,
        referralCode: generateReferralCode(input.name, existingCodes),
        referredById: referrer?.id,
        createdAt: new Date().toISOString(),
        marketingConsent: input.marketingConsent,
      };
      mutate({ customers: [...state.customers, customer] });
      return { ok: true, data: customer };
    },
    [state, mutate],
  );

  const addCampaign = useCallback(
    (input: CampaignInput): ActionResult<Campaign> => {
      if (!state) return { ok: false, error: "Dati non ancora caricati" };
      const plan = PLANS[state.settings.plan];
      if (!plan.campaigns) {
        return {
          ok: false,
          error: "Le campagne sconto sono una funzione del piano Pro",
        };
      }
      const code = input.code.toUpperCase();
      if (state.campaigns.some((c) => c.code.toUpperCase() === code)) {
        return { ok: false, error: "Codice già in uso" };
      }
      let value: number;
      if (input.kind === "percentuale") {
        value = Number(input.valueInput);
        if (!Number.isInteger(value) || value < 1 || value > 100) {
          return { ok: false, error: "Percentuale non valida (1-100)" };
        }
      } else {
        const cents = parseEuroInput(input.valueInput);
        if (cents === null || cents === 0) {
          return { ok: false, error: "Importo sconto non valido" };
        }
        value = cents;
      }
      const campaign: Campaign = {
        id: newId(),
        name: input.name,
        kind: input.kind,
        code,
        value,
        active: true,
        usageCount: 0,
        createdAt: new Date().toISOString(),
      };
      mutate({ campaigns: [...state.campaigns, campaign] });
      return { ok: true, data: campaign };
    },
    [state, mutate],
  );

  const toggleCampaign = useCallback(
    (id: string): ActionResult => {
      if (!state) return { ok: false, error: "Dati non ancora caricati" };
      mutate({
        campaigns: state.campaigns.map((c) =>
          c.id === id ? { ...c, active: !c.active } : c,
        ),
      });
      return { ok: true, data: undefined };
    },
    [state, mutate],
  );

  const setPlan = useCallback(
    (plan: PlanId) => {
      if (!state) return;
      mutate({
        settings: { ...state.settings, plan, subscriptionStatus: "active" },
      });
    },
    [state, mutate],
  );

  const resetDemo = useCallback(() => {
    const fresh = createSeedState();
    adapterRef.current?.reset(fresh).catch(() => {});
    setState(fresh);
  }, []);

  const value = useMemo<StoreContextValue>(
    () => ({
      state,
      loading,
      mode,
      addBooking,
      completeBooking,
      cancelBooking,
      addSale,
      addCustomer,
      addCampaign,
      toggleCampaign,
      setPlan,
      resetDemo,
    }),
    [
      state,
      loading,
      mode,
      addBooking,
      completeBooking,
      cancelBooking,
      addSale,
      addCustomer,
      addCampaign,
      toggleCampaign,
      setPlan,
      resetDemo,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore deve essere usato dentro StoreProvider");
  return ctx;
}
