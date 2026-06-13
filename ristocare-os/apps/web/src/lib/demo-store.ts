import type {
  AdminDashboardStats,
  CustomerDashboardStats,
  Equipment,
  EquipmentDocument,
  Location,
  Organization,
  Quote,
  Referral,
  Technician,
  TechnicianRequest,
  Ticket,
  TicketStatus,
} from "@ristocare/types";

const DEMO_ORG_ID = "org-demo-001";
const DEMO_LOCATION_ID = "loc-demo-001";
const DEMO_TECH_ID = "tech-001";

const organization: Organization = {
  id: DEMO_ORG_ID,
  name: "Gelateria Demo Messina",
  vat_number: "01234567890",
  fiscal_code: null,
  billing_email: "info@gelateriademo.it",
  phone: "+39 090 1234567",
  address: "Via Garibaldi 42",
  city: "Messina",
  province: "ME",
  region: "Sicilia",
  status: "active",
  plan: "pro",
  created_at: "2025-01-15T10:00:00Z",
};

const location: Location = {
  id: DEMO_LOCATION_ID,
  organization_id: DEMO_ORG_ID,
  name: "Gelateria Demo — Sede principale",
  address: "Via Garibaldi 42",
  city: "Messina",
  province: "ME",
  phone: "+39 090 1234567",
  manager_name: "Marco Bianchi",
  created_at: "2025-01-15T10:00:00Z",
};

const equipment: Equipment[] = [
  {
    id: "eq-001",
    organization_id: DEMO_ORG_ID,
    location_id: DEMO_LOCATION_ID,
    name: "Vetrina gelato 3 vasche",
    category: "vetrina_gelato",
    brand: "Carpigiani",
    model: "Mercury",
    serial_number: "CPG-MRC-2024-88421",
    supplier: "Emotive S.r.l.",
    purchase_date: "2024-03-10",
    delivery_date: "2024-03-20",
    installation_date: "2024-03-22",
    warranty_start: "2024-03-22",
    warranty_end: "2025-03-22",
    warranty_status: "expired",
    area: "Banco gelato",
    notes: "Manutenzione filtri ogni 3 mesi",
    qr_token: "qr-demo-vetrina-001",
    status: "active",
    created_at: "2024-03-22T09:00:00Z",
  },
  {
    id: "eq-002",
    organization_id: DEMO_ORG_ID,
    location_id: DEMO_LOCATION_ID,
    name: "Abbattitore blast chiller",
    category: "abbattitore",
    brand: "Irinox",
    model: "MF 70.1",
    serial_number: "IRX-MF70-2023-55102",
    supplier: "Emotive S.r.l.",
    purchase_date: "2023-06-01",
    delivery_date: "2023-06-15",
    installation_date: "2023-06-16",
    warranty_start: "2023-06-16",
    warranty_end: "2024-06-16",
    warranty_status: "expired",
    area: "Laboratorio",
    notes: null,
    qr_token: "qr-demo-abbattitore-002",
    status: "active",
    created_at: "2023-06-16T09:00:00Z",
  },
  {
    id: "eq-003",
    organization_id: DEMO_ORG_ID,
    location_id: DEMO_LOCATION_ID,
    name: "Frigo positivo cucina",
    category: "frigo",
    brand: "Arctic Air",
    model: "AUC48R",
    serial_number: "ARC-AUC48-2025-11203",
    supplier: "Emotive S.r.l.",
    purchase_date: "2025-01-10",
    delivery_date: "2025-01-20",
    installation_date: "2025-01-22",
    warranty_start: "2025-01-22",
    warranty_end: "2026-01-22",
    warranty_status: "active",
    area: "Cucina",
    notes: null,
    qr_token: "qr-demo-frigo-003",
    status: "active",
    created_at: "2025-01-22T09:00:00Z",
  },
  {
    id: "eq-004",
    organization_id: DEMO_ORG_ID,
    location_id: DEMO_LOCATION_ID,
    name: "Macchina caffè professionale",
    category: "macchina_caffe",
    brand: "La Marzocco",
    model: "Linea PB",
    serial_number: "LMZ-LPB-2024-33001",
    supplier: "Emotive S.r.l.",
    purchase_date: "2024-09-01",
    delivery_date: "2024-09-10",
    installation_date: "2024-09-12",
    warranty_start: "2024-09-12",
    warranty_end: "2025-09-12",
    warranty_status: "expiring",
    area: "Banco bar",
    notes: "Decalcificazione mensile",
    qr_token: "qr-demo-caffe-004",
    status: "active",
    created_at: "2024-09-12T09:00:00Z",
  },
];

