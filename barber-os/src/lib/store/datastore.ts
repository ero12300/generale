import type {
  Booking,
  Campaign,
  Customer,
  Service,
  ShopSettings,
  Transaction,
} from "../types";

export interface DataStore {
  listServices(): Promise<Service[]>;
  saveService(service: Service): Promise<void>;
  deleteService(id: string): Promise<void>;

  listCustomers(): Promise<Customer[]>;
  saveCustomer(customer: Customer): Promise<void>;
  deleteCustomer(id: string): Promise<void>;

  listBookings(): Promise<Booking[]>;
  saveBooking(booking: Booking): Promise<void>;
  deleteBooking(id: string): Promise<void>;

  listTransactions(): Promise<Transaction[]>;
  saveTransaction(tx: Transaction): Promise<void>;
  deleteTransaction(id: string): Promise<void>;

  listCampaigns(): Promise<Campaign[]>;
  saveCampaign(campaign: Campaign): Promise<void>;
  deleteCampaign(id: string): Promise<void>;

  getSettings(): Promise<ShopSettings>;
  saveSettings(settings: ShopSettings): Promise<void>;
}

export function generateId(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

export function generateReferralCode(name: string): string {
  const prefix = name
    .replace(/[^a-zA-Z]/g, "")
    .slice(0, 4)
    .toUpperCase()
    .padEnd(4, "X");
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${prefix}-${suffix}`;
}
