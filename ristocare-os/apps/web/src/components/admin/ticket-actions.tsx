"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Technician, TicketStatus } from "@ristocare/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AdminTicketActionsProps {
  ticketId: string;
  technicians: Technician[];
  draftQuoteId?: string | null;
}

export function AdminTicketActions({ ticketId, technicians, draftQuoteId }: AdminTicketActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function assignTechnician(form: FormData) {
    setLoading(true);
    setMessage("");
    const res = await fetch(`/api/tickets/${ticketId}/assign`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        technician_id: form.get("technician_id"),
        internal_price: Number(form.get("internal_price")),
        availability: form.get("availability"),
      }),
    });
    const json = await res.json();
    setLoading(false);
    if (json.ok) {
      setMessage("Tecnico assegnato");
      router.refresh();
    } else {
      setMessage(json.error ?? "Errore");
    }
  }

  async function createQuote(form: FormData) {
    setLoading(true);
    const res = await fetch(`/api/tickets/${ticketId}/quote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        internal_cost: Number(form.get("internal_cost")),
        margin: Number(form.get("margin")),
      }),
    });
    const json = await res.json();
    setLoading(false);
    if (json.ok) {
      setMessage("Preventivo creato");
      router.refresh();
    }
  }

  async function sendQuote(quoteId: string) {
    setLoading(true);
    await fetch(`/api/quotes/${quoteId}/send`, { method: "POST" });
    setLoading(false);
    setMessage("Preventivo inviato al cliente");
    router.refresh();
  }

  async function updateStatus(newStatus: TicketStatus) {
    setLoading(true);
    await fetch(`/api/tickets/${ticketId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      {message && <p className="text-sm text-amber-400">{message}</p>}

      <Card>
        <CardHeader><CardTitle className="text-base">Assegna tecnico</CardTitle></CardHeader>
        <CardContent>
          <form action={assignTechnician} className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="technician_id">Tecnico</Label>
              <select id="technician_id" name="technician_id" required className="flex h-10 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 text-sm text-zinc-100">
                {technicians.map((t) => (
                  <option key={t.id} value={t.id}>{t.name} — {t.city}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="internal_price">Prezzo interno (€)</Label>
              <Input id="internal_price" name="internal_price" type="number" min={0} step={0.01} required />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="availability">Disponibilità</Label>
              <Input id="availability" name="availability" placeholder="es. Domani mattina" required />
            </div>
            <Button type="submit" disabled={loading} variant="gold">Assegna tecnico</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Crea preventivo cliente</CardTitle></CardHeader>
        <CardContent>
          <form action={createQuote} className="grid sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="internal_cost">Costo interno (€)</Label>
              <Input id="internal_cost" name="internal_cost" type="number" min={0} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="margin">Margine (€)</Label>
              <Input id="margin" name="margin" type="number" min={0} defaultValue={35} required />
            </div>
            <div className="flex items-end">
              <Button type="submit" disabled={loading} className="w-full">Calcola preventivo</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2">
        {draftQuoteId && (
          <Button size="sm" onClick={() => sendQuote(draftQuoteId)} disabled={loading}>
            Invia preventivo al cliente
          </Button>
        )}
        <Button size="sm" variant="secondary" onClick={() => updateStatus("in_review")} disabled={loading}>
          In verifica
        </Button>
        <Button size="sm" variant="secondary" onClick={() => updateStatus("closed")} disabled={loading}>
          Chiudi ticket
        </Button>
      </div>
    </div>
  );
}
