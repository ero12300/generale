'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Plus, TrendingUp, Euro, ArrowUpRight, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'
import { getRevenue, createRevenue } from '@/lib/firebase/firestore'
import { formatCurrencyRaw, formatDateShort, getMonthRange, getTodayString } from '@/lib/utils'
import type { RevenueRecord, PaymentMethod } from '@/types'
import { toast } from '@/hooks/useToast'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { format, eachDayOfInterval, parseISO } from 'date-fns'
import { it } from 'date-fns/locale'

function RevenueContent() {
  const { shop } = useAuth()
  const searchParams = useSearchParams()
  const [records, setRecords] = useState<RevenueRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [showNew, setShowNew] = useState(searchParams.get('new') === '1')
  const [period, setPeriod] = useState<'today' | 'week' | 'month'>('month')

  const { from, to } = getMonthRange()

  useEffect(() => {
    if (!shop) return
    loadRevenue()
  }, [shop])

  async function loadRevenue() {
    if (!shop) return
    setLoading(true)
    try {
      const data = await getRevenue(shop.id, from, to)
      setRecords(data)
    } finally {
      setLoading(false)
    }
  }

  const today = getTodayString()
  const todayRecords = records.filter(r => r.date === today)
  const todayTotal = todayRecords.reduce((s, r) => s + r.amount, 0)
  const monthTotal = records.reduce((s, r) => s + r.amount, 0)
  const avgPerDay = records.length > 0 ? monthTotal / new Set(records.map(r => r.date)).size : 0

  const chartData = buildChartData(records, from, to)

  return (
    <div className="max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Incassi</h1>
          <p className="text-[rgb(140,130,110)] mt-1">Monitora i tuoi guadagni</p>
        </div>
        <Button onClick={() => setShowNew(true)}>
          <Plus className="w-4 h-4" />
          Registra incasso
        </Button>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-[rgba(212,175,55,0.1)] flex items-center justify-center">
              <Euro className="w-5 h-5 text-[rgb(212,175,55)]" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-[rgb(60,56,50)]" />
          </div>
          <div className="text-2xl font-bold">{formatCurrencyRaw(todayTotal)}</div>
          <div className="text-xs text-[rgb(140,130,110)]">Incasso oggi</div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-[rgba(34,197,94,0.1)] flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-[rgb(60,56,50)]" />
          </div>
          <div className="text-2xl font-bold">{formatCurrencyRaw(monthTotal)}</div>
          <div className="text-xs text-[rgb(140,130,110)]">Incasso mensile</div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-[rgba(59,130,246,0.1)] flex items-center justify-center">
              <Euro className="w-5 h-5 text-blue-400" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-[rgb(60,56,50)]" />
          </div>
          <div className="text-2xl font-bold">{formatCurrencyRaw(avgPerDay)}</div>
          <div className="text-xs text-[rgb(140,130,110)]">Media giornaliera</div>
        </Card>
      </div>

      {/* Chart */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Andamento mensile</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-48 animate-pulse bg-[rgba(255,255,255,0.03)] rounded-lg" />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: 'rgb(80,75,65)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'rgb(80,75,65)' }} axisLine={false} tickLine={false} tickFormatter={v => `€${v}`} />
                <Tooltip
                  contentStyle={{
                    background: 'rgb(18,18,18)',
                    border: '1px solid rgba(212,175,55,0.2)',
                    borderRadius: '8px',
                    color: 'rgb(250,245,235)',
                  }}
                  formatter={(v: number) => [`€${v.toFixed(0)}`, 'Incasso']}
                />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={`rgba(212, 175, 55, ${0.4 + (i / chartData.length) * 0.6})`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Records List */}
      <Card>
        <CardHeader>
          <CardTitle>Movimenti</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-12 bg-[rgba(255,255,255,0.04)] rounded animate-pulse" />
              ))}
            </div>
          ) : records.length === 0 ? (
            <div className="text-center py-12 text-[rgb(80,75,65)]">
              <Euro className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>Nessun incasso registrato questo mese</p>
            </div>
          ) : (
            <div className="divide-y divide-[rgba(212,175,55,0.08)]">
              {records.map(r => (
                <div key={r.id} className="flex items-center gap-4 p-4">
                  <div className={`w-2 h-10 rounded-full ${PAYMENT_COLORS[r.paymentMethod]}`} />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{r.serviceName}</div>
                    <div className="text-xs text-[rgb(140,130,110)]">
                      {r.clientName && `${r.clientName} · `}
                      {PAYMENT_LABELS[r.paymentMethod]} · {formatDateShort(r.date)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-[rgb(212,175,55)]">{formatCurrencyRaw(r.amount)}</div>
                    {r.tip && r.tip > 0 && (
                      <div className="text-xs text-green-400">+{formatCurrencyRaw(r.tip)} mancia</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {showNew && shop && (
        <NewRevenueModal
          shopId={shop.id}
          services={shop.services}
          onClose={() => setShowNew(false)}
          onCreated={() => { setShowNew(false); loadRevenue() }}
        />
      )}
    </div>
  )
}

function buildChartData(records: RevenueRecord[], from: string, to: string) {
  const days = eachDayOfInterval({ start: parseISO(from), end: parseISO(to) })
  return days.map(day => {
    const dateStr = format(day, 'yyyy-MM-dd')
    const amount = records.filter(r => r.date === dateStr).reduce((s, r) => s + r.amount, 0)
    return { label: format(day, 'd', { locale: it }), amount }
  })
}

function NewRevenueModal({
  shopId,
  services,
  onClose,
  onCreated,
}: {
  shopId: string
  services: { id: string; name: string; price: number }[]
  onClose: () => void
  onCreated: () => void
}) {
  const [form, setForm] = useState({
    amount: '',
    tip: '',
    paymentMethod: 'cash' as PaymentMethod,
    serviceName: services[0]?.name ?? '',
    clientName: '',
    notes: '',
  })
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await createRevenue(shopId, {
        shopId,
        amount: parseFloat(form.amount),
        tip: form.tip ? parseFloat(form.tip) : undefined,
        paymentMethod: form.paymentMethod,
        serviceName: form.serviceName,
        clientName: form.clientName || undefined,
        notes: form.notes || undefined,
        date: getTodayString(),
      })
      toast({ title: 'Incasso registrato!' })
      onCreated()
    } catch {
      toast({ title: 'Errore', description: 'Impossibile registrare l\'incasso', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[rgba(0,0,0,0.7)] backdrop-blur-sm">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Registra incasso
            <button onClick={onClose}><X className="w-5 h-5 text-[rgb(80,75,65)]" /></button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-[rgb(140,130,110)] mb-1.5 block">Servizio</label>
              <Input
                value={form.serviceName}
                onChange={e => setForm(p => ({ ...p, serviceName: e.target.value }))}
                list="services-list"
                placeholder="es. Taglio + Barba"
              />
              <datalist id="services-list">
                {services.map(s => <option key={s.id} value={s.name} />)}
              </datalist>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-[rgb(140,130,110)] mb-1.5 block">Importo (€) *</label>
                <Input required type="number" step="0.01" min="0" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} placeholder="25.00" />
              </div>
              <div>
                <label className="text-xs text-[rgb(140,130,110)] mb-1.5 block">Mancia (€)</label>
                <Input type="number" step="0.01" min="0" value={form.tip} onChange={e => setForm(p => ({ ...p, tip: e.target.value }))} placeholder="0.00" />
              </div>
            </div>
            <div>
              <label className="text-xs text-[rgb(140,130,110)] mb-1.5 block">Metodo pagamento</label>
              <div className="grid grid-cols-4 gap-2">
                {(Object.entries(PAYMENT_LABELS) as [PaymentMethod, string][]).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setForm(p => ({ ...p, paymentMethod: key }))}
                    className={`py-2 rounded-lg text-xs font-medium transition-all ${
                      form.paymentMethod === key
                        ? 'gold-gradient text-[rgb(10,10,10)]'
                        : 'bg-[rgba(255,255,255,0.04)] text-[rgb(140,130,110)] hover:text-[rgb(250,245,235)]'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs text-[rgb(140,130,110)] mb-1.5 block">Cliente</label>
              <Input value={form.clientName} onChange={e => setForm(p => ({ ...p, clientName: e.target.value }))} placeholder="Nome cliente (opzionale)" />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Salvataggio...' : 'Registra incasso'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  cash: 'Contanti',
  card: 'Carta',
  transfer: 'Bonifico',
  other: 'Altro',
}

const PAYMENT_COLORS: Record<PaymentMethod, string> = {
  cash: 'bg-[rgb(212,175,55)]',
  card: 'bg-blue-400',
  transfer: 'bg-purple-400',
  other: 'bg-[rgb(80,75,65)]',
}

export default function RevenuePage() {
  return <Suspense><RevenueContent /></Suspense>
}
