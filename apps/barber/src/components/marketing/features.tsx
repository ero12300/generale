import {
  CalendarClock,
  Users,
  Wallet,
  Gift,
  BarChart3,
  ShieldCheck,
} from "lucide-react";

const FEATURES = [
  {
    icon: CalendarClock,
    title: "Prenotazioni online 24/7",
    desc: "Link pubblico brandizzato con orari, servizi e disponibilità reale. Zero attriti per il cliente.",
  },
  {
    icon: Wallet,
    title: "Registro incassi & report",
    desc: "POS integrato: contanti, carta, bonifico. Report giornalieri, settimanali, mensili con export CSV.",
  },
  {
    icon: Users,
    title: "Database clienti (CRM)",
    desc: "Storico visite, spesa media, tag VIP, note su preferenze. Ricerca istantanea.",
  },
  {
    icon: Gift,
    title: "Sconti & Referral",
    desc: "Codici sconto per campagne stagionali e programma \"porta-un-amico\" con reward per entrambi.",
  },
  {
    icon: BarChart3,
    title: "Dashboard patrimoniale",
    desc: "Top servizi, clienti più fedeli, andamento settimana su settimana. Grafici puliti, decisioni rapide.",
  },
  {
    icon: ShieldCheck,
    title: "Sicuro & scalabile",
    desc: "Firebase Auth, dati criptati, backup automatici. Multi-postazione con piano Pro.",
  },
];

export function Features() {
  return (
    <section id="funzionalita" className="mx-auto max-w-7xl px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <div className="text-xs uppercase tracking-widest text-[color:var(--color-gold-200)]">Cosa include</div>
        <h2 className="mt-3 font-display text-4xl text-white md:text-5xl">
          Tutto quello che serve, <span className="gold-text">niente di più</span>.
        </h2>
        <p className="mt-4 text-white/70">
          Ogni funzione è pensata per farti risparmiare minuti al giorno e aiutarti a incassare di più.
        </p>
      </div>

      <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f) => (
          <div key={f.title} className="glass rounded-2xl p-6 transition hover:-translate-y-0.5">
            <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl gold-border text-[color:var(--color-gold-300)]">
              <f.icon className="h-5 w-5" />
            </div>
            <h3 className="font-display text-xl text-white">{f.title}</h3>
            <p className="mt-2 text-sm text-white/65">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
