"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  BarberAppointment,
  BarberCustomer,
  BarberDashboardData,
  DiscountCampaign,
  SubscriptionPlan,
} from "@/lib/barber/types";

interface BarberPremiumAppProps {
  initialData: BarberDashboardData;
}

function formatCents(value: number): string {
  return new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(value / 100);
}

function toInputDatetime(dateIso: string): string {
  const date = new Date(dateIso);
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}

export function BarberPremiumApp({ initialData }: BarberPremiumAppProps) {
  const [dashboard, setDashboard] = useState(initialData);
  const [bookingState, setBookingState] = useState({
    customerName: "",
    serviceName: "",
    startsAt: toInputDatetime(new Date(Date.now() + 3600000).toISOString()),
    durationMinutes: "45",
    priceCents: "3000",
  });
  const [bookingMessage, setBookingMessage] = useState<string | null>(null);
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  const [isBillingLoading, setIsBillingLoading] = useState<string | null>(null);

  const conversionRate = useMemo(() => {
    const referred = dashboard.customers.reduce((acc, entry) => acc + entry.referredCustomers, 0);
    return Math.min(100, Math.round((referred / Math.max(dashboard.customers.length, 1)) * 35));
  }, [dashboard.customers]);

  async function refreshDashboard() {
    const response = await fetch("/api/barber/dashboard", { method: "GET", cache: "no-store" });
    if (!response.ok) return;
    const payload = (await response.json()) as { data: BarberDashboardData };
    setDashboard(payload.data);
  }

  async function handleCreateBooking(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmittingBooking(true);
    setBookingMessage(null);

    try {
      const startsAt = new Date(bookingState.startsAt).toISOString();
      const response = await fetch("/api/barber/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: bookingState.customerName,
          serviceName: bookingState.serviceName,
          startsAt,
          durationMinutes: Number(bookingState.durationMinutes),
          priceCents: Number(bookingState.priceCents),
        }),
      });

      if (!response.ok) {
        setBookingMessage("Prenotazione non valida, controlla i campi.");
        return;
      }

      setBookingMessage("Prenotazione registrata correttamente.");
      setBookingState((prev) => ({ ...prev, customerName: "", serviceName: "" }));
      await refreshDashboard();
    } finally {
      setIsSubmittingBooking(false);
    }
  }

  async function handleCheckout(tier: "basic" | "pro") {
    setIsBillingLoading(tier);
    try {
      const response = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier }),
      });

      if (!response.ok) return;
      const payload = (await response.json()) as { data?: { checkoutUrl?: string } };
      if (payload.data?.checkoutUrl) {
        window.location.href = payload.data.checkoutUrl;
      }
    } finally {
      setIsBillingLoading(null);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-black px-4 py-10 text-zinc-50">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <section className="rounded-3xl border border-amber-500/30 bg-zinc-900/70 p-8 shadow-[0_0_120px_-40px_rgba(245,158,11,0.9)]">
          <Badge className="mb-4 bg-amber-600 text-white">BarberOS Premium</Badge>
          <h1 className="text-4xl font-semibold tracking-tight">Gestionale premium per barbiere moderno</h1>
          <p className="mt-3 max-w-3xl text-zinc-300">
            Agenda intelligente, incassi in tempo reale, CRM clienti e campagne automatiche tutto in una sola app
            pronta a scalare in SaaS.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-4">
            <KpiCard label="Incasso mese" value={formatCents(dashboard.revenue.monthRevenueCents)} />
            <KpiCard label="Target mese" value={formatCents(dashboard.revenue.monthTargetCents)} />
            <KpiCard label="Incasso oggi" value={formatCents(dashboard.revenue.todayRevenueCents)} />
            <KpiCard label="Prenotazioni oggi" value={String(dashboard.appointmentsToday.length)} />
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Servizio prenotazioni integrato</CardTitle>
              <CardDescription>Registra appuntamenti dal sito e sincronizza l agenda interna.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <form className="grid gap-3 md:grid-cols-2" onSubmit={handleCreateBooking}>
                <Input
                  required
                  placeholder="Nome cliente"
                  value={bookingState.customerName}
                  onChange={(event) => setBookingState((prev) => ({ ...prev, customerName: event.target.value }))}
                />
                <Input
                  required
                  placeholder="Servizio"
                  value={bookingState.serviceName}
                  onChange={(event) => setBookingState((prev) => ({ ...prev, serviceName: event.target.value }))}
                />
                <Input
                  type="datetime-local"
                  required
                  value={bookingState.startsAt}
                  onChange={(event) => setBookingState((prev) => ({ ...prev, startsAt: event.target.value }))}
                />
                <Input
                  type="number"
                  min={10}
                  max={240}
                  required
                  value={bookingState.durationMinutes}
                  onChange={(event) => setBookingState((prev) => ({ ...prev, durationMinutes: event.target.value }))}
                />
                <Input
                  type="number"
                  min={500}
                  max={50000}
                  required
                  value={bookingState.priceCents}
                  onChange={(event) => setBookingState((prev) => ({ ...prev, priceCents: event.target.value }))}
                />
                <Button type="submit" disabled={isSubmittingBooking}>
                  {isSubmittingBooking ? "Salvataggio..." : "Crea prenotazione"}
                </Button>
              </form>
              {bookingMessage ? <p className="text-sm text-amber-300">{bookingMessage}</p> : null}
              <AppointmentList appointments={dashboard.appointmentsToday} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Incassi e performance</CardTitle>
              <CardDescription>Controllo economico giornaliero e ricavi futuri prenotati.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <Row label="Incasso oggi" value={formatCents(dashboard.revenue.todayRevenueCents)} />
              <Row label="Incasso da prenotazioni" value={formatCents(dashboard.revenue.pendingRevenueCents)} />
              <Row label="Clienti nel CRM" value={String(dashboard.customers.length)} />
              <Row label="Conversione referral" value={`${conversionRate}%`} />
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Database clienti</CardTitle>
              <CardDescription>Storico spesa e referral code per upsell e retention.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {dashboard.customers.map((customer) => (
                <CustomerRow key={customer.id} customer={customer} />
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Campagne sconti e porta un amico</CardTitle>
              <CardDescription>Automazioni marketing pronte per crescita locale e franchising.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {dashboard.campaigns.map((campaign) => (
                <CampaignRow key={campaign.id} campaign={campaign} />
              ))}
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          {dashboard.plans.map((plan) => (
            <PlanCard
              key={plan.tier}
              plan={plan}
              loading={isBillingLoading === plan.tier}
              onCheckout={() => handleCheckout(plan.tier)}
            />
          ))}
        </section>
      </div>
    </main>
  );
}

function KpiCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="border-zinc-700 bg-zinc-950/70">
      <CardContent className="p-4">
        <p className="text-sm text-zinc-400">{label}</p>
        <p className="mt-1 text-2xl font-semibold">{value}</p>
      </CardContent>
    </Card>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-zinc-800 px-3 py-2">
      <span className="text-zinc-400">{label}</span>
      <span className="font-medium text-zinc-100">{value}</span>
    </div>
  );
}

