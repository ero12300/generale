"use client";

import * as React from "react";
import { Segmented } from "@/components/ui/segmented";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  ALTEZZE_SOPRALUCE,
  LARGHEZZE_FISSO,
  SPESSORI_MURO,
  TIPOLOGIE,
} from "@/lib/porte/presets";
import type {
  ConfigurazionePorta,
  FormaOblo,
  LatoCerniere,
  LatoFisso,
  ManovraApertura,
  Tipologia,
} from "@/lib/porte/types";

interface ConfigFormProps {
  value: ConfigurazionePorta;
  onChange: (next: ConfigurazionePorta) => void;
}

/**
 * Form mobile-first di configurazione porta.
 * Suddiviso in sezioni con progressive disclosure. Nessun click "avanti":
 * la scheda tecnica si aggiorna in tempo reale.
 */
export function ConfigForm({ value, onChange }: ConfigFormProps) {
  const set = <K extends keyof ConfigurazionePorta>(
    key: K,
    v: ConfigurazionePorta[K]
  ) => onChange({ ...value, [key]: v });

  const setForo = (patch: Partial<ConfigurazionePorta["foroMuro"]>) =>
    onChange({ ...value, foroMuro: { ...value.foroMuro, ...patch } });

  const setOpz = (patch: Partial<ConfigurazionePorta["opzioni"]>) =>
    onChange({ ...value, opzioni: { ...value.opzioni, ...patch } });

  return (
    <div className="space-y-6">
      <Section title="1 · Riferimento commessa" description="Codice interno per identificare la porta">
        <Input
          type="text"
          placeholder="Es. RIF-2026-014"
          value={value.riferimento ?? ""}
          onChange={(e) => set("riferimento", e.target.value)}
          aria-label="Riferimento commessa"
        />
      </Section>

      <Section
        title="2 · Tipologia porta"
        description="Come si apre la porta rispetto al muro"
      >
        <Segmented<Tipologia>
          ariaLabel="Tipologia porta"
          value={value.tipologia}
          onChange={(v) => set("tipologia", v)}
          options={TIPOLOGIE}
        />
      </Section>

      <Section
        title="3 · Foro muro (vano grezzo)"
        description="Misure dell'apertura nel muro, prima dell'installazione"
      >
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="foro-l">Larghezza (mm)</Label>
            <Input
              id="foro-l"
              type="number"
              inputMode="numeric"
              min={400}
              max={3000}
              step={10}
              value={value.foroMuro.larghezza}
              onChange={(e) =>
                setForo({ larghezza: Number(e.target.value) || 0 })
              }
            />
          </div>
          <div>
            <Label htmlFor="foro-h">Altezza (mm)</Label>
            <Input
              id="foro-h"
              type="number"
              inputMode="numeric"
              min={1500}
              max={3500}
              step={10}
              value={value.foroMuro.altezza}
              onChange={(e) => setForo({ altezza: Number(e.target.value) || 0 })}
            />
          </div>
        </div>

        <div className="mt-3">
          <Label htmlFor="spessore">Spessore muro finito (mm)</Label>
          <select
            id="spessore"
            className="w-full h-12 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60"
            value={value.foroMuro.spessoreMuro}
            onChange={(e) =>
              setForo({ spessoreMuro: Number(e.target.value) })
            }
          >
            {SPESSORI_MURO.map((s) => (
              <option key={s} value={s}>
                {s} mm
              </option>
            ))}
          </select>
        </div>
      </Section>

      <Section
        title="4 · Verso di apertura"
        description="Da che lato sono le cerniere e come si manovra"
      >
        <div>
          <Label>Cerniere</Label>
          <Segmented<LatoCerniere>
            ariaLabel="Lato cerniere"
            value={value.latoCerniere}
            onChange={(v) => set("latoCerniere", v)}
            options={[
              { value: "sx", label: "Sinistra (SX)", hint: "Cerniere a sinistra" },
              { value: "dx", label: "Destra (DX)", hint: "Cerniere a destra" },
            ]}
          />
        </div>
        <div className="mt-4">
          <Label>Manovra</Label>
          <Segmented<ManovraApertura>
            ariaLabel="Manovra"
            value={value.manovra}
            onChange={(v) => set("manovra", v)}
            options={[
              { value: "spingere", label: "Spingere", hint: "Porta si apre spingendo" },
              { value: "tirare", label: "Tirare", hint: "Porta si apre tirando" },
            ]}
          />
        </div>
        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
          Convenzione DIN: guarda la porta dal lato dove vedi le cerniere. La
          maniglia sarà sul lato opposto.
        </p>
      </Section>

      <Section
        title="5 · Opzioni porta"
        description="Elementi extra della porta"
      >
        <ToggleRow
          label="Controtelaio incluso"
          hint="Falso telaio da murare (obbligatorio per porte a scomparsa)"
          checked={value.opzioni.conControtelaio}
          onChange={(v) => setOpz({ conControtelaio: v })}
          disabled={value.tipologia === "scorrevole_scomparsa"}
        />

        <ToggleRow
          label="Sopraluce (finestra sopra)"
          hint="Vetro fisso sopra la porta per passaggio luce"
          checked={value.opzioni.sopraluce.presente}
          onChange={(v) =>
            setOpz({
              sopraluce: v
                ? { presente: true, altezza: ALTEZZE_SOPRALUCE[1] }
                : { presente: false },
            })
          }
        />
        {value.opzioni.sopraluce.presente && (
          <div className="ml-2 mt-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <Label htmlFor="sopraluce-h">Altezza sopraluce (mm)</Label>
            <select
              id="sopraluce-h"
              className="w-full h-11 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 mt-1"
              value={value.opzioni.sopraluce.altezza}
              onChange={(e) =>
                setOpz({
                  sopraluce: { presente: true, altezza: Number(e.target.value) },
                })
              }
            >
              {ALTEZZE_SOPRALUCE.map((h) => (
                <option key={h} value={h}>
                  {h} mm
                </option>
              ))}
            </select>
          </div>
        )}

        <ToggleRow
          label="Fisso laterale"
          hint="Elemento vetrato fisso a fianco della porta"
          checked={value.opzioni.fissoLaterale.presente}
          onChange={(v) =>
            setOpz({
              fissoLaterale: v
                ? { presente: true, lato: "dx", larghezza: LARGHEZZE_FISSO[1] }
                : { presente: false },
            })
          }
        />
        {value.opzioni.fissoLaterale.presente && (
          <div className="ml-2 mt-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
            <div>
              <Label>Lato</Label>
              <Segmented<LatoFisso>
                ariaLabel="Lato fisso"
                value={value.opzioni.fissoLaterale.lato}
                onChange={(v) =>
                  setOpz({
                    fissoLaterale: value.opzioni.fissoLaterale.presente
                      ? { ...value.opzioni.fissoLaterale, lato: v }
                      : { presente: false },
                  })
                }
                options={[
                  { value: "sx", label: "SX" },
                  { value: "dx", label: "DX" },
                  { value: "entrambi", label: "Entrambi" },
                ]}
              />
            </div>
            <div>
              <Label htmlFor="fisso-l">Larghezza (mm)</Label>
              <select
                id="fisso-l"
                className="w-full h-11 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3"
                value={value.opzioni.fissoLaterale.larghezza}
                onChange={(e) =>
                  setOpz({
                    fissoLaterale: value.opzioni.fissoLaterale.presente
                      ? {
                          ...value.opzioni.fissoLaterale,
                          larghezza: Number(e.target.value),
                        }
                      : { presente: false },
                  })
                }
              >
                {LARGHEZZE_FISSO.map((w) => (
                  <option key={w} value={w}>
                    {w} mm
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        <ToggleRow
          label="Oblò sull'anta"
          hint="Finestrella tonda o ovale sulla porta"
          checked={value.opzioni.oblo.presente}
          onChange={(v) =>
            setOpz({
              oblo: v ? { presente: true, forma: "tondo" } : { presente: false },
            })
          }
        />
        {value.opzioni.oblo.presente && (
          <div className="ml-2 mt-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <Label>Forma</Label>
            <Segmented<FormaOblo>
              ariaLabel="Forma oblò"
              value={value.opzioni.oblo.forma}
              onChange={(v) =>
                setOpz({
                  oblo: value.opzioni.oblo.presente
                    ? { presente: true, forma: v }
                    : { presente: false },
                })
              }
              options={[
                { value: "tondo", label: "Tondo", hint: "Ø 250 mm" },
                { value: "ovale", label: "Ovale", hint: "350×200 mm" },
              ]}
            />
          </div>
        )}
      </Section>

      <Section title="6 · Note (facoltative)" description="Indicazioni per la produzione">
        <textarea
          className="w-full min-h-[80px] rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60"
          placeholder="Es. finitura laccato bianco RAL 9010, maniglia satinata..."
          value={value.note ?? ""}
          onChange={(e) => set("note", e.target.value)}
        />
      </Section>
    </div>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4 shadow-sm">
      <h2 className="text-base font-bold text-slate-900 dark:text-white">
        {title}
      </h2>
      {description && (
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 mb-3">
          {description}
        </p>
      )}
      {children}
    </section>
  );
}

function ToggleRow({
  label,
  hint,
  checked,
  onChange,
  disabled,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <label
      className={`flex items-start justify-between gap-3 py-2.5 ${
        disabled ? "opacity-60" : ""
      }`}
    >
      <span className="flex-1">
        <span className="block text-sm font-medium text-slate-800 dark:text-slate-100">
          {label}
        </span>
        {hint && (
          <span className="block text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {hint}
          </span>
        )}
      </span>
      <Switch checked={checked} onChange={onChange} disabled={disabled} ariaLabel={label} />
    </label>
  );
}
