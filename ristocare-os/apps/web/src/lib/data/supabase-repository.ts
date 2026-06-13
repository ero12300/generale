import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  AdminDashboardStats,
  CustomerDashboardStats,
  EquipmentDocument,
  TicketStatus,
  UserRole,
} from "@ristocare/types";
import {
  mapDocument,
  mapEquipment,
  mapLocation,
  mapOrganization,
  mapQuote,
  mapReferral,
  mapTechnician,
  mapTechnicianRequest,
  mapTicket,
} from "@/lib/data/mappers";
import type { DataRepository } from "@/lib/data/repository";
import type { CreateTicketInput } from "@/lib/validations/api";

export interface AuthContext {
  mode: "supabase";
  userId: string;
  email: string | null;
  role: UserRole;
  orgId: string | null;
  orgName: string | null;
  technicianId: string | null;
  isOperator: boolean;
}

const OPEN_STATUSES: TicketStatus[] = [
  "new", "in_review", "info_requested", "awaiting_technician",
  "quote_received", "quote_sent", "accepted", "scheduled", "in_progress", "awaiting_spare",
];

export class SupabaseRepository implements DataRepository {
  constructor(
    private readonly supabase: SupabaseClient,
    readonly context: AuthContext
  ) {}

  private isOperator() {
    return this.context.isOperator;
  }

  async getOrganization(id: string) {
    const { data, error } = await this.supabase.from("organizations").select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    return data ? mapOrganization(data) : undefined;
  }

  async listOrganizations() {
    const { data, error } = await this.supabase.from("organizations").select("*").order("name");
    if (error) throw error;
    return (data ?? []).map(mapOrganization);
  }

  async listLocations(orgId: string) {
    const { data, error } = await this.supabase.from("locations").select("*").eq("organization_id", orgId);
    if (error) throw error;
    return (data ?? []).map(mapLocation);
  }

  async listEquipment(orgId: string) {
    const { data, error } = await this.supabase.from("equipment").select("*").eq("organization_id", orgId).order("name");
    if (error) throw error;
    return (data ?? []).map(mapEquipment);
  }

  async getEquipment(id: string) {
    const { data, error } = await this.supabase.from("equipment").select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    return data ? mapEquipment(data) : undefined;
  }

  async getEquipmentByQrToken(token: string) {
    const { data, error } = await this.supabase.from("equipment").select("*").eq("qr_token", token).maybeSingle();
    if (error) throw error;
    return data ? mapEquipment(data) : undefined;
  }

