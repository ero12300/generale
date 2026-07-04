import Link from "next/link";
import { DoorClosed, Ruler, FileText, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ProgettiRecenti } from "./_components/progetti-recenti";

export default function HomePage() {
  return (
    <div className="mx-auto min-h-dvh max-w-xl px-4 pt-8 pb-24 safe-top">
      <header className="mb-10">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ink text-canvas">
            <DoorClosed className="h-6 w-6" />
          </div>
          <div>
            <div className="font-display text-xl font-semibold tracking-tight">PorteForge</div>
            <div className="text-xs text-ink-muted">Configuratore porte da produzione</div>
          </div>
        </div>
        <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
          Dal vano murario alla porta,
          <br />
          <span className="text-wood">calcolata e pronta</span>.
        </h1>
        <p className="mt-3 text-base leading-relaxed text-ink-soft">
          Inserisci le misure del vano, scegli il modello, la mano, il verso di apertura.
          PorteForge calcola controtelaio, luce di passaggio e anta secondo lo standard
          italiano — e genera lo schema tecnico pronto per la produzione.
        </p>
      </header>

      <Link href="/nuovo" className="block">
        <div className="card group grain relative overflow-hidden p-6 transition-all hover:shadow-md">
          <div className="relative z-10 flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-wood text-white shadow-md shadow-wood/30 transition-transform group-hover:scale-105">
              <Ruler className="h-7 w-7" />
            </div>
            <div className="flex-1">
              <div className="text-lg font-semibold text-ink">Nuovo progetto</div>
              <div className="mt-0.5 text-sm text-ink-soft">
                Rilievo vano · Modello · Configurazione · Export
              </div>
            </div>
          </div>
        </div>
      </Link>

      <div className="mt-8">
        <ProgettiRecenti />
      </div>

      <section className="mt-12 grid gap-4 sm:grid-cols-2">
        <Feature
          icon={<Ruler className="h-5 w-5" />}
          title="Calcolo automatico"
          text="Controtelaio, luce di passaggio e anta calcolati con gioco di posa, sormonto e ingombro telaio secondo standard italiano."
        />
        <Feature
          icon={<Sparkles className="h-5 w-5" />}
          title="Configurazione completa"
          text="Bussola, sopraluce, specchiatura, ovale, mano destra o sinistra, tirare o spingere — con anteprima in tempo reale."
        />
        <Feature
          icon={<FileText className="h-5 w-5" />}
          title="Export multipli"
          text="Schema porta in SVG, PNG e PDF con distinta di produzione completa e sigla UNI EN 12519."
        />
        <Feature
          icon={<DoorClosed className="h-5 w-5" />}
          title="Ottimizzato per il cantiere"
          text="Interfaccia mobile-first pensata per il rilievo in cantiere. Progetti salvati in locale sul dispositivo."
        />
      </section>

      <footer className="mt-12 border-t border-line pt-6 text-center text-xs text-ink-muted">
        PorteForge · versione 0.1 · standard formule industria italiana
      </footer>

      <Link href="/nuovo" className="safe-bottom fixed inset-x-4 bottom-4 z-20 mx-auto max-w-xl">
        <Button variant="wood" size="lg" className="w-full shadow-lg shadow-wood/25">
          Inizia un nuovo progetto
        </Button>
      </Link>
    </div>
  );
}

function Feature({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="card p-4">
      <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-canvas-soft text-wood">
        {icon}
      </div>
      <div className="text-sm font-semibold text-ink">{title}</div>
      <div className="mt-1 text-xs leading-relaxed text-ink-soft">{text}</div>
    </div>
  );
}
