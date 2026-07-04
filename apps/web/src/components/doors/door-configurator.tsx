"use client";

import { useMemo, useState } from "react";
import { Download, DoorClosed, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  buildDoorScheme,
  computeDoorConfiguration,
  type DoorConfiguratorInput,
  type DoorModel,
} from "@/lib/door-configurator";

const TECH_NOTES = [
  "Verso porta: classificazione su lato sicuro/key side (LH/RH e reverse), semplificata in destra/sinistra + spinge/tira.",
  "Rilievo vano: usare la misura minima reale su più punti del foro muro (larghezza/altezza).",
  "Glazing: display/vetrata e oblò ovale sono opzioni schema, non modificano automaticamente il calcolo strutturale.",
];

const DEFAULT_INPUT: DoorConfiguratorInput = {
  model: "compasso",
  wallOpeningWidthMm: 1000,
  wallOpeningHeightMm: 2150,
  deadWorkSideMm: 10,
  deadWorkTopMm: 10,
  deadWorkBottomMm: 10,
  hasDisplayPanel: false,
  hasOvalWindow: false,
  openingDirection: "destra",
  swingType: "spinge",
  handleSide: "destra",
};

export function DoorConfigurator() {
  const [form, setForm] = useState<DoorConfiguratorInput>(DEFAULT_INPUT);
  const [referenceCode, setReferenceCode] = useState("P-0001");

  const result = useMemo(() => computeDoorConfiguration(form), [form]);
  const scheme = useMemo(() => buildDoorScheme(form, result), [form, result]);

  function updateField<K extends keyof DoorConfiguratorInput>(key: K, value: DoorConfiguratorInput[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleNumericChange<K extends keyof DoorConfiguratorInput>(key: K, value: string) {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return;
    updateField(key, Math.max(parsed, 0) as DoorConfiguratorInput[K]);
  }

  function handleExport() {
    const payload = {
      referenceCode,
      generatedAt: new Date().toISOString(),
      input: form,
      result,
      scheme,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `schema-porta-${referenceCode.toLowerCase()}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  const hasHandleWarning =
    form.model !== "scorrevole" && form.openingDirection === form.handleSide;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DoorClosed className="h-5 w-5 text-amber-400" aria-hidden />
            Configuratore porte su misura
          </CardTitle>
          <CardDescription>
            Inserisci vano muro e opzioni modello per generare una scheda pronta per produzione.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <Label htmlFor="referenceCode">Codice commessa</Label>
              <Input
                id="referenceCode"
                value={referenceCode}
                onChange={(event) => setReferenceCode(event.target.value.toUpperCase())}
              />
            </Field>
            <Field>
              <Label htmlFor="model">Modello porta</Label>
              <select
                id="model"
                className="h-10 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 text-sm"
                value={form.model}
                onChange={(event) => updateField("model", event.target.value as DoorModel)}
              >
                <option value="compasso">Porta a compasso</option>
                <option value="compasso_fisso">Porta a compasso + fisso</option>
                <option value="scorrevole">Porta scorrevole</option>
                <option value="pivot">Porta pivot</option>
              </select>
            </Field>
            <Field>
              <Label htmlFor="openingWidth">Larghezza vano muro (mm)</Label>
              <Input
                id="openingWidth"
                type="number"
                min={0}
                value={form.wallOpeningWidthMm}
                onChange={(event) => handleNumericChange("wallOpeningWidthMm", event.target.value)}
              />
            </Field>
            <Field>
              <Label htmlFor="openingHeight">Altezza vano muro (mm)</Label>
              <Input
                id="openingHeight"
                type="number"
                min={0}
                value={form.wallOpeningHeightMm}
                onChange={(event) => handleNumericChange("wallOpeningHeightMm", event.target.value)}
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Field>
              <Label htmlFor="deadWorkSide">Opera morta laterale (mm)</Label>
              <Input
                id="deadWorkSide"
                type="number"
                min={0}
                value={form.deadWorkSideMm}
                onChange={(event) => handleNumericChange("deadWorkSideMm", event.target.value)}
              />
            </Field>
            <Field>
              <Label htmlFor="deadWorkTop">Opera morta superiore (mm)</Label>
              <Input
                id="deadWorkTop"
                type="number"
                min={0}
                value={form.deadWorkTopMm}
                onChange={(event) => handleNumericChange("deadWorkTopMm", event.target.value)}
              />
            </Field>
            <Field>
              <Label htmlFor="deadWorkBottom">Opera morta inferiore (mm)</Label>
              <Input
                id="deadWorkBottom"
                type="number"
                min={0}
                value={form.deadWorkBottomMm}
                onChange={(event) => handleNumericChange("deadWorkBottomMm", event.target.value)}
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Field>
              <Label htmlFor="openingDirection">Direzione apertura</Label>
              <select
                id="openingDirection"
                className="h-10 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 text-sm"
                value={form.openingDirection}
                onChange={(event) =>
                  updateField("openingDirection", event.target.value as DoorConfiguratorInput["openingDirection"])
                }
              >
                <option value="destra">Destra</option>
                <option value="sinistra">Sinistra</option>
              </select>
            </Field>
            <Field>
              <Label htmlFor="swingType">Movimento anta</Label>
              <select
                id="swingType"
                className="h-10 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 text-sm"
                value={form.swingType}
                onChange={(event) =>
                  updateField("swingType", event.target.value as DoorConfiguratorInput["swingType"])
                }
              >
                <option value="spinge">Spinge</option>
                <option value="tira">Tira</option>
              </select>
            </Field>
            <Field>
              <Label htmlFor="handleSide">Lato maniglia</Label>
              <select
                id="handleSide"
                className="h-10 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 text-sm"
                value={form.handleSide}
                onChange={(event) =>
                  updateField("handleSide", event.target.value as DoorConfiguratorInput["handleSide"])
                }
              >
                <option value="destra">Destra</option>
                <option value="sinistra">Sinistra</option>
              </select>
            </Field>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <BooleanSwitch
              id="displayPanel"
              label="Display / pannello vetrato"
              checked={form.hasDisplayPanel}
              onChange={(checked) => updateField("hasDisplayPanel", checked)}
            />
            <BooleanSwitch
              id="ovalWindow"
              label="Oblò ovale"
              checked={form.hasOvalWindow}
              onChange={(checked) => updateField("hasOvalWindow", checked)}
            />
          </div>

          {hasHandleWarning && (
            <p className="text-xs text-amber-300 bg-amber-900/20 border border-amber-700/30 rounded-md px-3 py-2">
              Nota: maniglia e direzione coincidono. Verifica che il lato cerniera sia impostato come desiderato.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Scheda produzione</CardTitle>
          <CardDescription>Quote calcolate in millimetri, già compensate per opera morta.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <ResultLine label="Luce telaio netta" value={`${result.netFrameWidthMm} x ${result.netFrameHeightMm} mm`} />
            <ResultLine label="Dimensione anta" value={`${result.leafWidthMm} x ${result.leafHeightMm} mm`} />
            <ResultLine label="Verso apertura" value={result.openingSummary} />
            <ResultLine label="Maniglia" value={result.handleSummary} />
            <ResultLine label="Display / vetrata" value={form.hasDisplayPanel ? "SI" : "NO"} />
            <ResultLine label="Oblò ovale" value={form.hasOvalWindow ? "SI" : "NO"} />
          </div>
          {result.fixedPanelWidthMm ? (
            <ResultLine label="Pannello fisso" value={`${result.fixedPanelWidthMm} mm`} />
          ) : null}
          {result.notes.length > 0 ? (
            <ul className="space-y-1 text-xs text-zinc-400">
              {result.notes.map((note) => (
                <li key={note}>• {note}</li>
              ))}
            </ul>
          ) : null}
          <Label htmlFor="doorScheme">Schema porta esportabile</Label>
          <textarea
            id="doorScheme"
            readOnly
            value={scheme}
            className="min-h-44 w-full rounded-md border border-zinc-700 bg-zinc-950 p-3 text-xs text-zinc-200"
          />
          <Button type="button" className="w-full sm:w-auto" onClick={handleExport}>
            <Download className="h-4 w-4" aria-hidden />
            Esporta schema (JSON)
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Info className="h-4 w-4 text-amber-400" aria-hidden />
            Note tecniche usate per il configuratore
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-zinc-300">
            {TECH_NOTES.map((note) => (
              <li key={note}>• {note}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

function Field({ children }: { children: React.ReactNode }) {
  return <div className="space-y-2">{children}</div>;
}

function ResultLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-zinc-800 bg-zinc-900/40 px-3 py-2">
      <p className="text-[11px] uppercase tracking-wide text-zinc-500">{label}</p>
      <p className="text-sm font-medium text-zinc-100">{value}</p>
    </div>
  );
}

function BooleanSwitch({
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
      className="flex items-center justify-between rounded-md border border-zinc-800 bg-zinc-900/40 px-3 py-2.5 text-sm"
    >
      <span>{label}</span>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 rounded border-zinc-600 bg-zinc-950 text-amber-600 focus:ring-amber-500/50"
      />
    </label>
  );
}
