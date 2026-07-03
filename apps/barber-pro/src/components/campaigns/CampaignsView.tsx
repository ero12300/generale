"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Client, Coupon, ReferralEvent } from "@/lib/types";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Field, Input, Select } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatEUR, formatDate } from "@/lib/utils";
import { Plus, Megaphone, Sparkles, Lock, Zap, Users } from "lucide-react";

interface Props {
  coupons: Coupon[];
  referrals: ReferralEvent[];
  clients: Client[];
  canUseCampaigns: boolean;
  canUseReferral: boolean;
}

export function CampaignsView({ coupons: initialCoupons, referrals, clients, canUseCampaigns, canUseReferral }: Props) {
  const [coupons, setCoupons] = useState(initialCoupons);
  const [openCoupon, setOpenCoupon] = useState(false);
  const router = useRouter();

  async function refreshCoupons() {
    const res = await fetch("/api/coupons", { cache: "no-store" });
    if (res.ok) {
      const data = (await res.json()) as { coupons: Coupon[] };
      setCoupons(data.coupons);
    }
    router.refresh();
  }

  return (
    <div className="grid lg:grid-cols-2 gap-4">
      {/* Coupons */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Coupon sconto</CardTitle>
            <p className="text-xs text-ink-500 mt-0.5">Codici da usare in prenotazione</p>
          </div>
          {canUseCampaigns ? (
            <Button size="sm" onClick={() => setOpenCoupon(true)}>
              <Plus className="w-4 h-4" /> Nuovo coupon
            </Button>
          ) : (
            <PlanLockBadge />
          )}
        </CardHeader>
        <CardBody className="p-0">
          {!canUseCampaigns ? (
            <UpgradePrompt
              icon={<Megaphone className="w-6 h-6" />}
              title="Sblocca le campagne con Pro"
              description="Crea codici sconto illimitati, promuovi giorni vuoti, fidelizza i clienti."
            />
          ) : coupons.length === 0 ? (
            <EmptyState
              icon={<Megaphone className="w-6 h-6" />}
              title="Nessun coupon"
              description="Crea il tuo primo codice sconto."
              cta={<Button onClick={() => setOpenCoupon(true)}><Plus className="w-4 h-4" />Nuovo coupon</Button>}
            />
          ) : (
            <div className="divide-y divide-white/5">
              {coupons.map((c) => (
                <div key={c.id} className="px-5 py-3.5 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="font-mono text-sm text-[color:var(--color-gold-300)]">{c.code}</div>
                      {c.active ? <Badge tone="emerald">Attivo</Badge> : <Badge tone="rose">Disattivato</Badge>}
                    </div>
                    <div className="text-xs text-ink-400 mt-0.5">
                      {c.discountPercent ? `-${c.discountPercent}%` : `-${formatEUR((c.discountCents ?? 0) / 100)}`}
                      {" · "}
                      {c.redemptions} usati{c.maxRedemptions ? ` / ${c.maxRedemptions}` : ""}
                    </div>
                  </div>
                  <button
                    onClick={async () => {
                      await fetch(`/api/coupons/${c.id}`, {
                        method: "PATCH",
                        headers: { "content-type": "application/json" },
                        body: JSON.stringify({ active: !c.active }),
                      });
                      await refreshCoupons();
                    }}
                    className="text-xs px-2 py-1 rounded-md border border-white/10 hover:bg-white/5"
                  >
                    {c.active ? "Disattiva" : "Attiva"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Referral */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Porta un amico</CardTitle>
            <p className="text-xs text-ink-500 mt-0.5">I clienti che invitano altri clienti</p>
          </div>
          {canUseReferral ? <Badge tone="gold"><Sparkles className="w-3 h-3" />Attivo</Badge> : <PlanLockBadge />}
        </CardHeader>
        <CardBody className="p-0">
          {!canUseReferral ? (
            <UpgradePrompt
              icon={<Sparkles className="w-6 h-6" />}
              title="Attiva referral con Pro"
              description="Ogni cliente riceve un codice unico. Chi porta un amico, ottiene un credito automatico."
            />
          ) : referrals.length === 0 ? (
            <EmptyState
              icon={<Users className="w-6 h-6" />}
              title="Nessun referral ancora"
              description="Condividi il link personale di un cliente per iniziare."
            />
          ) : (
            <div className="divide-y divide-white/5">
              {referrals.map((r) => {
                const ref = clients.find((c) => c.id === r.referrerClientId);
                const nu = clients.find((c) => c.id === r.newClientId);
                return (
                  <div key={r.id} className="px-5 py-3.5 flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-ink-100 truncate">
                        <span className="text-[color:var(--color-gold-400)]">{ref?.name ?? "—"}</span>{" "}
                        <span className="text-ink-500">→</span>{" "}
                        <span>{nu?.name ?? "—"}</span>
                      </div>
                      <div className="text-xs text-ink-400">{formatDate(r.createdAt)}</div>
                    </div>
                    <div className="text-sm font-medium">{formatEUR(r.rewardCents / 100)}</div>
                    <Badge tone={r.status === "rewarded" ? "emerald" : "amber"}>
                      {r.status === "rewarded" ? "Ricompensato" : "In attesa"}
                    </Badge>
                  </div>
                );
              })}
            </div>
          )}
        </CardBody>
      </Card>

      <NewCouponModal
        open={openCoupon}
        onClose={() => setOpenCoupon(false)}
        onCreated={async () => {
          setOpenCoupon(false);
          await refreshCoupons();
        }}
      />
    </div>
  );
}

function PlanLockBadge() {
  return (
    <Link href="/abbonamento" className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[color:var(--color-gold-500)]/10 text-[color:var(--color-gold-300)] border border-[color:var(--color-gold-500)]/30 text-xs">
      <Lock className="w-3 h-3" />
      Passa a Pro
    </Link>
  );
}

function UpgradePrompt({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-8 text-center">
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[color:var(--color-gold-500)]/20 to-transparent border border-[color:var(--color-gold-500)]/30 grid place-items-center mx-auto mb-4 text-[color:var(--color-gold-400)]">
        {icon}
      </div>
      <h3 className="font-display text-lg">{title}</h3>
      <p className="text-sm text-ink-400 mt-2 max-w-md mx-auto">{description}</p>
      <Link
        href="/abbonamento"
        className="mt-5 inline-flex items-center gap-2 h-10 px-5 rounded-lg bg-gradient-to-b from-[#e5cd8b] to-[#a8853a] text-ink-950 text-sm font-medium hover:brightness-110"
      >
        <Zap className="w-4 h-4" /> Passa a Pro
      </Link>
    </div>
  );
}

function NewCouponModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: () => Promise<void>;
}) {
  const [code, setCode] = useState("");
  const [type, setType] = useState<"percent" | "amount">("percent");
  const [percent, setPercent] = useState("10");
  const [amount, setAmount] = useState("5");
  const [maxRedemptions, setMax] = useState("");
  const [loading, setLoading] = useState(false);
  const { push } = useToast();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const body: Record<string, unknown> = {
        code: code.trim().toUpperCase(),
        maxRedemptions: maxRedemptions ? parseInt(maxRedemptions, 10) : undefined,
      };
      if (type === "percent") body.discountPercent = parseInt(percent, 10);
      else body.discountCents = Math.round(parseFloat(amount.replace(",", ".")) * 100);
      const res = await fetch("/api/coupons", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(await res.text());
      push({ kind: "success", title: "Coupon creato" });
      await onCreated();
      setCode(""); setPercent("10"); setAmount("5"); setMax("");
    } catch (err) {
      push({ kind: "error", title: "Errore", description: err instanceof Error ? err.message : "" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Nuovo coupon">
      <form onSubmit={submit} className="space-y-4">
        <Field label="Codice" hint="Verrà convertito in maiuscolo. Es. BENVENUTO10">
          <Input required value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="BENVENUTO10" />
        </Field>
        <Field label="Tipo sconto">
          <Select value={type} onChange={(e) => setType(e.target.value as "percent" | "amount")}>
            <option value="percent">Percentuale</option>
            <option value="amount">Importo fisso (€)</option>
          </Select>
        </Field>
        {type === "percent" ? (
          <Field label="Percentuale (%)">
            <Input type="number" min={1} max={100} value={percent} onChange={(e) => setPercent(e.target.value)} required />
          </Field>
        ) : (
          <Field label="Importo (€)">
            <Input value={amount} onChange={(e) => setAmount(e.target.value)} required />
          </Field>
        )}
        <Field label="Utilizzi massimi (opzionale)">
          <Input type="number" min={1} value={maxRedemptions} onChange={(e) => setMax(e.target.value)} placeholder="Illimitati se vuoto" />
        </Field>
        <div className="flex items-center justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>Annulla</Button>
          <Button type="submit" loading={loading}>Crea</Button>
        </div>
      </form>
    </Modal>
  );
}
