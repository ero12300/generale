"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getCampaigns, createCampaign, updateCampaign, deleteCampaign } from "@/lib/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Campaign, CampaignType } from "@/types";
import {
  Plus, X, Tag, Gift, Star, Megaphone, Trash2, Edit,
  ToggleLeft, ToggleRight, Copy, Check, Users, Percent,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

const typeInfo: Record<CampaignType, { label: string; icon: React.ElementType; color: string }> = {
  discount: { label: "Sconto", icon: Tag, color: "text-yellow-400" },
  referral: { label: "Porta un amico", icon: Users, color: "text-blue-400" },
  loyalty: { label: "Fidelizzazione", icon: Star, color: "text-purple-400" },
  seasonal: { label: "Stagionale", icon: Gift, color: "text-green-400" },
};

export default function CampaignsPage() {
  const { shop } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!shop?.id) return;
    setLoading(true);
    setCampaigns(await getCampaigns(shop.id));
    setLoading(false);
  }, [shop?.id]);

  useEffect(() => { load(); }, [load]);

  const handleToggle = async (campaign: Campaign) => {
    await updateCampaign(campaign.id, { active: !campaign.active });
    setCampaigns((p) => p.map((c) => (c.id === campaign.id ? { ...c, active: !c.active } : c)));
    toast.success(campaign.active ? "Campagna disattivata" : "Campagna attivata");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Eliminare questa campagna?")) return;
    await deleteCampaign(id);
    setCampaigns((p) => p.filter((c) => c.id !== id));
    toast.success("Campagna eliminata");
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
    toast.success("Codice copiato!");
  };

  const isPro = shop?.plan === "pro" || shop?.plan === "enterprise";

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Campagne</h1>
          <p className="text-sm text-[var(--muted)]">Sconti, referral e fidelizzazione</p>
        </div>
        <Button
          variant="gold"
          onClick={() => { if (!isPro) { toast.error("Funzione riservata al piano Pro"); return; } setEditingCampaign(null); setShowModal(true); }}
        >
          <Plus className="w-4 h-4" /> Nuova campagna
        </Button>
      </div>

      {/* Pro Gate */}
      {!isPro && (
        <div className="relative overflow-hidden rounded-xl border border-[var(--primary)]/30 bg-gradient-to-r from-[var(--primary)]/5 to-transparent p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Star className="w-4 h-4 fill-[var(--primary)] text-[var(--primary)]" />
                <span className="text-xs font-semibold text-[var(--primary)] uppercase tracking-wider">Pro Feature</span>
              </div>
              <p className="font-bold text-[var(--foreground)]">Sblocca le Campagne con Pro</p>
              <p className="text-sm text-[var(--muted)] mt-1">
                Crea codici sconto, campagne "Porta un amico", offerte stagionali e programmi fedeltà
              </p>
            </div>
            <a href="/dashboard/subscription" className="shrink-0 px-5 py-2.5 rounded-lg bg-gradient-to-r from-[var(--primary-dark)] to-[var(--primary)] text-black font-semibold text-sm hover:opacity-90 transition-opacity">
              Upgrade a Pro
            </a>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-[var(--muted)] uppercase tracking-wider">Totali</p>
            <p className="text-2xl font-bold mt-1">{campaigns.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-[var(--muted)] uppercase tracking-wider">Attive</p>
            <p className="text-2xl font-bold mt-1 text-green-400">{campaigns.filter((c) => c.active).length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-[var(--muted)] uppercase tracking-wider">Utilizzi totali</p>
            <p className="text-2xl font-bold mt-1 text-[var(--primary)]">{campaigns.reduce((s, c) => s + c.usedCount, 0)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Templates (quick start) */}
      {campaigns.length === 0 && isPro && (
        <div>
          <p className="text-sm text-[var(--muted)] mb-3 font-medium">Inizia da un template</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { type: "discount" as CampaignType, label: "Sconto 10%", desc: "Per tutti i clienti", code: "SCONTO10", value: 10, dType: "percentage" as const },
              { type: "referral" as CampaignType, label: "Porta un amico", desc: "€5 di sconto al referral", code: "AMICO5", value: 500, dType: "fixed" as const },
              { type: "loyalty" as CampaignType, label: "Cliente fedele", desc: "Sconto dopo 5 visite", code: "FEDELE15", value: 15, dType: "percentage" as const },
              { type: "seasonal" as CampaignType, label: "Estate 2025", desc: "Offerta stagionale", code: "ESTATE25", value: 20, dType: "percentage" as const },
            ].map((tmpl) => {
              const { icon: Icon, color } = typeInfo[tmpl.type];
              return (
                <button
                  key={tmpl.code}
                  onClick={async () => {
                    const c = await createCampaign({
                      shopId: shop!.id,
                      name: tmpl.label,
                      description: tmpl.desc,
                      type: tmpl.type,
                      code: tmpl.code,
                      discountType: tmpl.dType,
                      discountValue: tmpl.value,
                      validFrom: format(new Date(), "yyyy-MM-dd"),
                      active: true,
                    });
                    setCampaigns((p) => [c, ...p]);
                    toast.success("Campagna creata!");
                  }}
                  className="p-4 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)]/40 transition-all text-left group"
                >
                  <Icon className={`w-6 h-6 ${color} mb-3`} />
                  <p className="text-sm font-semibold text-[var(--foreground)]">{tmpl.label}</p>
                  <p className="text-xs text-[var(--muted)] mt-0.5">{tmpl.desc}</p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Campaign List */}
      <div className="space-y-3">
        {loading ? (
          [...Array(3)].map((_, i) => <Card key={i} className="h-24 shimmer" />)
        ) : campaigns.length === 0 && !isPro ? null : campaigns.map((campaign) => {
          const { label, icon: Icon, color } = typeInfo[campaign.type];
          return (
            <div
              key={campaign.id}
              className={`flex gap-4 p-4 rounded-xl border transition-all ${
                campaign.active
                  ? "border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)]/30"
                  : "border-[var(--border)] bg-[var(--accent)] opacity-60"
              }`}
            >
              <div className={`w-10 h-10 rounded-xl bg-[var(--accent)] flex items-center justify-center shrink-0`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-[var(--foreground)] text-sm">{campaign.name}</p>
                      <Badge variant={campaign.active ? "success" : "default"} className="text-xs">
                        {campaign.active ? "Attiva" : "Inattiva"}
                      </Badge>
                    </div>
                    <p className="text-xs text-[var(--muted)] mt-0.5">{campaign.description}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => handleToggle(campaign)} className="text-[var(--muted)] hover:text-[var(--primary)] transition-colors">
                      {campaign.active
                        ? <ToggleRight className="w-5 h-5 text-[var(--primary)]" />
                        : <ToggleLeft className="w-5 h-5" />}
                    </button>
                    <Button size="icon" variant="ghost" onClick={() => { setEditingCampaign(campaign); setShowModal(true); }}>
                      <Edit className="w-3.5 h-3.5" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(campaign.id)}>
                      <Trash2 className="w-3.5 h-3.5 text-red-400" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-3">
                  {campaign.code && (
                    <div className="flex items-center gap-2">
                      <code className="text-xs font-mono font-bold text-[var(--primary)] bg-[var(--primary)]/10 px-2 py-0.5 rounded">
                        {campaign.code}
                      </code>
                      <button onClick={() => copyCode(campaign.code!)} className="text-[var(--muted)] hover:text-[var(--primary)] transition-colors">
                        {copiedCode === campaign.code
                          ? <Check className="w-3.5 h-3.5 text-green-400" />
                          : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  )}
                  <span className="text-xs text-[var(--muted)]">
                    <Percent className="w-3 h-3 inline mr-0.5" />
                    {campaign.discountType === "percentage"
                      ? `${campaign.discountValue}% di sconto`
                      : `${formatCurrency(campaign.discountValue * 100)} di sconto`}
                  </span>
                  <span className="text-xs text-[var(--muted)]">
                    Usato {campaign.usedCount}
                    {campaign.maxUses ? `/${campaign.maxUses}` : ""} volte
                  </span>
                  {campaign.validTo && (
                    <span className="text-xs text-[var(--muted)]">
                      Scade: {formatDate(campaign.validTo)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showModal && shop && (
        <CampaignModal
          shop={shop}
          campaign={editingCampaign}
          onClose={() => setShowModal(false)}
          onSaved={async (c) => {
            if (editingCampaign) {
              setCampaigns((p) => p.map((x) => (x.id === c.id ? c : x)));
            } else {
              setCampaigns((p) => [c, ...p]);
            }
            setShowModal(false);
            toast.success(editingCampaign ? "Campagna aggiornata" : "Campagna creata!");
          }}
        />
      )}
    </div>
  );
}

function CampaignModal({
  shop,
  campaign,
  onClose,
  onSaved,
}: {
  shop: any;
  campaign: Campaign | null;
  onClose: () => void;
  onSaved: (c: Campaign) => void;
}) {
  const [form, setForm] = useState({
    name: campaign?.name ?? "",
    description: campaign?.description ?? "",
    type: campaign?.type ?? ("discount" as CampaignType),
    code: campaign?.code ?? "",
    discountType: campaign?.discountType ?? ("percentage" as const),
    discountValue: String(campaign?.discountValue ?? "10"),
    maxUses: String(campaign?.maxUses ?? ""),
    validFrom: campaign?.validFrom ?? format(new Date(), "yyyy-MM-dd"),
    validTo: campaign?.validTo ?? "",
    active: campaign?.active ?? true,
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) return;
    setSaving(true);
    try {
      const data = {
        shopId: shop.id,
        name: form.name,
        description: form.description || undefined,
        type: form.type,
        code: form.code.toUpperCase() || undefined,
        discountType: form.discountType,
        discountValue: Number(form.discountValue),
        maxUses: form.maxUses ? Number(form.maxUses) : undefined,
        validFrom: form.validFrom,
        validTo: form.validTo || undefined,
        active: form.active,
      };
      if (campaign) {
        await updateCampaign(campaign.id, data);
        onSaved({ ...campaign, ...data });
      } else {
        const newCampaign = await createCampaign(data);
        onSaved(newCampaign);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold">{campaign ? "Modifica campagna" : "Nuova campagna"}</h2>
          <Button size="icon" variant="ghost" onClick={onClose}><X className="w-4 h-4" /></Button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Nome *" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
          <Textarea label="Descrizione" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
          <Select
            label="Tipo"
            value={form.type}
            onChange={(e) => setForm((p) => ({ ...p, type: e.target.value as CampaignType }))}
            options={[
              { value: "discount", label: "Sconto generico" },
              { value: "referral", label: "Porta un amico" },
              { value: "loyalty", label: "Fidelizzazione" },
              { value: "seasonal", label: "Stagionale" },
            ]}
          />
          <Input
            label="Codice coupon"
            value={form.code}
            onChange={(e) => setForm((p) => ({ ...p, code: e.target.value.toUpperCase() }))}
            placeholder="PROMO2025"
          />
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Tipo sconto"
              value={form.discountType}
              onChange={(e) => setForm((p) => ({ ...p, discountType: e.target.value as "percentage" | "fixed" }))}
              options={[
                { value: "percentage", label: "Percentuale (%)" },
                { value: "fixed", label: "Fisso (€)" },
              ]}
            />
            <Input
              label={form.discountType === "percentage" ? "Valore %" : "Valore €"}
              type="number"
              value={form.discountValue}
              onChange={(e) => setForm((p) => ({ ...p, discountValue: e.target.value }))}
              min="0"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Valido dal" type="date" value={form.validFrom} onChange={(e) => setForm((p) => ({ ...p, validFrom: e.target.value }))} />
            <Input label="Valido fino al" type="date" value={form.validTo} onChange={(e) => setForm((p) => ({ ...p, validTo: e.target.value }))} />
          </div>
          <Input label="Numero max utilizzi" type="number" value={form.maxUses} onChange={(e) => setForm((p) => ({ ...p, maxUses: e.target.value }))} placeholder="Illimitato" />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Annulla</Button>
            <Button type="submit" variant="gold" className="flex-1" loading={saving}>
              {campaign ? "Aggiorna" : "Crea campagna"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
