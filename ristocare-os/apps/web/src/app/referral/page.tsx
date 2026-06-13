"use client";

import { useState } from "react";
import Link from "next/link";
import { Gift, Users } from "lucide-react";
import { MarketingFooter, MarketingHeader } from "@/components/marketing/site-chrome";
import { MarketingPageShell, PageHero } from "@/components/marketing/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
    <MarketingPageShell>
      <MarketingHeader />
      <main className="flex-1 mx-auto max-w-3xl w-full px-4 lg:px-6 py-16 md:py-24">
        <PageHero
          eyebrow="Programma partner"
          title="Diventa partner RistoCare"
          description="Segnala ristoranti, bar, gelaterie e pizzerie interessati a digitalizzare la gestione delle proprie attrezzature. Se il cliente attiva il servizio, ricevi un premio."
        />

        <div className="grid md:grid-cols-3 gap-4 mb-12">
          {[
            { plan: "Start", reward: "50 €" },
            { plan: "Pro", reward: "100 €" },
            { plan: "Premium", reward: "200 €" },
          ].map(({ plan, reward }) => (
            <Card key={plan} className="border-zinc-200 text-center hover:border-emerald-500/20 transition-colors">
              <CardContent className="pt-8 pb-6">
                <Gift className="h-6 w-6 text-emerald-600 mx-auto mb-3" aria-hidden />
                <p className="text-sm text-zinc-500">Piano {plan}</p>
                <p className="font-display text-3xl font-semibold text-emerald-600 mt-1">{reward}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {status === "success" ? (
          <Card className="glass-panel glow-emerald">
            <CardContent className="py-16 text-center">
              <Users className="h-10 w-10 text-emerald-600 mx-auto mb-4" />
              <p className="font-display text-xl text-emerald-700">Segnalazione inviata</p>
              <p className="text-zinc-500 text-sm mt-2">Ti aggiorneremo sullo stato del lead.</p>
              <Button className="mt-8" variant="secondary" asChild>
                <Link href="/referral/dashboard">Vai all&apos;area partner</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="font-display text-xl">Segnala un locale</CardTitle>
              <CardDescription>I campi con * sono obbligatori.</CardDescription>
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
                {error && (
                  <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}
                <Button type="submit" disabled={status === "loading"} className="w-full">
                  Invia segnalazione
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </main>
      <MarketingFooter />
    </MarketingPageShell>
  );
}
