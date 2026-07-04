"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Clipboard, Download, Ruler, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  buildDoorProductionExport,
  calculateDoorProductionSpec,
  type DoorModel,
  type DoorProductionInput,
  type DoorProductionSpec,
  type DoorSide,
  type DoorSwing,
} from "@/lib/doors/door-calculator";

const DEFAULT_INPUT: DoorProductionInput = {
  openingWidthMm: 980,
  openingHeightMm: 2140,
  wallThicknessMm: 110,
  model: "single_hinged",
  hingeSide: "right",
  swing: "pull",
  installationGapWidthMm: 20,
  installationGapHeightMm: 12,
  frameProfileMm: 45,
  thresholdClearanceMm: 8,
  activeLeafPercent: 60,
  hasVisionPanel: false,
  hasDigitalViewer: false,
  hasOvalWindow: false,
};

const MODEL_OPTIONS: Array<{ value: DoorModel; label: string; hint: string }> = [
  {
    value: "single_hinged",
    label: "Battente singola",
    hint: "Una anta mobile con telaio standard.",
  },
  {
    value: "double_with_fixed",
    label: "Doppia con opera morta",
    hint: "Anta attiva e anta fissa/passiva.",
  },
  {
    value: "double_active",
    label: "Doppia apribile",
    hint: "Due ante apribili con divisione 50/50.",
  },
  {
    value: "sliding_pocket",
    label: "Scorrevole interno muro",
    hint: "Anta maggiorata con indicazione parete libera.",
  },
  {
    value: "folding_compass",
    label: "Compasso / libro",
    hint: "Due pannelli pieghevoli.",
  },
];

type ExportStatus = "idle" | "copied" | "downloaded" | "error";

