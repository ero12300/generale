import {
  Equipment,
  EquipmentDocument,
  Location,
  Organization,
  Quote,
  Referral,
  Technician,
  Ticket,
  TicketStatus,
} from "@/lib/types";
import { applyMarginBp } from "@/lib/money";

interface DemoData {
  organizations: Organization[];
  locations: Location[];
  equipment: Equipment[];
  documents: EquipmentDocument[];
  tickets: Ticket[];
  technicians: Technician[];
  quotes: Quote[];
  referrals: Referral[];
  counter: number;
}

function seed(): DemoData {
  const org: Organization = {
    id: "org-1",
    name: "Gelateria Lo Stretto",
    city: "Messina",
    province: "ME",
    plan: "pro",
    createdAt: "2026-01-15T09:00:00Z",
  };

  const location: Location = {
    id: "loc-1",
    organizationId: org.id,
    name: "Sede centrale",
    address: "Via Garibaldi 42",
    city: "Messina",
  };

  const equipment: Equipment[] = [
    {
      id: "eq-1",
      organizationId: org.id,
      locationId: location.id,
      name: "Vetrina gelato 12 gusti",
      category: "vetrina_gelato",
      brand: "ISA",
      model: "Millennium ST12",
      serialNumber: "ISA-2024-88341",
      supplier: "Emotive S.r.l.",
      purchaseDate: "2025-03-10",
      warrantyEnd: "2026-03-10",
      area: "Banco",
      qrToken: "qr-vetrina-1",
      notes: "Compressore sostituito a giugno 2025.",
    },
    {
      id: "eq-2",
      organizationId: org.id,
      locationId: location.id,
      name: "Abbattitore 5 teglie",
      category: "abbattitore",
      brand: "Irinox",
      model: "EasyFresh 5T",
      serialNumber: "IRX-77120",
      supplier: "Emotive S.r.l.",
      purchaseDate: "2025-06-20",
      warrantyEnd: "2026-06-20",
      area: "Laboratorio",
      qrToken: "qr-abbattitore-2",
    },
    {
      id: "eq-3",
      organizationId: org.id,
      locationId: location.id,
      name: "Macchina caffè 2 gruppi",
      category: "macchina_caffe",
      brand: "La Cimbali",
      model: "M26 BE",
      serialNumber: "CIM-55920",
      supplier: "Fornitore esterno",
      purchaseDate: "2023-11-05",
      warrantyEnd: "2024-11-05",
      area: "Banco bar",
      qrToken: "qr-caffe-3",
    },
    {
      id: "eq-4",
      organizationId: org.id,
      locationId: location.id,
      name: "Lavastoviglie a capote",
      category: "lavastoviglie",
      brand: "Hobart",
      model: "AMX-900",
      serialNumber: "HOB-13377",
      supplier: "Emotive S.r.l.",
      purchaseDate: "2025-09-01",
      warrantyEnd: "2026-09-01",
      area: "Cucina",
      qrToken: "qr-lavastoviglie-4",
    },
  ];

  const documents: EquipmentDocument[] = [
    { id: "doc-1", equipmentId: "eq-1", documentType: "manuale", fileName: "manuale_isa_st12.pdf" },
    { id: "doc-2", equipmentId: "eq-1", documentType: "fattura", fileName: "fattura_2025_0341.pdf" },
    { id: "doc-3", equipmentId: "eq-1", documentType: "foto_etichetta", fileName: "etichetta_isa.jpg" },
    { id: "doc-4", equipmentId: "eq-2", documentType: "manuale", fileName: "manuale_irinox.pdf" },
    { id: "doc-5", equipmentId: "eq-4", documentType: "fattura", fileName: "fattura_2025_0512.pdf" },
  ];

  const tickets: Ticket[] = [
    {
      id: "tk-1001",
      organizationId: org.id,
      equipmentId: "eq-1",
      title: "Vetrina non mantiene la temperatura",
      description:
        "La vetrina segna -8°C invece di -14°C dalle 7 di stamattina. Il gelato si sta ammorbidendo. Nessun errore sul display.",
      urgency: "blocco_servizio",
      status: "preventivo_inviato",
      machineDown: false,
      openedBy: "Marco (titolare)",
      createdAt: "2026-06-10T07:42:00Z",
      internalNotes: "Probabile ricarica gas. Tecnico Currò disponibile domani.",
      assignedTechnicianId: "tec-1",
    },
    {
      id: "tk-1002",
      organizationId: org.id,
      equipmentId: "eq-3",
      title: "Perdita acqua dal gruppo 2",
      description: "Gocciola acqua dal portafiltro destro durante l'erogazione. Guarnizione probabilmente da sostituire.",
      urgency: "media",
      status: "in_verifica",
      machineDown: false,
      openedBy: "Giulia (banco)",
      createdAt: "2026-06-11T15:20:00Z",
    },
    {
      id: "tk-1003",
      organizationId: org.id,
      equipmentId: "eq-4",
      title: "Lavastoviglie non scalda il risciacquo",
      description: "Bicchieri escono freddi e opachi. Risciacquo a 40°C invece di 85°C.",
      urgency: "alta",
      status: "chiuso",
      machineDown: false,
      openedBy: "Marco (titolare)",
      createdAt: "2026-05-02T10:00:00Z",
      assignedTechnicianId: "tec-2",
    },
  ];

  const technicians: Technician[] = [
    {
      id: "tec-1",
      name: "Salvatore Currò",
      companyName: "Currò Refrigerazione",
      phone: "+39 333 0000001",
      categories: ["frigo", "freezer", "vetrina_gelato", "vetrina_refrigerata", "abbattitore"],
      city: "Messina",
      ratingInternal: 5,
      active: true,
    },
    {
      id: "tec-2",
      name: "Antonio Restuccia",
      companyName: "AR Grandi Impianti",
      phone: "+39 333 0000002",
      categories: ["lavastoviglie", "forno", "cappa", "friggitrice"],
      city: "Messina",
      ratingInternal: 4,
      active: true,
    },
    {
      id: "tec-3",
      name: "Paolo Vinci",
      companyName: "Vinci Caffè Service",
      phone: "+39 333 0000003",
      categories: ["macchina_caffe", "macinacaffe", "addolcitore"],
      city: "Villafranca Tirrena",
      ratingInternal: 4,
      active: true,
    },
  ];

  const internalCost1 = 18000; // 180,00 € costo tecnico
  const quotes: Quote[] = [
    {
      id: "qt-1",
      ticketId: "tk-1001",
      internalCostCents: internalCost1,
      customerPriceCents: applyMarginBp(internalCost1, 2500),
      status: "inviato",
      validUntil: "2026-06-20",
      createdAt: "2026-06-10T16:00:00Z",
    },
    {
      id: "qt-2",
      ticketId: "tk-1003",
      internalCostCents: 12000,
      customerPriceCents: applyMarginBp(12000, 2000),
      status: "accettato",
      validUntil: "2026-05-15",
      createdAt: "2026-05-03T09:30:00Z",
    },
  ];

  const referrals: Referral[] = [
    {
      id: "rf-1",
      partnerName: "Studio Battaglia",
      partnerType: "Commercialista",
      referredCompany: "Pizzeria Vico Marina",
      referredContact: "Sig. Arena",
      city: "Messina",
      status: "convertito",
      planSold: "start",
      rewardAmountCents: 5000,
      createdAt: "2026-04-22T11:00:00Z",
    },
    {
      id: "rf-2",
      partnerName: "Caffè Sud Agenti",
      partnerType: "Agente caffè",
      referredCompany: "Bar Duomo",
      referredContact: "Sig.ra Fiore",
      city: "Messina",
      status: "contattato",
      createdAt: "2026-06-01T09:00:00Z",
    },
  ];

  return {
    organizations: [org],
    locations: [location],
    equipment,
    documents,
    tickets,
    technicians,
    quotes,
    referrals,
    counter: 1004,
  };
}

