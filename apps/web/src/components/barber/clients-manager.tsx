"use client";

import { useEffect, useState } from "react";
import type { BarberClient } from "@deal-desk/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ClientFormState {
  full_name: string;
  phone: string;
  email: string;
  notes: string;
}

const initialForm: ClientFormState = {
  full_name: "",
  phone: "",
  email: "",
  notes: "",
};

export function ClientsManager() {
  const [clients, setClients] = useState<BarberClient[]>([]);
  const [form, setForm] = useState<ClientFormState>(initialForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function loadClients() {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/barber/clients");
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Errore caricamento clienti");
      setClients(data);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Errore caricamento clienti");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadClients();
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const payload = {
        full_name: form.full_name,
        phone: form.phone || null,
        email: form.email || null,
        notes: form.notes || null,
      };
      const response = await fetch("/api/barber/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Errore creazione cliente");
      setClients((current) => [data, ...current]);
      setForm(initialForm);
      setSuccess("Cliente salvato con successo.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Errore creazione cliente");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="grid xl:grid-cols-[1.1fr,1fr] gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Nuovo cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              placeholder="Nome completo"
              value={form.full_name}
              onChange={(event) => setForm((prev) => ({ ...prev, full_name: event.target.value }))}
              required
            />
            <Input
              placeholder="Telefono"
              value={form.phone}
              onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
            />
            <Input
              type="email"
              placeholder="Email (opzionale)"
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            />
            <Input
              placeholder="Note cliente"
              value={form.notes}
              onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
            />
            <Button type="submit" disabled={isSaving} className="w-full">
              {isSaving ? "Salvataggio..." : "Salva cliente"}
            </Button>
            {success && <p className="text-xs text-emerald-400">{success}</p>}
            {error && <p className="text-xs text-rose-400">{error}</p>}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Database clienti</CardTitle>
          <Button variant="outline" size="sm" onClick={() => void loadClients()} disabled={isLoading}>
            Aggiorna
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          {isLoading && <p className="text-sm text-zinc-500">Caricamento clienti...</p>}
          {!isLoading &&
            clients.map((client) => (
              <div
                key={client.id}
                className="rounded-lg border border-zinc-800 p-3 flex items-center justify-between gap-3"
              >
                <div>
                  <p className="text-sm font-medium">{client.full_name}</p>
                  <p className="text-xs text-zinc-500">
                    {client.phone ?? "Telefono non inserito"} · {client.email ?? "Email non inserita"}
                  </p>
                </div>
                <Badge variant="secondary">Codice: {client.referral_code}</Badge>
              </div>
            ))}
          {!isLoading && clients.length === 0 && (
            <p className="text-sm text-zinc-500">Nessun cliente registrato al momento.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
