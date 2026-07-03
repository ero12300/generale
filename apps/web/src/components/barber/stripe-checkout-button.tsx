"use client";

import { useState } from "react";
import type { BarberPlanId } from "@deal-desk/types";
import { Button } from "@/components/ui/button";

export function StripeCheckoutButton({ planId }: { planId: BarberPlanId }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function startCheckout() {
    setLoading(true);
    setMessage(null);
    setError(null);

    const response = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planId }),
    });
    const data = await response.json();

    if (!response.ok) {
      setError(data.error ?? "Checkout non disponibile");
      setLoading(false);
      return;
    }

    if (data.url) {
      window.location.href = data.url;
      return;
    }

    setMessage(data.message ?? "Checkout demo attivo");
    setLoading(false);
  }

  return (
    <div className="space-y-2">
      <Button type="button" onClick={startCheckout} disabled={loading} className="w-full">
        {loading ? "Apro checkout..." : "Attiva abbonamento"}
      </Button>
      {message && <p className="text-xs text-amber-200">{message}</p>}
      {error && (
        <p role="alert" className="text-xs text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}
