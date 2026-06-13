import Link from "next/link";
import { AlertTriangle, Package, Ticket, Wrench } from "lucide-react";
import { getRepository, getSession } from "@/lib/auth/session";
import { PortalShell } from "@/components/layout/portal-shell";
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
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-zinc-100">Dashboard</h1>
          <p className="text-zinc-500 text-sm mt-1">Panoramica del tuo locale</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map(({ label, value, icon: Icon, href }) => (
            <Link key={label} href={href}>
              <Card className="hover:border-emerald-500/25 hover:from-emerald-500/[0.06] transition-all duration-300 h-full">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-zinc-500">{label}</p>
                      <p className="font-display text-3xl font-semibold text-zinc-100 mt-1">{value}</p>
                    </div>
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/15">
                      <Icon className="h-5 w-5 text-emerald-400/80" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
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
              <ul className="divide-y divide-zinc-800">
                {tickets.map((t) => (
                  <li key={t.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <Link href={`/app/tickets/${t.id}`} className="font-medium text-zinc-200 hover:text-emerald-400 truncate block">
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
