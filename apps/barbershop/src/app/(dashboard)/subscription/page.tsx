"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap, Shield, Users, Calendar, BarChart2, Megaphone, Globe, Download } from "lucide-react";
import { toast } from "sonner";

const features = {
  free: [
    { label: "Fino a 50 clienti", included: true },
    { label: "30 prenotazioni/mese", included: true },
    { label: "Cassa base", included: true },
    { label: "1 barbiere", included: true },
    { label: "Campagne e coupon", included: false },
    { label: "Prenotazioni online pubbliche", included: false },
    { label: "Report avanzati", included: false },
    { label: "Notifiche SMS", included: false },
    { label: "Export dati CSV", included: false },
    { label: "Supporto prioritario", included: false },
  ],
  pro: [
    { label: "Clienti illimitati", included: true },
    { label: "Prenotazioni illimitate", included: true },
    { label: "Cassa avanzata", included: true },
    { label: "Barbieri illimitati", included: true },
    { label: "Campagne e coupon", included: true },
    { label: "Prenotazioni online pubbliche", included: true },
    { label: "Report avanzati", included: true },
    { label: "Notifiche SMS", included: true },
    { label: "Export dati CSV", included: true },
    { label: "Supporto prioritario", included: true },
  ],
};

export default function SubscriptionPage() {
  const { shop, refreshShop } = useAuth();
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [loading, setLoading] = useState(false);

  const isPro = shop?.plan === "pro" || shop?.plan === "enterprise";
  const isActive = shop?.subscriptionStatus === "active" || shop?.subscriptionStatus === "trialing";

  const handleUpgrade = async () => {
    if (!shop) return;
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shopId: shop.id,
          priceId: billing === "monthly"
            ? process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID
            : process.env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID,
          successUrl: `${window.location.origin}/dashboard/subscription?success=true`,
          cancelUrl: `${window.location.origin}/dashboard/subscription`,
        }),
      });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch {
      toast.error("Errore nel pagamento. Riprova.");
    } finally {
      setLoading(false);
    }
  };

  const handleManageBilling = async () => {
    if (!shop) return;
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shopId: shop.id,
          returnUrl: window.location.href,
        }),
      });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch {
      toast.error("Errore. Riprova.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto animate-fade-in space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-[var(--foreground)]">
          Piani <span className="text-gold">BarberPro</span>
        </h1>
        <p className="text-[var(--muted)] mt-2">Scegli il piano giusto per il tuo barbershop</p>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-3 mt-6">
          <span className={`text-sm ${billing === "monthly" ? "text-[var(--foreground)]" : "text-[var(--muted)]"}`}>Mensile</span>
          <button
            onClick={() => setBilling((b) => (b === "monthly" ? "yearly" : "monthly"))}
            className={`relative w-12 h-6 rounded-full transition-colors ${billing === "yearly" ? "bg-[var(--primary)]" : "bg-[var(--accent)]"}`}
          >
            <span
              className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${billing === "yearly" ? "left-7" : "left-1"}`}
            />
          </button>
          <span className={`text-sm flex items-center gap-1.5 ${billing === "yearly" ? "text-[var(--foreground)]" : "text-[var(--muted)]"}`}>
            Annuale
            {billing === "yearly" && <Badge variant="gold">-30%</Badge>}
          </span>
        </div>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Free Plan */}
        <Card className={`relative ${!isPro ? "border-[var(--primary)]/50 gold-glow" : ""}`}>
          {!isPro && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge variant="gold">Piano attuale</Badge>
            </div>
          )}
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Free</CardTitle>
              <Badge variant="outline">Gratis</Badge>
            </div>
            <div className="mt-3">
              <span className="text-3xl font-bold">€0</span>
              <span className="text-[var(--muted)] text-sm">/mese</span>
            </div>
            <p className="text-sm text-[var(--muted)] mt-1">Perfetto per iniziare</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {features.free.map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                {f.included
                  ? <Check className="w-4 h-4 text-green-400 shrink-0" />
                  : <div className="w-4 h-4 shrink-0 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--border)]" />
                    </div>}
                <span className={`text-sm ${f.included ? "text-[var(--foreground)]" : "text-[var(--muted)]"}`}>
                  {f.label}
                </span>
              </div>
            ))}
            {!isPro && (
              <div className="pt-4">
                <Button variant="outline" className="w-full" disabled>Piano attuale</Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pro Plan */}
        <Card className={`relative ${isPro && isActive ? "border-[var(--primary)]/50 gold-glow" : "border-[var(--primary)]/30"}`}>
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--primary)]/5 to-transparent rounded-xl pointer-events-none" />
          {isPro && isActive && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge variant="gold">Piano attuale</Badge>
            </div>
          )}
          {!isPro && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge variant="gold" className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-current" /> Consigliato
              </Badge>
            </div>
          )}
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-gold">Pro</CardTitle>
              <Badge variant="gold">
                <Star className="w-3 h-3 fill-current" /> Premium
              </Badge>
            </div>
            <div className="mt-3">
              <span className="text-3xl font-bold text-gold">
                {billing === "monthly" ? "€29" : "€199"}
              </span>
              <span className="text-[var(--muted)] text-sm">/{billing === "monthly" ? "mese" : "anno"}</span>
              {billing === "yearly" && (
                <span className="ml-2 text-xs text-green-400">Risparmi €149</span>
              )}
            </div>
            <p className="text-sm text-[var(--muted)] mt-1">14 giorni di prova gratuita</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {features.pro.map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <Check className="w-4 h-4 text-[var(--primary)] shrink-0" />
                <span className="text-sm text-[var(--foreground)]">{f.label}</span>
              </div>
            ))}
            <div className="pt-4">
              {isPro && isActive ? (
                <Button variant="outline" className="w-full" onClick={handleManageBilling} loading={loading}>
                  Gestisci abbonamento
                </Button>
              ) : (
                <Button variant="gold" className="w-full" onClick={handleUpgrade} loading={loading}>
                  <Star className="w-4 h-4" />
                  Inizia prova gratuita
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Features Detail */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { icon: Users, title: "Clienti illimitati", desc: "Nessun limite al tuo database clienti" },
          { icon: Calendar, title: "Prenotazioni online", desc: "Pagina pubblica per prenotazioni 24/7" },
          { icon: Megaphone, title: "Campagne marketing", desc: "Coupon, referral e fidelizzazione" },
          { icon: BarChart2, title: "Report avanzati", desc: "Analisi dettagliate del business" },
          { icon: Download, title: "Export dati", desc: "Esporta tutto in CSV o Excel" },
          { icon: Shield, title: "Supporto prioritario", desc: "Assistenza dedicata entro 4 ore" },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex gap-3 p-4 rounded-xl bg-[var(--card)] border border-[var(--border)]">
            <div className="w-9 h-9 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center shrink-0">
              <Icon className="w-4 h-4 text-[var(--primary)]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--foreground)]">{title}</p>
              <p className="text-xs text-[var(--muted)] mt-0.5">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div>
        <h2 className="text-lg font-bold mb-4">Domande frequenti</h2>
        <div className="space-y-3">
          {[
            { q: "Posso disdire in qualsiasi momento?", a: "Sì, puoi cancellare il tuo abbonamento in qualsiasi momento dal pannello di fatturazione. Non ci sono penali." },
            { q: "La prova gratuita richiede una carta?", a: "Sì, è richiesta una carta di credito per avviare la prova gratuita di 14 giorni. Non verrai addebitato fino alla fine del periodo di prova." },
            { q: "Posso passare da mensile ad annuale?", a: "Sì, puoi cambiare piano in qualsiasi momento. Il cambio sarà effettivo al prossimo rinnovo." },
            { q: "I dati sono al sicuro?", a: "Assolutamente. I tuoi dati sono cifrati e conservati su Firebase (Google Cloud). Non li condividiamo mai con terze parti." },
          ].map(({ q, a }) => (
            <div key={q} className="p-4 rounded-xl bg-[var(--card)] border border-[var(--border)]">
              <p className="font-medium text-sm text-[var(--foreground)]">{q}</p>
              <p className="text-sm text-[var(--muted)] mt-1">{a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