const documents: EquipmentDocument[] = [
  {
    id: "doc-001",
    equipment_id: "eq-001",
    document_type: "manual",
    file_url: "/demo/manual-vetrina.pdf",
    file_name: "Manuale Carpigiani Mercury.pdf",
    uploaded_by: null,
    created_at: "2024-03-22T10:00:00Z",
  },
  {
    id: "doc-002",
    equipment_id: "eq-003",
    document_type: "invoice",
    file_url: "/demo/fattura-frigo.pdf",
    file_name: "Fattura acquisto frigo.pdf",
    uploaded_by: null,
    created_at: "2025-01-22T10:00:00Z",
  },
];

let tickets: Ticket[] = [
  {
    id: "tkt-001",
    organization_id: DEMO_ORG_ID,
    location_id: DEMO_LOCATION_ID,
    equipment_id: "eq-001",
    title: "Vetrina non mantiene temperatura",
    description:
      "Da ieri sera la temperatura della vasca centrale è salita a -8°C invece di -14°C. Il display non mostra errori.",
    urgency: "high",
    status: "in_review",
    warranty_check: false,
    customer_visible_status: "In verifica da RistoCare",
    internal_notes: "Garanzia scaduta. Verificare guarnizioni e gas.",
    opened_by: null,
    assigned_operator_id: null,
    assigned_technician_id: null,
    created_at: "2025-06-10T08:30:00Z",
    updated_at: "2025-06-10T09:15:00Z",
    closed_at: null,
  },
  {
    id: "tkt-002",
    organization_id: DEMO_ORG_ID,
    location_id: DEMO_LOCATION_ID,
    equipment_id: "eq-004",
    title: "Macchina caffè — perdita acqua",
    description: "Piccola perdita sotto il gruppo erogazione sinistro durante l'uso.",
    urgency: "medium",
    status: "quote_sent",
    warranty_check: true,
    customer_visible_status: "Preventivo inviato",
    internal_notes: null,
    opened_by: null,
    assigned_operator_id: null,
    assigned_technician_id: DEMO_TECH_ID,
    created_at: "2025-06-05T14:00:00Z",
    updated_at: "2025-06-07T11:00:00Z",
    closed_at: null,
  },
  {
    id: "tkt-003",
    organization_id: DEMO_ORG_ID,
    location_id: DEMO_LOCATION_ID,
    equipment_id: "eq-002",
    title: "Abbattitore — allarme temperatura",
    description: "Allarme sonoro intermittente, ciclo abbattimento più lento del solito.",
    urgency: "low",
    status: "closed",
    warranty_check: false,
    customer_visible_status: "Chiuso",
    internal_notes: "Sostituita sonda temperatura. Intervento completato.",
    opened_by: null,
    assigned_operator_id: null,
    assigned_technician_id: DEMO_TECH_ID,
    created_at: "2025-05-20T10:00:00Z",
    updated_at: "2025-05-22T16:00:00Z",
    closed_at: "2025-05-22T16:00:00Z",
  },
];

const technicians: Technician[] = [
  {
    id: DEMO_TECH_ID,
    name: "Mario Rossi",
    company_name: "Assistenza Food ME",
    phone: "+39 333 1234567",
    email: "mario.rossi@tecnico.it",
    categories: ["vetrina_gelato", "frigo", "abbattitore", "macchina_caffe"],
    city: "Messina",
    province: "ME",
    rating_internal: 4.5,
    notes_internal: "Affidabile, buoni tempi urgenza",
    active: true,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "tech-002",
    name: "Giuseppe Vitale",
    company_name: "Vitale Refrigerazione",
    phone: "+39 340 9876543",
    email: "g.vitale@refrig.it",
    categories: ["frigo", "freezer", "vetrina_refrigerata", "cappa"],
    city: "Messina",
    province: "ME",
    rating_internal: 4.2,
    notes_internal: null,
    active: true,
    created_at: "2024-01-01T00:00:00Z",
  },
];

let technicianRequests: TechnicianRequest[] = [
  {
    id: "tr-001",
    ticket_id: "tkt-002",
    technician_id: DEMO_TECH_ID,
    internal_price: 85,
    availability: "Giovedì mattina",
    response_status: "accepted",
    notes: "Guarnizione gruppo erogazione + manodopera",
    created_at: "2025-06-06T10:00:00Z",
  },
];

