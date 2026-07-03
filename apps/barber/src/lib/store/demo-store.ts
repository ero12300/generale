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
import type { DataStore } from "./interface";
import { buildDemoData, referralCodeFor, type DemoData } from "./demo-seed";

let counter = 1000;
function newId(prefix: string): string {
  counter += 1;
  return `${prefix}-${counter}`;
}

/**
 * Store in-memory per la modalità demo (nessuna variabile Firebase configurata).
 * Lo stato vive in globalThis per sopravvivere all'HMR del dev server.
 */
export class DemoStore implements DataStore {
  private data: DemoData;

  constructor() {
    const g = globalThis as { __barberDemoData?: DemoData };
    if (!g.__barberDemoData) {
      g.__barberDemoData = buildDemoData();
    }
    this.data = g.__barberDemoData;
  }

  async listServices(): Promise<Service[]> {
    return this.data.services;
  }

  async listBarbers(): Promise<Barber[]> {
    return this.data.barbers;
  }

  async getSettings(): Promise<ShopSettings> {
    return this.data.settings;
  }

  async updateSettings(patch: Partial<ShopSettings>): Promise<ShopSettings> {
    Object.assign(this.data.settings, patch);
    return this.data.settings;
  }

  async listClients(): Promise<Client[]> {
    return [...this.data.clients].sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    );
  }

  async createClient(
    input: Omit<Client, "id" | "createdAt" | "referralCode">,
  ): Promise<Client> {
    const client: Client = {
      ...input,
      id: newId("cli"),
      createdAt: new Date().toISOString(),
      referralCode: referralCodeFor(input.name, Math.random),
    };
    this.data.clients.push(client);
    return client;
  }

  async findClientByPhone(phone: string): Promise<Client | null> {
    const normalized = phone.replace(/\s/g, "");
    return (
      this.data.clients.find((c) => c.phone.replace(/\s/g, "") === normalized) ??
      null
    );
  }

  async findClientByReferralCode(code: string): Promise<Client | null> {
    const upper = code.trim().toUpperCase();
    return (
      this.data.clients.find((c) => c.referralCode.toUpperCase() === upper) ?? null
    );
  }

  async listAppointments(date?: string): Promise<Appointment[]> {
    const list = date
      ? this.data.appointments.filter((a) => a.date === date)
      : this.data.appointments;
    return [...list].sort(
      (a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time),
    );
  }

  async createAppointment(
    input: Omit<Appointment, "id" | "createdAt" | "status">,
  ): Promise<Appointment> {
    const appointment: Appointment = {
      ...input,
      id: newId("apt"),
      status: "in_attesa",
      createdAt: new Date().toISOString(),
    };
    this.data.appointments.push(appointment);
    return appointment;
  }

  async updateAppointmentStatus(
    id: string,
    status: AppointmentStatus,
  ): Promise<Appointment | null> {
    const appointment = this.data.appointments.find((a) => a.id === id);
    if (!appointment) return null;
    appointment.status = status;
    return appointment;
  }

  async listPayments(): Promise<Payment[]> {
    return [...this.data.payments].sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    );
  }

  async createPayment(input: Omit<Payment, "id" | "createdAt">): Promise<Payment> {
    const payment: Payment = {
      ...input,
      id: newId("pay"),
      createdAt: new Date().toISOString(),
    };
    this.data.payments.push(payment);
    return payment;
  }

  async listCampaigns(): Promise<Campaign[]> {
    return [...this.data.campaigns].sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    );
  }

  async createCampaign(
    input: Omit<Campaign, "id" | "createdAt" | "usageCount">,
  ): Promise<Campaign> {
    const campaign: Campaign = {
      ...input,
      code: input.code.trim().toUpperCase(),
      id: newId("cmp"),
      usageCount: 0,
      createdAt: new Date().toISOString(),
    };
    this.data.campaigns.push(campaign);
    return campaign;
  }

  async updateCampaign(
    id: string,
    patch: Partial<Pick<Campaign, "active">>,
  ): Promise<Campaign | null> {
    const campaign = this.data.campaigns.find((c) => c.id === id);
    if (!campaign) return null;
    Object.assign(campaign, patch);
    return campaign;
  }

  async findActiveCampaignByCode(code: string): Promise<Campaign | null> {
    const upper = code.trim().toUpperCase();
    const campaign = this.data.campaigns.find(
      (c) => c.code === upper && c.active,
    );
    if (!campaign) return null;
    if (campaign.validUntil && campaign.validUntil < new Date().toISOString().slice(0, 10)) {
      return null;
    }
    return campaign;
  }

  async incrementCampaignUsage(id: string): Promise<void> {
    const campaign = this.data.campaigns.find((c) => c.id === id);
    if (campaign) campaign.usageCount += 1;
  }
}