function AppointmentList({ appointments }: { appointments: BarberAppointment[] }) {
  if (appointments.length === 0) {
    return <p className="text-sm text-zinc-400">Nessuna prenotazione oggi.</p>;
  }

  return (
    <div className="space-y-2">
      {appointments.map((appointment) => (
        <div
          key={appointment.id}
          className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950/40 px-3 py-2 text-sm"
        >
          <div>
            <p className="font-medium">{appointment.customerName}</p>
            <p className="text-zinc-400">{appointment.serviceName}</p>
          </div>
          <div className="text-right">
            <p>{new Date(appointment.startsAt).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })}</p>
            <p className="text-zinc-400">{formatCents(appointment.priceCents)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function CustomerRow({ customer }: { customer: BarberCustomer }) {
  return (
    <div className="rounded-lg border border-zinc-800 px-3 py-2">
      <div className="flex items-center justify-between">
        <p className="font-medium">{customer.fullName}</p>
        <Badge variant="secondary">{customer.referralCode}</Badge>
      </div>
      <p className="mt-1 text-sm text-zinc-400">
        Spesa totale {formatCents(customer.totalSpentCents)} · Invitati {customer.referredCustomers}
      </p>
    </div>
  );
}

function CampaignRow({ campaign }: { campaign: DiscountCampaign }) {
  return (
    <div className="rounded-lg border border-zinc-800 px-3 py-2">
      <div className="flex items-center justify-between">
        <p className="font-medium">{campaign.title}</p>
        <Badge variant={campaign.active ? "default" : "secondary"}>{campaign.active ? "Attiva" : "Pausa"}</Badge>
      </div>
      <p className="mt-1 text-sm text-zinc-400">
        {campaign.description} · Sconto {campaign.discountPercent}%
      </p>
    </div>
  );
}

function PlanCard({
  plan,
  loading,
  onCheckout,
}: {
  plan: SubscriptionPlan;
  loading: boolean;
  onCheckout: () => void;
}) {
  return (
    <Card className={plan.tier === "pro" ? "border-amber-500/50" : ""}>
      <CardHeader>
        <CardTitle>{plan.name}</CardTitle>
        <CardDescription>{plan.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-3xl font-semibold">{formatCents(plan.monthlyPriceCents)}/mese</p>
        <ul className="space-y-2 text-sm text-zinc-300">
          {plan.features.map((feature) => (
            <li key={feature}>• {feature}</li>
          ))}
        </ul>
        <Button className="w-full" onClick={onCheckout} disabled={loading}>
          {loading ? "Apertura checkout..." : `Attiva ${plan.name}`}
        </Button>
      </CardContent>
    </Card>
  );
}
