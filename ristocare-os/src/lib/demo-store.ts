import type {
  ContactRequest,
  Equipment,
  Location,
  Organization,
  Referral,
  Technician,
  Ticket,
  TicketEvent,
  TicketStatus,
} from "@/lib/types";
import type { CreateContactInput, CreateReferralInput, CreateTicketInput } from "@/lib/validations";
import { genId, warrantyStatusFrom } from "@/lib/utils";

// Store demo in-memory: dimostra UI e flussi senza Supabase (vedi AGENTS/ADR).
// Persistito su globalThis per sopravvivere all'hot-reload in sviluppo.

interface DemoData {
  organization: Organization;
  locations: Location[];
  equipment: Equipment[];
  tickets: Ticket[];
  technicians: Technician[];
  referrals: Referral[];
  contacts: ContactRequest[];
}

function iso(daysFromNow: number): string {
  return new Date(Date.now() + daysFromNow * 24 * 60 * 60 * 1000).toISOString();
}

function seed(): DemoData {
  const organization: Organization = {
    id: "org_emotive_demo",
    name: "Trattoria del Porto",
    vatNumber: "IT03456780838",
    billingEmail: "amministrazione@trattoriadelporto.it",
    phone: "+39 090 1234567",
    city: "Messina",
    province: "ME",
    region: "Sicilia",
    plan: "pro",
    status: "attivo",
    createdAt: iso(-120),
  };

  const location: Location = {
    id: "loc_porto",
    organizationId: organization.id,
    name: "Sede Centrale — Via della Marina",
    address: "Via della Marina 42",
    city: "Messina",
    province: "ME",
    managerName: "Salvatore Currò",
  };

  const equipment: Equipment[] = [
    {
      id: "eq_frigo_01",
      organizationId: organization.id,
      locationId: location.id,
      name: "Armadio frigo cucina",
      category: "frigo",
      brand: "Electrolux",
      model: "RS06DX2F",
      serialNumber: "ELX-2023-884412",
      supplier: "Emotive S.r.l.",
      purchaseDate: iso(-300),
      deliveryDate: iso(-290),
      installationDate: iso(-288),
      warrantyStart: iso(-288),
      warrantyEnd: iso(77),
      area: "Cucina",
      notes: "Temperatura impostata a +4°C.",
      qrToken: "qr_frigo01",
      status: "in_assistenza",
      documents: [
        { id: "doc1", equipmentId: "eq_frigo_01", documentType: "fattura", fileName: "fattura-frigo-2024.pdf", uploadedBy: "Operatore RistoCare", createdAt: iso(-288) },
        { id: "doc2", equipmentId: "eq_frigo_01", documentType: "manuale", fileName: "manuale-electrolux-rs06.pdf", uploadedBy: "Operatore RistoCare", createdAt: iso(-288) },
        { id: "doc3", equipmentId: "eq_frigo_01", documentType: "foto_etichetta", fileName: "etichetta-matricola.jpg", uploadedBy: "Salvatore Currò", createdAt: iso(-280) },
      ],
      createdAt: iso(-288),
    },
    {
      id: "eq_lavasto_01",
      organizationId: organization.id,
      locationId: location.id,
      name: "Lavastoviglie a capote",
      category: "lavastoviglie",
      brand: "Hobart",
      model: "AUXXR-10B",
      serialNumber: "HOB-9921-5510",
      supplier: "Emotive S.r.l.",
      purchaseDate: iso(-200),
      deliveryDate: iso(-195),
      installationDate: iso(-193),
      warrantyStart: iso(-193),
      warrantyEnd: iso(172),
      area: "Cucina",
      notes: "Addolcitore collegato, controllare brillantante.",
      qrToken: "qr_lavasto01",
      status: "operativa",
      documents: [
        { id: "doc4", equipmentId: "eq_lavasto_01", documentType: "fattura", fileName: "fattura-lavastoviglie.pdf", uploadedBy: "Operatore RistoCare", createdAt: iso(-193) },
      ],
      createdAt: iso(-193),
    },
    {
      id: "eq_caffe_01",
      organizationId: organization.id,
      locationId: location.id,
      name: "Macchina caffè 3 gruppi",
      category: "macchina_caffe",
      brand: "La Marzocco",
      model: "Linea PB",
      serialNumber: "LM-PB-2021-3321",
      supplier: "Caffè Sud Distribuzione",
      purchaseDate: iso(-560),
      deliveryDate: iso(-555),
      installationDate: iso(-553),
      warrantyStart: iso(-553),
      warrantyEnd: iso(-188),
      area: "Banco bar",
      notes: "Decalcificare ogni 2 settimane.",
      qrToken: "qr_caffe01",
      status: "operativa",
      documents: [],
      createdAt: iso(-553),
    },
    {
      id: "eq_vetrina_01",
      organizationId: organization.id,
      locationId: location.id,
      name: "Vetrina gelato 18 gusti",
      category: "vetrina_gelato",
      brand: "ISA",
      model: "Millennium LX",
      serialNumber: "ISA-LX-2022-7740",
      supplier: "Emotive S.r.l.",
      purchaseDate: iso(-410),
      deliveryDate: iso(-405),
      installationDate: iso(-403),
      warrantyStart: iso(-403),
      warrantyEnd: iso(28),
      area: "Sala",
      notes: "Pulizia condensatore mensile.",
      qrToken: "qr_vetrina01",
      status: "operativa",
      documents: [
        { id: "doc5", equipmentId: "eq_vetrina_01", documentType: "manuale", fileName: "manuale-isa-millennium.pdf", uploadedBy: "Operatore RistoCare", createdAt: iso(-403) },
      ],
      createdAt: iso(-403),
    },
    {
      id: "eq_forno_01",
      organizationId: organization.id,
      locationId: location.id,
      name: "Forno a convezione",
      category: "forno",
      brand: "Unox",
      model: "ChefTop XEVC",
      serialNumber: "UNX-2023-1180",
      supplier: "Emotive S.r.l.",
      purchaseDate: iso(-150),
      deliveryDate: iso(-145),
      installationDate: iso(-143),
      warrantyStart: iso(-143),
      warrantyEnd: iso(222),
      area: "Cucina",
      notes: "",
      qrToken: "qr_forno01",
      status: "operativa",
      documents: [],
      createdAt: iso(-143),
    },
  ];

  const technicians: Technician[] = [
    {
      id: "tec_01",
      name: "Antonino Risi",
      companyName: "Risi Frigoriferi",
      phone: "+39 333 1112233",
      categories: ["frigo", "freezer", "abbattitore", "vetrina_refrigerata", "vetrina_gelato"],
      city: "Messina",
      province: "ME",
      ratingInternal: 4.7,
      active: true,
    },
    {
      id: "tec_02",
      name: "Giuseppe Lo Giudice",
      companyName: "GLG Cucine Pro",
      phone: "+39 347 4455667",
      categories: ["forno", "friggitrice", "piano_cottura", "lavastoviglie"],
      city: "Messina",
      province: "ME",
      ratingInternal: 4.4,
      active: true,
    },
    {
      id: "tec_03",
      name: "Marco Pellegrino",
      companyName: "Caffè Service ME",
      phone: "+39 320 7788990",
      categories: ["macchina_caffe", "macinacaffe", "addolcitore"],
      city: "Messina",
      province: "ME",
      ratingInternal: 4.9,
      active: true,
    },
  ];

  const tickets: Ticket[] = [
    {
      id: "tk_001",
      code: "RC-2026-001",
      organizationId: organization.id,
      locationId: location.id,
      equipmentId: "eq_frigo_01",
      title: "Frigo non raggiunge la temperatura",
      description: "L'armadio frigo resta a +9°C anche di notte. Sento un rumore continuo dal motore.",
      urgency: "alta",
      status: "preventivo_inviato",
      warrantyCheck: "attiva",
      openedBy: "Salvatore Currò",
      assignedOperatorId: "op_demo",
      assignedTechnicianId: "tec_01",
      quote: {
        internalCost: 90,
        margin: 45,
        customerPrice: 135,
        status: "inviato",
        validUntil: iso(7),
      },
      attachments: [
        { id: "att1", fileName: "foto-display-temperatura.jpg", fileType: "image/jpeg", uploadedBy: "Salvatore Currò", createdAt: iso(-2) },
      ],
      events: [
        { id: "ev1", status: "nuovo", note: "Ticket aperto dal cliente via QR code.", author: "Salvatore Currò", createdAt: iso(-2) },
        { id: "ev2", status: "in_verifica", note: "Verifica garanzia: ATTIVA. Richiesta foto matricola.", author: "Operatore RistoCare", createdAt: iso(-2) },
        { id: "ev3", status: "in_attesa_tecnico", note: "Inviata richiesta al tecnico Risi Frigoriferi.", author: "Operatore RistoCare", createdAt: iso(-1) },
        { id: "ev4", status: "preventivo_ricevuto", note: "Tecnico: probabile guarnizione + gas. Costo interno 90€.", author: "Operatore RistoCare", createdAt: iso(-1) },
        { id: "ev5", status: "preventivo_inviato", note: "Preventivo cliente inviato: 135€ (margine 45€).", author: "Operatore RistoCare", createdAt: iso(0) },
      ],
      createdAt: iso(-2),
      updatedAt: iso(0),
    },
    {
      id: "tk_002",
      code: "RC-2026-002",
      organizationId: organization.id,
      locationId: location.id,
      equipmentId: "eq_caffe_01",
      title: "Macchina caffè perde acqua dal gruppo 2",
      description: "Perdita d'acqua continua dal secondo gruppo durante l'erogazione.",
      urgency: "media",
      status: "in_verifica",
      warrantyCheck: "scaduta",
      openedBy: "Barista — Chiara",
      assignedOperatorId: "op_demo",
      assignedTechnicianId: null,
      quote: null,
      attachments: [],
      events: [
        { id: "ev6", status: "nuovo", note: "Ticket aperto dal banco bar.", author: "Barista — Chiara", createdAt: iso(-1) },
        { id: "ev7", status: "in_verifica", note: "Garanzia scaduta. Probabile guarnizione gruppo.", author: "Operatore RistoCare", createdAt: iso(0) },
      ],
      createdAt: iso(-1),
      updatedAt: iso(0),
    },
    {
      id: "tk_003",
      code: "RC-2026-003",
      organizationId: organization.id,
      locationId: location.id,
      equipmentId: "eq_lavasto_01",
      title: "Manutenzione programmata addolcitore",
      description: "Controllo sale addolcitore e brillantante come da piano manutenzioni.",
      urgency: "bassa",
      status: "chiuso",
      warrantyCheck: "attiva",
      openedBy: "Operatore RistoCare",
      assignedOperatorId: "op_demo",
      assignedTechnicianId: "tec_02",
      quote: {
        internalCost: 40,
        margin: 20,
        customerPrice: 60,
        status: "accettato",
        validUntil: iso(-10),
      },
      attachments: [],
      events: [
        { id: "ev8", status: "nuovo", note: "Apertura da piano manutenzioni.", author: "Operatore RistoCare", createdAt: iso(-20) },
        { id: "ev9", status: "programmato", note: "Intervento programmato.", author: "Operatore RistoCare", createdAt: iso(-18) },
        { id: "ev10", status: "risolto", note: "Sale e brillantante rabboccati, ciclo test ok.", author: "GLG Cucine Pro", createdAt: iso(-15) },
        { id: "ev11", status: "chiuso", note: "Pratica archiviata. Prossima manutenzione tra 90gg.", author: "Operatore RistoCare", createdAt: iso(-15) },
      ],
      createdAt: iso(-20),
      updatedAt: iso(-15),
    },
  ];

  const referrals: Referral[] = [
    {
      id: "ref_01",
      partnerName: "Studio Caruso Commercialisti",
      partnerType: "Commercialista",
      phone: "+39 090 9988776",
      email: "info@studiocaruso.it",
      referredCompany: "Pasticceria Lo Re",
      referredContact: "Davide Lo Re",
      city: "Messina",
      notes: "Cliente interessato al censimento attrezzature.",
      status: "in_trattativa",
      planSold: null,
      rewardAmount: 100,
      rewardStatus: "in_attesa",
      createdAt: iso(-9),
    },
    {
      id: "ref_02",
      partnerName: "Caffè Sud Distribuzione",
      partnerType: "Agente caffè",
      phone: "+39 345 1122334",
      email: "agenti@caffesud.it",
      referredCompany: "Bar Centrale Milazzo",
      referredContact: "Rosa Pellegrino",
      city: "Milazzo",
      notes: "Già attivato piano Start.",
      status: "vinto",
      planSold: "start",
      rewardAmount: 50,
      rewardStatus: "pagato",
      createdAt: iso(-30),
    },
  ];

  return {
    organization,
    locations: [location],
    equipment,
    tickets,
    technicians,
    referrals,
    contacts: [],
  };
}

