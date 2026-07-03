import { store } from "@/lib/store";
import { notFoundError, ok, parseBody, validationError } from "@/lib/api-response";
import { updateBookingSchema } from "@/lib/validations";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const parsed = parseBody(updateBookingSchema, body);
  if (!parsed.success) return validationError(parsed.error);

  const booking = store.setBookingStatus(id, parsed.data.status);
  if (!booking) return notFoundError("Prenotazione non trovata");
  return ok(booking);
}
