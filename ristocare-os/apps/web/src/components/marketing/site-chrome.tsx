"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/pacchetti", label: "Pacchetti" },
  { href: "/assistenza", label: "Assistenza" },
  { href: "/referral", label: "Partner" },
  { href: "/contatti", label: "Contatti" },
];

export function MarketingHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#080a09]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-[4.25rem] max-w-6xl items-center justify-between px-4 lg:px-6">
        <Link href="/" className="group transition-opacity hover:opacity-90">
          <Logo size="sm" />
        </Link>

        <nav
          className="hidden md:flex items-center gap-1 rounded-full border border-white/5 bg-white/[0.03] px-2 py-1.5"
          aria-label="Navigazione sito"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 text-sm text-zinc-400 transition-colors hover:bg-white/5 hover:text-zinc-100"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="hidden sm:inline-flex" asChild>
            <Link href="/login">Accedi</Link>
          </Button>
          <Button size="sm" className="hidden sm:inline-flex shadow-lg shadow-emerald-900/30" asChild>
            <Link href="/contatti?tipo=demo">Richiedi demo</Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden px-2"
            aria-label={mobileOpen ? "Chiudi menu" : "Apri menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="md:hidden border-t border-white/5 bg-[#060807]/95 px-4 py-4 space-y-1" aria-label="Menu mobile">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block rounded-xl px-4 py-3 text-sm text-zinc-300 hover:bg-white/5"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 flex flex-col gap-2 border-t border-white/5 mt-2">
            <Button variant="secondary" asChild>
              <Link href="/login" onClick={() => setMobileOpen(false)}>Accedi</Link>
            </Button>
            <Button asChild>
              <Link href="/contatti?tipo=demo" onClick={() => setMobileOpen(false)}>Richiedi demo</Link>
            </Button>
          </div>
        </nav>
      )}
    </header>
  );
}

export function MarketingFooter() {
  return (
    <footer className="border-t border-white/5 bg-[#060807]">
      <div className="mx-auto max-w-6xl px-4 lg:px-6 py-16 grid md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <Logo size="md" />
          <p className="mt-5 text-sm text-zinc-500 leading-relaxed max-w-sm">
            Il sistema operativo per gestire attrezzature, manutenzioni e assistenza del tuo locale food.
            Meno caos in cucina, più controllo sul parco macchine.
          </p>
        </div>
        <div>
          <p className="font-medium text-sm mb-4 text-zinc-300">Servizi</p>
          <ul className="space-y-3 text-sm text-zinc-500">
            <li><Link href="/pacchetti" className="hover:text-emerald-400 transition-colors">Pacchetti SaaS</Link></li>
            <li><Link href="/assistenza" className="hover:text-emerald-400 transition-colors">Centrale operativa</Link></li>
            <li><Link href="/referral" className="hover:text-emerald-400 transition-colors">Programma referral</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-medium text-sm mb-4 text-zinc-300">Contatti</p>
          <p className="text-sm text-zinc-500">Messina e provincia</p>
          <a href="mailto:info@ristocare.it" className="text-sm text-emerald-400/80 hover:text-emerald-400 mt-2 block">
            info@ristocare.it
          </a>
        </div>
      </div>
      <div className="border-t border-white/5 py-5 text-center text-xs text-zinc-600">
        © {new Date().getFullYear()} RistoCare OS — Emotive S.r.l.
      </div>
    </footer>
  );
}
