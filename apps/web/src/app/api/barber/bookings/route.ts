import { NextResponse } from "next/server";
import { validationError } from "@/lib/api-response";
import { getBarberRepository } from "@/lib/barber/repository";
import { createBarberBookingSchema, parseBody } from "@/lib/validations/api";

export async function GET() {
  const repo = await getBarberRepository();
  return NextResponse.json(await repo.listBookings());
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = parseBody(createBarberBookingSchema, body);
  if (!parsed.success) return validationError(parsed.error);

  try {
    const repo = await getBarberRepository();
    const booking = await repo.createBooking(parsed.data);
    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Impossibile creare la prenotazione";
    return validationError(message);
  }
}
