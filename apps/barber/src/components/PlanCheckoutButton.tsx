"use client";

import { useState, useTransition } from "react";
import { startCheckout, type ActionResult } from "@/app/actions";
import { ActionMessage } from "@/components/ActionMessage";
import { buttonGhost, buttonPrimary } from "@/components/ui";
import type { PlanId } from "@/lib/types";

export function PlanCheckoutButton({
  plan,
  isCurrent,
  primary,
}: {
  plan: PlanId;
  isCurrent: boolean;
  primary: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<ActionResult | null>(null);

  if (isCurrent) {
    return (
      <p className="rounded-lg border border-gold/40 bg-gold/10 px-4 py-2.5 text-center text-sm font-medium text-gold-bright">
        Piano attuale
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        disabled={pending}
        className={`${primary ? buttonPrimary : buttonGhost} w-full`}
        onClick={() =>
          startTransition(async () => {
            setResult(await startCheckout(plan));
          })
        }
      >
        {pending
          ? "Attivazione…"
          : plan === "pro"
            ? "Passa a Pro"
            : "Torna a Base"}
      </button>
      <ActionMessage result={result} />
    </div>
  );
}
