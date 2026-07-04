"use client";

import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  buildDoorProductionExport,
  calculateDoorConfiguration,
  DOOR_MODEL_PRESETS,
  type DoorConfigurationResult,
  type DoorModel,
  type DoorSide,
} from "@/lib/doors/configurator";

interface FormState {
  model: DoorModel;
  roughOpeningWidthMm: number;
  roughOpeningHeightMm: number;
  wallThicknessMm: number;
  deadWorkMm: number;
  openingDirection: DoorSide;
  handleSide: DoorSide;
  hasGlass: boolean;
  hasOval: boolean;
  hasDisplay: boolean;
  includeFixedPanel: boolean;
  fixedPanelWidthMm: number;
}

const INITIAL_STATE: FormState = {
  model: "battente_compasso",
  roughOpeningWidthMm: 900,
  roughOpeningHeightMm: 2160,
  wallThicknessMm: 100,
  deadWorkMm: 5,
  openingDirection: "destra",
  handleSide: "destra",
  hasGlass: false,
  hasOval: false,
  hasDisplay: false,
  includeFixedPanel: false,
  fixedPanelWidthMm: 300,
};

type UiStatus = "idle" | "loading" | "error" | "success";

export function DoorConfigurator() {
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [status, setStatus] = useState<UiStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DoorConfigurationResult | null>(null);
  const currentPreset = useMemo(() => DOOR_MODEL_PRESETS[form.model], [form.model]);

  function setNumberField<K extends keyof FormState>(key: K, value: string) {
    const nextValue = Number(value);
    if (Number.isNaN(nextValue)) return;
    setForm((prev) => ({ ...prev, [key]: nextValue }));
  }

  function setBooleanField<K extends keyof FormState>(key: K, checked: boolean) {
    setForm((prev) => ({ ...prev, [key]: checked }));
  }

  async function handleGenerate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 120));
      const nextResult = calculateDoorConfiguration(form);
      setResult(nextResult);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setResult(null);
      setError(err instanceof Error ? err.message : "Errore imprevisto durante il calcolo.");
    }
  }

  function handleExport() {
    if (!result) return;
    const payload = buildDoorProductionExport(result);
    const blob = new Blob([payload], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `schema-porta-${result.model}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configuratore porta mobile-first</CardTitle>
          <CardDescription>
            Inserisci foro muro, scegli modello e accessori: generiamo uno schema produzione pronto export.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleGenerate} className="space-y-5" aria-label="Configuratore porte">
            <div className="space-y-2">
              <Label htmlFor="model">Modello porta</Label>
              <select
                id="model"
                value={form.model}
                onChange={(event) => {
                  const model = event.target.value as DoorModel;
                  const preset = DOOR_MODEL_PRESETS[model];
                  setForm((prev) => ({
                    ...prev,
                    model,
                    includeFixedPanel: model === "battente_con_fisso" ? true : prev.includeFixedPanel,
                    fixedPanelWidthMm: preset.defaultFixedPanelWidthMm ?? prev.fixedPanelWidthMm,
                  }));
                }}
                className="flex h-10 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
              >
                {Object.entries(DOOR_MODEL_PRESETS).map(([value, preset]) => (
                  <option key={value} value={value}>
                    {preset.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-zinc-500">{currentPreset.notes}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Foro muro larghezza (mm)" htmlFor="width">
                <Input
                  id="width"
                  inputMode="numeric"
                  type="number"
                  min={500}
                  value={form.roughOpeningWidthMm}
                  onChange={(event) => setNumberField("roughOpeningWidthMm", event.target.value)}
                  required
                />
              </Field>
              <Field label="Foro muro altezza (mm)" htmlFor="height">
                <Input
                  id="height"
                  inputMode="numeric"
                  type="number"
                  min={1500}
                  value={form.roughOpeningHeightMm}
                  onChange={(event) => setNumberField("roughOpeningHeightMm", event.target.value)}
                  required
                />
              </Field>
              <Field label="Spessore muro (mm)" htmlFor="wall">
                <Input
                  id="wall"
                  inputMode="numeric"
                  type="number"
                  min={60}
                  value={form.wallThicknessMm}
                  onChange={(event) => setNumberField("wallThicknessMm", event.target.value)}
                  required
                />
              </Field>
              <Field label="Dead work / gioco posa (mm)" htmlFor="dead-work">
                <Input
                  id="dead-work"
                  inputMode="numeric"
                  type="number"
                  min={0}
                  value={form.deadWorkMm}
                  onChange={(event) => setNumberField("deadWorkMm", event.target.value)}
                  required
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <SideSelect
                id="opening"
                label="Verso apertura"
                value={form.openingDirection}
                onChange={(value) => setForm((prev) => ({ ...prev, openingDirection: value }))}
              />
              <SideSelect
                id="handle"
                label="Lato maniglia"
                value={form.handleSide}
                onChange={(value) => setForm((prev) => ({ ...prev, handleSide: value }))}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <CheckboxRow
                id="glass"
                label="Porta con vetrata/display"
                checked={form.hasGlass}
                onChange={(checked) => setBooleanField("hasGlass", checked)}
              />
              <CheckboxRow
                id="display"
                label="Display integrato"
                checked={form.hasDisplay}
                onChange={(checked) => setBooleanField("hasDisplay", checked)}
              />
              <CheckboxRow
                id="oval"
                label="Inserto ovale / oblo"
                checked={form.hasOval}
                onChange={(checked) => setBooleanField("hasOval", checked)}
              />
              <CheckboxRow
                id="fixed"
                label="Pannello fisso laterale"
                checked={form.includeFixedPanel || form.model === "battente_con_fisso"}
                onChange={(checked) => setBooleanField("includeFixedPanel", checked)}
                disabled={form.model === "battente_con_fisso"}
              />
            </div>

            {(form.includeFixedPanel || form.model === "battente_con_fisso") && (
              <Field label="Larghezza fisso laterale (mm)" htmlFor="fixed-width">
                <Input
                  id="fixed-width"
                  inputMode="numeric"
                  type="number"
                  min={150}
                  value={form.fixedPanelWidthMm}
                  onChange={(event) => setNumberField("fixedPanelWidthMm", event.target.value)}
                  required
                />
              </Field>
            )}

            <div className="flex flex-col sm:flex-row gap-2">
              <Button type="submit" disabled={status === "loading"}>
                {status === "loading" ? "Calcolo in corso..." : "Genera schema porta"}
              </Button>
              {result && (
                <Button type="button" variant="secondary" onClick={handleExport}>
                  Esporta schema (.txt)
                </Button>
              )}
            </div>

            {status === "error" && error && (
              <p className="text-sm text-red-400" role="alert">
                {error}
              </p>
            )}

            {status === "success" && result && (
              <p className="text-sm text-emerald-400" role="status">
                Schema generato con successo. Verifica i dettagli tecnici prima di inviare in produzione.
              </p>
            )}
          </form>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Schema tecnico pronto produzione</CardTitle>
            <CardDescription>{result.handing.summary}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <MeasureRow label="Telaio (L x H)" value={`${result.production.frameWidthMm} x ${result.production.frameHeightMm} mm`} />
              <MeasureRow label="Anta totale (L x H)" value={`${result.production.leafWidthMm} x ${result.production.leafHeightMm} mm`} />
              <MeasureRow label="Anta attiva (L x H)" value={`${result.production.activeLeafWidthMm} x ${result.production.leafHeightMm} mm`} />
              <MeasureRow
                label="Pannello fisso"
                value={result.production.fixedPanelWidthMm ? `${result.production.fixedPanelWidthMm} mm` : "assente"}
              />
            </div>
            <div className="rounded-lg border border-zinc-700 p-3 space-y-1">
              <p>Modello: {result.modelLabel}</p>
              <p>
                Foro muro: {result.roughOpening.widthMm} x {result.roughOpening.heightMm} mm · Spessore muro{" "}
                {result.roughOpening.wallThicknessMm} mm
              </p>
              <p>
                Optional: vetrata {result.features.hasGlass ? "si" : "no"}, display{" "}
                {result.features.hasDisplay ? "si" : "no"}, oblo {result.features.hasOval ? "si" : "no"}
              </p>
            </div>
            {result.warnings.length > 0 && (
              <div className="rounded-lg border border-amber-700/40 bg-amber-900/20 p-3">
                <p className="text-amber-300 font-medium mb-1">Controlli da verificare</p>
                <ul className="list-disc pl-5 space-y-1 text-zinc-200">
                  {result.warnings.map((warning) => (
                    <li key={warning}>{warning}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}

function SideSelect({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: DoorSide;
  onChange: (value: DoorSide) => void;
}) {
  return (
    <Field label={label} htmlFor={id}>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value as DoorSide)}
        className="flex h-10 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
      >
        <option value="destra">Destra</option>
        <option value="sinistra">Sinistra</option>
      </select>
    </Field>
  );
}

function CheckboxRow({
  id,
  label,
  checked,
  onChange,
  disabled,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <label
      htmlFor={id}
      className="flex items-center gap-2 rounded-md border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm cursor-pointer"
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        disabled={disabled}
        className="h-4 w-4 accent-amber-500"
      />
      <span className="text-zinc-200">{label}</span>
    </label>
  );
}

function MeasureRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950/50 px-3 py-2">
      <p className="text-xs text-zinc-500 uppercase tracking-wide">{label}</p>
      <p className="text-sm font-medium mt-1">{value}</p>
    </div>
  );
}
