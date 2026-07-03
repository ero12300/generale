import { NextResponse } from "next/server";
import { createBarberBooking, getBarberDashboard } from "@/lib/barber/repository";
import { validationError } from "@/lib/api-response";
import { parseBody } from "@/lib/validations/api";
import { createBarberBookingSchema } from "@/lib/validations/barber";

export async function GET() {
  const dashboard = await getBarberDashboard();
  return NextResponse.json({ bookings: dashboard.bookings });
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = parseBody(createBarberBookingSchema, body);
  if (!parsed.success) return validationError(parsed.error);

  const booking = await createBarberBooking(parsed.data);
  return NextResponse.json({ booking }, { status: 201 });
}
