import type { TicketStatus } from "@ristocare/types";
import { getRepository } from "@/lib/auth/session";
import { jsonError, jsonOk } from "@/lib/api-response";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = (await request.json()) as { status: TicketStatus; internal_notes?: string };
  const repo = await getRepository();
  const updated = await repo.updateTicketStatus(id, body.status, body.internal_notes);
  if (!updated) return jsonError("Ticket non trovato", 404);
  return jsonOk(updated);
}
