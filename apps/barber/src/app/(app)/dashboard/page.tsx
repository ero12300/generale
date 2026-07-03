"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  CalendarDays,
  Clock,
  Euro,
  Receipt,
  TrendingUp,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart } from "@/components/ui/bar-chart";
import { apiGet } from "@/lib/client-api";
import { formatCurrency, formatCurrencyShort, formatTime } from "@/lib/utils";
import type { Booking, Client, RevenueSummary } from "@/lib/types";

interface RevenuePayload {
  summary: RevenueSummary;
}

export default function DashboardPage() {
  const [summary, setSummary] = useState<RevenueSummary | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      apiGet<RevenuePayload>("/api/revenue"),
      apiGet<Booking[]>("/api/bookings"),
      apiGet<Client[]>("/api/clients"),
    ])
      .then(([rev, bk, cl]) => {
        setSummary(rev.summary);
        setBookings(bk);
        setClients(cl);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const now = new Date();
  const todayBookings = bookings
    .filter(
      (b) =>
        new Date(b.start).toDateString() === now.toDateString() &&
        b.status !== "cancelled"
    )
    .slice(0, 6);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <p className="rounded-lg border border-red-600/40 bg-red-600/10 px-4 py-3 text-red-300">
        {error}
      </p>
    );
  }

  const stats = [
    {
      label: "Incasso oggi",
      value: formatCurrency(summary?.today ?? 0),
      icon: Euro,
      sub: `${summary?.todayCount ?? 0} servizi`,
    },
    {
      label: "Ultimi 7 giorni",
      value: formatCurrency(summary?.week ?? 0),
      icon: TrendingUp,
      sub: "settimana in corso",
    },
    {
      label: "Incasso mese",
      value: formatCurrency(summary?.month ?? 0),
      icon: Receipt,
      sub: `ticket medio ${formatCurrencyShort(summary?.averageTicket ?? 0)}`,
    },
    {
      label: "Clienti totali",
      value: String(clients.length),
      icon: Users,
      sub: `${clients.filter((c) => c.tags.includes("VIP")).length} VIP`,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Buongiorno 👋</h1>
          <p className="mt-1 text-zinc-400">Ecco come sta andando il tuo salone oggi.</p>
        </div>
        <Link
          href="/agenda"
          className="inline-flex items-center gap-1.5 text-sm text-gold-soft hover:text-gold"
        >
          Vai all&apos;agenda <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, sub }) => (
          <Card key={label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">{label}</span>
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#c9a24b]/15 text-gold-soft">
                  <Icon className="h-4 w-4" />
                </span>
              </div>
              <p className="mt-3 font-display text-2xl font-bold">{value}</p>
              <p className="mt-1 text-xs text-zinc-500">{sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Andamento incassi — ultimi 7 giorni</CardTitle>
          </CardHeader>
          <CardContent>
            {summary && <BarChart data={summary.last7Days} />}
            <div className="mt-6 grid grid-cols-3 gap-3 text-center">
              <MethodStat label="Contanti" value={summary?.byMethod.contanti ?? 0} />
              <MethodStat label="Carta" value={summary?.byMethod.carta ?? 0} />
              <MethodStat label="Altro" value={summary?.byMethod.altro ?? 0} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-gold-soft" /> Oggi in agenda
            </CardTitle>
            <Badge variant="secondary">{todayBookings.length}</Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            {todayBookings.length === 0 && (
              <p className="text-sm text-zinc-500">Nessun appuntamento per oggi.</p>
            )}
            {todayBookings.map((b) => (
              <div
                key={b.id}
                className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/40 p-3"
              >
                <div className="flex flex-col items-center rounded-lg bg-[#c9a24b]/10 px-2.5 py-1.5 text-gold-soft">
                  <Clock className="h-3.5 w-3.5" />
                  <span className="text-xs font-semibold">{formatTime(b.start)}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{b.clientName}</p>
                  <p className="truncate text-xs text-zinc-500">
                    {b.serviceName}
                    {b.staffName ? ` · ${b.staffName}` : ""}
                  </p>
                </div>
                <Badge variant={b.status === "confirmed" ? "success" : "warning"}>
                  {b.status === "confirmed" ? "Confermato" : "Da confermare"}
                </Badge>
              </div>
            ))}
            <Link
              href="/agenda"
              className="block pt-1 text-center text-sm text-gold-soft hover:text-gold"
            >
              Gestisci agenda →
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MethodStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="mt-1 font-semibold text-zinc-100">{formatCurrencyShort(value)}</p>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="h-10 w-56 animate-pulse rounded-lg bg-zinc-800" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-2xl bg-zinc-800/60" />
        ))}
      </div>
      <div className="h-64 animate-pulse rounded-2xl bg-zinc-800/60" />
    </div>
  );
}
