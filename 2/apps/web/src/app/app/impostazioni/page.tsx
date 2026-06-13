import { getAuthContext, getSupabaseClient } from "@/lib/auth/session";
import { isSupabaseConfigured } from "@/lib/utils";
import { demoStore } from "@/lib/demo-store";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
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
        .select("status, plan:plans(name, tier)")
        .eq("organization_id", auth.organizationId)
        .maybeSingle();
      if (sub) {
        subscriptionStatus = sub.status;
        const plan = sub.plan as { name: string; tier: string } | { name: string; tier: string }[] | null;
        const planRow = Array.isArray(plan) ? plan[0] : plan;
        planName = planRow?.name ?? planName;
      }
    }
  }

  return (
    <PageContainer className="max-w-lg">
      <PageHeader
        eyebrow="Account"
        title="Impostazioni"
        subtitle="Organizzazione e abbonamento"
      />
      <Card glow>
        <CardHeader>
          <CardTitle>Organizzazione</CardTitle>
          <p className="text-sm text-zinc-400 mt-2">{orgName}</p>
          <p className="text-sm text-zinc-500">{demoStore.locationName}</p>
          <p className="text-sm text-emerald-700 mt-3 font-medium">
            Piano {planName} · {subscriptionStatus}
          </p>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Abbonamento</CardTitle>
          <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
            Attiva o aggiorna il piano con pagamento sicuro Stripe.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <CheckoutButton tier="pro" label="Attiva Pro" />
            <CheckoutButton tier="premium" label="Attiva Premium" />
          </div>
        </CardHeader>
      </Card>
    </PageContainer>
  );
}
