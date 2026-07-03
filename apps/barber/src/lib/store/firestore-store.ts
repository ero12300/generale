import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import type {
  Appointment,
  AppointmentStatus,
  Barber,
  Campaign,
  Client,
  Payment,
  Service,
  ShopSettings,
} from "../types";
import type { DataStore } from "./interface";
import { referralCodeFor, SEED_BARBERS, SEED_SERVICES, SEED_SETTINGS } from "./demo-seed";

function getApp(): App {
  const existing = getApps();
  if (existing.length > 0) return existing[0];
  return initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // Le chiavi incollate nelle env Vercel contengono \n letterali
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

/**
 * Store di produzione su Firebase Firestore (firebase-admin, lato server).
 * Attivo quando FIREBASE_PROJECT_ID / CLIENT_EMAIL / PRIVATE_KEY sono configurate.
 */
export class FirestoreStore implements DataStore {
  private db: Firestore;

  constructor() {
    this.db = getFirestore(getApp());
  }

  async listServices(): Promise<Service[]> {
    const snap = await this.db.collection("services").get();
    if (snap.empty) return SEED_SERVICES;
    return snap.docs.map((d) => ({ ...(d.data() as Service), id: d.id }));
  }

  async listBarbers(): Promise<Barber[]> {
    const snap = await this.db.collection("barbers").get();
    if (snap.empty) return SEED_BARBERS;
    return snap.docs.map((d) => ({ ...(d.data() as Barber), id: d.id }));
  }

  async getSettings(): Promise<ShopSettings> {
    const doc = await this.db.collection("settings").doc("shop").get();
    if (!doc.exists) {
      await this.db.collection("settings").doc("shop").set(SEED_SETTINGS);
      return { ...SEED_SETTINGS };
    }
    return doc.data() as ShopSettings;
  }

  async updateSettings(patch: Partial<ShopSettings>): Promise<ShopSettings> {
    const ref = this.db.collection("settings").doc("shop");
    await ref.set(patch, { merge: true });
    return (await ref.get()).data() as ShopSettings;
  }

  async listClients(): Promise<Client[]> {
    const snap = await this.db
      .collection("clients")
      .orderBy("createdAt", "desc")
      .get();
    return snap.docs.map((d) => ({ ...(d.data() as Client), id: d.id }));
  }

  async createClient(
    input: Omit<Client, "id" | "createdAt" | "referralCode">,
  ): Promise<Client> {
    const data = {
      ...input,
      createdAt: new Date().toISOString(),
      referralCode: referralCodeFor(input.name, Math.random),
    };
    const ref = await this.db.collection("clients").add(data);
    return { ...data, id: ref.id };
  }

  async findClientByPhone(phone: string): Promise<Client | null> {
    const clients = await this.listClients();
    const normalized = phone.replace(/\s/g, "");
    return clients.find((c) => c.phone.replace(/\s/g, "") === normalized) ?? null;
  }

  async findClientByReferralCode(code: string): Promise<Client | null> {
    const snap = await this.db
      .collection("clients")
      .where("referralCode", "==", code.trim().toUpperCase())
      .limit(1)
      .get();
    if (snap.empty) return null;
    const d = snap.docs[0];
    return { ...(d.data() as Client), id: d.id };
  }

  async listAppointments(date?: string): Promise<Appointment[]> {
    let query: FirebaseFirestore.Query = this.db.collection("appointments");
    if (date) query = query.where("date", "==", date);
    const snap = await query.get();
    return snap.docs
      .map((d) => ({ ...(d.data() as Appointment), id: d.id }))
      .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
  }

  async createAppointment(
    input: Omit<Appointment, "id" | "createdAt" | "status">,
  ): Promise<Appointment> {
    const data = {
      ...input,
      status: "in_attesa" as const,
      createdAt: new Date().toISOString(),
    };
    const ref = await this.db.collection("appointments").add(data);
    return { ...data, id: ref.id };
  }

  async updateAppointmentStatus(
    id: string,
    status: AppointmentStatus,
  ): Promise<Appointment | null> {
    const ref = this.db.collection("appointments").doc(id);
    const doc = await ref.get();
    if (!doc.exists) return null;
    await ref.update({ status });
    return { ...(doc.data() as Appointment), id, status };
  }

  async listPayments(): Promise<Payment[]> {
    const snap = await this.db
      .collection("payments")
      .orderBy("createdAt", "desc")
      .get();
    return snap.docs.map((d) => ({ ...(d.data() as Payment), id: d.id }));
  }

  async createPayment(input: Omit<Payment, "id" | "createdAt">): Promise<Payment> {
    const data = { ...input, createdAt: new Date().toISOString() };
    const ref = await this.db.collection("payments").add(data);
    return { ...data, id: ref.id };
  }

  async listCampaigns(): Promise<Campaign[]> {
    const snap = await this.db
      .collection("campaigns")
      .orderBy("createdAt", "desc")
      .get();
    return snap.docs.map((d) => ({ ...(d.data() as Campaign), id: d.id }));
  }

  async createCampaign(
    input: Omit<Campaign, "id" | "createdAt" | "usageCount">,
  ): Promise<Campaign> {
    const data = {
      ...input,
      code: input.code.trim().toUpperCase(),
      usageCount: 0,
      createdAt: new Date().toISOString(),
    };
    const ref = await this.db.collection("campaigns").add(data);
    return { ...data, id: ref.id };
  }

  async updateCampaign(
    id: string,
    patch: Partial<Pick<Campaign, "active">>,
  ): Promise<Campaign | null> {
    const ref = this.db.collection("campaigns").doc(id);
    const doc = await ref.get();
    if (!doc.exists) return null;
    await ref.update(patch);
    return { ...(doc.data() as Campaign), ...patch, id };
  }

  async findActiveCampaignByCode(code: string): Promise<Campaign | null> {
    const snap = await this.db
      .collection("campaigns")
      .where("code", "==", code.trim().toUpperCase())
      .where("active", "==", true)
      .limit(1)
      .get();
    if (snap.empty) return null;
    const d = snap.docs[0];
    const campaign = { ...(d.data() as Campaign), id: d.id };
    if (
      campaign.validUntil &&
      campaign.validUntil < new Date().toISOString().slice(0, 10)
    ) {
      return null;
    }
    return campaign;
  }

  async incrementCampaignUsage(id: string): Promise<void> {
    const ref = this.db.collection("campaigns").doc(id);
    await this.db.runTransaction(async (tx) => {
      const doc = await tx.get(ref);
      if (!doc.exists) return;
      tx.update(ref, { usageCount: ((doc.data() as Campaign).usageCount ?? 0) + 1 });
    });
  }
}
