"use client";

import Link from "next/link";
import {
  Wallet,
  CalendarCheck,
  Users,
  TrendingUp,
  Crown,
  ArrowRight,
} from "lucide-react";
import { useStore } from "@/lib/store";
import {
  revenueToday,
  revenueInLastDays,
  dailyRevenueSeries,
  averageTicket,
  bookingsToday,
  topClients,
} from "@/lib/analytics";
import { formatCents } from "@/lib/money";
import { formatTime, initials } from "@/lib/utils";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { RevenueBarChart } from "@/components/shared/bar-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookingStatusBadge } from "@/components/shared/status";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const { data } = useStore();
  const { payments, bookings, clients, subscription } = data;

  const today = revenueToday(payments);
  const last30 = revenueInLastDays(payments, 30);
  const series = dailyRevenueSeries(payments, 14);
  const avg = averageTicket(payments);
  const todaysBookings = bookingsToday(bookings);
  const tops = topClients(clients, 5);

  return (
    <div>
      <PageHeader
        title={`Ciao, ${data.organization.ownerName} 👋`}
        subtitle="Ecco l'andamento del tuo barbershop di oggi."
      />

      {subscription.status === "trialing" && (
        <div className="mb-6 flex flex-col items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Crown className="h-5 w-5 text-amber-400" />
            <p className="text-sm text-amber-100">
              Sei in prova <strong>Pro</strong>. Tutte le funzioni premium sono sbloccate.
            </p>
          </div>
          <Link
            href="/abbonamento"
            className="text-sm font-semibold text-amber-300 hover:text-amber-200"
          >
            Gestisci abbonamento →
          </Link>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Incasso oggi" value={formatCents(today)} icon={Wallet} />
        <StatCard label="Incasso 30 giorni" value={formatCents(last30)} icon={TrendingUp} />
        <StatCard
          label="Appuntamenti oggi"
          value={String(todaysBookings.length)}
          icon={CalendarCheck}
        />
        <StatCard
          label="Scontrino medio"
          value={formatCents(avg)}
          icon={Users}
          hint={`${clients.length} clienti totali`}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Incassi ultimi 14 giorni</CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueBarChart data={series} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Agenda di oggi</CardTitle>
              <Link
                href="/prenotazioni"
                className="inline-flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300"
              >
                Tutte <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {todaysBookings.length === 0 && (
              <p className="text-sm text-zinc-500">Nessun appuntamento per oggi.</p>
            )}
            {todaysBookings.map((b) => (
              <div
                key={b.id}
                className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950/40 p-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{b.clientName}</p>
                  <p className="truncate text-xs text-zinc-500">
                    {b.serviceName} · {b.staffName}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-sm font-semibold text-amber-300">
                    {formatTime(b.startAt)}
                  </span>
                  <BookingStatusBadge status={b.status} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Clienti top per spesa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {tops.map((c, i) => (
              <div
                key={c.id}
                className="flex items-center justify-between rounded-lg px-2 py-2 hover:bg-zinc-800/40"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500/15 text-sm font-semibold text-amber-300">
                    {initials(c.name)}
                  </span>
                  <div>
                    <p className="text-sm font-medium">
                      {i === 0 && "🥇 "}
                      {c.name}
                    </p>
                    <p className="text-xs text-zinc-500">{c.visits} visite</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="neutral">{c.loyaltyPoints} punti</Badge>
                  <span className="text-sm font-semibold">
                    {formatCents(c.totalSpentCents)}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
