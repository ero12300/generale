import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  ChefHat,
  FileText,
  TrendingUp,
  Users,
} from "lucide-react";
import { MarketingHeader, MarketingFooter } from "@/components/marketing/header-footer";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PLANS, formatEuro } from "@ristoprofit/types";

const features = [
  {
    icon: ChefHat,
    title: "Food cost reale",
    desc: "Calcolo costo porzione, margine e prezzo consigliato per ogni piatto.",
  },
  {
    icon: TrendingUp,
    title: "Menu engineering",
    desc: "Star, Puzzle, Cavallo da lavoro, Dog — sa cosa spingere e cosa eliminare.",
  },
  {
    icon: FileText,
    title: "Fatture fornitori",
    desc: "Carica PDF o foto, aggiorna prezzi ingredienti e ricevi alert aumenti.",
  },
  {
    icon: BarChart3,
    title: "Report giornaliero",
    desc: "Incasso, food cost, personale e azioni consigliate ogni sera.",
  },
  {
    icon: Users,
    title: "Controllo personale",
    desc: "Incidenza costo lavoro su incasso, produttività per turno.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <MarketingHeader />

      <main>
        <section className="max-w-6xl mx-auto px-4 py-20 md:py-28 text-center">
          <p className="text-emerald-500 text-sm font-medium tracking-widest uppercase mb-4">
            Emotive S.r.l. — Messina
          </p>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-4xl mx-auto leading-tight">
            Scopri quanto guadagni{" "}
            <span className="text-emerald-400">davvero</span> su ogni piatto
          </h1>
          <p className="mt-6 text-lg text-zinc-400 max-w-2xl mx-auto">
            RistoProfit OS è il cruscotto economico per ristoranti, bar, pizzerie e gelaterie.
            Calcola food cost, margini, prezzi consigliati e report giornalieri.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/demo">
                Richiedi una demo
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/login">Prova la demo</Link>
            </Button>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 py-16 border-t border-zinc-800">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold">
              Vendere tanto non significa guadagnare bene
            </h2>
            <p className="mt-4 text-zinc-400 max-w-2xl mx-auto">
              Ingredienti in aumento, menu non aggiornati, piatti con margini bassi e personale costoso
              possono ridurre il profitto senza che il titolare se ne accorga.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <Card key={title}>
                <CardHeader>
                  <Icon className="h-8 w-8 text-emerald-500 mb-2" aria-hidden />
                  <CardTitle>{title}</CardTitle>
                  <CardDescription>{desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 py-16 border-t border-zinc-800">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Piani e prezzi</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PLANS.map((plan) => (
              <Card
                key={plan.tier}
                className={plan.tier === "pro" ? "border-emerald-500/50 ring-1 ring-emerald-500/20" : ""}
              >
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  {plan.monthly_price_cents > 0 ? (
                    <>
                      <p className="text-2xl font-bold text-emerald-400 mt-2">
                        {formatEuro(plan.monthly_price_cents)}
                        <span className="text-sm text-zinc-500 font-normal">/mese</span>
                      </p>
                      <p className="text-xs text-zinc-500">
                        Setup {formatEuro(plan.setup_price_cents)}
                      </p>
                    </>
                  ) : (
                    <p className="text-lg text-amber-400 mt-2">Su preventivo</p>
                  )}
                  <ul className="mt-4 space-y-1 text-xs text-zinc-400">
                    {plan.features.slice(0, 4).map((f) => (
                      <li key={f}>• {f}</li>
                    ))}
                  </ul>
                </CardHeader>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button variant="outline" asChild>
              <Link href="/prezzi">Vedi tutti i dettagli</Link>
            </Button>
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-4 py-20 text-center border-t border-zinc-800">
          <h2 className="text-2xl md:text-3xl font-bold">
            Vuole sapere quali prodotti Le fanno guadagnare davvero?
          </h2>
          <p className="mt-4 text-zinc-400">
            Non è un gestionale in più. È il sistema che Le dice dove sta guadagnando e dove sta perdendo soldi.
          </p>
          <Button size="lg" className="mt-8" asChild>
            <Link href="/demo">Prenota analisi iniziale</Link>
          </Button>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
