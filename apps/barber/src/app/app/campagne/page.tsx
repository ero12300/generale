import Link from "next/link";
import { Crown } from "lucide-react";
import { getStore } from "@/lib/store";
import { planAllows } from "@/lib/plans";
import { formatEuro } from "@/lib/money";
import { Badge, buttonPrimary, Card, CardTitle } from "@/components/ui";
import { CampaignForm } from "@/components/forms/CampaignForm";
import { CampaignToggle } from "@/components/CampaignToggle";

export const dynamic = "force-dynamic";

export default async function CampagnePage() {
  const store = await getStore();
  const [campaigns, shop] = await Promise.all([
    store.listCampaigns(),
    store.getShop(),
  ]);
  const isPro = planAllows(shop.plan, "campaigns");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-cream">Campagne</h1>
        <p className="mt-1 text-sm text-muted">
          Sconti e Porta un Amico per riempire le poltrone nei giorni fiacchi.
        </p>
      </div>

      {!isPro ? (
        <Card className="gold-ring border-gold/50">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Crown className="h-8 w-8 text-gold-bright" aria-hidden />
              <div>
                <p className="font-display text-lg text-cream">
                  Le campagne sono una funzione Pro
                </p>
                <p className="text-sm text-muted">
                  Passa a Pro per creare sconti e campagne Porta un Amico
                  illimitate.
                </p>
              </div>
            </div>
            <Link href="/app/abbonamento" className={buttonPrimary}>
              Passa a Pro
            </Link>
          </div>
        </Card>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-5">
        {isPro ? (
          <Card className="lg:col-span-2">
            <CardTitle>Nuova campagna</CardTitle>
            <CampaignForm />
          </Card>
        ) : null}

        <Card className={isPro ? "lg:col-span-3" : "lg:col-span-5"}>
          <CardTitle>Campagne esistenti</CardTitle>
          {campaigns.length === 0 ? (
            <p className="text-sm text-muted">Nessuna campagna creata.</p>
          ) : (
            <ul className="space-y-3">
              {campaigns.map((c) => (
                <li
                  key={c.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-panel-2 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-cream">{c.name}</p>
                    <p className="text-xs text-muted">
                      {c.kind === "referral" ? "Porta un Amico" : "Sconto"}
                      {c.discountPercent ? ` · -${c.discountPercent}%` : ""}
                      {c.discountCents
                        ? ` · -${formatEuro(c.discountCents)}`
                        : ""}
                      {c.referrerRewardCents
                        ? ` · premio ${formatEuro(c.referrerRewardCents)}`
                        : ""}
                      {` · ${c.redemptions} utilizzi`}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge tone={c.active ? "green" : "muted"}>
                      {c.active ? "attiva" : "spenta"}
                    </Badge>
                    {isPro ? (
                      <CampaignToggle campaignId={c.id} active={c.active} />
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
