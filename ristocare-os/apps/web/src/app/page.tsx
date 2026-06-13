import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  QrCode,
  Shield,
  Ticket,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PLAN_LABELS, PLAN_PRICES } from "@ristocare/types";
import { formatCurrency } from "@/lib/utils";
import { MarketingFooter, MarketingHeader } from "@/components/marketing/site-chrome";

const features = [
  { icon: QrCode, title: "QR code per ogni macchina", desc: "Scansiona e apri ticket, consulta manuale e garanzia in pochi secondi." },
  { icon: Ticket, title: "Centrale operativa ticket", desc: "RistoCare qualifica, coordina tecnici e gestisce preventivi per te." },
  { icon: Shield, title: "Garanzie sotto controllo", desc: "Scadenze, documenti e storico interventi sempre accessibili." },
  { icon: Wrench, title: "Manutenzioni programmate", desc: "Promemoria filtri, consumabili e controlli periodici." },
];

const steps = [
  "Digitalizziamo il tuo locale",
  "Censiamo le attrezzature",
  "Creiamo i QR code",
  "Attiviamo il portale",
  "Gestiamo ticket, ricambi e manutenzioni",
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <MarketingHeader />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-6xl px-4 py-24 md:py-32">
          <p className="text-emerald-400 text-sm font-medium tracking-wide uppercase mb-4">
            Brand dedicato di Emotive S.r.l.
          </p>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-zinc-50 max-w-3xl leading-tight">
            Il passaporto digitale delle attrezzature del tuo ristorante
          </h1>
          <p className="mt-6 text-lg text-zinc-400 max-w-2xl leading-relaxed">
            Con RistoCare OS gestisci garanzie, manuali, matricole, ticket, manutenzioni,
            ricambi e interventi tecnici da un unico portale.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button size="lg" asChild>
              <Link href="/contatti?tipo=demo">
                Richiedi una demo
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contatti?tipo=census">Digitalizza il tuo locale</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="border-t border-zinc-800 bg-zinc-950/50 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-zinc-100 mb-4">
            Quando una macchina si ferma, il problema non è solo il guasto. È il caos.
          </h2>
          <p className="text-zinc-400 max-w-3xl leading-relaxed">
            Manuali introvabili, garanzie scadute, matricole mancanti, foto su WhatsApp,
            tecnici da chiamare, preventivi da rincorrere e dipendenti che non sanno cosa fare.
            RistoCare OS organizza tutto in un unico sistema digitale.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-zinc-100 mb-12 text-center">
            Con RistoCare OS ogni attrezzatura ha il suo QR code
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <Card key={title}>
                <CardHeader>
                  <Icon className="h-8 w-8 text-emerald-500 mb-2" aria-hidden />
                  <CardTitle className="text-base">{title}</CardTitle>
                  <CardDescription>{desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-zinc-800 bg-zinc-950/50 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-bold text-zinc-100 mb-10 text-center">Come funziona</h2>
          <ol className="grid md:grid-cols-5 gap-4">
            {steps.map((step, i) => (
              <li key={step} className="text-center">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600/20 text-emerald-400 font-bold border border-emerald-600/30">
                  {i + 1}
                </div>
                <p className="text-sm text-zinc-300">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-20" id="pacchetti">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-zinc-100 mb-4 text-center">Pacchetti</h2>
          <p className="text-zinc-400 text-center mb-12 max-w-xl mx-auto">
            Scegli il piano adatto al tuo locale. Setup iniziale con censimento attrezzature incluso.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {(["start", "pro", "premium"] as const).map((plan) => {
              const p = PLAN_PRICES[plan];
              const highlighted = plan === "pro";
              return (
                <Card key={plan} className={highlighted ? "border-emerald-600/50 ring-1 ring-emerald-600/20" : ""}>
                  <CardHeader>
                    {highlighted && (
                      <span className="text-xs font-medium text-emerald-400 uppercase tracking-wide">Più scelto</span>
                    )}
                    <CardTitle>{PLAN_LABELS[plan]}</CardTitle>
                    <CardDescription>
                      <span className="text-3xl font-bold text-zinc-100">{formatCurrency(p.monthly)}</span>
                      <span className="text-zinc-500">/mese</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-zinc-400">Setup da {formatCurrency(p.setup)}</p>
                    <p className="text-sm text-zinc-400">Fino a {p.equipment_limit} attrezzature</p>
                    <ul className="space-y-2 text-sm text-zinc-300">
                      <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> QR code</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Ticket assistenza</li>
                      {plan !== "start" && (
                        <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Report mensile</li>
                      )}
                    </ul>
                    <Button className="w-full mt-4" variant={highlighted ? "default" : "secondary"} asChild>
                      <Link href="/contatti?tipo=quote">Richiedi preventivo</Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-t border-zinc-800 bg-emerald-950/20 py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-zinc-100 mb-4">
            Vuoi sapere quanto costa digitalizzare il tuo locale?
          </h2>
          <p className="text-zinc-400 mb-8">Meno caos. Meno fermi macchina. Più controllo.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/contatti?tipo=quote">Richiedi preventivo</Link>
            </Button>
            <Button size="lg" variant="gold" asChild>
              <Link href="/contatti?tipo=census">Prenota sopralluogo</Link>
            </Button>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
