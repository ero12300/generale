"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type {
  Booking,
  BookingStatus,
  Campaign,
  Client,
  Payment,
  PlanId,
  Service,
  ShopSettings,
  WorkspaceData,
} from "../types";
import { PLANS, type Plan } from "../plans";
import { genId, genReferralCode } from "../format";
import { useAuth } from "../auth/AuthProvider";
import {
  loadLocal,
  saveLocal,
  resetLocal,
  loadFirestore,
  saveFirestore,
  isFirebaseMode,
} from "./persistence";

interface WorkspaceContextValue extends WorkspaceData {
  ready: boolean;
  plan: Plan;
  // Servizi
  addService: (input: Omit<Service, "id" | "createdAt">) => { ok: boolean; error?: string };
  updateService: (id: string, patch: Partial<Service>) => void;
  removeService: (id: string) => void;
  // Clienti
  addClient: (input: Omit<Client, "id" | "createdAt" | "referralCode">) => { ok: boolean; error?: string; client?: Client };
  updateClient: (id: string, patch: Partial<Client>) => void;
  removeClient: (id: string) => void;
  findClientByReferral: (code: string) => Client | undefined;
  // Prenotazioni
  addBooking: (input: Omit<Booking, "id" | "createdAt">) => Booking;
  setBookingStatus: (id: string, status: BookingStatus) => void;
  removeBooking: (id: string) => void;
  // Incassi
  addPayment: (input: Omit<Payment, "id" | "createdAt">) => void;
  removePayment: (id: string) => void;
  // Campagne
  addCampaign: (input: Omit<Campaign, "id" | "createdAt">) => { ok: boolean; error?: string };
  toggleCampaign: (id: string) => void;
  removeCampaign: (id: string) => void;
  // Impostazioni & piano
  updateSettings: (patch: Partial<ShopSettings>) => void;
  setPlan: (plan: PlanId) => void;
  resetDemo: () => void;
  // Feature gating
  hasFeature: (feature: keyof Plan["limits"]) => boolean;
  canAddClient: boolean;
  canAddService: boolean;
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [data, setData] = useState<WorkspaceData | null>(null);
  const [ready, setReady] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Caricamento iniziale del workspace.
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setReady(false);
      if (isFirebaseMode() && user && !user.isDemo) {
        try {
          const fromCloud = await loadFirestore(user.uid);
          if (!cancelled) setData(fromCloud);
        } catch {
          if (!cancelled) setData(loadLocal());
        }
      } else {
        setData(loadLocal());
      }
      if (!cancelled) setReady(true);
    }
    if (user) load();
    return () => {
      cancelled = true;
    };
  }, [user]);

  // Salvataggio automatico (debounce) su ogni modifica.
  const persist = useCallback(
    (next: WorkspaceData) => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        if (isFirebaseMode() && user && !user.isDemo) {
          void saveFirestore(user.uid, next);
        } else {
          saveLocal(next);
        }
      }, 300);
    },
    [user],
  );

  const mutate = useCallback(
    (updater: (prev: WorkspaceData) => WorkspaceData) => {
      setData((prev) => {
        if (!prev) return prev;
        const next = updater(prev);
        persist(next);
        return next;
      });
    },
    [persist],
  );

  const plan: Plan = useMemo(
    () => PLANS[data?.settings.plan ?? "free"] ?? PLANS.free,
    [data?.settings.plan],
  );

  // ---- Azioni ----

  const addService = useCallback<WorkspaceContextValue["addService"]>(
    (input) => {
      let result: { ok: boolean; error?: string } = { ok: true };
      mutate((prev) => {
        const limit = PLANS[prev.settings.plan].limits.maxServices;
        if (limit !== null && prev.services.length >= limit) {
          result = { ok: false, error: `Il piano ${PLANS[prev.settings.plan].name} consente max ${limit} servizi. Passa a Pro.` };
          return prev;
        }
        const service: Service = { ...input, id: genId("svc"), createdAt: new Date().toISOString() };
        return { ...prev, services: [service, ...prev.services] };
      });
      return result;
    },
    [mutate],
  );

  const updateService = useCallback(
    (id: string, patch: Partial<Service>) =>
      mutate((prev) => ({
        ...prev,
        services: prev.services.map((s) => (s.id === id ? { ...s, ...patch } : s)),
      })),
    [mutate],
  );

  const removeService = useCallback(
    (id: string) => mutate((prev) => ({ ...prev, services: prev.services.filter((s) => s.id !== id) })),
    [mutate],
  );

  const addClient = useCallback<WorkspaceContextValue["addClient"]>(
    (input) => {
      let result: { ok: boolean; error?: string; client?: Client } = { ok: true };
      mutate((prev) => {
        const limit = PLANS[prev.settings.plan].limits.maxClients;
        if (limit !== null && prev.clients.length >= limit) {
          result = { ok: false, error: `Il piano ${PLANS[prev.settings.plan].name} consente max ${limit} clienti. Passa a Pro.` };
          return prev;
        }
        const client: Client = {
          ...input,
          id: genId("cli"),
          referralCode: genReferralCode(input.firstName),
          createdAt: new Date().toISOString(),
        };
        result = { ok: true, client };
        return { ...prev, clients: [client, ...prev.clients] };
      });
      return result;
    },
    [mutate],
  );

  const updateClient = useCallback(
    (id: string, patch: Partial<Client>) =>
      mutate((prev) => ({
        ...prev,
        clients: prev.clients.map((c) => (c.id === id ? { ...c, ...patch } : c)),
      })),
    [mutate],
  );

  const removeClient = useCallback(
    (id: string) => mutate((prev) => ({ ...prev, clients: prev.clients.filter((c) => c.id !== id) })),
    [mutate],
  );

  const findClientByReferral = useCallback(
    (code: string) => data?.clients.find((c) => c.referralCode.toLowerCase() === code.trim().toLowerCase()),
    [data?.clients],
  );

  const addBooking = useCallback<WorkspaceContextValue["addBooking"]>(
    (input) => {
      const booking: Booking = { ...input, id: genId("bkg"), createdAt: new Date().toISOString() };
      mutate((prev) => ({ ...prev, bookings: [booking, ...prev.bookings] }));
      return booking;
    },
    [mutate],
  );

  const setBookingStatus = useCallback(
    (id: string, status: BookingStatus) =>
      mutate((prev) => {
        const bookings = prev.bookings.map((b) => (b.id === id ? { ...b, status } : b));
        // Quando una prenotazione viene completata, registra automaticamente l'incasso.
        const target = prev.bookings.find((b) => b.id === id);
        let payments = prev.payments;
        if (target && status === "completed" && !prev.payments.some((p) => p.bookingId === id)) {
          payments = [
            {
              id: genId("pay"),
              bookingId: id,
              clientId: target.clientId,
              clientName: target.clientName,
              description: target.serviceName,
              amountCents: target.priceCents,
              discountCents: 0,
              method: "cash",
              date: new Date().toISOString(),
              createdAt: new Date().toISOString(),
            },
            ...prev.payments,
          ];
        }
        return { ...prev, bookings, payments };
      }),
    [mutate],
  );

  const removeBooking = useCallback(
    (id: string) => mutate((prev) => ({ ...prev, bookings: prev.bookings.filter((b) => b.id !== id) })),
    [mutate],
  );

  const addPayment = useCallback(
    (input: Omit<Payment, "id" | "createdAt">) =>
      mutate((prev) => ({
        ...prev,
        payments: [{ ...input, id: genId("pay"), createdAt: new Date().toISOString() }, ...prev.payments],
      })),
    [mutate],
  );

  const removePayment = useCallback(
    (id: string) => mutate((prev) => ({ ...prev, payments: prev.payments.filter((p) => p.id !== id) })),
    [mutate],
  );

  const addCampaign = useCallback<WorkspaceContextValue["addCampaign"]>(
    (input) => {
      let result: { ok: boolean; error?: string } = { ok: true };
      mutate((prev) => {
        if (!PLANS[prev.settings.plan].limits.campaigns) {
          result = { ok: false, error: "Le campagne sono disponibili nel piano Pro." };
          return prev;
        }
        const campaign: Campaign = { ...input, id: genId("cmp"), createdAt: new Date().toISOString() };
        return { ...prev, campaigns: [campaign, ...prev.campaigns] };
      });
      return result;
    },
    [mutate],
  );

  const toggleCampaign = useCallback(
    (id: string) =>
      mutate((prev) => ({
        ...prev,
        campaigns: prev.campaigns.map((c) => (c.id === id ? { ...c, active: !c.active } : c)),
      })),
    [mutate],
  );

  const removeCampaign = useCallback(
    (id: string) => mutate((prev) => ({ ...prev, campaigns: prev.campaigns.filter((c) => c.id !== id) })),
    [mutate],
  );

  const updateSettings = useCallback(
    (patch: Partial<ShopSettings>) => mutate((prev) => ({ ...prev, settings: { ...prev.settings, ...patch } })),
    [mutate],
  );

  const setPlan = useCallback(
    (plan: PlanId) => mutate((prev) => ({ ...prev, settings: { ...prev.settings, plan } })),
    [mutate],
  );

  const resetDemo = useCallback(() => {
    const seed = resetLocal();
    setData(seed);
  }, []);

  const hasFeature = useCallback(
    (feature: keyof Plan["limits"]) => Boolean(PLANS[data?.settings.plan ?? "free"].limits[feature]),
    [data?.settings.plan],
  );

  const canAddClient = useMemo(() => {
    if (!data) return false;
    const limit = plan.limits.maxClients;
    return limit === null || data.clients.length < limit;
  }, [data, plan]);

  const canAddService = useMemo(() => {
    if (!data) return false;
    const limit = plan.limits.maxServices;
    return limit === null || data.services.length < limit;
  }, [data, plan]);

  if (!data) {
    return (
      <WorkspaceContext.Provider value={null as unknown as WorkspaceContextValue}>
        {children}
      </WorkspaceContext.Provider>
    );
  }

  const value: WorkspaceContextValue = {
    ...data,
    ready,
    plan,
    addService,
    updateService,
    removeService,
    addClient,
    updateClient,
    removeClient,
    findClientByReferral,
    addBooking,
    setBookingStatus,
    removeBooking,
    addPayment,
    removePayment,
    addCampaign,
    toggleCampaign,
    removeCampaign,
    updateSettings,
    setPlan,
    resetDemo,
    hasFeature,
    canAddClient,
    canAddService,
  };

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace(): WorkspaceContextValue {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error("useWorkspace deve essere usato dentro <WorkspaceProvider> con dati pronti");
  return ctx;
}

export function useWorkspaceOptional(): WorkspaceContextValue | null {
  return useContext(WorkspaceContext);
}