let quotes: Quote[] = [
  {
    id: "qt-001",
    ticket_id: "tkt-002",
    internal_cost: 85,
    customer_price: 120,
    margin: 35,
    status: "sent",
    accepted_at: null,
    valid_until: "2025-06-20",
    pdf_url: null,
    created_at: "2025-06-07T11:00:00Z",
  },
];

let referrals: Referral[] = [
  {
    id: "ref-001",
    partner_name: "Luca Ferri",
    partner_type: "Agente caffè",
    phone: "+39 328 1112233",
    email: "l.ferri@caffe.it",
    referred_company: "Bar del Porto",
    referred_contact: "Anna Russo",
    status: "contacted",
    plan_sold: null,
    reward_amount: 100,
    reward_status: "pending",
    created_at: "2025-06-01T12:00:00Z",
  },
];

const organizations: Organization[] = [organization];

export const demoStore = {
  orgId: DEMO_ORG_ID,
  orgName: organization.name,
  technicianId: DEMO_TECH_ID,

  getOrganization(id?: string): Organization | undefined {
    return organizations.find((o) => o.id === (id ?? DEMO_ORG_ID));
  },

  listOrganizations(): Organization[] {
    return [...organizations];
  },

  getLocation(id?: string): Location {
    return id === DEMO_LOCATION_ID || !id ? location : location;
  },

  listLocations(orgId = DEMO_ORG_ID): Location[] {
    return orgId === DEMO_ORG_ID ? [location] : [];
  },

  listEquipment(orgId = DEMO_ORG_ID): Equipment[] {
    return equipment.filter((e) => e.organization_id === orgId);
  },

  getEquipment(id: string): Equipment | undefined {
    return equipment.find((e) => e.id === id);
  },

  getEquipmentByQrToken(token: string): Equipment | undefined {
    return equipment.find((e) => e.qr_token === token);
  },

  listDocuments(equipmentId: string): EquipmentDocument[] {
    return documents.filter((d) => d.equipment_id === equipmentId);
  },

  listTickets(orgId = DEMO_ORG_ID): Ticket[] {
    return tickets
      .filter((t) => t.organization_id === orgId)
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
  },

  listTicketsForTechnician(techId: string): Ticket[] {
    return tickets
      .filter((t) => t.assigned_technician_id === techId)
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
  },

  listAllTickets(): Ticket[] {
    return [...tickets].sort(
      (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );
  },

  getTicket(id: string): Ticket | undefined {
    return tickets.find((t) => t.id === id);
  },

  createTicket(input: {
    organization_id: string;
    location_id: string;
    equipment_id?: string | null;
    title: string;
    description: string;
    urgency: Ticket["urgency"];
  }): Ticket {
    const now = new Date().toISOString();
    const ticket: Ticket = {
      id: `tkt-${Date.now()}`,
      organization_id: input.organization_id,
      location_id: input.location_id,
      equipment_id: input.equipment_id ?? null,
      title: input.title,
      description: input.description,
      urgency: input.urgency,
      status: "new",
      warranty_check: null,
      customer_visible_status: "Nuovo",
      internal_notes: null,
      opened_by: null,
      assigned_operator_id: null,
      assigned_technician_id: null,
      created_at: now,
      updated_at: now,
      closed_at: null,
    };
    tickets = [ticket, ...tickets];
    return ticket;
  },

  updateTicketStatus(id: string, status: TicketStatus, internalNotes?: string): Ticket | undefined {
    const idx = tickets.findIndex((t) => t.id === id);
    if (idx === -1) return undefined;
    const updated: Ticket = {
      ...tickets[idx],
      status,
      updated_at: new Date().toISOString(),
      internal_notes: internalNotes ?? tickets[idx].internal_notes,
      closed_at: status === "closed" || status === "resolved" ? new Date().toISOString() : null,
    };
    tickets[idx] = updated;
    return updated;
  },

  assignTechnician(ticketId: string, technicianId: string): Ticket | undefined {
    const idx = tickets.findIndex((t) => t.id === ticketId);
    if (idx === -1) return undefined;
    tickets[idx] = {
      ...tickets[idx],
      assigned_technician_id: technicianId,
      status: "awaiting_technician",
      updated_at: new Date().toISOString(),
    };
    return tickets[idx];
  },

  listTechnicians(): Technician[] {
    return technicians.filter((t) => t.active);
  },

  getTechnician(id: string): Technician | undefined {
    return technicians.find((t) => t.id === id);
  },

  listTechnicianRequests(ticketId: string): TechnicianRequest[] {
    return technicianRequests.filter((r) => r.ticket_id === ticketId);
  },

  createTechnicianRequest(input: {
    ticket_id: string;
    technician_id: string;
    internal_price: number;
    availability: string;
    notes?: string;
  }): TechnicianRequest {
    const req: TechnicianRequest = {
      id: `tr-${Date.now()}`,
      ticket_id: input.ticket_id,
      technician_id: input.technician_id,
      internal_price: input.internal_price,
      availability: input.availability,
      response_status: "pending",
      notes: input.notes ?? null,
      created_at: new Date().toISOString(),
    };
    technicianRequests = [req, ...technicianRequests];
    return req;
  },

  listQuotes(ticketId?: string): Quote[] {
    if (ticketId) return quotes.filter((q) => q.ticket_id === ticketId);
    return [...quotes];
  },

  createQuote(input: {
    ticket_id: string;
    internal_cost: number;
    margin: number;
  }): Quote {
    const quote: Quote = {
      id: `qt-${Date.now()}`,
      ticket_id: input.ticket_id,
      internal_cost: input.internal_cost,
      customer_price: input.internal_cost + input.margin,
      margin: input.margin,
      status: "draft",
      accepted_at: null,
      valid_until: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
      pdf_url: null,
      created_at: new Date().toISOString(),
    };
    quotes = [quote, ...quotes];
    const idx = tickets.findIndex((t) => t.id === input.ticket_id);
    if (idx !== -1) {
      tickets[idx] = { ...tickets[idx], status: "quote_received", updated_at: new Date().toISOString() };
    }
    return quote;
  },

  sendQuote(quoteId: string): Quote | undefined {
    const idx = quotes.findIndex((q) => q.id === quoteId);
    if (idx === -1) return undefined;
    quotes[idx] = { ...quotes[idx], status: "sent" };
    const ticketIdx = tickets.findIndex((t) => t.id === quotes[idx].ticket_id);
    if (ticketIdx !== -1) {
      tickets[ticketIdx] = {
        ...tickets[ticketIdx],
        status: "quote_sent",
        customer_visible_status: "Preventivo inviato",
        updated_at: new Date().toISOString(),
      };
    }
    return quotes[idx];
  },

  listReferrals(): Referral[] {
    return [...referrals];
  },

  createReferral(input: Omit<Referral, "id" | "status" | "plan_sold" | "reward_amount" | "reward_status" | "created_at">): Referral {
    const ref: Referral = {
      id: `ref-${Date.now()}`,
      ...input,
      status: "lead",
      plan_sold: null,
      reward_amount: null,
      reward_status: "pending",
      created_at: new Date().toISOString(),
    };
    referrals = [ref, ...referrals];
    return ref;
  },

  getCustomerStats(orgId = DEMO_ORG_ID): CustomerDashboardStats {
    const orgTickets = tickets.filter((t) => t.organization_id === orgId);
    const openStatuses: TicketStatus[] = [
      "new", "in_review", "info_requested", "awaiting_technician",
      "quote_received", "quote_sent", "accepted", "scheduled", "in_progress", "awaiting_spare",
    ];
    const eq = equipment.filter((e) => e.organization_id === orgId);
    return {
      equipment_count: eq.length,
      open_tickets: orgTickets.filter((t) => openStatuses.includes(t.status)).length,
      pending_tickets: orgTickets.filter((t) => ["quote_sent", "info_requested"].includes(t.status)).length,
      expiring_warranties: eq.filter((e) => e.warranty_status === "expiring").length,
      upcoming_maintenance: 2,
    };
  },

  getAdminStats(): AdminDashboardStats {
    return {
      new_tickets: tickets.filter((t) => t.status === "new").length,
      urgent_tickets: tickets.filter((t) => t.urgency === "high" || t.urgency === "critical").length,
      awaiting_technician: tickets.filter((t) => t.status === "awaiting_technician").length,
      awaiting_customer: tickets.filter((t) => t.status === "quote_sent" || t.status === "info_requested").length,
      quotes_to_send: tickets.filter((t) => t.status === "quote_received").length,
      scheduled_interventions: tickets.filter((t) => t.status === "scheduled").length,
      active_clients: organizations.filter((o) => o.status === "active").length,
    };
  },
};
