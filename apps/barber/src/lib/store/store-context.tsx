"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type {
  BarberState,
  Booking,
  BookingStatus,
  Campaign,
  Client,
  PaymentMethod,
  PlanId,
  Service,
  ShopSettings,
  Subscription,
} from "../types";
import { createSeedState } from "../seed";
import { applyDiscount } from "../money";
import { referralCode, uid } from "../utils";

const STORAGE_KEY = "barberos_state_v1";

export interface CouponResult {
  ok: boolean;
  reason?: string;
  campaign?: Campaign;
  discountCents: number;
  finalCents: number;
}

export interface NewBookingInput {
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  serviceId: string;
  barberId: string;
  start: string;
  couponCode?: string;
  notes?: string;
  source: "online" | "interno";
  referralCode?: string;
}

interface StoreContextValue {
  state: BarberState;
  ready: boolean;
  // bookings
  createBooking: (input: NewBookingInput) => Booking | null;
  updateBookingStatus: (id: string, status: BookingStatus) => void;
  cashBooking: (id: string, method: PaymentMethod) => void;
  deleteBooking: (id: string) => void;
  // clients
  addClient: (client: Omit<Client, "id" | "createdAt" | "referralCode" | "totalSpentCents" | "visits" | "loyaltyPoints">) => Client;
  updateClient: (id: string, patch: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  // campaigns
  addCampaign: (c: Omit<Campaign, "id" | "createdAt" | "redemptions">) => Campaign | null;
  toggleCampaign: (id: string) => void;
  deleteCampaign: (id: string) => void;
  validateCoupon: (code: string, priceCents: number) => CouponResult;
  // services
  upsertService: (s: Service) => void;
  // settings & subscription
  updateSettings: (patch: Partial<ShopSettings>) => void;
  setPlan: (plan: PlanId, sub?: Partial<Subscription>) => void;
  resetDemo: () => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

function loadState(): BarberState {
  if (typeof window === "undefined") return createSeedState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return createSeedState();
    const parsed = JSON.parse(raw) as BarberState;
    if (!parsed.bookings || !parsed.clients) return createSeedState();
    return parsed;
  } catch {
    return createSeedState();
  }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<BarberState>(() => createSeedState());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setState(loadState());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore quota errors */
    }
  }, [state, ready]);

  const findService = useCallback(
    (id: string) => state.services.find((s) => s.id === id),
    [state.services],
  );
  const findBarber = useCallback(
    (id: string) => state.barbers.find((b) => b.id === id),
    [state.barbers],
  );

  const validateCoupon = useCallback(
    (code: string, priceCents: number): CouponResult => {
      const normalized = code.trim().toUpperCase();
      if (!normalized) return { ok: false, reason: "Nessun codice", discountCents: 0, finalCents: priceCents };
      const campaign = state.campaigns.find(
        (c) => c.code.toUpperCase() === normalized && c.active,
      );
      if (!campaign) {
        return { ok: false, reason: "Codice non valido o scaduto", discountCents: 0, finalCents: priceCents };
      }
      if (campaign.expiresAt && new Date(campaign.expiresAt) < new Date()) {
        return { ok: false, reason: "Campagna scaduta", discountCents: 0, finalCents: priceCents };
      }
      const { finalCents, discountCents } = applyDiscount(
        priceCents,
        campaign.discountType,
        campaign.discountValue,
      );
      return { ok: true, campaign, discountCents, finalCents };
    },
    [state.campaigns],
  );

  const createBooking = useCallback(
    (input: NewBookingInput): Booking | null => {
      const service = findService(input.serviceId);
      const barber = findBarber(input.barberId);
      if (!service || !barber) return null;

      let discountCents = 0;
      let couponCode: string | undefined;
      if (input.couponCode) {
        const res = validateCoupon(input.couponCode, service.priceCents);
        if (res.ok && res.campaign) {
          discountCents = res.discountCents;
          couponCode = res.campaign.code;
        }
      }

      const booking: Booking = {
        id: uid("bkg"),
        clientName: input.clientName.trim(),
        clientPhone: input.clientPhone.trim(),
        serviceId: service.id,
        serviceName: service.name,
        barberId: barber.id,
        barberName: barber.name,
        start: input.start,
        durationMin: service.durationMin,
        priceCents: service.priceCents,
        status: input.source === "online" ? "richiesta" : "confermata",
        paymentMethod: "non_pagato",
        discountCents,
        couponCode,
        notes: input.notes,
        createdAt: new Date().toISOString(),
        source: input.source,
      };

      setState((prev) => {
        // Match / create client
        const phone = booking.clientPhone;
        let clients = prev.clients;
        let client = clients.find((c) => c.phone.replace(/\s/g, "") === phone.replace(/\s/g, ""));
        if (!client) {
          const [firstName, ...rest] = booking.clientName.split(" ");
          client = {
            id: uid("cli"),
            firstName: firstName || booking.clientName,
            lastName: rest.join(" "),
            phone: booking.clientPhone,
            email: input.clientEmail,
            tier: "nuovo",
            createdAt: new Date().toISOString(),
            totalSpentCents: 0,
            visits: 0,
            loyaltyPoints: 0,
            referralCode: referralCode(firstName || "AMICO"),
            marketingConsent: true,
            referredByCode: input.referralCode?.toUpperCase(),
          };
          clients = [client, ...clients];
        }
        booking.clientId = client.id;

        const campaigns = couponCode
          ? prev.campaigns.map((c) =>
              c.code === couponCode ? { ...c, redemptions: c.redemptions + 1 } : c,
            )
          : prev.campaigns;

        return { ...prev, clients, campaigns, bookings: [booking, ...prev.bookings] };
      });

      return booking;
    },
    [findService, findBarber, validateCoupon],
  );

  const updateBookingStatus = useCallback((id: string, status: BookingStatus) => {
    setState((prev) => ({
      ...prev,
      bookings: prev.bookings.map((b) => (b.id === id ? { ...b, status } : b)),
    }));
  }, []);

  const cashBooking = useCallback((id: string, method: PaymentMethod) => {
    setState((prev) => {
      const booking = prev.bookings.find((b) => b.id === id);
      if (!booking) return prev;
      const wasCompleted = booking.status === "completata";
      const netCents = booking.priceCents - booking.discountCents;

      const bookings = prev.bookings.map((b) =>
        b.id === id ? { ...b, status: "completata" as BookingStatus, paymentMethod: method } : b,
      );

      // Aggiorna metriche cliente solo alla prima chiusura
      let clients = prev.clients;
      if (!wasCompleted && booking.clientId) {
        clients = prev.clients.map((c) => {
          if (c.id !== booking.clientId) return c;
          const totalSpentCents = c.totalSpentCents + netCents;
          const visits = c.visits + 1;
          const loyaltyPoints = c.loyaltyPoints + Math.round(netCents / 100);
          const tier: Client["tier"] =
            totalSpentCents >= 30000 || visits >= 12 ? "vip" : visits >= 3 ? "abituale" : "nuovo";
          return { ...c, totalSpentCents, visits, loyaltyPoints, tier };
        });
      }
      return { ...prev, bookings, clients };
    });
  }, []);

  const deleteBooking = useCallback((id: string) => {
    setState((prev) => ({ ...prev, bookings: prev.bookings.filter((b) => b.id !== id) }));
  }, []);

  const addClient = useCallback<StoreContextValue["addClient"]>((client) => {
    const newClient: Client = {
      ...client,
      id: uid("cli"),
      createdAt: new Date().toISOString(),
      referralCode: referralCode(client.firstName),
      totalSpentCents: 0,
      visits: 0,
      loyaltyPoints: 0,
    };
    setState((prev) => ({ ...prev, clients: [newClient, ...prev.clients] }));
    return newClient;
  }, []);

  const updateClient = useCallback((id: string, patch: Partial<Client>) => {
    setState((prev) => ({
      ...prev,
      clients: prev.clients.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    }));
  }, []);

  const deleteClient = useCallback((id: string) => {
    setState((prev) => ({ ...prev, clients: prev.clients.filter((c) => c.id !== id) }));
  }, []);

  const addCampaign = useCallback<StoreContextValue["addCampaign"]>((c) => {
    const campaign: Campaign = {
      ...c,
      id: uid("cmp"),
      createdAt: new Date().toISOString(),
      redemptions: 0,
    };
    setState((prev) => ({ ...prev, campaigns: [campaign, ...prev.campaigns] }));
    return campaign;
  }, []);

  const toggleCampaign = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      campaigns: prev.campaigns.map((c) => (c.id === id ? { ...c, active: !c.active } : c)),
    }));
  }, []);

  const deleteCampaign = useCallback((id: string) => {
    setState((prev) => ({ ...prev, campaigns: prev.campaigns.filter((c) => c.id !== id) }));
  }, []);

  const upsertService = useCallback((s: Service) => {
    setState((prev) => {
      const exists = prev.services.some((x) => x.id === s.id);
      return {
        ...prev,
        services: exists
          ? prev.services.map((x) => (x.id === s.id ? s : x))
          : [...prev.services, s],
      };
    });
  }, []);

  const updateSettings = useCallback((patch: Partial<ShopSettings>) => {
    setState((prev) => ({ ...prev, settings: { ...prev.settings, ...patch } }));
  }, []);

  const setPlan = useCallback((plan: PlanId, sub?: Partial<Subscription>) => {
    setState((prev) => ({
      ...prev,
      subscription: {
        ...prev.subscription,
        plan,
        status: plan === "pro" ? "active" : "active",
        ...sub,
      },
    }));
  }, []);

  const resetDemo = useCallback(() => {
    const fresh = createSeedState();
    setState(fresh);
  }, []);

  const value = useMemo<StoreContextValue>(
    () => ({
      state,
      ready,
      createBooking,
      updateBookingStatus,
      cashBooking,
      deleteBooking,
      addClient,
      updateClient,
      deleteClient,
      addCampaign,
      toggleCampaign,
      deleteCampaign,
      validateCoupon,
      upsertService,
      updateSettings,
      setPlan,
      resetDemo,
    }),
    [
      state,
      ready,
      createBooking,
      updateBookingStatus,
      cashBooking,
      deleteBooking,
      addClient,
      updateClient,
      deleteClient,
      addCampaign,
      toggleCampaign,
      deleteCampaign,
      validateCoupon,
      upsertService,
      updateSettings,
      setPlan,
      resetDemo,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore deve essere usato dentro <StoreProvider>");
  return ctx;
}
