import {
  CalendarClock,
  Users2,
  Wallet,
  Gift,
  Sparkles,
  ShieldCheck,
  Bell,
  BarChart3,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: CalendarClock,
    title: "Prenotazioni intelligenti",
    desc: "Pagina pubblica personalizzata: i tuoi clienti prenotano in autonomia 24/7. Anti-doppie prenotazioni, buffer di sicurezza, promemoria automatici.",
  },
  {
    icon: Users2,
    title: "Database clienti completo",
    desc: "Storico visite, preferenze, note. Ogni cliente ha una scheda con lifetime value, tag VIP e memoria dell'ultimo taglio.",
  },
  {
    icon: Wallet,
    title: "Gestione incassi",
    desc: "Registra ogni pagamento (contanti, POS, altro). Report giornaliero, mensile e annuale, sempre in tasca.",
  },
  {
    icon: Gift,
    title: "Porta un amico",
    desc: "Ogni cliente ha un codice referral unico. Chi porta un amico guadagna, e l'amico entra scontato. Semplice e virale.",
  },
  {
    icon: Sparkles,
    title: "Codici sconto & campagne",
    desc: "Crea codici promo per riempire le fasce vuote, il compleanno del cliente o il lancio di un nuovo servizio.",
  },
  {
    icon: Bell,
    title: "Reminder automatici",
    desc: "SMS e WhatsApp automatici prima dell'appuntamento. Meno buchi in agenda, meno no-show.",
  },
  {
    icon: BarChart3,
    title: "Analisi dei ricavi",
    desc: "Capisci quali servizi rendono di più, quali orari sono d'oro, quali clienti tornano davvero. Decisioni da CEO.",
  },
  {
    icon: ShieldCheck,
    title: "Multi-tenant & sicuro",
    desc: "Ogni barbershop è isolato con permessi granulari. GDPR-compliant, backup su Firebase, dati sotto controllo.",
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-16">
          <Badge variant="gold" className="mb-4">
            Tutto quello che ti serve
          </Badge>
          <h2 className="font-display text-4xl sm:text-5xl text-ink-50 mb-4">
            Un unico strumento,
            <span className="text-gold-gradient"> zero pensieri.</span>
          </h2>
          <p className="text-lg text-ink-400">
            Basta agende cartacee, WhatsApp caotici, incassi tracciati sul retro
            di un tovagliolo. BarberPro mette ordine e fa crescere il tuo
            business.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="glass rounded-xl p-6 hover:border-[color:var(--color-gold-500)]/40 transition-colors group"
            >
              <div className="mb-4">
                <span className="grid h-11 w-11 place-items-center rounded-lg bg-[color:var(--color-gold-500)]/10 border border-[color:var(--color-gold-500)]/30 text-[color:var(--color-gold-300)] group-hover:bg-[color:var(--color-gold-500)]/20 transition-colors">
                  <f.icon className="h-5 w-5" />
                </span>
              </div>
              <h3 className="font-display text-xl text-ink-50 mb-2">
                {f.title}
              </h3>
              <p className="text-sm text-ink-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
