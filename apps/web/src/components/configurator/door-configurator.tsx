"use client";

import { useMemo, useState } from "react";
import { Check, Clipboard, Download, DoorOpen, Ruler, TriangleAlert } from "lucide-react";
import {
  DOOR_MODELS,
  type DoorConfigurationInput,
  type DoorModel,
  type DoorOpeningDirection,
} from "@deal-desk/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { calculateDoorConfiguration } from "@/lib/doors/configurator";
import { cn } from "@/lib/utils";
import { doorConfigurationSchema } from "@/lib/validations/api";

const modelNotes: Record<DoorModel, string> = {
  hinged_single: "Riduce il foro per telaio e crea una anta battente singola.",
  hinged_with_fixed_panel: "Blocca l'anta attiva a 900 mm e manda il residuo in opera morta.",
  sliding_pocket: "Usa quote da controtelaio a scomparsa con anta leggermente maggiorata.",
  sliding_external: "Crea anta esterna con sormonto laterale sul foro muro.",
  folding_compass: "Divide il sistema in due pacchetti anta per apertura a libro/compasso.",
};

const initialInput: DoorConfigurationInput = {
  roomName: "Porta bagno",
  model: "hinged_single",
  openingDirection: "right",
  wallOpening: {
    widthTopMm: 900,
    widthMiddleMm: 900,
    widthBottomMm: 898,
    heightLeftMm: 2150,
    heightRightMm: 2150,
    wallDepthMm: 110,
    finishedFloor: true,
  },
  accessories: {
    hasDisplay: false,
    hasOvalWindow: false,
    hasFixedPanel: false,
  },
};

