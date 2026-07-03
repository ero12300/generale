"use client";

import { useState } from "react";
import { Plus, Tag, Users2, Power, Trash2, Copy, Check } from "lucide-react";
import { PageHeader } from "@/components/dashboard/shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Field, Input, Select } from "@/components/ui/field";
import { ProGate } from "@/components/dashboard/pro-gate";
import { useStore } from "@/lib/store/store-context";
import { eur, parseEuroToCents } from "@/lib/money";
import { hasFeature, isLimitReached } from "@/lib/plan-access";
import { PLANS } from "@/lib/plans";
import type { Campaign, CampaignType, DiscountType } from "@/lib/types";
import { formatDate, cn } from "@/lib/utils";

export default function CampagnePage() {
  const { state, addCampaign, toggleCampaign, deleteCampaign } = useStore();
  const [showNew, setShowNew] = useState<CampaignType | null>(null);

  const plan = state.subscription.plan;
  const canReferral = hasFeature(plan, "referralProgram");
  const campaignLimitReached = isLimitReached(plan, "maxCampaigns", state.campaigns.filter((c) => c.active).length);

  const sconti = state.campaigns.filter((c) => c.type === "sconto");
  const referral = state.campaigns.filter((c) => c.type === "porta_amico");

  return (
    <div className="p-5 md:p-8">
      <PageHeader
        title="Campagne & Fidelizzazione"
        subtitle="Attira nuovi clienti e fai tornare quelli abituali."
        actions={<Button size="sm" onClick={() => setShowNew("sconto")} disabled={campaignLimitReached}><Plus size={16} /> Nuova campagna</Button>}
      />

      {campaignLimitReached && (
        <Card className="mb-5 border-[var(--gold-deep)]/40 bg-[var(--gold)]/8 text-sm text-muted">
          Piano Start: puoi avere solo {PLANS[plan].limits.maxCampaigns} campagna attiva. Passa a Pro per campagne illimitate.
        </Card>
      )}

      {/* Sconti */}
      <div className="mb-8">
        <div className="mb-3 flex items-center gap-2">
          <Tag size={18} className="text-[var(--gold)]" />
          <h2 className="text-lg font-semibold">Codici sconto</h2>
        </div>
        {sconti.length === 0 ? (
          <Card className="py-10 text-center text-muted">Nessun codice sconto. Creane uno per attirare clienti.</Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sconti.map((c) => (
              <CampaignCard key={c.id} campaign={c} onToggle={() => toggleCampaign(c.id)} onDelete={() => deleteCampaign(c.id)} />
            ))}
          </div>
        )}
      </div>

      {/* Porta un amico */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <Users2 size={18} className="text-[var(--gold)]" />
          <h2 className="text-lg font-semibold">Porta un amico</h2>
        </div>
        {!canReferral ? (
          <ProGate
            title="Programma referral disponibile con Pro"
            description="Trasforma i tuoi clienti in promotori: chi porta un amico riceve uno sconto, e anche il nuovo cliente. Il modo più economico per crescere."
          />
        ) : referral.length === 0 ? (
          <Card className="flex items-center justify-between py-6">
            <p className="text-sm text-muted">Nessun programma attivo.</p>
            <Button size="sm" onClick={() => setShowNew("porta_amico")}><Plus size={16} /> Crea programma</Button>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {referral.map((c) => (
              <CampaignCard key={c.id} campaign={c} onToggle={() => toggleCampaign(c.id)} onDelete={() => deleteCampaign(c.id)} referral />
            ))}
            <button onClick={() => setShowNew("porta_amico")} className="flex min-h-[140px] items-center justify-center rounded-2xl border border-dashed border-border text-sm text-muted hover:border-[var(--gold-deep)] hover:text-foreground">
              <Plus size={16} className="mr-2" /> Nuovo programma
            </button>
          </div>
        )}
      </div>

      {showNew && (
        <NewCampaignModal
          initialType={showNew}
          canReferral={canReferral}
          onClose={() => setShowNew(null)}
          onCreate={(c) => { addCampaign(c); setShowNew(null); }}
        />
      )}
    </div>
  );
}

