import { BillingPanel } from "@/components/barber/billing-panel";

export default function BarberBillingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Piani e monetizzazione</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Strategia abbonamento Basic/Pro con checkout Stripe per scalare come SaaS.
        </p>
      </div>
      <BillingPanel />
    </div>
  );
}
