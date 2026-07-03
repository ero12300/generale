import Link from "next/link";
import type { ComponentType, ReactNode } from "react";
import {
  ArrowRight,
  BadgeEuro,
  CalendarCheck2,
  Check,
  Crown,
  Database,
  Gem,
  Gift,
  LineChart,
  LockKeyhole,
  MessageCircle,
  Scissors,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  WalletCards,
} from "lucide-react";
import { BookingForm } from "@/components/booking-form";
import { CheckoutButton } from "@/components/checkout-button";
import {
  bookings,
  campaigns,
  clients,
  monthlyRevenueCents,
  projectedSubscriptionRevenueCents,
  revenueEntries,
  services,
} from "@/lib/demo-data";
import { formatCurrencyFromCents, formatDate, formatTime } from "@/lib/format";
import { planFeatures, planPricing } from "@/lib/plans";

const firebaseReady = Boolean(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
const stripeReady = Boolean(process.env.STRIPE_SECRET_KEY);

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden">
      <Hero />
      <TrustBar />
      <DashboardPreview />
      <BookingSection />
      <MonetizationSection />
      <PricingSection />
      <Footer />
    </main>
  );
}

function Hero() {
  return (
    <section className="relative px-5 py-8 sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-amber-300/15 bg-stone-950/55 px-5 py-3 backdrop-blur">
        <Link href="/" className="flex items-center gap-3" aria-label="Barber Desk home">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-300 text-stone-950">
            <Scissors className="h-5 w-5" aria-hidden />
          </span>
          <span>
            <span className="block text-sm font-semibold uppercase tracking-[0.3em] text-amber-100">
              Barber Desk
            </span>
            <span className="text-xs text-stone-400">Premium barber SaaS</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-stone-300 md:flex" aria-label="Navigazione">
          <a href="#gestionale" className="hover:text-amber-200">
            Gestionale
          </a>
          <a href="#prenota" className="hover:text-amber-200">
            Prenotazioni
          </a>
          <a href="#pricing" className="hover:text-amber-200">
            Prezzi
          </a>
        </nav>
        <a
          href="#prenota"
          className="rounded-full border border-amber-300/30 px-4 py-2 text-sm font-medium text-amber-100 hover:bg-amber-300/10"
        >
          Prova demo
        </a>
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-24">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-4 py-2 text-sm text-amber-100">
            <Sparkles className="h-4 w-4" aria-hidden />
            Gestionale premium per barbieri moderni
          </div>
          <h1 className="mt-7 max-w-4xl text-5xl font-semibold tracking-[-0.05em] text-white sm:text-7xl">
            Prenotazioni, incassi e clienti in un solo salone digitale.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-300">
            Un’app scalabile per vendere abbonamenti ai barber shop: booking online, CRM clienti,
            incassi, campagne sconto, referral “porta un amico” e upgrade Pro con Stripe.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#gestionale"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-300 px-6 py-3 font-semibold text-stone-950 transition hover:bg-amber-200"
            >
              Vedi gestionale <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
            <a
              href="#pricing"
              className="inline-flex items-center justify-center rounded-full border border-stone-700 px-6 py-3 font-semibold text-stone-100 transition hover:border-amber-300/40 hover:bg-stone-900"
            >
              Monetizza con piani SaaS
            </a>
          </div>
          <div className="mt-8 grid gap-3 text-sm text-stone-400 sm:grid-cols-3">
            <StatusPill label="Firebase" value={firebaseReady ? "Configurato" : "Demo ready"} />
            <StatusPill label="Stripe" value={stripeReady ? "Checkout live" : "Checkout ready"} />
            <StatusPill label="Deploy" value="Vercel" />
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-8 rounded-[3rem] bg-amber-300/10 blur-3xl" />
          <div className="relative rounded-[2.5rem] border border-amber-300/20 bg-stone-950/70 p-4 shadow-2xl shadow-black/50 backdrop-blur">
            <div className="rounded-[2rem] border border-stone-800 bg-gradient-to-br from-stone-900 to-stone-950 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-amber-200/70">Oggi</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">Royal Cut Studio</h2>
                </div>
                <Crown className="h-8 w-8 text-amber-300" aria-hidden />
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <Metric label="Incasso mese" value={formatCurrencyFromCents(monthlyRevenueCents)} />
                <Metric label="Clienti" value={`${clients.length * 64}+`} />
                <Metric label="Slot liberi" value="7" />
              </div>
              <div className="mt-6 space-y-3">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between rounded-2xl border border-stone-800 bg-stone-900/70 p-4"
                  >
                    <div>
                      <p className="font-medium text-white">{booking.clientName}</p>
                      <p className="mt-1 text-sm text-stone-400">
                        {services.find((service) => service.id === booking.serviceId)?.name}
                      </p>
                    </div>
                    <span className="rounded-full bg-amber-300/10 px-3 py-1 text-sm text-amber-100">
                      {formatTime(booking.startsAt)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustBar() {
  const items = [
    { icon: CalendarCheck2, text: "Booking integrato" },
    { icon: Database, text: "Database clienti" },
    { icon: WalletCards, text: "Incassi e report" },
    { icon: Gift, text: "Sconti e porta un amico" },
  ];

  return (
    <section className="border-y border-amber-300/10 bg-stone-950/45 px-5 py-5">
      <div className="mx-auto grid max-w-7xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-center gap-3 text-sm text-stone-300">
            <Icon className="h-5 w-5 text-amber-300" aria-hidden />
            {text}
          </div>
        ))}
      </div>
    </section>
  );
}

