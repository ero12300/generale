import Link from "next/link";
import { Scissors, Instagram, Mail, Github } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/5 bg-[color:var(--color-ink-950)]/60 py-14">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl gold-border bg-[color:var(--color-ink-800)]">
                <Scissors className="h-4 w-4 text-[color:var(--color-gold-300)]" />
              </span>
              <div className="font-display text-lg text-white">Rasoio</div>
            </div>
            <p className="mt-3 text-sm text-white/60">
              Il gestionale premium del barbiere. Prenotazioni, incassi, CRM e referral in un'unica app.
            </p>
          </div>

          <div>
            <div className="text-xs uppercase tracking-widest text-white/40">Prodotto</div>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link className="text-white/75 hover:text-white" href="/#funzionalita">Funzionalità</Link></li>
              <li><Link className="text-white/75 hover:text-white" href="/#prezzi">Prezzi</Link></li>
              <li><Link className="text-white/75 hover:text-white" href="/book/demo-shop">Pagina prenotazioni</Link></li>
              <li><Link className="text-white/75 hover:text-white" href="/signup">Prova gratis</Link></li>
            </ul>
          </div>

          <div>
            <div className="text-xs uppercase tracking-widest text-white/40">Risorse</div>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link className="text-white/75 hover:text-white" href="/#faq">Domande frequenti</Link></li>
              <li><Link className="text-white/75 hover:text-white" href="/#demo">Demo live</Link></li>
              <li><a className="text-white/75 hover:text-white" href="mailto:hello@rasoio.app">Contatti</a></li>
            </ul>
          </div>

          <div>
            <div className="text-xs uppercase tracking-widest text-white/40">Seguici</div>
            <div className="mt-3 flex gap-3">
              <a className="rounded-full p-2 text-white/70 hover:text-white hover:bg-white/5" href="#" aria-label="Instagram"><Instagram className="h-4 w-4" /></a>
              <a className="rounded-full p-2 text-white/70 hover:text-white hover:bg-white/5" href="mailto:hello@rasoio.app" aria-label="Email"><Mail className="h-4 w-4" /></a>
              <a className="rounded-full p-2 text-white/70 hover:text-white hover:bg-white/5" href="#" aria-label="GitHub"><Github className="h-4 w-4" /></a>
            </div>
          </div>
        </div>

        <div className="divider-gold mt-10" />
        <div className="mt-6 flex flex-col items-center justify-between gap-3 text-xs text-white/40 md:flex-row">
          <div>© {new Date().getFullYear()} Rasoio · Built for barbershop moderni.</div>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-white/70">Privacy</Link>
            <Link href="#" className="hover:text-white/70">Termini</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
