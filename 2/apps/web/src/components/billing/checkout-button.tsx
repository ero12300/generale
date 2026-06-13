"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { PlanTier } from "@ristoprofit/types";

export function CheckoutButton({
  tier,
  label,
}: {
  tier: PlanTier;
  label?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Errore checkout");
      if (json.url) window.location.href = json.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Button size="sm" onClick={handleCheckout} disabled={loading}>
        {loading ? "..." : label ?? "Abbonati"}
      </Button>
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}
