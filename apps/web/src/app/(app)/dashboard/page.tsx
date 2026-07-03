import Link from "next/link";
import {
  ArrowRight,
  BadgePercent,
  CalendarDays,
  Crown,
  Scissors,
  TrendingUp,
  UsersRound,
  Wallet,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  appointments,
  barberShop,
  campaigns,
  formatCents,
  getCustomer,
  getPendingRevenueCents,
  getService,
  getStaffMember,
  getTodayRevenueCents,
  services,
} from "@/lib/barber-data";

export default function DashboardPage() {
  const completed = appointments.filter((appointment) => appointment.status === "completed").length;
  const activeCampaigns = campaigns.filter((campaign) => campaign.status === "active").length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Badge className="mb-3">
            <Crown className="mr-1 h-3 w-3" aria-hidden />
            Barber SaaS cockpit
          </Badge>
          <h1 className="text-3xl font-semibold tracking-tight">Dashboard {barberShop.name}</h1>
          <p className="text-zinc-400 text-sm mt-1">
            Panoramica operativa: prenotazioni, clienti, incassi e campagne.
          </p>
        </div>
        <Link href="/booking" className="text-sm text-amber-300 hover:text-amber-200">
          Apri pagina booking cliente <ArrowRight className="inline h-3 w-3" aria-hidden />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          icon={CalendarDays}
          label="Appuntamenti oggi"
          value={String(appointments.length)}
          sub={`${completed} completati · ${appointments.length - completed} da gestire`}
        />
        <KpiCard
          icon={Wallet}
          label="Incassato oggi"
          value={formatCents(getTodayRevenueCents())}
          sub={`${formatCents(getPendingRevenueCents())} ancora da chiudere`}
        />
        <KpiCard
          icon={UsersRound}
          label="Retention clienti"
          value={`${Math.round(barberShop.repeatRate * 100)}%`}
          sub={`${barberShop.bookingsThisMonth} prenotazioni mese`}
        />
        <KpiCard
          icon={TrendingUp}
          label="MRR potenziale"
          value={formatCents(barberShop.subscriptionMrrCents)}
          sub={`${activeCampaigns} campagne crescita attive`}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_0.6fr]">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Agenda live</CardTitle>
            <Link href="/agenda" className="text-sm text-amber-400 hover:text-amber-300 flex items-center gap-1">
              Gestisci agenda <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {appointments.map((appointment) => {
              const customer = getCustomer(appointment.customerId);
              const service = getService(appointment.serviceId);
              const member = getStaffMember(appointment.staffId);
              return (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between gap-4 rounded-xl border border-zinc-800 p-4"
                >
                  <div>
                    <p className="font-medium text-sm">
                      {appointment.time} · {service?.name}
                    </p>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      {customer?.name} con {member?.name}
                    </p>
                  </div>
                  <Badge variant={appointment.status === "completed" ? "success" : "secondary"}>
                    {appointment.status}
                  </Badge>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="border-amber-500/20 bg-amber-500/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scissors className="h-5 w-5 text-amber-300" aria-hidden />
              Servizi top
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {services.filter((service) => service.popular).map((service) => (
              <div key={service.id} className="rounded-xl bg-zinc-950/60 p-4">
                <p className="font-medium">{service.name}</p>
                <p className="mt-1 text-sm text-zinc-400">
                  {service.durationMinutes} min · {formatCents(service.priceCents)}
                </p>
              </div>
            ))}
            <div className="rounded-xl border border-amber-500/30 bg-zinc-950/80 p-4">
              <BadgePercent className="mb-2 h-5 w-5 text-amber-300" aria-hidden />
              <p className="text-sm font-medium">Campagna consigliata</p>
              <p className="mt-1 text-xs text-zinc-400">Spingi “porta un amico” sui clienti VIP.</p>
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
