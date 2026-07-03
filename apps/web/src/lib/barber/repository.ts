"use client";

import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { barberCollections, bookingLeadSchema, type BookingLeadInput } from "@/lib/barber/schemas";
import { getFirestoreDb } from "@/lib/firebase/client";

type SaveBookingResult = {
  id: string;
  mode: "firebase" | "demo";
};

const demoStorageKey = "barber_os_booking_leads";

function readDemoBookings(raw: string | null) {
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function saveBookingLead(input: BookingLeadInput): Promise<SaveBookingResult> {
  const booking = bookingLeadSchema.parse(input);
  const db = getFirestoreDb();

  if (db) {
    const doc = await addDoc(collection(db, barberCollections.bookings), {
      ...booking,
      email: booking.email || null,
      referralCode: booking.referralCode || null,
      status: "requested",
      source: "public_booking",
      createdAt: serverTimestamp(),
    });
    return { id: doc.id, mode: "firebase" };
  }

  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `demo-${Date.now()}`;

  if (typeof window !== "undefined") {
    const raw = window.localStorage.getItem(demoStorageKey);
    const current = readDemoBookings(raw);
    window.localStorage.setItem(
      demoStorageKey,
      JSON.stringify([
        ...current,
        {
          id,
          ...booking,
          status: "requested",
          createdAt: new Date().toISOString(),
        },
      ])
    );
  }

  return { id, mode: "demo" };
}
