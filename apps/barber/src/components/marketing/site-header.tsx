"use client";

import Link from "next/link";
import { Scissors, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-provider";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { status, user } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-[color:var(--color-ink-950)]/70 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl gold-border bg-[color:var(--color-ink-800)]">
            <Scissors className="h-4 w-4 text-[color:var(--color-gold-300)]" />
          </span>
          <div className="leading-tight">
            <div className="font-display text-lg text-white">Rasoio</div>
            <div className="text-[10px] uppercase tracking-widest text-white/40">barber os</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link href="/#funzionalita" className="text-sm text-white/70 hover:text-white transition">Funzionalità</Link>
          <Link href="/#prezzi" className="text-sm text-white/70 hover:text-white transition">Prezzi</Link>
          <Link href="/#demo" className="text-sm text-white/70 hover:text-white transition">Demo pubblica</Link>
          <Link href="/book/demo-shop" className="text-sm text-white/70 hover:text-white transition">Prenota</Link>
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {status === "authed" && user ? (
            <>
              <Button variant="ghost" asChild>
                <Link href="/app">Vai al gestionale</Link>
              </Button>
              <Button variant="gold" asChild>
                <Link href="/app">Ciao, {user.displayName ?? "barbiere"} →</Link>
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Accedi</Link>
              </Button>
              <Button variant="gold" asChild>
                <Link href="/signup">Inizia gratis</Link>
              </Button>
            </>
          )}
        </div>

        <button
          className="rounded-lg p-2 text-white md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/5 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-4">
            <Link href="/#funzionalita" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-white/80 hover:bg-white/5">Funzionalità</Link>
            <Link href="/#prezzi" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-white/80 hover:bg-white/5">Prezzi</Link>
            <Link href="/book/demo-shop" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-white/80 hover:bg-white/5">Prenota</Link>
            <div className="mt-2 flex gap-2">
              <Button variant="outline" className="flex-1" asChild>
                <Link href="/login">Accedi</Link>
              </Button>
              <Button variant="gold" className="flex-1" asChild>
                <Link href="/signup">Inizia gratis</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
