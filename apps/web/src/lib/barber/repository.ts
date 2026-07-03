"use client";

import {
  addDoc,
  collection,
  doc,
  getDocs,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { getFirebaseDb, isFirebaseConfigured } from "@/lib/barber/firebase";
import {
  generateEntityId,
  readBarberStorage,
  writeBarberStorage,
} from "@/lib/barber/demo-store";
import {
  BarberBooking,
  BarberCampaign,
  BarberClient,
  BarberDataState,
  BarberPayment,
  BookingStatus,
  CampaignType,
  SubscriptionTier,
} from "@/lib/barber/types";

type RootCollection = "bookings" | "clients" | "payments" | "campaigns";

function timestampToIso(value: unknown): string {
  if (value instanceof Timestamp) return value.toDate().toISOString();
  if (typeof value === "string") return value;
  return new Date().toISOString();
}

async function listCollection<T>(name: RootCollection): Promise<T[]> {
  const db = getFirebaseDb();
  if (!db) return [];
  const snapshot = await getDocs(collection(db, "barberos", "default", name));
  return snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() }) as T);
}

async function saveCollectionEntity<T extends { id: string }>(
  name: RootCollection,
  payload: T
): Promise<void> {
  const db = getFirebaseDb();
  if (!db) return;
  await setDoc(doc(db, "barberos", "default", name, payload.id), payload);
}

export async function listBarberData(): Promise<BarberDataState> {
  if (!isFirebaseConfigured()) {
    return readBarberStorage();
  }

  const [bookings, clients, payments, campaigns] = await Promise.all([
    listCollection<BarberBooking>("bookings"),
    listCollection<BarberClient>("clients"),
    listCollection<BarberPayment>("payments"),
    listCollection<BarberCampaign>("campaigns"),
  ]);

  return {
    subscriptionTier: "basic",
    bookings: bookings.map((booking) => ({
      ...booking,
      startsAtIso: timestampToIso(booking.startsAtIso),
    })),
    clients: clients.map((client) => ({
      ...client,
      lastVisitIso: client.lastVisitIso ? timestampToIso(client.lastVisitIso) : null,
    })),
    payments: payments.map((payment) => ({
      ...payment,
      createdAtIso: timestampToIso(payment.createdAtIso),
    })),
    campaigns: campaigns.map((campaign) => ({
      ...campaign,
      createdAtIso: timestampToIso(campaign.createdAtIso),
    })),
  };
}

export async function createBooking(input: {
  clientName: string;
  clientPhone: string;
  serviceName: string;
  startsAtIso: string;
  source: "internal" | "public";
}): Promise<BarberBooking> {
  const booking: BarberBooking = {
    id: generateEntityId("booking"),
    clientName: input.clientName,
    clientPhone: input.clientPhone,
    serviceName: input.serviceName,
    startsAtIso: input.startsAtIso,
    status: "new",
    source: input.source,
  };

  if (isFirebaseConfigured()) {
    await saveCollectionEntity("bookings", booking);
    return booking;
  }

  const state = readBarberStorage();
  state.bookings = [booking, ...state.bookings];
  writeBarberStorage(state);
  return booking;
}

export async function updateBookingStatus(
  bookingId: string,
  status: BookingStatus
): Promise<void> {
  if (isFirebaseConfigured()) {
    const db = getFirebaseDb();
    if (!db) return;
    const bookingRef = doc(db, "barberos", "default", "bookings", bookingId);
    await setDoc(bookingRef, { status }, { merge: true });
    return;
  }

  const state = readBarberStorage();
  state.bookings = state.bookings.map((entry) =>
    entry.id === bookingId ? { ...entry, status } : entry
  );
  writeBarberStorage(state);
}

export async function createClient(input: {
  fullName: string;
  phone: string;
  email: string;
  notes: string;
}): Promise<BarberClient> {
  const client: BarberClient = {
    id: generateEntityId("client"),
    fullName: input.fullName,
    phone: input.phone,
    email: input.email,
    visits: 0,
    lastVisitIso: null,
    referredByClientId: null,
    notes: input.notes,
  };

  if (isFirebaseConfigured()) {
    await saveCollectionEntity("clients", client);
    return client;
  }

  const state = readBarberStorage();
  state.clients = [client, ...state.clients];
  writeBarberStorage(state);
  return client;
}

export async function createPayment(input: {
  amountCents: number;
  method: "cash" | "card" | "bank_transfer";
  note: string;
}): Promise<BarberPayment> {
  const payment: BarberPayment = {
    id: generateEntityId("payment"),
    amountCents: input.amountCents,
    method: input.method,
    bookingId: null,
    note: input.note,
    createdAtIso: new Date().toISOString(),
  };

  if (isFirebaseConfigured()) {
    await saveCollectionEntity("payments", payment);
    return payment;
  }

  const state = readBarberStorage();
  state.payments = [payment, ...state.payments];
  writeBarberStorage(state);
  return payment;
}

export async function createCampaign(input: {
  title: string;
  type: CampaignType;
  incentiveText: string;
}): Promise<BarberCampaign> {
  const campaign: BarberCampaign = {
    id: generateEntityId("campaign"),
    title: input.title,
    type: input.type,
    incentiveText: input.incentiveText,
    active: true,
    createdAtIso: new Date().toISOString(),
  };

  if (isFirebaseConfigured()) {
    await saveCollectionEntity("campaigns", campaign);
    return campaign;
  }

  const state = readBarberStorage();
  state.campaigns = [campaign, ...state.campaigns];
  writeBarberStorage(state);
  return campaign;
}

export async function promoteSubscriptionTier(tier: SubscriptionTier): Promise<void> {
  if (isFirebaseConfigured()) {
    const db = getFirebaseDb();
    if (!db) return;
    await addDoc(collection(db, "barberos", "default", "events"), {
      type: "subscription_change",
      tier,
      createdAtIso: new Date().toISOString(),
    });
    return;
  }

  const state = readBarberStorage();
  state.subscriptionTier = tier;
  writeBarberStorage(state);
}
