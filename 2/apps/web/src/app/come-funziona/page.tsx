import Link from "next/link";
import { MarketingHeader, MarketingFooter } from "@/components/marketing/header-footer";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

const steps = [
  { n: "1", title: "Setup iniziale", desc: "Inseriamo menu, ricette, ingredienti e fornitori del Suo locale." },
  { n: "2", title: "Calcolo margini", desc: "Il sistema calcola food cost, margine e prezzo consigliato per ogni prodotto." },
  { n: "3", title: "Report e alert", desc: "Ogni giorno riceve incasso, prodotti critici, aumenti ingredienti e azioni da fare." },
  { n: "4", title: "Decisioni operative", desc: "Aumenta prezzi, riduci sprechi, spingi i piatti più redditizi." },
];

export default function ComeFunzionaPage() {
  return (
    <div className="min-h-screen bg-mesh text-zinc-100">
      <MarketingHeader />
      <main className="max-w-4xl mx-auto px-4 py-16 md:py-20">
        <div className="text-center mb-14 animate-fade-up">
          <p className="text-sm font-medium text-emerald-400 uppercase tracking-widest mb-3">
            In quattro passi
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-semibold mb-4">
            Come funziona RistoProfit OS
          </h1>
          <p className="text-zinc-400 max-w-xl mx-auto text-lg">
            Trasforma ricette, fatture e vendite in decisioni operative chiare.
          </p>
        </div>
        <div className="space-y-4">
          {steps.map((s, i) => (
            <Card
              key={s.n}
              className="animate-fade-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <CardHeader className="flex flex-row gap-5 items-start">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400 font-display font-semibold text-lg border border-emerald-500/20">
                  {s.n}
                </span>
                <div>
                  <span className="text-emerald-500/80 font-medium text-xs uppercase tracking-wider">
                    Passo {s.n}
                  </span>
                  <CardTitle className="font-display mt-1 text-lg">{s.title}</CardTitle>
                  <p className="text-zinc-400 text-sm mt-2 leading-relaxed">{s.desc}</p>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
        <div className="mt-14 text-center">
          <Button size="lg" asChild>
            <Link href="/demo">Richiedi demo gratuita</Link>
          </Button>
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
