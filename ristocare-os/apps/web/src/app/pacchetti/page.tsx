import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { PLAN_LABELS, PLAN_PRICES } from "@ristocare/types";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MarketingFooter, MarketingHeader } from "@/components/marketing/site-chrome";

export const metadata = { title: "Pacchetti" };

const planFeatures: Record<string, string[]> = {
  start: ["Fino a 10 attrezzature", "QR code", "Archivio documenti", "Apertura ticket", "Supporto email"],
  pro: ["Fino a 30 attrezzature", "Report mensile", "Gestione ricambi", "Priorità media", "Assistente telefonico"],
  premium: ["Fino a 70 attrezzature", "Multi-area", "Ticket prioritari", "Dashboard avanzata", "Procedure operative"],
  enterprise: ["Multi-sede", "Utenti illimitati", "SLA dedicato", "Account manager", "Integrazioni esterne"],
};

export default function PacchettiPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <MarketingHeader />
      <main className="flex-1 mx-auto max-w-6xl px-4 py-16">
        <h1 className="text-3xl font-bold text-zinc-100 mb-4">Pacchetti RistoCare OS</h1>
        <p className="text-zinc-400 mb-12 max-w-2xl">
          Scegli il piano adatto alla dimensione del tuo locale. Ogni piano include il portale digitale,
          QR code e gestione ticket verso la centrale operativa RistoCare.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {(["start", "pro", "premium", "enterprise"] as const).map((plan) => {
            const p = PLAN_PRICES[plan];
            return (
              <Card key={plan}>
                <CardHeader>
                  <CardTitle className="text-lg">{PLAN_LABELS[plan]}</CardTitle>
                  <CardDescription>
                    {plan === "enterprise" ? (
                      <span className="text-xl font-bold text-zinc-100">Su preventivo</span>
                    ) : (
                      <>
                        <span className="text-2xl font-bold text-zinc-100">{formatCurrency(p.monthly)}</span>
                        <span className="text-zinc-500">/mese</span>
                      </>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {plan !== "enterprise" && (
                    <p className="text-sm text-zinc-500">Setup da {formatCurrency(p.setup)}</p>
                  )}
                  <ul className="space-y-2">
                    {planFeatures[plan].map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-zinc-300">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full" asChild>
                    <Link href={`/contatti?tipo=quote&piano=${plan}`}>Richiedi preventivo</Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
