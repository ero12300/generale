"use client";

import { useEffect, useMemo, useState } from "react";
import {
  DoorOpen,
  Download,
  FileJson,
  Image as ImageIcon,
  Info,
  Printer,
  RotateCcw,
  Save,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import { z } from "zod";
import { CATALOGO, getModello } from "@/lib/catalog";
import { calcola } from "@/lib/engine";
import { generaSvg } from "@/lib/scheme";
import { LABEL_OBLO, schedaProduzione } from "@/lib/format";
import { downloadJson, downloadPng, downloadSvg, slug } from "@/lib/export";
import {
  eliminaScheda,
  listaSchede,
  salvaScheda,
  type SchedaSalvata,
} from "@/lib/storage";
import {
  configSchema,
  OBLO,
  type Config,
  type Mano,
  type Oblo,
  type Verso,
} from "@/lib/types";
import { Button, Card, Field, Segmented, SelectField, SectionTitle, Toggle } from "@/components/ui";

interface FormState {
  commessa: string;
  cliente: string;
  modelloId: string;
  foroLarghezza: string;
  foroAltezza: string;
  spessoreParete: string;
  mano: Mano;
  verso: Verso;
  sopraluce: boolean;
  sopraluceAltezza: string;
  antaFissa: boolean;
  antaFissaLarghezza: string;
  bussola: boolean;
  bussolaFiancoSx: string;
  bussolaFiancoDx: string;
  oblo: Oblo;
  useOverride: boolean;
  ovTelaioL: string;
  ovTelaioH: string;
  ovGiocoL: string;
  ovGiocoH: string;
}

const INITIAL: FormState = {
  commessa: "",
  cliente: "",
  modelloId: "battente-classica",
  foroLarghezza: "900",
  foroAltezza: "2110",
  spessoreParete: "105",
  mano: "destra",
  verso: "spingere",
  sopraluce: false,
  sopraluceAltezza: "400",
  antaFissa: false,
  antaFissaLarghezza: "500",
  bussola: false,
  bussolaFiancoSx: "300",
  bussolaFiancoDx: "0",
  oblo: "nessuno",
  useOverride: false,
  ovTelaioL: "150",
  ovTelaioH: "75",
  ovGiocoL: "8",
  ovGiocoH: "8",
};

function toNum(v: string): number {
  return v.trim() === "" ? NaN : Number(v);
}

function configToForm(c: Config): FormState {
  return {
    commessa: c.commessa,
    cliente: c.cliente,
    modelloId: c.modelloId,
    foroLarghezza: String(c.foroLarghezza),
    foroAltezza: String(c.foroAltezza),
    spessoreParete: String(c.spessoreParete),
    mano: c.mano,
    verso: c.verso,
    sopraluce: c.opzioni.sopraluce,
    sopraluceAltezza: String(c.opzioni.sopraluceAltezza),
    antaFissa: c.opzioni.antaFissa,
    antaFissaLarghezza: String(c.opzioni.antaFissaLarghezza),
    bussola: c.opzioni.bussola,
    bussolaFiancoSx: String(c.opzioni.bussolaFiancoSx),
    bussolaFiancoDx: String(c.opzioni.bussolaFiancoDx),
    oblo: c.opzioni.oblo,
    useOverride: Boolean(c.deduzioniOverride),
    ovTelaioL: String(c.deduzioniOverride?.telaioLarghezza ?? 150),
    ovTelaioH: String(c.deduzioniOverride?.telaioAltezza ?? 75),
    ovGiocoL: String(c.deduzioniOverride?.giocoAntaLarghezza ?? 8),
    ovGiocoH: String(c.deduzioniOverride?.giocoAntaAltezza ?? 8),
  };
}

function errFor(error: z.ZodError | null, path: string): string | undefined {
  if (!error) return undefined;
  return error.issues.find((i) => i.path.join(".") === path)?.message;
}

const MANO_OPTS: { value: Mano; label: string }[] = [
  { value: "sinistra", label: "Sinistra" },
  { value: "destra", label: "Destra" },
];
const VERSO_OPTS: { value: Verso; label: string }[] = [
  { value: "spingere", label: "Spingere" },
  { value: "tirare", label: "Tirare" },
];
const OBLO_OPTS = OBLO.map((o) => ({ value: o, label: LABEL_OBLO[o] }));

export default function Configurator() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [schede, setSchede] = useState<SchedaSalvata[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [pngLoading, setPngLoading] = useState(false);

  useEffect(() => {
    setSchede(listaSchede());
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const modello = getModello(form.modelloId);

  const { config, error } = useMemo(() => {
    const candidate: Record<string, unknown> = {
      commessa: form.commessa,
      cliente: form.cliente,
      modelloId: form.modelloId,
      foroLarghezza: toNum(form.foroLarghezza),
      foroAltezza: toNum(form.foroAltezza),
      spessoreParete: toNum(form.spessoreParete),
      mano: form.mano,
      verso: form.verso,
      opzioni: {
        sopraluce: form.sopraluce,
        sopraluceAltezza: toNum(form.sopraluceAltezza),
        antaFissa: form.antaFissa,
        antaFissaLarghezza: toNum(form.antaFissaLarghezza),
        bussola: form.bussola,
        bussolaFiancoSx: toNum(form.bussolaFiancoSx),
        bussolaFiancoDx: toNum(form.bussolaFiancoDx),
        oblo: form.oblo,
      },
    };
    if (form.useOverride) {
      candidate.deduzioniOverride = {
        telaioLarghezza: toNum(form.ovTelaioL),
        telaioAltezza: toNum(form.ovTelaioH),
        giocoAntaLarghezza: toNum(form.ovGiocoL),
        giocoAntaAltezza: toNum(form.ovGiocoH),
      };
    }
    const parsed = configSchema.safeParse(candidate);
    return parsed.success
      ? { config: parsed.data, error: null }
      : { config: null, error: parsed.error };
  }, [form]);

  const risultato = useMemo(() => (config ? calcola(config) : null), [config]);
  const svg = useMemo(
    () => (risultato && config ? generaSvg(risultato, config) : ""),
    [risultato, config],
  );

  const nomeFile = useMemo(
    () => slug(form.commessa || modello?.nome || "porta"),
    [form.commessa, modello],
  );

  const handleModello = (id: string) => {
    const m = getModello(id);
    setForm((f) => ({
      ...f,
      modelloId: id,
      sopraluce: m?.opzioni.sopraluce ? f.sopraluce : false,
      antaFissa: m?.opzioni.antaFissa ? f.antaFissa : false,
      bussola: m?.opzioni.bussola ? f.bussola : false,
      oblo: m?.opzioni.oblo ? f.oblo : "nessuno",
    }));
  };

  const handleSave = () => {
    if (!config) return;
    salvaScheda(config.commessa || modello?.nome || "Porta", config);
    setSchede(listaSchede());
    setToast("Scheda salvata");
  };

  const handleLoad = (s: SchedaSalvata) => {
    const parsed = configSchema.safeParse(s.config);
    if (parsed.success) {
      setForm(configToForm(parsed.data));
      setToast(`Caricata: ${s.nome}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleDelete = (id: string) => {
    eliminaScheda(id);
    setSchede(listaSchede());
  };

  const handlePng = async () => {
    if (!svg) return;
    setPngLoading(true);
    try {
      await downloadPng(svg, nomeFile);
      setToast("PNG esportato");
    } catch {
      setToast("Errore export PNG");
    } finally {
      setPngLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 pb-28">
      {/* Form */}
      <div className="no-print space-y-4">
        <Card>
          <SectionTitle hint="Dati identificativi opzionali della lavorazione">Commessa</SectionTitle>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field id="commessa" label="Riferimento commessa" value={form.commessa} onChange={(v) => set("commessa", v)} placeholder="es. C-2026-014" />
            <Field id="cliente" label="Cliente" value={form.cliente} onChange={(v) => set("cliente", v)} placeholder="es. Rossi Srl" />
          </div>
        </Card>

        <Card>
          <SectionTitle hint="Il motore deduce telaio/controtelaio e giochi di posa dal modello">
            Modello porta
          </SectionTitle>
          <SelectField
            id="modello"
            label="Tipo di porta"
            value={form.modelloId}
            options={CATALOGO.map((m) => ({ value: m.id, label: m.nome }))}
            onChange={handleModello}
          />
          {modello ? <p className="mt-2 text-xs text-muted">{modello.descrizione}</p> : null}
        </Card>

        <Card>
          <SectionTitle hint="Misura il vano grezzo al morto in millimetri (largh. minima su 3 punti)">
            Foro muro
          </SectionTitle>
          <div className="grid gap-3 sm:grid-cols-3">
            <Field id="foroL" label="Larghezza" suffix="mm" type="number" inputMode="numeric" value={form.foroLarghezza} onChange={(v) => set("foroLarghezza", v)} error={errFor(error, "foroLarghezza")} placeholder="900" />
            <Field id="foroH" label="Altezza" suffix="mm" type="number" inputMode="numeric" value={form.foroAltezza} onChange={(v) => set("foroAltezza", v)} error={errFor(error, "foroAltezza")} placeholder="2110" />
            <Field id="sp" label="Spessore parete" suffix="mm" type="number" inputMode="numeric" value={form.spessoreParete} onChange={(v) => set("spessoreParete", v)} error={errFor(error, "spessoreParete")} placeholder="105" />
          </div>
        </Card>

        <Card>
          <SectionTitle hint="DIN 107: la mano è il lato delle cerniere; la maniglia è sul lato opposto">
            Verso di apertura
          </SectionTitle>
          <div className="grid gap-3 sm:grid-cols-2">
            <Segmented label="Mano (cerniere)" value={form.mano} options={MANO_OPTS} onChange={(v) => set("mano", v)} />
            <Segmented label="Verso" value={form.verso} options={VERSO_OPTS} onChange={(v) => set("verso", v)} />
          </div>
        </Card>

        <Card>
          <SectionTitle hint="Disponibili in base al modello selezionato">Opzioni</SectionTitle>
          <div className="space-y-3">
            {modello?.opzioni.sopraluce ? (
              <div className="space-y-2">
                <Toggle label="Sopraluce" checked={form.sopraluce} onChange={(v) => set("sopraluce", v)} />
                {form.sopraluce ? (
                  <Field id="slH" label="Altezza sopraluce" suffix="mm" type="number" inputMode="numeric" value={form.sopraluceAltezza} onChange={(v) => set("sopraluceAltezza", v)} error={errFor(error, "opzioni.sopraluceAltezza")} />
                ) : null}
              </div>
            ) : null}

            {modello?.opzioni.antaFissa ? (
              <div className="space-y-2">
                <Toggle label="Anta fissa (semifissa)" checked={form.antaFissa} onChange={(v) => set("antaFissa", v)} />
                {form.antaFissa ? (
                  <Field id="afL" label="Larghezza anta fissa" suffix="mm" type="number" inputMode="numeric" value={form.antaFissaLarghezza} onChange={(v) => set("antaFissaLarghezza", v)} error={errFor(error, "opzioni.antaFissaLarghezza")} />
                ) : null}
              </div>
            ) : null}

            {modello?.opzioni.bussola ? (
              <div className="space-y-2">
                <Toggle label="Bussola (fianchi fissi)" checked={form.bussola} onChange={(v) => set("bussola", v)} />
                {form.bussola ? (
                  <div className="grid grid-cols-2 gap-3">
                    <Field id="bsx" label="Fianco sinistro" suffix="mm" type="number" inputMode="numeric" value={form.bussolaFiancoSx} onChange={(v) => set("bussolaFiancoSx", v)} error={errFor(error, "opzioni.bussolaFiancoSx")} />
                    <Field id="bdx" label="Fianco destro" suffix="mm" type="number" inputMode="numeric" value={form.bussolaFiancoDx} onChange={(v) => set("bussolaFiancoDx", v)} error={errFor(error, "opzioni.bussolaFiancoDx")} />
                  </div>
                ) : null}
              </div>
            ) : null}

            {modello?.opzioni.oblo ? (
              <SelectField id="oblo" label="Oblò / vetro sull'anta" value={form.oblo} options={OBLO_OPTS} onChange={(v) => set("oblo", v)} />
            ) : null}
          </div>

          <div className="mt-4 border-t border-line pt-3">
            <Toggle label="Parametri avanzati (override deduzioni)" checked={form.useOverride} onChange={(v) => set("useOverride", v)} />
            {form.useOverride ? (
              <div className="mt-3 grid grid-cols-2 gap-3">
                <Field id="ovtl" label="Deduzione telaio L" suffix="mm" type="number" inputMode="numeric" value={form.ovTelaioL} onChange={(v) => set("ovTelaioL", v)} error={errFor(error, "deduzioniOverride.telaioLarghezza")} />
                <Field id="ovth" label="Deduzione telaio H" suffix="mm" type="number" inputMode="numeric" value={form.ovTelaioH} onChange={(v) => set("ovTelaioH", v)} error={errFor(error, "deduzioniOverride.telaioAltezza")} />
                <Field id="ovgl" label="Gioco anta L" suffix="mm" type="number" inputMode="numeric" value={form.ovGiocoL} onChange={(v) => set("ovGiocoL", v)} error={errFor(error, "deduzioniOverride.giocoAntaLarghezza")} />
                <Field id="ovgh" label="Gioco anta H" suffix="mm" type="number" inputMode="numeric" value={form.ovGiocoH} onChange={(v) => set("ovGiocoH", v)} error={errFor(error, "deduzioniOverride.giocoAntaAltezza")} />
              </div>
            ) : null}
          </div>
        </Card>
      </div>

      {/* Errore globale */}
      {error ? (
        <div className="no-print mt-4 flex items-start gap-2 rounded-2xl border border-danger/30 bg-red-50 p-4 text-sm text-danger">
          <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0" />
          <p>Completa correttamente i campi evidenziati per generare lo schema di produzione.</p>
        </div>
      ) : null}

      {/* Risultato */}
      {risultato && config ? (
        <div className="mt-6 space-y-4 print-area">
          <div className="hidden print:block">
            <h1 className="text-xl font-bold">Scheda di produzione porta</h1>
            <p className="text-sm text-muted">
              {config.commessa ? `Commessa ${config.commessa} · ` : ""}
              {config.cliente || ""}
            </p>
          </div>

          <Card className="print-break">
            <SectionTitle>Quote di produzione</SectionTitle>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <Quota label="Luce passaggio" value={`${risultato.lucePassaggio.larghezza} × ${risultato.lucePassaggio.altezza}`} accent />
              <Quota label="Anta finita" value={`${risultato.anta.larghezza} × ${risultato.anta.altezza}`} accent />
              <Quota label="Foro muro" value={`${risultato.foro.larghezza} × ${risultato.foro.altezza}`} />
              <Quota label="Senso apertura" value={risultato.sensoApertura} />
              <Quota label="Cerniere" value={cap(risultato.latoCerniere)} />
              <Quota label="Maniglia" value={`${cap(risultato.latoManiglia)} · h ${risultato.altezzaManiglia}`} />
              {risultato.ingombroTotale ? (
                <Quota label="Ingombro totale" value={`${risultato.ingombroTotale.larghezza} × ${risultato.ingombroTotale.altezza}`} />
              ) : null}
              <Quota label="Oblò / vetro" value={LABEL_OBLO[config.opzioni.oblo]} />
            </div>
          </Card>

          {risultato.avvisi.length > 0 ? (
            <div className="flex flex-col gap-2 rounded-2xl border border-warn/30 bg-amber-50 p-4 text-sm text-warn">
              {risultato.avvisi.map((a, i) => (
                <div key={i} className="flex items-start gap-2">
                  <Info className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{a}</span>
                </div>
              ))}
            </div>
          ) : null}

          <Card className="print-break">
            <SectionTitle hint="Vista in prospetto con quote, cerniere, maniglia e verso">
              Schema tecnico
            </SectionTitle>
            <div
              className="overflow-hidden rounded-xl border border-line bg-white"
              dangerouslySetInnerHTML={{ __html: svg }}
            />
          </Card>

          <div className="no-print grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Button variant="secondary" onClick={() => window.print()}>
              <Printer className="h-4 w-4" /> PDF / Stampa
            </Button>
            <Button variant="secondary" onClick={() => downloadSvg(svg, nomeFile)}>
              <Download className="h-4 w-4" /> SVG
            </Button>
            <Button variant="secondary" onClick={handlePng} loading={pngLoading}>
              {!pngLoading ? <ImageIcon className="h-4 w-4" /> : null} PNG
            </Button>
            <Button variant="secondary" onClick={() => downloadJson(schedaProduzione(risultato, config), nomeFile)}>
              <FileJson className="h-4 w-4" /> JSON
            </Button>
          </div>
        </div>
      ) : null}

      {/* Schede salvate */}
      <div className="no-print mt-8">
        <SectionTitle hint="Salvate sul dispositivo per riprenderle in seguito">
          Schede salvate ({schede.length})
        </SectionTitle>
        {schede.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-line bg-white/60 p-4 text-sm text-muted">
            Nessuna scheda salvata. Configura una porta e premi «Salva».
          </p>
        ) : (
          <ul className="space-y-2">
            {schede.map((s) => (
              <li key={s.id} className="flex items-center justify-between rounded-xl border border-line bg-surface px-3 py-2.5">
                <button type="button" onClick={() => handleLoad(s)} className="min-w-0 flex-1 text-left">
                  <span className="block truncate text-sm font-medium text-ink">{s.nome}</span>
                  <span className="block text-xs text-muted">
                    {new Date(s.salvataIl).toLocaleString("it-IT")}
                  </span>
                </button>
                <button type="button" onClick={() => handleDelete(s.id)} aria-label={`Elimina ${s.nome}`} className="ml-2 rounded-lg p-2 text-muted hover:bg-canvas hover:text-danger">
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Barra azioni sticky */}
      <div className="no-print fixed inset-x-0 bottom-0 z-20 border-t border-line bg-surface/95 backdrop-blur safe-bottom">
        <div className="mx-auto flex max-w-2xl items-center gap-2 px-4 py-3">
          <Button variant="ghost" onClick={() => setForm(INITIAL)} className="px-3">
            <RotateCcw className="h-4 w-4" /> Reset
          </Button>
          <Button onClick={handleSave} disabled={!config} className="flex-1">
            <Save className="h-4 w-4" /> Salva scheda
          </Button>
        </div>
      </div>

      {/* Toast */}
      {toast ? (
        <div className="no-print fixed bottom-24 left-1/2 z-30 -translate-x-1/2 rounded-full bg-ink px-4 py-2 text-sm font-medium text-white shadow-lg">
          <span className="inline-flex items-center gap-2">
            <DoorOpen className="h-4 w-4" /> {toast}
          </span>
        </div>
      ) : null}
    </div>
  );
}

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function Quota({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`rounded-xl border p-3 ${accent ? "border-accent/30 bg-accent-soft" : "border-line bg-canvas"}`}>
      <div className="text-[11px] font-medium uppercase tracking-wide text-muted">{label}</div>
      <div className={`mt-0.5 text-sm font-semibold ${accent ? "text-accent" : "text-ink"}`}>{value}</div>
    </div>
  );
}
