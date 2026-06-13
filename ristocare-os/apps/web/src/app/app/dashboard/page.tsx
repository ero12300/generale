import Link from "next/link";
import { AlertTriangle, Package, Ticket, Wrench } from "lucide-react";
import { getRepository, getSession } from "@/lib/auth/session";
import { PortalShell } from "@/components/layout/portal-shell";
import { PortalPageHeader, StatCard } from "@/components/portal/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TicketStatusBadge } from "@/components/shared/status-badges";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Dashboard" };

export default async function CustomerDashboardPage() {
  const session = await getSession();
  const repo = await getRepository();
  const orgId = session.orgId ?? "org-demo-001";
  const stats = await repo.getCustomerStats(orgId);
  const tickets = (await repo.listTickets(orgId)).slice(0, 5);

  const cards = [
    { label: "Attrezzature", value: stats.equipment_count, icon: Package, href: "/app/equipment" },
    { label: "Ticket aperti", value: stats.open_tickets, icon: Ticket, href: "/app/tickets" },
    { label: "In attesa", value: stats.pending_tickets, icon: AlertTriangle, href: "/app/tickets" },
    { label: "Garanzie in scadenza", value: stats.expiring_warranties, icon: Wrench, href: "/app/equipment" },
  ];

  return (
    <PortalShell
      variant="customer"
      title="RistoCare OS"
      subtitle={session.orgName ?? "Il tuo locale"}
      mode={session.mode}
      email={session.email}
    >
      <div className="space-y-8">
        <PortalPageHeader title="Dashboard" description="Panoramica del tuo locale" />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((c) => (
            <StatCard key={c.label} {...c} />
          ))}
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Ticket recenti</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/app/tickets">Vedi tutti</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {tickets.length === 0 ? (
              <p className="text-sm text-zinc-500">Nessun ticket. Apri il primo dalla barra in alto.</p>
            ) : (
              <ul className="divide-y divide-white/5">
                {tickets.map((t) => (
                  <li key={t.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <Link
                        href={`/app/tickets/${t.id}`}
                        className="font-medium text-zinc-200 hover:text-emerald-400 truncate block transition-colors"
                      >
                        {t.title}
                      </Link>
                      <p className="text-xs text-zinc-500">{formatDate(t.created_at)}</p>
                    </div>
                    <TicketStatusBadge status={t.status} />
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </PortalShell>
  );
}
