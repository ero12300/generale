"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { DoorSchematicPreview } from "@/components/door-schematic-preview";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Download,
  FileJson,
  Plus,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  calculateDoor,
  formatMm,
  formatMmRaw,
  validateOpening,
} from "@/lib/door-engine";
import {
  DEAD_WORK_PRESETS,
  DOOR_MODELS,
  getDoorModel,
  OPENING_DIRECTION_LABELS,
  SYSTEM_LABELS,
} from "@/lib/door-models";
import { useAuth } from "@/components/auth-provider";
import {
  createProjectId,
  projectStore,
} from "@/lib/project-store";
import { downloadProductionJson, downloadSchematicSvg } from "@/lib/schematic";
import type {
  DeadWork,
  DoorProject,
  OpeningDirection,
  WallOpening,
} from "@/lib/types";

const STEPS = [
  { id: "opening", label: "Foro muro" },
  { id: "deadwork", label: "Lavoro morto" },
  { id: "model", label: "Modello" },
  { id: "direction", label: "Apertura" },
  { id: "result", label: "Schema" },
] as const;

type StepId = (typeof STEPS)[number]["id"];

const DEFAULT_OPENING: WallOpening = {
  widthMm: 900,
  heightMm: 2150,
  wallThicknessMm: 120,
  label: "",
};

const DEFAULT_DEAD_WORK: DeadWork = DEAD_WORK_PRESETS[0].deadWork;

