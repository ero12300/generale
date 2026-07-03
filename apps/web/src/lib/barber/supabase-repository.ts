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
import type { SupabaseClient } from "@supabase/supabase-js";
import type { BarberRepository } from "@/lib/barber/repository";

type DbRow = Record<string, unknown>;

function toNumber(value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value);
  return 0;
}

function mapService(row: DbRow): BarberService {
  return {
    id: String(row.id),
    organization_id: String(row.organization_id),
    name: String(row.name),
    duration_minutes: Number(row.duration_minutes),
    price_amount: toNumber(row.price_amount),
    is_active: Boolean(row.is_active),
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

function mapClient(row: DbRow): BarberClient {
  return {
    id: String(row.id),
    organization_id: String(row.organization_id),
    full_name: String(row.full_name),
    phone: row.phone ? String(row.phone) : null,
    email: row.email ? String(row.email) : null,
    notes: row.notes ? String(row.notes) : null,
    total_visits: Number(row.total_visits ?? 0),
    referral_code: String(row.referral_code),
    referred_by_client_id: row.referred_by_client_id ? String(row.referred_by_client_id) : null,
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

function mapBooking(row: DbRow): BarberBooking {
  return {
    id: String(row.id),
    organization_id: String(row.organization_id),
    client_id: String(row.client_id),
    service_id: String(row.service_id),
    barber_name: row.barber_name ? String(row.barber_name) : null,
    starts_at: String(row.starts_at),
    ends_at: String(row.ends_at),
    status: row.status as BarberBookingStatus,
    source: row.source as BarberBooking["source"],
    notes: row.notes ? String(row.notes) : null,
    price_amount: toNumber(row.price_amount),
    deposit_amount: toNumber(row.deposit_amount),
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

function mapPayment(row: DbRow): BarberPayment {
  return {
    id: String(row.id),
    organization_id: String(row.organization_id),
    booking_id: row.booking_id ? String(row.booking_id) : null,
    client_id: row.client_id ? String(row.client_id) : null,
    amount: toNumber(row.amount),
    method: row.method as BarberPayment["method"],
    status: row.status as BarberPayment["status"],
    paid_at: String(row.paid_at),
    stripe_payment_intent_id: row.stripe_payment_intent_id
      ? String(row.stripe_payment_intent_id)
      : null,
    created_at: String(row.created_at),
  };
}

function mapCampaign(row: DbRow): BarberCampaign {
  return {
    id: String(row.id),
    organization_id: String(row.organization_id),
    name: String(row.name),
    channel: row.channel as BarberCampaign["channel"],
    discount_type: row.discount_type as BarberCampaign["discount_type"],
    discount_value: toNumber(row.discount_value),
    referral_bonus: toNumber(row.referral_bonus),
    message: row.message ? String(row.message) : null,
    starts_at: String(row.starts_at),
    ends_at: String(row.ends_at),
    status: row.status as BarberCampaign["status"],
    audience: String(row.audience),
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

function mapSubscription(row: DbRow): BarberSubscription {
  return {
    organization_id: String(row.organization_id),
    plan: row.plan as BarberSubscription["plan"],
    status: row.status as BarberSubscription["status"],
    stripe_customer_id: row.stripe_customer_id ? String(row.stripe_customer_id) : null,
    stripe_subscription_id: row.stripe_subscription_id ? String(row.stripe_subscription_id) : null,
    trial_ends_at: row.trial_ends_at ? String(row.trial_ends_at) : null,
    updated_at: String(row.updated_at),
  };
}

export class SupabaseBarberRepository implements BarberRepository {
  constructor(
    private readonly supabase: SupabaseClient,
    readonly context: AuthContext
  ) {}

  private orgId() {
    return this.context.organizationId;
  }

  async getOverview(): Promise<BarberDashboardOverview> {
    const [bookings, clients, payments, campaigns, services, subscription] = await Promise.all([
      this.listBookings(),
      this.listClients(),
      this.listPayments(),
      this.listCampaigns(),
      this.listServices(),
      this.getSubscription(),
    ]);
    const todayPrefix = new Date().toISOString().slice(0, 10);
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const serviceCount: Record<string, number> = {};
    for (const booking of bookings) {
      serviceCount[booking.service_id] = (serviceCount[booking.service_id] ?? 0) + 1;
    }
    let topServiceName: string | null = null;
    let topCount = 0;
    for (const service of services) {
      const count = serviceCount[service.id] ?? 0;
      if (count > topCount) {
        topCount = count;
        topServiceName = service.name;
      }
    }

    const noShow = bookings.filter((b) => b.status === "no_show").length;

    return {
      todayBookings: bookings.filter((b) => b.starts_at.startsWith(todayPrefix)).length,
      confirmedBookings: bookings.filter((b) => b.status === "confirmed").length,
      weekRevenue: payments
        .filter((p) => new Date(p.paid_at) >= weekAgo && p.status === "paid")
        .reduce((sum, payment) => sum + payment.amount, 0),
      activeClients: clients.length,
      activeCampaigns: campaigns.filter((campaign) => campaign.status === "active").length,
      noShowRate: bookings.length > 0 ? noShow / bookings.length : 0,
      topServiceName,
      subscriptionPlan: subscription.plan,
    };
  }

  async listServices(): Promise<BarberService[]> {
    const { data, error } = await this.supabase
      .from("barber_services")
      .select("*")
      .eq("organization_id", this.orgId())
      .eq("is_active", true)
      .order("name");
    if (error) throw error;
    return (data ?? []).map((row) => mapService(row as DbRow));
  }

  async listClients(): Promise<BarberClient[]> {
    const { data, error } = await this.supabase
      .from("barber_clients")
      .select("*")
      .eq("organization_id", this.orgId())
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map((row) => mapClient(row as DbRow));
  }

  async createClient(input: CreateBarberClientInput): Promise<BarberClient> {
    const normalizedName = input.full_name.trim().toUpperCase().replaceAll(" ", "");
    const referralCode = `${normalizedName.slice(0, 8)}${Math.floor(Math.random() * 90 + 10)}`;
    const { data, error } = await this.supabase
      .from("barber_clients")
      .insert({
        organization_id: this.orgId(),
        full_name: input.full_name.trim(),
        phone: input.phone ?? null,
        email: input.email ?? null,
        notes: input.notes ?? null,
        referral_code: referralCode,
      })
      .select("*")
      .single();
    if (error) throw error;
    return mapClient(data as DbRow);
  }

  async listBookings(): Promise<BarberBooking[]> {
    const { data, error } = await this.supabase
      .from("barber_bookings")
      .select("*")
      .eq("organization_id", this.orgId())
      .order("starts_at", { ascending: true });
    if (error) throw error;
    return (data ?? []).map((row) => mapBooking(row as DbRow));
  }

  async createBooking(input: CreateBarberBookingInput): Promise<BarberBooking> {
    const { data, error } = await this.supabase
      .from("barber_bookings")
      .insert({
        organization_id: this.orgId(),
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
      })
      .select("*")
      .single();
    if (error) throw error;
    return mapBooking(data as DbRow);
  }

  async updateBookingStatus(id: string, status: BarberBookingStatus): Promise<BarberBooking | null> {
    const { data, error } = await this.supabase
      .from("barber_bookings")
      .update({ status })
      .eq("id", id)
      .eq("organization_id", this.orgId())
      .select("*")
      .maybeSingle();
    if (error) throw error;
    return data ? mapBooking(data as DbRow) : null;
  }

  async listPayments(): Promise<BarberPayment[]> {
    const { data, error } = await this.supabase
      .from("barber_payments")
      .select("*")
      .eq("organization_id", this.orgId())
      .order("paid_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map((row) => mapPayment(row as DbRow));
  }

  async createPayment(input: CreateBarberPaymentInput): Promise<BarberPayment> {
    const { data, error } = await this.supabase
      .from("barber_payments")
      .insert({
        organization_id: this.orgId(),
        booking_id: input.booking_id ?? null,
        client_id: input.client_id ?? null,
        amount: input.amount,
        method: input.method,
        status: input.status ?? "paid",
        paid_at: input.paid_at ?? new Date().toISOString(),
        stripe_payment_intent_id: input.stripe_payment_intent_id ?? null,
      })
      .select("*")
      .single();
    if (error) throw error;
    return mapPayment(data as DbRow);
  }

  async listCampaigns(): Promise<BarberCampaign[]> {
    const { data, error } = await this.supabase
      .from("barber_campaigns")
      .select("*")
      .eq("organization_id", this.orgId())
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map((row) => mapCampaign(row as DbRow));
  }

  async createCampaign(input: CreateBarberCampaignInput): Promise<BarberCampaign> {
    const { data, error } = await this.supabase
      .from("barber_campaigns")
      .insert({
        organization_id: this.orgId(),
        name: input.name,
        channel: input.channel,
        discount_type: input.discount_type,
        discount_value: input.discount_value,
        referral_bonus: input.referral_bonus ?? 0,
        message: input.message ?? null,
        starts_at: input.starts_at,
        ends_at: input.ends_at,
        audience: input.audience,
      })
      .select("*")
      .single();
    if (error) throw error;
    return mapCampaign(data as DbRow);
  }

  async getSubscription(): Promise<BarberSubscription> {
    const { data, error } = await this.supabase
      .from("barber_subscriptions")
      .select("*")
      .eq("organization_id", this.orgId())
      .maybeSingle();
    if (error) throw error;

    if (!data) {
      const { data: created, error: createError } = await this.supabase
        .from("barber_subscriptions")
        .insert({
          organization_id: this.orgId(),
          plan: "basic",
          status: "trialing",
          trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        })
        .select("*")
        .single();
      if (createError) throw createError;
      return mapSubscription(created as DbRow);
    }

    return mapSubscription(data as DbRow);
  }
}
