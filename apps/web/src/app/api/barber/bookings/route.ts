import { NextResponse } from "next/server";
import { withBarberRepository } from "@/lib/barber/api-repository";
import { validationError } from "@/lib/api-response";
import { parseBody } from "@/lib/validations/api";
import { createBarberBookingSchema } from "@/lib/validations/barber";

export async function GET() {
  return withBarberRepository(async (repo) => {
    const bookings = await repo.listBookings();
    return NextResponse.json(bookings);
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = parseBody(createBarberBookingSchema, body);
  if (!parsed.success) return validationError(parsed.error);

  return withBarberRepository(async (repo) => {
    const booking = await repo.createBooking(parsed.data);
    return NextResponse.json(booking, { status: 201 });
  });
}
