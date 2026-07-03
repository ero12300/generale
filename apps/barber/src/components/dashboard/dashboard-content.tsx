"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  ArrowDownRight,
  CalendarCheck2,
  Wallet,
  Users,
  Star,
  Clock,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { demoStore } from "@/lib/demo-store";
import { formatCurrency, formatTime, initials, cn } from "@/lib/utils";
import type { Booking, Client, Transaction } from "@/types";

function todayRange(): { start: Date; end: Date } {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start, end };
}

function weekRange(): { start: Date; end: Date } {
  const now = new Date();
  const day = now.getDay() || 7;
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  start.setDate(now.getDate() - (day - 1));
  const end = new Date(start);
  end.setDate(end.getDate() + 7);
  return { start, end };
}

function monthRange(): { start: Date; end: Date } {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return { start, end };
}

function sumTx(txs: Transaction[], range: { start: Date; end: Date }) {
  return txs
    .filter((t) => {
      const d = new Date(t.createdAt);
      return d >= range.start && d < range.end;
    })
    .reduce((acc, t) => acc + t.amount + t.tipAmount - t.discountAmount, 0);
}

function bookingsToday(bookings: Booking[]) {
  const { start, end } = todayRange();
  return bookings.filter((b) => {
    const d = new Date(b.startAt);
    return d >= start && d < end;
  });
}

function occupancyToday(bookings: Booking[]): number {
  const list = bookingsToday(bookings);
  const totalMinutes = list.reduce((acc, b) => {
    return acc + (new Date(b.endAt).getTime() - new Date(b.startAt).getTime()) / 60_000;
  }, 0);
  const workDayMinutes = 10 * 60;
  return Math.min(100, Math.round((totalMinutes / workDayMinutes) * 100));
}

