"use client";

import { useMemo, useState } from "react";
import { Download, DoorClosed, Ruler, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DOOR_MODELS,
  buildDoorExportText,
  calculateDoorConfiguration,
  type DoorCalculationResult,
  type DoorModelId,
} from "@/lib/door-configurator";

interface DoorFormState {
  modelId: DoorModelId;
  openingWidthMm: string;
  openingHeightMm: string;
  wallThicknessMm: string;
  deadWorkSideMm: string;
  deadWorkTopMm: string;
  deadWorkBottomMm: string;
  hingeSide: "left" | "right";
  openingMovement: "pull" | "push";
  hasVisionPanel: boolean;
  hasOvalWindow: boolean;
  hasFixedLeaf: boolean;
  includeDisplay: boolean;
}

const initialState: DoorFormState = {
  modelId: "compasso",
  openingWidthMm: "1000",
  openingHeightMm: "2200",
  wallThicknessMm: "120",
  deadWorkSideMm: "10",
  deadWorkTopMm: "8",
  deadWorkBottomMm: "5",
  hingeSide: "right",
  openingMovement: "pull",
  hasVisionPanel: false,
  hasOvalWindow: false,
  hasFixedLeaf: false,
  includeDisplay: false,
};

type GenerationStatus = "idle" | "error" | "success";