  async listDocuments(equipmentId: string) {
    const { data, error } = await this.supabase
      .from("equipment_documents")
      .select("*")
      .eq("equipment_id", equipmentId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map(mapDocument);
  }

  async addDocument(input: {
    equipment_id: string;
    document_type: EquipmentDocument["document_type"];
    file_url: string;
    file_name: string;
  }) {
    const { data, error } = await this.supabase
      .from("equipment_documents")
      .insert({
        equipment_id: input.equipment_id,
        document_type: input.document_type,
        file_url: input.file_url,
        file_name: input.file_name,
        uploaded_by: this.context.userId,
      })
      .select("*")
      .single();
    if (error) throw error;
    return mapDocument(data);
  }

  async listTickets(orgId: string) {
    const { data, error } = await this.supabase
      .from("tickets")
      .select("*")
      .eq("organization_id", orgId)
      .order("updated_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map(mapTicket);
  }

  async listAllTickets() {
    const { data, error } = await this.supabase.from("tickets").select("*").order("updated_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map(mapTicket);
  }

  async listTicketsForTechnician(techId: string) {
    const { data, error } = await this.supabase
      .from("tickets")
      .select("*")
      .eq("assigned_technician_id", techId)
      .order("updated_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map(mapTicket);
  }

  async getTicket(id: string) {
    const { data, error } = await this.supabase.from("tickets").select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    return data ? mapTicket(data) : undefined;
  }

  async createTicket(orgId: string, locationId: string, input: CreateTicketInput) {
    const now = new Date().toISOString();
    const { data, error } = await this.supabase
      .from("tickets")
      .insert({
        organization_id: orgId,
        location_id: locationId,
        equipment_id: input.equipment_id ?? null,
        title: input.title,
        description: input.description,
        urgency: input.urgency,
        status: "new",
        customer_visible_status: "Nuovo",
        opened_by: this.context.userId,
        created_at: now,
        updated_at: now,
      })
      .select("*")
      .single();
    if (error) throw error;
    return mapTicket(data);
  }

  async updateTicketStatus(id: string, status: TicketStatus, notes?: string) {
    const patch: Record<string, unknown> = {
      status,
      updated_at: new Date().toISOString(),
    };
    if (notes !== undefined) patch.internal_notes = notes;
    if (status === "closed" || status === "resolved") patch.closed_at = new Date().toISOString();

    const { data, error } = await this.supabase.from("tickets").update(patch).eq("id", id).select("*").maybeSingle();
    if (error) throw error;
    return data ? mapTicket(data) : undefined;
  }

  async assignTechnician(ticketId: string, technicianId: string) {
    const { data, error } = await this.supabase
      .from("tickets")
      .update({
        assigned_technician_id: technicianId,
        status: "awaiting_technician",
        updated_at: new Date().toISOString(),
      })
      .eq("id", ticketId)
      .select("*")
      .maybeSingle();
    if (error) throw error;
    return data ? mapTicket(data) : undefined;
  }

  async listTechnicians() {
    const { data, error } = await this.supabase.from("technicians").select("*").eq("active", true).order("name");
    if (error) throw error;
    return (data ?? []).map(mapTechnician);
  }

  async getTechnician(id: string) {
    const { data, error } = await this.supabase.from("technicians").select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    return data ? mapTechnician(data) : undefined;
  }

  async listTechnicianRequests(ticketId: string) {
    const { data, error } = await this.supabase.from("technician_requests").select("*").eq("ticket_id", ticketId);
    if (error) throw error;
    return (data ?? []).map(mapTechnicianRequest);
  }

  async createTechnicianRequest(input: {
    ticket_id: string;
    technician_id: string;
    internal_price: number;
    availability: string;
    notes?: string;
  }) {
    const { data, error } = await this.supabase
      .from("technician_requests")
      .insert({
        ticket_id: input.ticket_id,
        technician_id: input.technician_id,
        internal_price: input.internal_price,
        availability: input.availability,
        notes: input.notes ?? null,
        response_status: "pending",
      })
      .select("*")
      .single();
    if (error) throw error;
    return mapTechnicianRequest(data);
  }

  async listQuotes(ticketId?: string) {
    let query = this.supabase.from("quotes").select("*").order("created_at", { ascending: false });
    if (ticketId) query = query.eq("ticket_id", ticketId);
    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []).map(mapQuote);
  }

  async createQuote(input: { ticket_id: string; internal_cost: number; margin: number }) {
    const customerPrice = input.internal_cost + input.margin;
    const { data, error } = await this.supabase
      .from("quotes")
      .insert({
        ticket_id: input.ticket_id,
        internal_cost: input.internal_cost,
        customer_price: customerPrice,
        margin: input.margin,
        status: "draft",
        valid_until: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
      })
      .select("*")
      .single();
    if (error) throw error;
    await this.supabase
      .from("tickets")
      .update({ status: "quote_received", updated_at: new Date().toISOString() })
      .eq("id", input.ticket_id);
    return mapQuote(data);
  }

  async sendQuote(quoteId: string) {
    const { data, error } = await this.supabase
      .from("quotes")
      .update({ status: "sent" })
      .eq("id", quoteId)
      .select("*")
      .maybeSingle();
    if (error) throw error;
    if (data) {
      await this.supabase
        .from("tickets")
        .update({
          status: "quote_sent",
          customer_visible_status: "Preventivo inviato",
          updated_at: new Date().toISOString(),
        })
        .eq("id", data.ticket_id as string);
    }
    return data ? mapQuote(data) : undefined;
  }

  async updateQuotePdf(quoteId: string, pdfUrl: string) {
    const { data, error } = await this.supabase
      .from("quotes")
      .update({ pdf_url: pdfUrl })
      .eq("id", quoteId)
      .select("*")
      .maybeSingle();
    if (error) throw error;
    return data ? mapQuote(data) : undefined;
  }

  async listReferrals() {
    const { data, error } = await this.supabase.from("referrals").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map(mapReferral);
  }

  async createReferral(input: {
    partner_name: string;
    partner_type: string;
    phone: string | null;
    email: string | null;
    referred_company: string;
    referred_contact: string | null;
  }) {
    const { data, error } = await this.supabase
      .from("referrals")
      .insert({
        partner_name: input.partner_name,
        partner_type: input.partner_type,
        phone: input.phone,
        email: input.email,
        referred_company: input.referred_company,
        referred_contact: input.referred_contact,
        status: "lead",
        reward_status: "pending",
      })
      .select("*")
      .single();
    if (error) throw error;
    return mapReferral(data);
  }

  async getCustomerStats(orgId: string): Promise<CustomerDashboardStats> {
    const [equipment, tickets] = await Promise.all([this.listEquipment(orgId), this.listTickets(orgId)]);
    return {
      equipment_count: equipment.length,
      open_tickets: tickets.filter((t) => OPEN_STATUSES.includes(t.status)).length,
      pending_tickets: tickets.filter((t) => ["quote_sent", "info_requested"].includes(t.status)).length,
      expiring_warranties: equipment.filter((e) => e.warranty_status === "expiring").length,
      upcoming_maintenance: 2,
    };
  }

  async getAdminStats(): Promise<AdminDashboardStats> {
    const tickets = await this.listAllTickets();
    const orgs = await this.listOrganizations();
    return {
      new_tickets: tickets.filter((t) => t.status === "new").length,
      urgent_tickets: tickets.filter((t) => t.urgency === "high" || t.urgency === "critical").length,
      awaiting_technician: tickets.filter((t) => t.status === "awaiting_technician").length,
      awaiting_customer: tickets.filter((t) => t.status === "quote_sent" || t.status === "info_requested").length,
      quotes_to_send: tickets.filter((t) => t.status === "quote_received").length,
      scheduled_interventions: tickets.filter((t) => t.status === "scheduled").length,
      active_clients: orgs.filter((o) => o.status === "active").length,
    };
  }
}
