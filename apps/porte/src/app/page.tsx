"use client";

import { useMemo, useState, type ReactNode } from "react";
import { calcolaPorta } from "@/lib/door/engine";
import { DoorScheme } from "@/components/door-scheme";
import {
  LABEL_OBLO,
  LABEL_TIPO_APERTURA,
  LABEL_VERSO,
  PRESET_FORO,
  PRESET_SPESSORE_MURO,
  formattaCm,
} from "@/lib/door/labels";
import {
  FORME_OBLO,
  PARAMETRI_DEFAULT,
  TIPI_APERTURA,
  VERSI_APERTURA,
  type FormaOblo,
  type InputPorta,
  type Lato,
  type TipoApertura,
  type VersoApertura,
} from "@/lib/door/types";

const STATO_INIZIALE: InputPorta = {
  riferimentoCommessa: "",
  modello: "",
  foroLarghezzaMm: 900,
  foroAltezzaMm: 2150,
  spessoreMuroMm: 105,
  tipoApertura: "battente",
  latoCerniere: "sinistra",
  versoApertura: "tiro",
  opzioni: {
    antaFissa: false,
    larghezzaAntaFissaMm: 400,
    sopraluce: false,
    altezzaSopraluceMm: 400,
    vetro: false,
    oblo: "nessuno",
    obloLarghezzaMm: 300,
    obloAltezzaMm: 450,
  },
};

