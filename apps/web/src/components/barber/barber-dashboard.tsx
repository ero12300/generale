"use client";

import { useEffect, useMemo, useState } from "react";
import type {
  BarberBooking,
  BarberCampaign,
  BarberCustomer,
  BarberPricingPlan,
  BarberSubscriptionTier,
  BarberTransaction,
} from "@deal-desk/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface BarberDashboardResponse {
  summary: {
    today_bookings_count: number;
    monthly_revenue_cents: number;
    active_customers_count: number;
    referral_campaigns_count: number;
  };
  customers: BarberCustomer[];
  bookings: BarberBooking[];
  transactions: BarberTransaction[];
  campaigns: BarberCampaign[];
  plans: BarberPricingPlan[];
  subscription_tier: BarberSubscriptionTier;
  persistence: "firebase" | "demo";
}

function centsToEuro(cents: number) {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

export function BarberDashboard() {
  const [data, setData] = useState<BarberDashboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [customerForm, setCustomerForm] = useState({
    full_name: "",
    phone: "",
    source: "walk_in",
  });
  const [bookingForm, setBookingForm] = useState({
    customer_id: "",
    service_name: "",
    start_local: "",
    duration_minutes: "45",
    price_eur: "30",
  });
  const [transactionForm, setTransactionForm] = useState({
    amount_eur: "30",
    description: "Incasso taglio uomo",
  });
  const [campaignForm, setCampaignForm] = useState({
    name: "",
    code: "",
    discount_percent: "10",
    type: "discount",
  });

  async function loadDashboard() {
    setIsLoading(true);
    setFeedback(null);
    try {
      const response = await fetch("/api/barber/dashboard");
      if (!response.ok) throw new Error("Impossibile caricare dashboard barber");
      const payload = (await response.json()) as BarberDashboardResponse;
      setData(payload);
      if (!bookingForm.customer_id && payload.customers[0]) {
        setBookingForm((prev) => ({ ...prev, customer_id: payload.customers[0].id }));
      }
    } catch (error) {
      setFeedback({
        type: "error",
        text: error instanceof Error ? error.message : "Errore inatteso",
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const kpis = useMemo(() => {
    if (!data) return [];
    return [
      { label: "Prenotazioni oggi", value: String(data.summary.today_bookings_count) },
      { label: "Incassi mese", value: centsToEuro(data.summary.monthly_revenue_cents) },
      { label: "Clienti attivi", value: String(data.summary.active_customers_count) },
      { label: "Campagne referral", value: String(data.summary.referral_campaigns_count) },
    ];
  }, [data]);

  async function handleCreateCustomer(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);
    try {
      const response = await fetch("/api/barber/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: customerForm.full_name,
          phone: customerForm.phone,
          source: customerForm.source,
        }),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(payload.error ?? "Errore creazione cliente");
      setCustomerForm({ full_name: "", phone: "", source: "walk_in" });
      setFeedback({ type: "success", text: "Cliente creato con successo" });
      await loadDashboard();
    } catch (error) {
      setFeedback({ type: "error", text: error instanceof Error ? error.message : "Errore inatteso" });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleCreateBooking(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);
    try {
      const response = await fetch("/api/barber/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_id: bookingForm.customer_id,
          service_name: bookingForm.service_name,
          start_at: new Date(bookingForm.start_local).toISOString(),
          duration_minutes: Number(bookingForm.duration_minutes),
          price_cents: Math.round(Number(bookingForm.price_eur) * 100),
          status: "confirmed",
        }),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(payload.error ?? "Errore creazione prenotazione");
      setBookingForm((prev) => ({ ...prev, service_name: "", start_local: "" }));
      setFeedback({ type: "success", text: "Prenotazione registrata" });
      await loadDashboard();
    } catch (error) {
      setFeedback({ type: "error", text: error instanceof Error ? error.message : "Errore inatteso" });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleCreateTransaction(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);
    try {
      const response = await fetch("/api/barber/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount_cents: Math.round(Number(transactionForm.amount_eur) * 100),
          description: transactionForm.description,
          type: "service_sale",
          payment_method: "card",
        }),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(payload.error ?? "Errore registrazione incasso");
      setFeedback({ type: "success", text: "Incasso registrato" });
      await loadDashboard();
    } catch (error) {
      setFeedback({ type: "error", text: error instanceof Error ? error.message : "Errore inatteso" });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleCreateCampaign(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);
    try {
      const nowDate = new Date();
      const endDate = new Date();
      endDate.setDate(nowDate.getDate() + 30);

      const response = await fetch("/api/barber/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: campaignForm.name,
          type: campaignForm.type,
          code: campaignForm.code.toUpperCase(),
          discount_percent: Number(campaignForm.discount_percent),
          reward_cents: 500,
          starts_at: nowDate.toISOString(),
          ends_at: endDate.toISOString(),
          enabled: true,
        }),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(payload.error ?? "Errore creazione campagna");
      setCampaignForm({ name: "", code: "", discount_percent: "10", type: "discount" });
      setFeedback({ type: "success", text: "Campagna attivata" });
      await loadDashboard();
    } catch (error) {
      setFeedback({ type: "error", text: error instanceof Error ? error.message : "Errore inatteso" });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleCheckout(planId: BarberSubscriptionTier) {
    setIsSubmitting(true);
    setFeedback(null);
    try {
      const response = await fetch("/api/barber/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan_id: planId }),
      });
      const payload = (await response.json()) as { checkoutUrl?: string; error?: string };
      if (!response.ok || !payload.checkoutUrl) {
        throw new Error(payload.error ?? "Errore checkout");
      }
      window.location.href = payload.checkoutUrl;
    } catch (error) {
      setFeedback({ type: "error", text: error instanceof Error ? error.message : "Errore inatteso" });
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return <p className="text-sm text-zinc-400">Caricamento gestionale barber premium...</p>;
  }

  if (!data) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-red-300">Errore caricamento dati barber.</p>
          <Button className="mt-4" variant="secondary" onClick={() => void loadDashboard()}>
            Riprova
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-amber-500/20 bg-gradient-to-br from-zinc-900 to-zinc-950">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <CardTitle className="text-2xl">BarberOS Premium</CardTitle>
              <CardDescription>
                Gestionale completo: agenda, incassi, CRM, referral e abbonamenti.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Piano {data.subscription_tier.toUpperCase()}</Badge>
              <Badge variant="secondary">
                Storage: {data.persistence === "firebase" ? "Firebase" : "Demo in-memory"}
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {feedback && (
        <div
          className={`rounded-md border px-3 py-2 text-sm ${
            feedback.type === "success"
              ? "border-emerald-500/40 text-emerald-300"
              : "border-red-500/40 text-red-300"
          }`}
          role="status"
        >
          {feedback.text}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="p-5">
              <p className="text-xs uppercase tracking-wide text-zinc-500">{kpi.label}</p>
              <p className="text-2xl font-semibold mt-1">{kpi.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="bookings">
        <TabsList>
          <TabsTrigger value="bookings">Prenotazioni</TabsTrigger>
          <TabsTrigger value="customers">Clienti</TabsTrigger>
          <TabsTrigger value="campaigns">Campagne</TabsTrigger>
          <TabsTrigger value="billing">Abbonamenti</TabsTrigger>
        </TabsList>

        <TabsContent value="bookings" className="grid lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Nuova prenotazione</CardTitle>
              <CardDescription>Servizio booking interno con prezzi in centesimi.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-3" onSubmit={handleCreateBooking}>
                <label className="text-sm text-zinc-400 block">
                  Cliente
                  <select
                    className="mt-1 w-full h-10 rounded-md border border-zinc-700 bg-zinc-950 px-3 text-sm"
                    value={bookingForm.customer_id}
                    onChange={(e) => setBookingForm((prev) => ({ ...prev, customer_id: e.target.value }))}
                    required
                  >
                    {data.customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.full_name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-sm text-zinc-400 block">
                  Servizio
                  <Input
                    value={bookingForm.service_name}
                    onChange={(e) => setBookingForm((prev) => ({ ...prev, service_name: e.target.value }))}
                    placeholder="Taglio Premium + Barba"
                    required
                  />
                </label>
                <label className="text-sm text-zinc-400 block">
                  Data e ora
                  <Input
                    type="datetime-local"
                    value={bookingForm.start_local}
                    onChange={(e) => setBookingForm((prev) => ({ ...prev, start_local: e.target.value }))}
                    required
                  />
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="text-sm text-zinc-400 block">
                    Durata (min)
                    <Input
                      type="number"
                      min={15}
                      value={bookingForm.duration_minutes}
                      onChange={(e) =>
                        setBookingForm((prev) => ({ ...prev, duration_minutes: e.target.value }))
                      }
                      required
                    />
                  </label>
                  <label className="text-sm text-zinc-400 block">
                    Prezzo EUR
                    <Input
                      type="number"
                      min={0}
                      step={0.01}
                      value={bookingForm.price_eur}
                      onChange={(e) => setBookingForm((prev) => ({ ...prev, price_eur: e.target.value }))}
                      required
                    />
                  </label>
                </div>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Salvataggio..." : "Crea prenotazione"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Incasso rapido</CardTitle>
              <CardDescription>Registra un pagamento per dashboard finanziaria.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form className="space-y-3" onSubmit={handleCreateTransaction}>
                <label className="text-sm text-zinc-400 block">
                  Importo EUR
                  <Input
                    type="number"
                    min={1}
                    step={0.01}
                    value={transactionForm.amount_eur}
                    onChange={(e) => setTransactionForm((prev) => ({ ...prev, amount_eur: e.target.value }))}
                    required
                  />
                </label>
                <label className="text-sm text-zinc-400 block">
                  Descrizione
                  <Input
                    value={transactionForm.description}
                    onChange={(e) =>
                      setTransactionForm((prev) => ({ ...prev, description: e.target.value }))
                    }
                    required
                  />
                </label>
                <Button type="submit" variant="secondary" disabled={isSubmitting}>
                  {isSubmitting ? "Registrazione..." : "Registra incasso"}
                </Button>
              </form>

              <div className="space-y-2">
                <p className="text-sm text-zinc-400">Ultimi pagamenti</p>
                {data.transactions.slice(0, 4).map((transaction) => (
                  <div key={transaction.id} className="rounded-md border border-zinc-800 p-3 text-sm">
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-zinc-500">
                      {centsToEuro(transaction.amount_cents)} · {transaction.payment_method}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="grid lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Nuovo cliente</CardTitle>
              <CardDescription>Database clienti centralizzato per retention.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-3" onSubmit={handleCreateCustomer}>
                <label className="text-sm text-zinc-400 block">
                  Nome e cognome
                  <Input
                    value={customerForm.full_name}
                    onChange={(e) => setCustomerForm((prev) => ({ ...prev, full_name: e.target.value }))}
                    required
                  />
                </label>
                <label className="text-sm text-zinc-400 block">
                  Telefono
                  <Input
                    value={customerForm.phone}
                    onChange={(e) => setCustomerForm((prev) => ({ ...prev, phone: e.target.value }))}
                    required
                  />
                </label>
                <label className="text-sm text-zinc-400 block">
                  Provenienza
                  <select
                    className="mt-1 w-full h-10 rounded-md border border-zinc-700 bg-zinc-950 px-3 text-sm"
                    value={customerForm.source}
                    onChange={(e) => setCustomerForm((prev) => ({ ...prev, source: e.target.value }))}
                  >
                    <option value="walk_in">Walk-in</option>
                    <option value="instagram">Instagram</option>
                    <option value="referral">Referral</option>
                    <option value="google">Google</option>
                    <option value="other">Altro</option>
                  </select>
                </label>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Salvataggio..." : "Aggiungi cliente"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Clienti top</CardTitle>
              <CardDescription>Segmento ad alto valore per upsell.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {data.customers.map((customer) => (
                <div key={customer.id} className="rounded-md border border-zinc-800 p-3">
                  <p className="font-medium">{customer.full_name}</p>
                  <p className="text-sm text-zinc-500">
                    {customer.phone} · spesa {centsToEuro(customer.total_spent_cents)}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="grid lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Nuova campagna</CardTitle>
              <CardDescription>Sconti e porta-un-amico con codici tracciabili.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-3" onSubmit={handleCreateCampaign}>
                <label className="text-sm text-zinc-400 block">
                  Nome campagna
                  <Input
                    value={campaignForm.name}
                    onChange={(e) => setCampaignForm((prev) => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="text-sm text-zinc-400 block">
                    Tipo
                    <select
                      className="mt-1 w-full h-10 rounded-md border border-zinc-700 bg-zinc-950 px-3 text-sm"
                      value={campaignForm.type}
                      onChange={(e) => setCampaignForm((prev) => ({ ...prev, type: e.target.value }))}
                    >
                      <option value="discount">Sconto</option>
                      <option value="bring_a_friend">Porta un amico</option>
                    </select>
                  </label>
                  <label className="text-sm text-zinc-400 block">
                    Codice
                    <Input
                      value={campaignForm.code}
                      onChange={(e) => setCampaignForm((prev) => ({ ...prev, code: e.target.value }))}
                      required
                    />
                  </label>
                </div>
                <label className="text-sm text-zinc-400 block">
                  Sconto %
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={campaignForm.discount_percent}
                    onChange={(e) =>
                      setCampaignForm((prev) => ({ ...prev, discount_percent: e.target.value }))
                    }
                    required
                  />
                </label>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Attivazione..." : "Attiva campagna"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Campagne attive</CardTitle>
              <CardDescription>Il piano Base limita a 1 campagna attiva.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {data.campaigns.map((campaign) => (
                <div key={campaign.id} className="rounded-md border border-zinc-800 p-3">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{campaign.name}</p>
                    <Badge variant="secondary">{campaign.type}</Badge>
                  </div>
                  <p className="text-sm text-zinc-500">
                    Codice {campaign.code} · -{campaign.discount_percent}%
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <div className="grid md:grid-cols-2 gap-4">
            {data.plans.map((plan) => (
              <Card
                key={plan.id}
                className={plan.recommended ? "border-amber-500/40 shadow-[0_0_0_1px_rgba(245,158,11,0.25)]" : ""}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{plan.name}</CardTitle>
                    {plan.recommended && <Badge>Consigliato</Badge>}
                  </div>
                  <CardDescription>{centsToEuro(plan.monthly_price_cents)}/mese</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ul className="space-y-1 text-sm text-zinc-300">
                    {plan.features.map((feature) => (
                      <li key={feature}>• {feature}</li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    variant={plan.id === data.subscription_tier ? "secondary" : "default"}
                    onClick={() => void handleCheckout(plan.id)}
                    disabled={isSubmitting}
                  >
                    {plan.id === data.subscription_tier ? "Piano attivo" : plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
