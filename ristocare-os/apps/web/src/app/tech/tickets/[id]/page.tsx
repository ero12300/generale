import { notFound } from "next/navigation";
import { getRepository, getSession } from "@/lib/auth/session";
import { PortalShell } from "@/components/layout/portal-shell";
import { PortalPageHeader } from "@/components/portal/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TicketStatusBadge } from "@/components/shared/status-badges";

export const metadata = { title: "Dettaglio ticket tecnico" };

export default async function TechTicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();
  const repo = await getRepository();
  const ticket = await repo.getTicket(id);
  if (!ticket || ticket.assigned_technician_id !== (session.technicianId ?? "tech-001")) notFound();

  const equipment = ticket.equipment_id ? await repo.getEquipment(ticket.equipment_id) : null;
  const requests = await repo.listTechnicianRequests(id);

  return (
    <PortalShell variant="technician" title="Portale tecnico" subtitle="Dettaglio" mode={session.mode} email={session.email}>
      <div className="max-w-2xl space-y-6">
        <PortalPageHeader
          backHref="/tech/tickets"
          backLabel="Ticket"
          title={ticket.title}
          action={<TicketStatusBadge status={ticket.status} />}
        />

        <Card>
          <CardHeader><CardTitle className="text-base">Problema</CardTitle></CardHeader>
          <CardContent className="text-sm text-zinc-700 leading-relaxed">{ticket.description}</CardContent>
        </Card>

        {equipment && (
          <Card>
            <CardHeader><CardTitle className="text-base">Macchina</CardTitle></CardHeader>
            <CardContent className="text-sm text-zinc-700">
              <p className="font-medium text-zinc-800">{equipment.name}</p>
              <p className="text-zinc-500 mt-1">Matricola: {equipment.serial_number}</p>
              <p className="text-zinc-500">Area: {equipment.area}</p>
            </CardContent>
          </Card>
        )}

        {requests.map((r) => (
          <Card key={r.id}>
            <CardHeader><CardTitle className="text-base">La tua risposta</CardTitle></CardHeader>
            <CardContent className="text-sm text-zinc-600">
              <p>Disponibilità: {r.availability}</p>
              <p className="mt-1">Stato: {r.response_status}</p>
              {r.notes && <p className="mt-2 text-zinc-700">{r.notes}</p>}
            </CardContent>
          </Card>
        ))}
      </div>
    </PortalShell>
  );
}
