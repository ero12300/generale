import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { getDashboardKpis } from "@/lib/data/repo";
import { formatEUR, formatTime } from "@/lib/utils";
import { Calendar, TrendingUp, Users, Wallet, ArrowUpRight, Crown } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const kpis = await getDashboardKpis();

  const cards = [
    {
      title: "Incasso oggi",
      value: formatEUR(kpis.revenueTodayCents / 100),
      icon: Wallet,
      accent: "gold",
    },
    {
      title: "Incasso mese",
      value: formatEUR(kpis.revenueMonthCents / 100),
      icon: TrendingUp,
      accent: "emerald",
    },
    {
      title: "Prenotazioni oggi",
      value: String(kpis.bookingsToday),
      icon: Calendar,
      accent: "violet",
    },
    {
      title: "Clienti totali",
      value: String(kpis.clientsTotal),
      subtitle: `+${kpis.clientsNewMonth} questo mese`,
      icon: Users,
      accent: "amber",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-3xl gold-shine">Benvenuto</h1>
          <p className="text-ink-400 text-sm mt-1">Ecco cosa succede oggi nel tuo salone.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map((c) => (
          <div key={c.title} className="glass rounded-2xl p-4 relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div className="text-xs uppercase tracking-wider text-ink-400">{c.title}</div>
              <c.icon className="w-4 h-4 text-[color:var(--color-gold-400)]/80" />
            </div>
            <div className="font-display text-2xl mt-2 gold-shine">{c.value}</div>
            {c.subtitle ? <div className="text-xs text-ink-500 mt-1">{c.subtitle}</div> : null}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Prossime prenotazioni</CardTitle>
              <p className="text-xs text-ink-500 mt-0.5">Le prime 6 confermate</p>
            </div>
            <Link
              href="/prenotazioni"
              className="text-xs text-[color:var(--color-gold-400)] hover:underline inline-flex items-center gap-1"
            >
              Vedi tutte <ArrowUpRight className="w-3 h-3" />
            </Link>
          </CardHeader>
          <CardBody className="p-0">
            {kpis.upcoming.length === 0 ? (
              <EmptyState
                icon={<Calendar className="w-6 h-6" />}
                title="Nessuna prenotazione in arrivo"
                description="Le nuove prenotazioni compariranno qui."
              />
            ) : (
              <div className="divide-y divide-white/5">
                {kpis.upcoming.map((row) => (
                  <div key={row.id} className="flex items-center gap-4 px-5 py-3.5">
                    <div className="text-sm text-[color:var(--color-gold-400)] font-medium w-16">
                      {formatTime(row.startAt)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-ink-100 truncate">{row.clientName}</div>
                      <div className="text-xs text-ink-400 truncate">
                        {row.serviceName} · con {row.staffName}
                      </div>
                    </div>
                    <div className="text-sm font-medium text-ink-100">{formatEUR(row.priceCents / 100)}</div>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Top clienti</CardTitle>
              <p className="text-xs text-ink-500 mt-0.5">Chi spende di più</p>
            </div>
            <Crown className="w-4 h-4 text-[color:var(--color-gold-400)]" />
          </CardHeader>
          <CardBody className="p-0">
            {kpis.topClients.length === 0 ? (
              <EmptyState icon={<Users className="w-6 h-6" />} title="Nessun cliente" />
            ) : (
              <div className="divide-y divide-white/5">
                {kpis.topClients.map((c, i) => (
                  <Link
                    key={c.id}
                    href="/clienti"
                    className="flex items-center gap-3 px-5 py-3 hover:bg-white/[0.03]"
                  >
                    <div className="w-6 text-xs text-ink-500 text-center">{i + 1}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-ink-100 truncate">{c.name}</div>
                      <div className="text-xs text-ink-500">{c.visits} visite</div>
                    </div>
                    <Badge tone="gold">{formatEUR(c.totalSpentCents / 100)}</Badge>
                  </Link>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
