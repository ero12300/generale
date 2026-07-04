"use client";

import { useMemo, useState } from "react";
import type {
  DoorConfiguration,
  DoorModel,
  DoorModelSpec,
  DoorOpeningDirection,
  DoorSide,
} from "@deal-desk/types";
import { DOOR_MODELS } from "@deal-desk/types";
import { Download, Copy, CheckCircle2, AlertTriangle, DoorOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DoorConfiguratorFormState {
  jobName: string;
  clearWidthMm: number;
  clearHeightMm: number;
  wallThicknessMm: number;
  deadWorkClearanceMm: number;
  model: DoorModel;
  openingDirection: DoorOpeningDirection;
  hingeSide: DoorSide;
  hasFixedLeaf: boolean;
  hasDisplayGlass: boolean;
  hasOvalVisionPanel: boolean;
  notes: string;
}

interface DoorProductionScheme {
  summary: string;
  configuration: DoorConfiguration;
  calculated: {
    leafWidthMm: number;
    leafHeightMm: number;
    roughOpeningWidthMm: number;
    roughOpeningHeightMm: number;
    handleSide: DoorSide;
    openingText: string;
    warnings: string[];
    modelFormula: string;
  };
}

const INITIAL_STATE: DoorConfiguratorFormState = {
  jobName: "Porta Ingresso Zona Giorno",
  clearWidthMm: 900,
  clearHeightMm: 2100,
  wallThicknessMm: 120,
  deadWorkClearanceMm: 5,
  model: "swing",
  openingDirection: "push",
  hingeSide: "left",
  hasFixedLeaf: false,
  hasDisplayGlass: false,
  hasOvalVisionPanel: false,
  notes: "",
};

function getModelSpec(model: DoorModel): DoorModelSpec {
  return DOOR_MODELS.find((item) => item.model === model) ?? DOOR_MODELS[0];
}

function oppositeSide(side: DoorSide): DoorSide {
  return side === "left" ? "right" : "left";
}

function buildOpeningHand(hingeSide: DoorSide, openingDirection: DoorOpeningDirection) {
  if (hingeSide === "left") return openingDirection === "push" ? "left" : "left_reverse";
  return openingDirection === "push" ? "right" : "right_reverse";
}

function sideLabel(side: DoorSide): string {
  return side === "left" ? "sinistra" : "destra";
}

function openingDirectionLabel(direction: DoorOpeningDirection): string {
  return direction === "push" ? "a spingere" : "a tirare";
}

function doorHandLabel(hand: DoorConfiguration["opening_hand"]): string {
  switch (hand) {
    case "left":
      return "Mano sinistra";
    case "right":
      return "Mano destra";
    case "left_reverse":
      return "Mano sinistra rovescia";
    case "right_reverse":
      return "Mano destra rovescia";
    default: {
      const exhaustiveCheck: never = hand;
      return exhaustiveCheck;
    }
  }
}

function computeDoorScheme(state: DoorConfiguratorFormState): DoorProductionScheme {
  const modelSpec = getModelSpec(state.model);
  const clearance = Math.max(state.deadWorkClearanceMm, 0);
  const handleSide = oppositeSide(state.hingeSide);
  const openingHand = buildOpeningHand(state.hingeSide, state.openingDirection);

  const baseLeafWidth = Math.max(
    state.clearWidthMm - modelSpec.frameDeductionWidthMm + modelSpec.leafOverlapWidthMm,
    0
  );
  const baseLeafHeight = Math.max(
    state.clearHeightMm - modelSpec.frameDeductionHeightMm + modelSpec.leafOverlapHeightMm,
    0
  );

  const leafWidthMm = Math.max(baseLeafWidth - clearance * 2, 0);
  const leafHeightMm = Math.max(baseLeafHeight - clearance * 2, 0);

  const roughOpeningWidthMm =
    state.model === "pocket_sliding"
      ? Math.round(state.clearWidthMm * 2 + 110)
      : state.clearWidthMm;
  const roughOpeningHeightMm =
    state.model === "pocket_sliding" ? state.clearHeightMm + 90 : state.clearHeightMm;

  const warnings: string[] = [];
  if (leafWidthMm < 600) {
    warnings.push("Larghezza anta molto ridotta (< 600 mm): verificare accessibilità minima.");
  }
  if (state.model === "pocket_sliding" && state.wallThicknessMm < 100) {
    warnings.push("Per scorrevole a scomparsa è consigliata una parete >= 100 mm.");
  }
  if (state.hasFixedLeaf && state.model === "pocket_sliding") {
    warnings.push("Anta fissa + scomparsa richiede verifica con scheda tecnica del produttore.");
  }

  const openingText = `${doorHandLabel(openingHand)} (${openingDirectionLabel(
    state.openingDirection
  )}), cerniere ${sideLabel(state.hingeSide)}, maniglia ${sideLabel(handleSide)}`;

  return {
    summary: `${state.jobName} · ${modelSpec.label} · ${leafWidthMm}x${leafHeightMm} mm`,
    configuration: {
      id: crypto.randomUUID(),
      organization_id: "demo",
      name: state.jobName,
      model: state.model,
      opening_direction: state.openingDirection,
      hinge_side: state.hingeSide,
      handle_side: handleSide,
      opening_hand: openingHand,
      clear_width_mm: state.clearWidthMm,
      clear_height_mm: state.clearHeightMm,
      wall_thickness_mm: state.wallThicknessMm,
      dead_work_clearance_mm: clearance,
      has_fixed_leaf: state.hasFixedLeaf,
      has_display_glass: state.hasDisplayGlass,
      has_oval_vision_panel: state.hasOvalVisionPanel,
      notes: state.notes || null,
      created_at: new Date().toISOString(),
    },
    calculated: {
      leafWidthMm,
      leafHeightMm,
      roughOpeningWidthMm,
      roughOpeningHeightMm,
      handleSide,
      openingText,
      warnings,
      modelFormula: modelSpec.roughOpeningFormula,
    },
  };
}

function downloadTextFile(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function DoorConfigurator() {
  const [form, setForm] = useState<DoorConfiguratorFormState>(INITIAL_STATE);
  const [copyState, setCopyState] = useState<"idle" | "copied">("idle");

  const scheme = useMemo(() => computeDoorScheme(form), [form]);
  const model = getModelSpec(form.model);

  const csvExport = useMemo(() => {
    const rows = [
      ["Campo", "Valore"],
      ["Commessa", form.jobName],
      ["Modello", model.label],
      ["Luce vano L (mm)", String(form.clearWidthMm)],
      ["Luce vano H (mm)", String(form.clearHeightMm)],
      ["Spessore muro (mm)", String(form.wallThicknessMm)],
      ["Gioco lavoro morto per lato (mm)", String(form.deadWorkClearanceMm)],
      ["Anta produzione L (mm)", String(scheme.calculated.leafWidthMm)],
      ["Anta produzione H (mm)", String(scheme.calculated.leafHeightMm)],
      ["Ingombro vano richiesto L (mm)", String(scheme.calculated.roughOpeningWidthMm)],
      ["Ingombro vano richiesto H (mm)", String(scheme.calculated.roughOpeningHeightMm)],
      ["Apertura", scheme.calculated.openingText],
      ["Anta fissa", form.hasFixedLeaf ? "Si" : "No"],
      ["Display/vetro", form.hasDisplayGlass ? "Si" : "No"],
      ["Oblo ovale", form.hasOvalVisionPanel ? "Si" : "No"],
      ["Note", form.notes || "-"],
    ];
    return rows.map((line) => line.map((cell) => `"${cell.replaceAll("\"", "\"\"")}"`).join(",")).join("\n");
  }, [form, model.label, scheme]);

  async function copySummary() {
    const text = [
      `Schema porta: ${scheme.summary}`,
      `Apertura: ${scheme.calculated.openingText}`,
      `Anta produzione: ${scheme.calculated.leafWidthMm} x ${scheme.calculated.leafHeightMm} mm`,
      `Vano richiesto: ${scheme.calculated.roughOpeningWidthMm} x ${scheme.calculated.roughOpeningHeightMm} mm`,
      `Optional: fissa=${form.hasFixedLeaf ? "si" : "no"}, display=${form.hasDisplayGlass ? "si" : "no"}, ovale=${form.hasOvalVisionPanel ? "si" : "no"}`,
    ].join("\n");
    await navigator.clipboard.writeText(text);
    setCopyState("copied");
    setTimeout(() => setCopyState("idle"), 2000);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="space-y-2">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <DoorOpen className="h-5 w-5 text-amber-400" aria-hidden />
            Configuratore porte pronto produzione
          </CardTitle>
          <CardDescription>
            Inserisci luce vano e modello: il sistema calcola automaticamente anta ridotta con lavoro
            morto, verso apertura, lato cerniere e lato maniglia.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Label htmlFor="jobName">Nome commessa</Label>
              <Input
                id="jobName"
                value={form.jobName}
                onChange={(event) => setForm((prev) => ({ ...prev, jobName: event.target.value }))}
              />
            </div>
            <NumericField
              id="clearWidthMm"
              label="Luce vano larghezza (mm)"
              value={form.clearWidthMm}
              min={400}
              onChange={(value) => setForm((prev) => ({ ...prev, clearWidthMm: value }))}
            />
            <NumericField
              id="clearHeightMm"
              label="Luce vano altezza (mm)"
              value={form.clearHeightMm}
              min={800}
              onChange={(value) => setForm((prev) => ({ ...prev, clearHeightMm: value }))}
            />
            <NumericField
              id="wallThicknessMm"
              label="Spessore muro (mm)"
              value={form.wallThicknessMm}
              min={70}
              onChange={(value) => setForm((prev) => ({ ...prev, wallThicknessMm: value }))}
            />
            <NumericField
              id="deadWorkClearanceMm"
              label="Lavoro morto per lato (mm)"
              value={form.deadWorkClearanceMm}
              min={0}
              onChange={(value) => setForm((prev) => ({ ...prev, deadWorkClearanceMm: value }))}
            />
            <SelectField
              id="model"
              label="Modello porta"
              value={form.model}
              onChange={(value) => setForm((prev) => ({ ...prev, model: value as DoorModel }))}
              options={DOOR_MODELS.map((item) => ({ value: item.model, label: item.label }))}
            />
            <SelectField
              id="openingDirection"
              label="Tipo apertura"
              value={form.openingDirection}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, openingDirection: value as DoorOpeningDirection }))
              }
              options={[
                { value: "push", label: "A spingere" },
                { value: "pull", label: "A tirare" },
              ]}
            />
            <SelectField
              id="hingeSide"
              label="Lato cerniere"
              value={form.hingeSide}
              onChange={(value) => setForm((prev) => ({ ...prev, hingeSide: value as DoorSide }))}
              options={[
                { value: "left", label: "Sinistra" },
                { value: "right", label: "Destra" },
              ]}
            />
          </div>

          <fieldset className="rounded-lg border border-zinc-800 p-4 space-y-3">
            <legend className="px-2 text-sm text-zinc-300">Optional modello</legend>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <CheckboxField
                id="hasFixedLeaf"
                label="Anta fissa"
                checked={form.hasFixedLeaf}
                onChange={(checked) => setForm((prev) => ({ ...prev, hasFixedLeaf: checked }))}
              />
              <CheckboxField
                id="hasDisplayGlass"
                label="Display/vetro"
                checked={form.hasDisplayGlass}
                onChange={(checked) => setForm((prev) => ({ ...prev, hasDisplayGlass: checked }))}
              />
              <CheckboxField
                id="hasOvalVisionPanel"
                label="Oblò ovale"
                checked={form.hasOvalVisionPanel}
                onChange={(checked) => setForm((prev) => ({ ...prev, hasOvalVisionPanel: checked }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Note tecniche</Label>
              <textarea
                id="notes"
                value={form.notes}
                onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
                className="min-h-20 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
                placeholder="Es. cantiere con rivestimento 12 mm già posato."
              />
            </div>
          </fieldset>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-base sm:text-lg">Schema produzione</CardTitle>
          <CardDescription>{scheme.summary}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
            <InfoTile label="Modello" value={model.label} />
            <InfoTile label="Apertura" value={scheme.calculated.openingText} />
            <InfoTile
              label="Anta produzione"
              value={`${scheme.calculated.leafWidthMm} × ${scheme.calculated.leafHeightMm} mm`}
            />
            <InfoTile
              label="Vano richiesto"
              value={`${scheme.calculated.roughOpeningWidthMm} × ${scheme.calculated.roughOpeningHeightMm} mm`}
            />
            <InfoTile
              label="Formula modello"
              value={scheme.calculated.modelFormula}
            />
            <InfoTile
              label="Optional"
              value={`Fissa: ${form.hasFixedLeaf ? "Sì" : "No"} · Display: ${form.hasDisplayGlass ? "Sì" : "No"} · Ovale: ${form.hasOvalVisionPanel ? "Sì" : "No"}`}
            />
          </div>

          {scheme.calculated.warnings.length > 0 ? (
            <div
              role="alert"
              className="rounded-md border border-amber-900/50 bg-amber-950/40 p-3 text-sm text-amber-200 space-y-1"
            >
              <p className="font-medium flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" aria-hidden />
                Verifiche richieste
              </p>
              <ul className="list-disc list-inside">
                {scheme.calculated.warnings.map((warning) => (
                  <li key={warning}>{warning}</li>
                ))}
              </ul>
            </div>
          ) : (
            <div
              role="status"
              className="rounded-md border border-emerald-900/40 bg-emerald-950/30 p-3 text-sm text-emerald-200 flex items-center gap-2"
            >
              <CheckCircle2 className="h-4 w-4" aria-hidden />
              Schema coerente con i parametri inseriti.
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              type="button"
              onClick={() =>
                downloadTextFile(
                  "schema_porta.json",
                  JSON.stringify(scheme, null, 2),
                  "application/json"
                )
              }
            >
              <Download className="h-4 w-4" aria-hidden />
              Esporta JSON
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => downloadTextFile("schema_porta.csv", csvExport, "text/csv;charset=utf-8;")}
            >
              <Download className="h-4 w-4" aria-hidden />
              Esporta CSV
            </Button>
            <Button type="button" variant="outline" onClick={copySummary}>
              <Copy className="h-4 w-4" aria-hidden />
              {copyState === "copied" ? "Copiato" : "Copia riepilogo"}
            </Button>
          </div>

          <p className="text-xs text-zinc-500">
            Regola pratica usata: per battente sono applicate deduzioni telaio, per scorrevole a
            scomparsa è stimato ingombro controtelaio. Conferma sempre con scheda tecnica del
            produttore prima di mandare in produzione.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function NumericField({
  id,
  label,
  value,
  min,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="number"
        min={min}
        step={1}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
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
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="flex h-10 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
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
      className="flex items-center gap-2 rounded-md border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-sm text-zinc-200"
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

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-3">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="text-sm text-zinc-100 mt-1">{value}</p>
    </div>
  );
}
