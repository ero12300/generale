"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Store,
  Clock3,
  Scissors,
  Crown,
  CreditCard,
  ExternalLink,
  Plus,
  Trash2,
  Sparkles,
  Zap,
  Check,
  RotateCcw,
  Copy,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Label } from "@/components/ui/input";
import { demoStore, DEMO_ORG_ID } from "@/lib/demo-store";
import { useToast } from "@/components/ui/toast";
import { cn, generateId } from "@/lib/utils";
import { TIER_LIMITS, type Organization, type Service, type SubscriptionTier } from "@/types";
import { useAuth } from "@/lib/auth-context";

const WEEKDAYS = ["Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"];

export function SettingsPage() {
  const { push } = useToast();
  const { isDemo } = useAuth();
  const params = useSearchParams();
  const [tab, setTab] = useState<"salone" | "servizi" | "orari" | "abbonamento">("salone");
  const [org, setOrg] = useState<Organization | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [upgrading, setUpgrading] = useState<SubscriptionTier | null>(null);

  useEffect(() => {
    setOrg(demoStore.getOrganization());
    setServices(demoStore.listServices());
    const upgrade = params.get("upgrade");
    if (upgrade === "pro" || upgrade === "elite") {
      setTab("abbonamento");
    }
  }, [params]);

  if (!org) return null;

  function saveOrg(patch: Partial<Organization>) {
    const updated = demoStore.updateOrganization(patch);
    setOrg(updated);
    push("Impostazioni salvate", "success");
  }

  async function handleUpgrade(tier: SubscriptionTier) {
    setUpgrading(tier);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier, orgId: org?.id, orgName: org?.name }),
      });
      const data = await res.json();
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }
      if (data.demo) {
        saveOrg({ tier });
        push(`Piano ${TIER_LIMITS[tier].label} attivato (demo)`, "success");
      } else {
        push(data.error ?? "Errore checkout", "error");
      }
    } catch {
      push("Errore checkout", "error");
    } finally {
      setUpgrading(null);
    }
  }

  async function openPortal() {
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.portalUrl) window.location.href = data.portalUrl;
      else push(data.error ?? "Portale non disponibile in demo", "info");
    } catch {
      push("Portale non disponibile", "error");
    }
  }

  function resetDemo() {
    if (confirm("Vuoi ripristinare i dati demo? Perderai le modifiche locali.")) {
      demoStore.reset();
      window.location.reload();
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Impostazioni"
        description="Configura il tuo salone, i servizi, gli orari di apertura e l'abbonamento."
      />

      <div className="flex gap-1.5 mb-6 flex-wrap">
        {(
          [
            { k: "salone", l: "Salone", icon: Store },
            { k: "servizi", l: "Servizi", icon: Scissors },
            { k: "orari", l: "Orari", icon: Clock3 },
            { k: "abbonamento", l: "Abbonamento", icon: Crown },
          ] as const
        ).map((t) => (
          <button
            key={t.k}
            onClick={() => setTab(t.k)}
            className={cn(
              "text-sm px-4 py-2 rounded-lg border transition-colors inline-flex items-center gap-2",
              tab === t.k
                ? "border-gold-400/40 bg-gold-400/10 text-gold-200"
                : "border-white/10 bg-white/5 text-ink-300 hover:bg-white/10"
            )}
          >
            <t.icon className="h-4 w-4" /> {t.l}
          </button>
        ))}
      </div>

      {tab === "salone" && <SaloneTab org={org} onSave={saveOrg} isDemo={isDemo} onReset={resetDemo} />}
      {tab === "servizi" && <ServicesTab services={services} onChange={setServices} />}
      {tab === "orari" && <OrariTab org={org} onSave={saveOrg} />}
      {tab === "abbonamento" && (
        <SubscriptionTab
          org={org}
          onUpgrade={handleUpgrade}
          upgrading={upgrading}
          onOpenPortal={openPortal}
        />
      )}
    </div>
  );
}

