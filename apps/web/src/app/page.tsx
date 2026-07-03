import {
  BadgeEuro,
  BarChart3,
  CalendarDays,
  Crown,
  Gift,
  Scissors,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { BarberBookingForm } from "@/app/barber-booking-form";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.22),_transparent_32%),linear-gradient(135deg,#050505_0%,#0a0a0f_48%,#171006_100%)] text-zinc-100">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-300 text-zinc-950 shadow-lg shadow-amber-500/20">
            <Scissors className="h-5 w-5" />
          </span>
          <div>
            <p className="text-lg font-semibold tracking-tight text-white">BarberOS Atelier</p>
            <p className="text-xs uppercase tracking-[0.32em] text-amber-200/70">Premium SaaS</p>
          </div>
        </div>
        <div className="hidden items-center gap-6 text-sm text-zinc-300 md:flex">
          <a href="#booking" className="hover:text-amber-200">
            Prenotazioni
          </a>
          <a href="#incassi" className="hover:text-amber-200">
            Incassi
          </a>
          <a href="#pricing" className="hover:text-amber-200">
            Abbonamenti
          </a>
        </div>
        <Button asChild className="rounded-full">
          <a href="#booking">Prova demo</a>
        </Button>
      </nav>

      <section className="mx-auto grid w-full max-w-7xl gap-10 px-6 pb-16 pt-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-sm text-amber-100">
            <Sparkles className="h-4 w-4" />
            App premium per barber shop scalabili
          </div>
          <h1 className="mt-6 max-w-3xl text-5xl font-semibold tracking-[-0.06em] text-white sm:text-7xl">
            Prenotazioni, clienti e incassi in un gestionale da vendere in abbonamento.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
            Una web app Vercel + Firebase pensata per barbieri premium: booking online,
            database clienti, dashboard cassa, campagne sconto e porta un amico, pronta per
            monetizzare con Stripe.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="rounded-full px-8">
              <a href="#booking">Prenota una demo</a>
            </Button>
            <Button asChild size="lg" variant="secondary" className="rounded-full px-8">
              <a href="#pricing">Vedi piani SaaS</a>
            </Button>
          </div>
          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {heroStats.map((stat) => (
              <div key={stat.label} className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                <p className="text-3xl font-semibold text-white">{stat.value}</p>
                <p className="mt-2 text-sm text-zinc-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-6 rounded-[3rem] bg-amber-400/20 blur-3xl" />
          <div className="relative rounded-[2.5rem] border border-white/10 bg-zinc-950/75 p-5 shadow-2xl shadow-black/50 backdrop-blur">
            <div className="rounded-[2rem] border border-amber-300/20 bg-gradient-to-br from-zinc-900 to-black p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-400">Oggi in salone</p>
                  <p className="text-3xl font-semibold text-white">1.840 euro</p>
                </div>
                <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-sm text-emerald-200">
                  +28%
                </span>
              </div>
              <div className="mt-6 grid gap-3">
                {appointments.map((item) => (
                  <div key={item.time} className="flex items-center justify-between rounded-2xl bg-white/[0.04] p-4">
                    <div className="flex items-center gap-3">
                      <span className="rounded-xl bg-amber-300/15 px-3 py-2 text-sm text-amber-100">
                        {item.time}
                      </span>
                      <div>
                        <p className="font-medium text-white">{item.name}</p>
                        <p className="text-sm text-zinc-400">{item.service}</p>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-amber-200">{item.price}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-3xl bg-amber-300 p-5 text-zinc-950">
                <p className="text-sm font-medium uppercase tracking-[0.25em]">Campagna attiva</p>
                <p className="mt-2 text-2xl font-semibold">Porta un amico: -20%</p>
                <p className="mt-2 text-sm text-zinc-800">
                  43 inviti, 12 nuovi clienti e 780 euro di incassi tracciati.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="incassi" className="mx-auto w-full max-w-7xl px-6 py-12">
        <div className="grid gap-4 md:grid-cols-4">
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <article key={module.title} className="rounded-[2rem] border border-zinc-800 bg-zinc-950/70 p-6">
                <Icon className="h-7 w-7 text-amber-300" />
                <h2 className="mt-5 text-xl font-semibold text-white">{module.title}</h2>
                <p className="mt-3 text-sm leading-6 text-zinc-400">{module.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-6 py-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2rem] border border-zinc-800 bg-zinc-950/70 p-6">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-200/70">Gestionale interno</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
            Incassi, clienti e performance sempre sotto controllo.
          </h2>
          <p className="mt-4 text-zinc-400">
            Il salone vede cassa giornaliera, servizi piu venduti, valore cliente e referral. Le
            collection Firebase sono gia separate per booking, clienti, pagamenti e campagne.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {cashCards.map((card) => (
            <div key={card.label} className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
              <p className="text-sm text-zinc-400">{card.label}</p>
              <p className="mt-3 text-3xl font-semibold text-white">{card.value}</p>
              <p className="mt-2 text-sm text-emerald-200">{card.delta}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="booking" className="mx-auto w-full max-w-7xl px-6 py-12">
        <BarberBookingForm />
      </section>

      <section id="pricing" className="mx-auto w-full max-w-7xl px-6 pb-20 pt-12">
        <div className="rounded-[2.5rem] border border-amber-300/20 bg-gradient-to-br from-amber-300/15 via-zinc-950 to-black p-8">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <Crown className="h-10 w-10 text-amber-300" />
              <h2 className="mt-5 text-4xl font-semibold tracking-tight text-white">
                Modello scalabile: Basic per iniziare, Pro per vendere piu automazioni.
              </h2>
              <p className="mt-4 text-zinc-300">
                Stripe gestisce abbonamenti mensili, upgrade e rinnovi. Firebase permette di
                separare i dati per ogni salone quando il prodotto diventa multi-tenant.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {pricingIdeas.map((idea) => (
                <div key={idea.title} className="rounded-3xl border border-white/10 bg-black/30 p-5">
                  <p className="text-lg font-semibold text-white">{idea.title}</p>
                  <p className="mt-2 text-sm leading-6 text-zinc-400">{idea.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

const heroStats = [
  { value: "24/7", label: "prenotazioni online" },
  { value: "4", label: "database core Firebase" },
  { value: "2", label: "piani SaaS monetizzabili" },
];

const appointments = [
  { time: "10:00", name: "Luca B.", service: "Combo signature", price: "65 euro" },
  { time: "11:30", name: "Marco V.", service: "Barba rituale", price: "35 euro" },
  { time: "15:00", name: "Andrea S.", service: "Taglio premium", price: "45 euro" },
];

const modules = [
  {
    title: "Prenotazioni integrate",
    description: "Form pubblico, stati chiari e salvataggio su Firestore o demo locale.",
    icon: CalendarDays,
  },
  {
    title: "Incassi e KPI",
    description: "Dashboard per cassa, ticket medio, servizi top e crescita mensile.",
    icon: BadgeEuro,
  },
  {
    title: "CRM clienti",
    description: "Anagrafica, storico visite, valore cliente, loyalty e note operative.",
    icon: Users,
  },
  {
    title: "Referral e sconti",
    description: "Campagne porta un amico, coupon e segmenti per clienti dormienti.",
    icon: Gift,
  },
];

const cashCards = [
  { label: "Incasso mese", value: "18.420 euro", delta: "+18% vs mese scorso" },
  { label: "Ticket medio", value: "46 euro", delta: "+7 euro per cliente" },
  { label: "Clienti attivi", value: "312", delta: "64 iscritti loyalty" },
];

const pricingIdeas = [
  {
    title: "Basic",
    body: "Agenda, clienti, incassi giornalieri, promemoria manuali e una campagna sconto attiva.",
  },
  {
    title: "Pro",
    body: "Multi-barbiere, referral automatico, segmenti clienti, report avanzati e automazioni marketing.",
  },
  {
    title: "Extra revenue",
    body: "Setup iniziale, template campagne, pacchetto foto/video salone e consulenza mensile.",
  },
  {
    title: "Marketplace futuro",
    body: "Commissione su prodotti grooming, gift card digitali e booking per barber indipendenti.",
  },
];
