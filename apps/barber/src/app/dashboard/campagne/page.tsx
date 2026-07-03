"use client";

import * as React from "react";
import { Gift, Plus, Trash2, Copy, TrendingUp } from "lucide-react";
import { useShopData } from "@/hooks/use-shop-data";
import { demoStore } from "@/lib/demo-store";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { formatEuro, cn } from "@/lib/utils";
import { toast } from "@/components/ui/toaster";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import type { Campaign } from "@/types";

export default function CampaignsPage() {
  const { campaigns, shop, clients } = useShopData();
  const [creating, setCreating] = React.useState(false);

  const referralCampaigns = campaigns.filter((c) => c.type === "referral");
  const discountCampaigns = campaigns.filter((c) => c.type === "discount");

  const referredCount = clients.filter((c) => c.referredBy).length;

  function copyPublicLink() {
    const url = `${window.location.origin}/b/${shop.slug}`;
    navigator.clipboard.writeText(url);
    toast({ title: "Link copiato", description: url, variant: "success" });
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="grid md:grid-cols-3 gap-4">
        <div className="glass rounded-xl p-5">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-ink-500 mb-2">
            <Gift className="h-3.5 w-3.5" />
            Amici invitati
          </div>
          <div className="font-display text-3xl text-ink-50">
            {referredCount}
          </div>
          <div className="text-xs text-ink-400">Clienti arrivati da referral</div>
        </div>
        <div className="glass rounded-xl p-5">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-ink-500 mb-2">
            <TrendingUp className="h-3.5 w-3.5" />
            Campagne attive
          </div>
          <div className="font-display text-3xl text-ink-50">
            {campaigns.filter((c) => c.active).length}
          </div>
          <div className="text-xs text-ink-400">Su {campaigns.length} totali</div>
        </div>
        <div className="glass rounded-xl p-5">
          <div className="text-xs uppercase tracking-widest text-ink-500 mb-2">
            Link pubblico
          </div>
          <div className="flex items-center gap-2">
            <code className="text-xs text-ink-100 font-mono truncate flex-1">
              /b/{shop.slug}
            </code>
            <Button size="icon" variant="secondary" onClick={copyPublicLink}>
              <Copy className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display text-2xl text-ink-50">Porta un amico</h2>
            <p className="text-sm text-ink-400">
              Ogni cliente riceve un codice referral unico. Chi lo usa entra scontato, chi lo dà guadagna un premio.
            </p>
          </div>
          <Button variant="secondary" onClick={() => setCreating(true)}>
            <Plus className="h-4 w-4" /> Nuova campagna referral
          </Button>
        </div>

        {referralCampaigns.length === 0 ? (
          <EmptyState onCreate={() => setCreating(true)} />
        ) : (
          <div className="grid md:grid-cols-2 gap-3">
            {referralCampaigns.map((c) => (
              <CampaignCard key={c.id} campaign={c} />
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display text-2xl text-ink-50">Codici sconto</h2>
            <p className="text-sm text-ink-400">
              Crea codici promo per riempire orari vuoti, festeggiare compleanni o attirare nuovi clienti.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          {discountCampaigns.map((c) => (
            <CampaignCard key={c.id} campaign={c} />
          ))}
        </div>
      </section>

      {creating && <CampaignDialog onClose={() => setCreating(false)} />}
    </div>
  );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="glass rounded-xl p-8 text-center">
      <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-[color:var(--color-gold-500)]/10 text-[color:var(--color-gold-300)]">
        <Gift className="h-6 w-6" />
      </div>
      <h3 className="font-display text-xl text-ink-50 mb-1">Nessuna campagna referral ancora</h3>
      <p className="text-sm text-ink-400 max-w-md mx-auto mb-4">
        Crea la tua prima campagna &quot;porta un amico&quot;: bastano 30 secondi.
        Chi porta un amico riceve uno sconto, e l&apos;amico entra scontato.
      </p>
      <Button onClick={onCreate}>
        <Plus className="h-4 w-4" /> Crea prima campagna
      </Button>
    </div>
  );
}

function CampaignCard({ campaign: c }: { campaign: Campaign }) {
  const usagePct = c.maxRedemptions
    ? Math.min(100, Math.round((c.redemptions / c.maxRedemptions) * 100))
    : 0;

  return (
    <div
      className={cn(
        "glass rounded-xl p-5 relative overflow-hidden",
        c.active && "border-[color:var(--color-gold-500)]/30"
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-xs uppercase tracking-widest text-[color:var(--color-gold-300)] mb-1">
            {c.type === "referral" ? "Referral" : "Sconto"}
          </div>
          <div className="font-medium text-ink-50">{c.name}</div>
        </div>
        <Badge variant={c.active ? "success" : "default"} className="text-[10px]">
          {c.active ? "Attiva" : "In pausa"}
        </Badge>
      </div>

      {c.description && (
        <p className="text-xs text-ink-400 mb-3">{c.description}</p>
      )}

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="rounded-md bg-black/30 border border-white/5 p-2">
          <div className="text-[10px] uppercase text-ink-500">Sconto</div>
          <div className="text-sm font-medium text-ink-100">
            {c.discountKind === "fixed"
              ? formatEuro(c.discountValue)
              : `${c.discountValue}%`}
          </div>
        </div>
        <div className="rounded-md bg-black/30 border border-white/5 p-2">
          <div className="text-[10px] uppercase text-ink-500">Utilizzi</div>
          <div className="text-sm font-medium text-ink-100">
            {c.redemptions}
            {c.maxRedemptions ? `/${c.maxRedemptions}` : ""}
          </div>
        </div>
      </div>

      {c.maxRedemptions && (
        <div className="h-1 bg-white/5 rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-gradient-to-r from-[color:var(--color-gold-500)] to-[color:var(--color-gold-300)]"
            style={{ width: `${usagePct}%` }}
          />
        </div>
      )}

      {c.code && (
        <div className="flex items-center gap-2 mb-3">
          <code className="flex-1 text-xs text-ink-100 font-mono px-2 py-1.5 rounded bg-black/40 border border-white/5">
            {c.code}
          </code>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => {
              navigator.clipboard.writeText(c.code!);
              toast({ title: "Codice copiato", variant: "success" });
            }}
          >
            <Copy className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}

      <div className="flex gap-2">
        <Button
          size="sm"
          variant="secondary"
          className="flex-1"
          onClick={() => {
            demoStore.updateCampaign(c.id, { active: !c.active });
            toast({
              title: c.active ? "Campagna in pausa" : "Campagna attivata",
              variant: "info",
            });
          }}
        >
          {c.active ? "Metti in pausa" : "Attiva"}
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => {
            demoStore.deleteCampaign(c.id);
            toast({ title: "Campagna eliminata", variant: "info" });
          }}
        >
          <Trash2 className="h-4 w-4 text-ink-500" />
        </Button>
      </div>
    </div>
  );
}

function CampaignDialog({ onClose }: { onClose: () => void }) {
  const [type, setType] = React.useState<Campaign["type"]>("referral");
  const [name, setName] = React.useState("Porta un amico — 5€ a testa");
  const [description, setDescription] = React.useState("");
  const [kind, setKind] = React.useState<Campaign["discountKind"]>("fixed");
  const [value, setValue] = React.useState("5");
  const [code, setCode] = React.useState("");
  const [maxRedemptions, setMaxRedemptions] = React.useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const numValue =
      kind === "fixed"
        ? Math.round(parseFloat(value.replace(",", ".")) * 100)
        : Math.min(100, Math.max(0, Math.round(parseFloat(value))));
    demoStore.createCampaign({
      type,
      name,
      description: description || undefined,
      active: true,
      discountKind: kind,
      discountValue: numValue,
      code: code || undefined,
      maxRedemptions: maxRedemptions ? Number(maxRedemptions) : undefined,
    });
    toast({ title: "Campagna creata", variant: "success" });
    onClose();
  }

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nuova campagna</DialogTitle>
          <DialogDescription>
            Attira nuovi clienti o ricompensa quelli fedeli con uno sconto mirato.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setType("referral")}
              className={cn(
                "rounded-lg border p-3 text-left",
                type === "referral"
                  ? "border-[color:var(--color-gold-500)]/50 bg-[color:var(--color-gold-500)]/10"
                  : "border-white/10"
              )}
            >
              <div className="font-medium text-sm text-ink-50">Referral</div>
              <div className="text-xs text-ink-400">Porta un amico</div>
            </button>
            <button
              type="button"
              onClick={() => setType("discount")}
              className={cn(
                "rounded-lg border p-3 text-left",
                type === "discount"
                  ? "border-[color:var(--color-gold-500)]/50 bg-[color:var(--color-gold-500)]/10"
                  : "border-white/10"
              )}
            >
              <div className="font-medium text-sm text-ink-50">Codice sconto</div>
              <div className="text-xs text-ink-400">Es. BENVENUTO15</div>
            </button>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="n">Nome campagna</Label>
            <Input id="n" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="desc">Descrizione (opzionale)</Label>
            <Textarea
              id="desc"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Come funziona? A chi è destinata?"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="k">Tipo sconto</Label>
              <select
                id="k"
                value={kind}
                onChange={(e) => setKind(e.target.value as Campaign["discountKind"])}
                className="w-full h-11 rounded-md bg-black/30 border border-white/10 px-3 text-sm text-ink-100"
              >
                <option value="fixed">Importo fisso (€)</option>
                <option value="percent">Percentuale (%)</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="v">Valore</Label>
              <Input
                id="v"
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                required
              />
            </div>
          </div>

          {type === "discount" && (
            <div className="space-y-1.5">
              <Label htmlFor="code">Codice</Label>
              <Input
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="BENVENUTO15"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="max">Utilizzi massimi (opzionale)</Label>
            <Input
              id="max"
              type="number"
              min={1}
              value={maxRedemptions}
              onChange={(e) => setMaxRedemptions(e.target.value)}
              placeholder="Illimitato"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onClose}>
              Annulla
            </Button>
            <Button type="submit">Crea campagna</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
