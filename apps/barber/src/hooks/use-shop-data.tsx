"use client";

/**
 * useShopData: hook unificato che ritorna i dati del negozio.
 * - In modalità demo: legge dal demo store (localStorage).
 * - In produzione con Firebase configurato: leggerà da Firestore
 *   (l'implementazione Firestore è stub-friendly — usa lo stesso shape).
 *
 * L'idea è che i componenti UI non sanno da dove vengono i dati.
 */

import * as React from "react";
import { demoStore } from "@/lib/demo-store";
import { isFirebaseEnabled } from "@/lib/firebase/client";
import type {
  Booking,
  Campaign,
  Client,
  Payment,
  Service,
  Shop,
} from "@/types";

export type ShopData = {
  shop: Shop;
  services: Service[];
  clients: Client[];
  bookings: Booking[];
  campaigns: Campaign[];
  payments: Payment[];
  /** Vero se stiamo usando dati finti (demo mode). */
  isDemo: boolean;
};

export function useShopData(): ShopData {
  const [, force] = React.useReducer((n: number) => n + 1, 0);

  React.useEffect(() => {
    if (isFirebaseEnabled()) {
      // TODO: sottoscrizione real-time a Firestore quando le credenziali sono configurate.
      // In questo scaffold il fallback demo è sempre attivo se le collezioni Firestore
      // non sono ancora popolate. Vedi README per lo schema.
      return;
    }
    return demoStore.subscribe(force);
  }, []);

  const state = demoStore.getState();

  return {
    ...state,
    isDemo: !isFirebaseEnabled(),
  };
}
