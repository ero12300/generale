import Link from "next/link";
import {
  ArrowRight,
  CalendarClock,
  Crown,
  Scissors,
  TicketPercent,
  Wallet,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { appointments, barberStudio, getClient, getKpis, getServiceName, referralCampaigns } from "@/lib/barber-data";
import { formatCurrencyFromCents, formatPercent } from "@/lib/utils";

export default async function DashboardPage() {
  const kpis = getKpis();
  const nextAppointments = appointments.slice(0, 4);
  const topCampaign = referralCampaigns[0];

  return (
    <div className="space-y-8">
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(245,158,11,0.16),rgba(255,255,255,0.02))] p-8">
          <Badge className="border-white/10 bg-white/10 text-white">Barber performance cockpit</Badge>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-balance">
            {barberStudio.name}: piu clienti che tornano, meno no-show, incassi piu leggibili.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-300">
            Questa dashboard unisce agenda, CRM e finanza operativa in un unico spazio premium,
            progettato per essere rivenduto anche come SaaS ad altri barber shop.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/bookings"
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-zinc-200"
            >
              Vedi prenotazioni
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              href="/growth"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Attiva monetizzazione
            </Link>
          </div>
        </div>

        <Card className="border-white/10 bg-white/5 backdrop-blur">
          <CardHeader>
            <CardTitle>Obiettivo operativo</CardTitle>
            <CardDescription>{barberStudio.primary_goal}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <MiniDetail label="Citta" value={barberStudio.city} />
            <MiniDetail label="Orari" value={barberStudio.opening_hours} />
            <MiniDetail label="Postazioni" value={String(barberStudio.seats)} />
            <MiniDetail label="Team" value={`${barberStudio.team_size} persone`} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          icon={Wallet}
          label="Incasso today"
          value={formatCurrencyFromCents(kpis.todayRevenueCents)}
          sub="Servizi + retail - rimborsi"
        />
        <KpiCard
          icon={CalendarClock}
          label="Occupazione"
          value={formatPercent(kpis.occupancyRatio)}
          sub={`${kpis.bookingsToday} prenotazioni oggi`}
        />
        <KpiCard
          icon={Scissors}
          label="Clienti di ritorno"
          value={formatPercent(kpis.repeatClientRatio)}
          sub={`${kpis.marketingReach} contatti consenzienti`}
        />
        <KpiCard
          icon={TicketPercent}
          label="Rischio no-show"
          value={String(kpis.noShowRiskCount)}
          sub="Booking da confermare"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="border-white/10 bg-white/5 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Agenda live</CardTitle>
              <CardDescription>Slot con priorita commerciale e CRM contestuale.</CardDescription>
            </div>
            <Link
              href="/bookings"
              className="flex items-center gap-1 text-sm text-amber-300 hover:text-amber-200"
            >
              Apri agenda <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {nextAppointments.map((appointment) => {
              const client = getClient(appointment.client_id);
              const statusVariant =
                appointment.status === "completed"
                  ? "success"
                  : appointment.status === "pending"
                    ? "warning"
                    : "secondary";

              return (
                <div
                  key={appointment.id}
                  className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-black/20 p-4 lg:flex-row lg:items-center lg:justify-between"
                >
                  <div>
                    <p className="text-sm font-medium text-white">{client?.full_name ?? "Cliente"}</p>
                    <p className="mt-1 text-sm text-zinc-400">
                      {getServiceName(appointment.service_id)} · {appointment.barber_name}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right text-sm">
                      <p className="text-white">
                        {new Date(appointment.starts_at).toLocaleTimeString("it-IT", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <p className="text-zinc-500">{appointment.source}</p>
                    </div>
                    <Badge variant={statusVariant}>{appointment.status}</Badge>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5 backdrop-blur">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle>Growth engine</CardTitle>
                <CardDescription>Referral e campagne che generano ritorno misurabile.</CardDescription>
              </div>
              <Badge variant="default">Top campaign</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-[1.75rem] border border-amber-500/20 bg-amber-500/10 p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold text-white">{topCampaign.title}</p>
                  <p className="mt-1 text-sm text-zinc-300">
                    {topCampaign.reward_friend} per il nuovo cliente, {topCampaign.reward_referrer} per chi invita.
                  </p>
                </div>
                <Crown className="h-6 w-6 text-amber-300" aria-hidden />
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <MiniDetail label="Conversioni" value={String(topCampaign.conversions)} />
                <MiniDetail label="Ricavi attribuiti" value={formatCurrencyFromCents(topCampaign.revenue_cents)} />
                <MiniDetail label="Canale" value={topCampaign.channel.toUpperCase()} />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <InsightCard
                title="Strategia Basic"
                text="Fai entrare il salone con agenda e CRM. Monetizza subito il problema principale: riempire la giornata."
              />
              <InsightCard
                title="Strategia Pro"
                text="Vendi automazioni, depositi, no-show protection e campagne referral per aumentare ARPU."
              />
            </div>
          </CardContent>
        </Card>
      </div>
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
    <Card className="border-white/10 bg-white/5 backdrop-blur">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-zinc-500">{label}</p>
            <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
            <p className="mt-1 text-xs text-zinc-500">{sub}</p>
          </div>
          <Icon className="h-5 w-5 text-amber-300/80" aria-hidden />
        </div>
      </CardContent>
    </Card>
  );
}

function MiniDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
      <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">{label}</p>
      <p className="mt-2 text-sm font-medium text-white">{value}</p>
    </div>
  );
}

function InsightCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
      <p className="text-sm font-medium text-white">{title}</p>
      <p className="mt-2 text-sm leading-6 text-zinc-400">{text}</p>
    </div>
  );
}
