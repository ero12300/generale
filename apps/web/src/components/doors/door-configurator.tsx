"use client";

import { useMemo, useState } from "react";
import type { DoorConfiguratorInput, DoorModel, DoorOpeningDirection, DoorSide } from "@deal-desk/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { calculateDoorSpec, createDoorExport } from "@/lib/doors/door-calculator";
import { cn } from "@/lib/utils";
import { doorConfiguratorSchema } from "@/lib/validations/api";

const defaultInput: DoorConfiguratorInput = {
  projectName: "Cantiere demo",
  roomName: "Camera 1",
  model: "hinged",
  openingDirection: "push",
  hingeSide: "right",
  wallOpening: {
    widthTopMm: 820,
    widthMiddleMm: 815,
    widthBottomMm: 818,
    heightLeftMm: 2110,
    heightRightMm: 2104,
    wallThicknessMm: 105,
  },
  options: {
    hasFixedPanel: false,
    hasCompassLeaf: false,
    hasDisplay: true,
    hasOval: false,
  },
  allowances: {
    installGapSideMm: 10,
    installGapTopMm: 10,
    undercutMm: 8,
    frameFaceMm: 25,
    deadWorkDepthMm: 30,
  },
};

const modelOptions: { value: DoorModel; label: string; hint: string }[] = [
  { value: "hinged", label: "Battente", hint: "Telaio, cerniere e maniglia." },
  { value: "sliding", label: "Scorrevole esterno muro", hint: "Anta con sormonto e binario." },
  { value: "pocket", label: "Scomparsa / scrigno", hint: "Serve parete libera laterale." },
  { value: "compass", label: "Compasso / libro", hint: "Due mezze ante pieghevoli." },
];

