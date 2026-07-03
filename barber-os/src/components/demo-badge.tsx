"use client";

import { isDemoMode } from "@/lib/store";

export function DemoBadge() {
  if (!isDemoMode()) return null;
  return (
    <span
      title="Firebase non configurato: i dati sono salvati solo in questo browser"
      className="rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-amber-300"
    >
      Modalità demo
    </span>
  );
}
