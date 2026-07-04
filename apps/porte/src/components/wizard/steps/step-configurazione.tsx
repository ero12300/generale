"use client";

import { Columns3, PanelTop, Frame, Egg } from "lucide-react";
import type { ConfigurazionePorta, FormaSpecchiatura } from "@/lib/door-engine";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Segmented } from "@/components/ui/segmented";
import { ToggleRow } from "@/components/ui/toggle-row";

interface Props {
  config: ConfigurazionePorta;
  onChange: (c: ConfigurazionePorta) => void;
}

export function StepConfigurazione({ config, onChange }: Props) {
  return (
    <div className="space-y-4">
      {/* Fisso laterale (bussola) */}
      <div className="space-y-3">
        <ToggleRow
          label="Fisso laterale (bussola)"
          description="Pannello fisso a lato dell'anta"
          checked={config.fissoLaterale.presente}
          onChange={(v) =>
            onChange({
              ...config,
              fissoLaterale: { ...config.fissoLaterale, presente: v },
            })
          }
          icon={<Columns3 className="h-5 w-5" />}
        />
        {config.fissoLaterale.presente ? (
          <div className="card space-y-4 p-4">
            <div className="space-y-2">
              <Label>Lato</Label>
              <Segmented<"sinistro" | "destro">
                value={config.fissoLaterale.lato}
                onChange={(v) =>
                  onChange({ ...config, fissoLaterale: { ...config.fissoLaterale, lato: v } })
                }
                columns={2}
                options={[
                  { value: "sinistro", label: "Sinistro" },
                  { value: "destro", label: "Destro" },
                ]}
                ariaLabel="Lato del fisso"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fisso-lat-l">Larghezza fisso (mm)</Label>
              <Input
                id="fisso-lat-l"
                type="number"
                inputMode="numeric"
                min={200}
                max={800}
                value={config.fissoLaterale.larghezzaMm}
                onChange={(e) =>
                  onChange({
                    ...config,
                    fissoLaterale: {
                      ...config.fissoLaterale,
                      larghezzaMm: Number(e.target.value) || 0,
                    },
                  })
                }
              />
            </div>
            <ToggleRow
              label="Fisso vetrato"
              description="Pannello con vetro trasparente/satinato"
              checked={config.fissoLaterale.vetrato}
              onChange={(v) =>
                onChange({ ...config, fissoLaterale: { ...config.fissoLaterale, vetrato: v } })
              }
            />
          </div>
        ) : null}
      </div>

      {/* Fisso superiore (sopraluce) */}
      <div className="space-y-3">
        <ToggleRow
          label="Fisso superiore (sopraluce)"
          description="Pannello fisso sopra l'anta"
          checked={config.fissoSuperiore.presente}
          onChange={(v) =>
            onChange({
              ...config,
              fissoSuperiore: { ...config.fissoSuperiore, presente: v },
            })
          }
          icon={<PanelTop className="h-5 w-5" />}
        />
        {config.fissoSuperiore.presente ? (
          <div className="card space-y-4 p-4">
            <div className="space-y-2">
              <Label htmlFor="fisso-sup-h">Altezza sopraluce (mm)</Label>
              <Input
                id="fisso-sup-h"
                type="number"
                inputMode="numeric"
                min={200}
                max={1000}
                value={config.fissoSuperiore.altezzaMm}
                onChange={(e) =>
                  onChange({
                    ...config,
                    fissoSuperiore: {
                      ...config.fissoSuperiore,
                      altezzaMm: Number(e.target.value) || 0,
                    },
                  })
                }
              />
            </div>
            <ToggleRow
              label="Sopraluce vetrato"
              description="Pannello con vetro"
              checked={config.fissoSuperiore.vetrato}
              onChange={(v) =>
                onChange({
                  ...config,
                  fissoSuperiore: { ...config.fissoSuperiore, vetrato: v },
                })
              }
            />
          </div>
        ) : null}
      </div>

      {/* Specchiatura */}
      <div className="space-y-3">
        <ToggleRow
          label="Specchiatura vetrata"
          description="Vetro decorativo sull'anta"
          checked={config.specchiatura.presente}
          onChange={(v) =>
            onChange({ ...config, specchiatura: { ...config.specchiatura, presente: v } })
          }
          icon={<Frame className="h-5 w-5" />}
        />
        {config.specchiatura.presente ? (
          <div className="card space-y-4 p-4">
            <div className="space-y-2">
              <Label>Forma</Label>
              <Segmented<FormaSpecchiatura>
                value={config.specchiatura.forma}
                onChange={(v) =>
                  onChange({ ...config, specchiatura: { ...config.specchiatura, forma: v } })
                }
                columns={3}
                options={[
                  { value: "rettangolare", label: "Rettangolo" },
                  { value: "quadrata", label: "Quadrato" },
                  { value: "verticale-alta", label: "Verticale" },
                ]}
                ariaLabel="Forma specchiatura"
              />
            </div>
            <div className="space-y-2">
              <Label>Numero pannelli</Label>
              <Segmented<string>
                value={String(config.specchiatura.numeroPannelli)}
                onChange={(v) =>
                  onChange({
                    ...config,
                    specchiatura: {
                      ...config.specchiatura,
                      numeroPannelli: Number(v) as 1 | 2 | 3 | 4,
                    },
                  })
                }
                columns={4}
                options={[
                  { value: "1", label: "1" },
                  { value: "2", label: "2" },
                  { value: "3", label: "3" },
                  { value: "4", label: "4" },
                ]}
                ariaLabel="Numero di pannelli"
              />
            </div>
          </div>
        ) : null}
      </div>

      {/* Ovale */}
      <div className="space-y-3">
        <ToggleRow
          label="Ovale (oblò)"
          description="Vetro ovale decorativo sull'anta"
          checked={config.ovale.presente}
          onChange={(v) => onChange({ ...config, ovale: { ...config.ovale, presente: v } })}
          icon={<Egg className="h-5 w-5" />}
        />
        {config.ovale.presente ? (
          <div className="card grid grid-cols-2 gap-4 p-4">
            <div className="space-y-2">
              <Label htmlFor="ov-l">Larghezza (mm)</Label>
              <Input
                id="ov-l"
                type="number"
                inputMode="numeric"
                min={100}
                max={600}
                value={config.ovale.larghezzaMm}
                onChange={(e) =>
                  onChange({
                    ...config,
                    ovale: { ...config.ovale, larghezzaMm: Number(e.target.value) || 0 },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ov-h">Altezza (mm)</Label>
              <Input
                id="ov-h"
                type="number"
                inputMode="numeric"
                min={80}
                max={400}
                value={config.ovale.altezzaMm}
                onChange={(e) =>
                  onChange({
                    ...config,
                    ovale: { ...config.ovale, altezzaMm: Number(e.target.value) || 0 },
                  })
                }
              />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
