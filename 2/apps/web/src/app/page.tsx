import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BarChart3,
  ChefHat,
  FileText,
  Sparkles,
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
    desc: "Costo porzione, margine e prezzo consigliato per ogni piatto del menu.",
    accent: "from-emerald-500/20 to-transparent",
  },
  {
    icon: TrendingUp,
    title: "Menu engineering",
    desc: "Star, Puzzle, Cavallo da lavoro, Dog — decisioni chiare su cosa spingere.",
    accent: "from-amber-500/15 to-transparent",
  },
  {
    icon: FileText,
    title: "Fatture fornitori",
    desc: "Carica PDF o foto, traccia i prezzi e ricevi alert sugli aumenti.",
    accent: "from-emerald-500/15 to-transparent",
  },
  {
    icon: BarChart3,
    title: "Report giornaliero",
    desc: "Incasso, food cost, personale e azioni consigliate ogni sera.",
    accent: "from-teal-500/15 to-transparent",
  },
  {
    icon: Users,
    title: "Controllo personale",
    desc: "Incidenza del costo lavoro sull'incasso, turno per turno.",
    accent: "from-emerald-500/10 to-transparent",
  },
];

const stats = [
  { value: "32%", label: "Food cost medio target" },
  { value: "129€", label: "Canone Pro da" },
  { value: "24h", label: "Report operativo" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-mesh text-zinc-100">
      <MarketingHeader />

      <main>
        {/* Hero */}
        <section className="relative max-w-6xl mx-auto px-4 pt-16 pb-20 md:pt-24 md:pb-28">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            <div className="flex-1 text-center lg:text-left animate-fade-up">
              <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400/90 mb-6">
                <Sparkles className="h-3.5 w-3.5" />
                Emotive S.r.l. · Messina
              </p>
              <h1 className="font-display text-4xl md:text-5xl lg:text-[3.25rem] font-semibold tracking-tight leading-[1.1]">
                Scopri quanto guadagni{" "}
                <span className="text-gradient-profit">davvero</span> su ogni piatto
              </h1>
              <p className="mt-6 text-lg text-zinc-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                RistoProfit OS è il cruscotto economico per ristoranti, bar, pizzerie e gelaterie.
                Margini chiari, sprechi sotto controllo, decisioni ogni giorno.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
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
            </div>
            <div className="flex-1 flex justify-center animate-fade-up-delay-1">
              <div className="relative">
                <div className="absolute -inset-8 bg-emerald-500/10 rounded-full blur-3xl" />
                <div className="relative glass-panel rounded-3xl p-8 border border-emerald-500/10 shadow-2xl shadow-black/40">
                  <Image
                    src="/logo.png"
                    alt="RistoProfit OS"
                    width={220}
                    height={220}
                    className="mx-auto drop-shadow-2xl"
                    priority
                  />
                  <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                    {stats.map((s) => (
                      <div key={s.label} className="rounded-xl bg-black/20 py-3 px-2">
                        <p className="font-display text-lg font-semibold text-emerald-400">{s.value}</p>
                        <p className="text-[10px] text-zinc-500 leading-tight mt-1">{s.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Problema */}
        <section className="max-w-6xl mx-auto px-4 py-20">
          <div className="text-center mb-14 animate-fade-up-delay-2">
            <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight">
              Vendere tanto non significa guadagnare bene
            </h2>
            <p className="mt-4 text-zinc-400 max-w-2xl mx-auto text-lg leading-relaxed">
              Ingredienti in aumento, menu non aggiornati e piatti poco redditizi
              erodono il margine senza che il titolare se ne accorga in tempo.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(({ icon: Icon, title, desc, accent }) => (
              <Card key={title} glow className="group relative overflow-hidden">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                />
                <CardHeader className="relative">
                  <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
                    <Icon className="h-5 w-5 text-emerald-400" aria-hidden />
                  </div>
                  <CardTitle>{title}</CardTitle>
                  <CardDescription>{desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        {/* Prezzi */}
        <section className="max-w-6xl mx-auto px-4 py-20 border-t border-[var(--border-subtle)]">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-semibold">Piani pensati per il locale</h2>
            <p className="text-zinc-500 mt-2">Setup iniziale + canone mensile trasparente</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {PLANS.map((plan) => (
              <Card
                key={plan.tier}
                className={
                  plan.tier === "pro"
                    ? "border-emerald-500/40 ring-1 ring-emerald-500/20 relative"
                    : ""
                }
              >
                {plan.tier === "pro" && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-wider bg-emerald-500 text-zinc-950 font-bold px-3 py-1 rounded-full">
                    Più scelto
                  </span>
                )}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  {plan.monthly_price_cents > 0 ? (
                    <>
                      <p className="font-display text-3xl font-semibold text-emerald-400 mt-3">
                        {formatEuro(plan.monthly_price_cents)}
                        <span className="text-sm text-zinc-500 font-sans font-normal">/mese</span>
                      </p>
                      <p className="text-xs text-zinc-500 mt-1">
                        Setup {formatEuro(plan.setup_price_cents)}
                      </p>
                    </>
                  ) : (
                    <p className="font-display text-xl text-amber-400 mt-3">Su preventivo</p>
                  )}
                </CardHeader>
              </Card>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button variant="outline" asChild>
              <Link href="/prezzi">Confronta tutti i piani</Link>
            </Button>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-4xl mx-auto px-4 py-24 text-center">
          <div className="glass-panel rounded-3xl p-10 md:p-14 border border-emerald-500/10">
            <h2 className="font-display text-2xl md:text-3xl font-semibold">
              Vuole sapere quali prodotti Le fanno guadagnare davvero?
            </h2>
            <p className="mt-4 text-zinc-400 max-w-lg mx-auto">
              Non è un gestionale in più. È il sistema che Le dice dove guadagna e dove perde.
            </p>
            <Button size="lg" className="mt-8" asChild>
              <Link href="/demo">Prenota analisi iniziale</Link>
            </Button>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
