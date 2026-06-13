import { PLANS, formatEuro } from "@ristoprofit/types";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminAbbonamentiPage() {
  return (
    <PageContainer>
      <PageHeader
        eyebrow="Fatturazione"
        title="Abbonamenti e piani"
        subtitle="Configurazione piani e prezzi attivi"
        accent="amber"
      />
      <div className="grid md:grid-cols-2 gap-4">
        {PLANS.map((p) => (
          <Card key={p.tier} glow={p.tier === "pro"}>
            <CardHeader>
              <CardTitle>{p.name}</CardTitle>
              {p.monthly_price_cents > 0 ? (
                <p className="font-display text-2xl text-emerald-400 mt-3">
                  {formatEuro(p.monthly_price_cents)}
                  <span className="text-sm font-sans text-zinc-500 font-normal">/mese</span>
                </p>
              ) : (
                <p className="text-amber-400 mt-3">Prezzo su preventivo</p>
              )}
              {p.monthly_price_cents > 0 && (
                <p className="text-xs text-zinc-500 mt-1">
                  Setup {formatEuro(p.setup_price_cents)}
                </p>
              )}
            </CardHeader>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
