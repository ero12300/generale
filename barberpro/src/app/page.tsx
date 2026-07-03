import Link from "next/link";
import {
  CalendarClock,
  Users,
  Wallet,
  Megaphone,
  Smartphone,
  ShieldCheck,
  ArrowRight,
  Star,
  Gift,
} from "lucide-react";
import { SiteHeader } from "@/components/landing/SiteHeader";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { PricingCards } from "@/components/PricingCards";

const FEATURES = [
  {
    icon: CalendarClock,
    title: "Prenotazioni online",
    desc: "I clienti prenotano da soli, 24/7. Tu ricevi l'agenda già organizzata, senza telefonate.",
  },
  {
    icon: Users,
    title: "Database clienti",
    desc: "Ogni cliente con storico visite, preferenze e contatti. Riconosci i migliori a colpo d'occhio.",
  },
  {
    icon: Wallet,
    title: "Gestionale incassi",
    desc: "Registra ogni pagamento e vedi in tempo reale quanto incassi oggi, questo mese e per servizio.",
  },
  {
    icon: Megaphone,
    title: "Campagne & sconti",
    desc: "Crea promozioni e il programma 'porta un amico' con codici referral per far crescere il salone.",
  },
  {
    icon: Smartphone,
    title: "Elegante su ogni schermo",
    desc: "Interfaccia premium, veloce e intuitiva. Perfetta da tablet alla poltrona o da smartphone.",
  },
  {
    icon: ShieldCheck,
    title: "Dati al sicuro",
    desc: "Cloud Firebase con accesso protetto. I dati del tuo salone restano solo tuoi.",
  },
];

const STEPS = [
  { n: "01", title: "Crea il tuo salone", desc: "Registrati e imposta servizi, prezzi e orari in pochi minuti." },
  { n: "02", title: "Ricevi prenotazioni", desc: "Condividi il link di prenotazione: i clienti scelgono servizio e orario." },
  { n: "03", title: "Gestisci e incassa", desc: "Segna i pagamenti, monitora gli incassi e fidelizza con le campagne." },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="container-page py-20 sm:py-28">
          <div className="mx-auto max-w-3xl text-center animate-fade-up">
            <span className="badge mx-auto border-gold/30 bg-gold/5 text-gold-soft">
              <Star className="h-3.5 w-3.5" /> Il gestionale premium per barbieri
            </span>
            <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.1] text-cream sm:text-6xl">
              Il tuo salone,
              <br />
              <span className="bg-gold-gradient bg-clip-text text-transparent">gestito con stile.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg text-cream/60">
              Prenotazioni online, clienti, incassi e marketing in un&apos;unica app elegante.
              Meno telefonate, più clienti, tutto sotto controllo.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/login" className="btn-gold w-full sm:w-auto">
                Inizia gratis <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/book" className="btn-ghost w-full sm:w-auto">
                Vedi la prenotazione online
              </Link>
            </div>
            <p className="mt-4 text-xs text-cream/40">
              Nessuna carta richiesta · Modalità demo pronta all&apos;uso
            </p>
          </div>
        </div>
      </section>

      {/* Funzioni */}
      <section id="funzioni" className="container-page py-16">
        <div className="mx-auto max-w-2xl text-center">
          <p className="kicker">Tutto ciò che ti serve</p>
          <h2 className="mt-3 font-display text-3xl text-cream sm:text-4xl">
            Un solo strumento per far girare il salone
          </h2>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="card p-6 transition hover:border-gold/30">
              <span className="grid h-11 w-11 place-items-center rounded-xl border border-gold/20 bg-gold/5 text-gold-soft">
                <f.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display text-xl text-cream">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-cream/55">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Come funziona */}
      <section id="come-funziona" className="border-y border-ink-line/60 bg-ink-soft/40 py-16">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <p className="kicker">Semplice come un taglio</p>
            <h2 className="mt-3 font-display text-3xl text-cream sm:text-4xl">In 3 passi sei operativo</h2>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n} className="relative">
                <span className="font-display text-5xl font-semibold text-gold/20">{s.n}</span>
                <h3 className="mt-2 font-display text-xl text-cream">{s.title}</h3>
                <p className="mt-2 text-sm text-cream/55">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Referral highlight */}
      <section className="container-page py-16">
        <div className="card overflow-hidden p-8 sm:p-12">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div>
              <span className="badge border-gold/30 bg-gold/5 text-gold-soft">
                <Gift className="h-3.5 w-3.5" /> Porta un amico
              </span>
              <h2 className="mt-4 font-display text-3xl text-cream">
                Trasforma i clienti nei tuoi migliori venditori
              </h2>
              <p className="mt-3 text-cream/60">
                Ogni cliente ha un codice personale. Quando invita un amico, entrambi ricevono uno
                sconto. Il passaparola diventa un motore di crescita misurabile.
              </p>
              <Link href="/login" className="btn-outline-gold mt-6">
                Attiva le campagne <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="rounded-2xl border border-gold/20 bg-ink-soft p-6">
              <p className="text-xs uppercase tracking-widest text-cream/40">Codice referral</p>
              <p className="mt-2 font-display text-3xl text-gold-soft">MARCO2048</p>
              <div className="mt-5 space-y-2 text-sm text-cream/70">
                <div className="flex items-center justify-between border-b border-ink-line pb-2">
                  <span>Sconto invitante</span> <span className="text-gold-soft">-20%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Sconto amico</span> <span className="text-gold-soft">-20%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Prezzi */}
      <section id="prezzi" className="container-page py-16">
        <div className="mx-auto max-w-2xl text-center">
          <p className="kicker">Prezzi trasparenti</p>
          <h2 className="mt-3 font-display text-3xl text-cream sm:text-4xl">Inizia gratis, cresci con Pro</h2>
          <p className="mt-3 text-cream/55">
            Parti senza spendere. Passa a Pro quando vuoi clienti illimitati, campagne e analisi avanzate.
          </p>
        </div>
        <div className="mx-auto mt-12 max-w-4xl">
          <PricingCards />
        </div>
      </section>

      {/* CTA finale */}
      <section className="container-page pb-24 pt-8">
        <div className="card relative overflow-hidden bg-ink-radial p-10 text-center sm:p-16">
          <h2 className="font-display text-3xl text-cream sm:text-4xl">
            Pronto a dare stile alla gestione del tuo salone?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-cream/60">
            Attiva la modalità demo e prova subito tutte le funzioni, senza registrazione.
          </p>
          <Link href="/login" className="btn-gold mx-auto mt-8">
            Entra in BarberPro <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
