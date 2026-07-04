"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowRightLeft,
  CheckCircle2,
  Download,
  DoorClosed,
  Gauge,
  LoaderCircle,
  Ruler,
  TriangleAlert,
} from "lucide-react";
import { loadDoorModels } from "@/lib/catalog";
import {
  buildDoorExportPayload,
  calculateDoorConfiguration,
} from "@/lib/configurator";
import type {
  DoorComposition,
  DoorConfigurationResult,
  DoorConfiguratorInput,
  DoorModel,
  GlassVariant,
  Side,
  SwingDirection,
} from "@/lib/types";

const initialInput: DoorConfiguratorInput = {
  modelId: "classic-battente",
  openingWidthMm: 900,
  openingHeightMm: 2100,
  wallThicknessMm: 110,
  composition: "single",
  glassVariant: "none",
  hasOvalWindow: false,
  hingeSide: "right",
  swingDirection: "push",
};

export function DoorConfigurator() {
  const [models, setModels] = useState<DoorModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [input, setInput] = useState<DoorConfiguratorInput>(initialInput);

  useEffect(() => {
    async function hydrateCatalog() {
      try {
        const loadedModels = await loadDoorModels();
        setModels(loadedModels);
        if (!loadedModels.some((model) => model.id === initialInput.modelId)) {
          setInput((current) => ({ ...current, modelId: loadedModels[0].id }));
        }
      } catch {
        setLoadError("Impossibile caricare il catalogo porte.");
      } finally {
        setLoading(false);
      }
    }

    void hydrateCatalog();
  }, []);

  const selectedModel = models.find((model) => model.id === input.modelId) ?? null;

  const calculation = useMemo<
    { result: DoorConfigurationResult; exportPayload: ReturnType<typeof buildDoorExportPayload> } | { error: string }
  >(() => {
    if (!selectedModel) {
      return { error: "Seleziona un modello valido." };
    }

    try {
      const result = calculateDoorConfiguration(input);
      return {
        result,
        exportPayload: buildDoorExportPayload(result),
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Configurazione non valida.",
      };
    }
  }, [input, selectedModel]);

  const canUseFullGlass = selectedModel?.supportedGlass.includes("full") ?? false;
  const canUseOval = selectedModel?.supportsOvalWindow ?? false;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-5 text-center shadow-2xl backdrop-blur">
          <LoaderCircle className="mx-auto mb-3 h-8 w-8 animate-spin text-amber-400" />
          <p className="text-sm text-slate-300">Caricamento catalogo porte...</p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="max-w-sm rounded-3xl border border-red-400/20 bg-red-500/10 p-6 text-center">
          <TriangleAlert className="mx-auto mb-3 h-8 w-8 text-red-300" />
          <h1 className="mb-2 text-lg font-semibold">Errore caricamento</h1>
          <p className="text-sm text-red-100/80">{loadError}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="safe-top safe-bottom min-h-screen bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.18),_transparent_32%),linear-gradient(180deg,#020617_0%,#0f172a_100%)]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-5 sm:px-6 lg:flex-row lg:items-start lg:py-8">
        <section className="w-full lg:max-w-xl">
          <div className="rounded-[28px] border border-white/10 bg-slate-900/75 p-5 shadow-2xl backdrop-blur">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-amber-400/25 bg-amber-400/10 px-3 py-1 text-xs font-medium text-amber-200">
                  <DoorClosed className="h-3.5 w-3.5" />
                  Configuratore mobile
                </div>
                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  Porta pronta per produzione
                </h1>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Inserisci vano muro, modello e apertura. Il sistema calcola riduzioni,
                  telaio, anta, fisso e genera la scheda tecnica esportabile.
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <FormSection
                icon={<Ruler className="h-4 w-4 text-amber-300" />}
                title="Misure vano"
                description="Usa sempre la misura minima rilevata."
              >
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <NumberField
                    id="opening-width"
                    label="Larghezza vano (mm)"
                    value={input.openingWidthMm}
                    onChange={(value) => setInput((current) => ({ ...current, openingWidthMm: value }))}
                  />
                  <NumberField
                    id="opening-height"
                    label="Altezza vano (mm)"
                    value={input.openingHeightMm}
                    onChange={(value) => setInput((current) => ({ ...current, openingHeightMm: value }))}
                  />
                  <NumberField
                    id="wall-thickness"
                    label="Spessore muro (mm)"
                    value={input.wallThicknessMm}
                    onChange={(value) => setInput((current) => ({ ...current, wallThicknessMm: value }))}
                  />
                </div>
              </FormSection>

              <FormSection
                icon={<Gauge className="h-4 w-4 text-amber-300" />}
                title="Modello e composizione"
                description="Ogni modello porta con se tolleranze diverse."
              >
                <div className="grid gap-3">
                  <SelectField
                    id="model"
                    label="Modello porta"
                    value={input.modelId}
                    onChange={(value) =>
                      setInput((current) => ({
                        ...current,
                        modelId: value as DoorConfiguratorInput["modelId"],
                        glassVariant:
                          value === "glass-suite"
                            ? current.glassVariant
                            : current.glassVariant === "full"
                              ? "none"
                              : current.glassVariant,
                        hasOvalWindow: value === "atelier-oval" ? current.hasOvalWindow : false,
                      }))
                    }
                    options={models.map((model) => ({
                      value: model.id,
                      label: model.name,
                    }))}
                  />
                  <SelectField
                    id="composition"
                    label="Composizione"
                    value={input.composition}
                    onChange={(value) =>
                      setInput((current) => ({
                        ...current,
                        composition: value as DoorComposition,
                      }))
                    }
                    options={[
                      { value: "single", label: "Anta singola" },
                      { value: "single-fixed-left", label: "Anta + fisso sinistro" },
                      { value: "single-fixed-right", label: "Anta + fisso destro" },
                    ]}
                  />
                  <SelectField
                    id="glass"
                    label="Vetro"
                    value={input.glassVariant}
                    onChange={(value) =>
                      setInput((current) => ({
                        ...current,
                        glassVariant: value as GlassVariant,
                      }))
                    }
                    options={[
                      { value: "none", label: "Senza vetro" },
                      { value: "slit", label: "Feritoia verticale" },
                      ...(canUseFullGlass
                        ? [{ value: "full", label: "Vetrata intera" }]
                        : []),
                    ]}
                  />
                  <label className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <div>
                      <span className="block text-sm font-medium text-slate-100">Oblo ovale</span>
                      <span className="text-xs text-slate-400">
                        {canUseOval ? "Disponibile per questo modello." : "Non disponibile sul modello attuale."}
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={input.hasOvalWindow}
                      disabled={!canUseOval}
                      onChange={(event) =>
                        setInput((current) => ({
                          ...current,
                          hasOvalWindow: event.target.checked,
                        }))
                      }
                      className="h-5 w-5 rounded border-white/20 bg-slate-900 accent-amber-400"
                    />
                  </label>
                </div>
              </FormSection>

              <FormSection
                icon={<ArrowRightLeft className="h-4 w-4 text-amber-300" />}
                title="Verso apertura"
                description="Il lato maniglia viene calcolato automaticamente."
              >
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <SelectField
                    id="hinge-side"
                    label="Cerniere"
                    value={input.hingeSide}
                    onChange={(value) =>
                      setInput((current) => ({
                        ...current,
                        hingeSide: value as Side,
                      }))
                    }
                    options={[
                      { value: "left", label: "Cerniere a sinistra" },
                      { value: "right", label: "Cerniere a destra" },
                    ]}
                  />
                  <SelectField
                    id="swing-direction"
                    label="Movimento anta"
                    value={input.swingDirection}
                    onChange={(value) =>
                      setInput((current) => ({
                        ...current,
                        swingDirection: value as SwingDirection,
                      }))
                    }
                    options={[
                      { value: "push", label: "A spingere" },
                      { value: "pull", label: "A tirare" },
                    ]}
                  />
                </div>
              </FormSection>
            </div>
          </div>
        </section>

        <section className="w-full flex-1">
          {"error" in calculation ? (
            <div className="rounded-[28px] border border-red-400/20 bg-red-500/10 p-5 shadow-2xl backdrop-blur">
              <div className="mb-3 flex items-center gap-3">
                <TriangleAlert className="h-5 w-5 text-red-300" />
                <h2 className="text-lg font-semibold">Configurazione non valida</h2>
              </div>
              <p className="text-sm leading-6 text-red-100/85">{calculation.error}</p>
            </div>
          ) : (
            <ResultPanel
              result={calculation.result}
              svgMarkup={calculation.exportPayload.svg}
              onDownloadSvg={() =>
                downloadTextFile(
                  calculation.exportPayload.svg,
                  calculation.exportPayload.fileName,
                  "image/svg+xml"
                )
              }
              onDownloadJson={() =>
                downloadTextFile(
                  calculation.exportPayload.json,
                  calculation.exportPayload.jsonFileName,
                  "application/json"
                )
              }
              productionSheet={calculation.exportPayload.productionSheet}
            />
          )}
        </section>
      </div>
    </main>
  );
}

