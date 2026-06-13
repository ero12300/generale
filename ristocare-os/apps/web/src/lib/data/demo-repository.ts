import { demoStore } from "@/lib/demo-store";
import type { DataRepository } from "@/lib/data/repository";
import type { CreateTicketInput } from "@/lib/validations/api";
import type { TicketStatus } from "@ristocare/types";

export class DemoRepository implements DataRepository {
  getOrganization(id: string) {
    return Promise.resolve(demoStore.getOrganization(id));
  }

  listOrganizations() {
    return Promise.resolve(demoStore.listOrganizations());
  }

  listLocations(orgId: string) {
    return Promise.resolve(demoStore.listLocations(orgId));
  }

  listEquipment(orgId: string) {
    return Promise.resolve(demoStore.listEquipment(orgId));
  }

  getEquipment(id: string) {
    return Promise.resolve(demoStore.getEquipment(id));
  }

  getEquipmentByQrToken(token: string) {
    return Promise.resolve(demoStore.getEquipmentByQrToken(token));
  }

  listDocuments(equipmentId: string) {
    return Promise.resolve(demoStore.listDocuments(equipmentId));
  }

  addDocument() {
    return Promise.resolve(null);
  }

  listTickets(orgId: string) {
    return Promise.resolve(demoStore.listTickets(orgId));
  }

  listAllTickets() {
    return Promise.resolve(demoStore.listAllTickets());
  }

  listTicketsForTechnician(techId: string) {
    return Promise.resolve(demoStore.listTicketsForTechnician(techId));
  }

  getTicket(id: string) {
    return Promise.resolve(demoStore.getTicket(id));
  }

  createTicket(orgId: string, locationId: string, input: CreateTicketInput) {
    return Promise.resolve(
      demoStore.createTicket({
        organization_id: orgId,
        location_id: locationId,
        equipment_id: input.equipment_id,
        title: input.title,
        description: input.description,
        urgency: input.urgency,
      })
    );
  }

  updateTicketStatus(id: string, status: TicketStatus, notes?: string) {
    return Promise.resolve(demoStore.updateTicketStatus(id, status, notes));
  }

  assignTechnician(ticketId: string, technicianId: string) {
    return Promise.resolve(demoStore.assignTechnician(ticketId, technicianId));
  }

  listTechnicians() {
    return Promise.resolve(demoStore.listTechnicians());
  }

  getTechnician(id: string) {
    return Promise.resolve(demoStore.getTechnician(id));
  }

  listTechnicianRequests(ticketId: string) {
    return Promise.resolve(demoStore.listTechnicianRequests(ticketId));
  }

  createTechnicianRequest(input: {
    ticket_id: string;
    technician_id: string;
    internal_price: number;
    availability: string;
    notes?: string;
  }) {
    return Promise.resolve(demoStore.createTechnicianRequest(input));
  }

  listQuotes(ticketId?: string) {
    return Promise.resolve(demoStore.listQuotes(ticketId));
  }

  createQuote(input: { ticket_id: string; internal_cost: number; margin: number }) {
    return Promise.resolve(demoStore.createQuote(input));
  }

  sendQuote(quoteId: string) {
    return Promise.resolve(demoStore.sendQuote(quoteId));
  }

  updateQuotePdf(quoteId: string, _pdfUrl: string) {
    return Promise.resolve(demoStore.listQuotes().find((q) => q.id === quoteId));
  }

  listReferrals() {
    return Promise.resolve(demoStore.listReferrals());
  }

  createReferral(input: {
    partner_name: string;
    partner_type: string;
    phone: string | null;
    email: string | null;
    referred_company: string;
    referred_contact: string | null;
  }) {
    return Promise.resolve(demoStore.createReferral(input));
  }

  getCustomerStats(orgId: string) {
    return Promise.resolve(demoStore.getCustomerStats(orgId));
  }

  getAdminStats() {
    return Promise.resolve(demoStore.getAdminStats());
  }
}
