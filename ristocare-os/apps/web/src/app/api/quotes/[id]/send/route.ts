import { getRepository, getSupabaseClient } from "@/lib/auth/session";
import { generateQuotePdf } from "@/lib/pdf/generate";
import { uploadPdf } from "@/lib/storage/upload";
import { formatCurrency } from "@/lib/utils";
import { sendEmail, quoteSentEmail } from "@/lib/email/resend";
import { jsonError, jsonOk } from "@/lib/api-response";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const repo = await getRepository();
  const quotes = await repo.listQuotes();
  const draft = quotes.find((q) => q.id === id) ?? quotes.find((q) => q.status === "draft");
  if (!draft) return jsonError("Preventivo non trovato", 404);

  const sent = await repo.sendQuote(draft.id);
  if (!sent) return jsonError("Invio fallito", 500);

  const ticket = await repo.getTicket(sent.ticket_id);
  const org = ticket ? await repo.getOrganization(ticket.organization_id) : undefined;

  if (ticket && org && !sent.pdf_url) {
    try {
      const supabase = await getSupabaseClient();
      const pdfBytes = await generateQuotePdf({ quote: sent, ticket, organization: org });
      const pdfUrl = await uploadPdf(supabase, "quotes-pdf", `${org.id}/${sent.id}.pdf`, pdfBytes);
      await repo.updateQuotePdf(sent.id, pdfUrl);
    } catch (err) {
      console.error("[quote-pdf-send]", err);
    }
  }

  if (org?.billing_email && ticket) {
    const tpl = quoteSentEmail(formatCurrency(sent.customer_price), ticket.title);
    await sendEmail({ to: org.billing_email, ...tpl });
  }

  return jsonOk(sent);
}
