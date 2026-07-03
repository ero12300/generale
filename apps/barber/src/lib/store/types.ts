import type {
  BarbershopProfile,
  Booking,
  Campaign,
  Client,
  DashboardSummary,
  Revenue,
  Service,
  WeeklyHours,
} from "@/types";

export interface DataStore {
  ready: boolean;
  mode: "demo" | "firebase";

  shop: BarbershopProfile;
  updateShop(patch: Partial<BarbershopProfile>): Promise<void>;
  updateServices(services: Service[]): Promise<void>;
  updateHours(hours: WeeklyHours): Promise<void>;

  clients: Client[];
  createClient(input: Omit<Client, "id" | "referralCode" | "createdAt" | "totalVisits" | "totalSpentEur">): Promise<Client>;
  updateClient(id: string, patch: Partial<Client>): Promise<void>;
  deleteClient(id: string): Promise<void>;

  bookings: Booking[];
  createBooking(input: Omit<Booking, "id" | "createdAt" | "status" | "source"> & { status?: Booking["status"]; source?: Booking["source"] }): Promise<Booking>;
  updateBooking(id: string, patch: Partial<Booking>): Promise<void>;
  deleteBooking(id: string): Promise<void>;

  revenues: Revenue[];
  createRevenue(input: Omit<Revenue, "id" | "createdAt">): Promise<Revenue>;
  deleteRevenue(id: string): Promise<void>;

  campaigns: Campaign[];
  createCampaign(input: Omit<Campaign, "id" | "createdAt" | "usageCount">): Promise<Campaign>;
  updateCampaign(id: string, patch: Partial<Campaign>): Promise<void>;
  deleteCampaign(id: string): Promise<void>;

  summary(): DashboardSummary;
  resetDemo(): void;
}
