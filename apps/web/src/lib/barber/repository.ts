import type {
  AuthContext,
  BarberBooking,
  BarberBookingStatus,
  BarberCampaign,
  BarberClient,
  BarberDashboardOverview,
  BarberPayment,
  BarberService,
  BarberSubscription,
  CreateBarberBookingInput,
  CreateBarberCampaignInput,
  CreateBarberClientInput,
  CreateBarberPaymentInput,
} from "@deal-desk/types";

export interface BarberRepository {
  readonly context: AuthContext;

  getOverview(): Promise<BarberDashboardOverview>;
  listServices(): Promise<BarberService[]>;
  listClients(): Promise<BarberClient[]>;
  createClient(input: CreateBarberClientInput): Promise<BarberClient>;
  listBookings(): Promise<BarberBooking[]>;
  createBooking(input: CreateBarberBookingInput): Promise<BarberBooking>;
  updateBookingStatus(id: string, status: BarberBookingStatus): Promise<BarberBooking | null>;
  listPayments(): Promise<BarberPayment[]>;
  createPayment(input: CreateBarberPaymentInput): Promise<BarberPayment>;
  listCampaigns(): Promise<BarberCampaign[]>;
  createCampaign(input: CreateBarberCampaignInput): Promise<BarberCampaign>;
  getSubscription(): Promise<BarberSubscription>;
}
