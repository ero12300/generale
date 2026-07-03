"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Copy,
  Trash2,
  Pencil,
  Gift,
  Percent,
  Users,
  Sparkles,
  Megaphone,
  Power,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Label } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { demoStore, DEMO_ORG_ID } from "@/lib/demo-store";
import { useToast } from "@/components/ui/toast";
import { cn, formatCurrency, generateId } from "@/lib/utils";
import type { Campaign, CampaignKind } from "@/types";

const KIND_LABEL: Record<CampaignKind, string> = {
  discount: "Sconto",
  referral: "Porta un amico",
  loyalty: "Fedeltà",
};

const KIND_ICON: Record<CampaignKind, React.ReactNode> = {
  discount: <Percent className="h-4 w-4" />,
  referral: <Users className="h-4 w-4" />,
  loyalty: <Sparkles className="h-4 w-4" />,
};

export function CampaignsPage() {
  const { push } = useToast();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<Campaign | null>(null);

  useEffect(() => { refresh(); }, []);
  function refresh() { setCampaigns(demoStore.listCampaigns()); }

  function toggleActive(c: Campaign) {
    demoStore.upsertCampaign({ ...c, active: !c.active });
    push(c.active ? "Campagna disattivata" : "Campagna attivata", "info");
    refresh();
  }

  function copyCode(code: string) {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      push(`Codice ${code} copiato`, "success");
    }
  }

  function handleDelete(id: string) {
    demoStore.deleteCampaign(id);
    push("Campagna eliminata", "info");
    refresh();
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Campagne"
        description="Sconti, porta-un-amico, fedeltà. Trasforma i tuoi clienti in ambasciatori del salone."
        action={
          <Button onClick={() => { setEditing(null); setOpenForm(true); }}>
            <Plus className="h-4 w-4" /> Nuova campagna
          </Button>
        }
      />

      {campaigns.length === 0 ? (
        <div className="surface rounded-2xl p-12 text-center text-ink-400">
          <Megaphone className="h-8 w-8 mx-auto text-gold-300 mb-3 opacity-60" />
          <p>Nessuna campagna attiva. Creane una per iniziare a fidelizzare.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {campaigns.map((c) => (
            <div key={c.id} className={cn(
              "surface rounded-2xl p-6 relative overflow-hidden transition-all",
              c.active ? "hover:border-gold-400/30" : "opacity-60"
            )}>
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className={cn(
                    "grid h-10 w-10 place-items-center rounded-lg border",
                    c.kind === "discount" ? "bg-blue-500/10 border-blue-500/20 text-blue-300" :
                    c.kind === "referral" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300" :
                    "bg-gold-400/10 border-gold-400/20 text-gold-200"
                  )}>
                    {KIND_ICON[c.kind]}
                  </div>
                  <div>
                    <Badge variant={c.active ? "emerald" : "muted"} className="text-[10px]">
                      {c.active ? "Attiva" : "Inattiva"}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-0.5">
                  <Button variant="ghost" size="icon" onClick={() => toggleActive(c)} title={c.active ? "Disattiva" : "Attiva"}>
                    <Power className={cn("h-4 w-4", c.active && "text-emerald-400")} />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => { setEditing(c); setOpenForm(true); }} title="Modifica">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(c.id)} title="Elimina">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <h3 className="font-display text-xl text-ink-50 leading-tight">{c.name}</h3>
              <p className="mt-1 text-xs text-ink-400 uppercase tracking-widest">{KIND_LABEL[c.kind]}</p>

              <button
                onClick={() => copyCode(c.code)}
                className="mt-4 w-full flex items-center justify-between rounded-lg border border-dashed border-gold-400/30 bg-gold-400/5 px-3 py-2.5 text-sm text-gold-100 hover:bg-gold-400/10 transition-colors group"
              >
                <span className="font-mono font-medium tracking-wider">{c.code}</span>
                <Copy className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100" />
              </button>

              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="font-display text-lg text-ink-50">
                    {c.discountPercent > 0 ? `${c.discountPercent}%` : c.discountAmount > 0 ? formatCurrency(c.discountAmount) : "—"}
                  </div>
                  <div className="text-[10px] text-ink-400 uppercase tracking-widest">Sconto</div>
                </div>
                <div>
                  <div className="font-display text-lg gradient-text">{c.redemptions}</div>
                  <div className="text-[10px] text-ink-400 uppercase tracking-widest">Riscatti</div>
                </div>
                <div>
                  <div className="font-display text-lg text-ink-50">
                    {c.kind === "referral" ? formatCurrency(c.referralRewardEuro) : c.maxRedemptions ?? "∞"}
                  </div>
                  <div className="text-[10px] text-ink-400 uppercase tracking-widest">
                    {c.kind === "referral" ? "Reward" : "Max"}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <CampaignForm
        open={openForm}
        onOpenChange={setOpenForm}
        editing={editing}
        onSaved={() => { setOpenForm(false); refresh(); }}
      />
    </div>
  );
}

function CampaignForm({
  open,
  onOpenChange,
  editing,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  editing: Campaign | null;
  onSaved: () => void;
}) {
  const { push } = useToast();
  const [name, setName] = useState("");
  const [kind, setKind] = useState<CampaignKind>("discount");
  const [code, setCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState("10");
  const [discountAmount, setDiscountAmount] = useState("0");
  const [referralReward, setReferralReward] = useState("5");
  const [maxRedemptions, setMaxRedemptions] = useState("");

  useEffect(() => {
    if (!open) return;
    if (editing) {
      setName(editing.name);
      setKind(editing.kind);
      setCode(editing.code);
      setDiscountPercent(editing.discountPercent.toString());
      setDiscountAmount(editing.discountAmount.toString());
      setReferralReward(editing.referralRewardEuro.toString());
      setMaxRedemptions(editing.maxRedemptions?.toString() ?? "");
    } else {
      setName("");
      setKind("discount");
      setCode("");
      setDiscountPercent("10");
      setDiscountAmount("0");
      setReferralReward("5");
      setMaxRedemptions("");
    }
  }, [open, editing]);

  function generateCode() {
    const c = Math.random().toString(36).slice(2, 8).toUpperCase();
    setCode(c);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !code.trim()) {
      push("Compila nome e codice", "error");
      return;
    }
    const now = new Date().toISOString();
    const base = {
      name: name.trim(),
      kind,
      code: code.toUpperCase(),
      discountPercent: parseFloat(discountPercent) || 0,
      discountAmount: parseFloat(discountAmount) || 0,
      referralRewardEuro: parseFloat(referralReward) || 0,
      maxRedemptions: maxRedemptions ? parseInt(maxRedemptions, 10) : undefined,
    };
    if (editing) {
      demoStore.upsertCampaign({ ...editing, ...base });
      push("Campagna aggiornata", "success");
    } else {
      demoStore.upsertCampaign({
        id: generateId("cmp"),
        organizationId: DEMO_ORG_ID,
        active: true,
        redemptions: 0,
        createdAt: now,
        ...base,
      });
      push("Campagna creata", "success");
    }
    onSaved();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editing ? "Modifica campagna" : "Nuova campagna"}</DialogTitle>
          <DialogDescription>Sconti, porta-un-amico o programma fedeltà.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Nome campagna</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Es. Benvenuto - Prima visita" required />
          </div>
          <div>
            <Label>Tipo</Label>
            <div className="grid grid-cols-3 gap-2">
              {(["discount", "referral", "loyalty"] as CampaignKind[]).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setKind(k)}
                  className={cn(
                    "rounded-lg py-2.5 border text-sm transition-colors flex items-center justify-center gap-1.5",
                    kind === k
                      ? "border-gold-400/40 bg-gold-400/10 text-gold-200"
                      : "border-white/10 bg-white/5 text-ink-300 hover:bg-white/10"
                  )}
                >
                  {KIND_ICON[k]} {KIND_LABEL[k]}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label>Codice</Label>
            <div className="flex gap-2">
              <Input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="WELCOME10" required className="font-mono uppercase" />
              <Button type="button" variant="secondary" onClick={generateCode}>
                <Sparkles className="h-4 w-4" /> Genera
              </Button>
            </div>
          </div>
          {kind === "discount" && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Sconto %</Label>
                <Input type="number" step="1" min="0" max="100" value={discountPercent} onChange={(e) => setDiscountPercent(e.target.value)} />
              </div>
              <div>
                <Label>Sconto fisso €</Label>
                <Input type="number" step="0.5" min="0" value={discountAmount} onChange={(e) => setDiscountAmount(e.target.value)} />
              </div>
            </div>
          )}
          {kind === "referral" && (
            <div>
              <Label>Reward per referral (€)</Label>
              <Input type="number" step="0.5" min="0" value={referralReward} onChange={(e) => setReferralReward(e.target.value)} />
              <p className="text-xs text-ink-400 mt-1.5">
                Sia chi porta l'amico che il nuovo cliente ricevono lo sconto.
              </p>
            </div>
          )}
          {kind === "loyalty" && (
            <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3 text-sm text-ink-300 flex items-start gap-2">
              <Gift className="h-4 w-4 text-gold-300 mt-0.5 shrink-0" />
              <div>
                Il programma fedeltà premia ogni 10 visite con un servizio gratuito.
                I punti si accumulano automaticamente a ogni prenotazione completata.
              </div>
            </div>
          )}
          <div>
            <Label>Riscatti massimi (opzionale)</Label>
            <Input type="number" step="1" min="0" value={maxRedemptions} onChange={(e) => setMaxRedemptions(e.target.value)} placeholder="Illimitati se vuoto" />
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Annulla</Button>
            <Button type="submit">{editing ? "Aggiorna" : "Crea campagna"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