function CampaignCard({
  campaign,
  onToggle,
  onDelete,
  referral,
}: {
  campaign: Campaign;
  onToggle: () => void;
  onDelete: () => void;
  referral?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const discountText =
    campaign.discountType === "percentuale"
      ? `-${campaign.discountValue}%`
      : `-${eur(campaign.discountValue)}`;

  function copy() {
    navigator.clipboard?.writeText(campaign.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <Card className={cn("card-hover", !campaign.active && "opacity-60")}>
      <div className="flex items-start justify-between">
        <div>
          <div className="font-medium">{campaign.name}</div>
          <div className="mt-1 text-xs text-muted">Creata il {formatDate(campaign.createdAt)}</div>
        </div>
        <Badge tone={campaign.active ? "green" : "gray"}>{campaign.active ? "Attiva" : "Sospesa"}</Badge>
      </div>

      <button onClick={copy} className="mt-4 flex w-full items-center justify-between rounded-xl border border-dashed border-[var(--gold-deep)]/50 bg-[var(--gold)]/8 px-3 py-2.5">
        <span className="font-mono text-sm font-semibold text-[var(--gold-soft)]">{campaign.code}</span>
        {copied ? <Check size={15} className="text-[var(--success)]" /> : <Copy size={15} className="text-muted" />}
      </button>

      <div className="mt-3 flex items-center justify-between text-sm">
        <span className="text-muted">Sconto</span>
        <span className="font-semibold">{discountText}</span>
      </div>
      {referral && campaign.refereeRewardCents > 0 && (
        <div className="mt-1 flex items-center justify-between text-sm">
          <span className="text-muted">Premio a chi invita</span>
          <span className="font-semibold">{eur(campaign.refereeRewardCents)}</span>
        </div>
      )}
      <div className="mt-1 flex items-center justify-between text-sm">
        <span className="text-muted">Utilizzi</span>
        <span className="font-semibold">{campaign.redemptions}</span>
      </div>

      <div className="mt-4 flex gap-2">
        <Button size="sm" variant="subtle" className="flex-1" onClick={onToggle}>
          <Power size={14} /> {campaign.active ? "Sospendi" : "Attiva"}
        </Button>
        <button onClick={onDelete} aria-label="Elimina" className="rounded-lg p-2 text-muted hover:bg-[var(--danger)]/10 hover:text-[var(--danger)]">
          <Trash2 size={16} />
        </button>
      </div>
    </Card>
  );
}

function NewCampaignModal({
  initialType,
  canReferral,
  onClose,
  onCreate,
}: {
  initialType: CampaignType;
  canReferral: boolean;
  onClose: () => void;
  onCreate: (c: Omit<Campaign, "id" | "createdAt" | "redemptions">) => void;
}) {
  const [type, setType] = useState<CampaignType>(initialType);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<DiscountType>("percentuale");
  const [discountValue, setDiscountValue] = useState("20");
  const [reward, setReward] = useState("5");

  function submit() {
    if (!name || !code) return;
    const value =
      discountType === "percentuale" ? Number(discountValue) : parseEuroToCents(discountValue);
    onCreate({
      name,
      type,
      code: code.toUpperCase().replace(/\s/g, ""),
      discountType,
      discountValue: value,
      active: true,
      refereeRewardCents: type === "porta_amico" ? parseEuroToCents(reward) : 0,
    });
  }

  return (
    <Modal open onClose={onClose} title="Nuova campagna">
      <div className="space-y-4">
        <Field label="Tipo campagna">
          <Select value={type} onChange={(e) => setType(e.target.value as CampaignType)}>
            <option value="sconto">Codice sconto</option>
            <option value="porta_amico" disabled={!canReferral}>Porta un amico {canReferral ? "" : "(Pro)"}</option>
          </Select>
        </Field>
        <Field label="Nome campagna"><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Es. Sconto primavera" /></Field>
        <Field label="Codice" hint="Il codice che il cliente inserirà in prenotazione">
          <Input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="PRIMAVERA20" />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Tipo sconto">
            <Select value={discountType} onChange={(e) => setDiscountType(e.target.value as DiscountType)}>
              <option value="percentuale">Percentuale (%)</option>
              <option value="fisso">Importo fisso (€)</option>
            </Select>
          </Field>
          <Field label={discountType === "percentuale" ? "Valore %" : "Valore €"}>
            <Input value={discountValue} onChange={(e) => setDiscountValue(e.target.value)} placeholder={discountType === "percentuale" ? "20" : "5,00"} />
          </Field>
        </div>
        {type === "porta_amico" && (
          <Field label="Premio a chi invita (€)" hint="Sconto riconosciuto al cliente che porta un amico">
            <Input value={reward} onChange={(e) => setReward(e.target.value)} placeholder="5,00" />
          </Field>
        )}
        <Button className="w-full" size="lg" disabled={!name || !code} onClick={submit}>
          <Plus size={18} /> Crea campagna
        </Button>
      </div>
    </Modal>
  );
}
