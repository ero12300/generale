"use client";

import { useEffect, useState } from "react";
import type { BarberCampaign } from "@deal-desk/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";

interface CampaignFormState {
  name: string;
  channel: "sms" | "email" | "whatsapp" | "in_app";
  discount_type: "percent" | "fixed";
  discount_value: string;
  referral_bonus: string;
  message: string;
  starts_at: string;
  ends_at: string;
  audience: string;
}

const initialForm: CampaignFormState = {
  name: "",
  channel: "whatsapp",
  discount_type: "percent",
  discount_value: "10",
  referral_bonus: "5",
  message: "",
  starts_at: new Date().toISOString().slice(0, 10),
  ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
  audience: "clienti_attivi_30gg",
};

export function CampaignsManager() {
  const [campaigns, setCampaigns] = useState<BarberCampaign[]>([]);
  const [form, setForm] = useState<CampaignFormState>(initialForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function loadCampaigns() {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/barber/campaigns");
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Errore caricamento campagne");
      setCampaigns(data);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Errore caricamento campagne");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadCampaigns();
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const payload = {
        ...form,
        discount_value: Number(form.discount_value),
        referral_bonus: Number(form.referral_bonus),
        message: form.message || null,
      };
      const response = await fetch("/api/barber/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Errore creazione campagna");
      setCampaigns((current) => [data, ...current]);
      setSuccess("Campagna creata con successo.");
      setForm(initialForm);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Errore creazione campagna");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="grid xl:grid-cols-[1.1fr,1fr] gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Nuova campagna sconti / referral</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              placeholder="Nome campagna"
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              required
            />
            <div className="grid grid-cols-2 gap-3">
              <select
                className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm"
                value={form.channel}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    channel: event.target.value as CampaignFormState["channel"],
                  }))
                }
              >
                <option value="whatsapp">WhatsApp</option>
                <option value="sms">SMS</option>
                <option value="email">Email</option>
                <option value="in_app">In app</option>
              </select>
              <select
                className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm"
                value={form.discount_type}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    discount_type: event.target.value as CampaignFormState["discount_type"],
                  }))
                }
              >
                <option value="percent">Percentuale</option>
                <option value="fixed">Valore fisso €</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="number"
                min="0"
                step="0.01"
                value={form.discount_value}
                onChange={(event) =>
                  setForm((current) => ({ ...current, discount_value: event.target.value }))
                }
                required
              />
              <Input
                type="number"
                min="0"
                step="0.01"
                value={form.referral_bonus}
                onChange={(event) =>
                  setForm((current) => ({ ...current, referral_bonus: event.target.value }))
                }
                required
              />
            </div>
            <Input
              placeholder="Messaggio promozionale"
              value={form.message}
              onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="date"
                value={form.starts_at}
                onChange={(event) => setForm((current) => ({ ...current, starts_at: event.target.value }))}
                required
              />
              <Input
                type="date"
                value={form.ends_at}
                onChange={(event) => setForm((current) => ({ ...current, ends_at: event.target.value }))}
                required
              />
            </div>
            <Input
              placeholder="Target audience"
              value={form.audience}
              onChange={(event) => setForm((current) => ({ ...current, audience: event.target.value }))}
              required
            />
            <Button type="submit" disabled={isSaving} className="w-full">
              {isSaving ? "Creazione..." : "Crea campagna"}
            </Button>
            {success && <p className="text-xs text-emerald-400">{success}</p>}
            {error && <p className="text-xs text-rose-400">{error}</p>}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Campagne attive/storico</CardTitle>
          <Button variant="outline" size="sm" onClick={() => void loadCampaigns()} disabled={isLoading}>
            Aggiorna
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          {isLoading && <p className="text-sm text-zinc-500">Caricamento campagne...</p>}
          {!isLoading &&
            campaigns.map((campaign) => (
              <div key={campaign.id} className="rounded-lg border border-zinc-800 p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{campaign.name}</p>
                  <Badge variant="secondary" className="capitalize">
                    {campaign.status}
                  </Badge>
                </div>
                <p className="text-xs text-zinc-500 mt-1">
                  {campaign.channel} · {campaign.audience}
                </p>
                <p className="text-xs text-amber-400 mt-1">
                  {campaign.discount_type === "percent"
                    ? `${campaign.discount_value}%`
                    : formatCurrency(campaign.discount_value)}
                  {" · "}
                  Bonus referral {formatCurrency(campaign.referral_bonus)}
                </p>
              </div>
            ))}
          {!isLoading && campaigns.length === 0 && (
            <p className="text-sm text-zinc-500">Nessuna campagna configurata.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
