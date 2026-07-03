import { BanknoteArrowDown, CreditCard, Percent, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { revenueSnapshots } from "@/lib/barber-data";
import { formatCurrencyFromCents, formatPercent } from "@/lib/utils";

export default function FinancePage() {
  const today = revenueSnapshots[0];

  return (
    <div className="space-y-8">
      <div>
        <Badge className="border-white/10 bg-white/10 text-white">Incassi interni</Badge>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">Controllo incassi e marginalita</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
          Vista operativa per capire subito cosa entra oggi, quanto arriva dal retail e quanto pesa
          l’occupazione reale del team.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <FinanceCard icon={Wallet} label="Lordo today" value={formatCurrencyFromCents(today.gross_cents)} />
        <FinanceCard icon={CreditCard} label="Retail" value={formatCurrencyFromCents(today.product_sales_cents)} />
        <FinanceCard icon={BanknoteArrowDown} label="Tips" value={formatCurrencyFromCents(today.tips_cents)} />
        <FinanceCard icon={Percent} label="Occupazione" value={formatPercent(today.occupancy_ratio)} />
      </div>

      <Card className="border-white/10 bg-white/5 backdrop-blur">
        <CardHeader>
          <CardTitle>Trend ultimi giorni</CardTitle>
          <CardDescription>Snapshot rapidi per riconoscere pattern e giornate forti.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          {revenueSnapshots.map((snapshot) => (
            <div
              key={snapshot.id}
              className="grid gap-4 rounded-3xl border border-white/10 bg-black/20 p-5 lg:grid-cols-[0.8fr_0.8fr_0.8fr_0.8fr_0.7fr]"
            >
              <Metric label="Data" value={snapshot.date} />
              <Metric label="Incasso" value={formatCurrencyFromCents(snapshot.gross_cents)} />
              <Metric label="Retail" value={formatCurrencyFromCents(snapshot.product_sales_cents)} />
              <Metric label="Prenotazioni" value={String(snapshot.bookings_count)} />
              <Metric label="Occupazione" value={formatPercent(snapshot.occupancy_ratio)} />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function FinanceCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <Card className="border-white/10 bg-white/5 backdrop-blur">
      <CardContent className="p-5">
        <Icon className="h-5 w-5 text-amber-300" aria-hidden />
        <p className="mt-4 text-xs uppercase tracking-[0.24em] text-zinc-500">{label}</p>
        <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
      </CardContent>
    </Card>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-zinc-500">{label}</p>
      <p className="mt-1 text-sm font-medium text-white">{value}</p>
    </div>
  );
}
