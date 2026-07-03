import Link from "next/link";
import { Scissors } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative border-t border-white/5 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="grid h-9 w-9 place-items-center rounded-md bg-gradient-to-br from-[color:var(--color-gold-400)] to-[color:var(--color-gold-500)] text-ink-950">
                <Scissors className="h-4 w-4" />
              </span>
              <span className="font-display text-xl text-ink-50">BarberPro</span>
            </Link>
            <p className="text-sm text-ink-400 max-w-md">
              Il gestionale premium per barbershop moderni. Prenotazioni,
              clienti, incassi e crescita — in un'unica app.
            </p>
          </div>

          <div>
            <div className="text-xs uppercase tracking-widest text-ink-500 mb-3">
              Prodotto
            </div>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#features" className="text-ink-300 hover:text-ink-50">
                  Funzionalità
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-ink-300 hover:text-ink-50">
                  Prezzi
                </a>
              </li>
              <li>
                <Link href="/b/barberia-del-corso" className="text-ink-300 hover:text-ink-50">
                  Demo prenotazione
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-ink-300 hover:text-ink-50">
                  Dashboard demo
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <div className="text-xs uppercase tracking-widest text-ink-500 mb-3">
              Info
            </div>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="mailto:hello@barberpro.app" className="text-ink-300 hover:text-ink-50">
                  Contattaci
                </a>
              </li>
              <li>
                <span className="text-ink-500">Privacy & GDPR</span>
              </li>
              <li>
                <span className="text-ink-500">Termini di servizio</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ink-500">
          <div>
            © {new Date().getFullYear()} BarberPro. Made with{" "}
            <span className="text-[color:var(--color-gold-400)]">◆</span> in Italia.
          </div>
          <div>Pagamenti sicuri via Stripe · Dati su Firebase</div>
        </div>
      </div>
    </footer>
  );
}
