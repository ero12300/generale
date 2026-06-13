import Link from "next/link";
import { notFound } from "next/navigation";
import { getRepository, getSession } from "@/lib/auth/session";
import { PortalShell } from "@/components/layout/portal-shell";
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
        <Link href="/tech/tickets" className="text-sm text-zinc-500 hover:text-zinc-300">← Ticket</Link>
        <div className="flex justify-between items-start">
          <h1 className="text-2xl font-bold text-zinc-100">{ticket.title}</h1>
          <TicketStatusBadge status={ticket.status} />
        </div>

        <Card>
          <CardHeader><CardTitle className="text-base">Problema</CardTitle></CardHeader>
          <CardContent className="text-sm text-zinc-300">{ticket.description}</CardContent>
        </Card>

        {equipment && (
          <Card>
            <CardHeader><CardTitle className="text-base">Macchina</CardTitle></CardHeader>
            <CardContent className="text-sm text-zinc-300">
              <p>{equipment.name}</p>
              <p className="text-zinc-500 mt-1">Matricola: {equipment.serial_number}</p>
              <p className="text-zinc-500">Area: {equipment.area}</p>
            </CardContent>
          </Card>
        )}

        {requests.map((r) => (
          <Card key={r.id}>
            <CardHeader><CardTitle className="text-base">La tua risposta</CardTitle></CardHeader>
            <CardContent className="text-sm text-zinc-400">
              <p>Disponibilità: {r.availability}</p>
              <p>Stato: {r.response_status}</p>
              {r.notes && <p className="mt-2">{r.notes}</p>}
            </CardContent>
          </Card>
        ))}
      </div>
    </PortalShell>
  );
}
