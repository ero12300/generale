'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Save, Plus, Trash2, ExternalLink, Crown, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'
import { createShop, updateShop } from '@/lib/firebase/firestore'
import { PLANS } from '@/lib/stripe'
import type { Barbershop, Service, WorkingHours } from '@/types'
import { toast } from '@/hooks/useToast'
import { generateReferralCode } from '@/lib/utils'

const DEFAULT_WORKING_HOURS: WorkingHours = {
  Lunedì: { open: '09:00', close: '19:00', closed: false },
  Martedì: { open: '09:00', close: '19:00', closed: false },
  Mercoledì: { open: '09:00', close: '19:00', closed: false },
  Giovedì: { open: '09:00', close: '19:00', closed: false },
  Venerdì: { open: '09:00', close: '19:00', closed: false },
  Sabato: { open: '09:00', close: '17:00', closed: false },
  Domenica: { open: '09:00', close: '13:00', closed: true },
}

function SettingsContent() {
  const { shop, user, refreshShop } = useAuth()
  const searchParams = useSearchParams()
  const [tab, setTab] = useState<'general' | 'services' | 'hours' | 'billing'>(
    (searchParams.get('tab') as 'general' | 'services' | 'hours' | 'billing') ?? 'general'
  )
  const [form, setForm] = useState({
    name: shop?.name ?? '',
    address: shop?.address ?? '',
    phone: shop?.phone ?? '',
    email: shop?.email ?? '',
    description: shop?.description ?? '',
  })
  const [services, setServices] = useState<Service[]>(shop?.services ?? [])
  const [hours, setHours] = useState<WorkingHours>(shop?.workingHours ?? DEFAULT_WORKING_HOURS)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (shop) {
      setForm({
        name: shop.name,
        address: shop.address ?? '',
        phone: shop.phone ?? '',
        email: shop.email ?? '',
        description: shop.description ?? '',
      })
      setServices(shop.services)
      setHours(shop.workingHours)
    }
  }, [shop])

  async function saveGeneral() {
    if (!user) return
    setSaving(true)
    try {
      if (shop) {
        await updateShop(shop.id, { ...form })
      } else {
        await createShop({
          ownerId: user.uid,
          name: form.name,
          slug: form.name.toLowerCase().replace(/\s+/g, '-'),
          address: form.address,
          phone: form.phone,
          email: form.email,
          description: form.description,
          services: [],
          workingHours: DEFAULT_WORKING_HOURS,
          subscription: { tier: 'free' },
        })
      }
      await refreshShop()
      toast({ title: 'Impostazioni salvate!' })
    } catch {
      toast({ title: 'Errore', description: 'Impossibile salvare', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  async function saveServices() {
    if (!shop) return
    setSaving(true)
    try {
      await updateShop(shop.id, { services })
      await refreshShop()
      toast({ title: 'Servizi aggiornati!' })
    } catch {
      toast({ title: 'Errore', description: 'Impossibile salvare i servizi', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  async function saveHours() {
    if (!shop) return
    setSaving(true)
    try {
      await updateShop(shop.id, { workingHours: hours })
      await refreshShop()
      toast({ title: 'Orari aggiornati!' })
    } catch {
      toast({ title: 'Errore', description: 'Impossibile salvare gli orari', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  function addService() {
    setServices(prev => [...prev, {
      id: crypto.randomUUID(),
      name: '',
      duration: 30,
      price: 0,
      active: true,
    }])
  }

  function updateService(id: string, field: keyof Service, value: string | number | boolean) {
    setServices(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s))
  }

  function removeService(id: string) {
    setServices(prev => prev.filter(s => s.id !== id))
  }

  const isPro = shop?.subscription?.tier === 'pro' || shop?.subscription?.tier === 'pro_yearly'
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3001'
  const bookingUrl = shop ? `${appUrl}/book/${shop.slug}` : ''

  const TABS = [
    { id: 'general', label: 'Generale' },
    { id: 'services', label: 'Servizi' },
    { id: 'hours', label: 'Orari' },
    { id: 'billing', label: 'Abbonamento' },
  ] as const

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Impostazioni</h1>
        <p className="text-[rgb(140,130,110)] mt-1">Configura il tuo salone</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-[rgba(255,255,255,0.04)] mb-8 w-fit">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === t.id
                ? 'gold-gradient text-[rgb(10,10,10)]'
                : 'text-[rgb(140,130,110)] hover:text-[rgb(250,245,235)]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* General */}
      {tab === 'general' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informazioni salone</CardTitle>
              <CardDescription>Visibili ai tuoi clienti nella pagina di prenotazione</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs text-[rgb(140,130,110)] mb-1.5 block">Nome salone *</label>
                <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Gold Barber Shop" />
              </div>
              <div>
                <label className="text-xs text-[rgb(140,130,110)] mb-1.5 block">Indirizzo</label>
                <Input value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} placeholder="Via Roma 1, Milano" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[rgb(140,130,110)] mb-1.5 block">Telefono</label>
                  <Input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+39 02 1234567" />
                </div>
                <div>
                  <label className="text-xs text-[rgb(140,130,110)] mb-1.5 block">Email</label>
                  <Input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="salone@esempio.it" />
                </div>
              </div>
              <div>
                <label className="text-xs text-[rgb(140,130,110)] mb-1.5 block">Descrizione</label>
                <Input value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Il miglior barbiere della città..." />
              </div>
              <Button onClick={saveGeneral} disabled={saving}>
                <Save className="w-4 h-4" />
                {saving ? 'Salvataggio...' : 'Salva modifiche'}
              </Button>
            </CardContent>
          </Card>

          {shop && (
            <Card>
              <CardHeader>
                <CardTitle>Link prenotazione pubblica</CardTitle>
                <CardDescription>Condividi questo link con i tuoi clienti</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-[rgba(212,175,55,0.08)] border border-[rgba(212,175,55,0.2)]">
                  <span className="text-sm font-mono text-[rgb(212,175,55)] flex-1 truncate">{bookingUrl}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => { navigator.clipboard.writeText(bookingUrl); toast({ title: 'Copiato!' }) }}
                  >
                    Copia
                  </Button>
                  <a href={bookingUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" size="icon"><ExternalLink className="w-4 h-4" /></Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Services */}
      {tab === 'services' && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Servizi offerti
                <Button variant="outline" size="sm" onClick={addService}>
                  <Plus className="w-4 h-4" />
                  Aggiungi
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {services.length === 0 && (
                <p className="text-sm text-[rgb(80,75,65)] text-center py-4">
                  Nessun servizio. Clicca &ldquo;Aggiungi&rdquo; per iniziare.
                </p>
              )}
              {services.map(s => (
                <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)]">
                  <div className="flex-1 grid grid-cols-3 gap-2">
                    <Input
                      value={s.name}
                      onChange={e => updateService(s.id, 'name', e.target.value)}
                      placeholder="Nome servizio"
                      className="col-span-1"
                    />
                    <Input
                      type="number"
                      value={s.price}
                      onChange={e => updateService(s.id, 'price', parseFloat(e.target.value))}
                      placeholder="Prezzo €"
                    />
                    <Input
                      type="number"
                      value={s.duration}
                      onChange={e => updateService(s.id, 'duration', parseInt(e.target.value))}
                      placeholder="Durata min"
                    />
                  </div>
                  <button onClick={() => removeService(s.id)} className="text-red-400 hover:text-red-300 p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {services.length > 0 && (
                <Button onClick={saveServices} disabled={saving} className="mt-4">
                  <Save className="w-4 h-4" />
                  {saving ? 'Salvataggio...' : 'Salva servizi'}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Hours */}
      {tab === 'hours' && (
        <Card>
          <CardHeader>
            <CardTitle>Orari di apertura</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(hours).map(([day, h]) => (
              <div key={day} className="flex items-center gap-4">
                <div className="w-24 text-sm font-medium">{day}</div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!h.closed}
                    onChange={e => setHours(prev => ({ ...prev, [day]: { ...h, closed: !e.target.checked } }))}
                    className="w-4 h-4 accent-[rgb(212,175,55)]"
                  />
                  <span className="text-xs text-[rgb(140,130,110)]">Aperto</span>
                </label>
                {!h.closed && (
                  <>
                    <Input
                      type="time"
                      value={h.open}
                      onChange={e => setHours(prev => ({ ...prev, [day]: { ...h, open: e.target.value } }))}
                      className="w-32"
                    />
                    <span className="text-[rgb(80,75,65)]">—</span>
                    <Input
                      type="time"
                      value={h.close}
                      onChange={e => setHours(prev => ({ ...prev, [day]: { ...h, close: e.target.value } }))}
                      className="w-32"
                    />
                  </>
                )}
                {h.closed && <span className="text-sm text-[rgb(80,75,65)]">Chiuso</span>}
              </div>
            ))}
            <Button onClick={saveHours} disabled={saving} className="mt-4">
              <Save className="w-4 h-4" />
              {saving ? 'Salvataggio...' : 'Salva orari'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Billing */}
      {tab === 'billing' && (
        <div className="space-y-6">
          <Card className={isPro ? 'border-[rgba(212,175,55,0.4)]' : ''}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {isPro && <Crown className="w-5 h-5 text-[rgb(212,175,55)]" />}
                Piano attuale: {isPro ? 'Pro' : 'Free'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isPro ? (
                <p className="text-sm text-[rgb(140,130,110)]">
                  Il tuo piano Pro è attivo. Hai accesso a tutte le funzionalità premium.
                </p>
              ) : (
                <p className="text-sm text-[rgb(140,130,110)]">
                  Stai usando il piano gratuito. Passa a Pro per sbloccare tutte le funzionalità.
                </p>
              )}
            </CardContent>
          </Card>

          {!isPro && (
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="border-[rgba(212,175,55,0.3)] bg-gradient-to-b from-[rgba(212,175,55,0.06)] to-transparent">
                <CardHeader>
                  <div className="text-sm text-[rgb(212,175,55)] font-semibold mb-1">Pro Mensile</div>
                  <div className="text-3xl font-bold">€29<span className="text-sm font-normal text-[rgb(140,130,110)]">/mese</span></div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {PLANS.pro.features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-[rgb(212,175,55)]" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <UpgradeButton priceType="monthly" shopId={shop?.id} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="text-sm text-green-400 font-semibold mb-1">Pro Annuale — Risparmia €99</div>
                  <div className="text-3xl font-bold">€249<span className="text-sm font-normal text-[rgb(140,130,110)]">/anno</span></div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {PLANS.pro.features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-400" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <UpgradeButton priceType="yearly" shopId={shop?.id} />
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function UpgradeButton({ priceType, shopId }: { priceType: 'monthly' | 'yearly'; shopId?: string }) {
  const [loading, setLoading] = useState(false)

  async function handleUpgrade() {
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceType, shopId }),
      })
      const { url } = await res.json()
      if (url) window.location.href = url
    } catch {
      toast({ title: 'Errore', description: 'Impossibile aprire la pagina di pagamento', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleUpgrade} disabled={loading} className="w-full">
      {loading ? 'Reindirizzamento...' : `Passa a Pro ${priceType === 'yearly' ? 'Annuale' : 'Mensile'}`}
    </Button>
  )
}

export default function SettingsPage() {
  return <Suspense><SettingsContent /></Suspense>
}
