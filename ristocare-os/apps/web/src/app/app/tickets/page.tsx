import Link from "next/link";
import { getRepository, getSession } from "@/lib/auth/session";
import { PortalShell } from "@/components/layout/portal-shell";
import { EmptyState, PortalPageHeader } from "@/components/portal/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
        <PortalPageHeader
          title="Ticket assistenza"
          description="Le tue richieste verso la centrale RistoCare"
        />

        {tickets.length === 0 ? (
          <EmptyState
            title="Nessun ticket aperto"
            description="Apri un ticket quando una macchina ha un problema. La centrale RistoCare gestirà tutto."
            action={
              <Button asChild>
                <Link href="/app/tickets/new">Apri il primo ticket</Link>
              </Button>
            }
          />
        ) : (
          <div className="space-y-3">
            {tickets.map((t) => (
              <Link key={t.id} href={`/app/tickets/${t.id}`}>
                <Card className="hover:border-emerald-500/25 transition-all duration-300">
                  <CardContent className="py-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium text-zinc-800">{t.title}</p>
                      <p className="text-xs text-zinc-500 mt-1">
                        {formatDate(t.created_at)} · {t.customer_visible_status}
                      </p>
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
