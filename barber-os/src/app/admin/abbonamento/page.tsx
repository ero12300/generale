import { Suspense } from "react";
import { SubscriptionManager } from "@/components/subscription-manager";

export default function AbbonamentoPage() {
  return (
    <Suspense fallback={<div className="card animate-pulse text-cream-dim">Caricamento…</div>}>
      <SubscriptionManager />
    </Suspense>
  );
}
