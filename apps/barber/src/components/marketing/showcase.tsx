import { CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const steps = [
  {
    step: "01",
    title: "Configura il tuo barbershop",
    desc: "Nome, servizi, prezzi, orari. Ci vogliono 5 minuti. La tua pagina di prenotazione è online subito.",
    points: [
      "Servizi con durata e prezzo",
      "Orari di apertura personalizzabili",
      "Slug pubblico: barberpro.app/b/tuonome",
    ],
  },
  {
    step: "02",
    title: "I clienti prenotano da soli",
    desc: "Condividi il link su Instagram, biglietti da visita, Google Business. Le prenotazioni arrivano mentre tagli.",
    points: [
      "Nessun account richiesto per il cliente",
      "Sincronizzato con la tua agenda in tempo reale",
      "Anti-doppie prenotazioni automatico",
    ],
  },
  {
    step: "03",
    title: "Fai crescere il tuo giro",
    desc: "Attiva la campagna \"porta un amico\", raccogli feedback, offri sconti mirati. Il tuo salone si riempie.",
    points: [
      "Codice referral unico per ogni cliente",
      "Sconti automatici per chi invita",
      "Report che ti dicono cosa funziona",
    ],
  },
];

export function Showcase() {
  return (
    <section id="showcase" className="relative py-24 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-16">
          <Badge variant="gold" className="mb-4">
            In 3 passi
          </Badge>
          <h2 className="font-display text-4xl sm:text-5xl text-ink-50 mb-4">
            Semplice come una rasatura,
            <span className="text-gold-gradient"> preciso come una lama.</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <div
              key={s.step}
              className="glass rounded-xl p-8 relative overflow-hidden"
            >
              <div className="font-display text-7xl text-[color:var(--color-gold-500)]/15 absolute -top-2 -right-2 select-none">
                {s.step}
              </div>
              <div className="relative">
                <div className="text-xs text-[color:var(--color-gold-300)] uppercase tracking-widest mb-3">
                  Passo {i + 1}
                </div>
                <h3 className="font-display text-2xl text-ink-50 mb-3">
                  {s.title}
                </h3>
                <p className="text-sm text-ink-400 mb-5 leading-relaxed">
                  {s.desc}
                </p>
                <ul className="space-y-2">
                  {s.points.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-sm text-ink-200">
                      <CheckCircle2 className="h-4 w-4 text-[color:var(--color-gold-400)] mt-0.5 shrink-0" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
