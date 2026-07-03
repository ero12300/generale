import { NextResponse } from "next/server";
import { z } from "zod";
import { createBooking, listBookings, listServices } from "@/lib/data/repo";
import { addMinutes } from "@/lib/utils";

export async function GET() {
  const bookings = await listBookings();
  return NextResponse.json({ bookings });
}

const bodySchema = z.object({
  clientId: z.string().min(1),
  serviceId: z.string().min(1),
  staffId: z.string().min(1),
  startAt: z.string().min(1),
  notes: z.string().optional(),
});

export async function POST(req: Request) {
  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const services = await listServices();
  const svc = services.find((s) => s.id === parsed.data.serviceId);
  if (!svc) return NextResponse.json({ error: "Servizio non trovato" }, { status: 404 });
  const start = new Date(parsed.data.startAt);
  const end = addMinutes(start, svc.durationMin);
  const created = await createBooking({
    shopId: "demo-shop",
    clientId: parsed.data.clientId,
    staffId: parsed.data.staffId,
    serviceId: parsed.data.serviceId,
    startAt: start.toISOString(),
    endAt: end.toISOString(),
    status: "confirmed",
    priceCents: svc.priceCents,
    notes: parsed.data.notes,
    createdAt: new Date().toISOString(),
    source: "internal",
  });
  return NextResponse.json({ booking: created }, { status: 201 });
}
