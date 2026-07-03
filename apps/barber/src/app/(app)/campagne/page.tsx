"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Lock, Megaphone, Plus, Tag, Users2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { apiGet, apiSend } from "@/lib/client-api";
import type { Campaign, CampaignType, Organization } from "@/lib/types";

export default function CampagnePage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [org, setOrg] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function reload() {
    const [camps, cat] = await Promise.all([
      apiGet<Campaign[]>("/api/campaigns"),
      apiGet<{ org: Organization }>("/api/catalog"),
    ]);
    setCampaigns(camps);
    setOrg(cat.org);
  }

  useEffect(() => {
    reload()
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  async function toggle(id: string) {
    try {
      await apiSend(`/api/campaigns/${id}`, "PATCH");
      await reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore");
    }
  }

  const isPro = org?.plan === "pro";

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Campagne</h1>
          <p className="mt-1 text-zinc-400">
            Sconti e programma &ldquo;Porta un amico&rdquo; per far crescere la clientela.
          </p>
        </div>
        <NewCampaignDialog isPro={isPro} onCreated={reload} onError={setError} />
      </div>

      {error && (
        <div className="flex items-center justify-between gap-4 rounded-lg border border-red-600/40 bg-red-600/10 px-4 py-3 text-red-300">
          <span>{error}</span>
          {!isPro && (
            <Button asChild size="sm" variant="outline">
              <Link href="/abbonamento">Passa a Pro</Link>
            </Button>
          )}
        </div>
      )}

      {!isPro && (
        <Card className="border-[#c9a24b]/40">
          <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#c9a24b]/15 text-gold-soft">
                <Lock className="h-5 w-5" />
              </span>
              <div>
                <p className="font-medium">Sblocca il programma referral</p>
                <p className="text-sm text-zinc-400">
                  Con il piano Pro attivi campagne illimitate e il &ldquo;Porta un amico&rdquo;.
                </p>
              </div>
            </div>
            <Button asChild variant="outline">
              <Link href="/abbonamento">Scopri Pro</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="h-40 animate-pulse rounded-2xl bg-zinc-800/60" />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {campaigns.map((c) => (
            <Card key={c.id}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#c9a24b]/15 text-gold-soft">
                      {c.type === "referral" ? <Users2 className="h-5 w-5" /> : <Tag className="h-5 w-5" />}
                    </span>
                    <div>
                      <p className="font-semibold">{c.name}</p>
                      <Badge variant={c.type === "referral" ? "info" : "default"}>
                        {c.type === "referral" ? "Porta un amico" : "Sconto"}
                      </Badge>
                    </div>
                  </div>
                  <Badge variant={c.active ? "success" : "secondary"}>
                    {c.active ? "Attiva" : "In pausa"}
                  </Badge>
                </div>
                <p className="mt-3 text-sm text-zinc-400">{c.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-sm">
                    <code className="rounded bg-zinc-800 px-2 py-1 text-gold-soft">{c.code}</code>
                    {c.discountPercent > 0 && (
                      <span className="text-zinc-400">-{c.discountPercent}%</span>
                    )}
                    <span className="text-zinc-500">{c.redemptions} utilizzi</span>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => toggle(c.id)}>
                    {c.active ? "Metti in pausa" : "Attiva"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {campaigns.length === 0 && (
            <p className="text-zinc-500">Nessuna campagna. Creane una per attrarre nuovi clienti.</p>
          )}
        </div>
      )}
    </div>
  );
}

function NewCampaignDialog({
  isPro,
  onCreated,
  onError,
}: {
  isPro: boolean;
  onCreated: () => Promise<void>;
  onError: (msg: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState<CampaignType>("sconto");
  const [description, setDescription] = useState("");
  const [discountPercent, setDiscountPercent] = useState("10");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setName("");
    setType("sconto");
    setDescription("");
    setDiscountPercent("10");
    setError(null);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await apiSend("/api/campaigns", "POST", {
        name,
        type,
        description,
        discountPercent: type === "sconto" ? Number(discountPercent) : 0,
      });
      await onCreated();
      reset();
      setOpen(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Errore";
      setError(msg);
      onError(msg);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) reset(); }}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" /> Nuova campagna
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nuova campagna</DialogTitle>
          <DialogDescription>Crea uno sconto o un programma referral.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ca-name">Nome campagna</Label>
            <Input id="ca-name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ca-type">Tipo</Label>
            <Select id="ca-type" value={type} onChange={(e) => setType(e.target.value as CampaignType)}>
              <option value="sconto">Sconto</option>
              <option value="referral" disabled={!isPro}>
                Porta un amico {isPro ? "" : "(solo Pro)"}
              </option>
            </Select>
          </div>
          {type === "sconto" && (
            <div className="space-y-2">
              <Label htmlFor="ca-disc">Sconto (%)</Label>
              <Input
                id="ca-disc"
                type="number"
                min="0"
                max="100"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(e.target.value)}
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="ca-desc">Descrizione</Label>
            <Textarea
              id="ca-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Es. 20% sul primo taglio per i nuovi clienti"
              required
            />
          </div>
          {error && (
            <p className="rounded-lg border border-red-600/40 bg-red-600/10 px-3 py-2 text-sm text-red-300">
              {error}
            </p>
          )}
          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={saving}>
              <Megaphone className="h-4 w-4" /> {saving ? "Creazione…" : "Crea campagna"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