export default function Home() {
  const [input, setInput] = useState<InputPorta>(STATO_INIZIALE);
  const [copiato, setCopiato] = useState(false);

  const risultato = useMemo(() => calcolaPorta(input), [input]);

  function set<K extends keyof InputPorta>(chiave: K, valore: InputPorta[K]) {
    setInput((prev) => ({ ...prev, [chiave]: valore }));
  }
  function setOpz<K extends keyof InputPorta["opzioni"]>(
    chiave: K,
    valore: InputPorta["opzioni"][K],
  ) {
    setInput((prev) => ({ ...prev, opzioni: { ...prev.opzioni, [chiave]: valore } }));
  }

  const scheda = useMemo(() => buildScheda(input, risultato), [input, risultato]);

  async function copiaScheda() {
    try {
      await navigator.clipboard.writeText(scheda);
      setCopiato(true);
      setTimeout(() => setCopiato(false), 1800);
    } catch {
      setCopiato(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 pt-5 sm:px-6">
      <header className="mb-5 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--primary)] text-lg font-bold text-black">
          P
        </div>
        <div>
          <h1 className="text-lg font-semibold leading-tight sm:text-xl">PortaPro</h1>
          <p className="text-xs text-[var(--muted)]">
            Dal foro muro alla porta pronta per la produzione
          </p>
        </div>
      </header>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* ---------------- FORM ---------------- */}
        <div className="no-print space-y-4">
          <Card title="1 · Commessa e modello">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Riferimento">
                <input
                  className={inputCls}
                  placeholder="Es. Rossi — camera"
                  value={input.riferimentoCommessa ?? ""}
                  onChange={(e) => set("riferimentoCommessa", e.target.value)}
                />
              </Field>
              <Field label="Modello porta">
                <input
                  className={inputCls}
                  placeholder="Es. Liscia laccata"
                  value={input.modello ?? ""}
                  onChange={(e) => set("modello", e.target.value)}
                />
              </Field>
            </div>
            <Field label="Sistema di apertura">
              <Segmented<TipoApertura>
                options={TIPI_APERTURA.map((t) => ({ value: t, label: LABEL_TIPO_APERTURA[t] }))}
                value={input.tipoApertura}
                onChange={(v) => set("tipoApertura", v)}
              />
            </Field>
          </Card>

          <Card title="2 · Foro muro (vano)">
            <div className="mb-3 flex flex-wrap gap-2">
              {PRESET_FORO.map((p) => (
                <button
                  key={p.etichetta}
                  type="button"
                  className={chipCls}
                  onClick={() => {
                    set("foroLarghezzaMm", p.larghezzaMm);
                    set("foroAltezzaMm", p.altezzaMm);
                  }}
                >
                  {p.etichetta}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <NumberField
                label="Larghezza foro"
                value={input.foroLarghezzaMm}
                onChange={(v) => set("foroLarghezzaMm", v)}
              />
              <NumberField
                label="Altezza foro"
                value={input.foroAltezzaMm}
                onChange={(v) => set("foroAltezzaMm", v)}
              />
            </div>
            <Field label="Spessore muro">
              <div className="mb-2 flex flex-wrap gap-2">
                {PRESET_SPESSORE_MURO.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`${chipCls} ${input.spessoreMuroMm === s ? chipActive : ""}`}
                    onClick={() => set("spessoreMuroMm", s)}
                  >
                    {formattaCm(s)} cm
                  </button>
                ))}
              </div>
              <NumberFieldBare
                value={input.spessoreMuroMm}
                onChange={(v) => set("spessoreMuroMm", v)}
              />
            </Field>
          </Card>

          <Card title="3 · Verso e maniglia">
            <Field label="Lato cerniere (guardando dal lato di apertura)">
              <Segmented<Lato>
                options={[
                  { value: "sinistra", label: "◧ Sinistra (DIN SX)" },
                  { value: "destra", label: "Destra (DIN DX) ◨" },
                ]}
                value={input.latoCerniere}
                onChange={(v) => set("latoCerniere", v)}
              />
            </Field>
            <Field label="Verso di apertura">
              <Segmented<VersoApertura>
                options={VERSI_APERTURA.map((v) => ({ value: v, label: LABEL_VERSO[v] }))}
                value={input.versoApertura}
                onChange={(v) => set("versoApertura", v)}
              />
            </Field>
            <p className="rounded-lg bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--foreground)]">
              → <strong>{risultato.din}</strong> · maniglia a{" "}
              <strong>{risultato.latoManiglia}</strong> ·{" "}
              {LABEL_VERSO[input.versoApertura].toLowerCase()}
            </p>
          </Card>

          <Card title="4 · Opzioni modello">
            <Toggle
              label="Anta fissa laterale"
              checked={input.opzioni.antaFissa}
              onChange={(v) => setOpz("antaFissa", v)}
            />
            {input.opzioni.antaFissa && (
              <NumberField
                label="Luce anta fissa"
                value={input.opzioni.larghezzaAntaFissaMm ?? 400}
                onChange={(v) => setOpz("larghezzaAntaFissaMm", v)}
              />
            )}

            <Toggle
              label="Sopraluce (pannello/vetro superiore)"
              checked={input.opzioni.sopraluce}
              onChange={(v) => setOpz("sopraluce", v)}
            />
            {input.opzioni.sopraluce && (
              <NumberField
                label="Altezza sopraluce"
                value={input.opzioni.altezzaSopraluceMm ?? 400}
                onChange={(v) => setOpz("altezzaSopraluceMm", v)}
              />
            )}

            <Toggle
              label="Specchiatura vetrata sull'anta"
              checked={input.opzioni.vetro}
              onChange={(v) => setOpz("vetro", v)}
            />

            <Field label="Oblò">
              <Segmented<FormaOblo>
                options={FORME_OBLO.map((f) => ({ value: f, label: LABEL_OBLO[f] }))}
                value={input.opzioni.oblo}
                onChange={(v) => setOpz("oblo", v)}
              />
            </Field>
            {input.opzioni.oblo !== "nessuno" && (
              <div className="grid grid-cols-2 gap-3">
                <NumberField
                  label="Larghezza oblò"
                  value={input.opzioni.obloLarghezzaMm ?? 300}
                  onChange={(v) => setOpz("obloLarghezzaMm", v)}
                />
                {input.opzioni.oblo !== "tondo" && (
                  <NumberField
                    label="Altezza oblò"
                    value={input.opzioni.obloAltezzaMm ?? 450}
                    onChange={(v) => setOpz("obloAltezzaMm", v)}
                  />
                )}
              </div>
            )}
          </Card>

          <details className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
            <summary className="cursor-pointer text-sm font-medium text-[var(--muted)]">
              Parametri avanzati (giochi e spessori)
            </summary>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <NumberField
                label="Gioco muratura/lato"
                value={input.parametri?.giocoMuraturaLatoMm ?? PARAMETRI_DEFAULT.giocoMuraturaLatoMm}
                onChange={(v) => set("parametri", { ...input.parametri, giocoMuraturaLatoMm: v })}
              />
              <NumberField
                label="Spessore telaio"
                value={input.parametri?.spessoreTelaioMm ?? PARAMETRI_DEFAULT.spessoreTelaioMm}
                onChange={(v) => set("parametri", { ...input.parametri, spessoreTelaioMm: v })}
              />
              <NumberField
                label="Battuta telaio"
                value={input.parametri?.battutaTelaioMm ?? PARAMETRI_DEFAULT.battutaTelaioMm}
                onChange={(v) => set("parametri", { ...input.parametri, battutaTelaioMm: v })}
              />
              <NumberField
                label="Gioco anta/telaio"
                value={input.parametri?.giocoAntaTelaioMm ?? PARAMETRI_DEFAULT.giocoAntaTelaioMm}
                onChange={(v) => set("parametri", { ...input.parametri, giocoAntaTelaioMm: v })}
              />
            </div>
          </details>
        </div>

        {/* ---------------- RISULTATO ---------------- */}
        <div className="lg:sticky lg:top-4 lg:self-start">
          <div className="print-area space-y-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
            <div className="flex items-baseline justify-between">
              <h2 className="text-base font-semibold">Schema porta</h2>
              <span className="rounded-full bg-[var(--surface-2)] px-3 py-1 text-xs font-medium text-[var(--accent)]">
                {LABEL_TIPO_APERTURA[input.tipoApertura]}
              </span>
            </div>

            <div className="rounded-lg bg-[var(--surface-2)] p-2">
              <DoorScheme risultato={risultato} />
            </div>

            <p className="text-center text-sm font-medium text-[var(--primary-strong)]">
              {risultato.descrizioneApertura}
            </p>

            <Distinta risultato={risultato} />

            {risultato.avvisi.length > 0 && (
              <ul className="space-y-1 rounded-lg border border-[var(--accent)]/40 bg-[var(--accent)]/10 p-3 text-xs text-[var(--accent)]">
                {risultato.avvisi.map((a, i) => (
                  <li key={i}>⚠ {a}</li>
                ))}
              </ul>
            )}
          </div>

          <div className="no-print mt-3 flex gap-3">
            <button type="button" onClick={() => window.print()} className={btnPrimary}>
              Esporta / Stampa PDF
            </button>
            <button type="button" onClick={copiaScheda} className={btnSecondary}>
              {copiato ? "Copiato ✓" : "Copia scheda"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Distinta({ risultato }: { risultato: ReturnType<typeof calcolaPorta> }) {
  const righe: { label: string; l: number; h: number }[] = [
    { label: "Foro muro", l: risultato.foro.larghezzaMm, h: risultato.foro.altezzaMm },
    { label: "Controtelaio", l: risultato.controtelaio.larghezzaMm, h: risultato.controtelaio.altezzaMm },
    { label: "Telaio esterno", l: risultato.telaioEsterno.larghezzaMm, h: risultato.telaioEsterno.altezzaMm },
    { label: "Luce passaggio", l: risultato.lucePassaggio.larghezzaMm, h: risultato.lucePassaggio.altezzaMm },
    { label: "Anta", l: risultato.anta.larghezzaMm, h: risultato.anta.altezzaMm },
  ];
  if (risultato.antaFissa) righe.push({ label: "Anta fissa", l: risultato.antaFissa.larghezzaMm, h: risultato.antaFissa.altezzaMm });
  if (risultato.sopraluce) righe.push({ label: "Sopraluce", l: risultato.sopraluce.larghezzaMm, h: risultato.sopraluce.altezzaMm });

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left text-xs text-[var(--muted)]">
          <th className="pb-1 font-medium">Componente</th>
          <th className="pb-1 text-right font-medium">Largh. (mm)</th>
          <th className="pb-1 text-right font-medium">Alt. (mm)</th>
        </tr>
      </thead>
      <tbody>
        {righe.map((r) => (
          <tr key={r.label} className="border-t border-[var(--border)]">
            <td className="py-1.5">{r.label}</td>
            <td className="py-1.5 text-right font-mono">{r.l}</td>
            <td className="py-1.5 text-right font-mono">{r.h}</td>
          </tr>
        ))}
        <tr className="border-t border-[var(--border)]">
          <td className="py-1.5">Spessore muro / telaio</td>
          <td className="py-1.5 text-right font-mono" colSpan={2}>
            {risultato.spessoreTelaioMuroMm} mm
          </td>
        </tr>
        <tr className="border-t border-[var(--border)]">
          <td className="py-1.5">Misura standard vicina</td>
          <td className="py-1.5 text-right font-mono" colSpan={2}>
            {risultato.misuraStandardVicina.etichetta} cm{risultato.fuoriMisura ? " (fuori misura)" : ""}
          </td>
        </tr>
      </tbody>
    </table>
  );
}

/* ---------------- UI helpers ---------------- */

const inputCls =
  "w-full rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2.5 text-base outline-none focus:border-[var(--primary-strong)]";
const chipCls =
  "rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-1.5 text-sm hover:border-[var(--primary-strong)]";
const chipActive = "border-[var(--primary-strong)] text-[var(--primary-strong)]";
const btnPrimary =
  "flex-1 rounded-lg bg-[var(--primary)] px-4 py-3 text-center text-sm font-semibold text-black hover:bg-[var(--primary-strong)]";
const btnSecondary =
  "flex-1 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-center text-sm font-semibold hover:border-[var(--primary-strong)]";

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
      <h2 className="mb-3 text-sm font-semibold text-[var(--muted)]">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm text-[var(--muted)]">{label}</span>
      {children}
    </label>
  );
}

function NumberFieldBare({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="relative">
      <input
        type="number"
        inputMode="numeric"
        className={`${inputCls} pr-16`}
        value={Number.isFinite(value) ? value : ""}
        onChange={(e) => onChange(Math.round(Number(e.target.value)))}
      />
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--muted)]">
        {Number.isFinite(value) ? `${formattaCm(value)} cm` : "mm"}
      </span>
    </div>
  );
}

