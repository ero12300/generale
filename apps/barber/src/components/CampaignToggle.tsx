"use client";

import { useTransition } from "react";
import { toggleCampaign } from "@/app/actions";

export function CampaignToggle({
  campaignId,
  active,
}: {
  campaignId: string;
  active: boolean;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await toggleCampaign(campaignId, !active);
        })
      }
      aria-pressed={active}
      className={
        active
          ? "rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-muted transition hover:text-red-300 focus:outline-none focus:ring-2 focus:ring-gold/60 disabled:opacity-50 cursor-pointer"
          : "rounded-lg border border-gold/40 px-3 py-1.5 text-xs font-medium text-gold-bright transition hover:bg-gold/10 focus:outline-none focus:ring-2 focus:ring-gold/60 disabled:opacity-50 cursor-pointer"
      }
    >
      {pending ? "…" : active ? "Disattiva" : "Attiva"}
    </button>
  );
}
