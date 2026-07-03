'use client'

import { useEffect, useState } from 'react'
import { Plus, Megaphone, Users, Tag, X, Copy, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/useAuth'
import { getCampaigns, createCampaign, updateCampaign } from '@/lib/firebase/firestore'
import { formatDateShort } from '@/lib/utils'
import type { Campaign, CampaignType, CampaignStatus } from '@/types'
import { toast } from '@/hooks/useToast'

const CAMPAIGN_TYPE_LABELS: Record<CampaignType, string> = {
  discount: 'Sconto',
  referral: 'Porta un Amico',
  birthday: 'Compleanno',
  loyalty: 'Fidelizzazione',
}

const STATUS_COLORS: Record<CampaignStatus, string> = {
  active: 'text-green-400 bg-green-400/10',
  paused: 'text-yellow-400 bg-yellow-400/10',
  ended: 'text-gray-400 bg-gray-400/10',
  scheduled: 'text-blue-400 bg-blue-400/10',
}

export default function CampaignsPage() {
  const { shop } = useAuth()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [showNew, setShowNew] = useState(false)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  useEffect(() => {
    if (!shop) return
    loadCampaigns()
  }, [shop])

  async function loadCampaigns() {
    if (!shop) return
    setLoading(true)
    try {
      const data = await getCampaigns(shop.id)
      setCampaigns(data)
    } finally {
      setLoading(false)
    }
  }

  async function toggleStatus(campaign: Campaign) {
    if (!shop) return
    const newStatus: CampaignStatus = campaign.status === 'active' ? 'paused' : 'active'
    await updateCampaign(shop.id, campaign.id, { status: newStatus })
    setCampaigns(prev => prev.map(c => c.id === campaign.id ? { ...c, status: newStatus } : c))
    toast({ title: newStatus === 'active' ? 'Campagna attivata' : 'Campagna sospesa' })
  }

  function copyCode(code: string) {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
    toast({ title: 'Codice copiato!' })
  }

  return (
    <div className="max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Campagne</h1>
          <p className="text-[rgb(140,130,110)] mt-1">Sconti, referral e promo per fidelizzare i clienti</p>
        </div>
        <Button onClick={() => setShowNew(true)}>
          <Plus className="w-4 h-4" />
          Nuova campagna
        </Button>
      </div>

      {/* Campaign Types Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {(Object.entries(CAMPAIGN_TYPE_LABELS) as [CampaignType, string][]).map(([type, label]) => {
          const count = campaigns.filter(c => c.type === type && c.status === 'active').length
          return (
            <Card key={type} className="p-4 text-center">
              <div className="text-2xl font-bold gold-text">{count}</div>
              <div className="text-xs text-[rgb(140,130,110)] mt-1">{label} attive</div>
            </Card>
          )
        })}
      </div>

      {/* Campaigns Grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-40 rounded-2xl bg-[rgba(255,255,255,0.04)] animate-pulse" />
          ))}
        </div>
      ) : campaigns.length === 0 ? (
        <Card className="text-center py-16">
          <Megaphone className="w-12 h-12 mx-auto mb-4 text-[rgb(60,56,50)]" />
          <h3 className="font-semibold mb-2">Nessuna campagna</h3>
          <p className="text-sm text-[rgb(80,75,65)] mb-6">Crea la tua prima campagna per fidelizzare i clienti</p>
          <Button onClick={() => setShowNew(true)}>Crea campagna</Button>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {campaigns.map(c => (
            <Card key={c.id} className={`${c.status === 'active' ? 'border-[rgba(212,175,55,0.2)]' : ''}`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{c.name}</h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${STATUS_COLORS[c.status]}`}>
                      {c.status.toUpperCase()}
                    </span>
                  </div>
                  <Badge variant="secondary" className="text-xs">{CAMPAIGN_TYPE_LABELS[c.type]}</Badge>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-[rgb(212,175,55)]">
                    {c.discountType === 'percent' ? `${c.discountValue}%` : `€${c.discountValue}`}
                  </div>
                  <div className="text-xs text-[rgb(80,75,65)]">di sconto</div>
                </div>
              </div>

              {c.description && (
                <p className="text-sm text-[rgb(140,130,110)] mb-4">{c.description}</p>
              )}

              {c.code && (
                <div
                  className="flex items-center justify-between p-3 rounded-lg bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] mb-4 cursor-pointer hover:border-[rgba(212,175,55,0.3)] transition-colors"
                  onClick={() => copyCode(c.code!)}
                >
                  <div>
                    <div className="text-xs text-[rgb(80,75,65)]">Codice sconto</div>
                    <div className="font-mono font-bold tracking-wider text-[rgb(212,175,55)]">{c.code}</div>
                  </div>
                  {copiedCode === c.code ? (
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-[rgb(80,75,65)]" />
                  )}
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-[rgb(80,75,65)]">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {c.usageCount} utilizzi
                  </span>
                  {c.usageLimit && (
                    <span>su {c.usageLimit} max</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {c.validUntil && <span>Scade {formatDateShort(c.validUntil)}</span>}
                  <button
                    onClick={() => toggleStatus(c)}
                    className={`text-xs px-2 py-1 rounded-md transition-colors ${
                      c.status === 'active'
                        ? 'text-red-400 hover:bg-red-400/10'
                        : 'text-green-400 hover:bg-green-400/10'
                    }`}
                  >
                    {c.status === 'active' ? 'Sospendi' : 'Attiva'}
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {showNew && shop && (
        <NewCampaignModal
          shopId={shop.id}
          onClose={() => setShowNew(false)}
          onCreated={() => { setShowNew(false); loadCampaigns() }}
        />
      )}
    </div>
  )
}

function NewCampaignModal({ shopId, onClose, onCreated }: { shopId: string; onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState({
    name: '',
    type: 'discount' as CampaignType,
    discountType: 'percent' as 'percent' | 'fixed',
    discountValue: '',
    code: '',
    usageLimit: '',
    validUntil: '',
    description: '',
  })
  const [loading, setLoading] = useState(false)

  function generateCode() {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase()
    setForm(p => ({ ...p, code }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await createCampaign(shopId, {
        shopId,
        name: form.name,
        type: form.type,
        status: 'active',
        discountType: form.discountType,
        discountValue: parseFloat(form.discountValue),
        code: form.code || undefined,
        usageLimit: form.usageLimit ? parseInt(form.usageLimit) : undefined,
        usageCount: 0,
        validFrom: new Date().toISOString().split('T')[0],
        validUntil: form.validUntil || undefined,
        description: form.description || undefined,
      })
      toast({ title: 'Campagna creata!' })
      onCreated()
    } catch {
      toast({ title: 'Errore', description: 'Impossibile creare la campagna', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[rgba(0,0,0,0.7)] backdrop-blur-sm">
      <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Nuova campagna
            <button onClick={onClose}><X className="w-5 h-5 text-[rgb(80,75,65)]" /></button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-[rgb(140,130,110)] mb-1.5 block">Nome campagna *</label>
              <Input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="es. Sconto Luglio 2026" />
            </div>

            <div>
              <label className="text-xs text-[rgb(140,130,110)] mb-1.5 block">Tipo</label>
              <div className="grid grid-cols-2 gap-2">
                {(Object.entries(CAMPAIGN_TYPE_LABELS) as [CampaignType, string][]).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setForm(p => ({ ...p, type: key }))}
                    className={`py-2.5 rounded-lg text-sm font-medium transition-all ${
                      form.type === key
                        ? 'gold-gradient text-[rgb(10,10,10)]'
                        : 'bg-[rgba(255,255,255,0.04)] text-[rgb(140,130,110)] hover:text-[rgb(250,245,235)]'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-[rgb(140,130,110)] mb-1.5 block">Tipo sconto</label>
                <select
                  value={form.discountType}
                  onChange={e => setForm(p => ({ ...p, discountType: e.target.value as 'percent' | 'fixed' }))}
                  className="flex h-10 w-full rounded-lg border border-[rgba(212,175,55,0.2)] bg-[rgb(18,18,18)] px-3 text-sm text-[rgb(250,245,235)] focus:outline-none focus:ring-2 focus:ring-[rgb(212,175,55)]"
                >
                  <option value="percent">Percentuale (%)</option>
                  <option value="fixed">Fisso (€)</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-[rgb(140,130,110)] mb-1.5 block">Valore *</label>
                <Input required type="number" min="0" step="0.01" value={form.discountValue} onChange={e => setForm(p => ({ ...p, discountValue: e.target.value }))} placeholder={form.discountType === 'percent' ? '10' : '5.00'} />
              </div>
            </div>

            <div>
              <label className="text-xs text-[rgb(140,130,110)] mb-1.5 block">Codice promo</label>
              <div className="flex gap-2">
                <Input value={form.code} onChange={e => setForm(p => ({ ...p, code: e.target.value.toUpperCase() }))} placeholder="es. LUGLIO20" className="font-mono" />
                <Button type="button" variant="outline" onClick={generateCode} size="sm" className="flex-shrink-0">Genera</Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-[rgb(140,130,110)] mb-1.5 block">Limite utilizzi</label>
                <Input type="number" min="1" value={form.usageLimit} onChange={e => setForm(p => ({ ...p, usageLimit: e.target.value }))} placeholder="Illimitati" />
              </div>
              <div>
                <label className="text-xs text-[rgb(140,130,110)] mb-1.5 block">Scade il</label>
                <Input type="date" value={form.validUntil} onChange={e => setForm(p => ({ ...p, validUntil: e.target.value }))} />
              </div>
            </div>

            <div>
              <label className="text-xs text-[rgb(140,130,110)] mb-1.5 block">Descrizione</label>
              <Input value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Descrizione opzionale della campagna" />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creazione...' : 'Crea campagna'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
