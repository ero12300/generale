"use client";

import { isFirebaseConfigured, isStripeConfigured } from "@/lib/env";
import { Sparkles } from "lucide-react";
import { useState } from "react";

export function DemoBadge() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;
  if (isFirebaseConfigured && isStripeConfigured) return null;
  return (
    <button
      onClick={() => setDismissed(true)}
      title="Chiudi"
      className="fixed bottom-4 left-4 z-40 glass gold-border flex items-center gap-2 rounded-full px-3 py-1.5 text-xs text-white/80 hover:text-white transition"
    >
      <Sparkles className="h-3.5 w-3.5 text-[color:var(--color-gold-300)]" />
      Modalità demo — {!isFirebaseConfigured && "Firebase "} {!isStripeConfigured && "Stripe "} non configurato
    </button>
  );
}
