"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  Calendar,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { dataStore } from "@/lib/data-store";
import type { Booking, DashboardStats } from "@/lib/types";
import { formatEuro, formatTime } from "@/lib/utils";

const chartData = [
  { day: "Lun", incasso: 180 },
  { day: "Mar", incasso: 220 },
  { day: "Mer", incasso: 195 },
  { day: "Gio", incasso: 280 },
  { day: "Ven", incasso: 350 },
  { day: "Sab", incasso: 420 },
  { day: "Dom", incasso: 0 },
];

export function DashboardOverview() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const shop = await dataStore.getShop();
        const [s, b] = await Promise.all([
          dataStore.getStats(shop.id),
          dataStore.getBookings(shop.id),
        ]);
        setStats(s);
        const today = new Date().toISOString().slice(0, 10);
        setBookings(b.filter((bk) => bk.date === today).slice(0, 5));
      } catch {
        setError("Errore nel caricamento dei dati");
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-cream/50">
        Caricamento dashboard...
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-red-400">
        {error ?? "Dati non disponibili"}
      </div>
    );
  }

  const kpis = [
    { label: "Incasso Oggi", value: formatEuro(stats.todayRevenueCents), icon: Wallet, trend: "+12%" },
    { label: "Incasso Mese", value: formatEuro(stats.monthRevenueCents), icon: TrendingUp, trend: "+8%" },
    { label: "Prenotazioni Oggi", value: String(stats.todayBookings), icon: Calendar, trend: null },
    { label: "Clienti Totali", value: String(stats.totalCustomers), icon: Users, trend: "+3" },
  ];

  const statusBadge = (status: Booking["status"]) => {
    const map = {
      pending: { variant: "warning" as const, label: "In attesa" },
      confirmed: { variant: "success" as const, label: "Confermata" },
      completed: { variant: "secondary" as const, label: "Completata" },
      cancelled: { variant: "destructive" as const, label: "Annullata" },
      no_show: { variant: "destructive" as const, label: "No show" },
    };
    const s = map[status];
    return <Badge variant={s.variant}>{s.label}</Badge>;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold mb-1">Dashboard</h1>
        <p className="text-cream/50">Panoramica del tuo salone oggi</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <kpi.icon className="h-5 w-5 text-gold" />
                {kpi.trend && (
                  <span className="text-xs text-emerald-400">{kpi.trend}</span>
                )}
              </div>
              <p className="text-2xl font-bold mb-1">{kpi.value}</p>
              <p className="text-sm text-cream/50">{kpi.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-gold" />
              Incassi Settimanali
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={chartData}>
                <XAxis dataKey="day" stroke="#f5f0e860" fontSize={12} />
                <YAxis stroke="#f5f0e860" fontSize={12} tickFormatter={(v) => `€${v}`} />
                <Tooltip
                  contentStyle={{ background: "#141416", border: "1px solid rgba(201,162,39,0.2)", borderRadius: 8 }}
                  formatter={(value: number) => [`€${value}`, "Incasso"]}
                />
                <Bar dataKey="incasso" fill="#c9a227" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gold" />
              Prenotazioni di Oggi
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/bookings">Vedi tutte</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {bookings.length === 0 ? (
              <p className="text-cream/50 text-sm py-8 text-center">Nessuna prenotazione oggi</p>
            ) : (
              <div className="space-y-3">
                {bookings.map((b) => (
                  <div
                    key={b.id}
                    className="flex items-center justify-between rounded-xl border border-gold/10 bg-charcoal/40 px-4 py-3"
                  >
                    <div>
                      <p className="font-medium text-sm">{b.customerName}</p>
                      <p className="text-xs text-cream/50">
                        {formatTime(b.time)} — {b.serviceName}
                      </p>
                    </div>
                    {statusBadge(b.status)}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