export function DoorWizardApp() {
  const { userId, loading: authLoading, isDemoMode } = useAuth();
  const [projects, setProjects] = useState<DoorProject[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [view, setView] = useState<"list" | "wizard">("list");
  const [step, setStep] = useState<StepId>("opening");
  const [projectId, setProjectId] = useState<string | null>(null);

  const [opening, setOpening] = useState<WallOpening>(DEFAULT_OPENING);
  const [deadWork, setDeadWork] = useState<DeadWork>(DEFAULT_DEAD_WORK);
  const [modelId, setModelId] = useState("battente-liscia");
  const [openingDirection, setOpeningDirection] = useState<OpeningDirection | null>("dx_tirare");

  const [mounted, setMounted] = useState(false);

  const refreshProjects = useCallback(async () => {
    if (!userId) return;
    setProjectsLoading(true);
    try {
      const list = await projectStore.listProjects(userId);
      setProjects(list);
    } finally {
      setProjectsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!authLoading && userId) {
      void refreshProjects();
    }
  }, [authLoading, userId, refreshProjects]);

  const model = getDoorModel(modelId);
  const validation = validateOpening(opening, deadWork);
  const calculated = useMemo(() => {
    if (!model || !validation.valid) return null;
    return calculateDoor(opening, deadWork, model, openingDirection);
  }, [opening, deadWork, model, openingDirection, validation.valid]);

  const stepIndex = STEPS.findIndex((s) => s.id === step);
  const isFixedDoor = model?.system === "fissa";

  const saveCurrent = async () => {
    if (!projectId || !calculated || !userId) return;
    setSaving(true);
    try {
      const now = new Date().toISOString();
      const existing = projects.find((p) => p.id === projectId);
      await projectStore.upsertProject(userId, {
        id: projectId,
        createdAt: existing?.createdAt ?? now,
        updatedAt: now,
        wallOpening: opening,
        deadWork,
        modelId,
        openingDirection,
        calculated,
      });
      await refreshProjects();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!userId) return;
    await projectStore.deleteProject(userId, id);
    await refreshProjects();
  };

  const startNew = () => {
    setProjectId(createProjectId());
    setOpening(DEFAULT_OPENING);
    setDeadWork(DEFAULT_DEAD_WORK);
    setModelId("battente-liscia");
    setOpeningDirection("dx_tirare");
    setStep("opening");
    setView("wizard");
  };

  const loadProject = (p: DoorProject) => {
    setProjectId(p.id);
    setOpening(p.wallOpening);
    setDeadWork(p.deadWork);
    setModelId(p.modelId);
    setOpeningDirection(p.openingDirection);
    setStep("result");
    setView("wizard");
  };

  const canNext = (): boolean => {
    switch (step) {
      case "opening":
        return validation.valid;
      case "deadwork":
        return validation.valid;
      case "model":
        return !!model;
      case "direction":
        return isFixedDoor || !!openingDirection;
      case "result":
        return !!calculated;
      default: {
        const _exhaustive: never = step;
        return _exhaustive;
      }
    }
  };

  const goNext = async () => {
    const next = STEPS[stepIndex + 1];
    if (!next) return;
    if (next.id === "direction" && isFixedDoor) {
      setStep("result");
      await saveCurrent();
      return;
    }
    if (next.id === "result") await saveCurrent();
    setStep(next.id);
  };

  const goBack = () => {
    const prev = STEPS[stepIndex - 1];
    if (!prev) {
      setView("list");
      return;
    }
    if (step === "result" && isFixedDoor) {
      setStep("model");
      return;
    }
    setStep(prev.id);
  };

  if (!mounted || authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-cream/50">Caricamento...</p>
      </div>
    );
  }

  if (view === "list") {
    return (
      <div className="mx-auto min-h-screen max-w-lg px-4 pb-8 pt-safe-top">
        <header className="py-6">
          <h1 className="text-2xl font-bold text-cream">PortePro</h1>
          <p className="mt-1 text-sm text-cream/60">
            Calcolo porte da foro muro a schema produzione
          </p>
          {isDemoMode ? (
            <p className="mt-2 rounded-lg bg-amber-900/30 px-3 py-1.5 text-xs text-amber-200">
              Modalità demo — dati salvati in locale. Configura Firebase per sync cloud.
            </p>
          ) : (
            <p className="mt-2 rounded-lg bg-green-900/30 px-3 py-1.5 text-xs text-green-200">
              Cloud attivo — progetti sincronizzati su Firebase
            </p>
          )}
        </header>

        <Button onClick={startNew} className="mb-6 w-full" size="lg">
          <Plus className="h-5 w-5" />
          Nuova porta
        </Button>

        {projectsLoading ? (
          <Card>
            <CardContent className="py-8 text-center text-cream/50">
              Caricamento progetti...
            </CardContent>
          </Card>
        ) : projects.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-cream/50">
              Nessun progetto salvato. Inizia inserendo le misure del foro muro.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {projects.map((p) => (
              <Card
                key={p.id}
                className="cursor-pointer transition-colors hover:border-wood/40"
                onClick={() => loadProject(p)}
              >
                <CardHeader className="flex-row items-start justify-between gap-2">
                  <div>
                    <CardTitle className="text-base">
                      {p.wallOpening.label || "Porta senza nome"}
                    </CardTitle>
                    <CardDescription>
                      {p.calculated
                        ? `${formatMmRaw(p.calculated.panelWidthMm)} × ${formatMmRaw(p.calculated.panelHeightMm)}`
                        : `${formatMmRaw(p.wallOpening.widthMm)} × ${formatMmRaw(p.wallOpening.heightMm)}`}
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      void handleDelete(p.id);
                    }}
                    aria-label="Elimina progetto"
                  >
                    <Trash2 className="h-4 w-4 text-red-400" />
                  </Button>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen max-w-lg px-4 pb-8 pt-safe-top">
      <header className="flex items-center gap-3 py-4">
        <Button variant="ghost" size="icon" onClick={goBack} aria-label="Indietro">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <p className="text-xs text-cream/50">
            Passo {stepIndex + 1} di {STEPS.length}
          </p>
          <h1 className="text-lg font-semibold">{STEPS[stepIndex].label}</h1>
        </div>
      </header>

      {/* Progress bar */}
      <div className="mb-6 flex gap-1">
        {STEPS.map((s, i) => (
          <div
            key={s.id}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i <= stepIndex ? "bg-wood" : "bg-wood/20"
            }`}
          />
        ))}
      </div>

      {/* Step: Foro muro */}
      {step === "opening" && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Misure foro muro</CardTitle>
              <CardDescription>
                Inserisci la luce netta del vano (da spallette a spallette, pavimento finito ad architrave).
                Misura in almeno 3 punti e usa la misura minima.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="label">Nome / riferimento (opzionale)</Label>
                <Input
                  id="label"
                  placeholder="es. Camera 1, Ingresso"
                  value={opening.label ?? ""}
                  onChange={(e) => setOpening({ ...opening, label: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="width">Larghezza foro (mm)</Label>
                <Input
                  id="width"
                  type="number"
                  inputMode="numeric"
                  value={opening.widthMm}
                  onChange={(e) =>
                    setOpening({ ...opening, widthMm: Number(e.target.value) })
                  }
                />
                <p className="mt-1 text-xs text-cream/40">{formatMm(opening.widthMm)}</p>
              </div>
              <div>
                <Label htmlFor="height">Altezza foro (mm)</Label>
                <Input
                  id="height"
                  type="number"
                  inputMode="numeric"
                  value={opening.heightMm}
                  onChange={(e) =>
                    setOpening({ ...opening, heightMm: Number(e.target.value) })
                  }
                />
                <p className="mt-1 text-xs text-cream/40">{formatMm(opening.heightMm)}</p>
              </div>
              <div>
                <Label htmlFor="thickness">Spessore muro (mm)</Label>
                <Input
                  id="thickness"
                  type="number"
                  inputMode="numeric"
                  value={opening.wallThicknessMm}
                  onChange={(e) =>
                    setOpening({ ...opening, wallThicknessMm: Number(e.target.value) })
                  }
                />
              </div>
              {!validation.valid && (
                <p className="rounded-lg bg-red-900/30 px-3 py-2 text-sm text-red-300">
                  {validation.message}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step: Lavoro morto */}
      {step === "deadwork" && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lavoro morto</CardTitle>
              <CardDescription>
                Margini da sottrarre al foro muro per ottenere le dimensioni anta.
                Standard: -10 cm larghezza, -5 cm altezza.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {DEAD_WORK_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setDeadWork(preset.deadWork)}
                  className={`w-full rounded-xl border p-4 text-left transition-colors touch-manipulation ${
                    deadWork.widthMm === preset.deadWork.widthMm &&
                    deadWork.heightMm === preset.deadWork.heightMm
                      ? "border-wood bg-wood/15"
                      : "border-wood/20 hover:border-wood/40"
                  }`}
                >
                  <p className="font-medium">{preset.label}</p>
                </button>
              ))}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <Label htmlFor="dw-width">Larghezza (mm)</Label>
                  <Input
                    id="dw-width"
                    type="number"
                    value={deadWork.widthMm}
                    onChange={(e) =>
                      setDeadWork({ ...deadWork, widthMm: Number(e.target.value) })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="dw-height">Altezza (mm)</Label>
                  <Input
                    id="dw-height"
                    type="number"
                    value={deadWork.heightMm}
                    onChange={(e) =>
                      setDeadWork({ ...deadWork, heightMm: Number(e.target.value) })
                    }
                  />
                </div>
              </div>
              {calculated && (
                <div className="rounded-xl bg-wood/10 p-4">
                  <p className="text-sm text-cream/70">Anta risultante:</p>
                  <p className="text-xl font-bold text-wood-light">
                    {formatMmRaw(calculated.panelWidthMm)} × {formatMmRaw(calculated.panelHeightMm)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step: Modello */}
      {step === "model" && (
        <div className="space-y-3">
          {DOOR_MODELS.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => {
                setModelId(m.id);
                setDeadWork(m.defaultDeadWork);
                if (m.system === "fissa") setOpeningDirection(null);
                else if (!openingDirection) setOpeningDirection("dx_tirare");
              }}
              className={`w-full rounded-2xl border p-4 text-left transition-colors touch-manipulation ${
                modelId === m.id
                  ? "border-wood bg-wood/15"
                  : "border-wood/20 hover:border-wood/40"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold">{m.name}</p>
                  <p className="mt-0.5 text-xs text-cream/50">{SYSTEM_LABELS[m.system]}</p>
                  <p className="mt-1 text-sm text-cream/60">{m.description}</p>
                </div>
                {modelId === m.id && <Check className="h-5 w-5 shrink-0 text-wood-light" />}
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {m.features.hasDisplay && (
                  <span className="rounded-md bg-blue-900/40 px-2 py-0.5 text-xs text-blue-200">Display</span>
                )}
                {m.features.hasOval && (
                  <span className="rounded-md bg-purple-900/40 px-2 py-0.5 text-xs text-purple-200">Ovale</span>
                )}
                {m.features.hasFixedPanel && (
                  <span className="rounded-md bg-gray-700/60 px-2 py-0.5 text-xs text-gray-200">Fissa</span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Step: Apertura */}
      {step === "direction" && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Senso di apertura</CardTitle>
              <CardDescription>
                Posizionati dal lato verso cui la porta si apre. Le cerniere indicano il verso destro o sinistro.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-3">
              {(Object.keys(OPENING_DIRECTION_LABELS) as OpeningDirection[]).map((dir) => (
                <button
                  key={dir}
                  type="button"
                  onClick={() => setOpeningDirection(dir)}
                  className={`rounded-xl border p-4 text-left transition-colors touch-manipulation ${
                    openingDirection === dir
                      ? "border-wood bg-wood/15"
                      : "border-wood/20 hover:border-wood/40"
                  }`}
                >
                  <p className="font-medium">{OPENING_DIRECTION_LABELS[dir]}</p>
                  {openingDirection === dir && calculated && (
                    <p className="mt-1 text-sm text-cream/60">
                      {calculated.handleLabel} — {calculated.hingeSide === "right" ? "Cerniere a destra" : "Cerniere a sinistra"}
                    </p>
                  )}
                </button>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step: Risultato / Schema */}
      {step === "result" && calculated && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Schema produzione</CardTitle>
              <CardDescription>
                {calculated.model.name} — {calculated.openingLabel}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DoorSchematicPreview door={calculated} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dimensioni</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <Row label="Foro muro" value={`${formatMmRaw(calculated.wallOpening.widthMm)} × ${formatMmRaw(calculated.wallOpening.heightMm)}`} />
              <Row label="Anta" value={`${formatMmRaw(calculated.panelWidthMm)} × ${formatMmRaw(calculated.panelHeightMm)}`} />
              <Row label="Esterno telaio" value={`${formatMmRaw(calculated.frameOuterWidthMm)} × ${formatMmRaw(calculated.frameOuterHeightMm)}`} />
              <Row label="Luce passaggio" value={`${formatMmRaw(calculated.passageWidthMm)} × ${formatMmRaw(calculated.passageHeightMm)}`} />
              <Row label="Apertura" value={calculated.openingLabel} />
              <Row label="Maniglia" value={calculated.handleLabel} />
              <Row label="Spessore anta" value={`${calculated.model.panelThicknessMm} mm`} />
              <Row label="Altezza maniglia" value={`${calculated.model.handleHeightMm} mm da pavimento`} />
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="secondary"
              onClick={() => downloadSchematicSvg(calculated)}
              className="w-full"
            >
              <Download className="h-4 w-4" />
              SVG
            </Button>
            <Button
              variant="secondary"
              onClick={() => downloadProductionJson(calculated)}
              className="w-full"
            >
              <FileJson className="h-4 w-4" />
              JSON
            </Button>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="safe-bottom fixed bottom-0 left-0 right-0 border-t border-wood/15 bg-charcoal/95 p-4 backdrop-blur-lg">
        <div className="mx-auto flex max-w-lg gap-3">
          {step !== "result" ? (
            <Button onClick={() => void goNext()} disabled={!canNext() || saving} className="flex-1" size="lg">
              {saving ? "Salvataggio..." : "Avanti"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={() => setView("list")} className="flex-1" size="lg">
              <Check className="h-4 w-4" />
              Salva e chiudi
            </Button>
          )}
        </div>
      </div>
      <div className="h-20" />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-wood/10 py-2 last:border-0">
      <span className="text-cream/60">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}
