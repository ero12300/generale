import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getStore } from "@/lib/store";
import { availableSlots } from "@/lib/slots";
import { handleRouteError, jsonError } from "@/lib/api-helpers";

const querySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  serviceId: z.string().min(1),
  barberId: z.string().min(1),
});

export async function GET(request: NextRequest) {
  try {
    const params = querySchema.parse(
      Object.fromEntries(request.nextUrl.searchParams),
    );
    const store = await getStore();
    const [services, settings, appointments] = await Promise.all([
      store.listServices(),
      store.getSettings(),
      store.listAppointments(params.date),
    ]);
    const service = services.find((s) => s.id === params.serviceId);
    if (!service) return jsonError("Servizio non trovato", 404);

    const slots = availableSlots(
      params.date,
      service.durationMin,
      params.barberId,
      appointments,
      settings,
    );
    return NextResponse.json({ slots });
  } catch (error) {
    return handleRouteError(error);
  }
}
