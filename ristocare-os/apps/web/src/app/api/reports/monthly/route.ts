import { getRepository, getSession, getSupabaseClient } from "@/lib/auth/session";
import { demoStore } from "@/lib/demo-store";
import { generateMonthlyReportPdf } from "@/lib/pdf/generate";
import { uploadPdf } from "@/lib/storage/upload";
import { jsonError, jsonOk } from "@/lib/api-response";

export async function GET() {
  const session = await getSession();
  const orgId = session.orgId ?? demoStore.orgId;
  const repo = await getRepository();
  const org = await repo.getOrganization(orgId);
  if (!org) return jsonError("Organizzazione non trovata", 404);

  const equipment = await repo.listEquipment(orgId);
  const tickets = await repo.listTickets(orgId);
  const stats = await repo.getCustomerStats(orgId);

  const pdfBytes = await generateMonthlyReportPdf({
    organization: org,
    equipmentCount: equipment.length,
    openTickets: stats.open_tickets,
    closedTickets: tickets.filter((t) => t.status === "closed").length,
    expiringWarranties: stats.expiring_warranties,
  });

  try {
    const supabase = await getSupabaseClient();
    const url = await uploadPdf(
      supabase,
      "reports-pdf",
      `${orgId}/report-${new Date().toISOString().slice(0, 7)}.pdf`,
      pdfBytes
    );
    return jsonOk({ url });
  } catch {
    return new Response(Buffer.from(pdfBytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="report-${org.name}.pdf"`,
      },
    });
  }
}
