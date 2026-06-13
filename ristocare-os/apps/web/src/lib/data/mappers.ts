import type {
  Equipment,
  EquipmentDocument,
  Location,
  Organization,
  Quote,
  Referral,
  Technician,
  TechnicianRequest,
  Ticket,
  UserRole,
} from "@ristocare/types";

export function mapOrganization(row: Record<string, unknown>): Organization {
  return {
    id: row.id as string,
    name: row.name as string,
    vat_number: (row.vat_number as string) ?? null,
    fiscal_code: (row.fiscal_code as string) ?? null,
    billing_email: (row.billing_email as string) ?? null,
    phone: (row.phone as string) ?? null,
    address: (row.address as string) ?? null,
    city: row.city as string,
    province: row.province as string,
    region: (row.region as string) ?? "Sicilia",
    status: row.status as Organization["status"],
    plan: row.plan as Organization["plan"],
    created_at: row.created_at as string,
  };
}

export function mapLocation(row: Record<string, unknown>): Location {
  return {
    id: row.id as string,
    organization_id: row.organization_id as string,
    name: row.name as string,
    address: row.address as string,
    city: row.city as string,
    province: row.province as string,
    phone: (row.phone as string) ?? null,
    manager_name: (row.manager_name as string) ?? null,
    created_at: row.created_at as string,
  };
}

export function mapEquipment(row: Record<string, unknown>): Equipment {
  return {
    id: row.id as string,
    organization_id: row.organization_id as string,
    location_id: row.location_id as string,
    name: row.name as string,
    category: row.category as Equipment["category"],
    brand: (row.brand as string) ?? null,
    model: (row.model as string) ?? null,
    serial_number: (row.serial_number as string) ?? null,
    supplier: (row.supplier as string) ?? null,
    purchase_date: (row.purchase_date as string) ?? null,
    delivery_date: (row.delivery_date as string) ?? null,
    installation_date: (row.installation_date as string) ?? null,
    warranty_start: (row.warranty_start as string) ?? null,
    warranty_end: (row.warranty_end as string) ?? null,
    warranty_status: row.warranty_status as Equipment["warranty_status"],
    area: (row.area as string) ?? null,
    notes: (row.notes as string) ?? null,
    qr_token: row.qr_token as string,
    status: row.status as Equipment["status"],
    created_at: row.created_at as string,
  };
}

export function mapDocument(row: Record<string, unknown>): EquipmentDocument {
  return {
    id: row.id as string,
    equipment_id: row.equipment_id as string,
    document_type: row.document_type as EquipmentDocument["document_type"],
    file_url: row.file_url as string,
    file_name: row.file_name as string,
    uploaded_by: (row.uploaded_by as string) ?? null,
    created_at: row.created_at as string,
  };
}

export function mapTicket(row: Record<string, unknown>): Ticket {
  return {
    id: row.id as string,
    organization_id: row.organization_id as string,
    location_id: row.location_id as string,
    equipment_id: (row.equipment_id as string) ?? null,
    title: row.title as string,
    description: row.description as string,
    urgency: row.urgency as Ticket["urgency"],
    status: row.status as Ticket["status"],
    warranty_check: (row.warranty_check as boolean) ?? null,
    customer_visible_status: (row.customer_visible_status as string) ?? null,
    internal_notes: (row.internal_notes as string) ?? null,
    opened_by: (row.opened_by as string) ?? null,
    assigned_operator_id: (row.assigned_operator_id as string) ?? null,
    assigned_technician_id: (row.assigned_technician_id as string) ?? null,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
    closed_at: (row.closed_at as string) ?? null,
  };
}

export function mapTechnician(row: Record<string, unknown>): Technician {
  return {
    id: row.id as string,
    name: row.name as string,
    company_name: (row.company_name as string) ?? null,
    phone: row.phone as string,
    email: (row.email as string) ?? null,
    categories: (row.categories as Technician["categories"]) ?? [],
    city: row.city as string,
    province: row.province as string,
    rating_internal: Number(row.rating_internal ?? 0),
    notes_internal: (row.notes_internal as string) ?? null,
    active: Boolean(row.active ?? true),
    created_at: row.created_at as string,
  };
}

export function mapTechnicianRequest(row: Record<string, unknown>): TechnicianRequest {
  return {
    id: row.id as string,
    ticket_id: row.ticket_id as string,
    technician_id: row.technician_id as string,
    internal_price: row.internal_price != null ? Number(row.internal_price) : null,
    availability: (row.availability as string) ?? null,
    response_status: row.response_status as TechnicianRequest["response_status"],
    notes: (row.notes as string) ?? null,
    created_at: row.created_at as string,
  };
}

export function mapQuote(row: Record<string, unknown>): Quote {
  return {
    id: row.id as string,
    ticket_id: row.ticket_id as string,
    internal_cost: Number(row.internal_cost),
    customer_price: Number(row.customer_price),
    margin: Number(row.margin),
    status: row.status as Quote["status"],
    accepted_at: (row.accepted_at as string) ?? null,
    valid_until: (row.valid_until as string) ?? null,
    pdf_url: (row.pdf_url as string) ?? null,
    created_at: row.created_at as string,
  };
}

export function mapReferral(row: Record<string, unknown>): Referral {
  return {
    id: row.id as string,
    partner_name: row.partner_name as string,
    partner_type: row.partner_type as string,
    phone: (row.phone as string) ?? null,
    email: (row.email as string) ?? null,
    referred_company: row.referred_company as string,
    referred_contact: (row.referred_contact as string) ?? null,
    status: row.status as Referral["status"],
    plan_sold: (row.plan_sold as Referral["plan_sold"]) ?? null,
    reward_amount: row.reward_amount != null ? Number(row.reward_amount) : null,
    reward_status: row.reward_status as Referral["reward_status"],
    created_at: row.created_at as string,
  };
}

export function mapRole(role: string): UserRole {
  return role as UserRole;
}
