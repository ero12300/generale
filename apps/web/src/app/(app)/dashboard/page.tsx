import Link from "next/link";
import type { ComponentType } from "react";
import { ArrowRight, CalendarDays, Crown, HandCoins, Sparkles, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  barberBookings,
  barberCampaigns,
  barberClients,
  barberStudio,
  getAverageTicket,
  getBookingsTodayCount,
  getServiceById,
  getStaffById,
  getTodayRevenue,
  platformReadiness,
} from "@/lib/barber-data";
import { formatCurrency } from "@/lib/utils";

export default function DashboardPage() {
  const upcoming = barberBookings.slice(0, 4);
  const campaign = barberCampaigns[0];

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard executive</h1>
          <Badge variant="warning">Premium barber SaaS</Badge>
        </div>
        <p className="text-zinc-400 text-sm mt-1">
          Panoramica operativa di {barberStudio.name} — booking, incassi e retention nello stesso flusso.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          icon={CalendarDays}
          label="Prenotazioni oggi"
          value={String(getBookingsTodayCount())}
          sub="Agenda live con canali integrati"
        />
        <KpiCard
          icon={HandCoins}
          label="Incasso giornaliero"
          value={formatCurrency(getTodayRevenue())}
          sub={`Ticket medio ${formatCurrency(getAverageTicket())}`}
        />
        <KpiCard
          icon={Users}
          label="Clienti CRM"
          value={String(barberClients.length)}
          sub="Profili con loyalty e referral"
        />
        <KpiCard
          icon={Crown}
          label="Monetizzazione"
          value="SaaS Pro"
          sub="Stripe per abbonamenti e fee booking"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Agenda di oggi</CardTitle>
            <Link
              href="/bookings"
              className="text-sm text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              Vedi prenotazioni <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcoming.map((booking) => {
              const service = getServiceById(booking.service_id);
              const staff = getStaffById(booking.staff_id);
              return (
                <div
                  key={booking.id}
                  className="flex items-center justify-between rounded-lg border border-zinc-800 p-3"
                >
                  <div>
                    <p className="font-medium text-sm">{booking.client_name}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      {new Date(booking.start_at).toLocaleTimeString("it-IT", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      · {service?.name ?? "Servizio"} · {staff?.name ?? "Team"}
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-sm text-amber-400">{formatCurrency(booking.amount)}</p>
                    <Badge variant={booking.status === "pending" ? "secondary" : "success"}>
                      {booking.status}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Growth engine</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-emerald-300" aria-hidden />
                <p className="font-medium">{campaign.title}</p>
              </div>
              <p className="mt-2 text-sm text-zinc-300">{campaign.offer}</p>
              <p className="mt-2 text-xs text-zinc-500">
                Redemption {(campaign.redemption_rate * 100).toFixed(0)}% · Ricavi{" "}
                {formatCurrency(campaign.revenue_generated)}
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4 text-sm text-zinc-300">
              <p className="font-medium text-zinc-100">Stack consigliato</p>
              <p className="mt-2">
                Deploy su {platformReadiness.deployment}, auth e dati su Firebase, monetizzazione con
                Stripe Checkout e webhook.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Perché questo prodotto è vendibile ad abbonamento</CardTitle>
          <Link href="/settings" className="text-sm text-amber-400 hover:text-amber-300 flex items-center gap-1">
            Vedi piano SaaS <ArrowRight className="h-3 w-3" />
          </Link>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            "Gestione operativa quotidiana che crea dipendenza d'uso.",
            "Funzioni Pro facili da sbloccare: referral, team, multi-sede, analytics.",
            "Stripe abilita MRR e fee ricorrenti senza aumentare il lavoro manuale.",
          ].map((item) => (
            <div key={item} className="rounded-lg border border-zinc-800 p-3 text-sm text-zinc-300">
              {item}
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
