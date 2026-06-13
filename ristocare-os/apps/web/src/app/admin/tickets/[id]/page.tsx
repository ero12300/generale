import Link from "next/link";
import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { repository } from "@/lib/data/repository";
import { PortalShell } from "@/components/layout/portal-shell";
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
  const ticket = repository.getTicket(id);
  if (!ticket) notFound();

  const org = repository.getOrganization(ticket.organization_id);
  const equipment = ticket.equipment_id ? repository.getEquipment(ticket.equipment_id) : null;
  const technicians = repository.listTechnicians();
  const quotes = repository.listQuotes(id);
  const requests = repository.listTechnicianRequests(id);

  return (
    <PortalShell variant="admin" title="RistoCare Admin" subtitle="Dettaglio ticket" mode={session.mode} email={session.email}>
      <div className="max-w-4xl space-y-6">
        <div>
          <Link href="/admin/tickets" className="text-sm text-zinc-500 hover:text-zinc-300">← Ticket</Link>
          <div className="flex flex-wrap items-start justify-between gap-4 mt-2">
            <div>
              <h1 className="text-2xl font-bold text-zinc-100">{ticket.title}</h1>
              <p className="text-sm text-zinc-500">{org?.name} · {formatDate(ticket.created_at)}</p>
            </div>
            <div className="flex gap-2">
              <UrgencyBadge urgency={ticket.urgency} />
              <TicketStatusBadge status={ticket.status} />
            </div>
          </div>
        </div>

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
          <Card className="border-amber-600/20">
            <CardHeader><CardTitle className="text-base">Note interne</CardTitle></CardHeader>
            <CardContent className="text-sm text-zinc-400">{ticket.internal_notes}</CardContent>
          </Card>
        )}

        <AdminTicketActions
          ticketId={id}
          technicians={technicians}
          draftQuoteId={quotes.find((q) => q.status === "draft")?.id}
        />

        {requests.length > 0 && (
          <Card>
            <CardHeader><CardTitle className="text-base">Richieste tecnico (vista interna)</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {requests.map((r) => {
                const tech = repository.getTechnician(r.technician_id);
                return (
                  <div key={r.id} className="text-sm border-b border-zinc-800 pb-3 last:border-0">
                    <p className="text-zinc-200">{tech?.name} — {formatCurrency(r.internal_price ?? 0)} interno</p>
                    <p className="text-zinc-500">{r.availability} · {r.response_status}</p>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        {quotes.length > 0 && (
          <Card>
            <CardHeader><CardTitle className="text-base">Preventivi</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {quotes.map((q) => (
                <div key={q.id} className="flex justify-between text-sm">
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
