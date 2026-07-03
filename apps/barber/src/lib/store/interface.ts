import type {
  Appointment,
  AppointmentStatus,
  Barber,
  Campaign,
  Client,
  Payment,
  Service,
  ShopSettings,
} from "../types";

export interface DataStore {
  listServices(): Promise<Service[]>;
  listBarbers(): Promise<Barber[]>;

  getSettings(): Promise<ShopSettings>;
  updateSettings(patch: Partial<ShopSettings>): Promise<ShopSettings>;

  listClients(): Promise<Client[]>;
  createClient(
    input: Omit<Client, "id" | "createdAt" | "referralCode">,
  ): Promise<Client>;
  findClientByPhone(phone: string): Promise<Client | null>;
  findClientByReferralCode(code: string): Promise<Client | null>;

  listAppointments(date?: string): Promise<Appointment[]>;
  createAppointment(
    input: Omit<Appointment, "id" | "createdAt" | "status">,
  ): Promise<Appointment>;
  updateAppointmentStatus(
    id: string,
    status: AppointmentStatus,
  ): Promise<Appointment | null>;

  listPayments(): Promise<Payment[]>;
  createPayment(input: Omit<Payment, "id" | "createdAt">): Promise<Payment>;

  listCampaigns(): Promise<Campaign[]>;
  createCampaign(
    input: Omit<Campaign, "id" | "createdAt" | "usageCount">,
  ): Promise<Campaign>;
  updateCampaign(
    id: string,
    patch: Partial<Pick<Campaign, "active">>,
  ): Promise<Campaign | null>;
  findActiveCampaignByCode(code: string): Promise<Campaign | null>;
  incrementCampaignUsage(id: string): Promise<void>;
}
