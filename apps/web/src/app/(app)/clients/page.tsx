import Link from "next/link";
import { ArrowRight, BadgePercent, Users2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { listBarberClients } from "@/lib/barber-demo";
import { formatCurrency } from "@/lib/utils";

export default function ClientsPage() {
  const clients = listBarberClients();

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Clienti & CRM</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Database clienti con spesa totale, preferenze, referral e consenso marketing.
          </p>
        </div>
        <Badge variant="secondary">{clients.length} clienti demo</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users2 className="h-5 w-5 text-amber-400" />
            Clienti ad alto valore
          </CardTitle>
          <CardDescription>
            Segmentazione gia pronta per campagne Pro e &quot;porta un amico&quot;.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {clients.map((client) => (
            <Link
              key={client.id}
              href={`/clients/${client.id}`}
              className="flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-950/50 p-4 transition hover:border-amber-500/40 md:flex-row md:items-center md:justify-between"
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium">{client.full_name}</p>
                  {client.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                  {client.consent_marketing && <Badge variant="success">Marketing OK</Badge>}
                </div>
                <p className="text-sm text-zinc-500">
                  {client.phone}
                  {client.email ? ` - ${client.email}` : ""}
                </p>
                <p className="text-xs text-zinc-500">
                  Preferenze: {client.preferences.join(" - ") || "Nessuna"}
                </p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Spesa totale</p>
                  <p className="text-lg font-semibold text-amber-300">
                    {formatCurrency(client.total_spent)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Visite</p>
                  <p className="text-lg font-semibold">{client.total_visits}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-zinc-500" />
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        <InsightCard title="Referral pronti" value="2" description="clienti gia attribuiti a un referrer" />
        <InsightCard title="Clienti VIP" value="1" description="alto LTV e frequenza elevata" />
        <InsightCard
          title="Codici promo"
          value="4"
          description="ogni cliente puo ricevere sconto o reward"
          icon={<BadgePercent className="h-4 w-4 text-amber-400" />}
        />
      </div>
    </div>
  );
}

function InsightCard({
  title,
  value,
  description,
  icon,
}: {
  title: string;
  value: string;
  description: string;
  icon?: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">{title}</p>
            <p className="mt-2 text-2xl font-semibold">{value}</p>
            <p className="mt-1 text-sm text-zinc-500">{description}</p>
          </div>
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}