function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <Field label={label}>
      <NumberFieldBare value={value} onChange={onChange} />
    </Field>
  );
}

function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2" role="group">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={value === o.value}
          onClick={() => onChange(o.value)}
          className={`flex-1 whitespace-nowrap rounded-lg border px-3 py-2.5 text-sm font-medium ${
            value === o.value
              ? "border-[var(--primary-strong)] bg-[var(--primary)] text-black"
              : "border-[var(--border)] bg-[var(--surface-2)] text-[var(--foreground)]"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2.5 text-left text-sm"
    >
      <span>{label}</span>
      <span
        className={`relative h-6 w-11 rounded-full transition-colors ${
          checked ? "bg-[var(--primary)]" : "bg-[var(--border)]"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${
            checked ? "left-[22px]" : "left-0.5"
          }`}
        />
      </span>
    </button>
  );
}

function buildScheda(input: InputPorta, r: ReturnType<typeof calcolaPorta>): string {
  const l = (n: number) => n.toString();
  const linee = [
    "PortaPro — Scheda di produzione",
    input.riferimentoCommessa ? `Commessa: ${input.riferimentoCommessa}` : null,
    input.modello ? `Modello: ${input.modello}` : null,
    `Sistema: ${LABEL_TIPO_APERTURA[input.tipoApertura]}`,
    "",
    "— MISURE (mm) —",
    `Foro muro:      ${l(r.foro.larghezzaMm)} x ${l(r.foro.altezzaMm)}`,
    `Controtelaio:   ${l(r.controtelaio.larghezzaMm)} x ${l(r.controtelaio.altezzaMm)}`,
    `Telaio esterno: ${l(r.telaioEsterno.larghezzaMm)} x ${l(r.telaioEsterno.altezzaMm)}`,
    `Luce passaggio: ${l(r.lucePassaggio.larghezzaMm)} x ${l(r.lucePassaggio.altezzaMm)}`,
    `Anta:           ${l(r.anta.larghezzaMm)} x ${l(r.anta.altezzaMm)}`,
    r.antaFissa ? `Anta fissa:     ${l(r.antaFissa.larghezzaMm)} x ${l(r.antaFissa.altezzaMm)}` : null,
    r.sopraluce ? `Sopraluce:      ${l(r.sopraluce.larghezzaMm)} x ${l(r.sopraluce.altezzaMm)}` : null,
    `Spessore muro:  ${l(r.spessoreTelaioMuroMm)}`,
    "",
    "— APERTURA —",
    r.descrizioneApertura,
    "",
    "— OPZIONI —",
    `Vetro: ${input.opzioni.vetro ? "sì" : "no"} | Oblò: ${LABEL_OBLO[input.opzioni.oblo]}${
      input.opzioni.oblo !== "nessuno" ? ` ${input.opzioni.obloLarghezzaMm}x${input.opzioni.obloAltezzaMm}` : ""
    }`,
    `Misura standard vicina: ${r.misuraStandardVicina.etichetta} cm${r.fuoriMisura ? " (fuori misura)" : ""}`,
    r.avvisi.length ? "\n— NOTE —\n" + r.avvisi.map((a) => `- ${a}`).join("\n") : null,
  ];
  return linee.filter((x) => x !== null).join("\n");
}
