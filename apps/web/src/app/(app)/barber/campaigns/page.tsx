import { CampaignsManager } from "@/components/barber/campaigns-manager";

export default function BarberCampaignsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Campagne sconto & referral</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Crea promozioni “porta un amico” e offerte segmentate per aumentare il ritorno clienti.
        </p>
      </div>
      <CampaignsManager />
    </div>
  );
}
