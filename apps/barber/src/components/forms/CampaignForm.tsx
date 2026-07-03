"use client";

import { useActionState, useState } from "react";
import { createCampaign, type ActionResult } from "@/app/actions";
import { ActionMessage } from "@/components/ActionMessage";
import { buttonPrimary, inputClass, labelClass } from "@/components/ui";
import type { CampaignKind } from "@/lib/types";

export function CampaignForm() {
  const [result, action, pending] = useActionState<ActionResult | null, FormData>(
    createCampaign,
    null
  );
  const [kind, setKind] = useState<CampaignKind>("sconto");

  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="campaign-kind" className={labelClass}>
          Tipo di campagna
        </label>
        <select
          id="campaign-kind"
          name="kind"
          className={inputClass}
          value={kind}
          onChange={(e) => setKind(e.target.value as CampaignKind)}
        >
          <option value="sconto">Sconto</option>
          <option value="referral">Porta un Amico</option>
        </select>
      </div>
      <div>
        <label htmlFor="campaign-name" className={labelClass}>
          Nome campagna
        </label>
        <input
          id="campaign-name"
          name="name"
          className={inputClass}
          placeholder={
            kind === "sconto" ? "Es. Sconto studenti -15%" : "Es. Porta un Amico: 10€ a testa"
          }
          required
        />
      </div>

      {kind === "sconto" ? (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="campaign-percent" className={labelClass}>
              Sconto %
            </label>
            <input
              id="campaign-percent"
              name="discountPercent"
              type="number"
              min={0}
              max={100}
              className={inputClass}
              placeholder="15"
            />
          </div>
          <div>
            <label htmlFor="campaign-euro" className={labelClass}>
              Oppure sconto fisso (€)
            </label>
            <input
              id="campaign-euro"
              name="discountEuro"
              className={inputClass}
              inputMode="decimal"
              placeholder="5,00"
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="campaign-friend" className={labelClass}>
              Sconto per l&apos;amico (€)
            </label>
            <input
              id="campaign-friend"
              name="discountEuro"
              className={inputClass}
              inputMode="decimal"
              placeholder="10,00"
            />
          </div>
          <div>
            <label htmlFor="campaign-reward" className={labelClass}>
              Premio per chi lo porta (€)
            </label>
            <input
              id="campaign-reward"
              name="referrerRewardEuro"
              className={inputClass}
              inputMode="decimal"
              placeholder="10,00"
            />
          </div>
        </div>
      )}

      <ActionMessage result={result} />

      <button type="submit" className={`${buttonPrimary} w-full`} disabled={pending}>
        {pending ? "Creazione…" : "Crea campagna"}
      </button>
    </form>
  );
}
