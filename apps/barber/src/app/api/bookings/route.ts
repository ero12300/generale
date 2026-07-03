import { store } from "@/lib/store";
import { ok, parseBody, validationError } from "@/lib/api-response";
import { createBookingSchema } from "@/lib/validations";

export async function GET() {
  return ok(store.listBookings());
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = parseBody(createBookingSchema, body);
  if (!parsed.success) return validationError(parsed.error);

  const { booking, error } = store.createBooking({
    clientId: parsed.data.clientId || null,
    clientName: parsed.data.clientName,
    clientPhone: parsed.data.clientPhone,
    serviceId: parsed.data.serviceId,
    staffId: parsed.data.staffId || null,
    start: parsed.data.start,
    source: parsed.data.source ?? "interno",
    notes: parsed.data.notes || null,
  });
  if (error) return validationError(error);
  return ok(booking, 201);
}
