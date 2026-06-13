import { getRepository, getSession } from "@/lib/auth/session";
import { demoStore } from "@/lib/demo-store";
import { createTicketSchema } from "@/lib/validations/api";
import { sendEmail, ticketOpenedEmail } from "@/lib/email/resend";
import { jsonError, jsonOk } from "@/lib/api-response";

export async function GET() {
  const session = await getSession();
  const repo = await getRepository();
  const orgId = session.orgId ?? demoStore.orgId;
  return jsonOk(await repo.listTickets(orgId));
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = createTicketSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.errors[0]?.message ?? "Dati non validi");
  }

  const session = await getSession();
  const repo = await getRepository();
  const orgId = session.orgId ?? demoStore.orgId;
  const locations = await repo.listLocations(orgId);
  const location = locations[0];
  if (!location) return jsonError("Locale non trovato", 404);

  const ticket = await repo.createTicket(orgId, location.id, parsed.data);
  const org = await repo.getOrganization(orgId);

  if (org?.billing_email) {
    const tpl = ticketOpenedEmail(ticket.title, org.name);
    await sendEmail({ to: org.billing_email, ...tpl });
  }

  return jsonOk(ticket, 201);
}
