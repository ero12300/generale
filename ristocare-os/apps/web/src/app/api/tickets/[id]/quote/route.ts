import { getRepository, getSupabaseClient } from "@/lib/auth/session";
import { quoteFormSchema } from "@/lib/validations/api";
import { generateQuotePdf } from "@/lib/pdf/generate";
import { uploadPdf } from "@/lib/storage/upload";
import { formatCurrency } from "@/lib/utils";
import { sendEmail, quoteSentEmail } from "@/lib/email/resend";
import { jsonError, jsonOk } from "@/lib/api-response";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const parsed = quoteFormSchema.safeParse({ ...body, ticket_id: id });
  if (!parsed.success) return jsonError("Dati preventivo non validi");

  const repo = await getRepository();
  const quote = await repo.createQuote({
    ticket_id: id,
    internal_cost: parsed.data.internal_cost,
    margin: parsed.data.margin,
  });

  const ticket = await repo.getTicket(id);
  const org = ticket ? await repo.getOrganization(ticket.organization_id) : undefined;

  if (ticket && org) {
    try {
      const supabase = await getSupabaseClient();
      const pdfBytes = await generateQuotePdf({ quote, ticket, organization: org });
      const pdfUrl = await uploadPdf(supabase, "quotes-pdf", `${org.id}/${quote.id}.pdf`, pdfBytes);
      await repo.updateQuotePdf(quote.id, pdfUrl);
    } catch (err) {
      console.error("[quote-pdf]", err);
    }

    if (org.billing_email) {
      const tpl = quoteSentEmail(formatCurrency(quote.customer_price), ticket.title);
      await sendEmail({ to: org.billing_email, ...tpl });
    }
  }

  return jsonOk(quote, 201);
}
