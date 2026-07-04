"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Edit3, AlertTriangle, Info, CheckCircle2 } from "lucide-react";

import { calcolaPorta, distintaProduzione } from "@/lib/door-engine";
import { ottieniProgetto, type ProgettoSalvato } from "@/lib/storage";
import { DoorSchema } from "@/components/door-schema";
import { ExportPanel } from "@/components/export/export-panel";
import { Button } from "@/components/ui/button";
import { cn } from "@/components/ui/cn";

interface Props {
  id: string;
}

export function ProgettoView({ id }: Props) {
  const [progetto, setProgetto] = React.useState<ProgettoSalvato | null>(null);
  const [pronto, setPronto] = React.useState(false);
  const svgRef = React.useRef<SVGSVGElement>(null);

  React.useEffect(() => {
    setProgetto(ottieniProgetto(id));
    setPronto(true);
  }, [id]);

  if (!pronto) {
    return (
      <div className="mx-auto max-w-xl px-4 py-10 text-center text-sm text-ink-muted">
        Carico progetto…
      </div>
    );
  }

  if (!progetto) {
    return (
      <div className="mx-auto max-w-xl px-4 py-10 text-center">
        <div className="mb-4 text-lg font-medium">Progetto non trovato</div>
        <Link href="/">
          <Button variant="wood">Torna alla home</Button>
        </Link>
      </div>
    );
  }

  const config = progetto.configurazione;
  const calcolo = calcolaPorta(config);
  const distinta = distintaProduzione(config, calcolo);
  const nomeFile = progetto.nome.trim() || `porta_${config.vano.larghezzaMm}x${config.vano.altezzaMm}`;

  return (
    <div className="mx-auto max-w-xl px-4 pt-4 pb-40 safe-top">
      <header className="mb-6 flex items-center gap-3">
        <Link
          href="/"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-ink-soft transition-colors hover:text-ink"
          aria-label="Torna alla home"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="flex-1">
          <div className="text-xs font-medium uppercase tracking-wider text-ink-muted">Progetto</div>
          <div className="text-lg font-semibold leading-tight text-ink">{progetto.nome}</div>
          {progetto.cliente ? (
            <div className="mt-0.5 text-xs text-ink-muted">Cliente: {progetto.cliente}</div>
          ) : null}
        </div>
      </header>

      <div className="card overflow-hidden p-2">
        <div className="aspect-[3/4] w-full">
          <DoorSchema
            ref={svgRef}
            config={config}
            calcolo={calcolo}
            className="h-full w-full"
          />
        </div>
      </div>

      <div className="mt-6">
        <ExportPanel
          config={config}
          calcolo={calcolo}
          svgRef={svgRef}
          nomeFile={nomeFile}
        />
      </div>

      <section className="mt-8">
        <SectionTitle>Dati calcolati</SectionTitle>
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            label="Vano murario"
            value={`${calcolo.vano.larghezzaMm}×${calcolo.vano.altezzaMm}`}
            hint={`Sp. parete ${calcolo.vano.spessoreParereMm} mm`}
          />
          <StatCard
            label="Controtelaio"
            value={`${calcolo.controtelaio.larghezzaMm}×${calcolo.controtelaio.altezzaMm}`}
            hint="Ingombro esterno"
          />
          <StatCard
            label="Luce di passaggio"
            value={`${calcolo.lucePassaggio.larghezzaMm}×${calcolo.lucePassaggio.altezzaMm}`}
            hint="Netto attraversamento"
          />
          <StatCard
            label="Anta"
            value={`${calcolo.anta.larghezzaMm}×${calcolo.anta.altezzaMm}`}
            hint={
              calcolo.anta.tagliaStandardSuggerita
                ? calcolo.anta.fuoriSerie
                  ? `Su misura (std ${calcolo.anta.tagliaStandardSuggerita.larghezzaMm}×${calcolo.anta.tagliaStandardSuggerita.altezzaMm})`
                  : `Taglia standard ${calcolo.anta.tagliaStandardSuggerita.larghezzaMm}`
                : "Su misura"
            }
          />
        </div>
      </section>

      <section className="mt-8">
        <SectionTitle>Configurazione</SectionTitle>
        <dl className="card divide-y divide-line">
          <Riga k="Modello" v={config.modello} />
          <Riga
            k="Tipologia"
            v={config.tipologia === "battente-doppia" ? "Battente doppia anta" : "Battente singola anta"}
          />
          <Riga k="Verso apertura" v={`${calcolo.descrizioneManoVerso}`} />
          <Riga k="Sigla UNI EN 12519" v={calcolo.siglaManoVerso} />
          {calcolo.fissoLaterale.presente ? (
            <Riga
              k="Fisso laterale"
              v={`${calcolo.fissoLaterale.lato} · ${calcolo.fissoLaterale.larghezzaMm} mm · ${config.fissoLaterale.vetrato ? "vetrato" : "cieco"}`}
            />
          ) : null}
          {calcolo.fissoSuperiore.presente ? (
            <Riga
              k="Sopraluce"
              v={`${calcolo.fissoSuperiore.altezzaMm} mm · ${config.fissoSuperiore.vetrato ? "vetrato" : "cieco"}`}
            />
          ) : null}
          {config.specchiatura.presente ? (
            <Riga
              k="Specchiatura"
              v={`${config.specchiatura.forma} × ${config.specchiatura.numeroPannelli}`}
            />
          ) : null}
          {config.ovale.presente ? (
            <Riga
              k="Ovale"
              v={`${config.ovale.larghezzaMm}×${config.ovale.altezzaMm} mm`}
            />
          ) : null}
        </dl>
      </section>

      {calcolo.avvisi.length > 0 ? (
        <section className="mt-8">
          <SectionTitle>Avvisi</SectionTitle>
          <div className="space-y-2">
            {calcolo.avvisi.map((a, i) => (
              <AvvisoBanner key={i} livello={a.livello} messaggio={a.messaggio} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-8">
        <SectionTitle>Distinta di produzione</SectionTitle>
        <div className="card-muted p-4">
          <pre className="whitespace-pre-wrap break-words font-mono text-[11px] leading-relaxed text-ink-soft">
            {distinta.join("\n")}
          </pre>
        </div>
      </section>

      <div className="safe-bottom fixed inset-x-4 bottom-4 z-20 mx-auto max-w-xl">
        <Link href="/nuovo">
          <Button variant="wood" size="lg" className="w-full shadow-lg shadow-wood/25">
            <Edit3 className="h-4 w-4" />
            Nuovo progetto
          </Button>
        </Link>
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-3 text-xs font-medium uppercase tracking-wider text-ink-muted">
      {children}
    </div>
  );
}

function StatCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="card p-4">
      <div className="text-[11px] font-medium uppercase tracking-wider text-ink-muted">{label}</div>
      <div className="mt-1 font-display text-xl font-semibold text-ink">{value}</div>
      {hint ? <div className="mt-1 text-[11px] text-ink-muted">{hint}</div> : null}
    </div>
  );
}

function Riga({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-start justify-between gap-4 px-4 py-3">
      <div className="text-xs text-ink-muted">{k}</div>
      <div className="text-right text-sm font-medium text-ink">{v}</div>
    </div>
  );
}

function AvvisoBanner({
  livello,
  messaggio,
}: {
  livello: "info" | "warning" | "error";
  messaggio: string;
}) {
  const Icon = livello === "error" || livello === "warning" ? AlertTriangle : Info;
  return (
    <div
      className={cn(
        "flex items-start gap-2.5 rounded-xl border px-3.5 py-3 text-sm",
        livello === "error" && "border-danger/40 bg-danger/10 text-danger",
        livello === "warning" && "border-amber-500/40 bg-amber-50 text-amber-900",
        livello === "info" && "border-line bg-canvas-soft text-ink-soft"
      )}
    >
      {livello === "info" ? (
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
      ) : (
        <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      )}
      <div>{messaggio}</div>
    </div>
  );
}
