import { NextResponse } from "next/server";
import { z } from "zod";
import { getBarberRepository } from "@/lib/barber/repository";

const createAppointmentSchema = z.object({
  customerName: z.string().min(2).max(80),
  serviceName: z.string().min(2).max(120),
  startsAt: z.string().datetime(),
  durationMinutes: z.number().int().min(10).max(240),
  priceCents: z.number().int().min(500).max(50000),
});

export async function GET() {
  const repository = getBarberRepository();
  const appointments = await repository.listAppointments();
  return NextResponse.json({ data: appointments });
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = createAppointmentSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Input non valido", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const repository = getBarberRepository();
  const appointment = await repository.createAppointment(parsed.data);

  return NextResponse.json({ data: appointment }, { status: 201 });
}
