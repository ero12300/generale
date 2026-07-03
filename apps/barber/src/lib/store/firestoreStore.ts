import { cert, getApps, initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore, type Firestore } from "firebase-admin/firestore";
import type {
  Booking,
  Campaign,
  Client,
  Sale,
  Service,
  Shop,
} from "../types";
import { generateReferralCode } from "../referral";
import type { DataStore } from "./types";

/**
 * Store Firebase Firestore (firebase-admin, lato server).
 * Attivo quando FIREBASE_SERVICE_ACCOUNT (JSON del service account) è configurata.
 *
 * Struttura: shops/{shopId}/{services|clients|bookings|sales|campaigns}/{id}
 */

const SHOP_ID = process.env.BARBERFLOW_SHOP_ID ?? "shop_default";

function getDb(): Firestore {
  if (getApps().length === 0) {
    const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
    if (!raw) throw new Error("FIREBASE_SERVICE_ACCOUNT non configurata");
    initializeApp({ credential: cert(JSON.parse(raw)) });
  }
  return getFirestore();
}

export class FirestoreStore implements DataStore {
  private get shopRef() {
    return getDb().collection("shops").doc(SHOP_ID);
  }

  async getShop(): Promise<Shop> {
    const snap = await this.shopRef.get();
    if (!snap.exists) {
      const shop: Shop = {
        id: SHOP_ID,
        name: process.env.BARBERFLOW_SHOP_NAME ?? "Il mio salone",
        plan: "base",
        createdAt: new Date().toISOString(),
      };
      await this.shopRef.set(shop);
      return shop;
    }
    return snap.data() as Shop;
  }

  async setPlan(
    plan: Shop["plan"],
    stripeIds?: { customerId?: string; subscriptionId?: string }
  ): Promise<Shop> {
    const update: Record<string, string> = { plan };
    if (stripeIds?.customerId) update.stripeCustomerId = stripeIds.customerId;
    if (stripeIds?.subscriptionId)
      update.stripeSubscriptionId = stripeIds.subscriptionId;
    await this.shopRef.set(update, { merge: true });
    return this.getShop();
  }

  async listServices(): Promise<Service[]> {
    const snap = await this.shopRef
      .collection("services")
      .where("active", "==", true)
      .get();
    return snap.docs.map((d) => d.data() as Service);
  }

  async listClients(): Promise<Client[]> {
    const snap = await this.shopRef
      .collection("clients")
      .orderBy("createdAt", "desc")
      .get();
    return snap.docs.map((d) => d.data() as Client);
  }

  async getClientByReferralCode(code: string): Promise<Client | null> {
    const snap = await this.shopRef
      .collection("clients")
      .where("referralCode", "==", code.trim().toUpperCase())
      .limit(1)
      .get();
    return snap.empty ? null : (snap.docs[0].data() as Client);
  }

  async createClient(
    input: Omit<Client, "id" | "createdAt" | "visits" | "totalSpentCents" | "referralCode"> & {
      referralCode?: string;
    }
  ): Promise<Client> {
    const ref = this.shopRef.collection("clients").doc();
    const client: Client = {
      ...input,
      id: ref.id,
      referralCode: input.referralCode ?? generateReferralCode(input.fullName),
      visits: 0,
      totalSpentCents: 0,
      createdAt: new Date().toISOString(),
    };
    await ref.set(client);
    return client;
  }

  async listBookings(): Promise<Booking[]> {
    const snap = await this.shopRef.collection("bookings").get();
    return snap.docs
      .map((d) => d.data() as Booking)
      .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
  }

  async createBooking(input: Omit<Booking, "id" | "createdAt">): Promise<Booking> {
    const ref = this.shopRef.collection("bookings").doc();
    const booking: Booking = {
      ...input,
      id: ref.id,
      createdAt: new Date().toISOString(),
    };
    await ref.set(booking);
    return booking;
  }

  async updateBookingStatus(
    bookingId: string,
    status: Booking["status"]
  ): Promise<Booking | null> {
    const ref = this.shopRef.collection("bookings").doc(bookingId);
    const snap = await ref.get();
    if (!snap.exists) return null;
    await ref.update({ status });
    return { ...(snap.data() as Booking), status };
  }

  async listSales(): Promise<Sale[]> {
    const snap = await this.shopRef
      .collection("sales")
      .orderBy("createdAt", "desc")
      .get();
    return snap.docs.map((d) => d.data() as Sale);
  }

  async createSale(input: Omit<Sale, "id" | "createdAt">): Promise<Sale> {
    const ref = this.shopRef.collection("sales").doc();
    const sale: Sale = {
      ...input,
      id: ref.id,
      createdAt: new Date().toISOString(),
    };
    await ref.set(sale);
    return sale;
  }

  async listCampaigns(): Promise<Campaign[]> {
    const snap = await this.shopRef.collection("campaigns").get();
    return snap.docs.map((d) => d.data() as Campaign);
  }

  async createCampaign(
    input: Omit<Campaign, "id" | "createdAt" | "redemptions">
  ): Promise<Campaign> {
    const ref = this.shopRef.collection("campaigns").doc();
    const campaign: Campaign = {
      ...input,
      id: ref.id,
      redemptions: 0,
      createdAt: new Date().toISOString(),
    };
    await ref.set(campaign);
    return campaign;
  }

  async toggleCampaign(campaignId: string, active: boolean): Promise<Campaign | null> {
    const ref = this.shopRef.collection("campaigns").doc(campaignId);
    const snap = await ref.get();
    if (!snap.exists) return null;
    await ref.update({ active });
    return { ...(snap.data() as Campaign), active };
  }

  async incrementCampaignRedemptions(campaignId: string): Promise<void> {
    await this.shopRef
      .collection("campaigns")
      .doc(campaignId)
      .update({ redemptions: FieldValue.increment(1) });
  }

  async recordClientVisit(clientId: string, spentCents: number): Promise<void> {
    await this.shopRef.collection("clients").doc(clientId).update({
      visits: FieldValue.increment(1),
      totalSpentCents: FieldValue.increment(spentCents),
    });
  }
}