function SaloneTab({
  org,
  onSave,
  isDemo,
  onReset,
}: {
  org: Organization;
  onSave: (patch: Partial<Organization>) => void;
  isDemo: boolean;
  onReset: () => void;
}) {
  const { push } = useToast();
  const [name, setName] = useState(org.name);
  const [address, setAddress] = useState(org.address);
  const [phone, setPhone] = useState(org.phone);
  const [slug, setSlug] = useState(org.slug);
  const publicUrl = typeof window !== "undefined" ? `${window.location.origin}/book/${slug}` : `/book/${slug}`;
  return (
    <div className="space-y-6">
      <div className="surface rounded-2xl p-6 space-y-4">
        <div className="font-display text-xl text-ink-50 mb-2">Dati del salone</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Nome</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label>Slug pagina pubblica</Label>
            <Input value={slug} onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))} />
          </div>
          <div>
            <Label>Indirizzo</Label>
            <Input value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>
          <div>
            <Label>Telefono</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button onClick={() => onSave({ name, address, phone, slug })}>Salva modifiche</Button>
        </div>
      </div>

      <div className="surface rounded-2xl p-6">
        <div className="font-display text-xl text-ink-50 mb-3">Pagina prenotazione pubblica</div>
        <p className="text-sm text-ink-300 mb-4">Condividi il link con i tuoi clienti. Prenotano in 20 secondi da smartphone.</p>
        <div className="flex items-center gap-2 rounded-lg border border-gold-400/20 bg-gold-400/5 p-3">
          <code className="text-sm text-gold-100 font-mono truncate flex-1">{publicUrl}</code>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              if (typeof navigator !== "undefined") {
                navigator.clipboard.writeText(publicUrl);
                push("Link copiato", "success");
              }
            }}
          >
            <Copy className="h-3.5 w-3.5" /> Copia
          </Button>
          <Button asChild size="sm">
            <Link href={`/book/${slug}`} target="_blank">
              Apri <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </div>

      {isDemo && (
        <div className="surface rounded-2xl p-6 border-amber-400/20 bg-amber-400/[0.03]">
          <div className="flex items-start gap-4">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <div className="font-medium text-ink-50">Modalità demo attiva</div>
              <p className="text-sm text-ink-300 mt-1">
                Firebase non è configurato: i tuoi dati vengono salvati nel browser (localStorage). Configura le variabili in <code className="text-gold-200">.env</code> per attivare la persistenza cloud e Stripe.
              </p>
              <Button variant="secondary" className="mt-3" onClick={onReset}>
                <RotateCcw className="h-4 w-4" /> Ripristina dati demo
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ServicesTab({
  services,
  onChange,
}: {
  services: Service[];
  onChange: (list: Service[]) => void;
}) {
  const { push } = useToast();
  const [items, setItems] = useState<Service[]>(services);

  useEffect(() => setItems(services), [services]);

  function addService() {
    const s: Service = {
      id: generateId("svc"),
      organizationId: DEMO_ORG_ID,
      name: "Nuovo servizio",
      durationMin: 30,
      price: 20,
      color: "#d4a72c",
      active: true,
    };
    const next = [...items, s];
    setItems(next);
    demoStore.upsertService(s);
    onChange(next);
    push("Servizio aggiunto", "success");
  }

  function updateService(id: string, patch: Partial<Service>) {
    const next = items.map((s) => (s.id === id ? { ...s, ...patch } : s));
    setItems(next);
    const updated = next.find((s) => s.id === id);
    if (updated) demoStore.upsertService(updated);
    onChange(next);
  }

  function removeService(id: string) {
    const next = items.filter((s) => s.id !== id);
    setItems(next);
    demoStore.deleteService(id);
    onChange(next);
    push("Servizio rimosso", "info");
  }

  return (
    <div className="surface rounded-2xl p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="font-display text-xl text-ink-50">Listino servizi</div>
        <Button onClick={addService}><Plus className="h-4 w-4" /> Aggiungi</Button>
      </div>
      <div className="space-y-2">
        {items.map((s) => (
          <div key={s.id} className="grid grid-cols-1 md:grid-cols-[1fr,auto,auto,auto,auto] gap-3 items-center rounded-xl border border-white/5 bg-white/[0.02] p-3">
            <Input
              value={s.name}
              onChange={(e) => updateService(s.id, { name: e.target.value })}
              className="text-sm"
            />
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min="5"
                step="5"
                value={s.durationMin}
                onChange={(e) => updateService(s.id, { durationMin: parseInt(e.target.value, 10) || 0 })}
                className="w-24"
              />
              <span className="text-xs text-ink-400">min</span>
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min="0"
                step="0.5"
                value={s.price}
                onChange={(e) => updateService(s.id, { price: parseFloat(e.target.value) || 0 })}
                className="w-28"
              />
              <span className="text-xs text-ink-400">€</span>
            </div>
            <button
              onClick={() => updateService(s.id, { active: !s.active })}
              className={cn(
                "text-xs px-3 py-2 rounded-lg border",
                s.active ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" : "border-white/10 bg-white/5 text-ink-400"
              )}
            >
              {s.active ? "Attivo" : "Inattivo"}
            </button>
            <Button variant="ghost" size="icon" onClick={() => removeService(s.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

function OrariTab({ org, onSave }: { org: Organization; onSave: (patch: Partial<Organization>) => void }) {
  const [hours, setHours] = useState(org.openingHours);

  useEffect(() => setHours(org.openingHours), [org.openingHours]);

  function updateDay(weekday: number, patch: Partial<Organization["openingHours"][number]>) {
    setHours((prev) => prev.map((h) => (h.weekday === weekday ? { ...h, ...patch } : h)));
  }

  return (
    <div className="surface rounded-2xl p-6">
      <div className="font-display text-xl text-ink-50 mb-5">Orari di apertura</div>
      <div className="space-y-2">
        {[1, 2, 3, 4, 5, 6, 0].map((w) => {
          const h = hours.find((x) => x.weekday === w) ?? { weekday: w, open: "09:00", close: "19:00", closed: false };
          return (
            <div key={w} className="grid grid-cols-[100px,1fr,auto] md:grid-cols-[120px,1fr,1fr,auto] gap-3 items-center rounded-xl border border-white/5 bg-white/[0.02] p-3">
              <div className="text-sm text-ink-100 font-medium">{WEEKDAYS[w]}</div>
              <Input type="time" value={h.open} onChange={(e) => updateDay(w, { open: e.target.value })} disabled={h.closed} />
              <Input type="time" value={h.close} onChange={(e) => updateDay(w, { close: e.target.value })} disabled={h.closed} />
              <label className="flex items-center gap-2 text-xs text-ink-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={h.closed}
                  onChange={(e) => updateDay(w, { closed: e.target.checked })}
                  className="accent-gold-400"
                />
                Chiuso
              </label>
            </div>
          );
        })}
      </div>
      <div className="flex justify-end mt-5">
        <Button onClick={() => onSave({ openingHours: hours })}>Salva orari</Button>
      </div>
    </div>
  );
}

function SubscriptionTab({
  org,
  onUpgrade,
  upgrading,
  onOpenPortal,
}: {
  org: Organization;
  onUpgrade: (tier: SubscriptionTier) => void;
  upgrading: SubscriptionTier | null;
  onOpenPortal: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="surface-elevated rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gold-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-gold-400/15 border border-gold-400/30 text-gold-200">
              {org.tier === "elite" ? <Crown className="h-5 w-5" /> : org.tier === "pro" ? <Zap className="h-5 w-5" /> : <Scissors className="h-5 w-5" />}
            </div>
            <div>
              <div className="text-xs text-ink-400 uppercase tracking-widest">Piano attuale</div>
              <div className="font-display text-2xl text-ink-50">{TIER_LIMITS[org.tier].label}</div>
            </div>
            <div className="ml-auto text-right">
              <div className="text-xs text-ink-400">Costo mensile</div>
              <div className="font-display text-2xl gradient-text">
                {TIER_LIMITS[org.tier].priceMonthly === 0 ? "Gratis" : `€${TIER_LIMITS[org.tier].priceMonthly}`}
              </div>
            </div>
          </div>
          {org.stripeCustomerId && (
            <Button variant="secondary" onClick={onOpenPortal}>
              <CreditCard className="h-4 w-4" /> Gestisci abbonamento
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(Object.keys(TIER_LIMITS) as SubscriptionTier[]).map((t) => {
          const p = TIER_LIMITS[t];
          const isCurrent = org.tier === t;
          const highlight = p.highlight;
          return (
            <div
              key={t}
              className={
                highlight && !isCurrent
                  ? "rounded-2xl p-[1px] bg-gradient-to-b from-gold-300 via-gold-500 to-gold-700"
                  : "surface rounded-2xl"
              }
            >
              <div className={highlight && !isCurrent ? "surface-elevated rounded-[15px] p-6" : "p-6"}>
                <div className="flex items-center justify-between mb-3">
                  <Badge variant={isCurrent ? "emerald" : "muted"}>
                    {isCurrent ? "Attuale" : p.label}
                  </Badge>
                  {highlight && !isCurrent && <Badge variant="gold">Popolare</Badge>}
                </div>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="font-display text-4xl text-ink-50">
                    {p.priceMonthly === 0 ? "0€" : `€${p.priceMonthly}`}
                  </span>
                  <span className="text-ink-400 text-sm">/mese</span>
                </div>
                <ul className="space-y-2 mb-5">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs text-ink-200">
                      <Check className="h-3.5 w-3.5 text-gold-300 mt-0.5 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                {isCurrent ? (
                  <Button variant="secondary" disabled className="w-full">Piano attivo</Button>
                ) : (
                  <Button
                    className="w-full"
                    variant={highlight ? "primary" : "secondary"}
                    disabled={upgrading !== null}
                    onClick={() => onUpgrade(t)}
                  >
                    {upgrading === t ? "Attivazione…" : p.priceMonthly === 0 ? "Passa gratis" : `Passa a ${p.label}`}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
