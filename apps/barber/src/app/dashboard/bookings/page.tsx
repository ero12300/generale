'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Plus, Search, Filter, Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/useAuth'
import { getBookings, createBooking, updateBooking } from '@/lib/firebase/firestore'
import {
  formatCurrencyRaw,
  formatDateShort,
  BOOKING_STATUS_LABELS,
  BOOKING_STATUS_COLORS,
  formatTime,
} from '@/lib/utils'
import { orderBy, where } from 'firebase/firestore'
import type { Booking, BookingStatus } from '@/types'
import { toast } from '@/hooks/useToast'

function BookingsContent() {
  const { shop } = useAuth()
  const searchParams = useSearchParams()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all')
  const [showNew, setShowNew] = useState(searchParams.get('new') === '1')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => {
    if (!shop) return
    loadBookings()
  }, [shop, selectedDate])

  async function loadBookings() {
    if (!shop) return
    setLoading(true)
    try {
      const data = await getBookings(shop.id, [
        where('date', '==', selectedDate),
        orderBy('time'),
      ])
      setBookings(data)
    } finally {
      setLoading(false)
    }
  }

  function prevDay() {
    const d = new Date(selectedDate)
    d.setDate(d.getDate() - 1)
    setSelectedDate(d.toISOString().split('T')[0])
  }

  function nextDay() {
    const d = new Date(selectedDate)
    d.setDate(d.getDate() + 1)
    setSelectedDate(d.toISOString().split('T')[0])
  }

  const filtered = bookings.filter(b => {
    const matchSearch = b.clientName.toLowerCase().includes(search.toLowerCase()) ||
      b.serviceName.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || b.status === statusFilter
    return matchSearch && matchStatus
  })

  async function updateStatus(bookingId: string, status: BookingStatus) {
    if (!shop) return
    await updateBooking(shop.id, bookingId, { status })
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status } : b))
    toast({ title: 'Stato aggiornato' })
  }

  return (
    <div className="max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Prenotazioni</h1>
          <p className="text-[rgb(140,130,110)] mt-1">Gestisci l&apos;agenda del tuo salone</p>
        </div>
        <Button onClick={() => setShowNew(true)}>
          <Plus className="w-4 h-4" />
          Nuova prenotazione
        </Button>
      </div>

      {/* Date Navigator */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={prevDay} className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.05)] transition-colors">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[rgba(212,175,55,0.1)] border border-[rgba(212,175,55,0.2)]">
          <CalendarIcon className="w-4 h-4 text-[rgb(212,175,55)]" />
          <span className="font-medium text-sm">
            {new Date(selectedDate).toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' })}
          </span>
        </div>
        <button onClick={nextDay} className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.05)] transition-colors">
          <ChevronRight className="w-4 h-4" />
        </button>
        <button
          onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
          className="text-xs text-[rgb(212,175,55)] hover:underline"
        >
          Oggi
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgb(80,75,65)]" />
          <Input placeholder="Cerca cliente o servizio..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2">
          {(['all', 'pending', 'confirmed', 'completed', 'cancelled'] as const).map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                statusFilter === s
                  ? 'gold-gradient text-[rgb(10,10,10)]'
                  : 'bg-[rgba(255,255,255,0.04)] text-[rgb(140,130,110)] hover:text-[rgb(250,245,235)]'
              }`}
            >
              {s === 'all' ? 'Tutte' : BOOKING_STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <SkeletonRows />
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-[rgb(80,75,65)]">
              <CalendarIcon className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>Nessuna prenotazione per questo giorno</p>
            </div>
          ) : (
            <div className="divide-y divide-[rgba(212,175,55,0.08)]">
              {filtered.map(b => (
                <div key={b.id} className="flex items-center gap-4 p-4 hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                  <div className="text-center min-w-[52px]">
                    <div className="text-base font-bold text-[rgb(212,175,55)]">{formatTime(b.time)}</div>
                    <div className="text-[11px] text-[rgb(80,75,65)]">{b.duration}min</div>
                  </div>
                  <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center text-[rgb(10,10,10)] font-bold text-sm flex-shrink-0">
                    {b.clientName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm">{b.clientName}</div>
                    <div className="text-xs text-[rgb(140,130,110)]">{b.clientPhone} · {b.serviceName}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-[rgb(212,175,55)]">{formatCurrencyRaw(b.servicePrice)}</div>
                    {b.discountApplied && b.discountApplied > 0 && (
                      <div className="text-xs text-green-400">-{formatCurrencyRaw(b.discountApplied)}</div>
                    )}
                  </div>
                  <select
                    value={b.status}
                    onChange={e => updateStatus(b.id, e.target.value as BookingStatus)}
                    className={`text-xs px-2 py-1 rounded-full border-0 outline-none cursor-pointer ${BOOKING_STATUS_COLORS[b.status]}`}
                  >
                    {Object.entries(BOOKING_STATUS_LABELS).map(([k, v]) => (
                      <option key={k} value={k} className="bg-[rgb(18,18,18)] text-[rgb(250,245,235)]">{v}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* New Booking Modal */}
      {showNew && shop && (
        <NewBookingModal
          shopId={shop.id}
          services={shop.services}
          date={selectedDate}
          onClose={() => setShowNew(false)}
          onCreated={() => { setShowNew(false); loadBookings() }}
        />
      )}
    </div>
  )
}

function NewBookingModal({
  shopId,
  services,
  date,
  onClose,
  onCreated,
}: {
  shopId: string
  services: { id: string; name: string; price: number; duration: number }[]
  date: string
  onClose: () => void
  onCreated: () => void
}) {
  const [form, setForm] = useState({
    clientName: '',
    clientPhone: '',
    serviceId: services[0]?.id ?? '',
    time: '09:00',
    notes: '',
  })
  const [loading, setLoading] = useState(false)

  const selectedService = services.find(s => s.id === form.serviceId)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedService) return
    setLoading(true)
    try {
      await createBooking(shopId, {
        shopId,
        clientName: form.clientName,
        clientPhone: form.clientPhone,
        serviceId: form.serviceId,
        serviceName: selectedService.name,
        servicePrice: selectedService.price,
        duration: selectedService.duration,
        date,
        time: form.time,
        status: 'confirmed',
        notes: form.notes,
      })
      toast({ title: 'Prenotazione creata!' })
      onCreated()
    } catch {
      toast({ title: 'Errore', description: 'Impossibile creare la prenotazione', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[rgba(0,0,0,0.7)] backdrop-blur-sm">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Nuova prenotazione
            <button onClick={onClose} className="text-[rgb(80,75,65)] hover:text-[rgb(250,245,235)]">
              <X className="w-5 h-5" />
            </button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-[rgb(140,130,110)] mb-1.5 block">Nome cliente *</label>
              <Input required value={form.clientName} onChange={e => setForm(p => ({ ...p, clientName: e.target.value }))} placeholder="Mario Rossi" />
            </div>
            <div>
              <label className="text-xs text-[rgb(140,130,110)] mb-1.5 block">Telefono *</label>
              <Input required value={form.clientPhone} onChange={e => setForm(p => ({ ...p, clientPhone: e.target.value }))} placeholder="+39 333 1234567" />
            </div>
            <div>
              <label className="text-xs text-[rgb(140,130,110)] mb-1.5 block">Servizio</label>
              <select
                value={form.serviceId}
                onChange={e => setForm(p => ({ ...p, serviceId: e.target.value }))}
                className="flex h-10 w-full rounded-lg border border-[rgba(212,175,55,0.2)] bg-[rgb(18,18,18)] px-3 py-2 text-sm text-[rgb(250,245,235)] focus:outline-none focus:ring-2 focus:ring-[rgb(212,175,55)]"
              >
                {services.map(s => (
                  <option key={s.id} value={s.id}>{s.name} — €{s.price}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-[rgb(140,130,110)] mb-1.5 block">Orario</label>
              <Input type="time" value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs text-[rgb(140,130,110)] mb-1.5 block">Note</label>
              <Input value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} placeholder="Preferenze, allergie..." />
            </div>
            {selectedService && (
              <div className="flex items-center justify-between p-3 rounded-lg bg-[rgba(212,175,55,0.08)] border border-[rgba(212,175,55,0.2)]">
                <span className="text-sm text-[rgb(140,130,110)]">Totale</span>
                <span className="font-bold text-[rgb(212,175,55)]">€{selectedService.price}</span>
              </div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creazione...' : 'Crea prenotazione'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

function SkeletonRows() {
  return (
    <div className="divide-y divide-[rgba(212,175,55,0.08)]">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4">
          <div className="w-12 h-10 bg-[rgba(255,255,255,0.04)] rounded animate-pulse" />
          <div className="w-10 h-10 rounded-full bg-[rgba(255,255,255,0.04)] animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-[rgba(255,255,255,0.04)] rounded animate-pulse w-32" />
            <div className="h-3 bg-[rgba(255,255,255,0.04)] rounded animate-pulse w-48" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function BookingsPage() {
  return <Suspense><BookingsContent /></Suspense>
}
