import { contactFormSchema } from "@/lib/validations/api";
import { jsonError, jsonOk } from "@/lib/api-response";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = contactFormSchema.safeParse(body);
  if (!parsed.success) return jsonError(parsed.error.errors[0]?.message ?? "Dati non validi");
  // In produzione: invio email via Resend/Brevo
  return jsonOk({ received: true }, 201);
}
