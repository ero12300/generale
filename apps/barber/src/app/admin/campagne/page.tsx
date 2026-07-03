import { CampaignsView } from "./campaigns-view";

export const dynamic = "force-dynamic";

export default function CampagnePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Campagne marketing</h1>
        <p className="mt-1 text-sm text-muted">
          Codici sconto e programma &quot;porta un amico&quot; per riempire l&apos;agenda.
        </p>
      </div>
      <CampaignsView />
    </div>
  );
}
