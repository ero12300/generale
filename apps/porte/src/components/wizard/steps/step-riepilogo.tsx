"use client";

import * as React from "react";
import { AlertTriangle, Info, CheckCircle2 } from "lucide-react";
import type { CalcoloPorta, ConfigurazionePorta } from "@/lib/door-engine";
import { distintaProduzione } from "@/lib/door-engine";
import { DoorSchema } from "@/components/door-schema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/components/ui/cn";

interface Props {
  config: ConfigurazionePorta;
  calcolo: CalcoloPorta;
  nome: string;
  cliente: string;
  onNomeChange: (v: string) => void;
  onClienteChange: (v: string) => void;
}

export function StepRiepilogo({
  config,
  calcolo,
  nome,
  cliente,
  onNomeChange,
  onClienteChange,
}: Props) {
  const distinta = distintaProduzione(config, calcolo);

  return (
    <div className="space-y-6">
      <div className="card p-5">
        <div className="mb-3 text-xs font-medium uppercase tracking-wider text-ink-muted">
          Anagrafica progetto
        </div>
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome progetto</Label>
            <Input
              id="nome"
              placeholder="Es. Porta bagno appartamento Roma"
              value={nome}
              onChange={(e) => onNomeChange(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cliente">Cliente (opzionale)</Label>
            <Input
              id="cliente"
              placeholder="Es. Rossi Mario"
              value={cliente}
              onChange={(e) => onClienteChange(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="card overflow-hidden p-3">
        <div className="mb-2 px-2 text-xs font-medium uppercase tracking-wider text-ink-muted">
          Schema tecnico
        </div>
        <div className="aspect-[3/4] w-full">
          <DoorSchema config={config} calcolo={calcolo} className="h-full w-full" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Vano murario" value={`${calcolo.vano.larghezzaMm}×${calcolo.vano.altezzaMm}`} />
        <StatCard
          label="Controtelaio"
          value={`${calcolo.controtelaio.larghezzaMm}×${calcolo.controtelaio.altezzaMm}`}
        />
        <StatCard
          label="Luce passaggio"
          value={`${calcolo.lucePassaggio.larghezzaMm}×${calcolo.lucePassaggio.altezzaMm}`}
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

      {calcolo.avvisi.length > 0 ? (
        <div className="space-y-2">
          {calcolo.avvisi.map((a, i) => (
            <AvvisoBanner key={i} livello={a.livello} messaggio={a.messaggio} />
          ))}
        </div>
      ) : (
        <AvvisoBanner
          livello="info"
          messaggio="Nessun avviso. Configurazione valida per produzione."
        />
      )}

      <div className="card-muted p-4">
        <div className="mb-2 text-xs font-medium uppercase tracking-wider text-ink-muted">
          Distinta di produzione (anteprima)
        </div>
        <pre className="whitespace-pre-wrap break-words font-mono text-[11px] leading-relaxed text-ink-soft">
          {distinta.slice(0, 20).join("\n")}…
        </pre>
      </div>
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