export default function DoorConfiguratorPage() {
  const [form, setForm] = useState<DoorFormState>(initialState);
  const [status, setStatus] = useState<GenerationStatus>("idle");
  const [errors, setErrors] = useState<string[]>([]);
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);
  const [result, setResult] = useState<DoorCalculationResult | null>(null);

  const model = useMemo(() => DOOR_MODELS.find((item) => item.id === form.modelId), [form.modelId]);

  function update<K extends keyof DoorFormState>(key: K, value: DoorFormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function parsePositiveNumber(value: string): number {
    const parsed = Number(value.replace(",", "."));
    return Number.isFinite(parsed) ? parsed : Number.NaN;
  }

  function handleGenerate() {
    const calculated = calculateDoorConfiguration({
      modelId: form.modelId,
      openingWidthMm: parsePositiveNumber(form.openingWidthMm),
      openingHeightMm: parsePositiveNumber(form.openingHeightMm),
      wallThicknessMm: parsePositiveNumber(form.wallThicknessMm),
      deadWorkSideMm: parsePositiveNumber(form.deadWorkSideMm),
      deadWorkTopMm: parsePositiveNumber(form.deadWorkTopMm),
      deadWorkBottomMm: parsePositiveNumber(form.deadWorkBottomMm),
      hingeSide: form.hingeSide,
      openingMovement: form.openingMovement,
      hasVisionPanel: form.hasVisionPanel,
      hasOvalWindow: form.hasOvalWindow,
      hasFixedLeaf: form.hasFixedLeaf,
      includeDisplay: form.includeDisplay,
    });

    if (!calculated.ok) {
      setStatus("error");
      setErrors(calculated.errors);
      setResult(null);
      return;
    }

    setStatus("success");
    setErrors([]);
    setResult(calculated.data);
    setGeneratedAt(new Date().toLocaleString("it-IT"));
  }

  function downloadJson() {
    if (!result) return;
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json;charset=utf-8" });
    downloadBlob(blob, `schema_porta_${result.modelId}.json`);
  }

  function downloadText() {
    if (!result) return;
    const blob = new Blob([buildDoorExportText(result)], { type: "text/plain;charset=utf-8" });
    downloadBlob(blob, `scheda_porta_${result.modelId}.txt`);
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Configuratore porte</h1>
        <p className="text-sm text-zinc-400">
          Inserisci foro muro, opera morta e configurazione tecnica. Ottieni misura produzione, mano destra/sinistra e schema esportabile.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Dati di configurazione</CardTitle>
            <CardDescription>Workflow rapido da cantiere a produzione, ottimizzato per uso mobile.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="door-model">Modello porta</Label>
              <select
                id="door-model"
                className="flex h-10 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 text-sm"
                value={form.modelId}
                onChange={(event) => update("modelId", event.target.value as DoorModelId)}
              >
                {DOOR_MODELS.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
              {model && <p className="text-xs text-zinc-500">{model.notes}</p>}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <MeasurementField id="opening-width" label="Larghezza vano (mm)" value={form.openingWidthMm} onChange={(value) => update("openingWidthMm", value)} />
              <MeasurementField id="opening-height" label="Altezza vano (mm)" value={form.openingHeightMm} onChange={(value) => update("openingHeightMm", value)} />
              <MeasurementField id="wall-thickness" label="Spessore muro (mm)" value={form.wallThicknessMm} onChange={(value) => update("wallThicknessMm", value)} />
              <MeasurementField id="dead-work-side" label="Opera morta laterale (mm)" value={form.deadWorkSideMm} onChange={(value) => update("deadWorkSideMm", value)} />
              <MeasurementField id="dead-work-top" label="Opera morta superiore (mm)" value={form.deadWorkTopMm} onChange={(value) => update("deadWorkTopMm", value)} />
              <MeasurementField id="dead-work-bottom" label="Opera morta inferiore (mm)" value={form.deadWorkBottomMm} onChange={(value) => update("deadWorkBottomMm", value)} />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="hinge-side">Lato cerniere</Label>
                <select
                  id="hinge-side"
                  className="flex h-10 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 text-sm disabled:opacity-50"
                  value={form.hingeSide}
                  onChange={(event) => update("hingeSide", event.target.value as "left" | "right")}
                  disabled={form.modelId === "fisso"}
                >
                  <option value="left">Sinistra</option>
                  <option value="right">Destra</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="opening-movement">Movimento apertura</Label>
                <select
                  id="opening-movement"
                  className="flex h-10 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 text-sm disabled:opacity-50"
                  value={form.openingMovement}
                  onChange={(event) => update("openingMovement", event.target.value as "pull" | "push")}
                  disabled={form.modelId === "fisso"}
                >
                  <option value="pull">A tirare</option>
                  <option value="push">A spingere</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <BooleanSwitch
                label="Compasso + fisso"
                checked={form.hasFixedLeaf}
                onCheckedChange={(checked) => update("hasFixedLeaf", checked)}
              />
              <BooleanSwitch
                label="Vision panel"
                checked={form.hasVisionPanel}
                onCheckedChange={(checked) => update("hasVisionPanel", checked)}
              />
              <BooleanSwitch
                label="Display"
                checked={form.includeDisplay}
                onCheckedChange={(checked) => update("includeDisplay", checked)}
              />
              <BooleanSwitch
                label="Oblò ovale"
                checked={form.hasOvalWindow}
                onCheckedChange={(checked) => update("hasOvalWindow", checked)}
              />
            </div>

            {status === "error" && (
              <div className="rounded-lg border border-red-900/60 bg-red-950/40 p-3 text-sm text-red-300" role="alert">
                <p className="font-medium">Controlla i dati inseriti:</p>
                <ul className="mt-1 list-disc pl-5">
                  {errors.map((error) => (
                    <li key={error}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            <Button type="button" className="w-full sm:w-auto" onClick={handleGenerate}>
              Genera schema porta
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Risultato produzione</CardTitle>
            <CardDescription>Misure finali pronte da inviare in officina o al fornitore.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!result ? (
              <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-6 text-sm text-zinc-400">
                Premi <span className="font-medium text-zinc-200">Genera schema porta</span> per ottenere il calcolo.
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <ResultRow icon={Ruler} label="Misura produzione" value={`${result.productionWidthMm} x ${result.productionHeightMm} mm`} />
                  <ResultRow icon={DoorClosed} label="Verso apertura" value={result.handingLabel} />
                  <ResultRow icon={DoorClosed} label="Lato maniglia" value={result.handleSideLabel} />
                  <ResultRow icon={Sparkles} label="Riduzione totale" value={`${result.totalReductionWidthMm} x ${result.totalReductionHeightMm} mm`} />
                </div>

                <DoorSchemeSvg
                  openingSideLabel={result.openingSideLabel}
                  handleSideLabel={result.handleSideLabel}
                  hasVisionPanel={result.hasVisionPanel}
                  hasOvalWindow={result.hasOvalWindow}
                  hasFixedLeaf={result.hasFixedLeaf}
                />

                <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-xs text-zinc-400">
                  {generatedAt && <p className="mb-1">Schema generato: {generatedAt}</p>}
                  <p>{result.technicalNotes}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button type="button" variant="secondary" onClick={downloadJson}>
                    <Download className="h-4 w-4" aria-hidden />
                    Export JSON
                  </Button>
                  <Button type="button" variant="outline" onClick={downloadText}>
                    <Download className="h-4 w-4" aria-hidden />
                    Export scheda TXT
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MeasurementField({
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
      <Input id={id} inputMode="decimal" value={value} onChange={(event) => onChange(event.target.value)} />
    </div>
  );
}

function BooleanSwitch({
  label,
  checked,
  onCheckedChange,
}: {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm">
      <span className="text-zinc-300">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onCheckedChange(event.target.checked)}
        className="h-4 w-4 accent-amber-500"
      />
    </label>
  );
}

function ResultRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2">
      <div className="flex items-center gap-2 text-xs text-zinc-400">
        <Icon className="h-3.5 w-3.5" aria-hidden />
        <span>{label}</span>
      </div>
      <p className="mt-1 text-sm font-medium">{value}</p>
    </div>
  );
}

function DoorSchemeSvg({
  openingSideLabel,
  handleSideLabel,
  hasVisionPanel,
  hasOvalWindow,
  hasFixedLeaf,
}: {
  openingSideLabel: "destra" | "sinistra";
  handleSideLabel: "destra" | "sinistra";
  hasVisionPanel: boolean;
  hasOvalWindow: boolean;
  hasFixedLeaf: boolean;
}) {
  const hingeOnRight = openingSideLabel === "destra";
  const leafX = hasFixedLeaf ? 125 : 90;
  const fixedPanelX = 40;

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
      <p className="mb-2 text-xs uppercase tracking-wide text-zinc-500">Schema porta</p>
      <svg viewBox="0 0 280 220" className="h-auto w-full rounded-md border border-zinc-800 bg-zinc-900/30">
        <rect x="20" y="20" width="240" height="180" rx="6" fill="none" stroke="#71717a" strokeWidth="2" />
        {hasFixedLeaf && (
          <rect x={fixedPanelX} y="30" width="70" height="160" fill="#27272a" stroke="#a1a1aa" strokeWidth="1.5" />
        )}
        <rect x={leafX} y="30" width="130" height="160" fill="#18181b" stroke="#d4d4d8" strokeWidth="2" />
        {hasVisionPanel && <rect x={leafX + 44} y="45" width="42" height="65" fill="#0ea5e9" fillOpacity="0.45" stroke="#bae6fd" />}
        {hasOvalWindow && <ellipse cx={leafX + 65} cy="138" rx="30" ry="20" fill="#0ea5e9" fillOpacity="0.45" stroke="#bae6fd" />}
        <circle cx={hingeOnRight ? leafX + 122 : leafX + 8} cy="110" r="5" fill="#f59e0b" />
        <line
          x1={hingeOnRight ? leafX + 130 : leafX}
          y1="110"
          x2={hingeOnRight ? leafX + 106 : leafX + 24}
          y2="88"
          stroke="#f59e0b"
          strokeWidth="2"
        />
        <text x="30" y="212" fill="#d4d4d8" fontSize="11">
          Cerniere: {openingSideLabel}
        </text>
        <text x="155" y="212" fill="#d4d4d8" fontSize="11">
          Maniglia: {handleSideLabel}
        </text>
      </svg>
    </div>
  );
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
