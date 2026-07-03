import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink-line/60 bg-ink/80 backdrop-blur-xl">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" aria-label="BarberPro home">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-cream/70 md:flex">
          <Link href="/#funzioni" className="transition hover:text-gold-soft">Funzioni</Link>
          <Link href="/#come-funziona" className="transition hover:text-gold-soft">Come funziona</Link>
          <Link href="/pricing" className="transition hover:text-gold-soft">Prezzi</Link>
          <Link href="/book" className="transition hover:text-gold-soft">Prenota</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/login" className="btn-ghost hidden sm:inline-flex">Accedi</Link>
          <Link href="/login" className="btn-gold">Prova gratis</Link>
        </div>
      </div>
    </header>
  );
}
