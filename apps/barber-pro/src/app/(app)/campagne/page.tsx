import { listCoupons, listReferrals, listClients, getShop } from "@/lib/data/repo";
import { CampaignsView } from "@/components/campaigns/CampaignsView";
import { PLANS } from "@/lib/plans";

export default async function CampagnePage() {
  const [coupons, referrals, clients, shop] = await Promise.all([
    listCoupons(),
    listReferrals(),
    listClients(),
    getShop(),
  ]);
  const plan = PLANS[shop?.plan ?? "free"];
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl gold-shine">Campagne</h1>
        <p className="text-ink-400 text-sm mt-1">
          Codici sconto e programma "porta un amico". Fai lavorare il marketing per te.
        </p>
      </div>
      <CampaignsView
        coupons={coupons}
        referrals={referrals}
        clients={clients}
        canUseCampaigns={plan.limits.canUseCampaigns}
        canUseReferral={plan.limits.canUseReferral}
      />
    </div>
  );
}
