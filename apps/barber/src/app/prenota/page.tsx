import { Suspense } from "react";
import Link from "next/link";
import { Scissors } from "lucide-react";
import { BookingWizard } from "./booking-wizard";

export const dynamic = "force-dynamic";

export default function PrenotaPage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-border">
        <nav className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <Scissors className="h-5 w-5 text-gold" aria-hidden />
            <span className="font-display text-xl font-bold">
              Barber<span className="text-gold">OS</span>
            </span>
          </Link>
          <Link href="/" className="text-sm text-muted transition-colors hover:text-foreground">
            ← Torna al sito
          </Link>
        </nav>
      </header>
      <main className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="font-display text-4xl font-bold">
          Prenota il tuo <span className="text-gold">appuntamento</span>
        </h1>
        <p className="mt-2 text-muted">
          Scegli servizio, barbiere e orario. Bastano 30 secondi.
        </p>
        <Suspense fallback={<p className="mt-10 text-muted">Caricamento…</p>}>
          <BookingWizard />
        </Suspense>
      </main>
    </div>
  );
}
