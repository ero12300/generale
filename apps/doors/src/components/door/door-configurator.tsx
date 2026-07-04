"use client";

import { Download, FileJson, RotateCw, Sparkles } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import { DoorSchemaPreview } from "./door-schema-preview";
import { calculateDoorPlan } from "@/lib/door-engine/formulas";
import { createDoorExport } from "@/lib/door-engine/schema-export";
import type {
  DoorCalculationInput,
  DoorModel,
  DoorSide,
  FixedPanelMode,
  SwingDirection,
} from "@/lib/door-engine/types";
import {
  doorConfigSchema,
  type DoorConfigFormValues,
} from "@/lib/validations/door";

const initialConfig: DoorConfigFormValues = {
  roughOpening: {
    widthMm: 900,
    heightMm: 2100,
    wallThicknessMm: 120,
  },
  model: "hinged",
  hingeSide: "right",
  swing: "in",
  options: {
    hasDisplay: true,
    hasOvalWindow: false,
    fixedPanel: "auto",
  },
};

const modelLabels: Record<DoorModel, string> = {
  hinged: "Battente",
  compass: "Compasso",
  fixed: "Fissa",
};

const sideLabels: Record<DoorSide, string> = {
  left: "Sinistra",
  right: "Destra",
};

const swingLabels: Record<SwingDirection, string> = {
  in: "A tirare",
  out: "A spingere",
};

const fixedPanelLabels: Record<FixedPanelMode, string> = {
  auto: "Automatico se anta troppo larga",
  forced: "Sempre pannello fisso",
  none: "Nessun lavoro morto",
};

