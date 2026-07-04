import { getSupabase } from "@/lib/supabase/client";
import type {
  Booking,
  BookingStatus,
  Campaign,
  CampaignType,
  Customer,
  DashboardStats,
  OpeningHours,
  PlanTier,
  Service,
  Shop,
  Transaction,
} from "@/lib/types";

type ShopRow = {
  id: string;
  slug: string;
  name: string;
  owner_id: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  description: string | null;
  plan: PlanTier;
  opening_hours: OpeningHours;
  created_at: string;
};

function mapShop(row: ShopRow): Shop {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    ownerId: row.owner_id ?? "",
    email: row.email ?? "",
    phone: row.phone ?? undefined,
    address: row.address ?? undefined,
    description: row.description ?? undefined,
    plan: row.plan,
    openingHours: row.opening_hours,
    createdAt: row.created_at,
  };
}

function mapService(row: Record<string, unknown>): Service {
  return {
    id: row.id as string,
    shopId: row.shop_id as string,
    name: row.name as string,
    description: (row.description as string) ?? undefined,
    durationMinutes: row.duration_minutes as number,
    priceCents: row.price_cents as number,
    active: row.active as boolean,
  };
}

function mapCustomer(row: Record<string, unknown>): Customer {
  return {
    id: row.id as string,
    shopId: row.shop_id as string,
    name: row.name as string,
    email: (row.email as string) ?? undefined,
    phone: row.phone as string,
    notes: (row.notes as string) ?? undefined,
    referralCode: row.referral_code as string,
    referredBy: (row.referred_by as string) ?? undefined,
    loyaltyPoints: row.loyalty_points as number,
    totalVisits: row.total_visits as number,
    totalSpentCents: row.total_spent_cents as number,
    lastVisitAt: row.last_visit_at ? String(row.last_visit_at).slice(0, 10) : undefined,
    createdAt: row.created_at as string,
  };
}

function mapBooking(row: Record<string, unknown>): Booking {
  return {
    id: row.id as string,
    shopId: row.shop_id as string,
    customerId: (row.customer_id as string) ?? "",
    customerName: row.customer_name as string,
    customerPhone: row.customer_phone as string,
    serviceId: (row.service_id as string) ?? "",
    serviceName: row.service_name as string,
    date: String(row.date),
    time: row.time as string,
    durationMinutes: row.duration_minutes as number,
    priceCents: row.price_cents as number,
    status: row.status as BookingStatus,
    notes: (row.notes as string) ?? undefined,
    createdAt: row.created_at as string,
  };
}

function mapTransaction(row: Record<string, unknown>): Transaction {
  return {
    id: row.id as string,
    shopId: row.shop_id as string,
    bookingId: (row.booking_id as string) ?? undefined,
    customerId: (row.customer_id as string) ?? undefined,
    customerName: row.customer_name as string,
    amountCents: row.amount_cents as number,
    paymentMethod: row.payment_method as Transaction["paymentMethod"],
    description: row.description as string,
    date: String(row.date),
    createdAt: row.created_at as string,
  };
}

function mapCampaign(row: Record<string, unknown>): Campaign {
  return {
    id: row.id as string,
    shopId: row.shop_id as string,
    name: row.name as string,
    type: row.type as CampaignType,
    description: (row.description as string) ?? undefined,
    discountPercent: (row.discount_percent as number) ?? undefined,
    discountCents: (row.discount_cents as number) ?? undefined,
    referralRewardCents: (row.referral_reward_cents as number) ?? undefined,
    minVisits: (row.min_visits as number) ?? undefined,
    code: (row.code as string) ?? undefined,
    active: row.active as boolean,
    startsAt: row.starts_at ? String(row.starts_at) : undefined,
    endsAt: row.ends_at ? String(row.ends_at) : undefined,
    usageCount: row.usage_count as number,
    createdAt: row.created_at as string,
  };
}

function db() {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase non configurato");
  return supabase;
}

