"use client";

import Link from "next/link";
import { Scissors, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { href: "#features", label: "Funzionalità" },
  { href: "#showcase", label: "Come funziona" },
  { href: "#pricing", label: "Prezzi" },
  { href: "#faq", label: "Domande" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-[color:var(--color-ink-950)]/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-gradient-to-br from-[color:var(--color-gold-400)] to-[color:var(--color-gold-500)] text-ink-950 shadow-[var(--shadow-glow)]">
            <Scissors className="h-4 w-4" />
          </span>
          <span className="font-display text-xl text-ink-50 tracking-wide">
            BarberPro
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-ink-300 hover:text-[color:var(--color-gold-300)] transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Button asChild variant="ghost" size="sm">
            <Link href="/accedi">Accedi</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/dashboard">Prova gratis</Link>
          </Button>
        </div>

        <button
          className="md:hidden text-ink-100"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <div
        className={cn(
          "md:hidden overflow-hidden border-t border-white/5 bg-[color:var(--color-ink-950)]/95 transition-[max-height]",
          open ? "max-h-96" : "max-h-0"
        )}
      >
        <div className="mx-auto max-w-7xl px-4 py-4 flex flex-col gap-3">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-ink-200 py-2"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <div className="flex gap-2 pt-2 border-t border-white/5">
            <Button asChild variant="secondary" size="sm" className="flex-1">
              <Link href="/accedi">Accedi</Link>
            </Button>
            <Button asChild size="sm" className="flex-1">
              <Link href="/dashboard">Prova gratis</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
