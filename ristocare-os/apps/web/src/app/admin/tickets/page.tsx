import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { repository } from "@/lib/data/repository";
import { PortalShell } from "@/components/layout/portal-shell";
import { Card, CardContent } from "@/components/ui/card";
import { TicketStatusBadge, UrgencyBadge } from "@/components/shared/status-badges";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Gestione ticket" };

export default async function AdminTicketsPage() {
  const session = await getSession();
  const tickets = repository.listAllTickets();

  return (
    <PortalShell variant="admin" title="RistoCare Admin" subtitle="Ticket" mode={session.mode} email={session.email}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-zinc-100">Tutti i ticket</h1>
        <div className="space-y-3">
          {tickets.map((t) => {
            const org = repository.getOrganization(t.organization_id);
            return (
              <Link key={t.id} href={`/admin/tickets/${t.id}`}>
                <Card className="hover:border-amber-600/30 transition-colors">
                  <CardContent className="py-4 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-zinc-200">{t.title}</p>
                      <p className="text-xs text-zinc-500">{org?.name} · {formatDate(t.created_at)}</p>
                    </div>
                    <div className="flex gap-2">
                      <UrgencyBadge urgency={t.urgency} />
                      <TicketStatusBadge status={t.status} />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </PortalShell>
  );
}
