import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Calendar,
  Megaphone,
  Sparkles,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SUBSCRIPTION_PLANS } from "@/lib/stripe/plans";

const features = [
  {
    icon: Calendar,
    title: "Prenotazioni Online",
    description: "I clienti prenotano 24/7 dalla tua pagina personalizzata. Meno telefonate, più tempo per tagliare.",
  },
  {
    icon: Users,
    title: "Database Clienti",
    description: "Storico visite, preferenze, note. Conosci ogni cliente come un professionista.",
  },
  {
    icon: Wallet,
    title: "Gestione Incassi",
    description: "Traccia ogni euro: contanti, carta, bonifico. Report giornalieri e mensili.",
  },
  {
    icon: Megaphone,
    title: "Campagne Marketing",
    description: "Sconti stagionali, codici promo e programma Porta un Amico per far crescere il salone.",
  },
  {
    icon: TrendingUp,
    title: "Analytics",
    description: "Dashboard con KPI: incassi, prenotazioni, clienti ricorrenti. Decisioni basate sui dati.",
  },
  {
    icon: Sparkles,
    title: "Esperienza Premium",
    description: "Design elegante che riflette la qualità del tuo salone. I clienti lo notano.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      <section className="relative pt-24 sm:pt-32 pb-16 sm:pb-20 hero-glow overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=1920&q=80"
            alt="Barberia premium"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal via-charcoal/90 to-charcoal" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-sm text-gold mb-6">
              <Sparkles className="h-4 w-4" />
              Gestionale #1 per barbieri in Italia
            </div>
            <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-bold leading-tight mb-6">
              Il tuo salone,
              <br />
              <span className="text-gradient-gold">elevato al massimo</span>
            </h1>
            <p className="text-lg text-cream/70 mb-8 max-w-xl leading-relaxed">
              Prenotazioni, clienti, incassi e marketing in un&apos;unica piattaforma premium.
              Progettata per barbieri che vogliono scalare senza complicazioni.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild>
                <Link href="/signup">
                  Inizia Gratis
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/book/fade-studio">Prova Prenotazione Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-24 bg-charcoal-light/30">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold mb-4">Tutto ciò che serve al tuo salone</h2>
            <p className="text-cream/60 max-w-2xl mx-auto">
              Dalla prima prenotazione alla campagna referral: uno strumento completo, elegante e facile da usare.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="group hover:border-gold/30 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10 border border-gold/20 mb-4 group-hover:bg-gold/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-gold" />
                  </div>
                  <h3 className="font-display text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-cream/60 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold mb-4">Piani che crescono con te</h2>
            <p className="text-cream/60">Inizia gratis, passa a Pro quando sei pronto. Nessun vincolo.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {Object.values(SUBSCRIPTION_PLANS).map((plan) => (
              <Card
                key={plan.id}
                className={plan.highlighted ? "border-gold/40 ring-1 ring-gold/20 scale-105" : ""}
              >
                <CardContent className="p-8">
                  {plan.highlighted && (
                    <span className="inline-block text-xs font-medium text-gold bg-gold/10 border border-gold/30 rounded-full px-3 py-1 mb-4">
                      Più popolare
                    </span>
                  )}
                  <h3 className="font-display text-2xl font-bold mb-1">{plan.name}</h3>
                  <p className="text-sm text-cream/50 mb-4">{plan.description}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gold">{plan.priceLabel}</span>
                    <span className="text-cream/50 text-sm ml-1">{plan.period}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-cream/70">
                        <span className="text-gold mt-0.5">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant={plan.highlighted ? "default" : "outline"}
                    className="w-full"
                    asChild
                  >
                    <Link href={plan.id === "starter" ? "/signup" : `/pricing?plan=${plan.id}`}>
                      {plan.id === "starter" ? "Inizia Gratis" : "Scegli " + plan.name}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-b from-charcoal-light/50 to-charcoal">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-display text-4xl font-bold mb-4">Pronto a trasformare il tuo salone?</h2>
          <p className="text-cream/60 mb-8">
            Unisciti ai barbieri che hanno scelto BarberPro per gestire prenotazioni e far crescere il business.
          </p>
          <Button size="lg" asChild>
            <Link href="/signup">
              Crea il tuo account gratuito
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
