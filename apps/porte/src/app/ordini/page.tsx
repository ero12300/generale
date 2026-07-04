"use client";

import * as React from "react";
import Link from "next/link";
import { DoorOpen, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { eliminaOrdine, leggiOrdini } from "@/lib/store";
import { MODELLI } from "@/lib/modelli-porta";
import type { Ordine } from "@/lib/types";
import { formatoCm, formatoData } from "@/lib/utils";

export default function OrdiniPage() {
  const [ordini, setOrdini] = React.useState<Ordine[]>([]);
  const [caricato, setCaricato] = React.useState(false);

  React.useEffect(() => {
    setOrdini(leggiOrdini());
    setCaricato(true);
  }, []);

  function onElimina(id: string) {
    if (!window.confirm("Eliminare l'ordine? Operazione irreversibile.")) return;
    eliminaOrdine(id);
    setOrdini(leggiOrdini());
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-50">Ordini porte</h1>
          <p className="mt-1 text-sm text-slate-400">
            Storico locale delle porte configurate (salvato sul dispositivo).
          </p>
        </div>
        <Link
          href="/nuova"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand-500 px-4 text-sm font-semibold text-white shadow-sm shadow-brand-500/30 transition hover:bg-brand-600"
        >
          <Plus size={18} />
          Nuova
        </Link>
      </div>

      {!caricato ? (
        <p className="text-sm text-slate-500">Caricamento…</p>
      ) : ordini.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-brand-500/10 text-brand-300">
              <DoorOpen size={28} />
            </div>
            <div>
              <CardTitle>Nessun ordine ancora</CardTitle>
              <CardDescription>Configura la prima porta per iniziare.</CardDescription>
            </div>
            <Link
              href="/nuova"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand-500 px-5 text-sm font-semibold text-white shadow-sm shadow-brand-500/30 transition hover:bg-brand-600"
            >
              <Plus size={18} /> Nuova porta
            </Link>
          </CardContent>
        </Card>
      ) : (
        <ul className="space-y-3">
          {ordini.map((o) => {
            const modello = MODELLI.find((m) => m.id === o.modello);
            return (
              <li key={o.id}>
                <Card>
                  <CardContent className="flex items-start gap-3 py-4">
                    <div className="mt-1 grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-500/15 text-brand-300">
                      <DoorOpen size={20} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline gap-2">
                        <Link
                          href={`/ordini/${o.id}`}
                          className="truncate text-base font-semibold text-slate-100 hover:text-brand-200"
                        >
                          {o.riferimento}
                        </Link>
                        <span className="text-xs text-slate-500">· {o.cliente}</span>
                      </div>
                      <div className="mt-0.5 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-400">
                        <span>{modello?.nome ?? o.modello}</span>
                        <span>
                          Foro {formatoCm(o.dimensioni.foroLarghezzaCm)} ×{" "}
                          {formatoCm(o.dimensioni.foroAltezzaCm)}
                        </span>
                        <span>
                          Anta {formatoCm(o.calcolo.anta.larghezzaCm)} ×{" "}
                          {formatoCm(o.calcolo.anta.altezzaCm)}
                        </span>
                        <span>
                          Maniglia {o.opzioni.maniglia === "destra" ? "DX" : "SX"}
                        </span>
                        <span>
                          {o.opzioni.versoApertura === "spinta" ? "Spinge" : "Tira"}
                        </span>
                        {o.opzioni.bussola && <span>Bussola</span>}
                        {o.opzioni.fisso && <span>Fisso</span>}
                        {o.opzioni.vetro !== "nessuno" && (
                          <span>Vetro {o.opzioni.vetro}</span>
                        )}
                      </div>
                      <div className="mt-1 text-[11px] text-slate-500">
                        {formatoData(o.creatoIl)}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Link
                        href={`/ordini/${o.id}`}
                        className="rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-800"
                      >
                        Apri
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onElimina(o.id)}
                        aria-label={`Elimina ${o.riferimento}`}
                        className="text-red-400 hover:bg-red-500/10 hover:text-red-300"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