const globalForDemo = globalThis as unknown as { __ristocareDemo?: DemoData };

function store(): DemoData {
  if (!globalForDemo.__ristocareDemo) {
    globalForDemo.__ristocareDemo = seed();
  }
  return globalForDemo.__ristocareDemo;
}

export const demoStore = {
  getOrganization(): Organization {
    return store().organizations[0];
  },
  listEquipment(): Equipment[] {
    return store().equipment;
  },
  getEquipment(id: string): Equipment | undefined {
    return store().equipment.find((e) => e.id === id);
  },
  getEquipmentByQrToken(token: string): Equipment | undefined {
    return store().equipment.find((e) => e.qrToken === token);
  },
  listDocuments(equipmentId: string): EquipmentDocument[] {
    return store().documents.filter((d) => d.equipmentId === equipmentId);
  },
  listTickets(): Ticket[] {
    return [...store().tickets].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },
  getTicket(id: string): Ticket | undefined {
    return store().tickets.find((t) => t.id === id);
  },
  listTicketsForEquipment(equipmentId: string): Ticket[] {
    return store().tickets.filter((t) => t.equipmentId === equipmentId);
  },
  createTicket(input: Omit<Ticket, "id" | "status" | "createdAt" | "organizationId">): Ticket {
    const s = store();
    const ticket: Ticket = {
      ...input,
      id: `tk-${s.counter++}`,
      organizationId: s.organizations[0].id,
      status: "nuovo",
      createdAt: new Date().toISOString(),
    };
    s.tickets.push(ticket);
    return ticket;
  },
  updateTicketStatus(id: string, status: TicketStatus): Ticket | undefined {
    const ticket = store().tickets.find((t) => t.id === id);
    if (ticket) ticket.status = status;
    return ticket;
  },
  listTechnicians(): Technician[] {
    return store().technicians;
  },
  getTechnician(id: string): Technician | undefined {
    return store().technicians.find((t) => t.id === id);
  },
  listQuotes(): Quote[] {
    return store().quotes;
  },
  getQuoteForTicket(ticketId: string): Quote | undefined {
    return store().quotes.find((q) => q.ticketId === ticketId);
  },
  listReferrals(): Referral[] {
    return [...store().referrals].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },
  createReferral(input: Omit<Referral, "id" | "status" | "createdAt">): Referral {
    const s = store();
    const referral: Referral = {
      ...input,
      id: `rf-${s.counter++}`,
      status: "nuovo",
      createdAt: new Date().toISOString(),
    };
    s.referrals.push(referral);
    return referral;
  },
};
