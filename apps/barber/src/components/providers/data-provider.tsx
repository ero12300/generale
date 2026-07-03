"use client";

import { createContext, useContext, useMemo, useState, useCallback, useEffect } from "react";
import type { DataStore } from "@/lib/store/types";
import { createLocalStore, initialSnapshot } from "@/lib/store/local-store";
import type {
  BarbershopProfile,
  Booking,
  Campaign,
  Client,
  Revenue,
} from "@/types";

interface Snapshot {
  shop: BarbershopProfile;
  clients: Client[];
  bookings: Booking[];
  revenues: Revenue[];
  campaigns: Campaign[];
}

const Ctx = createContext<DataStore | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [snap, setSnap] = useState<Snapshot>(() => ({
    shop: {
      ownerUid: "demo",
      slug: "demo-shop",
      name: "Barber Studio",
      services: [],
      hours: {
        mon: { open: false, from: "09:00", to: "19:00" },
        tue: { open: true, from: "09:00", to: "19:00" },
        wed: { open: true, from: "09:00", to: "19:00" },
        thu: { open: true, from: "09:00", to: "19:00" },
        fri: { open: true, from: "09:00", to: "19:00" },
        sat: { open: true, from: "09:00", to: "18:00" },
        sun: { open: false, from: "10:00", to: "13:00" },
      },
      slotMinutes: 15,
      currency: "EUR",
      updatedAt: new Date().toISOString(),
    },
    clients: [],
    bookings: [],
    revenues: [],
    campaigns: [],
  }));
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSnap(initialSnapshot());
    setReady(true);
  }, []);

  const getSnapshot = useCallback(() => snap, [snap]);
  const setSnapshot = useCallback((updater: (prev: Snapshot) => Snapshot) => {
    setSnap((prev) => updater(prev));
  }, []);

  const store = useMemo(() => createLocalStore(setSnapshot, getSnapshot), [setSnapshot, getSnapshot]);
  (store as any).ready = ready;

  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}

export function useStore(): DataStore {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore must be used within DataProvider");
  return ctx;
}
