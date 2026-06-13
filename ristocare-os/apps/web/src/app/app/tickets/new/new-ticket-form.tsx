"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { PortalShell } from "@/components/layout/portal-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewTicketForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const equipmentId = searchParams.get("equipment");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.get("title"),
          description: form.get("description"),
          urgency: form.get("urgency"),
          equipment_id: form.get("equipment_id") || null,
        }),
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error);
      router.push(`/app/tickets/${json.data.id}`);
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Errore");
    }
  }

  return (
    <PortalShell variant="customer" title="RistoCare OS" subtitle="Nuovo ticket" mode="demo">
      <div className="max-w-xl space-y-6">
        <div>
          <Link href="/app/tickets" className="text-sm text-zinc-500 hover:text-zinc-300">← Ticket</Link>
          <h1 className="text-2xl font-bold text-zinc-100 mt-2">Apri ticket</h1>
          <p className="text-zinc-400 text-sm">Descrivi il problema. La centrale RistoCare gestirà la richiesta.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Dettagli richiesta</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="hidden" name="equipment_id" value={equipmentId ?? ""} />
              <div className="space-y-2">
                <Label htmlFor="title">Titolo *</Label>
                <Input id="title" name="title" required placeholder="es. Frigo non raffredda" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descrizione *</Label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={5}
                  placeholder="Descrivi il problema, da quando accade, se la macchina è ferma..."
                  className="flex w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="urgency">Urgenza</Label>
                <select
                  id="urgency"
                  name="urgency"
                  defaultValue="medium"
                  className="flex h-10 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 text-sm text-zinc-100"
                >
                  <option value="low">Bassa</option>
                  <option value="medium">Media</option>
                  <option value="high">Alta</option>
                  <option value="critical">Critica — fermo servizio</option>
                </select>
              </div>
              {error && <p className="text-sm text-red-400" role="alert">{error}</p>}
              <Button type="submit" disabled={status === "loading"} className="w-full">
                {status === "loading" ? "Invio..." : "Invia ticket a RistoCare"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </PortalShell>
  );
}
