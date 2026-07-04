"use client";

import { useMemo } from "react";
import { MODELLI, getModello } from "@/lib/door/models";
import type { ConfigPorta, TipologiaPorta } from "@/lib/door/types";
import { TIPOLOGIA_LABEL } from "@/lib/door/types";
import { Card, NumberField, Segmented, Toggle } from "./ui";

export function ConfiguratoreForm({
  config,
  onChange,
}: {
  config: ConfigPorta;
  onChange: (c: ConfigPorta) => void;
}) {
  const modello = useMemo(() => getModello(config.modelloId), [config.modelloId]);
  const tipologieDisponibili = modello?.tipologie ?? [];
  const isScorrevole =
    config.tipologia === "scorrevole_scomparsa" || config.tipologia === "scorrevole_esterno";
  const conSopraluce = config.opzioni.sopraluce !== "nessuno";

  function setModello(id: string) {
    const m = getModello(id);
    if (!m) return;
    const tipologia = m.tipologie.includes(config.tipologia) ? config.tipologia : m.tipologie[0];
    onChange({
      ...config,
      modelloId: id,
      tipologia,
      opzioni: {
        ...config.opzioni,
        sopraluce: m.supportaSopraluce ? config.opzioni.sopraluce : "nessuno",
        vetro: m.supportaVetro ? config.opzioni.vetro : false,
        oblo: m.supportaOblo ? config.opzioni.oblo : false,
      },
    });
  }

  return (
    <div className="space-y-4">
      <Card title="1 · Commessa e modello">
        <div className="space-y-3">
          <label htmlFor="nome" className="block">
            <span className="mb-1 block text-sm text-muted">Riferimento commessa / cliente</span>
            <input
              id="nome"
              type="text"
              value={config.nome}
              onChange={(e) => onChange({ ...config, nome: e.target.value })}
              placeholder="Es. Rossi — camera matrimoniale"
              className="w-full rounded-xl border border-border bg-card-2 px-3 py-3 text-lg outline-none focus:border-primary"
            />
          </label>

          <fieldset>
            <legend className="mb-1 block text-sm text-muted">Modello porta</legend>
            <div className="space-y-2">
              {MODELLI.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  aria-pressed={config.modelloId === m.id}
                  onClick={() => setModello(m.id)}
                  className={`block w-full rounded-xl border px-3 py-2.5 text-left transition-colors ${
                    config.modelloId === m.id
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card-2 hover:border-muted"
                  }`}
                >
                  <span className="block text-sm font-semibold">{m.nome}</span>
                  <span className="block text-xs text-muted">{m.descrizione}</span>
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-1 block text-sm text-muted">Tipologia</legend>
            <div className="space-y-1.5">
              {tipologieDisponibili.map((t: TipologiaPorta) => (
                <button
                  key={t}
                  type="button"
                  aria-pressed={config.tipologia === t}
                  onClick={() => onChange({ ...config, tipologia: t })}
                  className={`block w-full rounded-xl border px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                    config.tipologia === t
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card-2 hover:border-muted"
                  }`}
                >
                  {TIPOLOGIA_LABEL[t]}
                </button>
              ))}
            </div>
          </fieldset>
        </div>
      </Card>

      <Card title="2 · Rilievo vano muro (foro grezzo)">
        <div className="grid grid-cols-2 gap-3">
          <NumberField
            id="vano-larghezza"
            label="Larghezza vano"
            value={config.vano.larghezza}
            min={400}
            max={3000}
            onChange={(v) => onChange({ ...config, vano: { ...config.vano, larghezza: v } })}
          />
          <NumberField
            id="vano-altezza"
            label="Altezza vano"
            value={config.vano.altezza}
            min={1500}
            max={3200}
            onChange={(v) => onChange({ ...config, vano: { ...config.vano, altezza: v } })}
          />
          <NumberField
            id="spessore-muro"
            label="Spessore muro"
            value={config.vano.spessoreMuro}
            min={60}
            max={600}
            onChange={(v) => onChange({ ...config, vano: { ...config.vano, spessoreMuro: v } })}
          />
        </div>
        <p className="mt-2 text-xs leading-relaxed text-muted">
          Misura da muro a muro in almeno 3 punti e inserisci il valore più piccolo. Altezza dal
          pavimento finito al sotto-architrave.
        </p>
      </Card>

      <Card title="3 · Verso di apertura">
        <div className="space-y-3">
          <Segmented
            label={isScorrevole ? "Lato di scorrimento dell'anta" : "Lato cerniere (dal lato di rilievo)"}
            options={[
              { value: "sinistra", label: "Sinistra" },
              { value: "destra", label: "Destra" },
            ]}
            value={config.latoCerniere}
            onChange={(v) => onChange({ ...config, latoCerniere: v })}
          />
          {!isScorrevole && (
            <>
              <Segmented
                label="Movimento dell'anta"
                options={[
                  { value: "spingere", label: "A spingere" },
                  { value: "tirare", label: "A tirare" },
                ]}
                value={config.verso}
                onChange={(v) => onChange({ ...config, verso: v })}
              />
              <p className="rounded-xl bg-card-2 p-3 text-xs leading-relaxed text-muted">
                Guarda la porta dal lato in cui si apre verso di te: cerniere a destra = porta{" "}
                <strong className="text-foreground">DESTRA</strong>, cerniere a sinistra = porta{" "}
                <strong className="text-foreground">SINISTRA</strong>. La maniglia va sul lato opposto
                alle cerniere: la calcoliamo noi.
              </p>
            </>
          )}
        </div>
      </Card>

      <Card title="4 · Composizione e dotazioni">
        <div className="space-y-2.5">
          {config.tipologia === "doppia_battente" && (
            <Segmented
              label="Ripartizione delle due ante"
              options={[
                { value: "simmetrica", label: "Simmetrica ½ + ½" },
                { value: "asimmetrica", label: "Asimmetrica ⅔ + ⅓" },
              ]}
              value={config.opzioni.ripartizioneAnte}
              onChange={(v) =>
                onChange({ ...config, opzioni: { ...config.opzioni, ripartizioneAnte: v } })
              }
            />
          )}

          {config.tipologia === "battente_fisso" && (
            <>
              <Segmented
                label="Lato del fianco fisso"
                options={[
                  { value: "sinistra", label: "Sinistra" },
                  { value: "destra", label: "Destra" },
                ]}
                value={config.opzioni.latoFisso}
                onChange={(v) => onChange({ ...config, opzioni: { ...config.opzioni, latoFisso: v } })}
              />
              <NumberField
                id="larghezza-fisso"
                label="Larghezza fianco fisso (0 = automatica, ⅓ del vano)"
                value={config.opzioni.larghezzaFisso}
                min={0}
                max={1500}
                onChange={(v) =>
                  onChange({ ...config, opzioni: { ...config.opzioni, larghezzaFisso: v } })
                }
              />
            </>
          )}

          <Toggle
            label="Sopraluce"
            hint={modello?.supportaSopraluce ? "Pannello fisso sopra la porta" : "Non disponibile per questo modello"}
            disabled={!modello?.supportaSopraluce}
            checked={conSopraluce}
            onChange={(v) =>
              onChange({
                ...config,
                opzioni: {
                  ...config.opzioni,
                  sopraluce: v ? "vetrato" : "nessuno",
                  altezzaSopraluce: v ? Math.max(config.opzioni.altezzaSopraluce, 300) : 0,
                },
              })
            }
          />
          {conSopraluce && (
            <div className="grid grid-cols-2 items-end gap-3 pl-1">
              <Segmented
                label="Tipo sopraluce"
                options={[
                  { value: "vetrato", label: "Vetrato" },
                  { value: "cieco", label: "Cieco" },
                ]}
                value={config.opzioni.sopraluce === "cieco" ? "cieco" : "vetrato"}
                onChange={(v) => onChange({ ...config, opzioni: { ...config.opzioni, sopraluce: v } })}
              />
              <NumberField
                id="altezza-sopraluce"
                label="Altezza sopraluce"
                value={config.opzioni.altezzaSopraluce}
                min={150}
                max={1200}
                onChange={(v) =>
                  onChange({ ...config, opzioni: { ...config.opzioni, altezzaSopraluce: v } })
                }
              />
            </div>
          )}

          <Toggle
            label="Specchiatura vetrata"
            hint={modello?.supportaVetro ? "Vetro nell'anta" : "Non disponibile per questo modello"}
            disabled={!modello?.supportaVetro}
            checked={config.opzioni.vetro}
            onChange={(v) => onChange({ ...config, opzioni: { ...config.opzioni, vetro: v } })}
          />
          <Toggle
            label="Oblò"
            hint={modello?.supportaOblo ? "Vetro ovale nell'anta" : "Non disponibile per questo modello"}
            disabled={!modello?.supportaOblo}
            checked={config.opzioni.oblo}
            onChange={(v) => onChange({ ...config, opzioni: { ...config.opzioni, oblo: v } })}
          />
        </div>
      </Card>
    </div>
  );
}
