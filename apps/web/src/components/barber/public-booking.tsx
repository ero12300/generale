"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createBooking } from "@/lib/barber/repository";

type SubmitState = "idle" | "saving" | "success" | "error";

export function PublicBookingForm() {
  const [state, setState] = useState<SubmitState>("idle");
  const [form, setForm] = useState({
    clientName: "",
    clientPhone: "",
    serviceName: "Taglio Uomo",
    startsAtIso: "",
  });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("saving");
    try {
      await createBooking({
        ...form,
        source: "public",
        startsAtIso: new Date(form.startsAtIso).toISOString(),
      });
      setState("success");
      setForm({ clientName: "", clientPhone: "", serviceName: "Taglio Uomo", startsAtIso: "" });
    } catch {
      setState("error");
    }
  }

  return (
    <Card className="max-w-xl mx-auto">
      <CardHeader>
        <CardTitle>Prenota il tuo appuntamento</CardTitle>
        <CardDescription>Modulo online integrato direttamente nel gestionale BarberOS.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-3" onSubmit={onSubmit}>
          <Input
            required
            placeholder="Nome e cognome"
            value={form.clientName}
            onChange={(event) => setForm((prev) => ({ ...prev, clientName: event.target.value }))}
          />
          <Input
            required
            placeholder="Telefono"
            value={form.clientPhone}
            onChange={(event) => setForm((prev) => ({ ...prev, clientPhone: event.target.value }))}
          />
          <Input
            required
            placeholder="Servizio richiesto"
            value={form.serviceName}
            onChange={(event) => setForm((prev) => ({ ...prev, serviceName: event.target.value }))}
          />
          <Input
            required
            type="datetime-local"
            value={form.startsAtIso}
            onChange={(event) => setForm((prev) => ({ ...prev, startsAtIso: event.target.value }))}
          />

          {state === "saving" ? <p className="text-xs text-zinc-400">Invio in corso...</p> : null}
          {state === "success" ? (
            <p className="text-xs text-emerald-400">Richiesta inviata, ti confermiamo a breve.</p>
          ) : null}
          {state === "error" ? (
            <p className="text-xs text-red-300">Errore nell'invio. Riprova tra qualche minuto.</p>
          ) : null}

          <Button type="submit" disabled={state === "saving"}>
            Conferma prenotazione
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
