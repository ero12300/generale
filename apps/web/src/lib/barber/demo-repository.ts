import type {
  AuthContext,
  BarberBooking,
  BarberBookingStatus,
  BarberCampaign,
  BarberClient,
  BarberDashboardOverview,
  BarberPayment,
  BarberService,
  BarberSubscription,
  CreateBarberBookingInput,
  CreateBarberCampaignInput,
  CreateBarberClientInput,
  CreateBarberPaymentInput,
} from "@deal-desk/types";
import { barberDemoStore } from "@/lib/barber/demo-store";
import type { BarberRepository } from "@/lib/barber/repository";
import { demoStore } from "@/lib/demo-store";

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

export class DemoBarberRepository implements BarberRepository {
  readonly context: AuthContext = {
    mode: "demo",
    userId: null,
    email: null,
    organizationId: demoStore.orgId,
    organizationName: "Barber Premium Demo",
  };

  async getOverview(): Promise<BarberDashboardOverview> {
    const bookings = barberDemoStore.listBookings();
    const payments = barberDemoStore.listPayments();
    const campaigns = barberDemoStore.listCampaigns();
    const subscription = barberDemoStore.getSubscription();
    const todayPrefix = new Date().toISOString().slice(0, 10);
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const noShow = bookings.filter((b) => b.status === "no_show").length;
    const topServiceId = bookings[0]?.service_id ?? null;
    const topServiceName =
      topServiceId == null
        ? null
        : barberDemoStore.listServices().find((s) => s.id === topServiceId)?.name ?? null;

    return {
      todayBookings: bookings.filter((b) => b.starts_at.startsWith(todayPrefix)).length,
      confirmedBookings: bookings.filter((b) => b.status === "confirmed").length,
      weekRevenue: payments
        .filter((p) => new Date(p.paid_at) >= weekAgo && p.status === "paid")
        .reduce((acc, item) => acc + item.amount, 0),
      activeClients: barberDemoStore.listClients().length,
      activeCampaigns: campaigns.filter((c) => c.status === "active").length,
      noShowRate: bookings.length > 0 ? noShow / bookings.length : 0,
      topServiceName,
      subscriptionPlan: subscription.plan,
    };
  }

  async listServices(): Promise<BarberService[]> {
    return barberDemoStore.listServices();
  }

  async listClients(): Promise<BarberClient[]> {
    return barberDemoStore.listClients();
  }

  async createClient(input: CreateBarberClientInput): Promise<BarberClient> {
    const nameNormalized = input.full_name.trim().toUpperCase().replaceAll(" ", "");
    const client: BarberClient = {
      id: makeId("cli"),
      organization_id: this.context.organizationId,
      full_name: input.full_name.trim(),
      phone: input.phone ?? null,
      email: input.email ?? null,
      notes: input.notes ?? null,
      total_visits: 0,
      referral_code: `${nameNormalized.slice(0, 8)}${Math.floor(Math.random() * 90 + 10)}`,
      referred_by_client_id: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    return barberDemoStore.createClient(client);
  }

  async listBookings(): Promise<BarberBooking[]> {
    return barberDemoStore.listBookings();
  }

  async createBooking(input: CreateBarberBookingInput): Promise<BarberBooking> {
    const booking: BarberBooking = {
      id: makeId("book"),
      organization_id: this.context.organizationId,
      client_id: input.client_id,
      service_id: input.service_id,
      barber_name: input.barber_name ?? null,
      starts_at: input.starts_at,
      ends_at: input.ends_at,
      status: "pending",
      source: input.source ?? "online",
      notes: input.notes ?? null,
      price_amount: input.price_amount,
      deposit_amount: input.deposit_amount ?? 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    return barberDemoStore.createBooking(booking);
  }

  async updateBookingStatus(id: string, status: BarberBookingStatus): Promise<BarberBooking | null> {
    return barberDemoStore.updateBookingStatus(id, status);
  }

  async listPayments(): Promise<BarberPayment[]> {
    return barberDemoStore.listPayments();
  }

  async createPayment(input: CreateBarberPaymentInput): Promise<BarberPayment> {
    const payment: BarberPayment = {
      id: makeId("pay"),
      organization_id: this.context.organizationId,
      booking_id: input.booking_id ?? null,
      client_id: input.client_id ?? null,
      amount: input.amount,
      method: input.method,
      status: input.status ?? "paid",
      paid_at: input.paid_at ?? new Date().toISOString(),
      stripe_payment_intent_id: input.stripe_payment_intent_id ?? null,
      created_at: new Date().toISOString(),
    };
    return barberDemoStore.createPayment(payment);
  }

  async listCampaigns(): Promise<BarberCampaign[]> {
    return barberDemoStore.listCampaigns();
  }

  async createCampaign(input: CreateBarberCampaignInput): Promise<BarberCampaign> {
    const campaign: BarberCampaign = {
      id: makeId("camp"),
      organization_id: this.context.organizationId,
      name: input.name,
      channel: input.channel,
      discount_type: input.discount_type,
      discount_value: input.discount_value,
      referral_bonus: input.referral_bonus ?? 0,
      message: input.message ?? null,
      starts_at: input.starts_at,
      ends_at: input.ends_at,
      status: "draft",
      audience: input.audience,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    return barberDemoStore.createCampaign(campaign);
  }

  async getSubscription(): Promise<BarberSubscription> {
    return barberDemoStore.getSubscription();
  }
}
