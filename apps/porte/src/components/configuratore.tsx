"use client";

import { useEffect, useMemo, useState } from "react";
import {
  DoorClosed,
  DoorOpen,
  FileDown,
  Layers,
  Printer,
  Ruler,
  Save,
  Settings2,
  SquareStack,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, SectionTitle } from "./ui/card";
import { NumberFieldCm } from "./ui/number-field";
import { Segmented } from "./ui/segmented";
import { DoorSchematic } from "./door-schematic";
import { SchedaProduzione } from "./scheda-produzione";
import { calcolaPorta, validateInput } from "@/lib/calc";
import { DOOR_MODELS, getModel } from "@/lib/models";
import {
  OPENING_LABELS,
  VERSO_LABELS,
  type DoorInput,
  type Oblo,
  type Spinta,
  type Verso,
} from "@/lib/types";
import { formatDim } from "@/lib/format";
import {
  loadOrders,
  newId,
  removeOrder,
  saveOrder,
  type SavedOrder,
} from "@/lib/storage";

interface FormState {
  modelId: string;
  foroLarghezza: number | null;
  foroAltezza: number | null;
  spessoreMuro: number | null;
  verso: Verso;
  spinta: Spinta;
  compasso: boolean;
  antaFissa: boolean;
  antaFissaLarghezza: number | null;
  vetro: boolean;
  oblo: Oblo;
  note: string;
}

const DEFAULT_FORM: FormState = {
  modelId: "classica-battente",
  foroLarghezza: 900,
  foroAltezza: 2150,
  spessoreMuro: 105,
  verso: "sx",
  spinta: "spinge",
  compasso: false,
  antaFissa: false,
  antaFissaLarghezza: 400,
  vetro: false,
  oblo: "nessuno",
  note: "",
};

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-all ${
        checked
          ? "border-[var(--color-accent)] bg-[var(--color-accent-soft)]"
          : "border-[var(--color-line)] bg-[var(--color-surface)]"
      }`}
    >
      <span className="text-sm font-medium">{label}</span>
      <span
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? "bg-[var(--color-accent)]" : "bg-[var(--color-line)]"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
            checked ? "left-[22px]" : "left-0.5"
          }`}
        />
      </span>
    </button>
  );
}

