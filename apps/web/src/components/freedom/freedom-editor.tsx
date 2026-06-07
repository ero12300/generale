"use client";

import { useState } from "react";
import type { FreedomSnapshot } from "@deal-desk/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FreedomEditorProps {
  initial: FreedomSnapshot;
}

export function FreedomEditor({ initial }: FreedomEditorProps) {
  const [form, setForm] = useState({
    active_income: initial.active_income,
    passive_income: initial.passive_income,
    fixed_expenses: initial.fixed_expenses,
    liquidity: initial.liquidity,
    reserves: initial.reserves,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const res = await fetch("/api/freedom", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Salvataggio non riuscito");
    } else {
      setSuccess("Snapshot patrimoniale salvato.");
    }
    setLoading(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Aggiorna dati patrimoniali</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(
            [
              ["active_income", "Entrate attive (€/anno)"],
              ["passive_income", "Entrate passive (€/anno)"],
              ["fixed_expenses", "Uscite fisse (€/anno)"],
              ["liquidity", "Liquidità (€)"],
              ["reserves", "Riserve (€)"],
            ] as const
          ).map(([key, label]) => (
            <div key={key}>
              <Label htmlFor={key}>{label}</Label>
              <Input
                id={key}
                type="number"
                min={0}
                value={form[key]}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, [key]: Number(e.target.value) }))
                }
              />
            </div>
          ))}
          <div className="sm:col-span-2 lg:col-span-3 flex flex-col gap-2">
            {error && (
              <p role="alert" className="text-sm text-red-400">
                {error}
              </p>
            )}
            {success && (
              <p role="status" className="text-sm text-emerald-400">
                {success}
              </p>
            )}
            <Button type="submit" disabled={loading}>
              {loading ? "Salvataggio..." : "Salva snapshot"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
