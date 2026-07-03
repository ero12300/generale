import { NextResponse } from "next/server";
import { createBarberAppointment } from "@/lib/barber-demo";
import { parseBody } from "@/lib/validations/api";
import { createBarberAppointmentSchema } from "@/lib/validations/barber";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = parseBody(createBarberAppointmentSchema, body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const data = parsed.data;
  const result = createBarberAppointment({
    client_name: data.client_name,
    phone: data.phone,
    email: data.email || null,
    service_ids: data.service_ids,
    barber_name: data.barber_name,
    starts_at: data.starts_at,
    notes: data.notes ?? null,
    channel: data.channel,
    referral_code: data.referral_code || null,
  });

  return NextResponse.json(
    {
      success: true,
      appointment: result.appointment,
      client: result.client,
      message: "Prenotazione creata con successo",
    },
    { status: 201 }
  );
}
