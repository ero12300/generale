"use client";

import { useState } from "react";
import Link from "next/link";
import { MarketingFooter, MarketingHeader } from "@/components/marketing/site-chrome";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ReferralPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/referrals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          partner_name: form.get("partner_name"),
          partner_type: form.get("partner_type"),
          phone: form.get("phone"),
          email: form.get("email"),
          referred_company: form.get("referred_company"),
          referred_contact: form.get("referred_contact") || null,
          city: form.get("city"),
          notes: form.get("notes") || undefined,
        }),
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Errore");
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <MarketingHeader />
      <main className="flex-1 mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl font-bold text-zinc-100 mb-4">Diventa partner RistoCare</h1>
        <p className="text-zinc-400 mb-8 leading-relaxed">
          Segnala ristoranti, bar, gelaterie e pizzerie interessati a digitalizzare la gestione
          delle proprie attrezzature. Se il cliente attiva il servizio, ricevi un premio.
        </p>

        <div className="grid md:grid-cols-3 gap-4 mb-12">
          {[
            { plan: "Start", reward: "50 €" },
            { plan: "Pro", reward: "100 €" },
            { plan: "Premium", reward: "200 €" },
          ].map(({ plan, reward }) => (
            <Card key={plan}>
              <CardContent className="pt-6 text-center">
                <p className="text-sm text-zinc-500">Piano {plan}</p>
                <p className="text-2xl font-bold text-emerald-400">{reward}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {status === "success" ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-emerald-400 font-medium text-lg">Segnalazione inviata</p>
              <p className="text-zinc-400 text-sm mt-2">Ti aggiorneremo sullo stato del lead.</p>
              <Button className="mt-6" variant="secondary" asChild>
                <Link href="/referral/dashboard">Vai all&apos;area partner</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Segnala un locale</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="partner_name">Il tuo nome *</Label>
                    <Input id="partner_name" name="partner_name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="partner_type">Tipo partner *</Label>
                    <Input id="partner_type" name="partner_type" placeholder="es. Agente caffè" required />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefono *</Label>
                    <Input id="phone" name="phone" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" name="email" type="email" required />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="referred_company">Locale segnalato *</Label>
                    <Input id="referred_company" name="referred_company" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="referred_contact">Referente</Label>
                    <Input id="referred_contact" name="referred_contact" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Città *</Label>
                  <Input id="city" name="city" defaultValue="Messina" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Note</Label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={3}
                    className="flex w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100"
                  />
                </div>
                {error && <p className="text-sm text-red-400">{error}</p>}
                <Button type="submit" disabled={status === "loading"} className="w-full">
                  Invia segnalazione
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </main>
      <MarketingFooter />
    </div>
  );
}
