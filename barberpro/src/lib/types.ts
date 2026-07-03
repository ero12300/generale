// Modello dati condiviso di BarberPro.
// Gli importi monetari sono SEMPRE in centesimi (interi) per evitare errori con i float.

export type PlanId = "free" | "pro";

export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled" | "no_show";

export type PaymentMethod = "cash" | "card" | "transfer" | "other";

export type CampaignType = "discount" | "referral";

export interface Service {
  id: string;
  name: string;
  description?: string;
  /** Prezzo in centesimi. Es. 2500 = 25,00 € */
  priceCents: number;
  durationMin: number;
  active: boolean;
  createdAt: string;
}

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
  notes?: string;
  /** Codice referral univoco per la campagna "porta un amico" */
  referralCode: string;
  /** id del cliente che ha invitato questo cliente */
  referredBy?: string;
  createdAt: string;
}

export interface Booking {
  id: string;
  clientId?: string;
  /** Nome cliente "denormalizzato" per prenotazioni pubbliche senza account */
  clientName: string;
  clientPhone?: string;
  serviceId: string;
  serviceName: string;
  priceCents: number;
  /** ISO datetime dell'appuntamento */
  start: string;
  durationMin: number;
  status: BookingStatus;
  notes?: string;
  source: "public" | "internal";
  createdAt: string;
}

export interface Payment {
  id: string;
  bookingId?: string;
  clientId?: string;
  clientName?: string;
  description: string;
  /** Importo lordo in centesimi */
  amountCents: number;
  /** Sconto applicato in centesimi */
  discountCents: number;
  method: PaymentMethod;
  /** ISO date */
  date: string;
  createdAt: string;
}

export interface Campaign {
  id: string;
  name: string;
  type: CampaignType;
  active: boolean;
  /** Percentuale di sconto 0-100 (per tipo "discount" e bonus referral) */
  discountPct: number;
  code?: string;
  description?: string;
  createdAt: string;
}

export interface ShopSettings {
  shopName: string;
  ownerName: string;
  address?: string;
  phone?: string;
  /** Orario di apertura in formato HH:mm */
  openTime: string;
  closeTime: string;
  /** Giorni lavorativi: 0 = domenica ... 6 = sabato */
  workingDays: number[];
  slotStepMin: number;
  plan: PlanId;
}

export interface WorkspaceData {
  services: Service[];
  clients: Client[];
  bookings: Booking[];
  payments: Payment[];
  campaigns: Campaign[];
  settings: ShopSettings;
}

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  isDemo: boolean;
}
