"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getStore, generateId } from "@/lib/store";
import { PLANS } from "@/lib/plans";
import type { Campaign, CampaignType, ShopSettings } from "@/lib/types";
import { campaignSchema } from "@/lib/types";

type Status = "loading" | "ready" | "error";

export function CampaignsManager() {
  const [status, setStatus] = useState<Status>("loading");
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [settings, setSettings] = useState<ShopSettings | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const [name, setName] = useState("");
  const [type, setType] = useState<CampaignType>("sconto");
  const [code, setCode] = useState("");
  const [discountPct, setDiscountPct] = useState("10");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const store = getStore();
    Promise.all([store.listCampaigns(), store.getSettings()])
      .then(([camps, sett]) => {
        setCampaigns(camps);
        setSettings(sett);
        setStatus("ready");
      })
      .catch(() => {
        setErrorMsg("Impossibile caricare le campagne.");
        setStatus("error");
      });
  }, []);

  const proRequired = settings !== null && !PLANS[settings.plan].campaigns;

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    const campaign: Campaign = {
      id: generateId(),
      name: name.trim(),
      type,
      code: code.trim().toUpperCase(),
      discountPct: Number(discountPct),
      active: true,
      uses: 0,
      createdAt: new Date().toISOString(),
    };
    const parsed = campaignSchema.safeParse(campaign);
    if (!parsed.success) {
      setErrorMsg(parsed.error.issues[0]?.message ?? "Dati non validi.");
      return;
    }
    if (campaigns.some((c) => c.code.toUpperCase() === parsed.data.code)) {
      setErrorMsg("Esiste già una campagna con questo codice.");
      return;
    }
    setSaving(true);
    try {
      await getStore().saveCampaign(parsed.data);
      setCampaigns((prev) => [...prev, parsed.data]);
      setName("");
      setCode("");
      setDiscountPct("10");
    } catch {
      setErrorMsg("Errore durante il salvataggio.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(campaign: Campaign) {
    const updated = { ...campaign, active: !campaign.active };
    try {
      await getStore().saveCampaign(updated);
      setCampaigns((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    } catch {
      setErrorMsg("Errore durante l'aggiornamento.");
    }
  }

  async function handleDelete(id: string) {
    try {
      await getStore().deleteCampaign(id);
      setCampaigns((prev) => prev.filter((c) => c.id !== id));
    } catch {
      setErrorMsg("Errore durante l'eliminazione.");
    }
  }

  if (status === "loading") {
    return <div className="card animate-pulse text-cream-dim">Caricamento campagne…</div>;
  }
  if (status === "error" && campaigns.length === 0) {
    return <div className="card border-red-500/40 text-red-300">{errorMsg}</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold">Campagne sconto</h1>
        <p className="mt-1 text-cream-dim">
          Codici sconto e programmi &quot;porta un amico&quot;: i clienti li inseriscono
          in fase di prenotazione.
        </p>
      </div>

      {proRequired ? (
        <div className="card border-gold/50 text-center">
          <span aria-hidden className="text-4xl">👑</span>
          <h2 className="font-display mt-3 text-2xl font-bold">Funzione Pro</h2>
          <p className="mx-auto mt-2 max-w-md text-cream-dim">
            Le campagne sconto e il programma porta un amico sono incluse nel piano
            Pro. Sblocca clienti illimitati e strumenti marketing per far crescere il
            tuo salone.
          </p>
          <Link href="/admin/abbonamento" className="btn-gold mt-6">
            Passa a Pro — 29€/mese
          </Link>
        </div>
      ) : (
        <>
          <form onSubmit={handleAdd} className="card space-y-4" aria-label="Nuova campagna">
            <h2 className="font-display text-xl font-semibold">Crea una campagna</h2>
            <div className="grid gap-4 sm:grid-cols-4">
              <div>
                <label htmlFor="k-nome" className="label">Nome campagna</label>
                <input id="k-nome" className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Sconto estate" required />
              </div>
              <div>
                <label htmlFor="k-tipo" className="label">Tipo</label>
                <select id="k-tipo" className="input" value={type} onChange={(e) => setType(e.target.value as CampaignType)}>
                  <option value="sconto">Codice sconto</option>
                  <option value="referral">Porta un amico</option>
                </select>
              </div>
              <div>
                <label htmlFor="k-codice" className="label">Codice</label>
                <input id="k-codice" className="input uppercase" value={code} onChange={(e) => setCode(e.target.value)} placeholder="ESTATE20" required />
              </div>
              <div>
                <label htmlFor="k-sconto" className="label">Sconto %</label>
                <input id="k-sconto" type="number" min={1} max={100} className="input" value={discountPct} onChange={(e) => setDiscountPct(e.target.value)} required />
              </div>
            </div>
            <p className="text-xs text-cream-dim">
              Suggerimento: per il tipo &quot;porta un amico&quot; lo sconto si applica anche
              quando il cliente inserisce il codice personale di un altro cliente.
            </p>
            {errorMsg && (
              <p role="alert" className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {errorMsg}
              </p>
            )}
            <button type="submit" className="btn-gold" disabled={saving}>
              {saving ? "Salvataggio…" : "Crea campagna"}
            </button>
          </form>

          {campaigns.length === 0 ? (
            <div className="card text-center text-cream-dim">
              Nessuna campagna attiva. Creane una qui sopra.
            </div>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2">
              {campaigns.map((campaign) => (
                <li key={campaign.id} className={`card ${campaign.active ? "" : "opacity-60"}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{campaign.name}</p>
                      <p className="text-sm text-cream-dim">
                        {campaign.type === "referral" ? "Porta un amico" : "Codice sconto"} ·{" "}
                        -{campaign.discountPct}% · usata {campaign.uses}{" "}
                        {campaign.uses === 1 ? "volta" : "volte"}
                      </p>
                    </div>
                    <span className="rounded-full border border-gold/40 bg-gold/10 px-3 py-1 font-mono text-sm font-bold text-gold">
                      {campaign.code}
                    </span>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      className="btn-outline !px-4 !py-2 !text-xs"
                      onClick={() => toggleActive(campaign)}
                    >
                      {campaign.active ? "Disattiva" : "Riattiva"}
                    </button>
                    <button
                      type="button"
                      className="btn-outline !border-red-400/50 !px-4 !py-2 !text-xs !text-red-300 hover:!bg-red-500/10"
                      onClick={() => handleDelete(campaign.id)}
                    >
                      Elimina
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