export const supabaseRepository = {
  async getShop(shopId: string): Promise<Shop | null> {
    const { data, error } = await db().from("shops").select("*").eq("id", shopId).maybeSingle();
    if (error || !data) return null;
    return mapShop(data as ShopRow);
  },

  async getShopBySlug(slug: string): Promise<Shop | null> {
    const { data, error } = await db().from("shops").select("*").eq("slug", slug).maybeSingle();
    if (error || !data) return null;
    return mapShop(data as ShopRow);
  },

  async getShopByOwner(ownerId: string): Promise<Shop | null> {
    const { data, error } = await db().from("shops").select("*").eq("owner_id", ownerId).maybeSingle();
    if (error || !data) return null;
    return mapShop(data as ShopRow);
  },

  async updateShop(shopId: string, patch: Partial<Shop>): Promise<Shop> {
    const row: Record<string, unknown> = {};
    if (patch.name) row.name = patch.name;
    if (patch.email) row.email = patch.email;
    if (patch.phone) row.phone = patch.phone;
    if (patch.address) row.address = patch.address;
    if (patch.slug) row.slug = patch.slug;
    if (patch.description) row.description = patch.description;
    if (patch.openingHours) row.opening_hours = patch.openingHours;

    const { data, error } = await db().from("shops").update(row).eq("id", shopId).select("*").single();
    if (error) throw error;
    return mapShop(data as ShopRow);
  },

  async createShop(shop: Shop): Promise<Shop> {
    const { data, error } = await db()
      .from("shops")
      .insert({
        id: shop.id,
        slug: shop.slug,
        name: shop.name,
        owner_id: shop.ownerId || null,
        email: shop.email,
        phone: shop.phone,
        address: shop.address,
        description: shop.description,
        plan: shop.plan,
        opening_hours: shop.openingHours,
      })
      .select("*")
      .single();
    if (error) throw error;
    return mapShop(data as ShopRow);
  },

  async getServices(shopId: string): Promise<Service[]> {
    const { data, error } = await db().from("services").select("*").eq("shop_id", shopId).order("name");
    if (error) throw error;
    return (data ?? []).map(mapService);
  },

  async updateService(id: string, patch: Partial<Service>): Promise<Service | undefined> {
    const row: Record<string, unknown> = {};
    if (patch.name) row.name = patch.name;
    if (patch.description !== undefined) row.description = patch.description;
    if (patch.durationMinutes) row.duration_minutes = patch.durationMinutes;
    if (patch.priceCents !== undefined) row.price_cents = patch.priceCents;
    if (patch.active !== undefined) row.active = patch.active;

    const { data, error } = await db().from("services").update(row).eq("id", id).select("*").maybeSingle();
    if (error) throw error;
    return data ? mapService(data) : undefined;
  },

  async addService(service: Service): Promise<Service> {
    const { data, error } = await db()
      .from("services")
      .insert({
        id: service.id,
        shop_id: service.shopId,
        name: service.name,
        description: service.description,
        duration_minutes: service.durationMinutes,
        price_cents: service.priceCents,
        active: service.active,
      })
      .select("*")
      .single();
    if (error) throw error;
    return mapService(data);
  },

  async deleteService(id: string): Promise<boolean> {
    const { error } = await db().from("services").delete().eq("id", id);
    return !error;
  },

  async getCustomers(shopId: string): Promise<Customer[]> {
    const { data, error } = await db().from("customers").select("*").eq("shop_id", shopId).order("name");
    if (error) throw error;
    return (data ?? []).map(mapCustomer);
  },

  async createCustomer(customer: Customer): Promise<Customer> {
    const { data, error } = await db()
      .from("customers")
      .insert({
        id: customer.id,
        shop_id: customer.shopId,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        notes: customer.notes,
        referral_code: customer.referralCode,
        referred_by: customer.referredBy,
        loyalty_points: customer.loyaltyPoints,
        total_visits: customer.totalVisits,
        total_spent_cents: customer.totalSpentCents,
      })
      .select("*")
      .single();
    if (error) throw error;
    return mapCustomer(data);
  },

  async getBookings(shopId: string): Promise<Booking[]> {
    const { data, error } = await db()
      .from("bookings")
      .select("*")
      .eq("shop_id", shopId)
      .order("date")
      .order("time");
    if (error) throw error;
    return (data ?? []).map(mapBooking);
  },

  async createBooking(booking: Booking): Promise<Booking> {
    const { data, error } = await db()
      .from("bookings")
      .insert({
        id: booking.id,
        shop_id: booking.shopId,
        customer_id: booking.customerId || null,
        customer_name: booking.customerName,
        customer_phone: booking.customerPhone,
        service_id: booking.serviceId || null,
        service_name: booking.serviceName,
        date: booking.date,
        time: booking.time,
        duration_minutes: booking.durationMinutes,
        price_cents: booking.priceCents,
        status: booking.status,
        notes: booking.notes,
      })
      .select("*")
      .single();
    if (error) throw error;
    return mapBooking(data);
  },

  async updateBookingStatus(id: string, status: BookingStatus): Promise<Booking | undefined> {
    const { data, error } = await db().from("bookings").update({ status }).eq("id", id).select("*").maybeSingle();
    if (error) throw error;
    return data ? mapBooking(data) : undefined;
  },

  async getTransactions(shopId: string): Promise<Transaction[]> {
    const { data, error } = await db()
      .from("transactions")
      .select("*")
      .eq("shop_id", shopId)
      .order("date", { ascending: false });
    if (error) throw error;
    return (data ?? []).map(mapTransaction);
  },

  async createTransaction(tx: Transaction): Promise<Transaction> {
    const { data, error } = await db()
      .from("transactions")
      .insert({
        id: tx.id,
        shop_id: tx.shopId,
        booking_id: tx.bookingId,
        customer_id: tx.customerId,
        customer_name: tx.customerName,
        amount_cents: tx.amountCents,
        payment_method: tx.paymentMethod,
        description: tx.description,
        date: tx.date,
      })
      .select("*")
      .single();
    if (error) throw error;
    return mapTransaction(data);
  },

  async getCampaigns(shopId: string): Promise<Campaign[]> {
    const { data, error } = await db().from("campaigns").select("*").eq("shop_id", shopId).order("name");
    if (error) throw error;
    return (data ?? []).map(mapCampaign);
  },

  async toggleCampaign(id: string): Promise<Campaign | undefined> {
    const { data: current } = await db().from("campaigns").select("active").eq("id", id).maybeSingle();
    if (!current) return undefined;
    const { data, error } = await db()
      .from("campaigns")
      .update({ active: !current.active })
      .eq("id", id)
      .select("*")
      .maybeSingle();
    if (error) throw error;
    return data ? mapCampaign(data) : undefined;
  },

  async getStats(shopId: string): Promise<DashboardStats> {
    const today = new Date().toISOString().slice(0, 10);
    const monthStart = new Date();
    monthStart.setDate(1);
    const monthStartStr = monthStart.toISOString().slice(0, 10);

    const [transactions, bookings, customers, campaigns] = await Promise.all([
      this.getTransactions(shopId),
      this.getBookings(shopId),
      this.getCustomers(shopId),
      this.getCampaigns(shopId),
    ]);

    return {
      todayRevenueCents: transactions.filter((t) => t.date === today).reduce((s, t) => s + t.amountCents, 0),
      monthRevenueCents: transactions.filter((t) => t.date >= monthStartStr).reduce((s, t) => s + t.amountCents, 0),
      todayBookings: bookings.filter((b) => b.date === today).length,
      pendingBookings: bookings.filter((b) => b.status === "pending").length,
      totalCustomers: customers.length,
      activeCampaigns: campaigns.filter((c) => c.active).length,
    };
  },
};
