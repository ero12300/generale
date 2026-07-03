import type { ComponentType } from "react";
import { CreditCard, Euro, Wallet } from "lucide-react";
import { barberTransactions, getAverageTicket, getTodayRevenue } from "@/lib/barber-data";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RevenuePage() {
  const subscriptionRevenue = barberTransactions
    .filter((transaction) => transaction.category === "subscription")
    .reduce((total, transaction) => total + transaction.amount, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Incassi</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Gestione interna di servizi, retail e subscription con metodi di pagamento separati.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard icon={Euro} label="Totale giornata" value={formatCurrency(getTodayRevenue())} />
        <SummaryCard icon={Wallet} label="Ticket medio" value={formatCurrency(getAverageTicket())} />
        <SummaryCard icon={CreditCard} label="Revenue SaaS" value={formatCurrency(subscriptionRevenue)} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Movimenti registrati</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {barberTransactions.map((transaction) => (
            <div key={transaction.id} className="flex flex-col gap-3 rounded-2xl border border-zinc-800 p-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-medium">{transaction.label}</p>
                <p className="mt-1 text-sm text-zinc-500">
                  {new Date(transaction.paid_at).toLocaleTimeString("it-IT", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  · {transaction.method}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={transaction.category === "subscription" ? "warning" : "secondary"}>
                  {transaction.category}
                </Badge>
                <p className="font-medium text-amber-300">{formatCurrency(transaction.amount)}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-zinc-500">{label}</p>
            <p className="mt-1 text-2xl font-semibold">{value}</p>
          </div>
          <Icon className="h-5 w-5 text-amber-400" aria-hidden />
        </div>
      </CardContent>
    </Card>
  );
}
