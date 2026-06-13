import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/logo";

const navLinks = [
  { href: "/come-funziona", label: "Come funziona" },
  { href: "/prezzi", label: "Prezzi" },
  { href: "/referral", label: "Referral" },
  { href: "/demo", label: "Demo" },
];

export function MarketingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border-subtle)] glass-panel">
      <div className="max-w-6xl mx-auto px-4 h-[4.25rem] flex items-center justify-between">
        <Logo size="md" />
        <nav
          className="hidden md:flex items-center gap-1 text-sm"
          aria-label="Menu principale"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-white/5 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">Accedi</Link>
          </Button>
          <Button size="sm" className="shadow-lg shadow-emerald-900/20" asChild>
            <Link href="/demo">Richiedi demo</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

export function MarketingFooter() {
  return (
    <footer className="border-t border-[var(--border-subtle)] mt-24">
      <div className="gold-line max-w-6xl mx-auto opacity-50" />
      <div className="max-w-6xl mx-auto px-4 py-14 grid md:grid-cols-4 gap-10 text-sm">
        <div className="md:col-span-2">
          <Logo size="sm" href="/" />
          <p className="mt-4 text-zinc-400 max-w-sm leading-relaxed">
            Il cruscotto economico per ristoratori che vogliono sapere dove guadagnano
            e dove perdono margine — ogni giorno.
          </p>
          <p className="mt-4 text-zinc-500 text-xs">Emotive S.r.l. · Messina e provincia</p>
        </div>
        <div>
          <p className="text-zinc-200 font-medium mb-3">Prodotto</p>
          <ul className="space-y-2 text-zinc-500">
            <li><Link href="/come-funziona" className="hover:text-emerald-400 transition-colors">Come funziona</Link></li>
            <li><Link href="/prezzi" className="hover:text-emerald-400 transition-colors">Prezzi</Link></li>
            <li><Link href="/contatti" className="hover:text-emerald-400 transition-colors">Contatti</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-zinc-200 font-medium mb-3">Suite Emotive</p>
          <ul className="space-y-2 text-zinc-500">
            <li className="text-emerald-400/80">RistoProfit OS</li>
            <li>RistoCare OS</li>
            <li className="text-zinc-600">RistoSuite OS — in arrivo</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