const globalForStore = globalThis as unknown as { __ristocareDemo?: DemoData };

function store(): DemoData {
  if (!globalForStore.__ristocareDemo) {
    globalForStore.__ristocareDemo = seed();
  }
  return globalForStore.__ristocareDemo;
}

// ---- Query ----

export function getOrganization(): Organization {
  return store().organization;
}

export function getLocations(): Location[] {
  return store().locations;
}

export function getEquipmentList(): Equipment[] {
  return store().equipment;
}

export function getEquipment(id: string): Equipment | undefined {
  return store().equipment.find((e) => e.id === id);
}

export function getEquipmentByToken(token: string): Equipment | undefined {
  return store().equipment.find((e) => e.qrToken === token);
}

export function getTickets(): Ticket[] {
  return [...store().tickets].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getTicket(id: string): Ticket | undefined {
  return store().tickets.find((t) => t.id === id);
}

export function getTicketsForEquipment(equipmentId: string): Ticket[] {
  return store().tickets.filter((t) => t.equipmentId === equipmentId);
}

export function getTechnicians(): Technician[] {
  return store().technicians;
}

export function getTechnician(id: string | null): Technician | undefined {
  if (!id) return undefined;
  return store().technicians.find((t) => t.id === id);
}

export function getReferrals(): Referral[] {
  return [...store().referrals].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getContacts(): ContactRequest[] {
  return store().contacts;
}

export function getLocationName(locationId: string): string {
  return store().locations.find((l) => l.id === locationId)?.name ?? "—";
}

// ---- Mutations ----

export function createTicket(input: CreateTicketInput): Ticket {
  const data = store();
  const equipment = getEquipment(input.equipmentId);
  if (!equipment) {
    throw new Error("Attrezzatura non trovata");
  }
  const now = new Date().toISOString();
  // Codice progressivo derivato dal numero di ticket nello store.
  const code = `RC-2026-${String(data.tickets.length + 1).padStart(3, "0")}`;
  const event: TicketEvent = {
    id: genId("ev"),
    status: "nuovo",
    note: "Ticket aperto.",
    author: input.openedBy,
    createdAt: now,
  };
  const ticket: Ticket = {
    id: genId("tk"),
    code,
    organizationId: data.organization.id,
    locationId: equipment.locationId,
    equipmentId: equipment.id,
    title: input.title,
    description: input.description,
    urgency: input.urgency,
    status: "nuovo",
    warrantyCheck: warrantyStatusFrom(equipment.warrantyEnd),
    openedBy: input.openedBy,
    assignedOperatorId: null,
    assignedTechnicianId: null,
    quote: null,
    attachments: [],
    events: [event],
    createdAt: now,
    updatedAt: now,
  };
  data.tickets.push(ticket);
  return ticket;
}

export function advanceTicket(id: string, status: TicketStatus, note: string, author = "Operatore RistoCare"): Ticket | undefined {
  const ticket = getTicket(id);
  if (!ticket) return undefined;
  const now = new Date().toISOString();
  ticket.status = status;
  ticket.updatedAt = now;
  ticket.events.push({ id: genId("ev"), status, note, author, createdAt: now });
  return ticket;
}

export function createReferral(input: CreateReferralInput): Referral {
  const data = store();
  const referral: Referral = {
    id: genId("ref"),
    partnerName: input.partnerName,
    partnerType: input.partnerType,
    phone: input.phone,
    email: input.email,
    referredCompany: input.referredCompany,
    referredContact: input.referredContact,
    city: input.city,
    notes: input.notes ?? "",
    status: "nuovo",
    planSold: null,
    rewardAmount: 0,
    rewardStatus: "in_attesa",
    createdAt: new Date().toISOString(),
  };
  data.referrals.push(referral);
  return referral;
}

export function createContact(input: CreateContactInput): ContactRequest {
  const data = store();
  const contact: ContactRequest = {
    id: genId("ct"),
    name: input.name,
    company: input.company,
    email: input.email,
    phone: input.phone,
    city: input.city,
    requestType: input.requestType,
    message: input.message ?? "",
    createdAt: new Date().toISOString(),
  };
  data.contacts.push(contact);
  return contact;
}
