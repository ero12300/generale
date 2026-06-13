import Link from "next/link";
import { MarketingHeader, MarketingFooter } from "@/components/marketing/header-footer";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export default function ReferralPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <MarketingHeader />
      <main className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-4">Programma referral</h1>
        <p className="text-zinc-400 mb-12">
          Segnala un ristoratore e guadagna quando attiva RistoProfit OS.
        </p>
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {[
            { plan: "Start", reward: "50 €" },
            { plan: "Pro", reward: "100 €" },
            { plan: "Premium", reward: "200 €" },
            { plan: "Enterprise", reward: "Accordo dedicato" },
          ].map((r) => (
            <Card key={r.plan}>
              <CardHeader>
                <CardTitle>Piano {r.plan}</CardTitle>
                <p className="text-2xl text-emerald-400 font-bold mt-2">{r.reward}</p>
                <p className="text-xs text-zinc-500 mt-1">Dopo pagamento setup o primo canone</p>
              </CardHeader>
            </Card>
          ))}
        </div>
        <div className="text-center">
          <Button asChild>
            <Link href="/login?area=referral">Accedi al portale partner</Link>
          </Button>
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
