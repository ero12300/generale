import type {
  Booking,
  Campaign,
  Client,
  Sale,
  Service,
  Shop,
} from "../types";

/**
 * Interfaccia unica del layer dati. Due implementazioni:
 * - DemoStore: in-memory, per demo/sviluppo senza credenziali
 * - FirestoreStore: Firebase Firestore, attivo con FIREBASE_SERVICE_ACCOUNT
 */
export interface DataStore {
  getShop(): Promise<Shop>;
  setPlan(plan: Shop["plan"], stripeIds?: {
    customerId?: string;
    subscriptionId?: string;
  }): Promise<Shop>;

  listServices(): Promise<Service[]>;

  listClients(): Promise<Client[]>;
  getClientByReferralCode(code: string): Promise<Client | null>;
  createClient(input: Omit<Client, "id" | "createdAt" | "visits" | "totalSpentCents" | "referralCode"> & { referralCode?: string }): Promise<Client>;

  listBookings(): Promise<Booking[]>;
  createBooking(input: Omit<Booking, "id" | "createdAt">): Promise<Booking>;
  updateBookingStatus(id: string, status: Booking["status"]): Promise<Booking | null>;

  listSales(): Promise<Sale[]>;
  createSale(input: Omit<Sale, "id" | "createdAt">): Promise<Sale>;

  listCampaigns(): Promise<Campaign[]>;
  createCampaign(input: Omit<Campaign, "id" | "createdAt" | "redemptions">): Promise<Campaign>;
  toggleCampaign(id: string, active: boolean): Promise<Campaign | null>;
  incrementCampaignRedemptions(id: string): Promise<void>;

  recordClientVisit(clientId: string, spentCents: number): Promise<void>;
}
