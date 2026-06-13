"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ContactForm() {
  const searchParams = useSearchParams();
  const defaultType = searchParams.get("tipo") ?? "demo";
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    const form = new FormData(e.currentTarget);
    const body = {
      name: form.get("name"),
      email: form.get("email"),
      phone: form.get("phone") || undefined,
      company: form.get("company") || undefined,
      message: form.get("message"),
      request_type: form.get("request_type"),
    };
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error ?? "Errore invio");
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Errore invio");
    }
  }

  if (status === "success") {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-emerald-400 font-medium text-lg mb-2">Richiesta inviata</p>
          <p className="text-zinc-400 text-sm">Ti contatteremo al più presto.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contattaci</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input id="name" name="name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" name="email" type="email" required />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Telefono</Label>
              <Input id="phone" name="phone" type="tel" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Locale / Azienda</Label>
              <Input id="company" name="company" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="request_type">Tipo richiesta</Label>
            <select
              id="request_type"
              name="request_type"
              defaultValue={defaultType}
              className="flex h-10 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 text-sm text-zinc-100"
            >
              <option value="demo">Richiesta demo</option>
              <option value="quote">Richiesta preventivo</option>
              <option value="census">Censimento locale</option>
              <option value="technician">Diventa tecnico partner</option>
              <option value="referral">Diventa partner referral</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Messaggio *</Label>
            <textarea
              id="message"
              name="message"
              required
              rows={4}
              className="flex w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500"
              placeholder="Descrivi il tuo locale e cosa ti serve..."
            />
          </div>
          {error && <p className="text-sm text-red-400" role="alert">{error}</p>}
          <Button type="submit" disabled={status === "loading"} className="w-full">
            {status === "loading" ? "Invio in corso..." : "Invia richiesta"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
