"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2, Megaphone, Gift, Percent, Users } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { UpgradeBanner } from "@/components/dashboard/UpgradeBanner";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { useWorkspace } from "@/lib/store/WorkspaceProvider";
import type { CampaignType } from "@/lib/types";
import { formatDate } from "@/lib/format";

export default function CampaignsPage() {
  const ws = useWorkspace();
  const { toast } = useToast();
  const enabled = ws.hasFeature("campaigns");

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState<CampaignType>("discount");
  const [discountPct, setDiscountPct] = useState("15");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");

  const referrals = useMemo(() => {
    return ws.clients
      .filter((c) => c.referredBy)
      .map((c) => ({
        friend: c,
        inviter: ws.clients.find((x) => x.id === c.referredBy),
      }));
  }, [ws.clients]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast("Inserisci il nome della campagna", "error");
    const res = ws.addCampaign({
      name: name.trim(),
      type,
      active: true,
      discountPct: Math.max(0, Math.min(100, Number(discountPct) || 0)),
      code: type === "discount" ? code.trim().toUpperCase() || undefined : undefined,
      description: description.trim() || undefined,
    });
    if (!res.ok) return toast(res.error ?? "Errore", "error");
    toast("Campagna creata", "success");
    setName(""); setType("discount"); setDiscountPct("15"); setCode(""); setDescription("");
    setOpen(false);
  };

  if (!enabled) {
    return (
      <div>
        <PageHeader title="Campagne" subtitle="Sconti e programma porta un amico" />
        <UpgradeBanner message="Le campagne sconti e il programma 'porta un amico' sono incluse nel piano Pro." />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Campagne"
        subtitle="Fai crescere il salone con sconti e referral"
        action={
          <button className="btn-gold" onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4" /> Nuova campagna
          </button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2">
        {ws.campaigns.map((c) => (
          <div key={c.id} className="card p-5">
            <div className="flex items-start justify-between">
              <span className="grid h-10 w-10 place-items-center rounded-xl border border-gold/20 bg-gold/5 text-gold-soft">
                {c.type === "referral" ? <Gift className="h-5 w-5" /> : <Percent className="h-5 w-5" />}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => ws.toggleCampaign(c.id)}
                  className={
                    c.active
                      ? "badge border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                      : "badge border-ink-line text-cream/50"
                  }
                >
                  {c.active ? "Attiva" : "Sospesa"}
                </button>
                <button
                  onClick={() => { ws.removeCampaign(c.id); toast("Campagna eliminata", "info"); }}
                  className="rounded-lg p-2 text-cream/40 transition hover:bg-red-500/10 hover:text-red-400"
                  aria-label={`Elimina ${c.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <h3 className="mt-3 font-display text-lg text-cream">{c.name}</h3>
            <p className="text-sm text-gold-soft">
              -{c.discountPct}% · {c.type === "referral" ? "Porta un amico" : "Sconto"}
              {c.code ? ` · codice ${c.code}` : ""}
            </p>
            {c.description ? <p className="mt-2 text-sm text-cream/50">{c.description}</p> : null}
            <p className="mt-3 text-xs text-cream/35">Creata il {formatDate(c.createdAt)}</p>
          </div>
        ))}
        {ws.campaigns.length === 0 ? (
          <div className="col-span-full card grid place-items-center gap-3 p-12 text-center">
            <Megaphone className="h-10 w-10 text-cream/25" />
            <p className="text-cream/50">Nessuna campagna attiva.</p>
          </div>
        ) : null}
      </div>

      {/* Riepilogo referral */}
      <div className="mt-8">
        <h2 className="mb-3 flex items-center gap-2 font-display text-xl text-cream">
          <Users className="h-5 w-5 text-gold-soft" /> Referral registrati
        </h2>
        <div className="card overflow-hidden">
          {referrals.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-cream/40">
              Ancora nessun referral. Condividi i codici dei clienti dalla scheda cliente.
            </p>
          ) : (
            <div className="divide-y divide-ink-line">
              {referrals.map(({ friend, inviter }) => (
                <div key={friend.id} className="flex items-center justify-between px-5 py-3 text-sm">
                  <span className="text-cream">
                    {friend.firstName} {friend.lastName}
                  </span>
                  <span className="text-cream/50">
                    invitato da{" "}
                    <span className="text-gold-soft">
                      {inviter ? `${inviter.firstName} ${inviter.lastName}` : "—"}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Nuova campagna"
        footer={
          <>
            <button className="btn-ghost" onClick={() => setOpen(false)}>Annulla</button>
            <button className="btn-gold" form="campaign-form" type="submit">Salva</button>
          </>
        }
      >
        <form id="campaign-form" onSubmit={submit} className="space-y-4">
          <div>
            <label className="label" htmlFor="cmp-name">Nome campagna</label>
            <input id="cmp-name" value={name} onChange={(e) => setName(e.target.value)} className="field" placeholder="Es. Sconto Primavera" />
          </div>
          <div>
            <label className="label" htmlFor="cmp-type">Tipo</label>
            <select id="cmp-type" value={type} onChange={(e) => setType(e.target.value as CampaignType)} className="field">
              <option value="discount">Sconto con codice</option>
              <option value="referral">Porta un amico</option>
            </select>
          </div>
          <div>
            <label className="label" htmlFor="cmp-pct">Sconto (%)</label>
            <input id="cmp-pct" type="number" min={0} max={100} value={discountPct} onChange={(e) => setDiscountPct(e.target.value)} className="field" />
          </div>
          {type === "discount" ? (
            <div>
              <label className="label" htmlFor="cmp-code">Codice sconto</label>
              <input id="cmp-code" value={code} onChange={(e) => setCode(e.target.value)} className="field uppercase" placeholder="ESTATE20" />
            </div>
          ) : null}
          <div>
            <label className="label" htmlFor="cmp-desc">Descrizione</label>
            <input id="cmp-desc" value={description} onChange={(e) => setDescription(e.target.value)} className="field" />
          </div>
        </form>
      </Modal>
    </div>
  );
}
