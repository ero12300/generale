import Link from "next/link";
import { getRepository, getSession } from "@/lib/auth/session";
import { PortalShell } from "@/components/layout/portal-shell";
import { Card, CardContent } from "@/components/ui/card";
import { TicketStatusBadge, UrgencyBadge } from "@/components/shared/status-badges";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Portale tecnico" };

export default async function TechTicketsPage() {
  const session = await getSession();
  const repo = await getRepository();
  const techId = session.technicianId ?? "tech-001";
  const tickets = await repo.listTicketsForTechnician(techId);

  return (
    <PortalShell variant="technician" title="Portale tecnico" subtitle="Ticket assegnati" mode={session.mode} email={session.email}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-zinc-100">I miei ticket</h1>
        <p className="text-sm text-zinc-500">Solo ticket assegnati da RistoCare OS. I prezzi cliente non sono visibili.</p>
        {tickets.length === 0 ? (
          <Card><CardContent className="py-12 text-center text-zinc-500">Nessun ticket assegnato.</CardContent></Card>
        ) : (
          <div className="space-y-3">
            {tickets.map((t) => (
              <Link key={t.id} href={`/tech/tickets/${t.id}`}>
                <Card className="hover:border-emerald-600/30 transition-colors">
                  <CardContent className="py-4 flex justify-between gap-4">
                    <div>
                      <p className="font-medium text-zinc-200">{t.title}</p>
                      <p className="text-xs text-zinc-500">{formatDate(t.created_at)}</p>
                    </div>
                    <div className="flex gap-2">
                      <UrgencyBadge urgency={t.urgency} />
                      <TicketStatusBadge status={t.status} />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </PortalShell>
  );
}
