import Link from "next/link";
import { Shield, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MarketingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-[#0c0f0e]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600/20 border border-emerald-600/30">
            <Shield className="h-5 w-5 text-emerald-400" aria-hidden />
          </div>
          <div>
            <p className="font-semibold tracking-tight text-zinc-100">RistoCare OS</p>
            <p className="text-[10px] uppercase tracking-widest text-zinc-500">Emotive S.r.l.</p>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm text-zinc-400" aria-label="Navigazione sito">
          <Link href="/pacchetti" className="hover:text-zinc-100 transition-colors">Pacchetti</Link>
          <Link href="/assistenza" className="hover:text-zinc-100 transition-colors">Assistenza</Link>
          <Link href="/referral" className="hover:text-zinc-100 transition-colors">Partner</Link>
          <Link href="/contatti" className="hover:text-zinc-100 transition-colors">Contatti</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">Accedi</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/contatti?tipo=demo">Richiedi demo</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

export function MarketingFooter() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950">
      <div className="mx-auto max-w-6xl px-4 py-12 grid md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Wrench className="h-5 w-5 text-emerald-500" aria-hidden />
            <span className="font-semibold">RistoCare OS</span>
          </div>
          <p className="text-sm text-zinc-500 leading-relaxed">
            Il sistema operativo per gestire attrezzature, manutenzioni e assistenza del tuo locale food.
            Brand dedicato di Emotive S.r.l.
          </p>
        </div>
        <div>
          <p className="font-medium text-sm mb-3 text-zinc-300">Servizi</p>
          <ul className="space-y-2 text-sm text-zinc-500">
            <li><Link href="/pacchetti" className="hover:text-zinc-300">Pacchetti SaaS</Link></li>
            <li><Link href="/assistenza" className="hover:text-zinc-300">Centrale operativa</Link></li>
            <li><Link href="/referral" className="hover:text-zinc-300">Programma referral</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-medium text-sm mb-3 text-zinc-300">Contatti</p>
          <p className="text-sm text-zinc-500">Messina e provincia</p>
          <p className="text-sm text-zinc-500 mt-1">info@ristocare.it</p>
        </div>
      </div>
      <div className="border-t border-zinc-800 py-4 text-center text-xs text-zinc-600">
        © {new Date().getFullYear()} RistoCare OS — Emotive S.r.l. Tutti i diritti riservati.
      </div>
    </footer>
  );
}
