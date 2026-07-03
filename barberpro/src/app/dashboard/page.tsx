"use client";

import Link from "next/link";
import { Wallet, CalendarDays, Users, Receipt, ArrowRight, Clock } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useWorkspace } from "@/lib/store/WorkspaceProvider";
import {
  revenueToday,
  revenueThisMonth,
  revenueLastMonth,
  dailyRevenue,
  upcomingBookings,
  averageTicket,
  percentChange,
} from "@/lib/analytics";
import { formatCents, formatDateTime } from "@/lib/format";

export default function OverviewPage() {
  const ws = useWorkspace();

  const today = revenueToday(ws.payments);
  const thisMonth = revenueThisMonth(ws.payments);
  const lastMonth = revenueLastMonth(ws.payments);
  const monthChange = percentChange(thisMonth, lastMonth);
  const daily = dailyRevenue(ws.payments, 30);
  const upcoming = upcomingBookings(ws.bookings);
  const avg = averageTicket(ws.payments);

  return (
    <div>
      <PageHeader
        title={`Ciao, ${ws.settings.ownerName || "Barbiere"}`}
        subtitle={`Ecco come sta andando ${ws.settings.shopName}`}
        action={
          <Link href="/dashboard/bookings" className="btn-gold">
            Nuova prenotazione
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Incasso oggi" value={formatCents(today)} icon={Wallet} hint="Netto di sconti" />
        <StatCard label="Incasso mese" value={formatCents(thisMonth)} icon={Receipt} change={monthChange} />
        <StatCard
          label="Prenotazioni future"
          value={String(upcoming.length)}
          icon={CalendarDays}
          hint="Confermate e in attesa"
        />
        <StatCard label="Clienti totali" value={String(ws.clients.length)} icon={Users} hint={`Ticket medio ${formatCents(avg)}`} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl text-cream">Andamento incassi</h2>
              <p className="text-sm text-cream/50">Ultimi 30 giorni</p>
            </div>
            <Link href="/dashboard/revenue" className="text-sm text-gold-soft hover:underline">
              Dettagli
            </Link>
          </div>
          <RevenueChart data={daily} />
        </div>

        <div className="card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl text-cream">Prossimi appuntamenti</h2>
            <Link href="/dashboard/bookings" className="text-sm text-gold-soft hover:underline">
              Tutti
            </Link>
          </div>
          {upcoming.length === 0 ? (
            <p className="py-8 text-center text-sm text-cream/40">Nessun appuntamento in programma.</p>
          ) : (
            <ul className="space-y-3">
              {upcoming.map((b) => (
                <li key={b.id} className="flex items-center gap-3 rounded-xl border border-ink-line bg-ink-soft/50 p-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-gold/20 bg-gold/5 text-gold-soft">
                    <Clock className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-cream">{b.clientName}</p>
                    <p className="truncate text-xs text-cream/50">
                      {b.serviceName} · {formatDateTime(b.start)}
                    </p>
                  </div>
                  <StatusBadge status={b.status} />
                </li>
              ))}
            </ul>
          )}
          <Link
            href="/book"
            target="_blank"
            className="btn-ghost mt-4 w-full text-xs"
          >
            Condividi link prenotazioni <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
