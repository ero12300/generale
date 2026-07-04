"use client";

import * as React from "react";
import Link from "next/link";
import { FolderClock, Trash2, ChevronRight } from "lucide-react";

import { listaProgetti, eliminaProgetto, type ProgettoSalvato } from "@/lib/storage";
import { calcolaPorta } from "@/lib/door-engine";

export function ProgettiRecenti() {
  const [progetti, setProgetti] = React.useState<ProgettoSalvato[]>([]);
  const [pronto, setPronto] = React.useState(false);

  React.useEffect(() => {
    setProgetti(listaProgetti());
    setPronto(true);
  }, []);

  function rimuovi(id: string) {
    eliminaProgetto(id);
    setProgetti(listaProgetti());
  }

  if (!pronto) return null;
  if (progetti.length === 0) {
    return (
      <div className="card-muted flex items-center gap-3 p-4 text-sm text-ink-soft">
        <FolderClock className="h-5 w-5 text-ink-muted" />
        <div>
          Nessun progetto ancora. Inizia con <em>Nuovo progetto</em>.
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <div className="text-xs font-medium uppercase tracking-wider text-ink-muted">
          Progetti recenti
        </div>
        <div className="text-xs text-ink-muted">{progetti.length}</div>
      </div>
      <div className="space-y-2">
        {progetti.slice(0, 6).map((p) => {
          const calcolo = calcolaPorta(p.configurazione);
          return (
            <div key={p.id} className="card flex items-stretch">
              <Link
                href={`/progetto/${p.id}`}
                className="flex flex-1 items-center gap-3 px-4 py-3.5 transition-colors hover:bg-canvas-soft"
              >
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-ink">{p.nome}</div>
                  <div className="mt-0.5 text-xs text-ink-muted">
                    {p.cliente ? `${p.cliente} · ` : ""}
                    {p.configurazione.modello} ·{" "}
                    {calcolo.anta.larghezzaMm}×{calcolo.anta.altezzaMm} mm ·{" "}
                    {calcolo.siglaManoVerso}
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-ink-muted" />
              </Link>
              <button
                onClick={() => rimuovi(p.id)}
                aria-label={`Elimina ${p.nome}`}
                className="flex items-center justify-center px-3 text-ink-muted transition-colors hover:text-danger"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
