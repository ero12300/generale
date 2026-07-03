import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-ink-line/60 py-12">
      <div className="container-page flex flex-col items-center justify-between gap-6 sm:flex-row">
        <Logo />
        <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-cream/50">
          <Link href="/pricing" className="hover:text-gold-soft">Prezzi</Link>
          <Link href="/book" className="hover:text-gold-soft">Prenota</Link>
          <Link href="/login" className="hover:text-gold-soft">Accedi</Link>
        </nav>
        <p className="text-xs text-cream/35">
          © {new Date().getFullYear()} BarberPro. Realizzato per saloni ambiziosi.
        </p>
      </div>
    </footer>
  );
}
