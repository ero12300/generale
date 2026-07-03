import Link from "next/link";
import { CalendarCheck2, Coins, Crown, Percent, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getBarberRepository } from "@/lib/barber";
import { formatCurrency, formatPercent } from "@/lib/utils";

export default async function BarberDashboardPage() {
  const repo = await getBarberRepository();
  const [overview, campaigns] = await Promise.all([repo.getOverview(), repo.listCampaigns()]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Barber Control Center</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Prenotazioni, incassi e fidelizzazione clienti in un unico pannello.
          </p>
        </div>
        <Badge className="bg-amber-600 text-white capitalize">{overview.subscriptionPlan}</Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard
          icon={CalendarCheck2}
          label="Prenotazioni oggi"
          value={String(overview.todayBookings)}
          sub={`${overview.confirmedBookings} confermate`}
        />
        <KpiCard
          icon={Coins}
          label="Incasso 7 giorni"
          value={formatCurrency(overview.weekRevenue)}
          sub={`No-show: ${formatPercent(overview.noShowRate)}`}
        />
        <KpiCard
          icon={Users}
          label="Clienti attivi"
          value={String(overview.activeClients)}
          sub={`${overview.activeCampaigns} campagne attive`}
        />
        <KpiCard
          icon={Crown}
          label="Servizio top"
          value={overview.topServiceName ?? "—"}
          sub="più richiesto del periodo"
        />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <CardTitle>Azioni rapide</CardTitle>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Percent className="h-3 w-3" /> Referral + Sconti
          </Badge>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <ActionLink href="/barber/bookings" title="Nuova prenotazione" subtitle="Slot, barber e acconto" />
          <ActionLink href="/barber/clients" title="Nuovo cliente" subtitle="CRM e storico visite" />
          <ActionLink href="/barber/campaigns" title="Campagna promo" subtitle="Porta un amico / sconto" />
          <ActionLink href="/barber/billing" title="Piano Pro" subtitle="Monetizzazione SaaS" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Campagne recenti</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {campaigns.slice(0, 4).map((campaign) => (
            <div
              key={campaign.id}
              className="rounded-lg border border-zinc-800 p-3 flex items-center justify-between"
            >
              <div>
                <p className="text-sm font-medium">{campaign.name}</p>
                <p className="text-xs text-zinc-500">
                  {campaign.channel} · {campaign.discount_type === "percent" ? `${campaign.discount_value}%` : formatCurrency(campaign.discount_value)}
                </p>
              </div>
              <Badge variant="secondary" className="capitalize">
                {campaign.status}
              </Badge>
            </div>
          ))}
          {campaigns.length === 0 && (
            <p className="text-sm text-zinc-500">
              Nessuna campagna attiva: crea la prima promozione “porta un amico”.
            </p>
          )}
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
        <div className="flex items-start justify-between gap-3">
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

function ActionLink({ href, title, subtitle }: { href: string; title: string; subtitle: string }) {
  return (
    <Link
      href={href}
      className="rounded-lg border border-zinc-800 hover:border-amber-700 transition-colors p-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
    >
      <p className="text-sm font-medium">{title}</p>
      <p className="text-xs text-zinc-500 mt-1">{subtitle}</p>
    </Link>
  );
}
