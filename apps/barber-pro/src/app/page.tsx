import Link from "next/link";
import {
  Scissors,
  Calendar,
  Users,
  Wallet,
  Megaphone,
  Sparkles,
  Check,
  Zap,
  ShieldCheck,
  ArrowRight,
  Star,
} from "lucide-react";
import { PLANS, PLAN_ORDER } from "@/lib/plans";
import { formatEUR } from "@/lib/utils";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <TopNav />
      <Hero />
      <Trust />
      <Features />
      <Screens />
      <Pricing />
      <FAQ />
      <Footer />
    </div>
  );
}

function TopNav() {
  return (
    <nav className="sticky top-0 z-40 border-b border-white/5 bg-ink-950/70 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#e5cd8b] to-[#a8853a] grid place-items-center text-ink-950">
            <Scissors className="w-4 h-4" strokeWidth={2.5} />
          </div>
          <span className="font-display text-lg gold-shine">BarberPro</span>
        </Link>
        <div className="hidden md:flex items-center gap-6 text-sm text-ink-300">
          <a href="#features" className="hover:text-ink-100">Funzionalità</a>
          <a href="#pricing" className="hover:text-ink-100">Prezzi</a>
          <a href="#faq" className="hover:text-ink-100">FAQ</a>
          <Link href="/book/salone-demo" className="hover:text-ink-100">Demo prenotazione</Link>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="text-sm text-ink-300 hover:text-ink-100 px-3 py-1.5"
          >
            Accedi
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-gradient-to-b from-[#e5cd8b] to-[#a8853a] text-ink-950 text-sm font-medium hover:brightness-110"
          >
            Prova gratis
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 pt-20 pb-16 lg:pt-28 lg:pb-24 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs text-[color:var(--color-gold-300)] mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Nuovo · pensato per barbieri italiani
          </div>
          <h1 className="font-display text-5xl lg:text-6xl leading-[1.05] tracking-tight">
            Il tuo salone,{" "}
            <span className="gold-shine">gestito come un marchio di lusso.</span>
          </h1>
          <p className="mt-5 text-ink-300 text-lg max-w-lg">
            Prenotazioni online, CRM clienti, incassi e campagne referral in un'unica app.
            Trasforma il tuo barbershop in un business scalabile.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 h-12 px-6 rounded-lg bg-gradient-to-b from-[#e5cd8b] via-[#d9b968] to-[#a8853a] text-ink-950 font-medium shadow-lg shadow-black/30 hover:brightness-110"
            >
              Inizia gratis
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/book/salone-demo"
              className="inline-flex items-center gap-2 h-12 px-6 rounded-lg border border-white/10 text-ink-100 hover:bg-white/[0.05]"
            >
              Vedi la demo
            </Link>
          </div>
          <div className="mt-6 flex items-center gap-4 text-sm text-ink-400">
            <div className="flex -space-x-1.5">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-7 h-7 rounded-full border-2 border-ink-950 bg-gradient-to-br from-[#e5cd8b] to-[#a8853a]" />
              ))}
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-[color:var(--color-gold-400)] text-[color:var(--color-gold-400)]" />
              ))}
            </div>
            <span>Amato da barbershop premium</span>
          </div>
        </div>

        <HeroMock />
      </div>
    </section>
  );
}

