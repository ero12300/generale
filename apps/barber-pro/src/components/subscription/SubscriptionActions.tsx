"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Plan } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

interface Props {
  plan?: Plan;
  isCurrent?: boolean;
  hasSubscription?: boolean;
}

export function SubscriptionActions({ plan, isCurrent, hasSubscription }: Props) {
  const router = useRouter();
  const { push } = useToast();
  const [loading, setLoading] = useState(false);

  async function checkout(target: Plan) {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ plan: target }),
      });
      const data = (await res.json()) as { url?: string; simulated?: boolean; error?: string };
      if (data.simulated) {
        push({
          kind: "success",
          title: `Piano ${target.toUpperCase()} attivato (simulato)`,
          description: "Stripe non configurato: attivazione locale per farti provare i limiti.",
        });
        router.refresh();
        return;
      }
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      throw new Error(data.error ?? "Errore checkout");
    } catch (err) {
      push({ kind: "error", title: "Errore", description: err instanceof Error ? err.message : "" });
    } finally {
      setLoading(false);
    }
  }

  async function portal() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = (await res.json()) as { url?: string; simulated?: boolean; error?: string };
      if (data.simulated) {
        push({
          kind: "info",
          title: "Portale non disponibile in demo",
          description: "Configura Stripe per gestire l'abbonamento in produzione.",
        });
        return;
      }
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      throw new Error(data.error ?? "Errore portale");
    } catch (err) {
      push({ kind: "error", title: "Errore", description: err instanceof Error ? err.message : "" });
    } finally {
      setLoading(false);
    }
  }

  async function cancelSimulated() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ plan: "free" }),
      });
      if (res.ok) {
        push({ kind: "success", title: "Tornato al piano Starter" });
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  // Toolbar sopra la lista (hasSubscription)
  if (hasSubscription) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="secondary" size="sm" onClick={portal} loading={loading}>
          Gestisci abbonamento
        </Button>
      </div>
    );
  }

  // Card piano
  if (!plan) return null;
  if (isCurrent) {
    if (plan === "free") return <Button variant="secondary" disabled className="w-full">Sei sul piano gratuito</Button>;
    return (
      <div className="space-y-2">
        <Button variant="secondary" disabled className="w-full">Piano attuale</Button>
        <Button variant="ghost" size="sm" onClick={cancelSimulated} loading={loading} className="w-full">
          Torna al piano Starter
        </Button>
      </div>
    );
  }
  if (plan === "free") {
    return (
      <Button variant="secondary" onClick={cancelSimulated} loading={loading} className="w-full">
        Torna a Starter
      </Button>
    );
  }
  return (
    <Button onClick={() => checkout(plan)} loading={loading} className="w-full">
      Passa a {plan.toUpperCase()}
    </Button>
  );
}
