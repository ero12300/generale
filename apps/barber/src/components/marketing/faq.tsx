const FAQ = [
  {
    q: "Serve una carta di credito per iniziare?",
    a: "No. Il piano Free e la modalità demo sono senza carta. Aggiungi Stripe solo quando decidi di attivare Base o Pro.",
  },
  {
    q: "I miei dati dove finiscono?",
    a: "Firebase (Google Cloud, region europe-west) con backup automatici. In modalità demo tutto resta nel tuo browser.",
  },
  {
    q: "Posso passare Base ↔ Pro senza perdere dati?",
    a: "Sì. Il cambio piano è istantaneo dal portale Stripe. Nessuna migrazione, nessuna interruzione.",
  },
  {
    q: "Cosa cambia rispetto ai gestionali tradizionali?",
    a: "Zero installazione, apri dal browser o dal telefono. Design premium, pensato per barbieri che curano il brand.",
  },
  {
    q: "Posso condividere il link prenotazioni su Instagram?",
    a: "Sì: ogni barbershop ha un link pubblico (es. rasoio.app/book/tuoshop) da mettere in bio, WhatsApp o QR.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="mx-auto max-w-4xl px-6 py-24">
      <div className="text-center">
        <div className="text-xs uppercase tracking-widest text-[color:var(--color-gold-200)]">FAQ</div>
        <h2 className="mt-3 font-display text-4xl text-white md:text-5xl">
          Le risposte <span className="gold-text">che aspetti</span>.
        </h2>
      </div>
      <div className="mt-10 space-y-3">
        {FAQ.map((f) => (
          <details
            key={f.q}
            className="group glass rounded-2xl p-5 open:border-[color:var(--color-gold-300)]/30"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
              <span className="font-display text-lg text-white">{f.q}</span>
              <span className="grid h-8 w-8 place-items-center rounded-full border border-white/10 text-white/60 group-open:rotate-45 transition">+</span>
            </summary>
            <p className="mt-3 text-white/70 leading-relaxed">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
