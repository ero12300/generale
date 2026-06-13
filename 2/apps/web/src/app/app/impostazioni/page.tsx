import { getAuthContext, getSupabaseClient } from "@/lib/auth/session";
import { isSupabaseConfigured } from "@/lib/utils";
import { demoStore } from "@/lib/demo-store";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckoutButton } from "@/components/billing/checkout-button";

export default async function ImpostazioniPage() {
  let planName = demoStore.planTier.toUpperCase();
  let orgName = demoStore.orgName;
  let subscriptionStatus = "demo";

  if (isSupabaseConfigured()) {
    const auth = await getAuthContext();
    if (auth) {
      orgName = auth.organizationName;
      const supabase = await getSupabaseClient();
      const { data: sub } = await supabase
        .schema("profit")
        .from("subscriptions")
        .select("status, plans(name, tier)")
        .eq("organization_id", auth.organizationId)
        .maybeSingle();
      if (sub) {
        subscriptionStatus = sub.status;
        const plans = sub.plans as { name: string; tier: string } | null;
        planName = plans?.name ?? planName;
      }
    }
  }

  return (
    <div className="space-y-8 max-w-lg">
      <h1 className="text-2xl font-bold">Impostazioni</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Organizzazione</CardTitle>
          <p className="text-sm text-zinc-400 mt-2">{orgName}</p>
          <p className="text-sm text-zinc-500">{demoStore.locationName}</p>
          <p className="text-sm text-emerald-400 mt-2">
            Piano {planName} · {subscriptionStatus}
          </p>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Abbonamento</CardTitle>
          <p className="text-sm text-zinc-400 mt-2">
            Attiva o aggiorna il piano con pagamento sicuro Stripe.
          </p>
          <div className="mt-4 flex gap-2">
            <CheckoutButton tier="pro" label="Attiva Pro" />
            <CheckoutButton tier="premium" label="Attiva Premium" />
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}
