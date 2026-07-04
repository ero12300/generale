"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Ruler, DoorOpen, Layers, Sparkles, CheckCircle2 } from "lucide-react";

import type { ConfigurazionePorta } from "@/lib/door-engine";
import { calcolaPorta } from "@/lib/door-engine";
import { generaId, salvaProgetto } from "@/lib/storage";

import { WizardShell } from "./wizard-shell";
import { StepHeader } from "./step-header";
import { Button } from "@/components/ui/button";
import { StepVano } from "./steps/step-vano";
import { StepModello } from "./steps/step-modello";
import { StepConfigurazione } from "./steps/step-configurazione";
import { StepApertura } from "./steps/step-apertura";
import { StepRiepilogo } from "./steps/step-riepilogo";

interface WizardContainerProps {
  initialConfig?: ConfigurazionePorta;
  initialProjectId?: string;
  initialNome?: string;
  initialCliente?: string;
}

const DEFAULT_CONFIG: ConfigurazionePorta = {
  vano: { larghezzaMm: 900, altezzaMm: 2200, spessoreParereMm: 105 },
  tipologia: "battente-singola",
  modello: "Liscia",
  mano: "destra",
  verso: "tirare",
  specchiatura: { presente: false, forma: "rettangolare", numeroPannelli: 2 },
  ovale: { presente: false, larghezzaMm: 300, altezzaMm: 220 },
  fissoLaterale: { presente: false, lato: "destro", larghezzaMm: 300, vetrato: true },
  fissoSuperiore: { presente: false, altezzaMm: 400, vetrato: true },
};

const STEPS = [
  { title: "Vano murario", subtitle: "Misura l'apertura grezza nel muro", icon: Ruler },
  { title: "Modello & tipologia", subtitle: "Scegli il tipo di porta", icon: DoorOpen },
  { title: "Configurazione", subtitle: "Bussola, fisso, specchiatura, ovale", icon: Layers },
  { title: "Apertura & ferramenta", subtitle: "Mano e verso di apertura", icon: Sparkles },
  { title: "Riepilogo & export", subtitle: "Schema tecnico e distinta", icon: CheckCircle2 },
];

export function WizardContainer({
  initialConfig,
  initialProjectId,
  initialNome,
  initialCliente,
}: WizardContainerProps) {
  const router = useRouter();
  const [step, setStep] = React.useState(1);
  const [config, setConfig] = React.useState<ConfigurazionePorta>(
    initialConfig ?? DEFAULT_CONFIG
  );
  const [nome, setNome] = React.useState<string>(initialNome ?? "");
  const [cliente, setCliente] = React.useState<string>(initialCliente ?? "");
  const [projectId] = React.useState<string>(initialProjectId ?? generaId());

  const calcolo = React.useMemo(() => calcolaPorta(config), [config]);

  const puoAvanzare = (): boolean => {
    if (step === 1) {
      return (
        config.vano.larghezzaMm >= 400 &&
        config.vano.altezzaMm >= 1500 &&
        config.vano.spessoreParereMm >= 70
      );
    }
    if (step === 2) return config.modello.length > 0;
    return true;
  };

  function avanti() {
    if (step < STEPS.length) setStep(step + 1);
  }
  function indietro() {
    if (step > 1) setStep(step - 1);
    else router.push("/");
  }

  function salvaEProsegui() {
    salvaProgetto({
      id: projectId,
      nome: nome || `Porta ${config.vano.larghezzaMm}×${config.vano.altezzaMm}`,
      cliente: cliente || undefined,
      creatoIl: new Date().toISOString(),
      aggiornatoIl: new Date().toISOString(),
      configurazione: config,
    });
    router.push(`/progetto/${projectId}`);
  }

  const meta = STEPS[step - 1];
  const isUltimo = step === STEPS.length;

  return (
    <WizardShell
      title="Nuovo progetto"
      onBack={indietro}
      footer={
        <div className="flex gap-3">
          {step > 1 ? (
            <Button variant="outline" onClick={indietro} size="lg" className="flex-1">
              Indietro
            </Button>
          ) : null}
          {!isUltimo ? (
            <Button
              variant="wood"
              onClick={avanti}
              size="lg"
              className="flex-1"
              disabled={!puoAvanzare()}
            >
              Avanti
            </Button>
          ) : (
            <Button variant="wood" onClick={salvaEProsegui} size="lg" className="flex-1">
              Salva & Esporta
            </Button>
          )}
        </div>
      }
    >
      <StepHeader step={step} total={STEPS.length} title={meta.title} subtitle={meta.subtitle} />

      {step === 1 ? <StepVano config={config} onChange={setConfig} /> : null}
      {step === 2 ? <StepModello config={config} onChange={setConfig} /> : null}
      {step === 3 ? <StepConfigurazione config={config} onChange={setConfig} /> : null}
      {step === 4 ? <StepApertura config={config} onChange={setConfig} /> : null}
      {step === 5 ? (
        <StepRiepilogo
          config={config}
          calcolo={calcolo}
          nome={nome}
          cliente={cliente}
          onNomeChange={setNome}
          onClienteChange={setCliente}
        />
      ) : null}
    </WizardShell>
  );
}