export function DashboardContent() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setBookings(demoStore.listBookings());
    setTransactions(demoStore.listTransactions());
    setClients(demoStore.listClients());
    setMounted(true);
  }, []);

  const revenue = useMemo(() => {
    const today = sumTx(transactions, todayRange());
    const yesterday = (() => {
      const start = new Date();
      start.setDate(start.getDate() - 1);
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setDate(end.getDate() + 1);
      return sumTx(transactions, { start, end });
    })();
    const week = sumTx(transactions, weekRange());
    const month = sumTx(transactions, monthRange());
    const dayDelta = yesterday === 0 ? 0 : ((today - yesterday) / yesterday) * 100;
    return { today, week, month, dayDelta };
  }, [transactions]);

  const todayBookings = useMemo(() => bookingsToday(bookings), [bookings]);
  const occupancy = useMemo(() => occupancyToday(bookings), [bookings]);
  const newClientsWeek = useMemo(() => {
    const { start } = weekRange();
    return clients.filter((c) => new Date(c.createdAt) >= start).length;
  }, [clients]);

  const topClients = useMemo(() => {
    return [...clients].sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 5);
  }, [clients]);

  const revenueByDay = useMemo(() => {
    const map = new Map<string, number>();
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - i);
      map.set(d.toISOString().slice(0, 10), 0);
    }
    for (const t of transactions) {
      const key = new Date(t.createdAt).toISOString().slice(0, 10);
      if (map.has(key)) {
        map.set(key, (map.get(key) ?? 0) + t.amount + t.tipAmount - t.discountAmount);
      }
    }
    return Array.from(map.entries()).map(([date, value]) => ({ date, value }));
  }, [transactions]);

  const maxRevenue = Math.max(...revenueByDay.map((r) => r.value), 1);

  const statusStyles: Record<Booking["status"], string> = {
    pending: "bg-amber-500/10 text-amber-300 border-amber-500/20",
    confirmed: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
    in_progress: "bg-gold-400/15 text-gold-200 border-gold-400/30",
    completed: "bg-blue-500/10 text-blue-300 border-blue-500/20",
    cancelled: "bg-rose-500/10 text-rose-300 border-rose-500/20",
    no_show: "bg-white/5 text-ink-300 border-white/10",
  };

  const statusLabel: Record<Booking["status"], string> = {
    pending: "In attesa",
    confirmed: "Confermato",
    in_progress: "In corso",
    completed: "Completato",
    cancelled: "Annullato",
    no_show: "No-show",
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <PageHeader
        title={<>Bentornato, <span className="gradient-text italic">Antonio</span>.</>}
        description="Ecco come sta andando il tuo salone oggi."
        action={
          <Button asChild>
            <Link href="/prenotazioni">Nuova prenotazione</Link>
          </Button>
        }
      />

      {/* KPI cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <KpiCard
          icon={<Wallet className="h-4 w-4" />}
          label="Incassi oggi"
          value={mounted ? formatCurrency(revenue.today) : "—"}
          delta={revenue.dayDelta}
          hint={revenue.dayDelta >= 0 ? "vs. ieri" : "vs. ieri"}
        />
        <KpiCard
          icon={<CalendarCheck2 className="h-4 w-4" />}
          label="Prenotazioni oggi"
          value={mounted ? `${todayBookings.length}` : "—"}
          delta={occupancy - 50}
          hint={`Occupazione ${occupancy}%`}
        />
        <KpiCard
          icon={<TrendingUp className="h-4 w-4" />}
          label="Fatturato settimana"
          value={mounted ? formatCurrency(revenue.week) : "—"}
          hint={`Mese: ${mounted ? formatCurrency(revenue.month) : "—"}`}
        />
        <KpiCard
          icon={<Users className="h-4 w-4" />}
          label="Nuovi clienti (7g)"
          value={mounted ? `${newClientsWeek}` : "—"}
          hint={`Totale rubrica: ${clients.length}`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        {/* Revenue trend */}
        <div className="lg:col-span-2 surface rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-xs text-ink-400 uppercase tracking-widest">Ultimi 7 giorni</div>
              <div className="font-display text-2xl text-ink-50 mt-1">Andamento incassi</div>
            </div>
            <Badge variant="gold"><TrendingUp className="h-3 w-3" /> Trend positivo</Badge>
          </div>
          <div className="h-56 flex items-end gap-2">
            {revenueByDay.map((r, i) => {
              const height = Math.max(4, Math.round((r.value / maxRevenue) * 100));
              const label = new Date(r.date).toLocaleDateString("it-IT", { weekday: "short" });
              return (
                <motion.div
                  key={r.date}
                  className="flex-1 flex flex-col items-center gap-2 group"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <div className="w-full flex-1 flex items-end">
                    <div
                      className="w-full rounded-t-md bg-gradient-to-t from-gold-500/60 via-gold-400/80 to-gold-300 group-hover:from-gold-500/80 group-hover:via-gold-400 group-hover:to-gold-200 transition-colors relative shadow-[0_0_20px_-5px_rgba(212,167,44,0.5)]"
                      style={{ height: `${height}%` }}
                      title={formatCurrency(r.value)}
                    >
                      <div className="absolute inset-x-0 -top-6 text-[10px] text-ink-300 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                        {formatCurrency(r.value)}
                      </div>
                    </div>
                  </div>
                  <div className="text-[10px] text-ink-400 uppercase">{label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Top clients */}
        <div className="surface rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-xs text-ink-400 uppercase tracking-widest">Top clienti</div>
              <div className="font-display text-2xl text-ink-50 mt-1">I tuoi VIP</div>
            </div>
            <Star className="h-4 w-4 text-gold-300" />
          </div>
          <div className="space-y-3">
            {topClients.map((c, idx) => (
              <div key={c.id} className="flex items-center gap-3">
                <div className={cn(
                  "grid h-9 w-9 place-items-center rounded-full text-xs font-medium border",
                  idx === 0 ? "bg-gold-400/20 border-gold-400/40 text-gold-100" : "bg-white/5 border-white/10 text-ink-200"
                )}>
                  {initials(c.fullName)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm text-ink-50 truncate">{c.fullName}</div>
                  <div className="text-xs text-ink-400">{c.totalVisits} visite</div>
                </div>
                <div className="text-sm text-ink-100 font-medium">{formatCurrency(c.totalSpent)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Today's schedule */}
      <div className="surface rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-xs text-ink-400 uppercase tracking-widest">Oggi</div>
            <div className="font-display text-2xl text-ink-50 mt-1">Agenda del giorno</div>
          </div>
          <Button variant="secondary" size="sm" asChild>
            <Link href="/prenotazioni">Vedi tutte</Link>
          </Button>
        </div>
        {todayBookings.length === 0 ? (
          <div className="text-center py-12 text-ink-400">
            <Sparkles className="h-6 w-6 mx-auto text-gold-300 mb-2 opacity-60" />
            <p>Nessuna prenotazione oggi. Goditi la giornata.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {todayBookings.map((b) => (
              <div
                key={b.id}
                className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-3 hover:border-white/10 hover:bg-white/[0.04] transition-colors"
              >
                <div className="w-14 text-center">
                  <div className="font-display text-lg text-ink-50">{formatTime(b.startAt)}</div>
                  <div className="text-[10px] text-ink-400 uppercase">
                    {Math.round((new Date(b.endAt).getTime() - new Date(b.startAt).getTime()) / 60_000)} min
                  </div>
                </div>
                <div className="grid h-10 w-10 place-items-center rounded-full bg-gold-400/10 border border-gold-400/20 text-gold-200 text-xs font-medium">
                  {initials(b.clientName)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm text-ink-50 font-medium truncate">{b.clientName}</div>
                  <div className="text-xs text-ink-400 truncate">{b.serviceName}</div>
                </div>
                <div className="hidden md:block text-sm text-ink-100 font-medium">
                  {formatCurrency(b.price)}
                </div>
                <div className={cn("hidden md:inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium border", statusStyles[b.status])}>
                  <Clock className="h-3 w-3" />
                  {statusLabel[b.status]}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function KpiCard({
  icon,
  label,
  value,
  delta,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  delta?: number;
  hint?: string;
}) {
  const positive = delta === undefined ? undefined : delta >= 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="surface rounded-2xl p-5 relative overflow-hidden"
    >
      <div className="flex items-center justify-between text-ink-400">
        <span className="inline-flex items-center gap-2 text-xs uppercase tracking-widest">
          <span className="text-gold-300">{icon}</span>
          {label}
        </span>
      </div>
      <div className="mt-3 font-display text-3xl text-ink-50 tracking-tight">{value}</div>
      <div className="mt-2 flex items-center gap-2 text-xs">
        {delta !== undefined && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 font-medium",
              positive ? "text-emerald-400" : "text-rose-400"
            )}
          >
            {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {Math.abs(delta).toFixed(0)}%
          </span>
        )}
        {hint && <span className="text-ink-400">{hint}</span>}
      </div>
    </motion.div>
  );
}
