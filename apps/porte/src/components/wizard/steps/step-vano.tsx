"use client";

import { Ruler } from "lucide-react";
import type { ConfigurazionePorta } from "@/lib/door-engine";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Segmented } from "@/components/ui/segmented";

interface Props {
  config: ConfigurazionePorta;
  onChange: (c: ConfigurazionePorta) => void;
}

export function StepVano({ config, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div className="card p-5">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-wood/10 text-wood">
            <Ruler className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-semibold text-ink">Dimensioni del vano murario</div>
            <div className="text-xs text-ink-muted">Misura l&apos;apertura grezza del muro in millimetri</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="vano-larghezza">Larghezza (mm)</Label>
            <Input
              id="vano-larghezza"
              type="number"
              inputMode="numeric"
              min={400}
              max={3000}
              value={config.vano.larghezzaMm}
              onChange={(e) =>
                onChange({
                  ...config,
                  vano: { ...config.vano, larghezzaMm: Number(e.target.value) || 0 },
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vano-altezza">Altezza (mm)</Label>
            <Input
              id="vano-altezza"
              type="number"
              inputMode="numeric"
              min={1500}
              max={3200}
              value={config.vano.altezzaMm}
              onChange={(e) =>
                onChange({
                  ...config,
                  vano: { ...config.vano, altezzaMm: Number(e.target.value) || 0 },
                })
              }
            />
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <Label htmlFor="spessore">Spessore parete finita (mm)</Label>
          <Segmented<string>
            value={String(config.vano.spessoreParereMm)}
            onChange={(v) =>
              onChange({
                ...config,
                vano: { ...config.vano, spessoreParereMm: Number(v) },
              })
            }
            columns={4}
            options={[
              { value: "80", label: "80" },
              { value: "105", label: "105" },
              { value: "125", label: "125" },
              { value: "150", label: "150" },
            ]}
            ariaLabel="Spessore parete"
          />
          <Input
            id="spessore"
            type="number"
            inputMode="numeric"
            min={70}
            max={300}
            value={config.vano.spessoreParereMm}
            onChange={(e) =>
              onChange({
                ...config,
                vano: { ...config.vano, spessoreParereMm: Number(e.target.value) || 0 },
              })
            }
          />
          <p className="text-xs text-ink-muted">
            80 mm cartongesso · 105 mm laterizio con intonaco · 125–150 mm muri portanti
          </p>
        </div>
      </div>

      <div className="card-muted p-4 text-xs text-ink-soft">
        <strong className="text-ink">Come misurare:</strong> larghezza e altezza del vano
        murario in <em>tre punti</em> (basso, centro, alto). Usa sempre la misura più
        piccola. Considera parete finita — intonaco o cartongesso già in opera.
      </div>
    </div>
  );
}
