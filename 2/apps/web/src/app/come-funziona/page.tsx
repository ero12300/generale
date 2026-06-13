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
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <MarketingHeader />
      <main className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-4">Come funziona RistoProfit OS</h1>
        <p className="text-zinc-400 mb-12">
          Trasforma ricette, fatture e vendite in decisioni operative chiare.
        </p>
        <div className="space-y-6">
          {steps.map((s) => (
            <Card key={s.n}>
              <CardHeader>
                <span className="text-emerald-500 font-bold text-sm">PASSO {s.n}</span>
                <CardTitle className="mt-2">{s.title}</CardTitle>
                <p className="text-zinc-400 text-sm mt-1">{s.desc}</p>
              </CardHeader>
            </Card>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Button asChild><Link href="/demo">Richiedi demo gratuita</Link></Button>
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
