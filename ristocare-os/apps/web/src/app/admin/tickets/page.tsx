import Link from "next/link";
import { getRepository, getSession } from "@/lib/auth/session";
import { PortalShell } from "@/components/layout/portal-shell";
import { PortalPageHeader } from "@/components/portal/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { TicketStatusBadge, UrgencyBadge } from "@/components/shared/status-badges";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Gestione ticket" };

export default async function AdminTicketsPage() {
  const session = await getSession();
  const repo = await getRepository();
  const tickets = await repo.listAllTickets();
  const ticketsWithOrg = await Promise.all(
    tickets.map(async (t) => ({
      ticket: t,
      org: await repo.getOrganization(t.organization_id),
    }))
  );

  return (
    <PortalShell variant="admin" title="RistoCare Admin" subtitle="Ticket" mode={session.mode} email={session.email}>
      <div className="space-y-6">
        <PortalPageHeader title="Tutti i ticket" description={`${tickets.length} richieste totali`} variant="admin" />
        <div className="space-y-3">
          {ticketsWithOrg.map(({ ticket: t, org }) => (
            <Link key={t.id} href={`/admin/tickets/${t.id}`}>
              <Card className="hover:border-amber-500/25 transition-all duration-300">
                <CardContent className="py-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-zinc-800">{t.title}</p>
                    <p className="text-xs text-zinc-500">
                      {org?.name} · {formatDate(t.created_at)}
                    </p>
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
      </div>
    </PortalShell>
  );
}
