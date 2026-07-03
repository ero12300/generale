'use client'

import { useEffect, useState } from 'react'
import { TrendingUp, Calendar, Users, Euro, ArrowUpRight, Clock, CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/useAuth'
import { getTodayBookings, getRevenue } from '@/lib/firebase/firestore'
import { formatCurrencyRaw, getMonthRange, BOOKING_STATUS_LABELS, BOOKING_STATUS_COLORS, formatTime } from '@/lib/utils'
import type { Booking, RevenueRecord } from '@/types'

export default function DashboardPage() {
  const { shop } = useAuth()
  const [todayBookings, setTodayBookings] = useState<Booking[]>([])
  const [monthRevenue, setMonthRevenue] = useState<RevenueRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!shop) return
    async function load() {
      try {
        const { from, to } = getMonthRange()
        const [bookings, revenue] = await Promise.all([
          getTodayBookings(shop!.id),
          getRevenue(shop!.id, from, to),
        ])
        setTodayBookings(bookings)
        setMonthRevenue(revenue)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [shop])

  const totalMonthRevenue = monthRevenue.reduce((sum, r) => sum + r.amount, 0)
  const todayRevenue = monthRevenue
    .filter(r => r.date === new Date().toISOString().split('T')[0])
    .reduce((sum, r) => sum + r.amount, 0)
  const completedToday = todayBookings.filter(b => b.status === 'completed').length
  const pendingToday = todayBookings.filter(b => b.status === 'pending' || b.status === 'confirmed').length

  if (!shop) {
    return <OnboardingPrompt />
  }

  return (
    <div className="max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Buongiorno! 
          <span className="gold-text ml-2">{shop.name}</span>
        </h1>
        <p className="text-[rgb(140,130,110)] mt-1">
          {new Date().toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard
          icon={Euro}
          label="Incasso oggi"
          value={formatCurrencyRaw(todayRevenue)}
          sub={`${completedToday} servizi completati`}
          iconColor="text-[rgb(212,175,55)]"
          iconBg="bg-[rgba(212,175,55,0.1)]"
        />
        <KpiCard
          icon={Calendar}
          label="Prenotazioni oggi"
          value={todayBookings.length.toString()}
          sub={`${pendingToday} da confermare`}
          iconColor="text-blue-400"
          iconBg="bg-[rgba(59,130,246,0.1)]"
        />
        <KpiCard
          icon={TrendingUp}
          label="Incasso mensile"
          value={formatCurrencyRaw(totalMonthRevenue)}
          sub="Questo mese"
          iconColor="text-green-400"
          iconBg="bg-[rgba(34,197,94,0.1)]"
        />
        <KpiCard
          icon={Users}
          label="Clienti attivi"
          value="—"
          sub="Vedi il CRM"
          iconColor="text-purple-400"
          iconBg="bg-[rgba(168,85,247,0.1)]"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Agenda di oggi
              <Badge variant="default">{todayBookings.length} appuntamenti</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <SkeletonList />
            ) : todayBookings.length === 0 ? (
              <EmptyState message="Nessun appuntamento oggi" />
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto scrollbar-hide">
                {todayBookings.map(b => (
                  <div
                    key={b.id}
                    className="flex items-center gap-4 p-3 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)]"
                  >
                    <div className="text-center min-w-[48px]">
                      <div className="text-sm font-bold text-[rgb(212,175,55)]">{formatTime(b.time)}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{b.clientName}</div>
                      <div className="text-xs text-[rgb(140,130,110)] truncate">{b.serviceName}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-[rgb(212,175,55)]">
                        {formatCurrencyRaw(b.servicePrice)}
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${BOOKING_STATUS_COLORS[b.status]}`}>
                        {BOOKING_STATUS_LABELS[b.status]}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Azioni rapide</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {QUICK_ACTIONS.map(a => (
                <a
                  key={a.label}
                  href={a.href}
                  className="flex flex-col items-start gap-2 p-4 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] hover:border-[rgba(212,175,55,0.3)] hover:bg-[rgba(212,175,55,0.05)] transition-all group"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${a.iconBg}`}>
                    <a.icon className={`w-4 h-4 ${a.iconColor}`} />
                  </div>
                  <div>
                    <div className="text-sm font-medium group-hover:text-[rgb(212,175,55)] transition-colors">{a.label}</div>
                    <div className="text-xs text-[rgb(80,75,65)]">{a.sub}</div>
                  </div>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function KpiCard({
  icon: Icon,
  label,
  value,
  sub,
  iconColor,
  iconBg,
}: {
  icon: React.ElementType
  label: string
  value: string
  sub: string
  iconColor: string
  iconBg: string
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <ArrowUpRight className="w-4 h-4 text-[rgb(60,56,50)]" />
      </div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="text-xs text-[rgb(140,130,110)] mb-0.5">{label}</div>
      <div className="text-[11px] text-[rgb(80,75,65)]">{sub}</div>
    </Card>
  )
}

function OnboardingPrompt() {
  return (
    <div className="max-w-lg mx-auto mt-20 text-center">
      <div className="w-20 h-20 rounded-2xl gold-gradient mx-auto mb-6 flex items-center justify-center">
        <Calendar className="w-10 h-10 text-[rgb(10,10,10)]" />
      </div>
      <h2 className="text-2xl font-bold mb-3">Configura il tuo salone</h2>
      <p className="text-[rgb(140,130,110)] mb-6">
        Prima di iniziare, completa il profilo del tuo barbershop nelle impostazioni.
      </p>
      <a href="/dashboard/settings" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gold-gradient text-[rgb(10,10,10)] font-semibold">
        Vai alle impostazioni →
      </a>
    </div>
  )
}

function SkeletonList() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-16 rounded-xl bg-[rgba(255,255,255,0.03)] animate-pulse" />
      ))}
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-8 text-[rgb(80,75,65)]">
      <CheckCircle2 className="w-8 h-8 mx-auto mb-2 opacity-30" />
      <p className="text-sm">{message}</p>
    </div>
  )
}

const QUICK_ACTIONS = [
  {
    icon: Calendar,
    label: 'Nuova prenotazione',
    sub: 'Aggiungi manuale',
    href: '/dashboard/bookings?new=1',
    iconBg: 'bg-[rgba(212,175,55,0.1)]',
    iconColor: 'text-[rgb(212,175,55)]',
  },
  {
    icon: Users,
    label: 'Nuovo cliente',
    sub: 'Aggiungi al CRM',
    href: '/dashboard/clients?new=1',
    iconBg: 'bg-[rgba(59,130,246,0.1)]',
    iconColor: 'text-blue-400',
  },
  {
    icon: Euro,
    label: 'Registra incasso',
    sub: 'Pagamento rapido',
    href: '/dashboard/revenue?new=1',
    iconBg: 'bg-[rgba(34,197,94,0.1)]',
    iconColor: 'text-green-400',
  },
  {
    icon: Clock,
    label: 'Link prenotazione',
    sub: 'Condividi con clienti',
    href: '/dashboard/settings',
    iconBg: 'bg-[rgba(168,85,247,0.1)]',
    iconColor: 'text-purple-400',
  },
]
