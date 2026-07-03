"use client";

import { useMemo, useState } from "react";
import { Topbar } from "@/components/app/topbar";
import { useOpenNav } from "@/app/app/nav-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { useStore } from "@/components/providers/data-provider";
import { useToast } from "@/components/providers/toast-provider";
import { Copy, Gift, PercentCircle, Plus, Users, Lock } from "lucide-react";
import type { CampaignKind } from "@/types";
import { formatDateIT, formatEUR } from "@/lib/utils";
import { hasFeature } from "@/lib/plans";
import { useAuth } from "@/components/providers/auth-provider";
import Link from "next/link";
import { appUrl } from "@/lib/env";

export default function CampagnePage() {
  const store = useStore();
  const openNav = useOpenNav();
  const toast = useToast();
  const { user } = useAuth();
  const canDiscounts = hasFeature(user?.plan, "campaigns.discounts");
  const canReferral = hasFeature(user?.plan, "campaigns.referral");
  const [dialog, setDialog] = useState<{ open: boolean; kind: CampaignKind }>({ open: false, kind: "discount" });
  const [form, setForm] = useState({
    name: "",
    code: "",
    percentOff: "10",
    amountOffEur: "",
    referralRewardEur: "5",
    minSpendEur: "0",
    validTo: "",
    active: true,
  });

  const discounts = useMemo(() => store.campaigns.filter((c) => c.kind === "discount"), [store.campaigns]);
  const referrals = useMemo(() => store.campaigns.filter((c) => c.kind === "referral"), [store.campaigns]);

  const openNew = (kind: CampaignKind) => {
    setForm({ name: "", code: "", percentOff: "10", amountOffEur: "", referralRewardEur: "5", minSpendEur: "0", validTo: "", active: true });
    setDialog({ open: true, kind });
  };

  const submit = async () => {
    if (!form.name.trim()) return toast.error("Serve un nome");
    if (dialog.kind === "discount") {
      const percent = form.percentOff ? Number(form.percentOff) : undefined;
      const amount = form.amountOffEur ? Number(form.amountOffEur.replace(",", ".")) : undefined;
      if (!percent && !amount) return toast.error("Serve % o € di sconto");
      await store.createCampaign({
        kind: "discount",
        name: form.name.trim(),
        code: form.code.trim().toUpperCase() || undefined,
        percentOff: percent,
        amountOffEur: amount,
        minSpendEur: Number(form.minSpendEur.replace(",", ".")) || undefined,
        validTo: form.validTo || undefined,
        active: form.active,
      });
    } else {
      const reward = Number(form.referralRewardEur.replace(",", "."));
      if (!Number.isFinite(reward) || reward <= 0) return toast.error("Serve un reward > 0");
      await store.createCampaign({
        kind: "referral",
        name: form.name.trim(),
        referralRewardEur: reward,
        active: form.active,
      });
    }
    toast.success("Campagna creata");
    setDialog({ open: false, kind: dialog.kind });
  };

  return (
    <>
      <Topbar
        title="Campagne"
        subtitle="Codici sconto stagionali e programma porta-un-amico."
        onOpenNav={openNav}
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => openNew("discount")} disabled={!canDiscounts}>
              <PercentCircle className="h-4 w-4" /> Sconto
            </Button>
            <Button variant="gold" onClick={() => openNew("referral")} disabled={!canReferral} title={!canReferral ? "Disponibile con Pro" : ""}>
              <Gift className="h-4 w-4" /> Referral
            </Button>
          </div>
        }
      />

      {!canDiscounts && (
        <Card className="mb-4 gold-border">
          <div className="flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-[color:var(--color-gold-500)]/15 text-[color:var(--color-gold-300)]">
                <Lock className="h-4 w-4" />
              </span>
              <div>
                <div className="font-display text-lg text-white">Sblocca le campagne</div>
                <div className="text-sm text-white/60">Codici sconto dal piano <b>Base</b>, referral porta-un-amico dal piano <b>Pro</b>.</div>
              </div>
            </div>
            <Button variant="gold" asChild>
              <Link href="/app/abbonamento">Aggiorna piano</Link>
            </Button>
          </div>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Codici sconto</CardTitle>
              <CardDescription>Attiva campagne stagionali con % o €.</CardDescription>
            </div>
            <Badge tone={canDiscounts ? "gold" : "muted"}>{discounts.filter((c) => c.active).length} attivi</Badge>
          </CardHeader>
          <CardContent>
            {discounts.length === 0 ? (
              <EmptyState
                icon={<PercentCircle className="h-6 w-6" />}
                title="Nessun codice sconto"
                description="Ad esempio BENVENUTO10 al 10% per i nuovi clienti."
                action={<Button variant="gold" onClick={() => openNew("discount")} disabled={!canDiscounts}><Plus className="h-4 w-4" /> Crea sconto</Button>}
              />
            ) : (
              <ul className="space-y-3">
                {discounts.map((c) => (
                  <li key={c.id} className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-display text-lg text-white">{c.name}</div>
                        <div className="mt-1 text-xs text-white/50">
                          {c.percentOff ? `-${c.percentOff}%` : c.amountOffEur ? `-${formatEUR(c.amountOffEur)}` : ""}
                          {c.minSpendEur ? ` · min ${formatEUR(c.minSpendEur)}` : ""}
                          {c.validTo ? ` · fino al ${formatDateIT(c.validTo)}` : ""}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge tone={c.active ? "success" : "muted"}>{c.active ? "Attiva" : "Off"}</Badge>
                        <Switch
                          checked={c.active}
                          onCheckedChange={(v) => store.updateCampaign(c.id, { active: v })}
                          aria-label="Attiva/Disattiva"
                        />
                      </div>
                    </div>
                    {c.code && (
                      <div className="mt-3 flex items-center gap-3">
                        <div className="flex items-center gap-2 rounded-lg border border-[color:var(--color-gold-300)]/30 bg-black/40 px-3 py-1.5 font-mono text-sm text-[color:var(--color-gold-200)]">
                          {c.code}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={async () => {
                            try {
                              await navigator.clipboard.writeText(c.code!);
                              toast.success("Codice copiato");
                            } catch { /* */ }
                          }}
                        >
                          <Copy className="h-3.5 w-3.5" /> Copia
                        </Button>
                        <span className="ml-auto text-xs text-white/50">{c.usageCount} usi</span>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Porta-un-amico</CardTitle>
              <CardDescription>Ogni cliente porta un amico → reward per entrambi.</CardDescription>
            </div>
            <Badge tone={canReferral ? "gold" : "muted"}>Pro</Badge>
          </CardHeader>
          <CardContent>
            {referrals.length === 0 ? (
              <EmptyState
                icon={<Gift className="h-6 w-6" />}
                title="Nessun programma referral"
                description="Es. 5€ di sconto per il cliente + 5€ credito per chi porta l'amico."
                action={<Button variant="gold" onClick={() => openNew("referral")} disabled={!canReferral}><Plus className="h-4 w-4" /> Crea referral</Button>}
              />
            ) : (
              <div className="space-y-3">
                {referrals.map((c) => (
                  <div key={c.id} className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-display text-lg text-white">{c.name}</div>
                        <div className="mt-1 text-xs text-white/50">Reward: {c.referralRewardEur ? formatEUR(c.referralRewardEur) : "—"} per entrambi</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge tone={c.active ? "success" : "muted"}>{c.active ? "Attiva" : "Off"}</Badge>
                        <Switch checked={c.active} onCheckedChange={(v) => store.updateCampaign(c.id, { active: v })} />
                      </div>
                    </div>
                  </div>
                ))}

                <div className="mt-6 rounded-2xl border border-white/5 bg-white/[0.02] p-4">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-white/50">
                    <Users className="h-4 w-4 text-[color:var(--color-gold-300)]" /> Codici referral dei tuoi clienti
                  </div>
                  <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {store.clients.slice(0, 6).map((c) => (
                      <div key={c.id} className="flex items-center justify-between rounded-lg border border-white/5 bg-black/20 px-3 py-2 text-xs">
                        <div>
                          <div className="text-white/80">{c.firstName} {c.lastName ?? ""}</div>
                          <div className="text-white/40">{c.totalVisits} visite · {formatEUR(c.totalSpentEur)}</div>
                        </div>
                        <button
                          onClick={async () => {
                            const link = `${appUrl.replace(/\/$/, "")}/book/${store.shop.slug}?ref=${c.referralCode}`;
                            try {
                              await navigator.clipboard.writeText(link);
                              toast.success("Link referral copiato", link);
                            } catch { /* */ }
                          }}
                          className="rounded-md border border-[color:var(--color-gold-300)]/30 bg-black/40 px-2 py-1 font-mono text-[color:var(--color-gold-200)]"
                        >
                          {c.referralCode}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={dialog.open} onOpenChange={(v) => setDialog((s) => ({ ...s, open: v }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialog.kind === "discount" ? "Nuovo codice sconto" : "Nuovo programma referral"}</DialogTitle>
            <DialogDescription>
              {dialog.kind === "discount"
                ? "Crea un codice da promuovere su Instagram, WhatsApp o in negozio."
                : "Ogni cliente riceve un codice porta-un-amico automatico. Sconto per entrambi."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            <div>
              <Label>Nome campagna</Label>
              <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder={dialog.kind === "discount" ? "Benvenuto -10%" : "Porta un amico - 5€"} />
            </div>
            {dialog.kind === "discount" && (
              <>
                <div>
                  <Label>Codice</Label>
                  <Input value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))} placeholder="BENVENUTO10" className="font-mono" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>% di sconto</Label>
                    <Input value={form.percentOff} onChange={(e) => setForm((f) => ({ ...f, percentOff: e.target.value, amountOffEur: "" }))} placeholder="10" />
                  </div>
                  <div>
                    <Label>Oppure € fissi</Label>
                    <Input value={form.amountOffEur} onChange={(e) => setForm((f) => ({ ...f, amountOffEur: e.target.value, percentOff: "" }))} placeholder="5" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Spesa minima €</Label>
                    <Input value={form.minSpendEur} onChange={(e) => setForm((f) => ({ ...f, minSpendEur: e.target.value }))} placeholder="0" />
                  </div>
                  <div>
                    <Label>Valido fino a</Label>
                    <Input type="date" value={form.validTo} onChange={(e) => setForm((f) => ({ ...f, validTo: e.target.value }))} />
                  </div>
                </div>
              </>
            )}
            {dialog.kind === "referral" && (
              <div>
                <Label>Reward € (per entrambi)</Label>
                <Input value={form.referralRewardEur} onChange={(e) => setForm((f) => ({ ...f, referralRewardEur: e.target.value }))} placeholder="5" />
              </div>
            )}
            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <div>
                <div className="text-sm text-white">Attiva subito</div>
                <div className="text-xs text-white/50">Puoi disattivarla in qualsiasi momento.</div>
              </div>
              <Switch checked={form.active} onCheckedChange={(v) => setForm((f) => ({ ...f, active: v }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDialog((s) => ({ ...s, open: false }))}>Annulla</Button>
            <Button variant="gold" onClick={submit}>Crea</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
