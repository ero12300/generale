'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Scissors, MapPin, Phone, Clock, Check, ChevronLeft, ChevronRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { getDocs, query, collection, where, limit } from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import { createBooking, validateCampaignCode } from '@/lib/firebase/firestore'
import { generateTimeSlots, formatCurrencyRaw, DAYS_IT } from '@/lib/utils'
import type { Barbershop, Service, Campaign } from '@/types'
import { toast } from '@/hooks/useToast'
import { Toaster } from '@/components/ui/toaster'
import { addDays, format, isBefore, startOfDay } from 'date-fns'
import { it } from 'date-fns/locale'

type Step = 'service' | 'date' | 'time' | 'info' | 'confirm' | 'done'

export default function PublicBookingPage() {
  const { slug } = useParams<{ slug: string }>()
  const [shop, setShop] = useState<Barbershop | null>(null)
  const [loading, setLoading] = useState(true)
  const [step, setStep] = useState<Step>('service')

  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [promoCode, setPromoCode] = useState('')
  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [form, setForm] = useState({ name: '', phone: '', email: '', notes: '' })
  const [bookingLoading, setBookingLoading] = useState(false)

  useEffect(() => {
    async function loadShop() {
      const q = query(collection(db, 'barbershops'), where('slug', '==', slug), limit(1))
      const snap = await getDocs(q)
      if (!snap.empty) {
        setShop({ id: snap.docs[0].id, ...snap.docs[0].data() } as Barbershop)
      }
      setLoading(false)
    }
    loadShop()
  }, [slug])

  async function applyPromoCode() {
    if (!shop || !promoCode.trim()) return
    const c = await validateCampaignCode(shop.id, promoCode.trim().toUpperCase())
    if (c) {
      setCampaign(c)
      toast({ title: `Codice applicato! ${c.discountType === 'percent' ? `${c.discountValue}%` : `€${c.discountValue}`} di sconto` })
    } else {
      toast({ title: 'Codice non valido', description: 'Il codice è scaduto o non esiste', variant: 'destructive' })
    }
  }

  function getDiscountedPrice(price: number): number {
    if (!campaign) return price
    if (campaign.discountType === 'percent') return price * (1 - campaign.discountValue / 100)
    return Math.max(0, price - campaign.discountValue)
  }

  async function submitBooking() {
    if (!shop || !selectedService || !selectedDate || !selectedTime) return
    setBookingLoading(true)
    try {
      const dateStr = format(selectedDate, 'yyyy-MM-dd')
      const discountApplied = selectedService.price - getDiscountedPrice(selectedService.price)
      await createBooking(shop.id, {
        shopId: shop.id,
        clientName: form.name,
        clientPhone: form.phone,
        clientEmail: form.email || undefined,
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        servicePrice: getDiscountedPrice(selectedService.price),
        duration: selectedService.duration,
        date: dateStr,
        time: selectedTime,
        status: 'confirmed',
        notes: form.notes || undefined,
        referralCode: promoCode || undefined,
        discountApplied: discountApplied > 0 ? discountApplied : undefined,
      })
      setStep('done')
    } catch {
      toast({ title: 'Errore', description: 'Impossibile completare la prenotazione', variant: 'destructive' })
    } finally {
      setBookingLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[rgb(10,10,10)] flex items-center justify-center">
        <div className="w-12 h-12 rounded-xl gold-gradient animate-pulse" />
      </div>
    )
  }

  if (!shop) {
    return (
      <div className="min-h-screen bg-[rgb(10,10,10)] flex items-center justify-center">
        <div className="text-center">
          <Scissors className="w-12 h-12 mx-auto mb-4 text-[rgb(80,75,65)]" />
          <h1 className="text-2xl font-bold mb-2">Salone non trovato</h1>
          <p className="text-[rgb(140,130,110)]">Il link che hai aperto non è valido.</p>
        </div>
      </div>
    )
  }

  const activeServices = shop.services.filter(s => s.active)

  return (
    <div className="min-h-screen bg-[rgb(10,10,10)]">
      {/* Header */}
      <div className="border-b border-[rgba(212,175,55,0.1)] bg-[rgb(12,12,12)]">
        <div className="max-w-lg mx-auto px-4 py-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl gold-gradient flex items-center justify-center flex-shrink-0">
              <Scissors className="w-5 h-5 text-[rgb(10,10,10)]" />
            </div>
            <div>
              <h1 className="text-xl font-bold">{shop.name}</h1>
              {shop.address && (
                <div className="flex items-center gap-1 text-xs text-[rgb(140,130,110)]">
                  <MapPin className="w-3 h-3" />
                  {shop.address}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-8">
        {/* Steps indicator */}
        {step !== 'done' && (
          <div className="flex items-center gap-2 mb-8">
            {(['service', 'date', 'time', 'info', 'confirm'] as Step[]).map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  s === step ? 'gold-gradient text-[rgb(10,10,10)]' :
                  ['service', 'date', 'time', 'info', 'confirm'].indexOf(step) > i
                    ? 'bg-[rgba(212,175,55,0.3)] text-[rgb(212,175,55)]'
                    : 'bg-[rgba(255,255,255,0.06)] text-[rgb(80,75,65)]'
                }`}>
                  {['service', 'date', 'time', 'info', 'confirm'].indexOf(step) > i ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (i + 1)}
                </div>
                {i < 4 && <div className="flex-1 h-px bg-[rgba(212,175,55,0.1)] w-6" />}
              </div>
            ))}
          </div>
        )}

        {/* Step: Service */}
        {step === 'service' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Scegli il servizio</h2>
            <div className="space-y-3">
              {activeServices.map(s => (
                <button
                  key={s.id}
                  onClick={() => { setSelectedService(s); setStep('date') }}
                  className="w-full flex items-center justify-between p-4 rounded-2xl border border-[rgba(212,175,55,0.15)] bg-[rgb(16,16,16)] hover:border-[rgba(212,175,55,0.4)] hover:bg-[rgba(212,175,55,0.05)] transition-all group text-left"
                >
                  <div>
                    <div className="font-semibold group-hover:text-[rgb(212,175,55)] transition-colors">{s.name}</div>
                    <div className="flex items-center gap-2 text-xs text-[rgb(140,130,110)] mt-1">
                      <Clock className="w-3 h-3" />
                      {s.duration} minuti
                    </div>
                    {s.description && <p className="text-xs text-[rgb(80,75,65)] mt-1">{s.description}</p>}
                  </div>
                  <div className="text-xl font-bold text-[rgb(212,175,55)] ml-4">€{s.price}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step: Date */}
        {step === 'date' && selectedService && (
          <div>
            <button onClick={() => setStep('service')} className="flex items-center gap-2 text-sm text-[rgb(140,130,110)] mb-6 hover:text-[rgb(250,245,235)]">
              <ChevronLeft className="w-4 h-4" />
              Indietro
            </button>
            <h2 className="text-2xl font-bold mb-6">Scegli la data</h2>
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 14 }, (_, i) => addDays(new Date(), i + 1)).map(date => {
                const dayName = DAYS_IT[date.getDay()]
                const hours = shop.workingHours[dayName]
                const closed = hours?.closed ?? false
                const isSelected = selectedDate && format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
                return (
                  <button
                    key={date.toISOString()}
                    disabled={closed}
                    onClick={() => { setSelectedDate(date); setStep('time') }}
                    className={`p-3 rounded-xl text-center transition-all ${
                      isSelected ? 'gold-gradient text-[rgb(10,10,10)]' :
                      closed ? 'opacity-30 cursor-not-allowed bg-[rgba(255,255,255,0.03)]' :
                      'bg-[rgba(255,255,255,0.04)] hover:border-[rgba(212,175,55,0.3)] border border-[rgba(255,255,255,0.06)] hover:bg-[rgba(212,175,55,0.05)]'
                    }`}
                  >
                    <div className="text-xs text-[rgb(140,130,110)] mb-0.5">{dayName.slice(0, 3)}</div>
                    <div className="text-lg font-bold">{format(date, 'd')}</div>
                    <div className="text-xs text-[rgb(80,75,65)]">{format(date, 'MMM', { locale: it })}</div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Step: Time */}
        {step === 'time' && selectedService && selectedDate && (
          <div>
            <button onClick={() => setStep('date')} className="flex items-center gap-2 text-sm text-[rgb(140,130,110)] mb-6 hover:text-[rgb(250,245,235)]">
              <ChevronLeft className="w-4 h-4" />
              Indietro
            </button>
            <h2 className="text-2xl font-bold mb-2">Scegli l&apos;orario</h2>
            <p className="text-[rgb(140,130,110)] text-sm mb-6">
              {format(selectedDate, 'EEEE d MMMM', { locale: it })}
            </p>
            <div className="grid grid-cols-4 gap-2">
              {(() => {
                const dayName = DAYS_IT[selectedDate.getDay()]
                const hours = shop.workingHours[dayName]
                if (!hours || hours.closed) return null
                const slots = generateTimeSlots(hours.open, hours.close, selectedService.duration)
                return slots.map(slot => (
                  <button
                    key={slot}
                    onClick={() => { setSelectedTime(slot); setStep('info') }}
                    className={`py-3 rounded-xl text-sm font-medium transition-all ${
                      selectedTime === slot
                        ? 'gold-gradient text-[rgb(10,10,10)]'
                        : 'bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)] hover:border-[rgba(212,175,55,0.3)]'
                    }`}
                  >
                    {slot}
                  </button>
                ))
              })()}
            </div>
          </div>
        )}

        {/* Step: Info */}
        {step === 'info' && (
          <div>
            <button onClick={() => setStep('time')} className="flex items-center gap-2 text-sm text-[rgb(140,130,110)] mb-6 hover:text-[rgb(250,245,235)]">
              <ChevronLeft className="w-4 h-4" />
              Indietro
            </button>
            <h2 className="text-2xl font-bold mb-6">I tuoi dati</h2>
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-xs text-[rgb(140,130,110)] mb-1.5 block">Nome *</label>
                <Input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Mario Rossi" />
              </div>
              <div>
                <label className="text-xs text-[rgb(140,130,110)] mb-1.5 block">Telefono *</label>
                <Input required value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+39 333 1234567" />
              </div>
              <div>
                <label className="text-xs text-[rgb(140,130,110)] mb-1.5 block">Email</label>
                <Input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="mario@esempio.it" />
              </div>
              <div>
                <label className="text-xs text-[rgb(140,130,110)] mb-1.5 block">Note</label>
                <Input value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} placeholder="Preferenze o richieste speciali..." />
              </div>
            </div>

            {/* Promo code */}
            <div className="p-4 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] mb-6">
              <label className="text-xs text-[rgb(140,130,110)] mb-2 block">Hai un codice sconto?</label>
              <div className="flex gap-2">
                <Input
                  value={promoCode}
                  onChange={e => setPromoCode(e.target.value.toUpperCase())}
                  placeholder="es. AMICO20"
                  className="font-mono"
                />
                <Button variant="outline" onClick={applyPromoCode} size="sm">Applica</Button>
              </div>
              {campaign && (
                <div className="flex items-center gap-2 mt-2 text-green-400 text-sm">
                  <Check className="w-4 h-4" />
                  Sconto applicato: {campaign.discountType === 'percent' ? `${campaign.discountValue}%` : `€${campaign.discountValue}`}
                </div>
              )}
            </div>

            <Button
              className="w-full"
              disabled={!form.name || !form.phone}
              onClick={() => setStep('confirm')}
            >
              Continua
            </Button>
          </div>
        )}

        {/* Step: Confirm */}
        {step === 'confirm' && selectedService && selectedDate && selectedTime && (
          <div>
            <button onClick={() => setStep('info')} className="flex items-center gap-2 text-sm text-[rgb(140,130,110)] mb-6 hover:text-[rgb(250,245,235)]">
              <ChevronLeft className="w-4 h-4" />
              Indietro
            </button>
            <h2 className="text-2xl font-bold mb-6">Conferma prenotazione</h2>
            <Card className="mb-6">
              <CardContent className="space-y-4 pt-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[rgb(140,130,110)]">Servizio</span>
                  <span className="font-medium">{selectedService.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[rgb(140,130,110)]">Data</span>
                  <span>{format(selectedDate, 'EEEE d MMMM yyyy', { locale: it })}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[rgb(140,130,110)]">Orario</span>
                  <span>{selectedTime}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[rgb(140,130,110)]">Durata</span>
                  <span>{selectedService.duration} min</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[rgb(140,130,110)]">Nome</span>
                  <span>{form.name}</span>
                </div>
                <div className="border-t border-[rgba(212,175,55,0.1)] pt-3 flex justify-between">
                  <span className="font-semibold">Totale</span>
                  <div className="text-right">
                    {campaign && (
                      <div className="text-sm text-[rgb(140,130,110)] line-through">€{selectedService.price}</div>
                    )}
                    <span className="text-xl font-bold text-[rgb(212,175,55)]">
                      {formatCurrencyRaw(getDiscountedPrice(selectedService.price))}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Button className="w-full" size="lg" onClick={submitBooking} disabled={bookingLoading}>
              {bookingLoading ? 'Prenotazione...' : 'Conferma prenotazione'}
            </Button>
            <p className="text-center text-xs text-[rgb(80,75,65)] mt-3">
              Riceverai una conferma via SMS al numero fornito
            </p>
          </div>
        )}

        {/* Step: Done */}
        {step === 'done' && (
          <div className="text-center py-12">
            <div className="w-20 h-20 rounded-full gold-gradient mx-auto mb-6 flex items-center justify-center">
              <Check className="w-10 h-10 text-[rgb(10,10,10)]" />
            </div>
            <h2 className="text-3xl font-bold mb-3">Prenotazione confermata!</h2>
            <p className="text-[rgb(140,130,110)] mb-8">
              A presto da <strong>{shop.name}</strong>. Riceverai un promemoria prima dell&apos;appuntamento.
            </p>
            {shop.phone && (
              <a href={`tel:${shop.phone}`}>
                <Button variant="outline" className="flex items-center gap-2 mx-auto">
                  <Phone className="w-4 h-4" />
                  Contatta il salone
                </Button>
              </a>
            )}
          </div>
        )}
      </div>
      <Toaster />
    </div>
  )
}
