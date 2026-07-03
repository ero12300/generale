import { NextResponse } from "next/server";
import { notFoundError, validationError } from "@/lib/api-response";
import { withBarberRepository } from "@/lib/barber/api-repository";
import { parseBody } from "@/lib/validations/api";
import { updateBookingStatusSchema } from "@/lib/validations/barber";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const body = await request.json();
  const parsed = parseBody(updateBookingStatusSchema, body);
  if (!parsed.success) return validationError(parsed.error);

  const { id } = await context.params;
  return withBarberRepository(async (repo) => {
    const updated = await repo.updateBookingStatus(id, parsed.data.status);
    if (!updated) return notFoundError("Prenotazione non trovata");
    return NextResponse.json(updated);
  });
}
