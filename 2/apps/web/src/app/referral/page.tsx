import Link from "next/link";
import { MarketingHeader, MarketingFooter } from "@/components/marketing/header-footer";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

const rewards = [
  { plan: "Start", reward: "50 €" },
  { plan: "Pro", reward: "100 €" },
  { plan: "Premium", reward: "200 €" },
  { plan: "Enterprise", reward: "Accordo dedicato" },
];

export default function ReferralPage() {
  return (
    <div className="min-h-screen bg-mesh">
      <MarketingHeader />
      <main className="max-w-4xl mx-auto px-4 py-16 md:py-20">
        <div className="text-center mb-14 animate-fade-up">
          <p className="text-sm font-medium text-emerald-700 uppercase tracking-widest mb-3">
            Guadagna segnalando
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-semibold mb-4">
            Programma referral
          </h1>
          <p className="text-zinc-400 max-w-xl mx-auto text-lg">
            Segnala un ristoratore e guadagna quando attiva RistoProfit OS.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 gap-4 lg:gap-6 mb-12">
          {rewards.map((r, i) => (
            <Card
              key={r.plan}
              className="animate-fade-up"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <CardHeader>
                <CardTitle className="font-display text-lg">Piano {r.plan}</CardTitle>
                <p className="font-display text-3xl text-emerald-700 font-semibold mt-2">
                  {r.reward}
                </p>
                <p className="text-xs text-zinc-500 mt-2">
                  Dopo pagamento setup o primo canone
                </p>
              </CardHeader>
            </Card>
          ))}
        </div>
        <div className="text-center">
          <Button size="lg" asChild>
            <Link href="/login?area=referral">Accedi al portale partner</Link>
          </Button>
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
