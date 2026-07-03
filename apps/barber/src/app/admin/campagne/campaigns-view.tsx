"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  CircleAlert,
  Gift,
  Loader2,
  Lock,
  Megaphone,
  Plus,
  X,
} from "lucide-react";
import type { Campaign, CampaignType } from "@/lib/types";
import { cn } from "@/lib/cn";

export function CampaignsView() {
  const [campaigns, setCampaigns] = useState<Campaign[] | null>(null);
  const [locked, setLocked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [type, setType] = useState<CampaignType>("sconto");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [percentOff, setPercentOff] = useState("10");
  const [validUntil, setValidUntil] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const load = useCallback(() => {
    fetch("/api/campaigns")
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data) => {
        setCampaigns(data.campaigns);
        setLocked(data.locked);
      })
      .catch(() => setError("Impossibile caricare le campagne."));
  }, []);

  useEffect(load, [load]);

  async function createCampaign(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          name,
          code,
          percentOff: parseInt(percentOff, 10),
          validUntil: validUntil || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error ?? "Errore nel salvataggio.");
        return;
      }
      setName("");
      setCode("");
      setPercentOff("10");
      setValidUntil("");
      setShowForm(false);
      load();
    } catch {
      setFormError("Connessione non riuscita.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(campaign: Campaign) {
    await fetch("/api/campaigns", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: campaign.id, active: !campaign.active }),
    });
    load();
  }

  if (error) {
    return (
      <p className="flex items-center gap-2 rounded-2xl border border-danger/40 bg-surface p-5 text-danger">
        <CircleAlert className="h-5 w-5" aria-hidden /> {error}
      </p>
    );
  }

  if (!campaigns) {
    return (
      <p className="flex items-center gap-2 text-muted">
        <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> Caricamento
        campagne…
      </p>
    );
  }

  if (locked) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-gold-dim/50 bg-surface p-12 text-center">
        <Lock className="h-10 w-10 text-gold" aria-hidden />
        <h2 className="font-display text-2xl font-bold">
          Le campagne sono una funzione Pro
        </h2>
        <p className="max-w-md text-muted">
          Crea codici sconto illimitati, attiva il programma &quot;porta un
          amico&quot; e monitora quante prenotazioni genera ogni campagna.
        </p>
        <Link
          href="/admin/abbonamento"
          className="rounded-full bg-gold px-7 py-3 font-bold text-background transition-colors hover:bg-gold-soft"
        >
          Passa a Pro — €49/mese
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <button
        type="button"
        onClick={() => setShowForm((v) => !v)}
        className="flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-bold text-background transition-colors hover:bg-gold-soft"
      >
        {showForm ? <X className="h-4 w-4" aria-hidden /> : <Plus className="h-4 w-4" aria-hidden />}
        {showForm ? "Chiudi" : "Nuova campagna"}
      </button>

      {showForm && (
        <form
          onSubmit={createCampaign}
          className="rounded-2xl border border-gold-dim/50 bg-surface p-5"
          aria-label="Crea nuova campagna"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <select
              value={type}
              onChange={(e) => setType(e.target.value as CampaignType)}
              className="rounded-xl border border-border bg-surface-2 px-4 py-2.5 text-sm"
              aria-label="Tipo campagna"
            >
              <option value="sconto">Codice sconto</option>
              <option value="referral">Porta un amico</option>
            </select>
            <input
              required
              minLength={2}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome campagna (es. Promo Estate) *"
              className="rounded-xl border border-border bg-surface-2 px-4 py-2.5 text-sm placeholder:text-muted/60"
            />
            <input
              required
              minLength={3}
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Codice (es. ESTATE20) *"
              className="rounded-xl border border-border bg-surface-2 px-4 py-2.5 text-sm uppercase tracking-widest placeholder:normal-case placeholder:tracking-normal placeholder:text-muted/60"
            />
            <label className="flex items-center gap-3 rounded-xl border border-border bg-surface-2 px-4 py-2.5 text-sm">
              <span className="text-muted">Sconto %</span>
              <input
                required
                type="number"
                min={1}
                max={100}
                value={percentOff}
                onChange={(e) => setPercentOff(e.target.value)}
                className="w-full bg-transparent"
                aria-label="Percentuale di sconto"
              />
            </label>
            <label className="flex items-center gap-3 rounded-xl border border-border bg-surface-2 px-4 py-2.5 text-sm sm:col-span-2">
              <span className="whitespace-nowrap text-muted">Valida fino al</span>
              <input
                type="date"
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
                className="w-full bg-transparent"
                aria-label="Data di scadenza"
              />
            </label>
          </div>
          {formError && (
            <p className="mt-3 flex items-center gap-2 text-sm text-danger" role="alert">
              <CircleAlert className="h-4 w-4" aria-hidden /> {formError}
            </p>
          )}
          <button
            type="submit"
            disabled={saving}
            className="mt-4 flex items-center gap-2 rounded-full bg-gold px-6 py-2.5 text-sm font-bold text-background transition-colors hover:bg-gold-soft disabled:opacity-60"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
            Crea campagna
          </button>
        </form>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {campaigns.map((c) => (
          <article
            key={c.id}
            className={cn(
              "rounded-2xl border bg-surface p-5",
              c.active ? "border-border" : "border-border opacity-60",
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-2">
                  {c.type === "referral" ? (
                    <Gift className="h-5 w-5 text-gold" aria-hidden />
                  ) : (
                    <Megaphone className="h-5 w-5 text-gold" aria-hidden />
                  )}
                </span>
                <div>
                  <h3 className="font-semibold">{c.name}</h3>
                  <p className="text-xs uppercase tracking-wider text-muted">
                    {c.type === "referral" ? "Porta un amico" : "Codice sconto"}
                  </p>
                </div>
              </div>
              <span className="font-display text-2xl font-bold text-gold-soft">
                −{c.percentOff}%
              </span>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <code className="rounded-md bg-surface-2 px-3 py-1.5 text-sm font-bold tracking-widest text-gold-soft">
                {c.code}
              </code>
              <p className="text-sm text-muted">
                <strong className="text-foreground">{c.usageCount}</strong> utilizzi
                {c.validUntil && ` · scade il ${c.validUntil}`}
              </p>
            </div>
            <button
              type="button"
              onClick={() => toggleActive(c)}
              className={cn(
                "mt-4 rounded-full border px-4 py-1.5 text-xs font-bold transition-colors",
                c.active
                  ? "border-border text-muted hover:border-danger hover:text-danger"
                  : "border-gold-dim text-gold-soft hover:bg-gold hover:text-background",
              )}
            >
              {c.active ? "Disattiva" : "Riattiva"}
            </button>
          </article>
        ))}
        {campaigns.length === 0 && (
          <p className="rounded-2xl border border-border bg-surface p-8 text-center text-muted md:col-span-2">
            Nessuna campagna ancora. Creane una per attirare nuovi clienti!
          </p>
        )}
      </div>
    </div>
  );
}
