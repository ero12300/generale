import { Suspense } from "react";
import { BillingView } from "./billing-view";

export const dynamic = "force-dynamic";

export default function AbbonamentoPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Abbonamento</h1>
        <p className="mt-1 text-sm text-muted">
          Gestisci il tuo piano BarberOS. Pagamenti sicuri con Stripe.
        </p>
      </div>
      <Suspense fallback={<p className="text-muted">Caricamento…</p>}>
        <BillingView />
      </Suspense>
    </div>
  );
}
