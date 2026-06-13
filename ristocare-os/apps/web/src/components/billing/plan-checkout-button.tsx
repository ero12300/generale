"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import type { SubscriptionPlan } from "@ristocare/types";
import { Button } from "@/components/ui/button";

interface PlanCheckoutButtonProps {
  plan: SubscriptionPlan;
  variant?: "default" | "secondary";
  className?: string;
  children: React.ReactNode;
}

export function PlanCheckoutButton({ plan, variant = "default", className, children }: PlanCheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCheckout() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const json = await res.json();
      if (!json.ok || !json.data?.url) {
        throw new Error(json.error ?? "Pagamento non disponibile");
      }
      window.location.href = json.data.url as string;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore durante il checkout");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <Button
        type="button"
        className={className}
        variant={variant}
        disabled={loading}
        onClick={handleCheckout}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Reindirizzamento...
          </>
        ) : (
          children
        )}
      </Button>
      {error && <p className="text-xs text-red-400 text-center">{error}</p>}
    </div>
  );
}
