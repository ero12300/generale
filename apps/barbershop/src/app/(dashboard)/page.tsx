"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getDashboardStats, getRevenueData, getTodayBookings } from "@/lib/firestore";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookingStatusBadge } from "@/components/ui/badge";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  TrendingUp,
  Calendar,
  Users,
  Wallet,
  Clock,
  ArrowUpRight,
  Scissors,
  Star,
} from "lucide-react";
import type { DashboardStats, RevenueData, Booking } from "@/types";
import { format } from "date-fns";
import { it } from "date-fns/locale";

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ElementType;
  trend?: { value: number; label: string };
  gold?: boolean;
}

function StatCard({ title, value, subtitle, icon: Icon, trend, gold }: StatCardProps) {
  return (
    <Card className={`${gold ? "gradient-border gold-glow" : ""} hover:border-[var(--primary)]/30 transition-all duration-300`}>
      <CardContent className="pt-5">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs text-[var(--muted)] font-medium uppercase tracking-wider mb-3">{title}</p>
            <p className={`text-2xl font-bold ${gold ? "text-gold" : "text-[var(--foreground)]"}`}>{value}</p>
            {subtitle && <p className="text-xs text-[var(--muted)] mt-1">{subtitle}</p>}
            {trend && (
              <div className="flex items-center gap-1 mt-2">
                <ArrowUpRight className="w-3 h-3 text-green-400" />
                <span className="text-xs text-green-400 font-medium">+{trend.value}%</span>
                <span className="text-xs text-[var(--muted)]">{trend.label}</span>
              </div>
            )}
          </div>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${gold ? "bg-[var(--primary)]/10" : "bg-[var(--accent)]"}`}>
            <Icon className={`w-5 h-5 ${gold ? "text-[var(--primary)]" : "text-[var(--muted)]"}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card rounded-lg p-3 text-xs">
        <p className="text-[var(--muted)] mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color }} className="font-medium">
            {p.name}: {p.name === "Incasso" ? formatCurrency(p.value * 100) : p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  const { shop } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [todayBookings, setTodayBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!shop?.id) return;
    async function load() {
      setLoading(true);
      const [s, r, b] = await Promise.all([
        getDashboardStats(shop!.id),
        getRevenueData(shop!.id, 14),
        getTodayBookings(shop!.id),
      ]);
      setStats(s);
      setRevenueData(r);
      setTodayBookings(b);
      setLoading(false);
    }
    load();
  }, [shop?.id]);

  const chartData = revenueData.map((d) => ({
    data: format(new Date(d.date), "dd/MM"),
    Incasso: d.revenue / 100,
    Prenotazioni: d.bookings,
  }));

  const today = format(new Date(), "EEEE d MMMM yyyy", { locale: it });

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-[var(--muted)] uppercase tracking-wider mb-1 capitalize">{today}</p>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">
            Buongiorno, {shop?.name?.split(" ").slice(-1)[0] ?? "Barbiere"} 👋
          </h1>
          <p className="text-sm text-[var(--muted)] mt-1">Ecco il riepilogo di oggi</p>
        </div>
        {shop?.plan === "pro" && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/20">
            <Star className="w-3.5 h-3.5 fill-[var(--primary)] text-[var(--primary)]" />
            <span className="text-xs font-semibold text-[var(--primary)]">Pro</span>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="shimmer h-28" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Incasso Oggi"
            value={formatCurrency((stats?.todayRevenue ?? 0) * 100)}
            subtitle={`Questo mese: ${formatCurrency((stats?.monthRevenue ?? 0) * 100)}`}
            icon={Wallet}
            gold
          />
          <StatCard
            title="Prenotazioni Oggi"
            value={String(stats?.todayBookings ?? 0)}
            subtitle={`${stats?.pendingBookings ?? 0} in attesa`}
            icon={Calendar}
          />
          <StatCard
            title="Nuovi Clienti"
            value={String(stats?.monthNewClients ?? 0)}
            subtitle={`${stats?.totalClients ?? 0} totali`}
            icon={Users}
          />
          <StatCard
            title="Prenotazioni Mese"
            value={String(stats?.monthBookings ?? 0)}
            subtitle="Completate"
            icon={TrendingUp}
          />
        </div>
      )}

      {/* Charts + Today Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Incassi ultimi 14 giorni</span>
              <TrendingUp className="w-4 h-4 text-[var(--primary)]" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c9a84c" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#c9a84c" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="data" tick={{ fill: "var(--muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "var(--muted)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `€${v}`} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="Incasso"
                  stroke="#c9a84c"
                  strokeWidth={2}
                  fill="url(#goldGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Today Bookings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Oggi</span>
              <Clock className="w-4 h-4 text-[var(--muted)]" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {todayBookings.length === 0 ? (
              <div className="py-8 text-center">
                <Scissors className="w-8 h-8 text-[var(--border)] mx-auto mb-2" />
                <p className="text-sm text-[var(--muted)]">Nessuna prenotazione</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {todayBookings.map((b) => (
                  <div
                    key={b.id}
                    className="flex items-start justify-between p-3 rounded-lg bg-[var(--accent)] border border-[var(--border)] hover:border-[var(--primary)]/30 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--foreground)] truncate">{b.clientName}</p>
                      <p className="text-xs text-[var(--muted)]">
                        {b.startTime} · {b.serviceName}
                      </p>
                    </div>
                    <BookingStatusBadge status={b.status} />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Upsell Pro (if free) */}
      {shop?.plan === "free" && (
        <div className="relative overflow-hidden rounded-xl border border-[var(--primary)]/30 bg-gradient-to-r from-[var(--primary)]/5 via-transparent to-[var(--primary)]/5 p-6">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--primary)]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 fill-[var(--primary)] text-[var(--primary)]" />
                <span className="text-xs font-semibold text-[var(--primary)] uppercase tracking-wider">BarberPro</span>
              </div>
              <h3 className="text-base font-bold text-[var(--foreground)]">Sblocca tutte le funzionalità</h3>
              <p className="text-sm text-[var(--muted)] mt-1">
                Clienti illimitati · Campagne · Prenotazioni online · Report avanzati
              </p>
            </div>
            <a
              href="/dashboard/subscription"
              className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-[var(--primary-dark)] to-[var(--primary)] text-black font-semibold text-sm hover:from-[var(--primary)] hover:to-[var(--primary-light)] transition-all shadow-lg shadow-[var(--primary)]/20"
            >
              Prova gratis 14 giorni
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
