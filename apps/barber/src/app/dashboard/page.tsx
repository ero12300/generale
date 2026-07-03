"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  Wallet,
  CalendarDays,
  Users,
  Bell,
  TrendingUp,
  Scissors,
  ArrowRight,
  Crown,
} from "lucide-react";
import { PageHeader } from "@/components/dashboard/shell";
import { Card, CardTitle, StatCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RevenueBars } from "@/components/dashboard/bar-chart";
import { ProBadgeInline } from "@/components/dashboard/pro-gate";
import { useStore } from "@/lib/store/store-context";
import { eur } from "@/lib/money";
import {
  computeKpis,
  last7DaysRevenue,
  topServices,
  revenueByBarber,
} from "@/lib/analytics";
import { STATUS_LABEL, STATUS_TONE } from "@/lib/labels";
import { formatTime, isSameDay } from "@/lib/utils";

export default function DashboardOverview() {
  const { state, updateBookingStatus } = useStore();
  const isPro = state.subscription.plan === "pro";

  const kpis = useMemo(() => computeKpis(state.bookings, state.clients), [state.bookings, state.clients]);
  const chart = useMemo(() => last7DaysRevenue(state.bookings), [state.bookings]);
  const services = useMemo(() => topServices(state.bookings, 4), [state.bookings]);
  const barbers = useMemo(() => {
    const start = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const end = new Date();
    return revenueByBarber(state.bookings, start, end);
  }, [state.bookings]);

  const todayAppointments = useMemo(
    () =>
      state.bookings
        .filter((b) => isSameDay(b.start, new Date()) && b.status !== "annullata")
        .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()),
    [state.bookings],
  );

  const pending = state.bookings.filter((b) => b.status === "richiesta");

  return (
    <div className="p-5 md:p-8">
      <PageHeader
        title={`Ciao, ${state.settings.ownerName} 👋`}
        subtitle={`Ecco come sta andando ${state.settings.shopName} oggi.`}
        actions={
          <Link href="/dashboard/prenotazioni">
            <Button size="sm"><CalendarDays size={16} /> Nuovo appuntamento</Button>
          </Link>
        }
      />

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Incasso oggi" value={eur(kpis.todayRevenueCents)} icon={<Wallet size={18} />} accent hint="Servizi pagati oggi" />
        <StatCard label="Incasso mese" value={eur(kpis.monthRevenueCents)} icon={<TrendingUp size={18} />} hint={`${kpis.completedThisMonth} servizi completati`} />
        <StatCard label="Appuntamenti oggi" value={String(kpis.todayBookings)} icon={<CalendarDays size={18} />} hint={`${pending.length} da confermare`} />
        <StatCard label="Ticket medio" value={eur(kpis.avgTicketCents)} icon={<Users size={18} />} hint={`${kpis.activeClients} clienti in rubrica`} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Chart */}
        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <CardTitle>Incassi ultimi 7 giorni</CardTitle>
            <Badge tone="green">+{eur(chart.reduce((s, d) => s + d.cents, 0))}</Badge>
          </div>
          <RevenueBars data={chart} />
        </Card>

        {/* Pending requests */}
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <CardTitle>Richieste online</CardTitle>
            <Bell size={18} className="text-[var(--gold)]" />
          </div>
          {pending.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted">Nessuna richiesta in attesa 🎉</p>
          ) : (
            <div className="space-y-3">
              {pending.slice(0, 4).map((b) => (
                <div key={b.id} className="rounded-xl border border-border bg-surface-2 p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{b.clientName}</span>
                    <span className="text-xs text-muted">{formatTime(b.start)}</span>
                  </div>
                  <div className="mt-0.5 text-xs text-muted">{b.serviceName} · {b.barberName}</div>
                  <div className="mt-2 flex gap-2">
                    <Button size="sm" className="flex-1" onClick={() => updateBookingStatus(b.id, "confermata")}>
                      Conferma
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => updateBookingStatus(b.id, "annullata")}>
                      Rifiuta
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Today's agenda */}
        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <CardTitle>Agenda di oggi</CardTitle>
            <Link href="/dashboard/prenotazioni" className="inline-flex items-center gap-1 text-sm text-[var(--gold-soft)] hover:underline">
              Vedi tutto <ArrowRight size={14} />
            </Link>
          </div>
          {todayAppointments.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted">Nessun appuntamento per oggi.</p>
          ) : (
            <div className="space-y-2.5">
              {todayAppointments.map((b) => (
                <div key={b.id} className="flex items-center gap-3 rounded-xl border border-border bg-surface-2 px-3 py-2.5">
                  <span className="w-14 text-sm font-semibold tabular-nums text-[var(--gold-soft)]">{formatTime(b.start)}</span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium">{b.clientName}</div>
                    <div className="truncate text-xs text-muted">{b.serviceName} · {b.barberName}</div>
                  </div>
                  <Badge tone={STATUS_TONE[b.status]}>{STATUS_LABEL[b.status]}</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Top services */}
        <Card>
          <CardTitle className="mb-4">Servizi top del mese</CardTitle>
          {services.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted">Nessun dato ancora.</p>
          ) : (
            <div className="space-y-3">
              {services.map((s) => (
                <div key={s.serviceId} className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm">
                    <Scissors size={14} className="text-[var(--gold)]" /> {s.serviceName}
                  </span>
                  <span className="text-sm text-muted">{s.count}× · {eur(s.revenueCents)}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Barber performance (Pro) */}
      <Card className="mt-6">
        <div className="mb-4 flex items-center gap-2">
          <CardTitle>Rendimento per barbiere</CardTitle>
          {!isPro && <ProBadgeInline />}
        </div>
        {isPro ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {barbers.map((b) => (
              <div key={b.barberId} className="rounded-xl border border-border bg-surface-2 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{b.barberName}</span>
                  <span className="font-semibold text-[var(--gold-soft)]">{eur(b.revenueCents)}</span>
                </div>
                <div className="mt-1 text-xs text-muted">{b.count} servizi completati</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-between rounded-xl border border-[var(--gold-deep)]/40 bg-[var(--gold)]/8 p-4">
            <p className="text-sm text-muted">Scopri chi rende di più con le analytics avanzate.</p>
            <Link href="/dashboard/abbonamento">
              <Button size="sm" variant="outline"><Crown size={14} /> Sblocca Pro</Button>
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
}
