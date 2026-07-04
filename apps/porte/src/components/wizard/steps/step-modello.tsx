"use client";

import { DoorClosed, DoorOpen } from "lucide-react";
import type { ConfigurazionePorta, TipologiaApertura } from "@/lib/door-engine";
import { Label } from "@/components/ui/label";
import { Segmented } from "@/components/ui/segmented";
import { Input } from "@/components/ui/input";

interface Props {
  config: ConfigurazionePorta;
  onChange: (c: ConfigurazionePorta) => void;
}

const MODELLI = [
  "Liscia",
  "Bugnata classica",
  "Bugnata moderna",
  "Pantografata",
  "Filo muro",
  "Vetrata",
];

export function StepModello({ config, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div className="card p-5">
        <div className="mb-3">
          <Label>Tipologia apertura</Label>
        </div>
        <Segmented<TipologiaApertura>
          value={config.tipologia}
          onChange={(v) => onChange({ ...config, tipologia: v })}
          columns={2}
          size="large"
          ariaLabel="Tipologia apertura"
          options={[
            {
              value: "battente-singola",
              label: "Singola anta",
              description: "1 anta a battente",
              icon: <DoorClosed className="h-5 w-5" />,
            },
            {
              value: "battente-doppia",
              label: "Doppia anta",
              description: "2 ante simmetriche",
              icon: <DoorOpen className="h-5 w-5" />,
            },
          ]}
        />
      </div>

      <div className="card p-5">
        <div className="mb-3">
          <Label>Modello estetico</Label>
        </div>
        <Segmented<string>
          value={config.modello}
          onChange={(v) => onChange({ ...config, modello: v })}
          columns={2}
          ariaLabel="Modello estetico"
          options={MODELLI.map((m) => ({ value: m, label: m }))}
        />

        <div className="mt-4 space-y-2">
          <Label htmlFor="modello-custom">Modello personalizzato (opzionale)</Label>
          <Input
            id="modello-custom"
            placeholder="Es. Firenze / Barocca / Su misura cliente Rossi"
            value={MODELLI.includes(config.modello) ? "" : config.modello}
            onChange={(e) =>
              onChange({
                ...config,
                modello: e.target.value.trim().length > 0 ? e.target.value : "Liscia",
              })
            }
          />
        </div>
      </div>
    </div>
  );
}
