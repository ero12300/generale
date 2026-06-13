import Link from "next/link";
import { Button } from "@/components/ui/button";

export function MarketingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-emerald-500 font-bold tracking-wide">RistoProfit</span>
          <span className="text-zinc-500 text-xs hidden sm:inline">OS</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm text-zinc-400" aria-label="Menu principale">
          <Link href="/come-funziona" className="hover:text-zinc-100 transition-colors">
            Come funziona
          </Link>
          <Link href="/prezzi" className="hover:text-zinc-100 transition-colors">
            Prezzi
          </Link>
          <Link href="/referral" className="hover:text-zinc-100 transition-colors">
            Referral
          </Link>
          <Link href="/demo" className="hover:text-zinc-100 transition-colors">
            Demo
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">Accedi</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/demo">Richiedi demo</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

export function MarketingFooter() {
  return (
    <footer className="border-t border-zinc-800 py-12 mt-20">
      <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-8 text-sm text-zinc-500">
        <div>
          <p className="text-emerald-500 font-semibold mb-2">RistoProfit OS</p>
          <p>Il cruscotto economico del ristoratore.</p>
          <p className="mt-2">Emotive S.r.l. — Messina</p>
        </div>
        <div>
          <p className="text-zinc-300 font-medium mb-2">Prodotto</p>
          <ul className="space-y-1">
            <li><Link href="/come-funziona" className="hover:text-zinc-300">Come funziona</Link></li>
            <li><Link href="/prezzi" className="hover:text-zinc-300">Prezzi</Link></li>
            <li><Link href="/contatti" className="hover:text-zinc-300">Contatti</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-zinc-300 font-medium mb-2">Suite Emotive</p>
          <ul className="space-y-1">
            <li>RistoProfit OS — margini e food cost</li>
            <li>RistoCare OS — assistenza attrezzature</li>
            <li className="text-zinc-600">RistoSuite OS — in arrivo</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
