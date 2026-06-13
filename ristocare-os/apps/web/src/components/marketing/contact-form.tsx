"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, Textarea } from "@/components/ui/textarea";

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
      <Card className="glass-panel glow-emerald">
        <CardContent className="py-16 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/15 border border-emerald-500/25">
            <span className="text-2xl">✓</span>
          </div>
          <p className="font-display text-xl text-emerald-300">Richiesta inviata</p>
          <p className="text-zinc-500 text-sm mt-2">Ti contatteremo al più presto.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-panel">
      <CardHeader>
        <CardTitle className="font-display text-xl">Contattaci</CardTitle>
        <CardDescription>Compila il modulo e ti rispondiamo entro 24 ore lavorative.</CardDescription>
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
            <Select id="request_type" name="request_type" defaultValue={defaultType}>
              <option value="demo">Richiesta demo</option>
              <option value="quote">Richiesta preventivo</option>
              <option value="census">Censimento locale</option>
              <option value="technician">Diventa tecnico partner</option>
              <option value="referral">Diventa partner referral</option>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Messaggio *</Label>
            <Textarea
              id="message"
              name="message"
              required
              rows={4}
              placeholder="Descrivi il tuo locale e cosa ti serve..."
            />
          </div>
          {error && (
            <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2" role="alert">
              {error}
            </p>
          )}
          <Button type="submit" disabled={status === "loading"} className="w-full">
            {status === "loading" ? "Invio in corso..." : "Invia richiesta"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
