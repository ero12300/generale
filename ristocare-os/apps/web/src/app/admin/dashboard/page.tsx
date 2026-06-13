import Link from "next/link";
import { Building2, Clock, Ticket, TrendingUp, Users, Wrench } from "lucide-react";
import { getRepository, getSession } from "@/lib/auth/session";
import { PortalShell } from "@/components/layout/portal-shell";
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
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Dashboard operativa</h1>
          <p className="text-zinc-400 text-sm mt-1">Messina e provincia</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map(({ label, value, icon: Icon }) => (
            <Card key={label}>
              <CardContent className="pt-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-500">{label}</p>
                  <p className="text-3xl font-bold text-zinc-100">{value}</p>
                </div>
                <Icon className="h-8 w-8 text-amber-600/40" />
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader className="flex flex-row justify-between">
            <CardTitle>Ticket urgenti</CardTitle>
            <Link href="/admin/tickets" className="text-sm text-amber-400 hover:underline">Tutti i ticket</Link>
          </CardHeader>
          <CardContent>
            {urgentWithOrg.length === 0 ? (
              <p className="text-sm text-zinc-500">Nessun ticket urgente.</p>
            ) : (
              <ul className="divide-y divide-zinc-800">
                {urgentWithOrg.map(({ ticket: t, org }) => (
                  <li key={t.id} className="py-3 flex items-center justify-between gap-4">
                    <div>
                      <Link href={`/admin/tickets/${t.id}`} className="font-medium text-zinc-200 hover:text-amber-400">
                        {t.title}
                      </Link>
                      <p className="text-xs text-zinc-500">{org?.name} · {formatDate(t.created_at)}</p>
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
