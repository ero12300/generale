import Link from "next/link";
import { ArrowRight, Sparkles, TrendingUp, Users, WalletCards } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  getBarberDashboardSnapshot,
  listBarberAppointments,
  listBarberCampaigns,
  listBarberClients,
} from "@/lib/barber-demo";
import { formatCurrency, formatPercent } from "@/lib/utils";

export default async function DashboardPage() {
  const snapshot = getBarberDashboardSnapshot();
  const appointments = listBarberAppointments().slice(0, 4);
  const clients = listBarberClients().slice(0, 4);
  const campaigns = listBarberCampaigns().filter((campaign) => campaign.status === "active");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard premium</h1>
        <p className="text-zinc-400 text-sm mt-1">
          Agenda, clienti e cassa in un&apos;unica vista pronta per diventare un SaaS barber.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          icon={WalletCards}
          label="Incasso oggi"
          value={formatCurrency(snapshot.revenue_today)}
          sub={`Mese: ${formatCurrency(snapshot.revenue_month)}`}
        />
        <KpiCard
          icon={TrendingUp}
          label="Occupazione agenda"
          value={formatPercent(snapshot.occupancy_rate)}
          sub={`${snapshot.appointments_today} appuntamenti oggi`}
        />
        <KpiCard
          icon={Users}
          label="Clienti di ritorno"
          value={formatPercent(snapshot.repeat_rate)}
          sub={`${snapshot.new_clients_month} nuovi clienti questo mese`}
        />
        <KpiCard
          icon={Sparkles}
          label="Ticket medio"
          value={formatCurrency(snapshot.average_ticket)}
          sub={`Referral mese: ${formatCurrency(snapshot.referral_revenue_month)}`}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Prossimi appuntamenti</CardTitle>
            <Link href="/agenda" className="text-sm text-amber-400 hover:text-amber-300 flex items-center gap-1">
              Apri agenda <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center justify-between rounded-xl border border-zinc-800 p-3"
              >
                <div>
                  <p className="font-medium text-sm">{new Date(appointment.starts_at).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    {appointment.barber_name} - {appointment.duration_minutes} min
                  </p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-sm text-amber-400">{formatCurrency(appointment.total_price)}</p>
                  <Badge
                    variant={
                      appointment.status === "completed"
                        ? "success"
                        : appointment.status === "pending"
                          ? "warning"
                          : "secondary"
                    }
                  >
                    {appointment.status.replace(/_/g, " ")}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Clienti top spender</CardTitle>
            <Link href="/clients" className="text-sm text-amber-400 hover:text-amber-300 flex items-center gap-1">
              Vedi CRM <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {clients.map((client) => (
              <Link
                key={client.id}
                href={`/clients/${client.id}`}
                className="flex items-center justify-between rounded-xl border border-zinc-800 p-3 transition hover:border-amber-500/40"
              >
                <div>
                  <p className="font-medium text-sm">{client.full_name}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    {client.total_visits} visite - {client.preferred_barber ?? "Nessuna preferenza"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-amber-400">{formatCurrency(client.total_spent)}</p>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Growth engine</CardTitle>
            <p className="mt-1 text-sm text-zinc-500">
              Campagne attive per aumentare ritorno clienti e passaparola.
            </p>
          </div>
          <Link href="/growth" className="text-sm text-amber-400 hover:text-amber-300 flex items-center gap-1">
            Apri growth <ArrowRight className="h-3 w-3" />
          </Link>
        </CardHeader>
        <CardContent className="space-y-3">
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="flex items-center justify-between rounded-xl border border-zinc-800 p-4"
            >
              <div>
                <p className="font-medium text-sm">{campaign.name}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{campaign.description}</p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-sm text-amber-400">{formatCurrency(campaign.revenue_generated)}</p>
                <Badge variant="success">{campaign.conversions} conversioni</Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function KpiCard({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-wide">{label}</p>
            <p className="text-2xl font-semibold mt-1">{value}</p>
            <p className="text-xs text-zinc-500 mt-1">{sub}</p>
          </div>
          <Icon className="h-5 w-5 text-amber-500/70" aria-hidden />
        </div>
      </CardContent>
    </Card>
  );
}
