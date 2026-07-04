"use client";

import { DoorSchematic } from "./door-schematic";
import type { DoorResult } from "@/lib/types";
import {
  OBLO_LABELS,
  OPENING_LABELS,
  SPINTA_LABELS,
  VERSO_LABELS,
} from "@/lib/types";
import { formatDim } from "@/lib/format";

export interface SchedaMeta {
  commessa: string;
  cliente: string;
  data: string;
}

function Row({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-[var(--color-line)] py-1.5">
      <span className="text-sm text-[var(--color-muted)]">{label}</span>
      <span
        className={
          strong
            ? "num-field text-right text-base font-bold text-[var(--color-accent)]"
            : "num-field text-right text-sm font-semibold"
        }
      >
        {value}
      </span>
    </div>
  );
}

export function SchedaProduzione({
  result,
  meta,
}: {
  result: DoorResult;
  meta: SchedaMeta;
}) {
  const i = result.input;
  return (
    <div className="mx-auto w-full max-w-3xl bg-white p-6 text-[var(--color-ink)] print-area">
      <header className="mb-5 flex items-start justify-between border-b-2 border-[var(--color-steel)] pb-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight">
            Scheda di produzione porta
          </h1>
          <p className="text-sm text-[var(--color-muted)]">
            PortaPronta · {result.modello.nome}
          </p>
        </div>
        <div className="text-right text-sm">
          <p>
            <span className="text-[var(--color-muted)]">Commessa: </span>
            <b>{meta.commessa || "—"}</b>
          </p>
          <p>
            <span className="text-[var(--color-muted)]">Cliente: </span>
            <b>{meta.cliente || "—"}</b>
          </p>
          <p>
            <span className="text-[var(--color-muted)]">Data: </span>
            <b>{meta.data}</b>
          </p>
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="print-break rounded-xl border border-[var(--color-line)] p-3">
          <DoorSchematic result={result} />
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--color-muted)]">
            <span>▭ tratteggio = foro muro</span>
            <span className="text-[var(--color-accent)]">▲ vertice = cerniere</span>
            <span>■ maniglia</span>
            <span>
              {i.spinta === "spinge" ? "— — apre in spinta" : "—— apre in tiro"}
            </span>
          </div>
        </div>

        <div className="print-break">
          <h2 className="mb-1 text-sm font-bold uppercase tracking-wide text-[var(--color-muted)]">
            Misure di produzione
          </h2>
          <Row
            label="Anta (da produrre)"
            value={formatDim(result.anta.larghezza, result.anta.altezza)}
            strong
          />
          {result.antaFissa ? (
            <Row
              label="Anta fissa"
              value={formatDim(
                result.antaFissa.larghezza,
                result.antaFissa.altezza
              )}
            />
          ) : null}
          <Row
            label="Telaio (ingombro)"
            value={formatDim(result.telaio.larghezza, result.telaio.altezza)}
          />
          <Row
            label="Luce di passaggio"
            value={formatDim(
              result.lucePassaggio.larghezza,
              result.lucePassaggio.altezza
            )}
          />
          <Row
            label="Ingombro totale"
            value={formatDim(
              result.ingombroTotale.larghezza,
              result.ingombroTotale.altezza
            )}
          />
          <Row label="Profondità telaio" value={`${result.profonditaTelaio} mm`} />

          <h2 className="mb-1 mt-4 text-sm font-bold uppercase tracking-wide text-[var(--color-muted)]">
            Rilievo & apertura
          </h2>
          <Row
            label="Foro muro"
            value={formatDim(i.foroLarghezza, i.foroAltezza)}
          />
          <Row label="Spessore muro" value={`${i.spessoreMuro} mm`} />
          <Row label="Sistema" value={OPENING_LABELS[i.tipoApertura]} />
          <Row label="Verso apertura (cerniere)" value={VERSO_LABELS[i.verso]} />
          <Row label="Lato maniglia" value={VERSO_LABELS[result.latoManiglia]} />
          <Row label="Senso" value={SPINTA_LABELS[i.spinta]} />
          <Row label="Altezza maniglia" value={`${result.altezzaManiglia} mm`} />

          <h2 className="mb-1 mt-4 text-sm font-bold uppercase tracking-wide text-[var(--color-muted)]">
            Accessori
          </h2>
          <Row label="Compasso" value={i.compasso ? "Sì" : "No"} />
          <Row label="Vetro / vetrata" value={i.vetro ? "Sì" : "No"} />
          <Row label="Oblò" value={OBLO_LABELS[i.oblo]} />
        </div>
      </div>

      {result.messaggi.length ? (
        <div className="mt-5 print-break">
          <h2 className="mb-1 text-sm font-bold uppercase tracking-wide text-[var(--color-muted)]">
            Note tecniche
          </h2>
          <ul className="space-y-1 text-sm">
            {result.messaggi.map((m, idx) => (
              <li
                key={idx}
                className={
                  m.severity === "error"
                    ? "text-red-600"
                    : m.severity === "warning"
                    ? "text-amber-700"
                    : "text-[var(--color-muted)]"
                }
              >
                {m.severity === "error"
                  ? "✕ "
                  : m.severity === "warning"
                  ? "⚠ "
                  : "• "}
                {m.testo}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {i.note ? (
        <div className="mt-4 print-break">
          <h2 className="mb-1 text-sm font-bold uppercase tracking-wide text-[var(--color-muted)]">
            Note commessa
          </h2>
          <p className="whitespace-pre-wrap text-sm">{i.note}</p>
        </div>
      ) : null}

      <footer className="mt-6 border-t border-[var(--color-line)] pt-3 text-xs text-[var(--color-muted)]">
        Documento generato da PortaPronta. Le misure sono calcolate secondo gli
        standard di mercato: verificare sempre la scheda tecnica del sistema
        prescelto e il rilievo in cantiere prima della produzione.
      </footer>
    </div>
  );
}
