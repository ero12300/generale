import Link from "next/link";
import { getRepository, getSession } from "@/lib/auth/session";
import { PortalShell } from "@/components/layout/portal-shell";
import { Card, CardContent } from "@/components/ui/card";
import { TicketStatusBadge, UrgencyBadge } from "@/components/shared/status-badges";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Ticket" };

export default async function TicketsListPage() {
  const session = await getSession();
  const repo = await getRepository();
  const orgId = session.orgId ?? "org-demo-001";
  const tickets = await repo.listTickets(orgId);

  return (
    <PortalShell
      variant="customer"
      title="RistoCare OS"
      subtitle={session.orgName ?? "Il tuo locale"}
      mode={session.mode}
      email={session.email}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Ticket assistenza</h1>
          <p className="text-zinc-400 text-sm mt-1">Le tue richieste verso la centrale RistoCare</p>
        </div>

        {tickets.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-zinc-400">Nessun ticket aperto.</p>
              <Link href="/app/tickets/new" className="text-emerald-400 text-sm hover:underline mt-2 inline-block">
                Apri il primo ticket
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {tickets.map((t) => (
              <Link key={t.id} href={`/app/tickets/${t.id}`}>
                <Card className="hover:border-emerald-600/30 transition-colors">
                  <CardContent className="py-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium text-zinc-200">{t.title}</p>
                      <p className="text-xs text-zinc-500 mt-1">{formatDate(t.created_at)} · {t.customer_visible_status}</p>
                    </div>
                    <div className="flex items-center gap-2">
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