function ResultPanel({
  result,
  svgMarkup,
  productionSheet,
  onDownloadSvg,
  onDownloadJson,
}: {
  result: DoorConfigurationResult;
  svgMarkup: string;
  productionSheet: string;
  onDownloadSvg: () => void;
  onDownloadJson: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="rounded-[28px] border border-emerald-400/20 bg-emerald-500/10 p-5 shadow-2xl backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-200">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Pronta per produzione
            </div>
            <h2 className="text-xl font-semibold">{result.model.name}</h2>
            <p className="mt-1 text-sm text-emerald-50/80">{result.orientation.openingLabel}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onDownloadSvg}
              className="touch-manipulation inline-flex min-h-11 items-center gap-2 rounded-2xl bg-amber-400 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-amber-300"
            >
              <Download className="h-4 w-4" />
              Export SVG
            </button>
            <button
              type="button"
              onClick={onDownloadJson}
              className="touch-manipulation inline-flex min-h-11 items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
            >
              <Download className="h-4 w-4" />
              Export JSON
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-[28px] border border-white/10 bg-slate-900/75 p-4 shadow-2xl backdrop-blur">
        <div
          className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/80"
          dangerouslySetInnerHTML={{ __html: svgMarkup }}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[28px] border border-white/10 bg-slate-900/75 p-5 shadow-2xl backdrop-blur">
          <h3 className="mb-4 text-lg font-semibold">Scheda tecnica</h3>
          <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
            <Metric label="Vano muro" value={`${result.input.openingWidthMm} x ${result.input.openingHeightMm} mm`} />
            <Metric label="Spessore muro" value={`${result.input.wallThicknessMm} mm`} />
            <Metric label="Telaio" value={`${result.production.frameWidthMm} x ${result.production.frameHeightMm} mm`} />
            <Metric label="Anta" value={`${result.production.leafWidthMm} x ${result.production.leafHeightMm} mm`} />
            <Metric label="Luce passaggio" value={`${result.production.clearPassageWidthMm} x ${result.production.clearPassageHeightMm} mm`} />
            <Metric label="Pannello fisso" value={`${result.production.fixedPanelWidthMm} mm`} />
            <Metric label="Cerniere" value={result.orientation.hingeSide === "left" ? "Sinistra" : "Destra"} />
            <Metric label="Maniglia" value={result.orientation.handleSide === "left" ? "Sinistra" : "Destra"} />
          </dl>

          <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
            <h4 className="mb-2 text-sm font-semibold text-slate-100">Dettagli configurazione</h4>
            <div className="flex flex-wrap gap-2">
              {result.summary.features.map((feature) => (
                <span
                  key={feature}
                  className="rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs font-medium text-amber-100"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-slate-900/75 p-5 shadow-2xl backdrop-blur">
          <h3 className="mb-4 text-lg font-semibold">Promemoria officina</h3>
          <ul className="space-y-3 text-sm leading-6 text-slate-300">
            {result.summary.notes.map((note) => (
              <li key={note} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                {note}
              </li>
            ))}
          </ul>

          <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/70 p-4">
            <h4 className="mb-2 text-sm font-semibold">Anteprima export</h4>
            <pre className="max-h-72 overflow-auto whitespace-pre-wrap text-xs leading-5 text-slate-300">
              {productionSheet}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

function FormSection({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-4">
      <div className="mb-3 flex items-start gap-3">
        <div className="rounded-2xl bg-amber-400/10 p-2">{icon}</div>
        <div>
          <h2 className="text-sm font-semibold text-slate-100">{title}</h2>
          <p className="text-xs leading-5 text-slate-400">{description}</p>
        </div>
      </div>
      {children}
    </section>
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
    <label htmlFor={id} className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-200">{label}</span>
      <input
        id={id}
        type="number"
        inputMode="numeric"
        min={0}
        value={value}
        onChange={(event) => onChange(Number(event.target.value || 0))}
        className="min-h-12 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-slate-50 outline-none transition focus:border-amber-400/60"
      />
    </label>
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
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <label htmlFor={id} className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-200">{label}</span>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-12 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-slate-50 outline-none transition focus:border-amber-400/60"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <dt className="text-xs uppercase tracking-[0.18em] text-slate-400">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-slate-100">{value}</dd>
    </div>
  );
}

function downloadTextFile(content: string, fileName: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}
