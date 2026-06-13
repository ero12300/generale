import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  QrCode,
  Shield,
  Sparkles,
  Ticket,
  Wrench,
} from "lucide-react";
import { Logo, LogoSvg } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PLAN_LABELS, PLAN_PRICES } from "@ristocare/types";
import { formatCurrency } from "@/lib/utils";
import { MarketingFooter, MarketingHeader } from "@/components/marketing/site-chrome";
import { MarketingPageShell } from "@/components/marketing/page-shell";

const features = [
  {
    icon: QrCode,
    title: "QR code per ogni macchina",
    desc: "Scansiona e apri ticket, consulta manuale e garanzia in pochi secondi.",
  },
  {
    icon: Ticket,
    title: "Centrale operativa ticket",
    desc: "RistoCare qualifica, coordina tecnici e gestisce preventivi per te.",
  },
  {
    icon: Shield,
    title: "Garanzie sotto controllo",
    desc: "Scadenze, documenti e storico interventi sempre accessibili.",
  },
  {
    icon: Wrench,
    title: "Manutenzioni programmate",
    desc: "Promemoria filtri, consumabili e controlli periodici.",
  },
];

const steps = [
  "Digitalizziamo il tuo locale",
  "Censiamo le attrezzature",
  "Creiamo i QR code",
  "Attiviamo il portale",
  "Gestiamo ticket e manutenzioni",
];

const stats = [
  { value: "1 QR", label: "per ogni attrezzatura" },
  { value: "24h", label: "centrale operativa" },
  { value: "100%", label: "storico digitale" },
];

