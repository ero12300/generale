"use client";

import type { ConfigurazionePorta, Mano, Verso } from "@/lib/door-engine";
import { calcolaPorta, siglaManoVerso, descrizioneManoVerso } from "@/lib/door-engine";
import { Label } from "@/components/ui/label";
import { Segmented } from "@/components/ui/segmented";
import { DoorSchema } from "@/components/door-schema";

interface Props {
  config: ConfigurazionePorta;
  onChange: (c: ConfigurazionePorta) => void;
}

export function StepApertura({ config, onChange }: Props) {
  const calcolo = calcolaPorta(config);

  return (
    <div className="space-y-6">
      <div className="card p-5">
        <div className="mb-3">
          <Label>Mano — su che lato sono le cerniere?</Label>
        </div>
        <Segmented<Mano>
          value={config.mano}
          onChange={(v) => onChange({ ...config, mano: v })}
          columns={2}
          size="large"
          options={[
            {
              value: "sinistra",
              label: "Sinistra",
              description: "Cerniere a sinistra · Maniglia a destra",
            },
            {
              value: "destra",
              label: "Destra",
              description: "Cerniere a destra · Maniglia a sinistra",
            },
          ]}
          ariaLabel="Mano cerniere"
        />
      </div>

      <div className="card p-5">
        <div className="mb-3">
          <Label>Verso di apertura</Label>
        </div>
        <Segmented<Verso>
          value={config.verso}
          onChange={(v) => onChange({ ...config, verso: v })}
          columns={2}
          size="large"
          options={[
            {
              value: "tirare",
              label: "Tirare",
              description: "Apre verso l'osservatore",
            },
            {
              value: "spingere",
              label: "Spingere",
              description: "Apre lontano dall'osservatore",
            },
          ]}
          ariaLabel="Verso di apertura"
        />
      </div>

      <div className="card p-5">
        <div className="mb-2 text-xs font-medium uppercase tracking-wider text-ink-muted">
          Sigla UNI EN 12519
        </div>
        <div className="flex items-baseline gap-3">
          <div className="font-display text-4xl font-bold text-wood">
            {siglaManoVerso(config.mano, config.verso)}
          </div>
          <div className="text-sm text-ink-soft">{descrizioneManoVerso(config.mano, config.verso)}</div>
        </div>
      </div>

      <div className="card overflow-hidden p-3">
        <div className="mb-2 px-2 text-xs font-medium uppercase tracking-wider text-ink-muted">
          Anteprima
        </div>
        <div className="aspect-[3/4] w-full">
          <DoorSchema
            config={config}
            calcolo={calcolo}
            className="h-full w-full"
            showQuote={false}
          />
        </div>
      </div>
    </div>
  );
}