function DashboardPreview() {
  return (
    <section id="gestionale" className="px-5 py-20 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Gestionale interno"
          title="Controlla salone, incassi e crescita da una dashboard."
          description="La parte interna è pensata per il titolare: agenda, clienti, storico pagamenti, campagne e funzioni Pro bloccate per spingere l'abbonamento."
        />
        <div className="mt-10 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[2rem] border border-stone-800 bg-stone-950/65 p-5">
            <div className="grid gap-4 sm:grid-cols-3">
              <Kpi icon={BadgeEuro} label="Incasso mese" value={formatCurrencyFromCents(monthlyRevenueCents)} />
              <Kpi icon={Users} label="Clienti attivi" value={`${clients.length * 64}`} />
              <Kpi icon={LineChart} label="MRR stimato SaaS" value={formatCurrencyFromCents(projectedSubscriptionRevenueCents)} />
            </div>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <Panel title="Incassi recenti" icon={WalletCards}>
                {revenueEntries.map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between rounded-2xl bg-stone-900/70 p-3">
                    <div>
                      <p className="text-sm font-medium text-white">{entry.label}</p>
                      <p className="text-xs text-stone-500">
                        {formatDate(entry.paidAt)} · {entry.channel}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-emerald-300">
                      {formatCurrencyFromCents(entry.amountCents)}
                    </span>
                  </div>
                ))}
              </Panel>
              <Panel title="Database clienti" icon={Database}>
                {clients.map((client) => (
                  <div key={client.id} className="rounded-2xl border border-stone-800 bg-stone-900/60 p-3">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-white">{client.fullName}</p>
                      <span className="rounded-full bg-amber-300/10 px-2 py-1 text-xs text-amber-100">
                        {client.status}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-stone-500">
                      {client.visits} visite · LTV {formatCurrencyFromCents(client.lifetimeValueCents)}
                    </p>
                    <p className="mt-2 text-xs text-amber-200">Referral: {client.referralCode}</p>
                  </div>
                ))}
              </Panel>
            </div>
          </div>

          <div className="space-y-5">
            <Panel title="Campagne crescita" icon={Gift}>
              {campaigns.map((campaign) => (
                <div key={campaign.id} className="rounded-2xl border border-amber-300/15 bg-amber-300/10 p-4">
                  <p className="font-semibold text-white">{campaign.name}</p>
                  <p className="mt-1 text-sm text-stone-300">{campaign.reward}</p>
                  <p className="mt-3 text-xs text-amber-100/70">
                    {campaign.redemptions} utilizzi · {formatCurrencyFromCents(campaign.revenueCents)} generati
                  </p>
                </div>
              ))}
            </Panel>
            <div className="rounded-[2rem] border border-amber-300/20 bg-gradient-to-br from-amber-300/20 to-stone-950 p-5">
              <div className="flex items-center gap-3">
                <LockKeyhole className="h-5 w-5 text-amber-200" aria-hidden />
                <p className="text-sm uppercase tracking-[0.25em] text-amber-100">Funzioni Pro</p>
              </div>
              <h3 className="mt-4 text-2xl font-semibold text-white">Automazioni retention</h3>
              <p className="mt-3 text-sm leading-6 text-stone-300">
                Promemoria WhatsApp/SMS, report avanzati e campagne automatiche diventano leve di upgrade.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BookingSection() {
  return (
    <section id="prenota" className="px-5 py-20 sm:px-8 lg:px-12">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div>
          <SectionHeading
            eyebrow="Prenotazione integrata"
            title="Il cliente prenota, il salone vede tutto nel calendario."
            description="Il form gestisce servizio, orario, telefono e codice referral. In demo valida e conferma; con Firebase salva su Firestore."
          />
          <div className="mt-8 grid gap-4">
            {[
              "Riduci chiamate e messaggi manuali",
              "Raccogli dati cliente a ogni prenotazione",
              "Trasforma il codice amico in una campagna misurabile",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 text-stone-300">
                <Check className="h-5 w-5 text-emerald-300" aria-hidden />
                {item}
              </div>
            ))}
          </div>
        </div>
        <BookingForm />
      </div>
    </section>
  );
}

