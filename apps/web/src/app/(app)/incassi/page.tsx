import { CreditCard, Landmark, ReceiptText, WalletCards } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  formatCents,
  getCustomer,
  getPendingRevenueCents,
  getService,
  getTodayRevenueCents,
  payments,
  services,
} from "@/lib/barber-data";

export default function IncassiPage() {
  const tips = payments.reduce((total, payment) => total + payment.tipCents, 0);
  const gross = payments.reduce((total, payment) => total + payment.amountCents + payment.tipCents, 0);

  return (
    <div className="space-y-8">
      <div>
        <Badge>
          <WalletCards className="mr-1 h-3 w-3" aria-hidden />
          Incassi e cassa
        </Badge>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">Gestionale incassi</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Traccia pagamenti, mance, sospesi e performance dei servizi.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Kpi icon={ReceiptText} label="Lordo giornata" value={formatCents(gross)} />
        <Kpi icon={CreditCard} label="Pagato" value={formatCents(getTodayRevenueCents())} />
        <Kpi icon={Landmark} label="Da incassare" value={formatCents(getPendingRevenueCents())} />
        <Kpi icon={WalletCards} label="Mance" value={formatCents(tips)} />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader>
            <CardTitle>Movimenti cassa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {payments.map((payment) => {
              const customer = getCustomer(payment.customerId);
              const service = getService(payment.serviceId);
              return (
                <div key={payment.id} className="grid gap-3 rounded-2xl border border-zinc-800 p-4 md:grid-cols-[1fr_auto_auto] md:items-center">
                  <div>
                    <p className="font-medium">{customer?.name}</p>
                    <p className="mt-1 text-sm text-zinc-500">{service?.name} · {payment.paidAt}</p>
                  </div>
                  <Badge variant={payment.status === "paid" ? "success" : "warning"}>{payment.status}</Badge>
                  <p className="text-right text-lg font-semibold text-amber-200">
                    {formatCents(payment.amountCents + payment.tipCents)}
                  </p>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="border-amber-500/20 bg-amber-500/10">
          <CardHeader>
            <CardTitle>Ricavi per servizio</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {services.map((service) => {
              const count = payments.filter((payment) => payment.serviceId === service.id).length;
              const revenue = payments
                .filter((payment) => payment.serviceId === service.id)
                .reduce((total, payment) => total + payment.amountCents, 0);
              return (
                <div key={service.id} className="rounded-xl bg-zinc-950/70 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-medium">{service.name}</p>
                    <span className="text-sm text-amber-200">{formatCents(revenue)}</span>
                  </div>
                  <p className="mt-1 text-xs text-zinc-500">{count} movimenti oggi</p>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Kpi({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <Icon className="mb-4 h-5 w-5 text-amber-300" aria-hidden />
        <p className="text-xs uppercase tracking-wide text-zinc-500">{label}</p>
        <p className="mt-1 text-2xl font-semibold">{value}</p>
      </CardContent>
    </Card>
  );
}
