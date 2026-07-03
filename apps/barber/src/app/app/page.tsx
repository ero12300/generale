"use client";

import { Topbar } from "@/components/app/topbar";
import { StatCard } from "@/components/app/stat-card";
import { useStore } from "@/components/providers/data-provider";
import { useAuth } from "@/components/providers/auth-provider";
import { useOpenNav } from "@/app/app/nav-context";
import { Wallet, CalendarClock, Users, TrendingUp, Sparkles, ExternalLink, Copy } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateIT, formatEUR, formatTimeIT, initials } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { useMemo } from "react";
import { useToast } from "@/components/providers/toast-provider";
import { Badge } from "@/components/ui/badge";
import { appUrl } from "@/lib/env";

export default function DashboardPage() {
  const store = useStore();
  const { user } = useAuth();
  const openNav = useOpenNav();
  const toast = useToast();
  const summary = store.summary();

  const chartData = useMemo(
    () =>
      summary.last7Days.map((d) => ({
        name: new Date(d.date).toLocaleDateString("it-IT", { weekday: "short" }),
        Incasso: Math.round(d.revenueEur),
        Prenotazioni: d.bookings,
      })),
    [summary],
  );

  const nextBookings = store.bookings
    .filter((b) => new Date(b.startAt) >= new Date() && (b.status === "confirmed" || b.status === "pending"))
    .sort((a, b) => a.startAt.localeCompare(b.startAt))
    .slice(0, 6);

  const publicLink = `${appUrl.replace(/\/$/, "")}/book/${store.shop.slug}`;

  return (
    <>
      <Topbar
        title={`Ciao ${user?.displayName?.split(" ")[0] ?? "barbiere"} 👋`}
        subtitle="Ecco cosa succede oggi nel tuo barbershop."
        onOpenNav={openNav}
        action={
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href={`/book/${store.shop.slug}`} target="_blank">
                <ExternalLink className="h-4 w-4" />
                <span className="hidden sm:inline">Pagina pubblica</span>
              </Link>
            </Button>
            <Button variant="gold" asChild>
              <Link href="/app/prenotazioni?new=1">
                <Sparkles className="h-4 w-4" />
                Nuova prenotazione
              </Link>
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Incasso oggi"
          value={formatEUR(summary.todayRevenueEur)}
          hint={`${summary.todayBookings} prenotazioni oggi`}
          icon={<Wallet className="h-4 w-4" />}
          accent="gold"
        />
        <StatCard
          label="Incasso settimana"
          value={formatEUR(summary.weekRevenueEur)}
          hint="lun → dom"
          icon={<TrendingUp className="h-4 w-4" />}
          accent="emerald"
        />
        <StatCard
          label="Incasso mese"
          value={formatEUR(summary.monthRevenueEur)}
          hint={new Date().toLocaleDateString("it-IT", { month: "long", year: "numeric" })}
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <StatCard
          label="Clienti totali"
          value={String(summary.clientsCount)}
          hint={`${summary.upcomingCount} prenotazioni future`}
          icon={<Users className="h-4 w-4" />}
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Ultimi 7 giorni</CardTitle>
              <CardDescription>Andamento incassi e prenotazioni</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 8, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#e7bb47" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#8f6613" stopOpacity={0.5} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "rgba(20,17,25,0.95)",
                    border: "1px solid rgba(231,187,71,0.25)",
                    borderRadius: 12,
                    color: "#fff",
                  }}
                  cursor={{ fill: "rgba(231,187,71,0.06)" }}
                  formatter={(value: number, name: string) => [name === "Incasso" ? formatEUR(value) : value, name]}
                />
                <Bar dataKey="Incasso" fill="url(#gold)" radius={[8, 8, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Prossime prenotazioni</CardTitle>
              <CardDescription>Le prime 6 confermate</CardDescription>
            </div>
            <Badge tone="gold">{nextBookings.length}</Badge>
          </CardHeader>
          <CardContent>
            {nextBookings.length === 0 ? (
              <div className="rounded-xl border border-dashed border-white/10 p-6 text-center text-sm text-white/50">
                Nessuna prenotazione futura.
              </div>
            ) : (
              <ul className="divide-y divide-white/5">
                {nextBookings.map((b) => (
                  <li key={b.id} className="flex items-center gap-3 py-3">
                    <div className="grid h-9 w-9 place-items-center rounded-full gold-border font-display text-sm text-[color:var(--color-gold-200)]">
                      {initials(b.clientName)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm text-white">{b.clientName}</div>
                      <div className="truncate text-xs text-white/50">{b.serviceName}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-white">{formatTimeIT(b.startAt)}</div>
                      <div className="text-xs text-white/50">{formatDateIT(b.startAt, { month: "short", day: "2-digit" })}</div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Top servizi</CardTitle>
              <CardDescription>Per ricavi</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {summary.topServices.length === 0 ? (
              <div className="text-sm text-white/50">Ancora nessun incasso registrato.</div>
            ) : (
              <ul className="space-y-3">
                {summary.topServices.map((s) => {
                  const max = summary.topServices[0].revenueEur;
                  const pct = max ? Math.round((s.revenueEur / max) * 100) : 0;
                  return (
                    <li key={s.serviceName}>
                      <div className="flex items-center justify-between text-sm">
                        <div className="text-white/80">{s.serviceName}</div>
                        <div className="text-white/60">{formatEUR(s.revenueEur)} · {s.count}×</div>
                      </div>
                      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                        <div className="h-full rounded-full bg-gradient-to-r from-[color:var(--color-gold-300)] to-[color:var(--color-gold-500)]" style={{ width: `${pct}%` }} />
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Il tuo link pubblico prenotazioni</CardTitle>
              <CardDescription>Mettilo su Instagram, WhatsApp, in bio, ovunque.</CardDescription>
            </div>
            <Badge tone="gold">
              <CalendarClock className="h-3 w-3" />
              Pubblico
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3 rounded-xl border border-white/10 bg-black/30 p-4 md:flex-row md:items-center">
              <code className="flex-1 truncate font-mono text-sm text-[color:var(--color-gold-200)]">
                {publicLink}
              </code>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(publicLink);
                      toast.success("Link copiato", "Incollalo dove vuoi");
                    } catch {
                      toast.error("Copia non riuscita");
                    }
                  }}
                >
                  <Copy className="h-4 w-4" /> Copia
                </Button>
                <Button variant="gold" asChild>
                  <Link href={`/book/${store.shop.slug}`} target="_blank">
                    Apri <ExternalLink className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
            <p className="mt-3 text-xs text-white/50">
              La pagina mostra orari, servizi e slot liberi in tempo reale. In modalità demo è già viva sul tuo browser.
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
