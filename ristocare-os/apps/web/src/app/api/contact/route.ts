import { contactFormSchema } from "@/lib/validations/api";
import { sendEmail, contactReceivedEmail } from "@/lib/email/resend";
import { jsonError, jsonOk } from "@/lib/api-response";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = contactFormSchema.safeParse(body);
  if (!parsed.success) return jsonError(parsed.error.errors[0]?.message ?? "Dati non validi");

  const notify = process.env.CONTACT_NOTIFY_EMAIL;
  if (notify) {
    const tpl = contactReceivedEmail(parsed.data.name, parsed.data.request_type);
    await sendEmail({ to: notify, ...tpl });
  }

  return jsonOk({ received: true }, 201);
}
