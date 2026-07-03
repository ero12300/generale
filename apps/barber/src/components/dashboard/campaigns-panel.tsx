"use client";

import { useEffect, useState } from "react";
import { Gift, Percent, Star, ToggleLeft, ToggleRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { dataStore } from "@/lib/data-store";
import type { Campaign, CampaignType } from "@/lib/types";
import { formatEuro } from "@/lib/utils";

const typeIcons: Record<CampaignType, typeof Percent> = {
  discount: Percent,
  referral: Gift,
  loyalty: Star,
};

const typeLabels: Record<CampaignType, string> = {
  discount: "Sconto",
  referral: "Porta un Amico",
  loyalty: "Fedeltà",
};

export function CampaignsPanel() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const shop = await dataStore.getShop();
      const c = await dataStore.getCampaigns(shop.id);
      setCampaigns(c);
      setLoading(false);
    }
    void load();
  }, []);

  async function handleToggle(id: string) {
    setTogglingId(id);
    const updated = await dataStore.toggleCampaign(id);
    if (updated) {
      setCampaigns((prev) => prev.map((c) => (c.id === id ? updated : c)));
    }
    setTogglingId(null);
  }

  if (loading) {
    return <p className="text-cream/50">Caricamento campagne...</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold mb-1">Campagne Marketing</h1>
        <p className="text-cream/50">
          Sconti, referral e programmi fedeltà per far crescere il salone
        </p>
      </div>

      <div className="rounded-xl border border-gold/20 bg-gold/5 p-6">
        <h3 className="font-display text-lg font-semibold text-gold mb-2">
          Programma Porta un Amico
        </h3>
        <p className="text-sm text-cream/70 mb-4">
          Ogni cliente ha un codice referral univoco. Quando un amico prenota usando il codice,
          entrambi ricevono uno sconto. Attiva la campagna referral per iniziare.
        </p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="success">Attivo su piano Pro</Badge>
          <Badge variant="secondary">8 referral completati</Badge>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {campaigns.map((c) => {
          const Icon = typeIcons[c.type];
          return (
            <Card key={c.id} className={!c.active ? "opacity-60" : ""}>
              <CardHeader className="flex flex-row items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10 border border-gold/20">
                    <Icon className="h-5 w-5 text-gold" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{c.name}</CardTitle>
                    <Badge variant="secondary" className="mt-1">
                      {typeLabels[c.type]}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => void handleToggle(c.id)}
                  disabled={togglingId === c.id}
                  aria-label={c.active ? "Disattiva campagna" : "Attiva campagna"}
                >
                  {c.active ? (
                    <ToggleRight className="h-5 w-5 text-gold" />
                  ) : (
                    <ToggleLeft className="h-5 w-5 text-cream/40" />
                  )}
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-cream/60 mb-4">{c.description}</p>
                <div className="space-y-2 text-sm">
                  {c.discountPercent && (
                    <p>
                      Sconto: <span className="text-gold font-medium">{c.discountPercent}%</span>
                    </p>
                  )}
                  {c.referralRewardCents && (
                    <p>
                      Reward: <span className="text-gold font-medium">{formatEuro(c.referralRewardCents)}</span> a testa
                    </p>
                  )}
                  {c.code && (
                    <p>
                      Codice: <span className="font-mono text-gold">{c.code}</span>
                    </p>
                  )}
                  <p className="text-cream/40">
                    Utilizzi: {c.usageCount}
                    {c.endsAt && ` · Scade ${c.endsAt}`}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
