import { Gift, Mail, Phone, Search, UsersRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { customers, formatCents } from "@/lib/barber-data";

export default function ClientiPage() {
  const totalValue = customers.reduce((total, customer) => total + customer.lifetimeValueCents, 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Badge>
            <UsersRound className="mr-1 h-3 w-3" aria-hidden />
            CRM clienti
          </Badge>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">Database clienti</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Storico visite, valore cliente, tag marketing e codice referral personale.
          </p>
        </div>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" aria-hidden />
          <Input className="pl-9" placeholder="Cerca cliente, telefono o tag..." aria-label="Cerca cliente" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Kpi label="Clienti demo" value={String(customers.length)} />
        <Kpi label="Valore totale" value={formatCents(totalValue)} />
        <Kpi label="Referral pronti" value={String(customers.length)} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {customers.map((customer) => (
          <Card key={customer.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle>{customer.name}</CardTitle>
                  <p className="mt-1 text-sm text-zinc-500">
                    {customer.visits} visite · ultimo accesso {customer.lastVisit}
                  </p>
                </div>
                <Badge variant="secondary">{formatCents(customer.lifetimeValueCents)}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 text-sm sm:grid-cols-2">
                <Contact icon={Phone} value={customer.phone} />
                <Contact icon={Mail} value={customer.email} />
              </div>
              <div className="flex flex-wrap gap-2">
                {customer.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
                <p className="flex items-center gap-2 text-sm font-medium text-amber-100">
                  <Gift className="h-4 w-4" aria-hidden />
                  Codice porta un amico
                </p>
                <p className="mt-2 font-mono text-lg text-amber-200">{customer.referralCode}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="p-5">
        <p className="text-xs uppercase tracking-wide text-zinc-500">{label}</p>
        <p className="mt-1 text-2xl font-semibold">{value}</p>
      </CardContent>
    </Card>
  );
}

function Contact({ icon: Icon, value }: { icon: React.ComponentType<{ className?: string }>; value: string }) {
  return (
    <p className="flex items-center gap-2 rounded-xl bg-zinc-950/70 p-3 text-zinc-300">
      <Icon className="h-4 w-4 text-zinc-500" aria-hidden />
      {value}
    </p>
  );
}
