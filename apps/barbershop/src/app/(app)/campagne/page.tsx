"use client";

import { useMemo, useState } from "react";
import { Plus, Gift, Percent, Users, Trash2, Tag } from "lucide-react";
import { useStore } from "@/lib/store";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Select } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { formatCents, eurosToCents } from "@/lib/money";
import type { CampaignType } from "@/lib/types";

export default function CampagnePage() {
  const { data, addCampaign, toggleCampaign, deleteCampaign } = useStore();

  const referralLeaders = useMemo(() => {
    const counts = new Map<string, { name: string; count: number }>();
    for (const c of data.clients) {
      if (!c.referredByCode) continue;
      const referrer = data.clients.find((r) => r.referralCode === c.referredByCode);
      if (!referrer) continue;
      const cur = counts.get(referrer.id) ?? { name: referrer.name, count: 0 };
      cur.count += 1;
      counts.set(referrer.id, cur);
    }
    return Array.from(counts.values()).sort((a, b) => b.count - a.count);
  }, [data.clients]);

  return (
    <div>
      <PageHeader
        title="Campagne & Fidelizzazione"
        subtitle="Sconti e programma Porta un Amico per far crescere la clientela."
        action={<AddCampaignDialog onAdd={addCampaign} />}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {data.campaigns.map((c) => (
            <Card key={c.id}>
              <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <span
                    className={
                      "flex h-11 w-11 items-center justify-center rounded-xl " +
                      (c.type === "referral"
                        ? "bg-sky-500/15 text-sky-300"
                        : "bg-amber-500/15 text-amber-300")
                    }
                  >
                    {c.type === "referral" ? (
                      <Users className="h-5 w-5" />
                    ) : (
                      <Percent className="h-5 w-5" />
                    )}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{c.name}</p>
                      <Badge variant={c.active ? "success" : "neutral"}>
                        {c.active ? "Attiva" : "Sospesa"}
                      </Badge>
                    </div>
                    <p className="mt-0.5 text-sm text-zinc-400">
                      Codice: <span className="font-mono text-amber-300">{c.code}</span> ·{" "}
                      {c.discountPercent != null
                        ? `-${c.discountPercent}%`
                        : `-${formatCents(c.discountCents ?? 0)}`}
                    </p>
                    {c.rewardDescription && (
                      <p className="text-xs text-zinc-500">{c.rewardDescription}</p>
                    )}
                    <p className="mt-1 text-xs text-zinc-500">
                      Utilizzata {c.usageCount} volte
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="secondary" onClick={() => toggleCampaign(c.id)}>
                    {c.active ? "Sospendi" : "Attiva"}
                  </Button>
                  <button
                    onClick={() => deleteCampaign(c.id)}
                    aria-label={`Elimina ${c.name}`}
                    className="rounded p-2 text-zinc-600 hover:bg-zinc-800 hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
          {data.campaigns.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center text-zinc-500">
                <Tag className="mx-auto mb-3 h-8 w-8 opacity-50" />
                Nessuna campagna. Creane una per attirare nuovi clienti.
              </CardContent>
            </Card>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              <span className="inline-flex items-center gap-2">
                <Gift className="h-4 w-4 text-sky-400" /> Porta un Amico
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-zinc-400">
              Classifica dei clienti che hanno portato più amici.
            </p>
            {referralLeaders.length === 0 && (
              <p className="text-sm text-zinc-500">Ancora nessun invito registrato.</p>
            )}
            {referralLeaders.map((r, i) => (
              <div
                key={r.name}
                className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950/40 p-3"
              >
                <span className="text-sm font-medium">
                  {["🥇", "🥈", "🥉"][i] ?? "•"} {r.name}
                </span>
                <Badge variant="info">{r.count} amici</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function AddCampaignDialog({ onAdd }: { onAdd: ReturnType<typeof useStore>["addCampaign"] }) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<CampaignType>("discount");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [discountKind, setDiscountKind] = useState<"percent" | "fixed">("percent");
  const [value, setValue] = useState("");
  const [reward, setReward] = useState("");
  const [error, setError] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !code.trim()) {
      setError("Nome e codice sono obbligatori.");
      return;
    }
    const num = Number(value.replace(",", "."));
    if (!num || num <= 0) {
      setError("Inserisci un valore di sconto valido.");
      return;
    }
    onAdd({
      type,
      name: name.trim(),
      code: code.trim(),
      discountPercent: discountKind === "percent" ? Math.round(num) : null,
      discountCents: discountKind === "fixed" ? eurosToCents(value) : null,
      rewardDescription: reward.trim() || undefined,
    });
    setName("");
    setCode("");
    setValue("");
    setReward("");
    setType("discount");
    setDiscountKind("percent");
    setError("");
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" /> Nuova campagna
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nuova campagna</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="cp-type">Tipo</Label>
            <Select id="cp-type" value={type} onChange={(e) => setType(e.target.value as CampaignType)}>
              <option value="discount">Sconto</option>
              <option value="referral">Porta un Amico</option>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="cp-name">Nome</Label>
              <Input id="cp-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Sconto Estate" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cp-code">Codice</Label>
              <Input
                id="cp-code"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="ESTATE25"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="cp-kind">Tipo sconto</Label>
              <Select
                id="cp-kind"
                value={discountKind}
                onChange={(e) => setDiscountKind(e.target.value as "percent" | "fixed")}
              >
                <option value="percent">Percentuale (%)</option>
                <option value="fixed">Importo fisso (€)</option>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cp-value">Valore</Label>
              <Input
                id="cp-value"
                inputMode="decimal"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={discountKind === "percent" ? "25" : "5,00"}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cp-reward">Descrizione premio</Label>
            <Input
              id="cp-reward"
              value={reward}
              onChange={(e) => setReward(e.target.value)}
              placeholder="Es. 5€ a te e al tuo amico"
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <div className="flex justify-end gap-2 pt-2">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Annulla
              </Button>
            </DialogClose>
            <Button type="submit">Crea campagna</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
