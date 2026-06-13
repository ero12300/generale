import type { TicketStatus } from "@ristocare/types";
import { repository } from "@/lib/data/repository";
import { jsonError, jsonOk } from "@/lib/api-response";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = (await request.json()) as { status: TicketStatus; internal_notes?: string };
  const updated = repository.updateTicketStatus(id, body.status, body.internal_notes);
  if (!updated) return jsonError("Ticket non trovato", 404);
  return jsonOk(updated);
}
