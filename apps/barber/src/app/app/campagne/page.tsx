"use client";

import { Gift, Lock, PlusCircle, Power } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Field,
  Input,
  SectionHeading,
  Select,
  Spinner,
} from "@/components/ui";
import { formatEuro } from "@/lib/money";
import { useStore } from "@/lib/store/provider";
import { PLANS, type Campaign } from "@/lib/types";
import { campaignInputSchema } from "@/lib/validation";

export default function CampagnePage() {
  const { state, loading, addCampaign, toggleCampaign } = useStore();
  const [name, setName] = useState("");
  const [kind, setKind] = useState("percentuale");
  const [code, setCode] = useState("");
  const [valueInput, setValueInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  if (loading || !state) return <Spinner label="Carico le campagne…" />;

  const plan = PLANS[state.settings.plan];

  if (!plan.campaigns) {
    return (
      <div className="space-y-6">
        <SectionHeading eyebrow="Campagne" title="Campagne sconto & referral" />
        <Card className="flex flex-col items-center gap-4 py-12 text-center">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-gold-500/15 text-gold-400">
            <Lock className="h-7 w-7" aria-hidden />
          </span>
          <h3 className="font-display text-2xl text-cream">
            Funzione del piano Pro
          </h3>
          <p className="max-w-md text-sm text-cream/50">
            Con il piano Pro sblocchi codici sconto percentuali o fissi e il
            programma porta-un-amico con codici referral personali per ogni
            cliente.
          </p>
          <Link href="/app/abbonamento">
            <Button>Passa a Pro</Button>
          </Link>
        </Card>
      </div>
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    setFeedback(null);
    const parsed = campaignInputSchema.safeParse({
      name,
      kind,
      code,
      valueInput,
    });
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        fieldErrors[String(issue.path[0])] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    const result = addCampaign(parsed.data);
    if (!result.ok) {
      setSubmitError(result.error);
      return;
    }
    setFeedback(`Campagna "${result.data.name}" creata con codice ${result.data.code}.`);
    setName("");
    setCode("");
    setValueInput("");
  }

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Campagne"
        title="Campagne sconto & referral"
        subtitle="I clienti inseriscono il codice in fase di prenotazione. I codici amico personali dei clienti applicano la campagna di tipo referral attiva."
      />

      <Card>
        <h3 className="font-display mb-4 text-lg text-cream">Nuova campagna</h3>
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <Field label="Nome campagna" htmlFor="cmp-name" error={errors.name}>
            <Input
              id="cmp-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Es. Promo settembre"
            />
          </Field>
          <Field label="Tipo" htmlFor="cmp-kind">
            <Select
              id="cmp-kind"
              value={kind}
              onChange={(e) => setKind(e.target.value)}
            >
              <option value="percentuale">Sconto percentuale (%)</option>
              <option value="fisso">Sconto fisso (€)</option>
              <option value="referral">Porta un amico (€ per l&apos;invitato)</option>
            </Select>
          </Field>
          <Field label="Codice" htmlFor="cmp-code" error={errors.code}>
            <Input
              id="cmp-code"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Es. SETTEMBRE20"
            />
          </Field>
          <Field
            label={kind === "percentuale" ? "Percentuale (1-100)" : "Valore (€)"}
            htmlFor="cmp-value"
            error={errors.valueInput}
          >
            <Input
              id="cmp-value"
              value={valueInput}
              onChange={(e) => setValueInput(e.target.value)}
              placeholder={kind === "percentuale" ? "Es. 20" : "Es. 5"}
              inputMode="decimal"
            />
          </Field>
          {submitError ? (
            <p role="alert" className="text-sm text-red-300 md:col-span-2">
              {submitError}
            </p>
          ) : null}
          {feedback ? (
            <p className="text-sm text-emerald-300 md:col-span-2">{feedback}</p>
          ) : null}
          <div className="md:col-span-2">
            <Button type="submit">
              <PlusCircle className="h-4 w-4" aria-hidden /> Crea campagna
            </Button>
          </div>
        </form>
      </Card>

      {state.campaigns.length === 0 ? (
        <EmptyState title="Nessuna campagna creata" />
      ) : (
        <div className="grid gap-3">
          {state.campaigns.map((c) => (
            <Card key={c.id} className="flex flex-wrap items-center gap-4">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-gold-500/15 text-gold-400">
                <Gift className="h-5 w-5" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-cream">{c.name}</p>
                <p className="text-xs text-cream/50">
                  Codice <span className="text-gold-300">{c.code}</span> ·{" "}
                  {describeCampaign(c)} · usata {c.usageCount} volte
                </p>
              </div>
              <Badge tone={c.active ? "green" : "neutral"}>
                {c.active ? "Attiva" : "Sospesa"}
              </Badge>
              <Button
                variant="outline"
                onClick={() => toggleCampaign(c.id)}
                aria-label={`${c.active ? "Sospendi" : "Riattiva"} campagna ${c.name}`}
              >
                <Power className="h-4 w-4" aria-hidden />
                {c.active ? "Sospendi" : "Riattiva"}
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function describeCampaign(c: Campaign): string {
  switch (c.kind) {
    case "percentuale":
      return `−${c.value}%`;
    case "fisso":
      return `−${formatEuro(c.value)}`;
    case "referral":
      return `porta un amico: −${formatEuro(c.value)} all'invitato`;
    default: {
      const _exhaustive: never = c.kind;
      return _exhaustive;
    }
  }
}