export function Configuratore() {
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [commessa, setCommessa] = useState("");
  const [cliente, setCliente] = useState("");
  const [showSheet, setShowSheet] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [orders, setOrders] = useState<SavedOrder[]>([]);
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => {
    setOrders(loadOrders());
  }, []);

  const model = getModel(form.modelId) ?? DOOR_MODELS[0];

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function selectModel(id: string) {
    const m = getModel(id);
    setForm((f) => ({
      ...f,
      modelId: id,
      compasso: m?.supportaCompasso ? f.compasso : false,
      antaFissa: m?.supportaAntaFissa ? f.antaFissa : false,
      vetro: m?.supportaVetro ? f.vetro : false,
      oblo: m?.supportaOblo ? f.oblo : "nessuno",
    }));
  }

  const candidate: DoorInput | null = useMemo(() => {
    if (
      form.foroLarghezza == null ||
      form.foroAltezza == null ||
      form.spessoreMuro == null
    ) {
      return null;
    }
    return {
      modelId: form.modelId,
      tipoApertura: model.tipoApertura,
      foroLarghezza: form.foroLarghezza,
      foroAltezza: form.foroAltezza,
      spessoreMuro: form.spessoreMuro,
      verso: form.verso,
      spinta: form.spinta,
      compasso: form.compasso,
      antaFissa: form.antaFissa,
      antaFissaLarghezza: form.antaFissa
        ? form.antaFissaLarghezza ?? 0
        : 0,
      vetro: form.vetro,
      oblo: form.oblo,
      note: form.note,
    };
  }, [form, model]);

  const validation = candidate ? validateInput(candidate) : null;
  const result =
    validation && validation.success ? calcolaPorta(validation.data) : null;

  const fieldErrors: Record<string, string> = {};
  if (validation && !validation.success) {
    for (const issue of validation.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    }
  }

  const sheetMeta = {
    commessa,
    cliente,
    data: new Date().toLocaleDateString("it-IT"),
  };

  function handleSave() {
    if (!candidate) return;
    const order: SavedOrder = {
      id: newId(),
      commessa: commessa || "Senza commessa",
      cliente,
      createdAt: Date.now(),
      input: candidate,
    };
    setOrders(saveOrder(order));
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1800);
  }

  function loadIntoForm(o: SavedOrder) {
    const m = getModel(o.input.modelId);
    setForm({
      modelId: o.input.modelId,
      foroLarghezza: o.input.foroLarghezza,
      foroAltezza: o.input.foroAltezza,
      spessoreMuro: o.input.spessoreMuro,
      verso: o.input.verso,
      spinta: o.input.spinta,
      compasso: m?.supportaCompasso ? o.input.compasso : false,
      antaFissa: o.input.antaFissa,
      antaFissaLarghezza: o.input.antaFissaLarghezza || 400,
      vetro: o.input.vetro,
      oblo: o.input.oblo,
      note: o.input.note,
    });
    setCommessa(o.commessa === "Senza commessa" ? "" : o.commessa);
    setCliente(o.cliente);
    setShowOrders(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleRemove(id: string) {
    setOrders(removeOrder(id));
  }

  return (
    <>
      <div className="app-shell mx-auto max-w-2xl px-4 pb-40 pt-4 safe-top">
        {/* Header */}
        <header className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-steel)] text-white">
              <DoorOpen className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-lg font-bold leading-none">PortaPronta</h1>
              <p className="text-xs text-[var(--color-muted)]">
                Dal foro muro alla porta pronta
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowOrders(true)}
            aria-label="Ordini salvati"
          >
            <Layers className="h-4 w-4" />
            {orders.length > 0 ? orders.length : ""}
          </Button>
        </header>

        {/* Commessa */}
        <Card className="mb-4 p-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="commessa" className="mb-1.5 block text-sm font-medium">
                Commessa
              </label>
              <input
                id="commessa"
                value={commessa}
                onChange={(e) => setCommessa(e.target.value)}
                placeholder="Es. 2026-014"
                className="h-12 w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] px-3 outline-none"
              />
            </div>
            <div>
              <label htmlFor="cliente" className="mb-1.5 block text-sm font-medium">
                Cliente
              </label>
              <input
                id="cliente"
                value={cliente}
                onChange={(e) => setCliente(e.target.value)}
                placeholder="Nome cliente"
                className="h-12 w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] px-3 outline-none"
              />
            </div>
          </div>
        </Card>

        {/* Modello */}
        <Card className="mb-4 p-4">
          <SectionTitle
            icon={<DoorClosed className="h-4 w-4" />}
            hint="Scegli il tipo di porta: determina il calcolo delle misure."
          >
            Modello porta
          </SectionTitle>
          <div className="grid gap-2">
            {DOOR_MODELS.map((m) => {
              const active = m.id === form.modelId;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => selectModel(m.id)}
                  className={`rounded-xl border p-3 text-left transition-all ${
                    active
                      ? "border-[var(--color-accent)] bg-[var(--color-accent-soft)]"
                      : "border-[var(--color-line)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-2)]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{m.nome}</span>
                    <span className="rounded-full border border-[var(--color-line)] px-2 py-0.5 text-[11px] text-[var(--color-muted)]">
                      {OPENING_LABELS[m.tipoApertura]}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-[var(--color-muted)]">
                    {m.descrizione}
                  </p>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Rilievo */}
        <Card className="mb-4 p-4">
          <SectionTitle
            icon={<Ruler className="h-4 w-4" />}
            hint={
              model.tipoApertura === "scomparsa"
                ? "Inserisci la luce di passaggio desiderata e lo spessore muro."
                : "Inserisci il foro nel muro (vano) e lo spessore del muro."
            }
          >
            {model.tipoApertura === "scomparsa" ? "Luce desiderata" : "Foro muro"}
          </SectionTitle>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-3">
              <NumberFieldCm
                id="foroL"
                label="Larghezza"
                valueMm={form.foroLarghezza}
                onChangeMm={(v) => update("foroLarghezza", v)}
                error={fieldErrors.foroLarghezza}
              />
              <NumberFieldCm
                id="foroH"
                label="Altezza"
                valueMm={form.foroAltezza}
                onChangeMm={(v) => update("foroAltezza", v)}
                error={fieldErrors.foroAltezza}
              />
            </div>
            <NumberFieldCm
              id="muro"
              label="Spessore muro"
              step={5}
              valueMm={form.spessoreMuro}
              onChangeMm={(v) => update("spessoreMuro", v)}
              hint="Determina la profondità del telaio"
              error={fieldErrors.spessoreMuro}
            />
          </div>
        </Card>

        {/* Apertura */}
        <Card className="mb-4 p-4">
          <SectionTitle
            icon={<DoorOpen className="h-4 w-4" />}
            hint="Lato cerniere e direzione: la maniglia va sul lato opposto."
          >
            Senso di apertura
          </SectionTitle>
          <div className="grid gap-4">
            <div>
              <p className="mb-1.5 text-sm font-medium">Cerniere / apertura</p>
              <Segmented<Verso>
                ariaLabel="Verso di apertura"
                value={form.verso}
                onChange={(v) => update("verso", v)}
                options={[
                  { value: "sx", label: "Sinistra" },
                  { value: "dx", label: "Destra" },
                ]}
              />
            </div>
            <div>
              <p className="mb-1.5 text-sm font-medium">Direzione</p>
              <Segmented<Spinta>
                ariaLabel="Direzione apertura"
                value={form.spinta}
                onChange={(v) => update("spinta", v)}
                options={[
                  { value: "spinge", label: "Spinge", hint: "verso interno" },
                  { value: "tira", label: "Tira", hint: "verso di sé" },
                ]}
              />
            </div>
          </div>
        </Card>

        {/* Accessori */}
        <Card className="mb-4 p-4">
          <SectionTitle
            icon={<Settings2 className="h-4 w-4" />}
            hint="Configura gli optional del modello."
          >
            Accessori & optional
          </SectionTitle>
          <div className="grid gap-3">
            {model.supportaCompasso ? (
              <Toggle
                label="Cerniere a compasso"
                checked={form.compasso}
                onChange={(v) => update("compasso", v)}
              />
            ) : null}
            {model.supportaAntaFissa ? (
              <div>
                <Toggle
                  label="Anta fissa laterale"
                  checked={form.antaFissa}
                  onChange={(v) => update("antaFissa", v)}
                />
                {form.antaFissa ? (
                  <div className="mt-3">
                    <NumberFieldCm
                      id="antaFissa"
                      label="Larghezza anta fissa"
                      valueMm={form.antaFissaLarghezza}
                      onChangeMm={(v) => update("antaFissaLarghezza", v)}
                      error={fieldErrors.antaFissaLarghezza}
                    />
                  </div>
                ) : null}
              </div>
            ) : null}
            {model.supportaVetro ? (
              <Toggle
                label="Vetro / vetrata"
                checked={form.vetro}
                onChange={(v) => update("vetro", v)}
              />
            ) : null}
            {model.supportaOblo ? (
              <div>
                <p className="mb-1.5 text-sm font-medium">Oblò</p>
                <Segmented<Oblo>
                  ariaLabel="Oblò"
                  value={form.oblo}
                  onChange={(v) => update("oblo", v)}
                  options={[
                    { value: "nessuno", label: "Nessuno" },
                    { value: "tondo", label: "Tondo" },
                    { value: "ovale", label: "Ovale" },
                  ]}
                />
              </div>
            ) : null}
          </div>
        </Card>

        {/* Note */}
        <Card className="mb-4 p-4">
          <label htmlFor="note" className="mb-1.5 block text-sm font-medium">
            Note commessa
          </label>
          <textarea
            id="note"
            value={form.note}
            onChange={(e) => update("note", e.target.value)}
            rows={2}
            placeholder="Finitura, colore, ferramenta, indicazioni di posa…"
            className="w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] px-3 py-3 outline-none"
          />
        </Card>

        {/* Risultato */}
        {result ? (
          <Card className="mb-4 overflow-hidden">
            <div className="border-b border-[var(--color-line)] bg-[var(--color-surface-2)] p-4">
              <SectionTitle
                icon={<SquareStack className="h-4 w-4" />}
                hint="Anteprima dello schema tecnico."
              >
                Porta calcolata
              </SectionTitle>
              <div className="rounded-xl border border-[var(--color-line)] bg-white p-2">
                <DoorSchematic result={result} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-px bg-[var(--color-line)]">
              <Stat
                label="Anta da produrre"
                value={formatDim(result.anta.larghezza, result.anta.altezza)}
                highlight
              />
              <Stat
                label="Luce passaggio"
                value={formatDim(
                  result.lucePassaggio.larghezza,
                  result.lucePassaggio.altezza
                )}
              />
              <Stat
                label="Telaio"
                value={formatDim(result.telaio.larghezza, result.telaio.altezza)}
              />
              <Stat
                label="Prof. telaio"
                value={`${result.profonditaTelaio} mm`}
              />
              <Stat label="Cerniere" value={VERSO_LABELS[result.input.verso]} />
              <Stat
                label="Maniglia"
                value={VERSO_LABELS[result.latoManiglia]}
              />
            </div>
            {result.messaggi.length ? (
              <div className="space-y-1.5 p-4">
                {result.messaggi.map((m, i) => (
                  <p
                    key={i}
                    className={`text-sm ${
                      m.severity === "error"
                        ? "text-red-600"
                        : m.severity === "warning"
                        ? "text-amber-700"
                        : "text-[var(--color-muted)]"
                    }`}
                  >
                    {m.severity === "error"
                      ? "✕ "
                      : m.severity === "warning"
                      ? "⚠ "
                      : "✓ "}
                    {m.testo}
                  </p>
                ))}
              </div>
            ) : null}
          </Card>
        ) : (
          <Card className="mb-4 p-4 text-sm text-[var(--color-muted)]">
            Inserisci larghezza, altezza e spessore muro per calcolare la porta.
          </Card>
        )}
      </div>

      {/* Barra azioni fissa */}
      <div className="no-print fixed inset-x-0 bottom-0 z-30 border-t border-[var(--color-line)] bg-[var(--color-surface)]/95 backdrop-blur safe-bottom">
        <div className="mx-auto flex max-w-2xl items-center gap-2 px-4 py-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs text-[var(--color-muted)]">Anta da produrre</p>
            <p className="num-field truncate text-base font-bold text-[var(--color-accent)]">
              {result
                ? formatDim(result.anta.larghezza, result.anta.altezza)
                : "—"}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleSave}
            disabled={!result}
            aria-label="Salva ordine"
          >
            <Save className="h-4 w-4" />
            {savedFlash ? "Salvato" : "Salva"}
          </Button>
          <Button
            onClick={() => setShowSheet(true)}
            disabled={!result}
            aria-label="Genera scheda"
          >
            <FileDown className="h-4 w-4" />
            Scheda
          </Button>
        </div>
      </div>

      {/* Modale scheda / stampa */}
      {showSheet && result ? (
        <div className="print-root fixed inset-0 z-50 overflow-y-auto bg-black/50">
          <div className="no-print sticky top-0 z-10 flex items-center justify-between border-b border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-3">
            <span className="font-semibold">Scheda di produzione</span>
            <div className="flex gap-2">
              <Button variant="steel" size="sm" onClick={() => window.print()}>
                <Printer className="h-4 w-4" />
                Stampa / PDF
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSheet(false)}
                aria-label="Chiudi"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <div className="p-3 sm:p-6">
            <div className="card">
              <SchedaProduzione result={result} meta={sheetMeta} />
            </div>
          </div>
        </div>
      ) : null}

      {/* Drawer ordini salvati */}
      {showOrders ? (
        <div className="no-print fixed inset-0 z-50 bg-black/50">
          <div className="absolute inset-x-0 bottom-0 max-h-[80vh] overflow-y-auto rounded-t-2xl bg-[var(--color-surface)] p-4 safe-bottom">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-bold">Ordini salvati</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowOrders(false)}
                aria-label="Chiudi"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            {orders.length === 0 ? (
              <p className="py-8 text-center text-sm text-[var(--color-muted)]">
                Nessun ordine salvato. Compila e premi “Salva”.
              </p>
            ) : (
              <ul className="space-y-2">
                {orders.map((o) => {
                  const m = getModel(o.input.modelId);
                  return (
                    <li
                      key={o.id}
                      className="flex items-center gap-3 rounded-xl border border-[var(--color-line)] p-3"
                    >
                      <button
                        type="button"
                        onClick={() => loadIntoForm(o)}
                        className="min-w-0 flex-1 text-left"
                      >
                        <p className="truncate font-semibold">{o.commessa}</p>
                        <p className="truncate text-xs text-[var(--color-muted)]">
                          {m?.nome} · {formatDim(
                            o.input.foroLarghezza,
                            o.input.foroAltezza
                          )}
                          {o.cliente ? ` · ${o.cliente}` : ""}
                        </p>
                      </button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemove(o.id)}
                        aria-label={`Elimina ${o.commessa}`}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}

function Stat({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="bg-[var(--color-surface)] p-3">
      <p className="text-xs text-[var(--color-muted)]">{label}</p>
      <p
        className={`num-field font-bold ${
          highlight ? "text-[var(--color-accent)]" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}
