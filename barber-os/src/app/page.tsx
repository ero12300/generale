import Link from "next/link";
import { PLANS } from "@/lib/plans";

const SERVICES_PREVIEW = [
  {
    name: "Taglio Classico",
    price: "25€",
    duration: "30 min",
    description: "Taglio su misura con consulenza stile e rifinitura finale.",
  },
  {
    name: "Barba Tradizionale",
    price: "20€",
    duration: "30 min",
    description: "Rasatura con panno caldo, olio pre-shave e balsamo.",
  },
  {
    name: "Taglio + Barba",
    price: "40€",
    duration: "60 min",
    description: "Il rituale completo del gentiluomo, dall'inizio alla fine.",
  },
  {
    name: "Taglio Bimbo",
    price: "15€",
    duration: "20 min",
    description: "Per i piccoli gentiluomini fino a 12 anni.",
  },
];

const FEATURES = [
  {
    title: "Prenotazioni online",
    description:
      "I tuoi clienti prenotano da soli, giorno e notte. Tu vedi tutto in un'agenda pulita e ordinata.",
    icon: "📅",
  },
  {
    title: "Registro incassi",
    description:
      "Ogni taglio, ogni barba, ogni incasso registrato. Report giornalieri, settimanali e mensili.",
    icon: "💶",
  },
  {
    title: "Database clienti",
    description:
      "Rubrica completa con note, preferenze e storico. Conosci ogni cliente come un amico.",
    icon: "👥",
  },
  {
    title: "Sconti e porta un amico",
    description:
      "Crea codici sconto e campagne referral: ogni cliente diventa il tuo miglior venditore.",
    icon: "🎁",
  },
];

export default function LandingPage() {
  return (
    <main>
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-ink/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <span aria-hidden className="text-2xl">✂️</span>
            <span className="font-display text-xl font-bold tracking-wide">
              Barber<span className="gold-gradient-text">OS</span>
            </span>
          </Link>
          <nav className="flex items-center gap-3 sm:gap-6">
            <a
              href="#servizi"
              className="hidden text-sm text-cream-dim transition hover:text-cream sm:block"
            >
              Servizi
            </a>
            <a
              href="#prezzi"
              className="hidden text-sm text-cream-dim transition hover:text-cream sm:block"
            >
              Prezzi
            </a>
            <Link href="/admin" className="text-sm text-cream-dim transition hover:text-cream">
              Area gestionale
            </Link>
            <Link href="/prenota" className="btn-gold !px-5 !py-2">
              Prenota ora
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,162,75,0.18),transparent_55%)]"
        />
        <div className="mx-auto max-w-6xl px-6 py-24 text-center sm:py-32">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-gold">
            Barbershop · Est. 2026
          </p>
          <h1 className="font-display mx-auto max-w-3xl text-5xl font-bold leading-tight sm:text-6xl">
            L&apos;arte del taglio, <span className="gold-gradient-text">l&apos;eleganza</span> della
            gestione
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-cream-dim">
            BarberOS unisce l&apos;esperienza premium del tuo salone a un gestionale completo:
            prenotazioni, incassi, clienti e campagne sconto in un unico posto.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/prenota" className="btn-gold">
              Prenota un appuntamento
            </Link>
            <Link href="/admin" className="btn-outline">
              Entra nel gestionale
            </Link>
          </div>
        </div>
      </section>

      {/* Servizi */}
      <section id="servizi" className="border-t border-white/10 bg-ink-soft/60">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="font-display text-center text-4xl font-bold">
            I nostri <span className="gold-gradient-text">servizi</span>
          </h2>
          <p className="mt-3 text-center text-cream-dim">
            Ogni servizio è prenotabile online in meno di un minuto.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES_PREVIEW.map((service) => (
              <div key={service.name} className="card flex flex-col">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-display text-lg font-semibold">{service.name}</h3>
                  <span className="text-lg font-bold text-gold">{service.price}</span>
                </div>
                <p className="mt-1 text-xs uppercase tracking-widest text-cream-dim">
                  {service.duration}
                </p>
                <p className="mt-3 flex-1 text-sm text-cream-dim">{service.description}</p>
                <Link href="/prenota" className="mt-5 text-sm font-semibold text-gold hover:text-gold-soft">
                  Prenota →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Funzionalità gestionale */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="font-display text-center text-4xl font-bold">
            Un gestionale <span className="gold-gradient-text">su misura</span>
          </h2>
          <p className="mt-3 text-center text-cream-dim">
            Pensato per chi lavora con forbici e rasoio, non con i fogli Excel.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="card">
                <span aria-hidden className="text-3xl">{feature.icon}</span>
                <h3 className="font-display mt-4 text-xl font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-cream-dim">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Prezzi abbonamento */}
      <section id="prezzi" className="border-t border-white/10 bg-ink-soft/60">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <h2 className="font-display text-center text-4xl font-bold">
            Scegli il tuo <span className="gold-gradient-text">piano</span>
          </h2>
          <p className="mt-3 text-center text-cream-dim">
            Inizia gratis con il piano Base, passa a Pro quando il tuo salone cresce.
          </p>
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {Object.values(PLANS).map((plan) => (
              <div
                key={plan.id}
                className={`card relative flex flex-col ${
                  plan.id === "pro" ? "border-gold/60 shadow-[0_0_40px_rgba(201,162,75,0.15)]" : ""
                }`}
              >
                {plan.id === "pro" && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gold px-4 py-1 text-xs font-bold uppercase tracking-widest text-ink">
                    Consigliato
                  </span>
                )}
                <h3 className="font-display text-2xl font-bold">{plan.name}</h3>
                <p className="mt-2 text-4xl font-bold text-gold">{plan.priceLabel}</p>
                <ul className="mt-6 flex-1 space-y-3">
                  {plan.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-start gap-2 text-sm text-cream-dim">
                      <span aria-hidden className="mt-0.5 text-gold">✓</span>
                      {highlight}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/admin/abbonamento?piano=${plan.id}`}
                  className={`mt-8 ${plan.id === "pro" ? "btn-gold" : "btn-outline"}`}
                >
                  {plan.id === "pro" ? "Passa a Pro" : "Inizia gratis"}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-6 py-10 text-center text-sm text-cream-dim">
          <p className="font-display text-lg text-cream">
            Barber<span className="gold-gradient-text">OS</span>
          </p>
          <p>Il gestionale premium per barbieri moderni · Vercel + Firebase + Stripe</p>
        </div>
      </footer>
    </main>
  );
}