export function DoorConfigurator() {
  const [input, setInput] = useState<DoorConfiguratorInput>(defaultInput);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>("Configurazione demo pronta.");
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const parsed = doorConfiguratorSchema.safeParse(input);
  const spec = useMemo(() => (parsed.success ? calculateDoorSpec(parsed.data) : null), [parsed]);
  const exportText = useMemo(() => (spec ? createDoorExport(spec) : ""), [spec]);

  function update<K extends keyof DoorConfiguratorInput>(key: K, value: DoorConfiguratorInput[K]) {
    setInput((current) => ({ ...current, [key]: value }));
    setSuccess(null);
    setError(null);
  }

  function updateOpening(key: keyof DoorConfiguratorInput["wallOpening"], value: number) {
    setInput((current) => ({
      ...current,
      wallOpening: { ...current.wallOpening, [key]: value },
    }));
    setSuccess(null);
    setError(null);
  }

  function updateAllowance(key: keyof DoorConfiguratorInput["allowances"], value: number) {
    setInput((current) => ({
      ...current,
      allowances: { ...current.allowances, [key]: value },
    }));
    setSuccess(null);
    setError(null);
  }

  function updateOption(key: keyof DoorConfiguratorInput["options"], value: boolean) {
    setInput((current) => ({
      ...current,
      options: { ...current.options, [key]: value },
      model: key === "hasCompassLeaf" && value ? "compass" : current.model,
    }));
    setSuccess(null);
    setError(null);
  }

  function generateSpec() {
    setHasSubmitted(true);
    const result = doorConfiguratorSchema.safeParse(input);
    if (!result.success) {
      setSuccess(null);
      setError(result.error.issues.map((issue) => issue.message).join("; "));
      return;
    }
    setError(null);
    setSuccess("Porta calcolata e schema aggiornato.");
  }

  function downloadExport() {
    if (!exportText) return;
    const blob = new Blob([exportText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${input.roomName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-schema-porta.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
    setSuccess("Schema esportato in formato testo.");
  }

  return (
    <div className="space-y-6">
      {(error || success) && (
        <div
          role="alert"
          className={cn(
            "rounded-lg border p-3 text-sm",
            error
              ? "border-red-900/50 bg-red-950/30 text-red-300"
              : "border-emerald-900/50 bg-emerald-950/30 text-emerald-300"
          )}
        >
          {error ?? success}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)] gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">1. Dati porta</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextField
                id="projectName"
                label="Nome progetto"
                value={input.projectName}
                onChange={(value) => update("projectName", value)}
              />
              <TextField
                id="roomName"
                label="Ambiente"
                value={input.roomName}
                onChange={(value) => update("roomName", value)}
              />
              <SelectField
                id="model"
                label="Modello porta"
                value={input.model}
                onChange={(value) => {
                  const model = value as DoorModel;
                  update("model", model);
                  if (model === "pocket" || model === "sliding") {
                    update("openingDirection", "slide");
                  } else if (input.openingDirection === "slide") {
                    update("openingDirection", "push");
                  }
                }}
                options={modelOptions}
              />
              <SelectField
                id="openingDirection"
                label="Apertura"
                value={input.openingDirection}
                onChange={(value) => update("openingDirection", value as DoorOpeningDirection)}
                options={[
                  { value: "push", label: "A spingere", hint: "Entra nel locale." },
                  { value: "pull", label: "A tirare", hint: "Esce verso di te." },
                  { value: "slide", label: "Scorrevole", hint: "Usa presa o maniglione." },
                ]}
              />
              <SelectField
                id="hingeSide"
                label="Lato cerniere / scorrimento"
                value={input.hingeSide}
                onChange={(value) => update("hingeSide", value as DoorSide)}
                options={[
                  { value: "left", label: "Sinistra", hint: "Maniglia/presa a destra." },
                  { value: "right", label: "Destra", hint: "Maniglia/presa a sinistra." },
                ]}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">2. Vano muro in millimetri</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <NumberField id="widthTopMm" label="Larghezza alto" value={input.wallOpening.widthTopMm} onChange={(value) => updateOpening("widthTopMm", value)} />
              <NumberField id="widthMiddleMm" label="Larghezza centro" value={input.wallOpening.widthMiddleMm} onChange={(value) => updateOpening("widthMiddleMm", value)} />
              <NumberField id="widthBottomMm" label="Larghezza basso" value={input.wallOpening.widthBottomMm} onChange={(value) => updateOpening("widthBottomMm", value)} />
              <NumberField id="heightLeftMm" label="Altezza sinistra" value={input.wallOpening.heightLeftMm} onChange={(value) => updateOpening("heightLeftMm", value)} />
              <NumberField id="heightRightMm" label="Altezza destra" value={input.wallOpening.heightRightMm} onChange={(value) => updateOpening("heightRightMm", value)} />
              <NumberField id="wallThicknessMm" label="Spessore muro" value={input.wallOpening.wallThicknessMm} onChange={(value) => updateOpening("wallThicknessMm", value)} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">3. Accessori e tolleranze</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <Toggle label="Anta fissa" checked={input.options.hasFixedPanel} onChange={(value) => updateOption("hasFixedPanel", value)} />
                <Toggle label="Compasso" checked={input.options.hasCompassLeaf} onChange={(value) => updateOption("hasCompassLeaf", value)} />
                <Toggle label="Display/visore" checked={input.options.hasDisplay} onChange={(value) => updateOption("hasDisplay", value)} />
                <Toggle label="Ovale" checked={input.options.hasOval} onChange={(value) => updateOption("hasOval", value)} />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                <NumberField id="installGapSideMm" label="Gioco lati" value={input.allowances.installGapSideMm} onChange={(value) => updateAllowance("installGapSideMm", value)} />
                <NumberField id="installGapTopMm" label="Gioco alto" value={input.allowances.installGapTopMm} onChange={(value) => updateAllowance("installGapTopMm", value)} />
                <NumberField id="undercutMm" label="Aria sotto" value={input.allowances.undercutMm} onChange={(value) => updateAllowance("undercutMm", value)} />
                <NumberField id="frameFaceMm" label="Battuta telaio" value={input.allowances.frameFaceMm} onChange={(value) => updateAllowance("frameFaceMm", value)} />
                <NumberField id="deadWorkDepthMm" label="Opera morta" value={input.allowances.deadWorkDepthMm} onChange={(value) => updateAllowance("deadWorkDepthMm", value)} />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button type="button" onClick={generateSpec} className="h-12">
              Genera porta pronta produzione
            </Button>
            <Button type="button" variant="secondary" onClick={downloadExport} disabled={!spec} className="h-12">
              Esporta schema porta
            </Button>
          </div>
        </div>

        <aside className="space-y-4 xl:sticky xl:top-8 self-start">
          <Card className="border-amber-600/30">
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <CardTitle className="text-base">Schema produzione</CardTitle>
                <Badge variant={parsed.success ? "success" : "danger"}>
                  {parsed.success ? "Valido" : "Da correggere"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {spec ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <Metric label="Vano utile" value={`${spec.clearOpening.widthMm} x ${spec.clearOpening.heightMm}`} />
                    <Metric label="Anta" value={`${spec.production.leafWidthMm} x ${spec.production.leafHeightMm}`} />
                    <Metric label="Telaio" value={`${spec.production.frameOuterWidthMm} x ${spec.production.frameOuterHeightMm}`} />
                    <Metric label="Opera morta" value={`${spec.production.deadWork.widthMm} x ${spec.production.deadWork.heightMm}`} />
                  </div>
                  <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
                    <p className="text-xs uppercase tracking-wide text-zinc-500">Verso e maniglia</p>
                    <p className="mt-1 text-lg font-semibold text-amber-300">{spec.handing.label}</p>
                    <p className="mt-1 text-sm text-zinc-400">
                      Il lato maniglia è calcolato sempre opposto al lato cerniere/binario.
                    </p>
                  </div>
                  <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
                    <p className="text-xs uppercase tracking-wide text-zinc-500">Ferramenta</p>
                    <ul className="mt-2 space-y-1 text-sm text-zinc-300">
                      {spec.hardware.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                  {spec.warnings.length > 0 && (
                    <div className="rounded-lg border border-amber-900/50 bg-amber-950/20 p-4 text-sm text-amber-200">
                      {spec.warnings.map((warning) => (
                        <p key={warning}>{warning}</p>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <p className="text-sm text-zinc-400">
                  Correggi le misure evidenziate e rigenera la scheda porta.
                </p>
              )}
            </CardContent>
          </Card>

          {hasSubmitted && exportText && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Export testuale</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="max-h-80 overflow-auto whitespace-pre-wrap rounded-lg bg-zinc-950 p-4 text-xs text-zinc-300">
                  {exportText}
                </pre>
              </CardContent>
            </Card>
          )}
        </aside>
      </div>
    </div>
  );
}

function TextField({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} value={value} onChange={(event) => onChange(event.target.value)} />
    </div>
  );
}

function NumberField({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="number"
        inputMode="numeric"
        min={0}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-12 text-base"
      />
    </div>
  );
}

function SelectField({
  id,
  label,
  value,
  onChange,
  options,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string; hint: string }[];
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-base text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <p className="text-xs text-zinc-500">
        {options.find((option) => option.value === value)?.hint}
      </p>
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "rounded-lg border px-3 py-3 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50",
        checked
          ? "border-amber-600/60 bg-amber-600/15 text-amber-200"
          : "border-zinc-800 bg-zinc-950 text-zinc-300 hover:border-zinc-700"
      )}
    >
      {label}
      <span className="block text-xs text-zinc-500">{checked ? "Attivo" : "Non attivo"}</span>
    </button>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="mt-1 text-lg font-semibold">{value} mm</p>
    </div>
  );
}
