"use client";

import { useActionState } from "react";
import { createClient, type ActionResult } from "@/app/actions";
import { ActionMessage } from "@/components/ActionMessage";
import { buttonPrimary, inputClass, labelClass } from "@/components/ui";

export function ClientForm() {
  const [result, action, pending] = useActionState<ActionResult | null, FormData>(
    createClient,
    null
  );

  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="client-name" className={labelClass}>
          Nome e cognome
        </label>
        <input
          id="client-name"
          name="fullName"
          className={inputClass}
          placeholder="Es. Mario Verdi"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="client-phone" className={labelClass}>
            Telefono
          </label>
          <input
            id="client-phone"
            name="phone"
            className={inputClass}
            placeholder="+39 333 000 0000"
            required
          />
        </div>
        <div>
          <label htmlFor="client-email" className={labelClass}>
            Email (facoltativa)
          </label>
          <input
            id="client-email"
            name="email"
            type="email"
            className={inputClass}
            placeholder="mario@email.it"
          />
        </div>
      </div>
      <div>
        <label htmlFor="client-referral" className={labelClass}>
          Codice amico (se portato da un cliente)
        </label>
        <input
          id="client-referral"
          name="referredByCode"
          className={inputClass}
          placeholder="Es. MARC-A2B3"
        />
      </div>
      <div>
        <label htmlFor="client-notes" className={labelClass}>
          Note (facoltative)
        </label>
        <textarea
          id="client-notes"
          name="notes"
          className={inputClass}
          rows={2}
          placeholder="Preferenze, allergie, macchinetta n.2…"
        />
      </div>

      <ActionMessage result={result} />

      <button type="submit" className={`${buttonPrimary} w-full`} disabled={pending}>
        {pending ? "Salvataggio…" : "Aggiungi cliente"}
      </button>
    </form>
  );
}
