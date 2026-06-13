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
import type { CreateTicketInput } from "@/lib/validations/api";

export interface DataRepository {
  getOrganization(id: string): Promise<Organization | undefined>;
  listOrganizations(): Promise<Organization[]>;
  listLocations(orgId: string): Promise<Location[]>;
  listEquipment(orgId: string): Promise<Equipment[]>;
  getEquipment(id: string): Promise<Equipment | undefined>;
  getEquipmentByQrToken(token: string): Promise<Equipment | undefined>;
  listDocuments(equipmentId: string): Promise<EquipmentDocument[]>;
  addDocument(input: {
    equipment_id: string;
    document_type: EquipmentDocument["document_type"];
    file_url: string;
    file_name: string;
  }): Promise<EquipmentDocument | null>;
  listTickets(orgId: string): Promise<Ticket[]>;
  listAllTickets(): Promise<Ticket[]>;
  listTicketsForTechnician(techId: string): Promise<Ticket[]>;
  getTicket(id: string): Promise<Ticket | undefined>;
  createTicket(orgId: string, locationId: string, input: CreateTicketInput): Promise<Ticket>;
  updateTicketStatus(id: string, status: TicketStatus, notes?: string): Promise<Ticket | undefined>;
  assignTechnician(ticketId: string, technicianId: string): Promise<Ticket | undefined>;
  listTechnicians(): Promise<Technician[]>;
  getTechnician(id: string): Promise<Technician | undefined>;
  listTechnicianRequests(ticketId: string): Promise<TechnicianRequest[]>;
  createTechnicianRequest(input: {
    ticket_id: string;
    technician_id: string;
    internal_price: number;
    availability: string;
    notes?: string;
  }): Promise<TechnicianRequest>;
  listQuotes(ticketId?: string): Promise<Quote[]>;
  createQuote(input: { ticket_id: string; internal_cost: number; margin: number }): Promise<Quote>;
  sendQuote(quoteId: string): Promise<Quote | undefined>;
  updateQuotePdf(quoteId: string, pdfUrl: string): Promise<Quote | undefined>;
  listReferrals(): Promise<Referral[]>;
  createReferral(input: {
    partner_name: string;
    partner_type: string;
    phone: string | null;
    email: string | null;
    referred_company: string;
    referred_contact: string | null;
  }): Promise<Referral>;
  getCustomerStats(orgId: string): Promise<CustomerDashboardStats>;
  getAdminStats(): Promise<AdminDashboardStats>;
}
