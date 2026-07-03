import { BarChart3, Layers3, Rocket, ShieldCheck } from "lucide-react";
import { BillingCta } from "@/components/barber/billing-cta";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { subscriptionTiers } from "@/lib/barber-data";

export default function GrowthPage() {
  return (
    <div className="space-y-8">
      <div>
        <Badge className="border-white/10 bg-white/10 text-white">Monetizzazione</Badge>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">Come trasformarlo in SaaS</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400">
          La leva più forte è vendere il software a canone: un piano base per agenda + CRM, uno Pro
          per automazioni e no-show protection, poi multi-location per catene e barber che vuoi
          servire in abbonamento.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <IdeaCard icon={Rocket} title="Go-to-market" text="Parti dal tuo salone come caso studio e prova sociale." />
        <IdeaCard icon={Layers3} title="Prodotto" text="Basic per ordine, Pro per crescita, Enterprise per catene." />
        <IdeaCard icon={ShieldCheck} title="Retention" text="Dati clienti e automazioni rendono l’uscita difficile." />
        <IdeaCard icon={BarChart3} title="Upsell" text="SMS, depositi, white-label, onboarding premium." />
      </div>

      <BillingCta tiers={subscriptionTiers} />

      <Card className="border-white/10 bg-white/5 backdrop-blur">
        <CardHeader>
          <CardTitle>Schema monetizzazione consigliato</CardTitle>
          <CardDescription>Prezzi semplici, margine alto, facile da capire per il cliente finale.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-3">
          <BulletCard
            title="Basic"
            bullets={[
              "Perfetto per singolo barber shop",
              "Agenda online, CRM e incassi base",
              "Prezzo d’ingresso per battere il fai-da-te",
            ]}
          />
          <BulletCard
            title="Pro"
            bullets={[
              "Automazioni WhatsApp, campagne e referral",
              "No-show protection con depositi",
              "Dashboard marginalita e performance staff",
            ]}
          />
          <BulletCard
            title="Multi-location"
            bullets={[
              "Rivendita a più sedi o network barber",
              "Billing centralizzato e reporting consolidato",
              "White-label opzionale per partner",
            ]}
          />
        </CardContent>
      </Card>
    </div>
  );
}

function IdeaCard({
  icon: Icon,
  title,
  text,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  text: string;
}) {
  return (
    <Card className="border-white/10 bg-white/5 backdrop-blur">
      <CardContent className="p-5">
        <Icon className="h-5 w-5 text-amber-300" aria-hidden />
        <p className="mt-4 text-sm font-medium text-white">{title}</p>
        <p className="mt-1 text-sm text-zinc-400">{text}</p>
      </CardContent>
    </Card>
  );
}

function BulletCard({ title, bullets }: { title: string; bullets: string[] }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
      <p className="text-lg font-semibold text-white">{title}</p>
      <ul className="mt-4 space-y-3 text-sm leading-6 text-zinc-400">
        {bullets.map((bullet) => (
          <li key={bullet}>• {bullet}</li>
        ))}
      </ul>
    </div>
  );
}
