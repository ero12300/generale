import Link from "next/link";
import { Building2, Clock, Ticket, TrendingUp, Users, Wrench } from "lucide-react";
import { getRepository, getSession } from "@/lib/auth/session";
import { PortalShell } from "@/components/layout/portal-shell";
import { PortalPageHeader, StatCard } from "@/components/portal/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TicketStatusBadge, UrgencyBadge } from "@/components/shared/status-badges";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Admin Dashboard" };

export default async function AdminDashboardPage() {
  const session = await getSession();
  const repo = await getRepository();
  const stats = await repo.getAdminStats();
  const urgentTickets = (await repo.listAllTickets())
    .filter((t) => t.urgency === "high" || t.urgency === "critical")
    .slice(0, 5);
  const urgentWithOrg = await Promise.all(
    urgentTickets.map(async (t) => ({
      ticket: t,
      org: await repo.getOrganization(t.organization_id),
    }))
  );

  const cards = [
    { label: "Ticket nuovi", value: stats.new_tickets, icon: Ticket },
    { label: "Urgenti", value: stats.urgent_tickets, icon: Clock },
    { label: "In attesa tecnico", value: stats.awaiting_technician, icon: Wrench },
    { label: "Clienti attivi", value: stats.active_clients, icon: Users },
    { label: "Preventivi da inviare", value: stats.quotes_to_send, icon: TrendingUp },
    { label: "In attesa cliente", value: stats.awaiting_customer, icon: Building2 },
  ];

  return (
    <PortalShell variant="admin" title="RistoCare Admin" subtitle="Centrale operativa" mode={session.mode} email={session.email}>
      <div className="space-y-8">
        <PortalPageHeader
          title="Dashboard operativa"
          description="Messina e provincia"
          variant="admin"
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((c) => (
            <StatCard key={c.label} {...c} variant="admin" />
          ))}
        </div>

        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>Ticket urgenti</CardTitle>
            <Link href="/admin/tickets" className="text-sm text-amber-700 hover:text-amber-700 transition-colors">
              Tutti i ticket →
            </Link>
          </CardHeader>
          <CardContent>
            {urgentWithOrg.length === 0 ? (
              <p className="text-sm text-zinc-500">Nessun ticket urgente.</p>
            ) : (
              <ul className="divide-y divide-white/5">
                {urgentWithOrg.map(({ ticket: t, org }) => (
                  <li key={t.id} className="py-3 flex items-center justify-between gap-4">
                    <div>
                      <Link
                        href={`/admin/tickets/${t.id}`}
                        className="font-medium text-zinc-800 hover:text-amber-700 transition-colors"
                      >
                        {t.title}
                      </Link>
                      <p className="text-xs text-zinc-500">
                        {org?.name} · {formatDate(t.created_at)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <UrgencyBadge urgency={t.urgency} />
                      <TicketStatusBadge status={t.status} />
                    </div>
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
