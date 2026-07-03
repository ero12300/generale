import { CreditCard, Euro, Landmark, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getBarberDashboardSnapshot, listBarberPayments } from "@/lib/barber-demo";
import { formatCurrency } from "@/lib/utils";

export default function RevenuePage() {
  const payments = listBarberPayments();
  const snapshot = getBarberDashboardSnapshot();
  const totalCash = payments
    .filter((payment) => payment.method === "cash")
    .reduce((sum, payment) => sum + payment.amount, 0);
  const totalCard = payments
    .filter((payment) => payment.method === "card")
    .reduce((sum, payment) => sum + payment.amount, 0);
  const totalOnline = payments
    .filter((payment) => payment.method === "online")
    .reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Incassi & performance</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Vista da gestionale interno per controllare cassa, mix pagamenti e scontrino medio.
          </p>
        </div>
        <Badge variant="secondary">Owner mode</Badge>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        <RevenueCard title="Incasso oggi" value={formatCurrency(snapshot.revenue_today)} icon={<Euro className="h-5 w-5 text-amber-400" />} />
        <RevenueCard title="Incasso mese" value={formatCurrency(snapshot.revenue_month)} icon={<Wallet className="h-5 w-5 text-amber-400" />} />
        <RevenueCard title="Carta" value={formatCurrency(totalCard)} icon={<CreditCard className="h-5 w-5 text-amber-400" />} />
        <RevenueCard title="Online" value={formatCurrency(totalOnline)} icon={<Landmark className="h-5 w-5 text-amber-400" />} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Registro pagamenti</CardTitle>
          <CardDescription>
            Storico semplice ma gia pronto per essere collegato a Stripe, POS o checkout link.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {payments.map((payment) => (
            <div
              key={payment.id}
              className="flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-950/50 p-4 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="font-medium">{formatCurrency(payment.amount)}</p>
                <p className="mt-1 text-sm text-zinc-500">
                  Metodo {payment.method} - {new Date(payment.created_at).toLocaleString("it-IT")}
                </p>
              </div>
              <Badge
                variant={
                  payment.method === "cash"
                    ? "warning"
                    : payment.method === "card"
                      ? "success"
                      : "default"
                }
              >
                {payment.method}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Mix pagamenti</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-zinc-300">
            <p>Contanti: {formatCurrency(totalCash)}</p>
            <p>Carta: {formatCurrency(totalCard)}</p>
            <p>Online: {formatCurrency(totalOnline)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monetizzazione SaaS</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-zinc-300">
            <p>Starter: accesso base ad agenda + CRM.</p>
            <p>Pro: campagne, referral, reporting avanzato.</p>
            <p>Multi-store: multi sede, ruoli, benchmark.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Prossimo step Stripe</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-zinc-300">
            <p>Checkout subscription per i piani software.</p>
            <p>Webhook per attivare feature Basic / Pro.</p>
            <p>Customer portal per upgrade e downgrade self-service.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function RevenueCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">{title}</p>
            <p className="mt-2 text-2xl font-semibold">{value}</p>
          </div>
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}
