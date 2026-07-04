"use client";

import { useId, useMemo, useState } from "react";
import {
  Check,
  Clipboard,
  Copy,
  Download,
  DoorOpen,
  Plus,
  Ruler,
  Trash2,
  TriangleAlert,
} from "lucide-react";
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
import { calculateDoorBatch, createDoorInput } from "@/lib/doors/configurator";
import { cn } from "@/lib/utils";
import { doorBatchSchema } from "@/lib/validations/door";

const modelNotes: Record<DoorModel, string> = {
  hinged_single: "Riduce il foro per telaio e crea una anta battente singola.",
  hinged_with_fixed_panel: "Blocca l'anta attiva a 900 mm e manda il residuo in opera morta.",
  sliding_pocket: "Usa quote da controtelaio a scomparsa con anta leggermente maggiorata.",
  sliding_external: "Crea anta esterna con sormonto laterale sul foro muro.",
  folding_compass: "Divide il sistema in due pacchetti anta per apertura a libro/compasso.",
};

export function DoorConfigurator() {
  const [projectName, setProjectName] = useState("Commessa porte");
  const [doors, setDoors] = useState<DoorConfigurationInput[]>([createDoorInput("Porta 1")]);
  const [activeDoorIndex, setActiveDoorIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const input = doors[activeDoorIndex] ?? doors[0]!;

  const batch = useMemo(() => {
    const parsed = doorBatchSchema.safeParse({ projectName, doors });
    if (!parsed.success) return null;
    return calculateDoorBatch(parsed.data);
  }, [projectName, doors]);

  const result = batch?.doors[activeDoorIndex] ?? null;
  const validationError = useMemo(() => {
    const parsed = doorBatchSchema.safeParse({ projectName, doors });
    if (parsed.success) return null;
    return parsed.error.issues.map((issue) => issue.message).join("; ");
  }, [projectName, doors]);

  function updateActiveDoor(updater: (door: DoorConfigurationInput) => DoorConfigurationInput) {
    setDoors((current) =>
      current.map((door, index) => (index === activeDoorIndex ? updater(door) : door))
    );
    setError(null);
    setSuccess(null);
  }

  function updateMeasure(key: keyof DoorConfigurationInput["wallOpening"], value: number | boolean) {
    updateActiveDoor((door) => ({
      ...door,
      wallOpening: {
        ...door.wallOpening,
        [key]: value,
      },
    }));
  }

  function updateAccessory(key: keyof DoorConfigurationInput["accessories"], value: boolean) {
    updateActiveDoor((door) => ({
      ...door,
      accessories: {
        ...door.accessories,
        [key]: value,
      },
    }));
  }

  function selectModel(model: DoorModel) {
    updateActiveDoor((door) => ({
      ...door,
      model,
      accessories: {
        ...door.accessories,
        hasFixedPanel: model === "hinged_with_fixed_panel",
      },
    }));
  }

  function addDoor() {
    const nextIndex = doors.length + 1;
    setDoors((current) => [...current, createDoorInput(`Porta ${nextIndex}`)]);
    setActiveDoorIndex(doors.length);
    setError(null);
    setSuccess(null);
  }

  function duplicateDoor() {
    const copyName = `${input.roomName} copia`;
    setDoors((current) => [...current, { ...input, roomName: copyName }]);
    setActiveDoorIndex(doors.length);
    setError(null);
    setSuccess(null);
  }

  function removeDoor(index: number) {
    if (doors.length === 1) return;
    setDoors((current) => current.filter((_, doorIndex) => doorIndex !== index));
    setActiveDoorIndex((current) => {
      if (index < current) return current - 1;
      if (index === current) return Math.max(0, current - 1);
      return current;
    });
    setError(null);
    setSuccess(null);
  }

  function validateBatch() {
    const parsed = doorBatchSchema.safeParse({ projectName, doors });
    if (!parsed.success) {
      setError(parsed.error.issues.map((issue) => issue.message).join("; "));
      setSuccess(null);
      return null;
    }
    setError(null);
    return calculateDoorBatch(parsed.data);
  }

  async function copyScheme() {
    const order = validateBatch();
    if (!order) return;

    try {
      await navigator.clipboard.writeText(order.exportLines.join("\n"));
      setSuccess(`Ordine copiato: ${order.doors.length} porte.`);
    } catch {
      setError("Impossibile copiare: autorizza gli appunti o usa Export.");
      setSuccess(null);
    }
  }

  function downloadScheme() {
    const order = validateBatch();
    if (!order) return;

    try {
      const payload = JSON.stringify(order, null, 2);
      const blob = new Blob([payload], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${projectName.toLowerCase().replace(/\s+/g, "-")}-ordine-porte.json`;
      link.click();
      URL.revokeObjectURL(url);
      setSuccess(`Export JSON generato: ${order.doors.length} porte.`);
    } catch {
      setError("Impossibile generare l'export JSON. Verifica il browser e riprova.");
      setSuccess(null);
    }
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
              Ordine porte da foro muro
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-300 md:text-base">
              Crea piu porte nella stessa commessa: ogni ambiente ha misure, modello e
              accessori propri. Alla fine esporti tutto insieme per la produzione.
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Multi-porta</p>
            <p className="mt-2 text-sm text-zinc-300">
              Usa i tab in alto per passare tra le porte, duplicare una configurazione
              simile o aggiungerne una nuova.
            </p>
          </div>
        </div>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Commessa</CardTitle>
          <CardDescription>Nome dell&apos;ordine o del cantiere.</CardDescription>
        </CardHeader>
        <CardContent>
          <TextField
            label="Nome commessa"
            value={projectName}
            onChange={(value) => {
              setProjectName(value);
              setError(null);
              setSuccess(null);
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle>Porte in ordine</CardTitle>
              <CardDescription>
                {doors.length} {doors.length === 1 ? "porta" : "porte"} configurate
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button type="button" size="sm" variant="secondary" onClick={duplicateDoor}>
                <Copy className="h-4 w-4" />
                Duplica
              </Button>
              <Button type="button" size="sm" onClick={addDoor}>
                <Plus className="h-4 w-4" />
                Aggiungi porta
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div
            role="tablist"
            aria-label="Porte in ordine"
            className="flex gap-2 overflow-x-auto pb-1"
          >
            {doors.map((door, index) => (
              <div
                key={`${door.roomName}-${index}`}
                className={cn(
                  "flex min-w-[9rem] shrink-0 items-stretch overflow-hidden rounded-2xl border",
                  index === activeDoorIndex
                    ? "border-amber-500 bg-amber-500/10"
                    : "border-zinc-800 bg-zinc-950"
                )}
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={index === activeDoorIndex}
                  onClick={() => {
                    setActiveDoorIndex(index);
                    setError(null);
                    setSuccess(null);
                  }}
                  className="flex flex-1 flex-col px-4 py-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
                >
                  <span className="text-xs text-zinc-500">Porta {index + 1}</span>
                  <span className="text-sm font-medium text-zinc-100">{door.roomName}</span>
                </button>
                {doors.length > 1 && (
                  <button
                    type="button"
                    aria-label={`Rimuovi ${door.roomName}`}
                    onClick={() => removeDoor(index)}
                    className="border-l border-zinc-800 px-3 text-zinc-500 hover:bg-zinc-900 hover:text-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_420px]">
        <div className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DoorOpen className="h-5 w-5 text-amber-400" />
                1. Modello porta
              </CardTitle>
              <CardDescription>Scegli il sistema per {input.roomName}.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              {DOOR_MODELS.map((model) => (
                <button
                  key={model.value}
                  type="button"
                  aria-pressed={input.model === model.value}
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
              <CardDescription>Quote in millimetri per {input.roomName}.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <TextField
                label="Ambiente"
                value={input.roomName}
                onChange={(value) => updateActiveDoor((door) => ({ ...door, roomName: value }))}
              />
              <SegmentedDirection
                value={input.openingDirection}
                onChange={(value) =>
                  updateActiveDoor((door) => ({ ...door, openingDirection: value }))
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
              <CardDescription>Opzioni specifiche per {input.roomName}.</CardDescription>
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
                checked={input.model === "hinged_with_fixed_panel"}
                disabled
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
              <CardTitle>Schema porta attiva</CardTitle>
              <CardDescription>
                {input.roomName} · porta {activeDoorIndex + 1} di {doors.length}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {(error || validationError) && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200"
                >
                  <TriangleAlert className="mr-2 inline h-4 w-4" />
                  {error ?? validationError}
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
                </>
              ) : (
                <p className="text-sm text-zinc-400">Completa misure e modello per generare lo schema.</p>
              )}
            </CardContent>
          </Card>

          {batch && batch.doors.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Riepilogo ordine</CardTitle>
                <CardDescription>Tutte le porte della commessa.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {batch.doors.map((door, index) => (
                  <button
                    key={`${door.input.roomName}-${index}`}
                    type="button"
                    onClick={() => setActiveDoorIndex(index)}
                    className={cn(
                      "w-full rounded-2xl border p-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50",
                      index === activeDoorIndex
                        ? "border-amber-500/50 bg-amber-500/10"
                        : "border-zinc-800 bg-zinc-950 hover:border-zinc-700"
                    )}
                  >
                    <p className="text-sm font-medium text-zinc-100">
                      {index + 1}. {door.input.roomName}
                    </p>
                    <p className="mt-1 text-xs text-zinc-400">
                      {door.modelLabel} · anta {door.leaf.widthMm} x {door.leaf.heightMm} mm
                    </p>
                  </button>
                ))}
              </CardContent>
            </Card>
          )}

          <Card className="border-amber-500/30">
            <CardHeader>
              <CardTitle>Export ordine completo</CardTitle>
              <CardDescription>Copia o scarica tutte le porte insieme.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <Button type="button" onClick={copyScheme} variant="secondary">
                  <Clipboard className="h-4 w-4" />
                  Copia ordine
                </Button>
                <Button type="button" onClick={downloadScheme}>
                  <Download className="h-4 w-4" />
                  Export JSON
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
  const id = useId();

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 text-base"
      />
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
  const id = useId();

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
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
      <div
        role="group"
        aria-label="Verso apertura"
        className="grid grid-cols-2 rounded-xl border border-zinc-800 bg-zinc-950 p-1"
      >
        {(["right", "left"] as DoorOpeningDirection[]).map((direction) => (
          <button
            key={direction}
            type="button"
            aria-pressed={value === direction}
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
      role="switch"
      aria-checked={checked}
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
