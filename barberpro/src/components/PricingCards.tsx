import Link from "next/link";
import { Check, X, Sparkles } from "lucide-react";
import { PLAN_LIST } from "@/lib/plans";
import { formatCents, cn } from "@/lib/format";

export function PricingCards({ ctaHref = "/login" }: { ctaHref?: string }) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {PLAN_LIST.map((plan) => (
        <div
          key={plan.id}
          className={cn(
            "card relative flex flex-col p-7",
            plan.highlighted && "border-gold/50 shadow-gold",
          )}
        >
          {plan.highlighted ? (
            <span className="badge absolute -top-3 left-7 border-gold/50 bg-gold-gradient text-ink">
              <Sparkles className="h-3.5 w-3.5" /> Più scelto
            </span>
          ) : null}
          <h3 className="font-display text-2xl text-cream">{plan.name}</h3>
          <p className="mt-1 text-sm text-cream/50">{plan.tagline}</p>
          <div className="mt-5 flex items-end gap-1">
            <span className="font-display text-4xl font-semibold text-cream">
              {plan.priceCents === 0 ? "Gratis" : formatCents(plan.priceCents)}
            </span>
            {plan.priceCents > 0 ? <span className="mb-1 text-sm text-cream/50">/mese</span> : null}
          </div>
          <ul className="mt-6 flex-1 space-y-3">
            {plan.features.map((f) => (
              <li key={f.label} className="flex items-start gap-3 text-sm">
                {f.included ? (
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-soft" />
                ) : (
                  <X className="mt-0.5 h-4 w-4 shrink-0 text-cream/25" />
                )}
                <span className={f.included ? "text-cream/85" : "text-cream/35"}>{f.label}</span>
              </li>
            ))}
          </ul>
          <Link
            href={ctaHref}
            className={cn("mt-7 w-full", plan.highlighted ? "btn-gold" : "btn-outline-gold")}
          >
            {plan.cta}
          </Link>
        </div>
      ))}
    </div>
  );
}
