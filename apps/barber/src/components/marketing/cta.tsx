import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Cta() {
  return (
    <section className="relative py-24 border-t border-white/5">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl overflow-hidden glass-strong border-[color:var(--color-gold-500)]/40 p-12 lg:p-16 text-center">
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,162,75,0.15),transparent_60%)]"
          />
          <div className="relative">
            <h2 className="font-display text-4xl sm:text-5xl text-ink-50 mb-4">
              Trasforma la tua bottega
              <br />
              in un'<span className="text-gold-gradient italic">esperienza</span>.
            </h2>
            <p className="text-lg text-ink-300 max-w-2xl mx-auto mb-8">
              Inizia gratis oggi. Non serve carta di credito. Il tuo primo
              cliente prenoterà online entro 24 ore.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button asChild size="xl">
                <Link href="/dashboard">
                  Prova BarberPro gratis
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="ghost" size="xl">
                <Link href="/b/barberia-del-corso">Vedi demo prenotazione →</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
