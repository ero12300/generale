import Link from 'next/link'
import { Scissors, BarChart3, Users, Calendar, Star, Shield, Zap, Check, ArrowRight, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { PLANS } from '@/lib/stripe'
import { formatCurrency } from '@/lib/utils'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[rgb(10,10,10)] overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[rgba(212,175,55,0.1)] bg-[rgba(10,10,10,0.9)] backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gold-gradient flex items-center justify-center">
              <Scissors className="w-4 h-4 text-[rgb(10,10,10)]" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              <span className="gold-text">Barber</span>
              <span className="text-[rgb(250,245,235)]">OS</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-[rgb(140,130,110)]">
            <a href="#features" className="hover:text-[rgb(250,245,235)] transition-colors">Funzionalità</a>
            <a href="#pricing" className="hover:text-[rgb(250,245,235)] transition-colors">Prezzi</a>
            <a href="#testimonials" className="hover:text-[rgb(250,245,235)] transition-colors">Testimonianze</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Accedi</Button>
            </Link>
            <Link href="/login?mode=signup">
              <Button size="sm">Inizia Gratis</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-[rgba(212,175,55,0.04)] blur-3xl" />
        </div>
        <div className="max-w-5xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(212,175,55,0.3)] bg-[rgba(212,175,55,0.08)] text-[rgb(212,175,55)] text-sm font-medium mb-8">
            <Star className="w-3.5 h-3.5" />
            Il gestionale #1 per barbieri professionisti
          </div>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            Il tuo salone.<br />
            <span className="gold-text">Il tuo business.</span><br />
            Automatizzato.
          </h1>
          <p className="text-xl text-[rgb(140,130,110)] max-w-2xl mx-auto mb-10 leading-relaxed">
            Prenotazioni online, gestione incassi, database clienti e campagne marketing.
            Tutto ciò che serve per far crescere il tuo salone, in un unico strumento premium.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login?mode=signup">
              <Button size="xl" className="w-full sm:w-auto">
                Inizia Gratis — Nessuna carta
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" size="xl" className="w-full sm:w-auto">
                Scopri le funzionalità
                <ChevronRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
          <p className="mt-5 text-sm text-[rgb(80,75,65)]">
            Piano Free sempre disponibile · Upgrade in qualsiasi momento
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-4 border-y border-[rgba(212,175,55,0.1)]">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '500+', label: 'Saloni attivi' },
            { value: '98%', label: 'Soddisfazione clienti' },
            { value: '€2.4M', label: 'Fatturato gestito' },
            { value: '50K+', label: 'Prenotazioni/mese' },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl font-bold gold-text mb-1">{stat.value}</div>
              <div className="text-sm text-[rgb(140,130,110)]">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Tutto quello che serve,<br />
              <span className="gold-text">niente di superfluo</span>
            </h2>
            <p className="text-[rgb(140,130,110)] text-lg max-w-2xl mx-auto">
              Progettato specificamente per barbieri professionisti che vogliono gestire il proprio business in modo efficiente.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <Card key={f.title} className="hover:border-[rgba(212,175,55,0.3)] transition-all duration-300 hover:card-glow">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${f.iconBg}`}>
                  <f.icon className={`w-6 h-6 ${f.iconColor}`} />
                </div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-[rgb(140,130,110)] text-sm leading-relaxed">{f.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-16 px-4 bg-[rgb(14,14,14)]">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Dashboard professionale</h2>
          <p className="text-[rgb(140,130,110)] mb-10">Tutti i dati del tuo salone in un colpo d&apos;occhio</p>
          <div className="rounded-2xl border border-[rgba(212,175,55,0.2)] overflow-hidden bg-[rgb(18,18,18)] p-6 shadow-2xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {MOCK_KPI.map((k) => (
                <div key={k.label} className="bg-[rgb(22,22,22)] rounded-xl p-4 text-left border border-[rgba(212,175,55,0.08)]">
                  <div className="text-xs text-[rgb(140,130,110)] mb-1">{k.label}</div>
                  <div className="text-2xl font-bold gold-text">{k.value}</div>
                  <div className="text-xs text-green-400 mt-1">{k.trend}</div>
                </div>
              ))}
            </div>
            <div className="h-32 bg-[rgb(22,22,22)] rounded-xl border border-[rgba(212,175,55,0.08)] flex items-center justify-center">
              <div className="flex items-end gap-1 h-20">
                {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 100].map((h, i) => (
                  <div
                    key={i}
                    className="w-5 rounded-t-sm"
                    style={{
                      height: `${h}%`,
                      background: `rgba(212, 175, 55, ${0.3 + (h / 100) * 0.7})`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            Cosa dicono i <span className="gold-text">professionisti</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <Card key={t.name} className="hover:border-[rgba(212,175,55,0.3)] transition-colors">
                <div className="flex mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-[rgb(212,175,55)] fill-[rgb(212,175,55)]" />
                  ))}
                </div>
                <p className="text-sm text-[rgb(180,170,150)] italic mb-4 leading-relaxed">&quot;{t.quote}&quot;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center text-[rgb(10,10,10)] font-bold text-sm">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{t.name}</div>
                    <div className="text-xs text-[rgb(140,130,110)]">{t.shop}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-4 bg-[rgb(14,14,14)]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Prezzi <span className="gold-text">trasparenti</span>
            </h2>
            <p className="text-[rgb(140,130,110)] text-lg">Inizia gratis, scala quando sei pronto</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="relative">
              <div className="text-sm text-[rgb(140,130,110)] uppercase tracking-widest mb-2">Free</div>
              <div className="text-4xl font-bold mb-1">€0<span className="text-base font-normal text-[rgb(140,130,110)]">/mese</span></div>
              <p className="text-sm text-[rgb(140,130,110)] mb-6">Perfetto per iniziare</p>
              <ul className="space-y-3 mb-8">
                {PLANS.free.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm">
                    <Check className="w-4 h-4 text-[rgb(212,175,55)] flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/login?mode=signup">
                <Button variant="outline" className="w-full">Inizia Gratis</Button>
              </Link>
            </Card>

            <Card className="relative border-[rgba(212,175,55,0.4)] bg-gradient-to-b from-[rgba(212,175,55,0.08)] to-transparent">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full gold-gradient text-[rgb(10,10,10)] text-xs font-bold">
                PIÙ POPOLARE
              </div>
              <div className="text-sm text-[rgb(212,175,55)] uppercase tracking-widest mb-2">Pro</div>
              <div className="text-4xl font-bold mb-1">
                €29<span className="text-base font-normal text-[rgb(140,130,110)]">/mese</span>
              </div>
              <p className="text-sm text-[rgb(140,130,110)] mb-6">O €249/anno (risparmia €99)</p>
              <ul className="space-y-3 mb-8">
                {PLANS.pro.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm">
                    <Check className="w-4 h-4 text-[rgb(212,175,55)] flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/login?mode=signup">
                <Button className="w-full">Inizia con Pro — 14 giorni gratis</Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Pronto a professionalizzare<br />
            <span className="gold-text">il tuo salone?</span>
          </h2>
          <p className="text-[rgb(140,130,110)] text-lg mb-8">
            Unisciti a 500+ barbieri che hanno già trasformato il loro business con BarberOS.
          </p>
          <Link href="/login?mode=signup">
            <Button size="xl">
              Crea il tuo account gratis
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[rgba(212,175,55,0.1)] py-12 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg gold-gradient flex items-center justify-center">
              <Scissors className="w-3.5 h-3.5 text-[rgb(10,10,10)]" />
            </div>
            <span className="font-bold">
              <span className="gold-text">Barber</span>
              <span>OS</span>
            </span>
          </div>
          <p className="text-sm text-[rgb(80,75,65)]">
            © 2026 BarberOS. Tutti i diritti riservati.
          </p>
          <div className="flex gap-6 text-sm text-[rgb(80,75,65)]">
            <a href="#" className="hover:text-[rgb(212,175,55)] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[rgb(212,175,55)] transition-colors">Termini</a>
            <a href="mailto:info@barberos.it" className="hover:text-[rgb(212,175,55)] transition-colors">Contatti</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

const FEATURES = [
  {
    icon: Calendar,
    title: 'Prenotazioni Online',
    description: 'I tuoi clienti prenotano 24/7 dal link del tuo salone. Conferme automatiche, nessuna chiamata persa.',
    iconBg: 'bg-[rgba(212,175,55,0.1)]',
    iconColor: 'text-[rgb(212,175,55)]',
  },
  {
    icon: BarChart3,
    title: 'Gestione Incassi',
    description: 'Traccia ogni transazione, visualizza statistiche giornaliere/mensili e analizza i tuoi guadagni.',
    iconBg: 'bg-[rgba(34,197,94,0.1)]',
    iconColor: 'text-green-400',
  },
  {
    icon: Users,
    title: 'Database Clienti',
    description: 'Scheda cliente completa con storico visite, preferenze e spesa totale. Fidelizzazione garantita.',
    iconBg: 'bg-[rgba(59,130,246,0.1)]',
    iconColor: 'text-blue-400',
  },
  {
    icon: Star,
    title: 'Campagne Sconti',
    description: 'Crea sconti, promo stagionali e campagne "Porta un Amico" con codici referral automatici.',
    iconBg: 'bg-[rgba(168,85,247,0.1)]',
    iconColor: 'text-purple-400',
  },
  {
    icon: Shield,
    title: 'Sicurezza Premium',
    description: 'I dati del tuo salone sono protetti con crittografia Firebase enterprise-grade.',
    iconBg: 'bg-[rgba(239,68,68,0.1)]',
    iconColor: 'text-red-400',
  },
  {
    icon: Zap,
    title: 'Tutto in Tempo Reale',
    description: 'Prenotazioni, incassi e aggiornamenti clienti sincronizzati in tempo reale su tutti i dispositivi.',
    iconBg: 'bg-[rgba(245,158,11,0.1)]',
    iconColor: 'text-amber-400',
  },
]

const MOCK_KPI = [
  { label: 'Incasso oggi', value: '€342', trend: '+18% vs ieri' },
  { label: 'Prenotazioni', value: '12', trend: '3 in attesa' },
  { label: 'Clienti totali', value: '284', trend: '+5 questo mese' },
  { label: 'Incasso mensile', value: '€4.2K', trend: '+12% vs mese scorso' },
]

const TESTIMONIALS = [
  {
    name: 'Marco Russo',
    shop: 'Barber Empire, Milano',
    quote: 'BarberOS ha rivoluzionato il mio salone. Le prenotazioni online hanno ridotto le no-show del 70%.',
  },
  {
    name: 'Antonio Ferraro',
    shop: 'The Gentleman Cut, Roma',
    quote: 'Finalmente un gestionale pensato per noi barbieri. Semplice, veloce e premium come il nostro servizio.',
  },
  {
    name: 'Davide Conti',
    shop: 'Gold Fade Barbershop, Napoli',
    quote: 'Le campagne referral mi hanno portato 30 nuovi clienti in un mese. Ottimo investimento.',
  },
]