export function DoorConfigurator() {
  const [input, setInput] = useState<DoorProductionInput>(DEFAULT_INPUT);
  const [exportStatus, setExportStatus] = useState<ExportStatus>("idle");
  const spec = useMemo(() => calculateDoorProductionSpec(input), [input]);
  const exportText = useMemo(() => buildDoorProductionExport(spec), [spec]);

  function updateNumber(field: keyof DoorProductionInput, value: string) {
    setInput((current) => ({
      ...current,
      [field]: Number.isFinite(Number(value)) ? Number(value) : 0,
    }));
  }

  async function copyExport() {
    try {
      await navigator.clipboard.writeText(exportText);
      setExportStatus("copied");
    } catch {
      setExportStatus("error");
    }
  }

  function downloadExport() {
    const blob = new Blob([exportText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `scheda-porta-${spec.modelLabel.toLowerCase().replace(/\s+/g, "-")}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    setExportStatus("downloaded");
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#3f2a12_0,#09090b_42%)] px-4 py-5 text-zinc-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <Hero />

        <div className="grid gap-5 lg:grid-cols-[minmax(0,0.92fr)_minmax(420px,1.08fr)]">
          <Card className="border-zinc-800/80 bg-zinc-950/80">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Ruler className="h-5 w-5 text-amber-400" aria-hidden />
                Misure vano e modello
              </CardTitle>
              <CardDescription>
                Inserisci la luce muro minima rilevata in cantiere. I valori sono in millimetri.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <section className="grid gap-4 sm:grid-cols-3">
                <NumberField
                  id="opening-width"
                  label="Larghezza vano"
                  value={input.openingWidthMm}
                  onChange={(value) => updateNumber("openingWidthMm", value)}
                />
                <NumberField
                  id="opening-height"
                  label="Altezza vano"
                  value={input.openingHeightMm}
                  onChange={(value) => updateNumber("openingHeightMm", value)}
                />
                <NumberField
                  id="wall-thickness"
                  label="Spessore muro"
                  value={input.wallThicknessMm}
                  onChange={(value) => updateNumber("wallThicknessMm", value)}
                />
              </section>

              <section className="space-y-3">
                <Label htmlFor="door-model">Tipo porta</Label>
                <select
                  id="door-model"
                  value={input.model}
                  onChange={(event) =>
                    setInput((current) => ({ ...current, model: event.target.value as DoorModel }))
                  }
                  className="h-11 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 text-sm text-zinc-100 focus-visible:ring-2 focus-visible:ring-amber-500/50"
                >
                  {MODEL_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-zinc-500">
                  {MODEL_OPTIONS.find((option) => option.value === input.model)?.hint}
                </p>
              </section>

              <section className="grid gap-4 sm:grid-cols-2">
                <SelectField
                  id="hinge-side"
                  label="Lato cerniere"
                  value={input.hingeSide}
                  options={[
                    { value: "left", label: "Sinistra" },
                    { value: "right", label: "Destra" },
                  ]}
                  onChange={(value) =>
                    setInput((current) => ({ ...current, hingeSide: value as DoorSide }))
                  }
                />
                <SelectField
                  id="door-swing"
                  label="Apertura"
                  value={input.swing}
                  options={[
                    { value: "pull", label: "A tirare" },
                    { value: "push", label: "A spingere" },
                  ]}
                  onChange={(value) => setInput((current) => ({ ...current, swing: value as DoorSwing }))}
                />
              </section>

              {input.model === "double_with_fixed" && (
                <NumberField
                  id="active-leaf-percent"
                  label="Percentuale anta attiva"
                  value={input.activeLeafPercent ?? 60}
                  min={40}
                  max={80}
                  onChange={(value) => updateNumber("activeLeafPercent", value)}
                />
              )}

              <section className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
                <div className="mb-4 flex items-center gap-2">
                  <Settings2 className="h-4 w-4 text-amber-400" aria-hidden />
                  <h2 className="text-sm font-semibold">Regole di calcolo</h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <NumberField
                    id="gap-width"
                    label="Gioco posa larghezza"
                    value={input.installationGapWidthMm}
                    onChange={(value) => updateNumber("installationGapWidthMm", value)}
                  />
                  <NumberField
                    id="gap-height"
                    label="Gioco posa altezza"
                    value={input.installationGapHeightMm}
                    onChange={(value) => updateNumber("installationGapHeightMm", value)}
                  />
                  <NumberField
                    id="frame-profile"
                    label="Profilo telaio"
                    value={input.frameProfileMm}
                    onChange={(value) => updateNumber("frameProfileMm", value)}
                  />
                  <NumberField
                    id="threshold-clearance"
                    label="Franco pavimento"
                    value={input.thresholdClearanceMm}
                    onChange={(value) => updateNumber("thresholdClearanceMm", value)}
                  />
                </div>
              </section>

              <section className="space-y-3">
                <h2 className="text-sm font-semibold">Accessori</h2>
                <div className="grid gap-3 sm:grid-cols-3">
                  <CheckboxField
                    id="vision-panel"
                    label="Vetro/display"
                    checked={input.hasVisionPanel}
                    onChange={(checked) => setInput((current) => ({ ...current, hasVisionPanel: checked }))}
                  />
                  <CheckboxField
                    id="digital-viewer"
                    label="Display digitale"
                    checked={input.hasDigitalViewer}
                    onChange={(checked) => setInput((current) => ({ ...current, hasDigitalViewer: checked }))}
                  />
                  <CheckboxField
                    id="oval-window"
                    label="Ovale"
                    checked={input.hasOvalWindow}
                    onChange={(checked) => setInput((current) => ({ ...current, hasOvalWindow: checked }))}
                  />
                </div>
              </section>
            </CardContent>
          </Card>

          <section className="space-y-5">
            <Card className="overflow-hidden border-zinc-800/80 bg-zinc-950/80">
              <CardHeader>
                <CardTitle>Schema porta</CardTitle>
                <CardDescription>Disegno indicativo per leggere ante, maniglia e opera morta.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <DoorDiagram spec={spec} />
                <ResultStatus spec={spec} />
              </CardContent>
            </Card>

            <ProductionSummary spec={spec} />

            <Card className="border-zinc-800/80 bg-zinc-950/80">
              <CardHeader>
                <CardTitle>Export produzione</CardTitle>
                <CardDescription>Copia o scarica la scheda tecnica generata.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <textarea
                  readOnly
                  value={exportText}
                  className="min-h-64 w-full rounded-xl border border-zinc-800 bg-zinc-950 p-4 font-mono text-xs text-zinc-200"
                  aria-label="Scheda porta per produzione"
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <Button type="button" onClick={copyExport}>
                    <Clipboard className="h-4 w-4" aria-hidden />
                    Copia scheda
                  </Button>
                  <Button type="button" variant="secondary" onClick={downloadExport}>
                    <Download className="h-4 w-4" aria-hidden />
                    Scarica TXT
                  </Button>
                </div>
                {exportStatus !== "idle" && (
                  <p className="text-sm text-zinc-300" role="status">
                    {exportStatus === "copied" && "Scheda copiata negli appunti."}
                    {exportStatus === "downloaded" && "File TXT generato."}
                    {exportStatus === "error" && "Copia non riuscita: usa il testo nella scheda."}
                  </p>
                )}
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </main>
  );
}

function Hero() {
  return (
    <header className="rounded-3xl border border-amber-500/20 bg-zinc-950/70 p-5 shadow-2xl shadow-black/30 sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">
        Door production desk
      </p>
      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_360px] lg:items-end">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-5xl">
            Configuratore porte pronto per cantiere e produzione.
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-zinc-300 sm:text-base">
            Inserisci il vano muro, scegli modello e accessori, e ottieni telaio, ante, opera morta,
            maniglia, mano di apertura e scheda esportabile.
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4 text-sm text-zinc-300">
          <p className="font-medium text-zinc-100">Metodo usato</p>
          <p className="mt-2">
            Misure minime del vano, sottrazione dei giochi di posa, telaio e franco pavimento. La
            mano indica il lato cerniere visto dal lato di apertura.
          </p>
        </div>
      </div>
    </header>
  );
}

function NumberField({
  id,
  label,
  value,
  min = 0,
  max,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        inputMode="numeric"
        min={min}
        max={max}
        type="number"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

function SelectField({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 text-sm text-zinc-100 focus-visible:ring-2 focus-visible:ring-amber-500/50"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function CheckboxField({
  id,
  label,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label
      htmlFor={id}
      className="flex min-h-12 items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 px-3 text-sm text-zinc-200"
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 accent-amber-500"
      />
      {label}
    </label>
  );
}

function DoorDiagram({ spec }: { spec: DoorProductionSpec }) {
  const totalLeafWidth = spec.leaves.reduce((sum, leaf) => sum + leaf.widthMm, 0) || 1;
  const hingeX = spec.handing.doorHand === "left" ? 62 : 258;
  const handleX = spec.handing.handleSide === "left" ? 78 : 242;
  let currentX = 64;

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-3">
      <svg viewBox="0 0 320 260" role="img" aria-label="Schema tecnico della porta" className="h-auto w-full">
        <rect x="34" y="18" width="252" height="210" rx="12" fill="#09090b" stroke="#52525b" strokeWidth="3" />
        <rect x="52" y="36" width="216" height="174" fill="#18181b" stroke="#d97706" strokeWidth="2" />
        <text x="160" y="14" textAnchor="middle" fill="#fbbf24" fontSize="10">
          Telaio {spec.unit.widthMm} x {spec.unit.heightMm} mm
        </text>
        <text x="160" y="244" textAnchor="middle" fill="#a1a1aa" fontSize="10">
          Luce passaggio {spec.clearPassage.widthMm} x {spec.clearPassage.heightMm} mm
        </text>

        {spec.leaves.map((leaf) => {
          const width = Math.max(24, (leaf.widthMm / totalLeafWidth) * 192);
          const x = currentX;
          currentX += width;
          const fill = leaf.role === "fixed" ? "#3f3f46" : "#78350f";

          return (
            <g key={leaf.id}>
              <rect x={x} y="52" width={width} height="142" rx="6" fill={fill} stroke="#f59e0b" />
              <text x={x + width / 2} y="205" textAnchor="middle" fill="#e4e4e7" fontSize="9">
                {leaf.widthMm} mm
              </text>
              <text x={x + width / 2} y="70" textAnchor="middle" fill="#fef3c7" fontSize="8">
                {leaf.role === "fixed" ? "FISSA" : "ANTA"}
              </text>
            </g>
          );
        })}

        <circle cx={handleX} cy="123" r="5" fill="#facc15" />
        <text x={handleX} y="114" textAnchor="middle" fill="#fef08a" fontSize="8">
          maniglia
        </text>
        {[72, 122, 172].map((y) => (
          <rect key={y} x={hingeX - 4} y={y} width="8" height="20" rx="2" fill="#e4e4e7" />
        ))}

        {spec.accessories.includes("Vetro/display visivo") && (
          <rect x="130" y="86" width="60" height="52" rx="8" fill="#0f766e" opacity="0.75" stroke="#99f6e4" />
        )}
        {spec.accessories.includes("Oblo ovale") && (
          <ellipse cx="160" cy="116" rx="26" ry="38" fill="#0e7490" opacity="0.8" stroke="#a5f3fc" />
        )}
        {spec.accessories.includes("Display digitale") && (
          <rect x="222" y="94" width="16" height="34" rx="4" fill="#020617" stroke="#60a5fa" />
        )}
      </svg>
    </div>
  );
}

function ResultStatus({ spec }: { spec: DoorProductionSpec }) {
  if (spec.productionWarnings.length > 0) {
    return (
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-amber-200">
          <AlertTriangle className="h-4 w-4" aria-hidden />
          Da verificare prima della produzione
        </div>
        <ul className="mt-3 space-y-2 text-sm text-amber-100/90">
          {spec.productionWarnings.map((warning) => (
            <li key={warning}>• {warning}</li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-100">
      <CheckCircle2 className="h-4 w-4" aria-hidden />
      Misure coerenti: scheda pronta per una verifica finale del produttore.
    </div>
  );
}

function ProductionSummary({ spec }: { spec: DoorProductionSpec }) {
  return (
    <Card className="border-zinc-800/80 bg-zinc-950/80">
      <CardHeader>
        <CardTitle>Risultato calcolato</CardTitle>
        <CardDescription>{spec.handing.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <Metric label="Telaio finito" value={`${spec.unit.widthMm} x ${spec.unit.heightMm}`} />
          <Metric label="Luce passaggio" value={`${spec.clearPassage.widthMm} x ${spec.clearPassage.heightMm}`} />
          <Metric label="Mano porta" value={spec.handing.label} />
        </div>
        <div className="space-y-2 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
          <p className="text-sm font-semibold">Ante</p>
          {spec.leaves.map((leaf) => (
            <div key={leaf.id} className="flex items-center justify-between gap-4 text-sm">
              <span className="text-zinc-300">{leaf.label}</span>
              <span className="font-mono text-amber-300">
                {leaf.widthMm} x {leaf.heightMm} mm
              </span>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {(spec.accessories.length > 0 ? spec.accessories : ["Nessun accessorio"]).map((accessory) => (
            <span key={accessory} className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-300">
              {accessory}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
      <p className="text-xs uppercase tracking-wide text-zinc-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-zinc-100">{value}</p>
    </div>
  );
}
