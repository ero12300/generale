import { Check } from "lucide-react";
import { getStore } from "@/lib/store";
import { isStripeConfigured } from "@/lib/stripe";
import { PLANS } from "@/lib/plans";
import { formatEuro } from "@/lib/money";
import { Card } from "@/components/ui";
import { PlanCheckoutButton } from "@/components/PlanCheckoutButton";

export const dynamic = "force-dynamic";

export default async function AbbonamentoPage({
  searchParams,
}: {
  searchParams: Promise<{ esito?: string }>;
}) {
  const store = await getStore();
  const shop = await store.getShop();
  const { esito } = await searchParams;
  const stripeReady = isStripeConfigured();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-cream">Abbonamento</h1>
        <p className="mt-1 text-sm text-muted">
          Gestisci il piano del tuo salone. Pagamenti sicuri con Stripe.
        </p>
      </div>

      {esito === "ok" ? (
        <p className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          Pagamento completato! Il piano verrà aggiornato automaticamente dal
          webhook Stripe.
        </p>
      ) : null}
      {esito === "annullato" ? (
        <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          Pagamento annullato. Nessun addebito effettuato.
        </p>
      ) : null}

      {!stripeReady ? (
        <Card>
          <p className="text-sm text-muted">
            <span className="font-semibold text-gold-bright">
              Modalità demo:
            </span>{" "}
            Stripe non è configurato, quindi il cambio piano è immediato e
            gratuito. In produzione imposta{" "}
            <code className="rounded bg-panel-2 px-1.5 py-0.5 text-xs">
              STRIPE_SECRET_KEY
            </code>
            ,{" "}
            <code className="rounded bg-panel-2 px-1.5 py-0.5 text-xs">
              STRIPE_WEBHOOK_SECRET
            </code>{" "}
            e i price ID per attivare i pagamenti reali in abbonamento.
          </p>
        </Card>
      ) : null}

      <div className="grid gap-6 md:grid-cols-2">
        {Object.values(PLANS).map((plan) => (
          <div
            key={plan.id}
            className={
              plan.id === "pro"
                ? "gold-ring rounded-3xl border border-gold/50 bg-panel p-7"
                : "rounded-3xl border border-line bg-panel p-7"
            }
          >
            <h2 className="font-display text-2xl text-cream">{plan.name}</h2>
            <p className="mt-1 text-sm text-muted">{plan.tagline}</p>
            <p className="mt-5">
              <span className="font-display text-4xl text-gold-bright">
                {formatEuro(plan.priceMonthlyCents)}
              </span>
              <span className="text-sm text-muted"> /mese</span>
            </p>
            <ul className="mt-6 space-y-2.5">
              {plan.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-2.5 text-sm text-cream/90"
                >
                  <Check
                    className="mt-0.5 h-4 w-4 shrink-0 text-gold-bright"
                    aria-hidden
                  />
                  {feature}
                </li>
              ))}
            </ul>
            <div className="mt-7">
              <PlanCheckoutButton
                plan={plan.id}
                isCurrent={shop.plan === plan.id}
                primary={plan.id === "pro"}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
