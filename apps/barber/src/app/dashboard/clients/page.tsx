'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Plus, Search, Star, Phone, Mail, X, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/useAuth'
import { getClients, createClient } from '@/lib/firebase/firestore'
import { formatCurrencyRaw, formatDateShort, generateReferralCode, timeAgo } from '@/lib/utils'
import type { Client } from '@/types'
import { toast } from '@/hooks/useToast'

function ClientsContent() {
  const { shop } = useAuth()
  const searchParams = useSearchParams()
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showNew, setShowNew] = useState(searchParams.get('new') === '1')
  const [selected, setSelected] = useState<Client | null>(null)

  useEffect(() => {
    if (!shop) return
    loadClients()
  }, [shop])

  async function loadClients() {
    if (!shop) return
    setLoading(true)
    try {
      const data = await getClients(shop.id, 200)
      setClients(data)
    } finally {
      setLoading(false)
    }
  }

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search) ||
    (c.email ?? '').toLowerCase().includes(search.toLowerCase())
  )

  const topClients = [...clients].sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 3)

  return (
    <div className="max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Clienti</h1>
          <p className="text-[rgb(140,130,110)] mt-1">{clients.length} clienti nel database</p>
        </div>
        <Button onClick={() => setShowNew(true)}>
          <UserPlus className="w-4 h-4" />
          Nuovo cliente
        </Button>
      </div>

      {/* Top Clients */}
      {topClients.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          {topClients.map((c, i) => (
            <Card key={c.id} className="cursor-pointer hover:border-[rgba(212,175,55,0.3)] transition-colors" onClick={() => setSelected(c)}>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full gold-gradient flex items-center justify-center text-[rgb(10,10,10)] font-bold">
                    {c.name.charAt(0)}
                  </div>
                  {i === 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[rgb(212,175,55)] flex items-center justify-center">
                      <Star className="w-3 h-3 text-[rgb(10,10,10)] fill-[rgb(10,10,10)]" />
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-sm truncate">{c.name}</div>
                  <div className="text-xs text-[rgb(212,175,55)]">{formatCurrencyRaw(c.totalSpent)} spesi</div>
                  <div className="text-xs text-[rgb(80,75,65)]">{c.totalVisits} visite</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgb(80,75,65)]" />
        <Input placeholder="Cerca per nome, telefono o email..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Client Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <SkeletonRows />
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-[rgb(80,75,65)]">
              <UserPlus className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>{search ? 'Nessun cliente trovato' : 'Aggiungi il primo cliente'}</p>
            </div>
          ) : (
            <div className="divide-y divide-[rgba(212,175,55,0.08)]">
              {filtered.map(c => (
                <div
                  key={c.id}
                  className="flex items-center gap-4 p-4 hover:bg-[rgba(255,255,255,0.02)] cursor-pointer transition-colors"
                  onClick={() => setSelected(c)}
                >
                  <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center text-[rgb(10,10,10)] font-bold text-sm flex-shrink-0">
                    {c.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm">{c.name}</div>
                    <div className="text-xs text-[rgb(140,130,110)]">{c.phone}</div>
                  </div>
                  <div className="text-right hidden md:block">
                    <div className="text-sm font-semibold text-[rgb(212,175,55)]">{formatCurrencyRaw(c.totalSpent)}</div>
                    <div className="text-xs text-[rgb(80,75,65)]">{c.totalVisits} visite</div>
                  </div>
                  <div className="text-right hidden lg:block">
                    <div className="text-xs text-[rgb(80,75,65)]">
                      {c.lastVisit ? `Ultima: ${formatDateShort(c.lastVisit)}` : 'Nessuna visita'}
                    </div>
                    {c.referralCount > 0 && (
                      <Badge variant="default" className="text-[10px]">
                        {c.referralCount} referral
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* New Client Modal */}
      {showNew && shop && (
        <NewClientModal
          shopId={shop.id}
          onClose={() => setShowNew(false)}
          onCreated={() => { setShowNew(false); loadClients() }}
        />
      )}

      {/* Client Detail Drawer */}
      {selected && (
        <ClientDrawer client={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  )
}

function NewClientModal({ shopId, onClose, onCreated }: { shopId: string; onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', notes: '' })
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await createClient(shopId, {
        shopId,
        name: form.name,
        phone: form.phone,
        email: form.email || undefined,
        notes: form.notes || undefined,
        totalVisits: 0,
        totalSpent: 0,
        referralCode: generateReferralCode(form.name),
        referralCount: 0,
        tags: [],
      })
      toast({ title: 'Cliente aggiunto!' })
      onCreated()
    } catch {
      toast({ title: 'Errore', description: 'Impossibile aggiungere il cliente', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[rgba(0,0,0,0.7)] backdrop-blur-sm">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Nuovo cliente
            <button onClick={onClose}><X className="w-5 h-5 text-[rgb(80,75,65)]" /></button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
              <Input value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} placeholder="Preferenze, allergie..." />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Salvataggio...' : 'Aggiungi cliente'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

function ClientDrawer({ client, onClose }: { client: Client; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="flex-1 bg-[rgba(0,0,0,0.5)] backdrop-blur-sm" onClick={onClose} />
      <div className="w-full max-w-md bg-[rgb(14,14,14)] border-l border-[rgba(212,175,55,0.15)] h-full overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Scheda cliente</h2>
          <button onClick={onClose}><X className="w-5 h-5" /></button>
        </div>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full gold-gradient flex items-center justify-center text-[rgb(10,10,10)] text-2xl font-bold">
            {client.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-lg font-bold">{client.name}</h3>
            <p className="text-sm text-[rgb(140,130,110)]">Cliente dal {formatDateShort(client.createdAt)}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-[rgba(212,175,55,0.08)] border border-[rgba(212,175,55,0.15)]">
            <div className="text-2xl font-bold text-[rgb(212,175,55)]">{formatCurrencyRaw(client.totalSpent)}</div>
            <div className="text-xs text-[rgb(140,130,110)]">Totale speso</div>
          </div>
          <div className="p-4 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)]">
            <div className="text-2xl font-bold">{client.totalVisits}</div>
            <div className="text-xs text-[rgb(140,130,110)]">Visite totali</div>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 text-sm">
            <Phone className="w-4 h-4 text-[rgb(80,75,65)]" />
            <span>{client.phone}</span>
          </div>
          {client.email && (
            <div className="flex items-center gap-3 text-sm">
              <Mail className="w-4 h-4 text-[rgb(80,75,65)]" />
              <span>{client.email}</span>
            </div>
          )}
        </div>

        <div className="p-4 rounded-xl bg-[rgba(168,85,247,0.08)] border border-[rgba(168,85,247,0.2)] mb-4">
          <div className="text-xs text-[rgb(140,130,110)] mb-1">Codice referral</div>
          <div className="font-mono font-bold text-purple-400">{client.referralCode}</div>
          <div className="text-xs text-[rgb(80,75,65)] mt-1">{client.referralCount} amici invitati</div>
        </div>

        {client.notes && (
          <div className="p-4 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)]">
            <div className="text-xs text-[rgb(140,130,110)] mb-1">Note</div>
            <p className="text-sm">{client.notes}</p>
          </div>
        )}
      </div>
    </div>
  )
}

function SkeletonRows() {
  return (
    <div className="divide-y divide-[rgba(212,175,55,0.08)]">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4">
          <div className="w-10 h-10 rounded-full bg-[rgba(255,255,255,0.04)] animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-[rgba(255,255,255,0.04)] rounded animate-pulse w-32" />
            <div className="h-3 bg-[rgba(255,255,255,0.04)] rounded animate-pulse w-24" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function ClientsPage() {
  return <Suspense><ClientsContent /></Suspense>
}
