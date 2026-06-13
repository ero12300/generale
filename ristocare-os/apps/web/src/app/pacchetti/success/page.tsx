import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { MarketingFooter, MarketingHeader } from "@/components/marketing/site-chrome";
import { MarketingPageShell } from "@/components/marketing/page-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = { title: "Abbonamento attivato" };

export default function PacchettiSuccessPage() {
  return (
    <MarketingPageShell>
      <MarketingHeader />
      <main className="flex-1 mx-auto max-w-lg w-full px-4 py-24">
        <Card className="text-center border-emerald-500/20 from-emerald-500/[0.06]">
          <CardContent className="pt-10 pb-10 space-y-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/15 border border-emerald-500/20">
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-semibold text-zinc-900">Pagamento ricevuto</h1>
              <p className="text-sm text-zinc-500 mt-3 leading-relaxed">
                Grazie per aver scelto RistoCare OS. Riceverai una conferma via email e il tuo piano verrà attivato
                entro pochi minuti.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild>
                <Link href="/login">Accedi al portale</Link>
              </Button>
              <Button variant="secondary" asChild>
                <Link href="/app/dashboard">Vai alla dashboard</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      <MarketingFooter />
    </MarketingPageShell>
  );
}