export function DoorConfigurator() {
  const [input, setInput] = useState<DoorConfigurationInput>(initialInput);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const result = useMemo(() => {
    const parsed = doorConfigurationSchema.safeParse(input);
    if (!parsed.success) return null;
    return calculateDoorConfiguration(parsed.data);
  }, [input]);

  function updateMeasure(key: keyof DoorConfigurationInput["wallOpening"], value: number | boolean) {
    setInput((current) => ({
      ...current,
      wallOpening: {
        ...current.wallOpening,
        [key]: value,
      },
    }));
    setError(null);
    setSuccess(null);
  }

  function updateAccessory(key: keyof DoorConfigurationInput["accessories"], value: boolean) {
    setInput((current) => ({
      ...current,
      accessories: {
        ...current.accessories,
        [key]: value,
      },
    }));
    setError(null);
    setSuccess(null);
  }

  function selectModel(model: DoorModel) {
    setInput((current) => ({
      ...current,
      model,
      accessories: {
        ...current.accessories,
        hasFixedPanel: model === "hinged_with_fixed_panel",
      },
    }));
    setError(null);
    setSuccess(null);
  }

  function validateCurrentInput() {
    const parsed = doorConfigurationSchema.safeParse(input);
    if (!parsed.success) {
      setError(parsed.error.issues.map((issue) => issue.message).join("; "));
      setSuccess(null);
      return null;
    }
    setError(null);
    return calculateDoorConfiguration(parsed.data);
  }

  async function copyScheme() {
    const configuration = validateCurrentInput();
    if (!configuration) return;

    await navigator.clipboard.writeText(configuration.schemeLines.join("\n"));
    setSuccess("Schema copiato negli appunti.");
  }

  function downloadScheme() {
    const configuration = validateCurrentInput();
    if (!configuration) return;

    const payload = JSON.stringify(configuration, null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${input.roomName.toLowerCase().replace(/\s+/g, "-")}-schema-porta.json`;
    link.click();
    URL.revokeObjectURL(url);
    setSuccess("Export JSON generato.");
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 pb-24 md:pb-0">
      <section className="rounded-3xl border border-amber-500/20 bg-gradient-to-br from-zinc-900 via-zinc-950 to-amber-950/30 p-5 md:p-8">
        <Badge variant="warning" className="mb-4">
          Configuratore produzione
        </Badge>
        <div className="grid gap-5 md:grid-cols-[1.1fr_0.9fr] md:items-end">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-50 md:text-5xl">
              Porta pronta da foro muro
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-300 md:text-base">
              Inserisci le quote del vano, scegli il sistema porta e ottieni anta, telaio,
              opera morta, apertura e maniglia in uno schema esportabile.
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Metodo rilievo</p>
            <p className="mt-2 text-sm text-zinc-300">
              Il calcolo usa la larghezza minore tra alto/centro/basso e l&apos;altezza minore tra
              sinistra/destra, come da prassi di rilievo tecnico.
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_420px]">
        <div className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DoorOpen className="h-5 w-5 text-amber-400" />
                1. Modello porta
              </CardTitle>
              <CardDescription>Scegli il sistema; i preset restano modificabili nel tempo.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              {DOOR_MODELS.map((model) => (
                <button
                  key={model.value}
                  type="button"
                  onClick={() => selectModel(model.value)}
                  className={cn(
                    "rounded-2xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50",
                    input.model === model.value
                      ? "border-amber-500 bg-amber-500/10"
                      : "border-zinc-800 bg-zinc-950 hover:border-zinc-700"
                  )}
                >
                  <span className="flex items-center justify-between gap-3">
                    <span className="font-medium text-zinc-100">{model.label}</span>
                    {input.model === model.value && <Check className="h-4 w-4 text-amber-300" />}
                  </span>
                  <span className="mt-2 block text-xs leading-5 text-zinc-400">
                    {modelNotes[model.value]}
                  </span>
                </button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ruler className="h-5 w-5 text-amber-400" />
                2. Foro muro e verso
              </CardTitle>
              <CardDescription>Quote in millimetri, gia comprensive dello stato reale del cantiere.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <TextField
                label="Ambiente"
                value={input.roomName}
                onChange={(value) => setInput((current) => ({ ...current, roomName: value }))}
              />
              <SegmentedDirection
                value={input.openingDirection}
                onChange={(value) =>
                  setInput((current) => ({ ...current, openingDirection: value }))
                }
              />
              <MeasureField
                label="Larghezza alto"
                value={input.wallOpening.widthTopMm}
                onChange={(value) => updateMeasure("widthTopMm", value)}
              />
              <MeasureField
                label="Larghezza centro"
                value={input.wallOpening.widthMiddleMm}
                onChange={(value) => updateMeasure("widthMiddleMm", value)}
              />
              <MeasureField
                label="Larghezza basso"
                value={input.wallOpening.widthBottomMm}
                onChange={(value) => updateMeasure("widthBottomMm", value)}
              />
              <MeasureField
                label="Altezza sinistra"
                value={input.wallOpening.heightLeftMm}
                onChange={(value) => updateMeasure("heightLeftMm", value)}
              />
              <MeasureField
                label="Altezza destra"
                value={input.wallOpening.heightRightMm}
                onChange={(value) => updateMeasure("heightRightMm", value)}
              />
              <MeasureField
                label="Spessore muro"
                value={input.wallOpening.wallDepthMm}
                onChange={(value) => updateMeasure("wallDepthMm", value)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Accessori e produzione</CardTitle>
              <CardDescription>Seleziona display, ovale e stato del pavimento.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              <ToggleCard
                label="Display / visore"
                checked={input.accessories.hasDisplay}
                onChange={(value) => updateAccessory("hasDisplay", value)}
              />
              <ToggleCard
                label="Ovale / vetro"
                checked={input.accessories.hasOvalWindow}
                onChange={(value) => updateAccessory("hasOvalWindow", value)}
              />
              <ToggleCard
                label="Opera morta / fisso"
                checked={input.accessories.hasFixedPanel}
                disabled={input.model === "hinged_with_fixed_panel"}
                onChange={(value) => updateAccessory("hasFixedPanel", value)}
              />
              <ToggleCard
                label="Pavimento finito"
                checked={input.wallOpening.finishedFloor}
                onChange={(value) => updateMeasure("finishedFloor", value)}
              />
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-6 lg:self-start">
          <Card className="border-amber-500/30">
            <CardHeader>
              <CardTitle>Schema porta</CardTitle>
              <CardDescription>Output pronto per distinta o richiesta produzione.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <div role="alert" className="rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">
                  <TriangleAlert className="mr-2 inline h-4 w-4" />
                  {error}
                </div>
              )}
              {result ? (
                <>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Metric label="Anta attiva" value={`${result.leaf.widthMm} x ${result.leaf.heightMm}`} />
                    <Metric
                      label={result.fixedPanel ? "Fisso laterale" : "Luce passaggio"}
                      value={
                        result.fixedPanel
                          ? `${result.fixedPanel.widthMm} x ${result.fixedPanel.heightMm}`
                          : `${result.frame.passageWidthMm} x ${result.frame.passageHeightMm}`
                      }
                    />
                    <Metric label="Maniglia" value={translateSide(result.handleSide)} />
                    <Metric label="Apertura" value={translateSide(result.openingDirection)} />
                  </div>
                  <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
                    <ul className="space-y-2 text-sm text-zinc-300">
                      {result.schemeLines.map((line) => (
                        <li key={line} className="flex gap-2">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
                    <p className="text-sm font-medium text-zinc-100">Note ferramenta</p>
                    <ul className="mt-2 space-y-1 text-xs leading-5 text-zinc-400">
                      {result.hardwareNotes.map((note) => (
                        <li key={note}>- {note}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4">
                    <p className="text-sm font-medium text-amber-100">Controlli prima dell&apos;ordine</p>
                    <ul className="mt-2 space-y-1 text-xs leading-5 text-amber-100/80">
                      {result.productionWarnings.map((warning) => (
                        <li key={warning}>- {warning}</li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : (
                <p className="text-sm text-zinc-400">Completa misure e modello per generare lo schema.</p>
              )}
              <div className="grid gap-3 sm:grid-cols-2">
                <Button type="button" onClick={copyScheme} variant="secondary">
                  <Clipboard className="h-4 w-4" />
                  Copia
                </Button>
                <Button type="button" onClick={downloadScheme}>
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>
              {success && (
                <p role="status" className="text-center text-sm font-medium text-emerald-300">
                  {success}
                </p>
              )}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input value={value} onChange={(event) => onChange(event.target.value)} className="h-12 text-base" />
    </div>
  );
}

function MeasureField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input
        type="number"
        min={0}
        inputMode="numeric"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-12 text-base"
      />
    </div>
  );
}

function SegmentedDirection({
  value,
  onChange,
}: {
  value: DoorOpeningDirection;
  onChange: (value: DoorOpeningDirection) => void;
}) {
  return (
    <div className="space-y-2">
      <Label>Verso apertura</Label>
      <div className="grid grid-cols-2 rounded-xl border border-zinc-800 bg-zinc-950 p-1">
        {(["right", "left"] as DoorOpeningDirection[]).map((direction) => (
          <button
            key={direction}
            type="button"
            onClick={() => onChange(direction)}
            className={cn(
              "h-10 rounded-lg text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50",
              value === direction ? "bg-amber-600 text-white" : "text-zinc-400 hover:text-zinc-100"
            )}
          >
            {translateSide(direction)}
          </button>
        ))}
      </div>
    </div>
  );
}

function ToggleCard({
  label,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "flex min-h-14 items-center justify-between rounded-2xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 disabled:cursor-not-allowed disabled:opacity-70",
        checked ? "border-amber-500 bg-amber-500/10" : "border-zinc-800 bg-zinc-950 hover:border-zinc-700"
      )}
    >
      <span className="text-sm font-medium text-zinc-100">{label}</span>
      <span
        className={cn(
          "flex h-6 w-11 items-center rounded-full p-1 transition",
          checked ? "bg-amber-500" : "bg-zinc-700"
        )}
        aria-hidden
      >
        <span
          className={cn(
            "h-4 w-4 rounded-full bg-white transition",
            checked ? "translate-x-5" : "translate-x-0"
          )}
        />
      </span>
    </button>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-3">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-zinc-100">{value}</p>
    </div>
  );
}

function translateSide(side: "right" | "left" | "center") {
  if (side === "right") return "destra";
  if (side === "left") return "sinistra";
  return "centro";
}