export default function HomePage() {
  return (
    <MarketingPageShell>
      <MarketingHeader />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 mesh-grid pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative mx-auto max-w-6xl px-4 lg:px-6 pt-16 pb-24 md:pt-24 md:pb-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-xs font-medium text-emerald-300 mb-6">
                <Sparkles className="h-3.5 w-3.5" aria-hidden />
                Brand dedicato di Emotive S.r.l.
              </div>

              <h1 className="animate-fade-up animate-fade-up-delay-1 font-display text-4xl md:text-5xl lg:text-[3.25rem] font-semibold tracking-tight text-zinc-50 leading-[1.1]">
                Il passaporto digitale delle{" "}
                <span className="text-gradient-brand">attrezzature</span> del tuo ristorante
              </h1>

              <p className="animate-fade-up animate-fade-up-delay-2 mt-6 text-lg text-zinc-400 max-w-xl leading-relaxed">
                Garanzie, manuali, matricole, ticket, manutenzioni e interventi tecnici —
                tutto in un unico portale elegante, pensato per bar, ristoranti e gelaterie.
              </p>

              <div className="animate-fade-up animate-fade-up-delay-3 mt-10 flex flex-wrap gap-4">
                <Button size="lg" className="glow-emerald h-12 px-8" asChild>
                  <Link href="/contatti?tipo=demo">
                    Richiedi una demo
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="h-12 px-8 border-white/10" asChild>
                  <Link href="/login">Prova la demo</Link>
                </Button>
              </div>

              <dl className="mt-14 grid grid-cols-3 gap-6 border-t border-white/5 pt-8">
                {stats.map(({ value, label }) => (
                  <div key={label}>
                    <dt className="font-display text-2xl font-semibold text-emerald-400">{value}</dt>
                    <dd className="text-xs text-zinc-500 mt-1">{label}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="relative hidden lg:flex justify-center animate-fade-up animate-fade-up-delay-2">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-amber-500/10 rounded-3xl blur-3xl" />
              <div className="relative glass-panel rounded-3xl p-8 glow-emerald w-full max-w-md animate-float">
                <div className="flex items-center justify-between mb-8">
                  <Logo size="sm" showWordmark />
                  <span className="text-xs font-medium text-emerald-400/80 bg-emerald-500/10 px-3 py-1 rounded-full">
                    Live
                  </span>
                </div>
                <div className="space-y-4">
                  {[
                    { name: "Abbattitore blast", status: "Garanzia attiva", ok: true },
                    { name: "Vetrina gelato", status: "Ticket in corso", ok: false },
                    { name: "Macchina caffè", status: "Manutenzione OK", ok: true },
                  ].map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-4"
                    >
                      <LogoSvg size="sm" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-zinc-200 truncate">{item.name}</p>
                        <p className={`text-xs ${item.ok ? "text-emerald-400/80" : "text-amber-400/80"}`}>
                          {item.status}
                        </p>
                      </div>
                      <QrCode className="h-5 w-5 text-zinc-600 shrink-0" aria-hidden />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/5 bg-[#060807]/80 py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-4 lg:px-6">
          <div className="max-w-3xl">
            <p className="text-emerald-400/90 text-sm font-medium tracking-wide uppercase mb-4">Il problema</p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-zinc-100 leading-tight">
              Quando una macchina si ferma, il problema non è solo il guasto. È il caos.
            </h2>
            <p className="mt-6 text-zinc-400 text-lg leading-relaxed">
              Manuali introvabili, garanzie scadute, matricole mancanti, foto su WhatsApp,
              tecnici da chiamare e preventivi da rincorrere. RistoCare OS mette ordine
              in un unico sistema digitale.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4 lg:px-6">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-zinc-100">
              Ogni attrezzatura ha il suo QR code
            </h2>
            <p className="mt-4 text-zinc-500 max-w-xl mx-auto">
              Scansiona, apri ticket, consulta documenti — senza cercare in cartelle o chat.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map(({ icon: Icon, title, desc }, i) => (
              <Card
                key={title}
                className="group border-white/5 bg-gradient-to-b from-white/[0.04] to-transparent hover:border-emerald-500/20 hover:from-emerald-500/[0.06] transition-all duration-300"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 group-hover:bg-emerald-500/15 transition-colors">
                    <Icon className="h-6 w-6 text-emerald-400" aria-hidden />
                  </div>
                  <CardTitle className="font-display text-lg font-medium">{title}</CardTitle>
                  <CardDescription className="leading-relaxed">{desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/5 bg-[#060807]/60 py-20">
        <div className="mx-auto max-w-6xl px-4 lg:px-6">
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-zinc-100 mb-12 text-center">
            Come funziona
          </h2>
          <ol className="grid md:grid-cols-5 gap-6">
            {steps.map((step, i) => (
              <li key={step} className="relative text-center">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-5 left-[60%] w-[80%] h-px bg-gradient-to-r from-emerald-500/40 to-transparent" />
                )}
                <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/5 text-emerald-300 font-display font-semibold border border-emerald-500/25">
                  {i + 1}
                </div>
                <p className="text-sm text-zinc-400 leading-snug px-2">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-20 md:py-28" id="pacchetti">
        <div className="mx-auto max-w-6xl px-4 lg:px-6">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-zinc-100">Pacchetti</h2>
            <p className="mt-4 text-zinc-500 max-w-lg mx-auto">
              Scegli il piano adatto al tuo locale. Setup iniziale con censimento attrezzature incluso.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {(["start", "pro", "premium"] as const).map((plan) => {
              const p = PLAN_PRICES[plan];
              const highlighted = plan === "pro";
              return (
                <Card
                  key={plan}
                  className={
                    highlighted
                      ? "border-emerald-500/40 bg-gradient-to-b from-emerald-500/10 to-transparent ring-1 ring-emerald-500/20 scale-[1.02] shadow-xl shadow-emerald-950/20"
                      : "border-white/5"
                  }
                >
                  <CardHeader>
                    {highlighted && (
                      <span className="inline-flex w-fit text-[10px] font-semibold text-emerald-300 uppercase tracking-widest bg-emerald-500/15 px-3 py-1 rounded-full border border-emerald-500/20">
                        Più scelto
                      </span>
                    )}
                    <CardTitle className="font-display text-xl mt-2">{PLAN_LABELS[plan]}</CardTitle>
                    <CardDescription>
                      <span className="font-display text-4xl font-semibold text-zinc-100">
                        {formatCurrency(p.monthly)}
                      </span>
                      <span className="text-zinc-500">/mese</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-zinc-500">Setup da {formatCurrency(p.setup)}</p>
                    <p className="text-sm text-zinc-500">Fino a {p.equipment_limit} attrezzature</p>
                    <ul className="space-y-3 text-sm text-zinc-300 pt-2">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" /> QR code
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" /> Ticket assistenza
                      </li>
                      {plan !== "start" && (
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" /> Report mensile
                        </li>
                      )}
                    </ul>
                    <Button className="w-full mt-6" variant={highlighted ? "default" : "secondary"} asChild>
                      <Link href="/contatti?tipo=quote">Richiedi preventivo</Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-white/5 py-24">
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/30 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-3xl px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-zinc-100">
            Quanto costa digitalizzare il tuo locale?
          </h2>
          <p className="mt-4 text-lg text-zinc-500">Meno caos. Meno fermi macchina. Più controllo.</p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button size="lg" className="glow-emerald h-12 px-8" asChild>
              <Link href="/contatti?tipo=quote">Richiedi preventivo</Link>
            </Button>
            <Button size="lg" variant="gold" className="h-12 px-8" asChild>
              <Link href="/contatti?tipo=census">Prenota sopralluogo</Link>
            </Button>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </MarketingPageShell>
  );
}