function HeroMock() {
  return (
    <div className="relative">
      <div className="absolute -inset-6 bg-gradient-to-br from-[color:var(--color-gold-500)]/20 via-transparent to-transparent blur-3xl rounded-3xl" />
      <div className="relative glass gold-ring rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-ink-400">Oggi · Salone Demo</div>
            <div className="font-display text-2xl gold-shine">€ 486,00 incassato</div>
          </div>
          <div className="text-right">
            <div className="text-xs uppercase tracking-wider text-ink-400">Prenotazioni</div>
            <div className="text-2xl font-medium">8</div>
          </div>
        </div>

        <div className="hairline my-4" />

        <div className="space-y-2.5">
          {[
            { time: "10:00", client: "Andrea Bianchi", svc: "Taglio + Barba", by: "Marco", price: "€ 38,00" },
            { time: "10:45", client: "Federico Conte", svc: "Barba scolpita", by: "Luca", price: "€ 18,00" },
            { time: "11:30", client: "Matteo Ricci", svc: "Taglio Classico", by: "Marco", price: "€ 25,00" },
            { time: "12:00", client: "Simone Ferri", svc: "Rasatura tradizionale", by: "Giulia", price: "€ 30,00" },
          ].map((row) => (
            <div key={row.time} className="flex items-center gap-3 p-2.5 rounded-lg bg-white/[0.03] border border-white/5">
              <div className="w-12 text-xs text-[color:var(--color-gold-400)] font-medium">{row.time}</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-ink-100 truncate">{row.client}</div>
                <div className="text-xs text-ink-400 truncate">{row.svc} · con {row.by}</div>
              </div>
              <div className="text-sm font-medium">{row.price}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Trust() {
  const items = [
    { icon: Zap, title: "Setup in 3 minuti", desc: "Nessuna installazione: apri l'app e sei operativo." },
    { icon: ShieldCheck, title: "Dati sicuri", desc: "Firebase + backup automatici. GDPR compliant." },
    { icon: Sparkles, title: "Design premium", desc: "Un'esperienza degna del tuo brand." },
  ];
  return (
    <section className="border-y border-white/5 bg-white/[0.015]">
      <div className="max-w-6xl mx-auto px-6 py-10 grid sm:grid-cols-3 gap-6">
        {items.map((i) => (
          <div key={i.title} className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg glass grid place-items-center text-[color:var(--color-gold-400)]">
              <i.icon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-medium text-ink-100">{i.title}</div>
              <div className="text-xs text-ink-400 mt-0.5">{i.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Features() {
  const features = [
    {
      icon: Calendar,
      title: "Prenotazioni online 24/7",
      desc: "Ogni cliente prenota dal telefono con un link. Riduci le chiamate del 70%.",
    },
    {
      icon: Users,
      title: "CRM clienti con storia",
      desc: "Ogni cliente ha la sua scheda: servizi passati, preferenze, note del barbiere.",
    },
    {
      icon: Wallet,
      title: "Incassi sotto controllo",
      desc: "Registra ogni pagamento, distingui contanti e POS, esporta a fine mese.",
    },
    {
      icon: Megaphone,
      title: "Sconti e campagne",
      desc: "Codici sconto e coupon per riempire i giorni vuoti e fidelizzare i clienti top.",
    },
    {
      icon: Sparkles,
      title: "Porta un amico",
      desc: "Il tuo cliente invita un amico e riceve credito. Il tuo marketing lavora da solo.",
    },
    {
      icon: ShieldCheck,
      title: "Multi-postazione",
      desc: "Gestisci fino a 5 barbieri (illimitati su Business). Ognuno con la propria agenda.",
    },
  ];
  return (
    <section id="features" className="max-w-6xl mx-auto px-6 py-20">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="text-xs uppercase tracking-[0.3em] text-[color:var(--color-gold-400)] mb-3">Funzionalità</div>
        <h2 className="font-display text-4xl lg:text-5xl">Tutto quello che serve, niente di più.</h2>
        <p className="text-ink-400 mt-4">Ogni funzione è pensata per farti risparmiare tempo e aumentare gli incassi.</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((f) => (
          <div key={f.title} className="glass glass-hover rounded-2xl p-6 transition">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[color:var(--color-gold-500)]/20 to-transparent grid place-items-center text-[color:var(--color-gold-400)] mb-4 border border-[color:var(--color-gold-500)]/20">
              <f.icon className="w-5 h-5" />
            </div>
            <h3 className="font-display text-xl mb-1.5">{f.title}</h3>
            <p className="text-sm text-ink-400">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Screens() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-10 grid lg:grid-cols-2 gap-10 items-center">
      <div>
        <div className="text-xs uppercase tracking-[0.3em] text-[color:var(--color-gold-400)] mb-3">Esperienza cliente</div>
        <h2 className="font-display text-4xl lg:text-5xl mb-4">Il tuo cliente prenota in <span className="gold-shine">10 secondi.</span></h2>
        <p className="text-ink-400 mb-6">
          Condividi un link (WhatsApp, Instagram, sito) e i tuoi clienti prenotano da soli, scegliendo servizio, barbiere e slot disponibile. Ricevi conferma immediata sulla tua app.
        </p>
        <ul className="space-y-2.5 text-sm">
          {[
            "Nessun account richiesto al cliente",
            "Coupon e codice referral direttamente nel form",
            "Conferme e promemoria (roadmap: WhatsApp/SMS)",
            "Modalità pubblica personalizzata con il tuo logo",
          ].map((t) => (
            <li key={t} className="flex items-center gap-2 text-ink-200">
              <Check className="w-4 h-4 text-[color:var(--color-gold-400)]" /> {t}
            </li>
          ))}
        </ul>
        <div className="mt-8">
          <Link
            href="/book/salone-demo"
            className="inline-flex items-center gap-2 h-11 px-5 rounded-lg border border-[color:var(--color-gold-500)]/40 text-[color:var(--color-gold-300)] hover:bg-[color:var(--color-gold-500)]/10"
          >
            Prova la pagina pubblica
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <div className="glass rounded-2xl p-6">
        <div className="text-xs uppercase tracking-wider text-ink-400 mb-2">Salone Demo</div>
        <div className="font-display text-2xl mb-4">Prenota il tuo appuntamento</div>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {["Taglio", "Barba", "Combo"].map((s, i) => (
            <div
              key={s}
              className={`text-center py-3 rounded-lg text-sm border ${i === 2 ? "border-[color:var(--color-gold-500)] text-[color:var(--color-gold-300)] bg-[color:var(--color-gold-500)]/10" : "border-white/10 text-ink-300"}`}
            >
              {s}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-4 gap-2 mb-2">
          {["10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30"].map((t, i) => (
            <div
              key={t}
              className={`text-center py-2 rounded-md text-xs border ${i === 3 ? "border-[color:var(--color-gold-500)] text-[color:var(--color-gold-300)] bg-[color:var(--color-gold-500)]/10" : "border-white/10 text-ink-300"}`}
            >
              {t}
            </div>
          ))}
        </div>
        <button className="w-full mt-4 h-11 rounded-lg bg-gradient-to-b from-[#e5cd8b] to-[#a8853a] text-ink-950 font-medium">
          Conferma appuntamento
        </button>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="pricing" className="max-w-6xl mx-auto px-6 py-20">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="text-xs uppercase tracking-[0.3em] text-[color:var(--color-gold-400)] mb-3">Prezzi</div>
        <h2 className="font-display text-4xl lg:text-5xl">Prova gratis, cresci quando vuoi.</h2>
        <p className="text-ink-400 mt-4">Un solo abbonamento mensile. Disdici quando vuoi.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {PLAN_ORDER.map((k) => {
          const p = PLANS[k];
          return (
            <div
              key={p.id}
              className={`relative glass rounded-2xl p-6 flex flex-col ${p.highlight ? "gold-ring" : ""}`}
            >
              {p.highlight ? (
                <div className="absolute -top-3 left-6 px-2 py-0.5 rounded-full bg-gradient-to-b from-[#e5cd8b] to-[#a8853a] text-ink-950 text-[11px] font-medium">
                  Più scelto
                </div>
              ) : null}
              <div className="flex items-baseline justify-between mb-4">
                <div>
                  <div className="text-xs uppercase tracking-wider text-ink-400">{p.name}</div>
                  <div className="font-display text-3xl mt-1">
                    {p.priceMonthlyEur === 0 ? "Gratis" : `${formatEUR(p.priceMonthlyEur)}`}
                    {p.priceMonthlyEur > 0 ? <span className="text-sm text-ink-400 font-sans">/mese</span> : null}
                  </div>
                </div>
              </div>
              <p className="text-sm text-ink-400 mb-4">{p.tagline}</p>
              <ul className="space-y-2 mb-6 flex-1">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-ink-200">
                    <Check className="w-4 h-4 mt-0.5 text-[color:var(--color-gold-400)]" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={p.id === "free" ? "/signup" : `/signup?plan=${p.id}`}
                className={`w-full inline-flex items-center justify-center gap-2 h-11 px-4 rounded-lg text-sm font-medium ${
                  p.highlight
                    ? "bg-gradient-to-b from-[#e5cd8b] to-[#a8853a] text-ink-950 hover:brightness-110"
                    : "border border-white/10 text-ink-100 hover:bg-white/[0.05]"
                }`}
              >
                {p.cta}
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function FAQ() {
  const items = [
    { q: "Serve installare qualcosa?", a: "No. BarberPro funziona nel browser di computer, tablet e smartphone." },
    { q: "Posso invitare i miei clienti?", a: "Sì: condividi il link pubblico via WhatsApp, Instagram o sul sito. I clienti prenotano da soli." },
    { q: "Come gestisco gli incassi?", a: "Ogni prenotazione completata può essere convertita in incasso in un click. Riporti giornalieri e mensili sono inclusi." },
    { q: "Cos'è il porta un amico?", a: "Ogni cliente ha un codice unico. Quando un nuovo cliente lo usa in prenotazione, entrambi ricevono un credito che decidi tu." },
    { q: "Posso cancellare l'abbonamento?", a: "Sì, in ogni momento dalla dashboard. Il piano resta attivo fino alla fine del ciclo pagato." },
    { q: "Cosa succede senza abbonamento?", a: "Puoi restare sul piano Starter (gratis) con limite di clienti e prenotazioni. Nessuna carta richiesta." },
  ];
  return (
    <section id="faq" className="max-w-4xl mx-auto px-6 py-20">
      <div className="text-center mb-10">
        <div className="text-xs uppercase tracking-[0.3em] text-[color:var(--color-gold-400)] mb-3">FAQ</div>
        <h2 className="font-display text-4xl">Domande frequenti</h2>
      </div>
      <div className="space-y-3">
        {items.map((i) => (
          <details key={i.q} className="glass rounded-xl p-5 group">
            <summary className="cursor-pointer flex items-center justify-between text-sm font-medium text-ink-100">
              {i.q}
              <span className="text-[color:var(--color-gold-400)] transition group-open:rotate-45">+</span>
            </summary>
            <p className="text-sm text-ink-400 mt-3">{i.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/5 py-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-sm text-ink-400">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#e5cd8b] to-[#a8853a] grid place-items-center text-ink-950">
            <Scissors className="w-3.5 h-3.5" strokeWidth={2.5} />
          </div>
          <span className="font-display text-base gold-shine">BarberPro</span>
          <span className="text-ink-500">· Il gestionale premium per il tuo salone</span>
        </div>
        <div className="flex items-center gap-5">
          <Link href="/login" className="hover:text-ink-100">Accedi</Link>
          <Link href="/signup" className="hover:text-ink-100">Registrati</Link>
          <a href="#pricing" className="hover:text-ink-100">Prezzi</a>
        </div>
      </div>
    </footer>
  );
}
