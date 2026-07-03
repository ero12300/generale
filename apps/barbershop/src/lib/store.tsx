"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type {
  Booking,
  BookingStatus,
  Campaign,
  Client,
  PaymentMethod,
  PlanId,
  Service,
  Staff,
  WorkspaceData,
} from "./types";
import { createDemoData, DEMO_ORG_ID } from "./demo-seed";
import { isFirebaseConfigured } from "./firebase/client";

const STORAGE_KEY = "barber-suite:workspace:v1";

function uid(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 7)}`;
}

function makeReferralCode(name: string): string {
  const base = name.replace(/[^a-zA-Z]/g, "").slice(0, 5).toUpperCase() || "CLNT";
  return `${base}-${Math.floor(1000 + Math.random() * 9000)}`;
}

interface StoreContextValue {
  data: WorkspaceData;
  mode: "demo" | "firebase";
  ready: boolean;

  // clienti
  addClient: (input: {
    name: string;
    phone: string;
    email?: string;
    notes?: string;
    referredByCode?: string;
  }) => Client;
  updateClient: (id: string, patch: Partial<Client>) => void;
  deleteClient: (id: string) => void;

  // prenotazioni
  addBooking: (input: {
    clientId: string | null;
    clientName: string;
    clientPhone: string;
    serviceId: string;
    staffId: string;
    startAt: string;
    notes?: string;
    source?: Booking["source"];
  }) => Booking;
  updateBookingStatus: (id: string, status: BookingStatus) => void;
  deleteBooking: (id: string) => void;

  // incassi
  addPayment: (input: {
    amountCents: number;
    method: PaymentMethod;
    description: string;
    clientId?: string | null;
  }) => void;

  // campagne
  addCampaign: (input: {
    type: Campaign["type"];
    name: string;
    code: string;
    discountPercent?: number | null;
    discountCents?: number | null;
    rewardDescription?: string;
  }) => Campaign;
  toggleCampaign: (id: string) => void;
  deleteCampaign: (id: string) => void;

  // impostazioni
  addService: (input: { name: string; durationMin: number; priceCents: number }) => void;
  addStaff: (input: { name: string; role: string }) => void;

  // abbonamento
  setPlan: (plan: PlanId, stripe?: { customerId?: string; subscriptionId?: string }) => void;

  resetDemo: () => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

const STAFF_COLORS = ["#d97706", "#0ea5e9", "#22c55e", "#a855f7", "#ef4444", "#eab308"];

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<WorkspaceData>(() => createDemoData());
  const [ready, setReady] = useState(false);
  const mode: "demo" | "firebase" = isFirebaseConfigured() ? "firebase" : "demo";
  const skipPersist = useRef(true);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setData(JSON.parse(raw) as WorkspaceData);
      }
    } catch {
      // ignora: fallback al seed demo
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (skipPersist.current) {
      skipPersist.current = false;
      return;
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // storage pieno o non disponibile
    }
  }, [data, ready]);

  const addClient = useCallback<StoreContextValue["addClient"]>((input) => {
    const client: Client = {
      id: uid("cli"),
      organizationId: DEMO_ORG_ID,
      name: input.name,
      phone: input.phone,
      email: input.email?.trim() || null,
      notes: input.notes?.trim() || null,
      tags: ["nuovo"],
      visits: 0,
      totalSpentCents: 0,
      loyaltyPoints: 0,
      referralCode: makeReferralCode(input.name),
      referredByCode: input.referredByCode?.trim() || null,
      lastVisitAt: null,
      createdAt: new Date().toISOString(),
    };
    setData((d) => ({ ...d, clients: [client, ...d.clients] }));
    return client;
  }, []);

  const updateClient = useCallback<StoreContextValue["updateClient"]>((id, patch) => {
    setData((d) => ({
      ...d,
      clients: d.clients.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    }));
  }, []);

  const deleteClient = useCallback<StoreContextValue["deleteClient"]>((id) => {
    setData((d) => ({ ...d, clients: d.clients.filter((c) => c.id !== id) }));
  }, []);

  const addBooking = useCallback<StoreContextValue["addBooking"]>(
    (input) => {
      const service = data.services.find((s) => s.id === input.serviceId);
      const member = data.staff.find((s) => s.id === input.staffId);
      const booking: Booking = {
        id: uid("bk"),
        organizationId: DEMO_ORG_ID,
        clientId: input.clientId,
        clientName: input.clientName,
        clientPhone: input.clientPhone,
        serviceId: input.serviceId,
        serviceName: service?.name ?? "Servizio",
        staffId: input.staffId,
        staffName: member?.name ?? "Staff",
        startAt: input.startAt,
        durationMin: service?.durationMin ?? 30,
        priceCents: service?.priceCents ?? 0,
        status: input.source === "online" ? "pending" : "confirmed",
        source: input.source ?? "internal",
        notes: input.notes?.trim() || null,
        createdAt: new Date().toISOString(),
      };
      setData((d) => ({ ...d, bookings: [booking, ...d.bookings] }));
      return booking;
    },
    [data.services, data.staff]
  );

  const updateBookingStatus = useCallback<StoreContextValue["updateBookingStatus"]>(
    (id, status) => {
      setData((d) => {
        const booking = d.bookings.find((b) => b.id === id);
        if (!booking) return d;

        let payments = d.payments;
        let clients = d.clients;

        // Quando la prenotazione è "completata" genera automaticamente l'incasso
        // e aggiorna statistiche cliente + punti fedeltà.
        if (status === "completed" && booking.status !== "completed") {
          payments = [
            {
              id: uid("pay"),
              organizationId: DEMO_ORG_ID,
              bookingId: booking.id,
              clientId: booking.clientId,
              amountCents: booking.priceCents,
              method: "card" as PaymentMethod,
              description: booking.serviceName,
              date: new Date().toISOString(),
            },
            ...d.payments,
          ];
          if (booking.clientId) {
            clients = d.clients.map((c) =>
              c.id === booking.clientId
                ? {
                    ...c,
                    visits: c.visits + 1,
                    totalSpentCents: c.totalSpentCents + booking.priceCents,
                    loyaltyPoints: c.loyaltyPoints + Math.round(booking.priceCents / 100),
                    lastVisitAt: new Date().toISOString(),
                  }
                : c
            );
          }
        }

        return {
          ...d,
          bookings: d.bookings.map((b) => (b.id === id ? { ...b, status } : b)),
          payments,
          clients,
        };
      });
    },
    []
  );

  const deleteBooking = useCallback<StoreContextValue["deleteBooking"]>((id) => {
    setData((d) => ({ ...d, bookings: d.bookings.filter((b) => b.id !== id) }));
  }, []);

  const addPayment = useCallback<StoreContextValue["addPayment"]>((input) => {
    setData((d) => ({
      ...d,
      payments: [
        {
          id: uid("pay"),
          organizationId: DEMO_ORG_ID,
          bookingId: null,
          clientId: input.clientId ?? null,
          amountCents: Math.round(input.amountCents),
          method: input.method,
          description: input.description,
          date: new Date().toISOString(),
        },
        ...d.payments,
      ],
    }));
  }, []);

  const addCampaign = useCallback<StoreContextValue["addCampaign"]>((input) => {
    const campaign: Campaign = {
      id: uid("camp"),
      organizationId: DEMO_ORG_ID,
      type: input.type,
      name: input.name,
      code: input.code.toUpperCase(),
      discountPercent: input.discountPercent ?? null,
      discountCents: input.discountCents ?? null,
      active: true,
      usageCount: 0,
      rewardDescription: input.rewardDescription ?? null,
      createdAt: new Date().toISOString(),
    };
    setData((d) => ({ ...d, campaigns: [campaign, ...d.campaigns] }));
    return campaign;
  }, []);

  const toggleCampaign = useCallback<StoreContextValue["toggleCampaign"]>((id) => {
    setData((d) => ({
      ...d,
      campaigns: d.campaigns.map((c) => (c.id === id ? { ...c, active: !c.active } : c)),
    }));
  }, []);

  const deleteCampaign = useCallback<StoreContextValue["deleteCampaign"]>((id) => {
    setData((d) => ({ ...d, campaigns: d.campaigns.filter((c) => c.id !== id) }));
  }, []);

  const addService = useCallback<StoreContextValue["addService"]>((input) => {
    const service: Service = {
      id: uid("svc"),
      organizationId: DEMO_ORG_ID,
      name: input.name,
      durationMin: input.durationMin,
      priceCents: Math.round(input.priceCents),
      active: true,
    };
    setData((d) => ({ ...d, services: [...d.services, service] }));
  }, []);

  const addStaff = useCallback<StoreContextValue["addStaff"]>((input) => {
    setData((d) => {
      const member: Staff = {
        id: uid("staff"),
        organizationId: DEMO_ORG_ID,
        name: input.name,
        role: input.role,
        color: STAFF_COLORS[d.staff.length % STAFF_COLORS.length],
        active: true,
      };
      return { ...d, staff: [...d.staff, member] };
    });
  }, []);

  const setPlan = useCallback<StoreContextValue["setPlan"]>((plan, stripe) => {
    setData((d) => ({
      ...d,
      subscription: {
        ...d.subscription,
        plan,
        status: "active",
        renewsAt: plan === "pro"
          ? new Date(Date.now() + 30 * 864e5).toISOString()
          : null,
        stripeCustomerId: stripe?.customerId ?? d.subscription.stripeCustomerId,
        stripeSubscriptionId: stripe?.subscriptionId ?? d.subscription.stripeSubscriptionId,
      },
    }));
  }, []);

  const resetDemo = useCallback(() => {
    const fresh = createDemoData();
    setData(fresh);
  }, []);

  const value = useMemo<StoreContextValue>(
    () => ({
      data,
      mode,
      ready,
      addClient,
      updateClient,
      deleteClient,
      addBooking,
      updateBookingStatus,
      deleteBooking,
      addPayment,
      addCampaign,
      toggleCampaign,
      deleteCampaign,
      addService,
      addStaff,
      setPlan,
      resetDemo,
    }),
    [
      data,
      mode,
      ready,
      addClient,
      updateClient,
      deleteClient,
      addBooking,
      updateBookingStatus,
      deleteBooking,
      addPayment,
      addCampaign,
      toggleCampaign,
      deleteCampaign,
      addService,
      addStaff,
      setPlan,
      resetDemo,
    ]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore deve essere usato dentro <StoreProvider>");
  return ctx;
}
