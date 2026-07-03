import type { ComponentType } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Megaphone,
  Sparkles,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getBarberRepository } from "@/lib/barber/repository";
import { formatCurrencyCents, formatIntegerPercent } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const repo = await getBarberRepository();
  const [metrics, bookings, campaigns] = await Promise.all([
    repo.getDashboardMetrics(),
    repo.listBookings(),
    repo.listCampaigns(),
  ]);
  const upcoming = bookings
    .filter((booking) => new Date(booking.starts_at).getTime() >= Date.now())
    .slice(0, 5);
  const activeCampaigns = campaigns.filter((campaign) => campaign.active);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Badge>Gestionale premium</Badge>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">Dashboard barber shop</h1>
          <p className="text-zinc-400 text-sm mt-1">
            Incassi, agenda, clienti e campagne — {repo.context.organizationName}
          </p>
        </div>
        <Link
          href="/billing"
          className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm text-amber-200 hover:bg-amber-500/20"
        >
          Monetizza come SaaS <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          icon={Wallet}
          label="Incasso oggi"
          value={formatCurrencyCents(metrics.today_revenue_cents)}
          sub={`${metrics.confirmed_bookings_today} prenotazioni confermate`}
        />
        <KpiCard
          icon={TrendingUp}
          label="Incasso mese"
          value={formatCurrencyCents(metrics.month_revenue_cents)}
          sub={`Ticket medio ${formatCurrencyCents(metrics.average_ticket_cents)}`}
        />
        <KpiCard
          icon={CalendarDays}
          label="Occupazione agenda"
          value={formatIntegerPercent(metrics.occupancy_rate)}
          sub="Capacita giornaliera stimata su 8 ore"
        />
        <KpiCard
          icon={Users}
          label="Database clienti"
          value={String(metrics.customers_total)}
          sub={`${metrics.referral_customers} clienti da porta un amico`}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Prossime prenotazioni</CardTitle>
              <CardDescription>Agenda integrata con richieste online</CardDescription>
            </div>
            <Link href="/bookings" className="text-sm text-amber-400 hover:text-amber-300 flex items-center gap-1">
              Gestisci <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcoming.map((booking) => (
              <Link
                key={booking.id}
                href="/bookings"
                className="flex items-center justify-between rounded-lg border border-zinc-800 p-3 transition-colors hover:border-amber-600/30"
              >
                <div>
                  <p className="font-medium text-sm">{booking.customer_name}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    {new Intl.DateTimeFormat("it-IT", {
                      weekday: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                      day: "2-digit",
                      month: "short",
                    }).format(new Date(booking.starts_at))}{" "}
                    · {booking.service_name}
                  </p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-sm text-amber-300">{formatCurrencyCents(booking.price_cents)}</p>
                  <Badge variant={booking.status === "requested" ? "warning" : "success"}>
                    {booking.status}
                  </Badge>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card className="border-amber-500/20 bg-gradient-to-br from-amber-500/10 via-zinc-900 to-zinc-950">
          <CardHeader>
            <div className="flex items-center gap-2 text-amber-300">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Motore crescita</span>
            </div>
            <CardTitle>Funzioni Pro da vendere in abbonamento</CardTitle>
            <CardDescription>
              Booking, clienti, referral e Stripe sono separati in moduli scalabili.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-zinc-300">
            <GrowthPoint title="Basic" text="Agenda online e database clienti per singolo barbiere." />
            <GrowthPoint title="Pro" text="Campagne porta un amico, segmenti e incassi avanzati." />
            <GrowthPoint title="Elite" text="Multi-sede, ruoli staff e automazioni VIP." />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Campagne attive</CardTitle>
            <CardDescription>Sconti, rientro clienti e referral pronti per WhatsApp/SMS</CardDescription>
          </div>
          <Megaphone className="h-5 w-5 text-amber-400" />
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          {activeCampaigns.map((campaign) => (
            <div key={campaign.id} className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium text-sm">{campaign.name}</p>
                <Badge variant="success">{campaign.type}</Badge>
              </div>
              <p className="mt-2 text-sm text-zinc-400">{campaign.message}</p>
              <p className="mt-3 text-xs text-amber-300">
                Target: {formatCurrencyCents(campaign.revenue_target_cents)} · {campaign.expected_redemptions} redemption
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function GrowthPoint({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-3">
      <p className="font-medium text-amber-200">{title}</p>
      <p className="mt-1 text-zinc-400">{text}</p>
    </div>
  );
}

function KpiCard({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: ComponentType<{ className?: string }>;
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
