"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, DoorOpen, FolderOpen, Loader2, Ruler, Trash2 } from "lucide-react";
import { ConfiguratoreForm } from "@/components/ConfiguratoreForm";
import { SchedaView } from "@/components/SchedaView";
import { Card } from "@/components/ui";
import {
  caricaArchivio,
  eliminaDaArchivio,
  salvaInArchivio,
  type VoceArchivio,
} from "@/lib/archive";
import { calcolaScheda } from "@/lib/door/calc";
import type { ConfigPorta, SchedaProduzione } from "@/lib/door/types";
import { validaConfig } from "@/lib/door/validate";

const CONFIG_INIZIALE: ConfigPorta = {
  nome: "",
  modelloId: "classica-legno",
  tipologia: "battente",
  vano: { larghezza: 880, altezza: 2150, spessoreMuro: 105 },
  latoCerniere: "destra",
  verso: "spingere",
  opzioni: {
    sopraluce: "nessuno",
    altezzaSopraluce: 0,
    vetro: false,
    oblo: false,
    latoFisso: "sinistra",
    larghezzaFisso: 0,
    ripartizioneAnte: "simmetrica",
  },
};

type Vista = "configura" | "scheda" | "archivio";

export default function Home() {
  const [vista, setVista] = useState<Vista>("configura");
  const [config, setConfig] = useState<ConfigPorta>(CONFIG_INIZIALE);
  const [scheda, setScheda] = useState<SchedaProduzione | null>(null);
  const [errori, setErrori] = useState<string[]>([]);
  const [calcolando, setCalcolando] = useState(false);
  const [salvata, setSalvata] = useState(false);
  const [archivio, setArchivio] = useState<VoceArchivio[]>([]);

  useEffect(() => {
    setArchivio(caricaArchivio());
  }, []);

  const calcola = useCallback(() => {
    setCalcolando(true);
    setErrori([]);
    // Piccolo differimento per mostrare lo stato di caricamento su mobile.
    window.setTimeout(() => {
      const valid = validaConfig(config);
      if (!valid.ok) {
        setErrori(valid.errori);
        setScheda(null);
        setCalcolando(false);
        return;
      }
      const esito = calcolaScheda(valid.data);
      if (!esito.ok || !esito.scheda) {
        setErrori(esito.errori);
        setScheda(null);
        setCalcolando(false);
        return;
      }
      setScheda(esito.scheda);
      setSalvata(false);
      setCalcolando(false);
      setVista("scheda");
      window.scrollTo({ top: 0 });
    }, 250);
  }, [config]);

  const salva = useCallback(() => {
    if (!scheda) return;
    salvaInArchivio(scheda);
    setArchivio(caricaArchivio());
    setSalvata(true);
  }, [scheda]);

  const apriVoce = useCallback((voce: VoceArchivio) => {
    setConfig(voce.scheda.config);
    setScheda(voce.scheda);
    setSalvata(true);
    setVista("scheda");
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <div className="mx-auto flex min-h-dvh max-w-lg flex-col px-4 pb-28 pt-5">
      <header className="no-print mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {vista !== "configura" && (
            <button
              type="button"
              onClick={() => setVista("configura")}
              aria-label="Torna al configuratore"
              className="rounded-full border border-border p-2 text-muted hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
            </button>
          )}
          <div className="flex items-center gap-2">
            <DoorOpen className="h-6 w-6 text-primary" aria-hidden />
            <div>
              <h1 className="text-lg font-bold leading-tight">Porte Pro</h1>
              <p className="text-[11px] text-muted">dal vano muro alla produzione</p>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setVista(vista === "archivio" ? "configura" : "archivio")}
          aria-pressed={vista === "archivio"}
          className="flex items-center gap-1.5 rounded-full border border-border px-3 py-2 text-sm text-muted hover:text-foreground"
        >
          <FolderOpen className="h-4 w-4" aria-hidden />
          Archivio{archivio.length > 0 ? ` (${archivio.length})` : ""}
        </button>
      </header>

      {vista === "configura" && (
        <main className="space-y-4">
          <ConfiguratoreForm config={config} onChange={setConfig} />

          {errori.length > 0 && (
            <div role="alert" className="rounded-2xl border border-red-800 bg-red-950/60 p-4">
              <h2 className="mb-1 text-sm font-bold text-red-400">Correggi prima di produrre</h2>
              <ul className="list-inside list-disc space-y-1 text-sm text-red-200">
                {errori.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="fixed inset-x-0 bottom-0 border-t border-border bg-background/95 p-3 backdrop-blur">
            <button
              type="button"
              onClick={calcola}
              disabled={calcolando}
              className="mx-auto flex w-full max-w-lg items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-4 text-base font-bold text-black transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {calcolando ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> Calcolo in corso…
                </>
              ) : (
                <>
                  <Ruler className="h-5 w-5" aria-hidden /> Calcola porta da produrre
                </>
              )}
            </button>
          </div>
        </main>
      )}

      {vista === "scheda" && scheda && (
        <main>
          <SchedaView scheda={scheda} onSalva={salva} salvata={salvata} />
        </main>
      )}

      {vista === "archivio" && (
        <main className="space-y-3">
          {archivio.length === 0 ? (
            <Card>
              <p className="py-6 text-center text-sm text-muted">
                Nessuna porta in archivio. Configura una porta e premi «Salva».
              </p>
            </Card>
          ) : (
            archivio.map((voce) => (
              <Card key={voce.id}>
                <div className="flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => apriVoce(voce)}
                    className="min-w-0 flex-1 text-left"
                  >
                    <span className="block truncate font-semibold">{voce.scheda.config.nome}</span>
                    <span className="block text-xs text-muted">
                      {voce.scheda.modello.nome} · {voce.scheda.aperturaDescrizione} ·{" "}
                      {voce.scheda.ante[0].larghezza}×{voce.scheda.ante[0].altezza} mm
                    </span>
                    <span className="block text-[11px] text-muted">
                      {new Date(voce.salvataIl).toLocaleString("it-IT", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </span>
                  </button>
                  <button
                    type="button"
                    aria-label={`Elimina ${voce.scheda.config.nome}`}
                    onClick={() => setArchivio(eliminaDaArchivio(voce.id))}
                    className="rounded-full border border-border p-2 text-muted hover:border-red-700 hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden />
                  </button>
                </div>
              </Card>
            ))
          )}
        </main>
      )}
    </div>
  );
}
