"use client";

import * as React from "react";
import type { RisultatoCalcolo } from "@/lib/porte/types";
import { fmtDim, fmtMm, labelTipologia } from "@/lib/porte/formatter";
import { PortaSchema } from "./porta-schema";

interface SchedaTecnicaProps {
  risultato: RisultatoCalcolo;
  cerniere: import("@/lib/porte/types").LatoCerniere;
  manovra: import("@/lib/porte/types").ManovraApertura;
  riferimento?: string;
  note?: string;
}

/**
 * Scheda tecnica di produzione: layout pensato per stampa A4 verticale.
 * Contiene: intestazione, prospetto grafico, tabella misure, indicazioni
 * di produzione, disclaimer.
 */
export function SchedaTecnica({
  risultato,
  cerniere,
  manovra,
  riferimento,
  note,
}: SchedaTecnicaProps) {
  const oggi = React.useMemo(
    () => new Date().toLocaleDateString("it-IT", { day: "2-digit", month: "long", year: "numeric" }),
    []
  );

  return (
    <article className="print-page mx-auto max-w-4xl bg-white text-slate-900 rounded-2xl shadow-lg border border-slate-200 p-6 sm:p-8">
      <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 border-b border-slate-200 pb-4 mb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Scheda tecnica porta</h1>
          <p className="text-sm text-slate-500 mt-1">
            Configurazione pronta per la produzione
          </p>
        </div>
        <div className="text-right text-xs text-slate-500">
          {riferimento && (
            <div>
              <span className="font-semibold">Rif. commessa:</span> {riferimento}
            </div>
          )}
          <div>Emessa il {oggi}</div>
        </div>
      </header>

      <section className="mb-4 print-break">
        <PortaSchema
          risultato={risultato}
          cerniere={cerniere}
          manovra={manovra}
        />
      </section>

      <section className="grid sm:grid-cols-2 gap-4 mb-4 print-break">
        <Card title="Configurazione">
          <Row k="Tipologia" v={labelTipologia(risultato.tipologia)} />
          <Row k="Verso apertura" v={risultato.versoApertura} />
          <Row
            k="Posizione maniglia"
            v={risultato.posizioneManiglia === "dx" ? "Destra" : "Sinistra"}
          />
          <Row
            k="Manovra"
            v={manovra === "spingere" ? "A spingere" : "A tirare"}
          />
          <Row
            k="Sopraluce"
            v={
              risultato.sopraluce
                ? `Sì · h ${risultato.sopraluce.altezza} mm`
                : "No"
            }
          />
          <Row
            k="Fisso laterale"
            v={
              risultato.fissoLaterale
                ? `Sì · ${risultato.fissoLaterale.lato.toUpperCase()} · ${risultato.fissoLaterale.larghezza} mm`
                : "No"
            }
          />
          <Row
            k="Oblò"
            v={
              risultato.oblo
                ? `Sì · ${risultato.oblo.forma}`
                : "No"
            }
          />
        </Card>

        <Card title="Foro muro (rilievo)">
          <Row k="Larghezza" v={fmtMm(risultato.foroMuro.larghezza)} />
          <Row k="Altezza" v={fmtMm(risultato.foroMuro.altezza)} />
          <Row
            k="Spessore muro finito"
            v={fmtMm(risultato.foroMuro.spessoreMuro)}
          />
          {risultato.ingombroParete && (
            <Row
              k="Ingombro totale parete"
              v={fmtDim(risultato.ingombroParete)}
            />
          )}
        </Card>
      </section>

      <section className="mb-4 print-break">
        <Card title="Misure produzione">
          {risultato.controtelaio.presente && (
            <>
              <Row
                k="Controtelaio (esterno)"
                v={fmtDim(risultato.controtelaio.esterno)}
              />
              <Row
                k="Controtelaio (luce interna)"
                v={fmtDim(risultato.controtelaio.interno)}
              />
            </>
          )}
          <Row k="Telaio (esterno)" v={fmtDim(risultato.telaio.esterno)} />
          <Row
            k="Telaio (luce interna)"
            v={fmtDim(risultato.telaio.interno)}
          />
          <Row
            k="Spessore montante telaio"
            v={fmtMm(risultato.telaio.spessoreMontante)}
          />
          <Row k="Anta" v={fmtDim(risultato.anta)} highlight />
          <Row
            k="Luce di passaggio netta"
            v={fmtDim(risultato.lucePassaggio)}
          />
          {risultato.sopraluce && (
            <Row k="Sopraluce" v={fmtDim(risultato.sopraluce)} />
          )}
          {risultato.fissoLaterale && (
            <Row
              k="Fisso laterale"
              v={`${risultato.fissoLaterale.larghezza} × ${risultato.fissoLaterale.altezza} mm (${risultato.fissoLaterale.lato.toUpperCase()})`}
            />
          )}
          {risultato.oblo && (
            <Row
              k="Oblò"
              v={`${risultato.oblo.forma} · ${risultato.oblo.larghezza} × ${risultato.oblo.altezza} mm`}
            />
          )}
        </Card>
      </section>

      {risultato.avvisi.length > 0 && (
        <section className="mb-4 print-break">
          <Card title="Note automatiche">
            <ul className="list-disc pl-5 space-y-1 text-sm">
              {risultato.avvisi.map((a, i) => (
                <li
                  key={i}
                  className={
                    a.livello === "warning"
                      ? "text-amber-700"
                      : a.livello === "error"
                        ? "text-red-700"
                        : "text-slate-600"
                  }
                >
                  {a.messaggio}
                </li>
              ))}
            </ul>
          </Card>
        </section>
      )}

      {note && (
        <section className="mb-4 print-break">
          <Card title="Note produzione">
            <p className="text-sm text-slate-700 whitespace-pre-wrap">{note}</p>
          </Card>
        </section>
      )}

      <footer className="pt-4 mt-4 border-t border-slate-200 text-[10px] text-slate-400 leading-tight">
        <p>
          <strong>Convenzione DIN:</strong> guarda la porta dal lato in cui vedi le cerniere.
          Cerniere a sinistra → SX, a destra → DX. La maniglia sta sul lato opposto alle
          cerniere.
        </p>
        <p className="mt-1">
          Misure calcolate secondo regole di massima dell&apos;industria italiana
          (Eclisse, Ermetika, Garofoli, FIP Porte). Per commesse specifiche verificare
          sempre la scheda tecnica del produttore selezionato.
        </p>
      </footer>
    </article>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
      <h3 className="text-sm font-bold text-slate-800 mb-2">{title}</h3>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function Row({ k, v, highlight }: { k: string; v: string; highlight?: boolean }) {
  return (
    <div
      className={`flex items-baseline justify-between gap-3 text-sm ${
        highlight ? "bg-blue-50 -mx-2 px-2 py-1 rounded-md" : ""
      }`}
    >
      <span className="text-slate-600">{k}</span>
      <span
        className={`font-semibold text-right ${
          highlight ? "text-blue-700" : "text-slate-900"
        }`}
      >
        {v}
      </span>
    </div>
  );
}
