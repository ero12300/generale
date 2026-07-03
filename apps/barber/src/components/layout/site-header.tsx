import Link from "next/link";
import { Scissors } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-gold/10 bg-charcoal/90 backdrop-blur-xl safe-top">
      <div className="mx-auto flex h-14 sm:h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 group min-h-[44px]">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold/10 border border-gold/20">
            <Scissors className="h-5 w-5 text-gold" />
          </div>
          <span className="font-display text-lg sm:text-xl font-semibold tracking-tight">
            Barber<span className="text-gold">Pro</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm text-cream/70">
          <Link href="#features" className="hover:text-gold transition-colors">Funzionalità</Link>
          <Link href="#pricing" className="hover:text-gold transition-colors">Prezzi</Link>
          <Link href="/book/fade-studio" className="hover:text-gold transition-colors">Demo Prenotazione</Link>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Button variant="ghost" size="sm" className="min-h-[40px]" asChild>
            <Link href="/login">Accedi</Link>
          </Button>
          <Button size="sm" className="hidden sm:inline-flex min-h-[40px]" asChild>
            <Link href="/signup">Inizia Gratis</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-gold/10 bg-charcoal-light/50 py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Scissors className="h-5 w-5 text-gold" />
              <span className="font-display text-lg font-semibold">BarberPro</span>
            </div>
            <p className="text-sm text-cream/50 max-w-xs">
              Il gestionale premium per barbieri che vogliono crescere senza stress.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 text-sm">
            <div>
              <h4 className="font-medium text-cream mb-3">Prodotto</h4>
              <ul className="space-y-2 text-cream/50">
                <li><Link href="#features" className="hover:text-gold">Funzionalità</Link></li>
                <li><Link href="/pricing" className="hover:text-gold">Prezzi</Link></li>
                <li><Link href="/book/fade-studio" className="hover:text-gold">Prenota Demo</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-cream mb-3">Account</h4>
              <ul className="space-y-2 text-cream/50">
                <li><Link href="/login" className="hover:text-gold">Accedi</Link></li>
                <li><Link href="/signup" className="hover:text-gold">Registrati</Link></li>
                <li><Link href="/dashboard" className="hover:text-gold">Dashboard</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-gold/10 text-center text-xs text-cream/40">
          © {new Date().getFullYear()} BarberPro. Tutti i diritti riservati.
        </div>
      </div>
    </footer>
  );
}
