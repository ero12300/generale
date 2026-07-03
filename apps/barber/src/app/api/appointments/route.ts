import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getStore } from "@/lib/store";
import { handleRouteError, jsonError } from "@/lib/api-helpers";

export async function GET(request: NextRequest) {
  try {
    const date = request.nextUrl.searchParams.get("date") ?? undefined;
    const store = await getStore();
    const appointments = await store.listAppointments(date);
    return NextResponse.json({ appointments });
  } catch (error) {
    return handleRouteError(error);
  }
}

const patchSchema = z.object({
  id: z.string().min(1),
  status: z.enum(["in_attesa", "confermato", "completato", "annullato"]),
  /** Se presente con status=completato registra anche l'incasso */
  paymentMethod: z.enum(["contanti", "carta", "satispay"]).optional(),
});

export async function PATCH(request: NextRequest) {
  try {
    const input = patchSchema.parse(await request.json());
    const store = await getStore();
    const appointment = await store.updateAppointmentStatus(
      input.id,
      input.status,
    );
    if (!appointment) return jsonError("Appuntamento non trovato", 404);

    let payment = null;
    if (input.status === "completato" && input.paymentMethod) {
      payment = await store.createPayment({
        appointmentId: appointment.id,
        clientName: appointment.clientName,
        serviceName: appointment.serviceName,
        amountCents: appointment.priceCents - appointment.discountCents,
        method: input.paymentMethod,
        date: appointment.date,
      });
    }
    return NextResponse.json({ appointment, payment });
  } catch (error) {
    return handleRouteError(error);
  }
}
