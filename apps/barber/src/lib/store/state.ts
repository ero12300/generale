import type {
  Barber,
  Booking,
  Campaign,
  Customer,
  Sale,
  Service,
  ShopSettings,
} from "../types";

export interface AppState {
  settings: ShopSettings;
  services: Service[];
  barbers: Barber[];
  customers: Customer[];
  bookings: Booking[];
  sales: Sale[];
  campaigns: Campaign[];
}

export type StateKey = keyof AppState;

/**
 * Adapter di persistenza: implementazioni per localStorage (demo)
 * e Firestore (produzione). L'interfaccia è volutamente minimale:
 * lo stato applicativo vive in memoria nel provider React e ogni
 * mutazione viene salvata per chiave.
 */
export interface PersistenceAdapter {
  readonly mode: "demo" | "firebase";
  load(): Promise<AppState | null>;
  save<K extends StateKey>(key: K, value: AppState[K]): Promise<void>;
  reset(state: AppState): Promise<void>;
}
