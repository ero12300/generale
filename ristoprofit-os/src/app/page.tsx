import Link from "next/link";
import {
  ArrowRight,
  Calculator,
  TrendingUp,
  FileText,
  Boxes,
  Users,
  ChefHat,
  Check,
  LineChart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PLANS } from "@/lib/plans";
import { formatCents } from "@/lib/money";

const MODULES = [
  { icon: Calculator, title: "Food Cost", text: "Costo reale di ogni piatto, food cost %, margine e prezzo consigliato." },
  { icon: TrendingUp, title: "Menu Engineering", text: "Star, Puzzle, Cavalli e Dog: cosa spingere, correggere o eliminare." },
  { icon: FileText, title: "Fatture fornitori", text: "Carichi le fatture e i prezzi degli ingredienti si aggiornano da soli." },
  { icon: Boxes, title: "Magazzino e riordino", text: "Sai cosa manca, cosa sta aumentando e cosa ordinare." },
  { icon: ChefHat, title: "Produzione giornaliera", text: "Quanto produrre domani in base allo storico vendite." },
  { icon: Users, title: "Personale", text: "Incidenza del costo del lavoro sull'incasso, per turno e per coperto." },
];

const PROBLEMS = [
  "Menu creato senza calcolo dei margini",
  "Prezzi stabiliti “a sensazione”",
  "Ingredienti aumentati ma listino non aggiornato",
  "Piatti molto venduti ma poco redditizi",
  "Personale sovradimensionato rispetto all'incasso",
  "Nessun report giornaliero su incasso, food cost e utile",
];

export default function HomePage() {
  return (
    <div className="min-h-dvh bg-[var(--background)] text-zinc-100">
      <header className="sticky top-0 z-30 border-b border-zinc-800/80 bg-zinc-950/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <LineChart className="h-6 w-6 text-emerald-500" />
            <span className="text-lg font-bold tracking-tight">
              RistoProfit<span className="text-emerald-500"> OS</span>
            </span>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-zinc-400 md:flex">
            <a href="#problema" className="hover:text-zinc-100">Problema</a>
            <a href="#moduli" className="hover:text-zinc-100">Moduli</a>
            <a href="#prezzi" className="hover:text-zinc-100">Prezzi</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/dashboard">Demo live</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="brand-grid relative overflow-hidden border-b border-zinc-800/60">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center">
          <Badge variant="gold" className="mb-6">Emotive S.r.l. · Messina</Badge>
          <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-tight tracking-tight md:text-6xl">
            Scopri quanto guadagni{" "}
            <span className="text-emerald-500">davvero</span> su ogni piatto
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400">
            RistoProfit OS è il cruscotto economico per ristoranti, bar, pizzerie
            e gelaterie. Calcola food cost, margini, prezzi consigliati, sprechi,
            fornitori e report giornalieri — da un&apos;unica dashboard.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/dashboard">
                Calcola il tuo food cost <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="#prezzi">Richiedi una demo</Link>
            </Button>
          </div>
          <p className="mt-4 text-xs text-zinc-500">
            Nessuna registrazione: la demo usa dati di esempio.
          </p>
        </div>
      </section>

      {/* PROBLEMA */}
      <section id="problema" className="mx-auto max-w-6xl px-4 py-20">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Vendere tanto non significa guadagnare bene
            </h2>
            <p className="mt-4 text-zinc-400">
              Ingredienti in aumento, menu non aggiornati, piatti con margini bassi
              e personale costoso possono ridurre il profitto del locale senza che
              il titolare se ne accorga.
            </p>
            <Link
              href="/dashboard"
              className="mt-6 inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300"
            >
              Guarda la dashboard di esempio <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <ul className="grid gap-3">
            {PROBLEMS.map((p) => (
              <li
                key={p}
                className="flex items-start gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 text-sm text-zinc-300"
              >
                <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-red-400" />
                {p}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* SOLUZIONE / MODULI */}
      <section id="moduli" className="border-y border-zinc-800/60 bg-zinc-950/40">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              RistoProfit OS trasforma ricette, fatture e vendite in decisioni
            </h2>
            <p className="mt-4 text-zinc-400">
              Non è un gestionale in più. È il sistema che ti dice dove stai
              guadagnando e dove stai perdendo soldi.
            </p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {MODULES.map(({ icon: Icon, title, text }) => (
              <Card key={title}>
                <CardHeader>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="mt-2">{title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-zinc-400">{text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* PREZZI */}
      <section id="prezzi" className="mx-auto max-w-6xl px-4 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight">Piani e prezzi</h2>
          <p className="mt-4 text-zinc-400">
            Setup iniziale (configuriamo noi il locale) + canone mensile. Sconto
            lancio per i primi 10 clienti a Messina.
          </p>
        </div>
        <div className="mt-12 grid gap-5 lg:grid-cols-4">
          {PLANS.map((plan) => (
            <Card
              key={plan.id}
              className={
                plan.highlighted
                  ? "border-emerald-500/50 ring-1 ring-emerald-500/30"
                  : ""
              }
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{plan.name}</CardTitle>
                  {plan.highlighted && <Badge variant="ottimo">Consigliato</Badge>}
                </div>
                <div className="mt-2">
                  <span className="text-3xl font-bold">
                    {plan.monthlyCents != null
                      ? formatCents(plan.monthlyCents, 0)
                      : plan.priceLabel}
                  </span>
                  {plan.monthlyCents != null && (
                    <span className="text-sm text-zinc-500"> /mese</span>
                  )}
                </div>
                <p className="text-xs text-zinc-500">
                  Setup {formatCents(plan.setupCents, 0)}
                </p>
                <p className="mt-2 text-xs text-zinc-400">{plan.target}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-zinc-300">
                  {plan.features.slice(0, 6).map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                      {f}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-12 rounded-2xl border border-amber-400/20 bg-amber-400/5 p-6 text-center">
          <p className="text-lg font-semibold text-amber-200">
            Vuoi sapere quali prodotti ti fanno guadagnare davvero?
          </p>
          <div className="mt-4 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild variant="gold" size="lg">
              <Link href="/dashboard">Prenota analisi iniziale</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/login">Accedi all&apos;area cliente</Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-zinc-800/60 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 text-sm text-zinc-500 md:flex-row">
          <p>RistoProfit OS — Emotive S.r.l. · Messina</p>
          <p>Suite futura: RistoSuite OS · RistoCare OS · RistoStaff OS</p>
        </div>
      </footer>
    </div>
  );
}