export function DoorConfigurator() {
  const [config, setConfig] = useState<DoorConfigFormValues>(initialConfig);
  const [plan, setPlan] = useState(() => calculateDoorPlan(initialConfig));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState("Schema iniziale pronto");
  const resultsRef = useRef<HTMLDivElement>(null);

  const exported = useMemo(() => createDoorExport(plan), [plan]);

  function updateOpening(
    field: keyof DoorConfigFormValues["roughOpening"],
    value: string
  ) {
    setConfig((current) => ({
      ...current,
      roughOpening: {
        ...current.roughOpening,
        [field]: Number(value),
      },
    }));
  }

  function updateOptions(
    field: keyof DoorConfigFormValues["options"],
    value: boolean | FixedPanelMode
  ) {
    setConfig((current) => ({
      ...current,
      options: {
        ...current.options,
        [field]: value,
      },
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess("");

    window.setTimeout(() => {
      const parsed = doorConfigSchema.safeParse(config);
      if (!parsed.success) {
        setLoading(false);
        setError(parsed.error.issues[0]?.message ?? "Controlla i dati inseriti");
        return;
      }

      const nextPlan = calculateDoorPlan(parsed.data as DoorCalculationInput);
      setPlan(nextPlan);
      setSuccess("Schema porta generato e pronto per export");
      setLoading(false);
      window.requestAnimationFrame(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }, 120);
  }

  function downloadJson() {
    downloadText(
      exported.fileName,
      JSON.stringify(exported.json, null, 2),
      "application/json"
    );
  }

  function downloadSvg() {
    downloadText(
      exported.fileName.replace(".json", ".svg"),
      exported.svg,
      "image/svg+xml"
    );
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_420px]">
      <section className="space-y-5">
        <div className="rounded-3xl border border-zinc-800 bg-panel/90 p-5 shadow-2xl shadow-black/20">
          <div className="mb-5 flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-amber">
                Configuratore mobile
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-zinc-50">
                Dal foro muro alla porta pronta
              </h2>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Inserisci luce muro, scegli modello e accessori: l&apos;app calcola
                telaio, anta, lavoro morto, apertura e maniglia.
              </p>
            </div>
            <Sparkles className="h-6 w-6 shrink-0 text-amber" aria-hidden="true" />
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <Fieldset title="1. Foro muro">
              <NumberField
                label="Larghezza foro"
                value={config.roughOpening.widthMm}
                onChange={(value) => updateOpening("widthMm", value)}
                suffix="mm"
              />
              <NumberField
                label="Altezza foro"
                value={config.roughOpening.heightMm}
                onChange={(value) => updateOpening("heightMm", value)}
                suffix="mm"
              />
              <NumberField
                label="Spessore muro"
                value={config.roughOpening.wallThicknessMm}
                onChange={(value) => updateOpening("wallThicknessMm", value)}
                suffix="mm"
              />
            </Fieldset>

            <Fieldset title="2. Modello e accessori">
              <SelectField
                label="Tipo porta"
                value={config.model}
                options={modelLabels}
                onChange={(value) =>
                  setConfig((current) => ({
                    ...current,
                    model: value as DoorModel,
                    options: {
                      ...current.options,
                      fixedPanel: value === "fixed" ? "forced" : current.options.fixedPanel,
                    },
                  }))
                }
              />
              <SelectField
                label="Lavoro morto"
                value={config.options.fixedPanel}
                options={fixedPanelLabels}
                onChange={(value) =>
                  updateOptions("fixedPanel", value as FixedPanelMode)
                }
              />
              <ToggleRow
                label="Display"
                checked={config.options.hasDisplay}
                onChange={(checked) => updateOptions("hasDisplay", checked)}
              />
              <ToggleRow
                label="Oblo ovale"
                checked={config.options.hasOvalWindow}
                onChange={(checked) => updateOptions("hasOvalWindow", checked)}
              />
            </Fieldset>

            <Fieldset title="3. Verso porta">
              <SelectField
                label="Cerniere"
                value={config.hingeSide}
                options={sideLabels}
                onChange={(value) =>
                  setConfig((current) => ({
                    ...current,
                    hingeSide: value as DoorSide,
                  }))
                }
              />
              <SelectField
                label="Apertura"
                value={config.swing}
                options={swingLabels}
                onChange={(value) =>
                  setConfig((current) => ({
                    ...current,
                    swing: value as SwingDirection,
                  }))
                }
              />
            </Fieldset>

            {error ? (
              <p
                className="rounded-2xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200"
                role="alert"
              >
                {error}
              </p>
            ) : null}
            {success ? (
              <p
                className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-200"
                role="status"
              >
                {success}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="flex min-h-[52px] w-full touch-manipulation items-center justify-center gap-2 rounded-2xl bg-amber px-5 py-3 font-semibold text-zinc-950 transition hover:bg-amber-soft disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <RotateCw className="h-5 w-5 animate-spin" aria-hidden="true" />
              ) : (
                <FileJson className="h-5 w-5" aria-hidden="true" />
              )}
              {loading ? "Calcolo in corso" : "Genera porta"}
            </button>
          </form>
        </div>

        <div ref={resultsRef} className="scroll-mt-20 space-y-3">
          <h2 className="text-lg font-semibold text-zinc-50">
            Risultato produzione
          </h2>
          <ResultCards plan={plan} />
        </div>
      </section>

      <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
        <DoorSchemaPreview plan={plan} />
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={downloadJson}
            className="flex min-h-[48px] touch-manipulation items-center justify-center gap-2 rounded-2xl border border-zinc-700 bg-panel px-4 text-sm font-semibold text-zinc-100"
          >
            <Download className="h-4 w-4 text-amber" aria-hidden="true" />
            JSON
          </button>
          <button
            type="button"
            onClick={downloadSvg}
            className="flex min-h-[48px] touch-manipulation items-center justify-center gap-2 rounded-2xl border border-zinc-700 bg-panel px-4 text-sm font-semibold text-zinc-100"
          >
            <Download className="h-4 w-4 text-amber" aria-hidden="true" />
            SVG
          </button>
        </div>
      </aside>
    </div>
  );
}

function Fieldset({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="rounded-2xl border border-zinc-800 bg-graphite/50 p-4">
      <legend className="px-2 text-sm font-semibold text-zinc-100">{title}</legend>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

function NumberField({
  label,
  value,
  onChange,
  suffix,
}: {
  label: string;
  value: number;
  onChange: (value: string) => void;
  suffix: string;
}) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-medium text-zinc-300">{label}</span>
      <span className="flex items-center overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-950 focus-within:ring-2 focus-within:ring-amber/40">
        <input
          className="min-h-[48px] w-full bg-transparent px-4 text-zinc-50 outline-none"
          inputMode="numeric"
          min={0}
          type="number"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        <span className="px-4 text-sm text-zinc-500">{suffix}</span>
      </span>
    </label>
  );
}

function SelectField<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: Record<T, string>;
  onChange: (value: string) => void;
}) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-medium text-zinc-300">{label}</span>
      <select
        className="min-h-[48px] w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 text-zinc-50 outline-none focus:ring-2 focus:ring-amber/40"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {Object.entries(options).map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>
            {optionLabel as string}
          </option>
        ))}
      </select>
    </label>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex min-h-[48px] items-center justify-between gap-4 rounded-2xl border border-zinc-700 bg-zinc-950 px-4">
      <span className="text-sm font-medium text-zinc-300">{label}</span>
      <input
        checked={checked}
        className="h-5 w-5 accent-amber"
        type="checkbox"
        onChange={(event) => onChange(event.target.checked)}
      />
    </label>
  );
}

function ResultCards({ plan }: { plan: ReturnType<typeof calculateDoorPlan> }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <ResultCard
        title="Telaio"
        value={`${plan.frame.outerWidthMm} x ${plan.frame.outerHeightMm} mm`}
        detail={`Profondita ${plan.frame.depthMm} mm, profilo ${plan.frame.profileMm} mm`}
      />
      <ResultCard
        title="Anta"
        value={`${plan.activeLeaf.widthMm} x ${plan.activeLeaf.heightMm} mm`}
        detail={`Spessore ${plan.activeLeaf.thicknessMm} mm`}
      />
      <ResultCard
        title="Apertura"
        value={plan.handing.openingLabel}
        detail={`Maniglia: ${plan.handing.handleSide === "none" ? "non prevista" : sideLabels[plan.handing.handleSide]}`}
      />
      <ResultCard
        title="Lavoro morto"
        value={plan.deadWork.widthMm > 0 ? `${plan.deadWork.widthMm} mm` : "Non richiesto"}
        detail={plan.deadWork.reason || "Anta entro il limite modello"}
      />
    </div>
  );
}

function ResultCard({
  title,
  value,
  detail,
}: {
  title: string;
  value: string;
  detail: string;
}) {
  return (
    <article className="rounded-2xl border border-zinc-800 bg-panel p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">{title}</p>
      <p className="mt-2 text-lg font-semibold text-zinc-50">{value}</p>
      <p className="mt-1 text-sm text-zinc-400">{detail}</p>
    </article>
  );
}

function downloadText(fileName: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
