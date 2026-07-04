"use client";

import * as React from "react";
import { ConfigForm } from "@/components/porte/config-form";
import { PortaSchema } from "@/components/porte/porta-schema";
import { SchedaTecnica } from "@/components/porte/scheda-tecnica";
import { Button } from "@/components/ui/button";
import { calcolaPorta } from "@/lib/porte/calc";
import { CONFIG_DEFAULT } from "@/lib/porte/presets";
import type { ConfigurazionePorta } from "@/lib/porte/types";
import { DoorOpen, FileDown, Printer, ClipboardCheck } from "lucide-react";

type Vista = "config" | "scheda";

/**
 * Pagina principale del configuratore.
 * Layout mobile-first: form in colonna singola, anteprima schema in alto (o
 * su desktop a lato). Un footer sticky sul mobile con azioni principali.
 */
export default function HomePage() {
  const [cfg, setCfg] = React.useState<ConfigurazionePorta>({
    ...CONFIG_DEFAULT,
    opzioni: { ...CONFIG_DEFAULT.opzioni },
  });
  const [vista, setVista] = React.useState<Vista>("config");

  const risultato = React.useMemo(() => {
    try {
      return calcolaPorta(cfg);
    } catch {
      return null;
    }
  }, [cfg]);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 safe-top no-print">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center">
              <DoorOpen size={20} />
            </div>
            <div>
              <h1 className="text-base font-bold leading-tight text-slate-900 dark:text-white">
                Configuratore Porte
              </h1>
              <p className="text-[11px] leading-tight text-slate-500 dark:text-slate-400">
                Dal foro muro alla scheda di produzione
              </p>
            </div>
          </div>
          <nav className="flex gap-1 rounded-lg bg-slate-100 dark:bg-slate-800 p-1">
            <button
              type="button"
              onClick={() => setVista("config")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                vista === "config"
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-300"
              }`}
              aria-pressed={vista === "config"}
            >
              Configura
            </button>
            <button
              type="button"
              onClick={() => setVista("scheda")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                vista === "scheda"
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-300"
              }`}
              aria-pressed={vista === "scheda"}
            >
              Scheda tecnica
            </button>
          </nav>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-4 sm:py-6 pb-32 sm:pb-6">
        {vista === "config" ? (
          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-6">
            {/* Anteprima schema (mobile: in alto, desktop: sinistra sticky) */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-3 sm:p-5 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Anteprima
                  </h2>
                  {risultato && (
                    <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300">
                      {risultato.versoApertura}
                    </span>
                  )}
                </div>
                {risultato ? (
                  <div className="rounded-lg overflow-hidden bg-white">
                    <PortaSchema
                      risultato={risultato}
                      cerniere={cfg.latoCerniere}
                      manovra={cfg.manovra}
                    />
                  </div>
                ) : (
                  <div className="p-8 text-center text-sm text-slate-500">
                    Inserisci le misure del foro muro per generare lo schema.
                  </div>
                )}
                {risultato && (
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-lg bg-slate-50 dark:bg-slate-800/60 p-2">
                      <div className="text-slate-500 dark:text-slate-400">Anta</div>
                      <div className="font-bold text-slate-900 dark:text-white">
                        {Math.round(risultato.anta.larghezza)} × {Math.round(risultato.anta.altezza)} mm
                      </div>
                    </div>
                    <div className="rounded-lg bg-slate-50 dark:bg-slate-800/60 p-2">
                      <div className="text-slate-500 dark:text-slate-400">Luce passaggio</div>
                      <div className="font-bold text-slate-900 dark:text-white">
                        {Math.round(risultato.lucePassaggio.larghezza)} × {Math.round(risultato.lucePassaggio.altezza)} mm
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <ConfigForm value={cfg} onChange={setCfg} />
            </div>
          </div>
        ) : (
          <div>
            {risultato ? (
              <>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4 no-print">
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Scheda pronta. Stampa o salva in PDF dal browser.
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => setVista("config")}
                    >
                      <ClipboardCheck className="mr-1" size={16} />
                      Modifica
                    </Button>
                    <Button
                      onClick={() => scaricaSVG(risultato, cfg)}
                      variant="outline"
                    >
                      <FileDown className="mr-1" size={16} />
                      SVG
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => window.print()}
                    >
                      <Printer className="mr-1" size={16} />
                      Stampa / PDF
                    </Button>
                  </div>
                </div>
                <SchedaTecnica
                  risultato={risultato}
                  cerniere={cfg.latoCerniere}
                  manovra={cfg.manovra}
                  riferimento={cfg.riferimento}
                  note={cfg.note}
                />
              </>
            ) : (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
                Configurazione non valida. Torna al configuratore per correggere le
                misure.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer sticky mobile con azioni principali */}
      {vista === "config" && risultato && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md safe-bottom sm:hidden no-print">
          <div className="px-4 py-3 flex gap-2">
            <Button
              variant="primary"
              className="flex-1"
              onClick={() => setVista("scheda")}
            >
              Genera scheda tecnica →
            </Button>
          </div>
        </div>
      )}
    </main>
  );
}

/**
 * Scarica l'SVG dello schema serializzando il DOM live.
 */
function scaricaSVG(
  risultato: import("@/lib/porte/types").RisultatoCalcolo,
  cfg: ConfigurazionePorta
) {
  const svg = document.querySelector<SVGElement>(".print-page svg");
  if (!svg) return;
  const clone = svg.cloneNode(true) as SVGElement;
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  const serialized = new XMLSerializer().serializeToString(clone);
  const blob = new Blob([serialized], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const nome =
    (cfg.riferimento || `porta-${risultato.tipologia}`)
      .replace(/[^a-zA-Z0-9-_]/g, "_") + ".svg";
  link.href = url;
  link.download = nome;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
