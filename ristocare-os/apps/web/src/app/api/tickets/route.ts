import { repository } from "@/lib/data/repository";
import { demoStore } from "@/lib/demo-store";
import { createTicketSchema } from "@/lib/validations/api";
import { jsonError, jsonOk } from "@/lib/api-response";

export async function GET() {
  const orgId = demoStore.orgId;
  return jsonOk(repository.listTickets(orgId));
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = createTicketSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.errors[0]?.message ?? "Dati non validi");
  }

  const location = repository.listLocations(demoStore.orgId)[0];
  if (!location) return jsonError("Locale non trovato", 404);

  const ticket = repository.createTicket(demoStore.orgId, location.id, parsed.data);
  return jsonOk(ticket, 201);
}
