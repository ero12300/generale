import { getRepository } from "@/lib/auth/session";
import { jsonError, jsonOk } from "@/lib/api-response";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = (await request.json()) as {
    technician_id: string;
    internal_price: number;
    availability: string;
    notes?: string;
  };

  const repo = await getRepository();
  const ticket = await repo.getTicket(id);
  if (!ticket) return jsonError("Ticket non trovato", 404);

  await repo.createTechnicianRequest({
    ticket_id: id,
    technician_id: body.technician_id,
    internal_price: body.internal_price,
    availability: body.availability,
    notes: body.notes,
  });
  await repo.assignTechnician(id, body.technician_id);
  return jsonOk(await repo.getTicket(id));
}
