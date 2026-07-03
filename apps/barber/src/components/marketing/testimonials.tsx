import { Quote } from "lucide-react";

const T = [
  {
    quote:
      "In due mesi ho ridotto del 60% le chiamate di conferma. I clienti prenotano da soli e io mi concentro sulle forbici.",
    name: "Marco Turano",
    role: "Turano Barber, Napoli",
  },
  {
    quote:
      "Le campagne porta-un-amico mi hanno portato 34 clienti nuovi. Ho recuperato il costo dell'abbonamento in una settimana.",
    name: "Alessandro D.",
    role: "AD Barbershop, Milano",
  },
  {
    quote:
      "Il registro incassi è un altro pianeta. Chiudo la cassa in 30 secondi e a fine mese ho tutti i numeri chiari.",
    name: "Salvo P.",
    role: "Old Kings, Palermo",
  },
];

export function Testimonials() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <div className="text-xs uppercase tracking-widest text-[color:var(--color-gold-200)]">
          Barbieri che l'hanno provato
        </div>
        <h2 className="mt-3 font-display text-4xl text-white md:text-5xl">
          Fatto <span className="gold-text">con</span> barbieri veri.
        </h2>
      </div>
      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {T.map((t) => (
          <blockquote key={t.name} className="glass rounded-2xl p-6">
            <Quote className="h-5 w-5 text-[color:var(--color-gold-300)]" />
            <p className="mt-4 text-white/85 leading-relaxed">{t.quote}</p>
            <footer className="mt-6 flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full gold-border font-display text-sm text-[color:var(--color-gold-200)]">
                {t.name.split(" ")[0][0]}
                {t.name.split(" ")[1]?.[0] ?? ""}
              </div>
              <div>
                <div className="text-sm text-white">{t.name}</div>
                <div className="text-xs text-white/50">{t.role}</div>
              </div>
            </footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}
