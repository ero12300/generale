"use client";

import { useActionState } from "react";
import { registerSale, type ActionResult } from "@/app/actions";
import { ActionMessage } from "@/components/ActionMessage";
import { buttonPrimary, inputClass, labelClass } from "@/components/ui";
import { formatEuro } from "@/lib/money";
import type { Campaign, Client, Service } from "@/lib/types";

export function SaleForm({
  services,
  clients,
  campaigns,
}: {
  services: Service[];
  clients: Client[];
  campaigns: Campaign[];
}) {
  const [result, action, pending] = useActionState<ActionResult | null, FormData>(
    registerSale,
    null
  );

  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="sale-service" className={labelClass}>
          Servizio
        </label>
        <select
          id="sale-service"
          name="serviceId"
          className={inputClass}
          onChange={(e) => {
            const svc = services.find((s) => s.id === e.target.value);
            const form = e.target.form;
            if (svc && form) {
              (form.elements.namedItem("description") as HTMLInputElement).value =
                svc.name;
              (form.elements.namedItem("amount") as HTMLInputElement).value = (
                svc.priceCents / 100
              )
                .toFixed(2)
                .replace(".", ",");
            }
          }}
        >
          <option value="">— Servizio personalizzato —</option>
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} ({formatEuro(s.priceCents)})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="sale-description" className={labelClass}>
          Descrizione
        </label>
        <input
          id="sale-description"
          name="description"
          className={inputClass}
          placeholder="Es. Taglio + barba"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="sale-amount" className={labelClass}>
            Importo (€)
          </label>
          <input
            id="sale-amount"
            name="amount"
            className={inputClass}
            placeholder="25,00"
            inputMode="decimal"
            required
          />
        </div>
        <div>
          <label htmlFor="sale-method" className={labelClass}>
            Pagamento
          </label>
          <select id="sale-method" name="method" className={inputClass}>
            <option value="carta">Carta</option>
            <option value="contanti">Contanti</option>
            <option value="altro">Altro</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="sale-client" className={labelClass}>
          Cliente (facoltativo)
        </label>
        <select id="sale-client" name="clientId" className={inputClass}>
          <option value="">— Cliente di passaggio —</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.fullName}
            </option>
          ))}
        </select>
      </div>

      {campaigns.length > 0 ? (
        <div>
          <label htmlFor="sale-campaign" className={labelClass}>
            Campagna sconto (facoltativa)
          </label>
          <select id="sale-campaign" name="campaignId" className={inputClass}>
            <option value="">— Nessuna —</option>
            {campaigns.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      <ActionMessage result={result} />

      <button type="submit" className={`${buttonPrimary} w-full`} disabled={pending}>
        {pending ? "Registrazione…" : "Registra incasso"}
      </button>
    </form>
  );
}
