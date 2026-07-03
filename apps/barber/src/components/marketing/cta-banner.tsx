import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaBanner() {
  return (
    <section id="demo" className="mx-auto max-w-7xl px-6 pb-24">
      <div className="relative overflow-hidden rounded-[2rem] gold-border p-10 md:p-14">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[color:var(--color-gold-400)]/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-[color:var(--color-copper-500)]/20 blur-3xl" />

        <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <div className="text-xs uppercase tracking-widest text-[color:var(--color-gold-200)]">Pronto?</div>
            <h2 className="mt-3 font-display text-3xl text-white md:text-4xl">
              Provalo ora. Fra 60 secondi hai il tuo <span className="gold-text">gestionale</span> pronto.
            </h2>
            <p className="mt-3 text-white/70">
              Modalità demo caricata con dati reali di un barbershop di esempio. Nessuna registrazione.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button size="lg" variant="gold" asChild>
              <Link href="/signup">
                Prova la demo
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/book/demo-shop">Apri pagina prenotazioni</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
