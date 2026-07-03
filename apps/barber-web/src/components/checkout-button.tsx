"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import type { PlanId } from "@/lib/types";

export function CheckoutButton({ plan }: { plan: PlanId }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function startCheckout() {
    setLoading(true);
    setMessage("");

    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    const data = (await response.json()) as { ok: boolean; url?: string; message?: string };
    setLoading(false);

    if (data.url) {
      window.location.href = data.url;
      return;
    }

    setMessage(data.message ?? "Checkout non disponibile in demo.");
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={startCheckout}
        disabled={loading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-100 disabled:opacity-70"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Attiva {plan === "pro" ? "Pro" : "Basic"}
      </button>
      {message ? <p className="text-xs text-amber-100/70" role="status">{message}</p> : null}
    </div>
  );
}