function MonetizationSection() {
  return (
    <section className="px-5 py-20 sm:px-8 lg:px-12">
      <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-3">
        <FeatureCard
          icon={ShieldCheck}
          title="Firebase per scalare"
          text="Auth, Firestore e regole tenant-ready per separare ogni barber shop e preparare il database clienti."
        />
        <FeatureCard
          icon={Gem}
          title="Vercel per vendere"
          text="Deploy rapido, preview commerciali e variabili ambiente per passare da demo a produzione."
        />
        <FeatureCard
          icon={MessageCircle}
          title="Stripe per monetizzare"
          text="Checkout subscription Basic/Pro: il piano Pro sblocca automazioni, referral e report avanzati."
        />
      </div>
    </section>
  );
}

function PricingSection() {
  return (
    <section id="pricing" className="px-5 py-20 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Monetizzazione"
          title="Un SaaS vendibile a barbieri con Basic e Pro."
          description="Prezzi iniziali semplici: Basic per entrare, Pro per aumentare retention e automazioni. Stripe gestisce abbonamento e upgrade."
        />
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {(["basic", "pro"] as const).map((plan) => (
            <div
              key={plan}
              className={`rounded-[2rem] border p-6 ${
                plan === "pro"
                  ? "border-amber-300/40 bg-amber-300/15"
                  : "border-stone-800 bg-stone-950/65"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-amber-100">
                    {planPricing[plan].name}
                  </p>
                  <p className="mt-3 text-4xl font-semibold text-white">
                    {formatCurrencyFromCents(planPricing[plan].monthlyCents)}
                    <span className="text-base font-normal text-stone-400">/mese</span>
                  </p>
                </div>
                {plan === "pro" ? <Star className="h-7 w-7 text-amber-200" aria-hidden /> : null}
              </div>
              <p className="mt-4 text-stone-300">{planPricing[plan].tagline}</p>
              <div className="mt-6 space-y-3">
                {planFeatures.map((feature) => {
                  const value = feature[plan];
                  return (
                    <div key={feature.label} className="flex items-center justify-between gap-4 text-sm">
                      <span className="text-stone-300">{feature.label}</span>
                      <span className={value ? "text-emerald-300" : "text-stone-600"}>
                        {typeof value === "string" ? value : value ? "Incluso" : "No"}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-6">
                <CheckoutButton plan={plan} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-amber-300/10 px-5 py-10 text-center text-sm text-stone-500">
      Barber Desk è pronto per Vercel, Firebase e Stripe. Configura le chiavi e sostituisci i dati demo con Firestore.
    </footer>
  );
}

function StatusPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-stone-800 bg-stone-950/70 p-3">
      <p className="text-xs uppercase tracking-[0.25em] text-stone-500">{label}</p>
      <p className="mt-1 font-medium text-amber-100">{value}</p>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-stone-800 bg-black/20 p-4">
      <p className="text-xs text-stone-500">{label}</p>
      <p className="mt-2 text-xl font-semibold text-white">{value}</p>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-sm uppercase tracking-[0.35em] text-amber-200/70">{eyebrow}</p>
      <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">{title}</h2>
      <p className="mt-5 text-lg leading-8 text-stone-300">{description}</p>
    </div>
  );
}

function Kpi({
  icon: Icon,
  label,
  value,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-5">
      <Icon className="h-5 w-5 text-amber-300" aria-hidden />
      <p className="mt-4 text-xs uppercase tracking-[0.25em] text-stone-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}

function Panel({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: ComponentType<{ className?: string }>;
  children: ReactNode;
}) {
  return (
    <div className="rounded-[1.75rem] border border-stone-800 bg-stone-950/70 p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-white">{title}</h3>
        <Icon className="h-5 w-5 text-amber-300" aria-hidden />
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  text,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[2rem] border border-stone-800 bg-stone-950/65 p-6">
      <Icon className="h-7 w-7 text-amber-300" aria-hidden />
      <h3 className="mt-5 text-xl font-semibold text-white">{title}</h3>
      <p className="mt-3 leading-7 text-stone-300">{text}</p>
    </div>
  );
}
