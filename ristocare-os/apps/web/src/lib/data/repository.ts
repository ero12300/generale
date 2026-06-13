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
import { demoStore } from "@/lib/demo-store";
import type { CreateTicketInput } from "@/lib/validations/api";

export interface DataRepository {
  getOrganization(id: string): Organization | undefined;
  listOrganizations(): Organization[];
  listLocations(orgId: string): Location[];
  listEquipment(orgId: string): Equipment[];
  getEquipment(id: string): Equipment | undefined;
  getEquipmentByQrToken(token: string): Equipment | undefined;
  listDocuments(equipmentId: string): EquipmentDocument[];
  listTickets(orgId: string): Ticket[];
  listAllTickets(): Ticket[];
  listTicketsForTechnician(techId: string): Ticket[];
  getTicket(id: string): Ticket | undefined;
  createTicket(orgId: string, locationId: string, input: CreateTicketInput): Ticket;
  updateTicketStatus(id: string, status: TicketStatus, notes?: string): Ticket | undefined;
  assignTechnician(ticketId: string, technicianId: string): Ticket | undefined;
  listTechnicians(): Technician[];
  getTechnician(id: string): Technician | undefined;
  listTechnicianRequests(ticketId: string): TechnicianRequest[];
  createTechnicianRequest(input: {
    ticket_id: string;
    technician_id: string;
    internal_price: number;
    availability: string;
    notes?: string;
  }): TechnicianRequest;
  listQuotes(ticketId?: string): Quote[];
  createQuote(input: { ticket_id: string; internal_cost: number; margin: number }): Quote;
  sendQuote(quoteId: string): Quote | undefined;
  listReferrals(): Referral[];
  createReferral(input: {
    partner_name: string;
    partner_type: string;
    phone: string | null;
    email: string | null;
    referred_company: string;
    referred_contact: string | null;
  }): Referral;
  getCustomerStats(orgId: string): CustomerDashboardStats;
  getAdminStats(): AdminDashboardStats;
}

export const repository: DataRepository = {
  getOrganization: (id) => demoStore.getOrganization(id),
  listOrganizations: () => demoStore.listOrganizations(),
  listLocations: (orgId) => demoStore.listLocations(orgId),
  listEquipment: (orgId) => demoStore.listEquipment(orgId),
  getEquipment: (id) => demoStore.getEquipment(id),
  getEquipmentByQrToken: (token) => demoStore.getEquipmentByQrToken(token),
  listDocuments: (equipmentId) => demoStore.listDocuments(equipmentId),
  listTickets: (orgId) => demoStore.listTickets(orgId),
  listAllTickets: () => demoStore.listAllTickets(),
  listTicketsForTechnician: (techId) => demoStore.listTicketsForTechnician(techId),
  getTicket: (id) => demoStore.getTicket(id),
  createTicket: (orgId, locationId, input) =>
    demoStore.createTicket({
      organization_id: orgId,
      location_id: locationId,
      equipment_id: input.equipment_id,
      title: input.title,
      description: input.description,
      urgency: input.urgency,
    }),
  updateTicketStatus: (id, status, notes) => demoStore.updateTicketStatus(id, status, notes),
  assignTechnician: (ticketId, technicianId) => demoStore.assignTechnician(ticketId, technicianId),
  listTechnicians: () => demoStore.listTechnicians(),
  getTechnician: (id) => demoStore.getTechnician(id),
  listTechnicianRequests: (ticketId) => demoStore.listTechnicianRequests(ticketId),
  createTechnicianRequest: (input) => demoStore.createTechnicianRequest(input),
  listQuotes: (ticketId) => demoStore.listQuotes(ticketId),
  createQuote: (input) => demoStore.createQuote(input),
  sendQuote: (quoteId) => demoStore.sendQuote(quoteId),
  listReferrals: () => demoStore.listReferrals(),
  createReferral: (input) => demoStore.createReferral(input),
  getCustomerStats: (orgId) => demoStore.getCustomerStats(orgId),
  getAdminStats: () => demoStore.getAdminStats(),
};
