"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "Posso provare BarberPro senza pagare?",
    a: "Sì. Il piano Starter è gratuito e non richiede la carta di credito. Puoi gestire fino a 30 prenotazioni al mese e accedere al database clienti. Se ti piace, passi a Pro in un clic.",
  },
  {
    q: "Come funziona il pagamento?",
    a: "L'abbonamento viene addebitato tramite Stripe, il sistema di pagamento più sicuro al mondo. Paghi mensilmente, puoi disdire quando vuoi dalle impostazioni. La fatturazione è automatica ed elettronica.",
  },
  {
    q: 'Cos\'è la campagna "porta un amico"?',
    a: 'Ogni tuo cliente riceve un codice sconto personale (es. MARCO-234). Quando lo condivide con un amico e questo prenota, sia il cliente sia l\'amico ricevono uno sconto (es. 5€ a testa). Tu decidi l\'importo. È il modo più naturale per far crescere la clientela.',
  },
  {
    q: "Serve installare qualcosa?",
    a: "No. BarberPro è una web app: funziona da qualsiasi telefono, tablet o computer, senza scaricare nulla. Basta un browser aggiornato.",
  },
  {
    q: "I dati dei miei clienti sono al sicuro?",
    a: "Assolutamente. I dati sono ospitati su Firebase (Google Cloud) con crittografia. Ogni barbershop vede solo i propri clienti (multi-tenant isolato). Siamo conformi GDPR.",
  },
  {
    q: "Posso importare i clienti che già ho?",
    a: "Sì. Dal pannello dashboard puoi importare un elenco clienti da CSV o inserirli manualmente. Il supporto ti aiuta gratuitamente in fase di setup.",
  },
  {
    q: "E se il mio salone ha più barbieri?",
    a: "Il piano Pro include fino a 3 collaboratori con agende separate. Il piano Business arriva fino a 20 barbieri e supporta più sedi.",
  },
  {
    q: "Posso disdire l'abbonamento?",
    a: "Sì, in qualsiasi momento con un clic. I dati restano tuoi e li puoi esportare. Nessun vincolo di durata.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-24 border-t border-white/5">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge variant="gold" className="mb-4">
            Domande frequenti
          </Badge>
          <h2 className="font-display text-4xl sm:text-5xl text-ink-50 mb-4">
            Curiosità? Le rispondiamo{" "}
            <span className="text-gold-gradient">tutte.</span>
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div
                key={f.q}
                className={cn(
                  "glass rounded-xl transition-colors",
                  isOpen && "border-[color:var(--color-gold-500)]/40"
                )}
              >
                <button
                  className="w-full flex items-center justify-between p-5 text-left"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                >
                  <span className="font-medium text-ink-50 pr-4">{f.q}</span>
                  {isOpen ? (
                    <Minus className="h-5 w-5 text-[color:var(--color-gold-400)] shrink-0" />
                  ) : (
                    <Plus className="h-5 w-5 text-ink-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-sm text-ink-300 leading-relaxed">
                    {f.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
