"use client";

import { useState } from "react";
import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PlanTier } from "@/lib/barber-data";

export function CheckoutButton({ planId }: { planId: PlanTier }) {
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  async function startCheckout() {
    setStatus("loading");
    try {
      const response = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      const payload = (await response.json()) as { url?: string };

      if (!response.ok || !payload.url) {
        throw new Error("Checkout non disponibile");
      }

      window.location.href = payload.url;
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="space-y-2">
      <Button onClick={startCheckout} disabled={status === "loading"} className="w-full">
        <CreditCard className="h-4 w-4" aria-hidden />
        {status === "loading" ? "Apertura checkout..." : "Attiva piano"}
      </Button>
      {status === "error" && (
        <p className="text-xs text-red-300" role="alert">
          Checkout non riuscito. Controlla le variabili Stripe su Vercel.
        </p>
      )}
    </div>
  );
}
