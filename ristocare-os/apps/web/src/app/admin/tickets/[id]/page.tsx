import { notFound } from "next/navigation";
import { getRepository, getSession } from "@/lib/auth/session";
import { PortalShell } from "@/components/layout/portal-shell";
import { PortalPageHeader } from "@/components/portal/page-header";
import { AdminTicketActions } from "@/components/admin/ticket-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TicketStatusBadge, UrgencyBadge } from "@/components/shared/status-badges";
import { formatCurrency, formatDate } from "@/lib/utils";

export const metadata = { title: "Ticket admin" };

export default async function AdminTicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();
  const repo = await getRepository();
  const ticket = await repo.getTicket(id);
  if (!ticket) notFound();

  const org = await repo.getOrganization(ticket.organization_id);
  const equipment = ticket.equipment_id ? await repo.getEquipment(ticket.equipment_id) : null;
  const technicians = await repo.listTechnicians();
  const quotes = await repo.listQuotes(id);
  const requests = await repo.listTechnicianRequests(id);
  const requestsWithTech = await Promise.all(
    requests.map(async (r) => ({
      request: r,
      tech: await repo.getTechnician(r.technician_id),
    }))
  );

  return (
    <PortalShell variant="admin" title="RistoCare Admin" subtitle="Dettaglio ticket" mode={session.mode} email={session.email}>
      <div className="max-w-4xl space-y-6">
        <PortalPageHeader
          variant="admin"
          backHref="/admin/tickets"
          backLabel="Ticket"
          title={ticket.title}
          description={`${org?.name ?? "—"} · ${formatDate(ticket.created_at)}`}
          action={
            <div className="flex gap-2">
              <UrgencyBadge urgency={ticket.urgency} />
              <TicketStatusBadge status={ticket.status} />
            </div>
          }
        />

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle className="text-base">Problema segnalato</CardTitle></CardHeader>
            <CardContent className="text-sm text-zinc-300 leading-relaxed">{ticket.description}</CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Attrezzatura</CardTitle></CardHeader>
            <CardContent className="text-sm text-zinc-300">
              {equipment ? (
                <>
                  <p className="font-medium text-zinc-200">{equipment.name}</p>
                  <p className="text-zinc-500 mt-1">Matricola: {equipment.serial_number}</p>
                  <p className="text-zinc-500">Garanzia: {equipment.warranty_status}</p>
                </>
              ) : (
                <p className="text-zinc-500">Non specificata</p>
              )}
            </CardContent>
          </Card>
        </div>

        {ticket.internal_notes && (
          <Card className="border-amber-500/20 from-amber-500/[0.04]">
            <CardHeader><CardTitle className="text-base">Note interne</CardTitle></CardHeader>
            <CardContent className="text-sm text-zinc-400">{ticket.internal_notes}</CardContent>
          </Card>
        )}

        <AdminTicketActions
          ticketId={id}
          technicians={technicians}
          draftQuoteId={quotes.find((q) => q.status === "draft")?.id}
        />

        {requestsWithTech.length > 0 && (
          <Card>
            <CardHeader><CardTitle className="text-base">Richieste tecnico (vista interna)</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {requestsWithTech.map(({ request: r, tech }) => (
                <div key={r.id} className="text-sm border-b border-white/5 pb-3 last:border-0 last:pb-0">
                  <p className="text-zinc-200">{tech?.name} — {formatCurrency(r.internal_price ?? 0)} interno</p>
                  <p className="text-zinc-500 mt-0.5">{r.availability} · {r.response_status}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {quotes.length > 0 && (
          <Card>
            <CardHeader><CardTitle className="text-base">Preventivi</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {quotes.map((q) => (
                <div key={q.id} className="flex justify-between text-sm rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2">
                  <span className="text-zinc-400">
                    Cliente: {formatCurrency(q.customer_price)} · Margine: {formatCurrency(q.margin)}
                  </span>
                  <span className="text-zinc-500">{q.status}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </PortalShell>
  );
}
