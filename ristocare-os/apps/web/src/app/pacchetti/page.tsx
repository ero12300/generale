import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { PLAN_LABELS, PLAN_PRICES } from "@ristocare/types";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlanCheckoutButton } from "@/components/billing/plan-checkout-button";
import { MarketingFooter, MarketingHeader } from "@/components/marketing/site-chrome";
import { MarketingPageShell, PageHero } from "@/components/marketing/page-shell";

export const metadata = { title: "Pacchetti" };

const planFeatures: Record<string, string[]> = {
  start: ["Fino a 10 attrezzature", "QR code", "Archivio documenti", "Apertura ticket", "Supporto email"],
  pro: ["Fino a 30 attrezzature", "Report mensile", "Gestione ricambi", "Priorità media", "Assistente telefonico"],
  premium: ["Fino a 70 attrezzature", "Multi-area", "Ticket prioritari", "Dashboard avanzata", "Procedure operative"],
  enterprise: ["Multi-sede", "Utenti illimitati", "SLA dedicato", "Account manager", "Integrazioni esterne"],
};

export default function PacchettiPage() {
  return (
    <MarketingPageShell>
      <MarketingHeader />
      <main className="flex-1 mx-auto max-w-6xl w-full px-4 lg:px-6 py-16 md:py-24">
        <PageHero
          eyebrow="Prezzi trasparenti"
          title="Pacchetti RistoCare OS"
          description="Scegli il piano adatto alla dimensione del tuo locale. Ogni piano include portale digitale, QR code e gestione ticket verso la centrale operativa RistoCare."
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {(["start", "pro", "premium", "enterprise"] as const).map((plan) => {
            const p = PLAN_PRICES[plan];
            const highlighted = plan === "pro";
            return (
              <Card
                key={plan}
                className={
                  highlighted
                    ? "border-emerald-500/40 bg-gradient-to-b from-emerald-500/10 to-transparent ring-1 ring-emerald-500/20"
                    : "border-zinc-200"
                }
              >
                <CardHeader>
                  {highlighted && (
                    <span className="text-[10px] font-semibold text-emerald-700 uppercase tracking-widest bg-emerald-500/15 px-3 py-1 rounded-full border border-emerald-500/20 w-fit">
                      Consigliato
                    </span>
                  )}
                  <CardTitle className="font-display text-xl mt-2">{PLAN_LABELS[plan]}</CardTitle>
                  <CardDescription>
                    {plan === "enterprise" ? (
                      <span className="font-display text-2xl font-semibold text-zinc-900">Su preventivo</span>
                    ) : (
                      <>
                        <span className="font-display text-3xl font-semibold text-zinc-900">
                          {formatCurrency(p.monthly)}
                        </span>
                        <span className="text-zinc-500">/mese</span>
                      </>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {plan !== "enterprise" && (
                    <p className="text-sm text-zinc-500">Setup da {formatCurrency(p.setup)}</p>
                  )}
                  <ul className="space-y-2.5">
                    {planFeatures[plan].map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-zinc-700">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <PlanCheckoutButton plan={plan} variant={highlighted ? "default" : "secondary"} className="w-full mt-4">
                    Abbonati ora
                  </PlanCheckoutButton>
                  <Button className="w-full" variant="ghost" size="sm" asChild>
                    <Link href={`/contatti?tipo=quote&piano=${plan}`}>Richiedi preventivo</Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
      <MarketingFooter />
    </MarketingPageShell>
  );
}
