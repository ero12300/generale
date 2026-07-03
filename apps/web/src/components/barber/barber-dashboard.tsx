"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { CalendarDays, Crown, Euro, Sparkles, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  createBooking,
  createCampaign,
  createClient,
  createPayment,
  listBarberData,
  promoteSubscriptionTier,
  updateBookingStatus,
} from "@/lib/barber/repository";
import {
  BarberBooking,
  BarberCampaign,
  BarberClient,
  BarberPayment,
  BookingStatus,
  CampaignType,
  SubscriptionTier,
} from "@/lib/barber/types";

type SaveState = "idle" | "saving" | "success" | "error";

const euro = new Intl.NumberFormat("it-IT", {
  style: "currency",
  currency: "EUR",
});

const shortDate = new Intl.DateTimeFormat("it-IT", {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

export function BarberDashboard() {
  const [bookings, setBookings] = useState<BarberBooking[]>([]);
  const [clients, setClients] = useState<BarberClient[]>([]);
  const [payments, setPayments] = useState<BarberPayment[]>([]);
  const [campaigns, setCampaigns] = useState<BarberCampaign[]>([]);
  const [tier, setTier] = useState<SubscriptionTier>("basic");
  const [loadingData, setLoadingData] = useState(true);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [bookingState, setBookingState] = useState<SaveState>("idle");
  const [paymentState, setPaymentState] = useState<SaveState>("idle");
  const [clientState, setClientState] = useState<SaveState>("idle");
  const [campaignState, setCampaignState] = useState<SaveState>("idle");
  const [checkoutState, setCheckoutState] = useState<SaveState>("idle");

  const [bookingForm, setBookingForm] = useState({
    clientName: "",
    clientPhone: "",
    serviceName: "Taglio Uomo",
    startsAtIso: "",
  });
  const [paymentForm, setPaymentForm] = useState({
    amount: "",
    method: "card" as "cash" | "card" | "bank_transfer",
    note: "",
  });
  const [clientForm, setClientForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    notes: "",
  });
  const [campaignForm, setCampaignForm] = useState({
    title: "",
    type: "discount" as CampaignType,
    incentiveText: "",
  });

  useEffect(() => {
    void loadData();
  }, []);

  async function loadData() {
    setLoadingData(true);
    setGlobalError(null);
    try {
      const data = await listBarberData();
      setBookings(data.bookings);
      setClients(data.clients);
      setPayments(data.payments);
      setCampaigns(data.campaigns);
      setTier(data.subscriptionTier);
    } catch {
      setGlobalError("Errore nel caricamento dati. Riprova tra qualche secondo.");
    } finally {
      setLoadingData(false);
    }
  }

  const monthlyRevenue = useMemo(
    () => payments.reduce((sum, payment) => sum + payment.amountCents, 0),
    [payments]
  );
  const upcomingBookings = useMemo(
    () => bookings.filter((booking) => booking.status !== "completed").length,
    [bookings]
  );
  const activeCampaigns = useMemo(
    () => campaigns.filter((campaign) => campaign.active).length,
    [campaigns]
  );

  async function onCreateBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBookingState("saving");
    try {
      const created = await createBooking({
        ...bookingForm,
        startsAtIso: new Date(bookingForm.startsAtIso).toISOString(),
        source: "internal",
      });
      setBookings((prev) => [created, ...prev]);
      setBookingForm({ clientName: "", clientPhone: "", serviceName: "Taglio Uomo", startsAtIso: "" });
      setBookingState("success");
    } catch {
      setBookingState("error");
    }
  }

  async function onCreatePayment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPaymentState("saving");
    const amountCents = Math.round(Number(paymentForm.amount) * 100);
    if (!Number.isFinite(amountCents) || amountCents <= 0) {
      setPaymentState("error");
      return;
    }
    try {
      const created = await createPayment({
        amountCents,
        method: paymentForm.method,
        note: paymentForm.note,
      });
      setPayments((prev) => [created, ...prev]);
      setPaymentForm({ amount: "", method: "card", note: "" });
      setPaymentState("success");
    } catch {
      setPaymentState("error");
    }
  }

  async function onCreateClient(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setClientState("saving");
    try {
      const created = await createClient(clientForm);
      setClients((prev) => [created, ...prev]);
      setClientForm({ fullName: "", phone: "", email: "", notes: "" });
      setClientState("success");
    } catch {
      setClientState("error");
    }
  }

  async function onCreateCampaign(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCampaignState("saving");
    try {
      const created = await createCampaign(campaignForm);
      setCampaigns((prev) => [created, ...prev]);
      setCampaignForm({ title: "", type: "discount", incentiveText: "" });
      setCampaignState("success");
    } catch {
      setCampaignState("error");
    }
  }

  async function onUpgradeToPro() {
    setCheckoutState("saving");
    try {
      const response = await fetch("/api/barber/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "pro" }),
      });
      const payload = (await response.json()) as { url?: string; message?: string };
      if (payload.url) {
        window.location.href = payload.url;
        return;
      }
      if (!response.ok) {
        throw new Error(payload.message ?? "Checkout non disponibile");
      }
      await promoteSubscriptionTier("pro");
      setTier("pro");
      setCheckoutState("success");
    } catch {
      setCheckoutState("error");
    }
  }

  async function onSetBookingStatus(bookingId: string, status: BookingStatus) {
    await updateBookingStatus(bookingId, status);
    setBookings((prev) => prev.map((entry) => (entry.id === bookingId ? { ...entry, status } : entry)));
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-amber-600/30 bg-gradient-to-r from-zinc-900 to-zinc-950 p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-amber-400">BarberOS Premium</p>
            <h1 className="text-3xl font-semibold mt-1">Gestionale completo per barbiere moderno</h1>
            <p className="text-zinc-400 mt-2">
              Incassi, prenotazioni, CRM e campagne in un solo pannello pronto per Vercel + Firebase.
            </p>
          </div>
          <Badge variant="secondary" className="w-fit">
            Piano attuale: {tier.toUpperCase()}
          </Badge>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          icon={Euro}
          title="Incassi registrati"
          value={euro.format(monthlyRevenue / 100)}
          hint="Totale periodo demo"
        />
        <KpiCard
          icon={CalendarDays}
          title="Prenotazioni aperte"
          value={String(upcomingBookings)}
          hint="Nuove + confermate"
        />
        <KpiCard icon={Users} title="Clienti CRM" value={String(clients.length)} hint="Anagrafica unica" />
        <KpiCard
          icon={Sparkles}
          title="Campagne attive"
          value={String(activeCampaigns)}
          hint="Sconti e referral"
        />
      </section>

      {loadingData ? (
        <Card>
          <CardContent className="p-6 text-sm text-zinc-400">Caricamento dati in corso...</CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="bookings">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="bookings">Prenotazioni</TabsTrigger>
            <TabsTrigger value="payments">Incassi</TabsTrigger>
            <TabsTrigger value="clients">Clienti</TabsTrigger>
            <TabsTrigger value="campaigns">Campagne</TabsTrigger>
            <TabsTrigger value="monetization">Monetizzazione</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>Agenda prenotazioni</CardTitle>
                <CardDescription>Inserisci appuntamenti interni o conferma richieste online.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 lg:grid-cols-2">
                <form className="space-y-3" onSubmit={onCreateBooking}>
                  <Input
                    required
                    placeholder="Nome cliente"
                    value={bookingForm.clientName}
                    onChange={(event) =>
                      setBookingForm((prev) => ({ ...prev, clientName: event.target.value }))
                    }
                  />
                  <Input
                    required
                    placeholder="Telefono"
                    value={bookingForm.clientPhone}
                    onChange={(event) =>
                      setBookingForm((prev) => ({ ...prev, clientPhone: event.target.value }))
                    }
                  />
                  <Input
                    required
                    placeholder="Servizio"
                    value={bookingForm.serviceName}
                    onChange={(event) =>
                      setBookingForm((prev) => ({ ...prev, serviceName: event.target.value }))
                    }
                  />
                  <Input
                    required
                    type="datetime-local"
                    value={bookingForm.startsAtIso}
                    onChange={(event) =>
                      setBookingForm((prev) => ({ ...prev, startsAtIso: event.target.value }))
                    }
                  />
                  <StatusRow state={bookingState} />
                  <Button disabled={bookingState === "saving"} type="submit">
                    Aggiungi prenotazione
                  </Button>
                </form>

                <div className="space-y-2">
                  {bookings.map((booking) => (
                    <article key={booking.id} className="rounded-lg border border-zinc-800 p-3 text-sm">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-medium">{booking.clientName}</p>
                          <p className="text-zinc-500">
                            {booking.serviceName} · {shortDate.format(new Date(booking.startsAtIso))}
                          </p>
                        </div>
                        <Badge variant="secondary">{booking.status}</Badge>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          onClick={() => onSetBookingStatus(booking.id, "confirmed")}
                        >
                          Conferma
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => onSetBookingStatus(booking.id, "completed")}
                        >
                          Completa
                        </Button>
                      </div>
                    </article>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>Gestione incassi</CardTitle>
                <CardDescription>Registra pagamenti cassa/carta/bonifico e traccia il totale.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 lg:grid-cols-2">
                <form className="space-y-3" onSubmit={onCreatePayment}>
                  <Input
                    required
                    type="number"
                    min="1"
                    step="0.01"
                    placeholder="Importo in EUR"
                    value={paymentForm.amount}
                    onChange={(event) =>
                      setPaymentForm((prev) => ({ ...prev, amount: event.target.value }))
                    }
                  />
                  <Input
                    required
                    placeholder="Metodo (cash/card/bank_transfer)"
                    value={paymentForm.method}
                    onChange={(event) =>
                      setPaymentForm((prev) => ({
                        ...prev,
                        method: event.target.value as "cash" | "card" | "bank_transfer",
                      }))
                    }
                  />
                  <Input
                    placeholder="Nota"
                    value={paymentForm.note}
                    onChange={(event) => setPaymentForm((prev) => ({ ...prev, note: event.target.value }))}
                  />
                  <StatusRow state={paymentState} />
                  <Button disabled={paymentState === "saving"} type="submit">
                    Registra incasso
                  </Button>
                </form>
                <div className="space-y-2">
                  {payments.map((payment) => (
                    <article key={payment.id} className="rounded-lg border border-zinc-800 p-3 text-sm">
                      <p className="font-medium">{euro.format(payment.amountCents / 100)}</p>
                      <p className="text-zinc-500">
                        {payment.method} · {shortDate.format(new Date(payment.createdAtIso))}
                      </p>
                      {payment.note && <p className="text-zinc-400 mt-1">{payment.note}</p>}
                    </article>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="clients">
            <Card>
              <CardHeader>
                <CardTitle>Database clienti</CardTitle>
                <CardDescription>Gestione contatti, storico visite e note operative.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 lg:grid-cols-2">
                <form className="space-y-3" onSubmit={onCreateClient}>
                  <Input
                    required
                    placeholder="Nome completo"
                    value={clientForm.fullName}
                    onChange={(event) =>
                      setClientForm((prev) => ({ ...prev, fullName: event.target.value }))
                    }
                  />
                  <Input
                    required
                    placeholder="Telefono"
                    value={clientForm.phone}
                    onChange={(event) => setClientForm((prev) => ({ ...prev, phone: event.target.value }))}
                  />
                  <Input
                    placeholder="Email"
                    value={clientForm.email}
                    onChange={(event) => setClientForm((prev) => ({ ...prev, email: event.target.value }))}
                  />
                  <Input
                    placeholder="Note"
                    value={clientForm.notes}
                    onChange={(event) => setClientForm((prev) => ({ ...prev, notes: event.target.value }))}
                  />
                  <StatusRow state={clientState} />
                  <Button disabled={clientState === "saving"} type="submit">
                    Aggiungi cliente
                  </Button>
                </form>
                <div className="space-y-2">
                  {clients.map((client) => (
                    <article key={client.id} className="rounded-lg border border-zinc-800 p-3 text-sm">
                      <p className="font-medium">{client.fullName}</p>
                      <p className="text-zinc-500">
                        {client.phone} · visite: {client.visits}
                      </p>
                      {client.notes && <p className="text-zinc-400 mt-1">{client.notes}</p>}
                    </article>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="campaigns">
            <Card>
              <CardHeader>
                <CardTitle>Campagne sconti e referral</CardTitle>
                <CardDescription>Crea offerte fedeltà e porta-un-amico in pochi secondi.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 lg:grid-cols-2">
                <form className="space-y-3" onSubmit={onCreateCampaign}>
                  <Input
                    required
                    placeholder="Titolo campagna"
                    value={campaignForm.title}
                    onChange={(event) =>
                      setCampaignForm((prev) => ({ ...prev, title: event.target.value }))
                    }
                  />
                  <Input
                    required
                    placeholder="Tipo (discount/referral)"
                    value={campaignForm.type}
                    onChange={(event) =>
                      setCampaignForm((prev) => ({
                        ...prev,
                        type: event.target.value as CampaignType,
                      }))
                    }
                  />
                  <Input
                    required
                    placeholder="Incentivo"
                    value={campaignForm.incentiveText}
                    onChange={(event) =>
                      setCampaignForm((prev) => ({ ...prev, incentiveText: event.target.value }))
                    }
                  />
                  <StatusRow state={campaignState} />
                  <Button disabled={campaignState === "saving"} type="submit">
                    Crea campagna
                  </Button>
                </form>
                <div className="space-y-2">
                  {campaigns.map((campaign) => (
                    <article key={campaign.id} className="rounded-lg border border-zinc-800 p-3 text-sm">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{campaign.title}</p>
                        <Badge variant="secondary">{campaign.type}</Badge>
                      </div>
                      <p className="text-zinc-400 mt-1">{campaign.incentiveText}</p>
                    </article>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monetization">
            <Card>
              <CardHeader>
                <CardTitle>Strategia monetizzazione SaaS</CardTitle>
                <CardDescription>
                  Struttura base/pro pronta per vendere abbonamenti mensili ai barber shop.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 lg:grid-cols-2">
                <PlanCard
                  name="Basic"
                  price="29EUR/mese"
                  items={["Agenda prenotazioni", "CRM base", "Gestione incassi"]}
                  active={tier === "basic"}
                />
                <PlanCard
                  name="Pro"
                  price="79EUR/mese"
                  items={[
                    "Tutto Basic",
                    "Campagne referral automatiche",
                    "Report KPI avanzati",
                    "API per multi-sede",
                  ]}
                  active={tier === "pro"}
                  action={
                    <Button
                      type="button"
                      onClick={onUpgradeToPro}
                      disabled={checkoutState === "saving" || tier === "pro"}
                    >
                      <Crown className="mr-1 h-4 w-4" />
                      Attiva Pro con Stripe
                    </Button>
                  }
                />
                <StatusRow state={checkoutState} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {globalError && (
        <Card className="border-red-600/60">
          <CardContent className="p-4 text-sm text-red-300">{globalError}</CardContent>
        </Card>
      )}
    </div>
  );
}

function StatusRow({ state }: { state: SaveState }) {
  if (state === "idle") return null;
  if (state === "saving") return <p className="text-xs text-zinc-400">Salvataggio in corso...</p>;
  if (state === "success") return <p className="text-xs text-emerald-400">Salvato correttamente.</p>;
  return <p className="text-xs text-red-300">Operazione non riuscita, controlla i dati.</p>;
}

function KpiCard({
  icon: Icon,
  title,
  value,
  hint,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string;
  hint: string;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-zinc-400">{title}</p>
            <p className="text-2xl font-semibold mt-1">{value}</p>
            <p className="text-xs text-zinc-500 mt-1">{hint}</p>
          </div>
          <Icon className="h-5 w-5 text-amber-400" />
        </div>
      </CardContent>
    </Card>
  );
}

function PlanCard({
  name,
  price,
  items,
  active,
  action,
}: {
  name: string;
  price: string;
  items: string[];
  active: boolean;
  action?: React.ReactNode;
}) {
  return (
    <article className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{name}</h3>
        {active ? <Badge variant="secondary">Attivo</Badge> : null}
      </div>
      <p className="text-2xl font-semibold mt-2">{price}</p>
      <ul className="mt-3 space-y-1 text-sm text-zinc-400">
        {items.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
      {action ? <div className="mt-4">{action}</div> : null}
    </article>
  );
}
