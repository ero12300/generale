"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getTransactions, createTransaction, getClients, validateCoupon } from "@/lib/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Transaction, PaymentMethod, Client } from "@/types";
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns";
import { it } from "date-fns/locale";
import {
  Plus, Wallet, TrendingUp, CreditCard, Banknote, X,
  Search, Tag, ShoppingBag, Download,
  BarChart2,
} from "lucide-react";
import { toast } from "sonner";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const methodLabel: Record<PaymentMethod, string> = {
  cash: "Contanti",
  card: "Carta",
  transfer: "Bonifico",
  other: "Altro",
};
const methodIcon: Record<PaymentMethod, React.ElementType> = {
  cash: Banknote,
  card: CreditCard,
  transfer: TrendingUp,
  other: ShoppingBag,
};

export default function CashierPage() {
  const { shop } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState("month");

  const getDateRange = useCallback(() => {
    const now = new Date();
    if (period === "today") {
      const today = format(now, "yyyy-MM-dd");
      return { from: today, to: today };
    }
    if (period === "month") {
      return {
        from: format(startOfMonth(now), "yyyy-MM-dd"),
        to: format(endOfMonth(now), "yyyy-MM-dd"),
      };
    }
    if (period === "last_month") {
      const lm = subMonths(now, 1);
      return {
        from: format(startOfMonth(lm), "yyyy-MM-dd"),
        to: format(endOfMonth(lm), "yyyy-MM-dd"),
      };
    }
    return {};
  }, [period]);

  const load = useCallback(async () => {
    if (!shop?.id) return;
    setLoading(true);
    const { from, to } = getDateRange();
    setTransactions(await getTransactions(shop.id, from, to));
    setLoading(false);
  }, [shop?.id, getDateRange]);

  useEffect(() => { load(); }, [load]);

  const filtered = transactions.filter(
    (t) =>
      search === "" ||
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.clientName?.toLowerCase().includes(search.toLowerCase())
  );

  const totalRevenue = filtered.reduce((s, t) => s + t.total, 0);
  const byMethod = filtered.reduce((acc, t) => {
    acc[t.paymentMethod] = (acc[t.paymentMethod] ?? 0) + t.total;
    return acc;
  }, {} as Record<string, number>);

  const dailyData = filtered.reduce((acc, t) => {
    const day = format(new Date(t.date), "dd/MM");
    acc[day] = (acc[day] ?? 0) + t.total / 100;
    return acc;
  }, {} as Record<string, number>);
  const chartData = Object.entries(dailyData).map(([date, total]) => ({ date, Incasso: total }));

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Cassa</h1>
          <p className="text-sm text-[var(--muted)]">Gestione incassi</p>
        </div>
        <Button variant="gold" onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4" /> Registra incasso
        </Button>
      </div>

      {/* Period + Search */}
      <div className="flex gap-3 flex-wrap">
        {[
          { value: "today", label: "Oggi" },
          { value: "month", label: "Questo mese" },
          { value: "last_month", label: "Mese scorso" },
          { value: "all", label: "Tutti" },
        ].map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setPeriod(value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              period === value
                ? "bg-[var(--primary)] text-black"
                : "bg-[var(--card)] border border-[var(--border)] text-[var(--muted)] hover:border-[var(--primary)]/50"
            }`}
          >
            {label}
          </button>
        ))}
        <Input
          placeholder="Cerca..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<Search className="w-3.5 h-3.5" />}
          className="ml-auto w-44"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="gradient-border gold-glow lg:col-span-1">
          <CardContent className="pt-5">
            <p className="text-xs text-[var(--muted)] uppercase tracking-wider mb-2">Totale</p>
            <p className="text-2xl font-bold text-gold">{formatCurrency(totalRevenue * 100)}</p>
            <p className="text-xs text-[var(--muted)] mt-1">{filtered.length} transazioni</p>
          </CardContent>
        </Card>
        {Object.entries(byMethod).map(([method, amount]) => {
          const Icon = methodIcon[method as PaymentMethod] ?? Wallet;
          return (
            <Card key={method}>
              <CardContent className="pt-5">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-4 h-4 text-[var(--muted)]" />
                  <p className="text-xs text-[var(--muted)] uppercase tracking-wider">
                    {methodLabel[method as PaymentMethod]}
                  </p>
                </div>
                <p className="text-xl font-bold">{formatCurrency(amount * 100)}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Chart */}
      {chartData.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-[var(--primary)]" />
              Incassi per giorno
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" tick={{ fill: "var(--muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "var(--muted)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `€${v}`} />
                <Tooltip formatter={(v: number) => [`€${v.toFixed(2)}`, "Incasso"]} contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Bar dataKey="Incasso" fill="var(--primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Transactions Table */}
      <Card>
        <CardContent className="pt-5">
          <div className="space-y-2">
            {loading ? (
              [...Array(4)].map((_, i) => <div key={i} className="h-14 rounded-lg shimmer" />)
            ) : filtered.length === 0 ? (
              <div className="text-center py-12">
                <Wallet className="w-10 h-10 text-[var(--border)] mx-auto mb-3" />
                <p className="text-[var(--muted)] text-sm">Nessun incasso registrato</p>
              </div>
            ) : (
              filtered.map((t) => {
                const Icon = methodIcon[t.paymentMethod] ?? Wallet;
                return (
                  <div key={t.id} className="flex items-center justify-between p-3 rounded-lg bg-[var(--accent)] border border-[var(--border)] hover:border-[var(--primary)]/20 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[var(--card)] border border-[var(--border)] flex items-center justify-center">
                        <Icon className="w-4 h-4 text-[var(--muted)]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[var(--foreground)]">{t.description}</p>
                        <p className="text-xs text-[var(--muted)]">
                          {t.clientName && `${t.clientName} · `}{formatDate(t.date)}
                          {t.discountCode && (
                            <span className="ml-2 text-[var(--primary)]">
                              <Tag className="w-3 h-3 inline mr-0.5" />{t.discountCode}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {t.discount > 0 && (
                        <p className="text-xs text-red-400 line-through">
                          {formatCurrency((t.amount + t.discount) * 100)}
                        </p>
                      )}
                      <p className="text-sm font-bold text-[var(--primary)]">{formatCurrency(t.total * 100)}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      {showModal && shop && (
        <TransactionModal
          shop={shop}
          onClose={() => setShowModal(false)}
          onCreated={(t) => {
            setTransactions((p) => [t, ...p]);
            setShowModal(false);
            toast.success("Incasso registrato!");
          }}
        />
      )}
    </div>
  );
}

function TransactionModal({
  shop,
  onClose,
  onCreated,
}: {
  shop: any;
  onClose: () => void;
  onCreated: (t: Transaction) => void;
}) {
  const [form, setForm] = useState({
    description: "",
    clientName: "",
    paymentMethod: "cash" as PaymentMethod,
    serviceId: shop.settings.services[0]?.id ?? "",
    couponCode: "",
    date: format(new Date(), "yyyy-MM-dd"),
  });
  const [discount, setDiscount] = useState(0);
  const [couponValid, setCouponValid] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const service = shop.settings.services.find((s: any) => s.id === form.serviceId);
  const base = service?.price ?? 0;
  const total = Math.max(0, base - discount);

  const checkCoupon = async () => {
    if (!form.couponCode) return;
    const campaign = await validateCoupon(shop.id, form.couponCode);
    if (!campaign) {
      toast.error("Codice non valido o scaduto");
      return;
    }
    setCouponValid(campaign);
    if (campaign.discountType === "percentage") {
      setDiscount(Math.round((base * campaign.discountValue) / 100));
    } else {
      setDiscount(campaign.discountValue);
    }
    toast.success(`Sconto applicato: ${campaign.discountType === "percentage" ? campaign.discountValue + "%" : formatCurrency(campaign.discountValue * 100)}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!service) return;
    setSaving(true);
    try {
      const t = await createTransaction({
        shopId: shop.id,
        description: form.description || service.name,
        clientName: form.clientName || undefined,
        paymentMethod: form.paymentMethod,
        services: [{ name: service.name, price: service.price }],
        products: [],
        amount: base,
        discount,
        discountCode: couponValid?.code,
        total,
        date: form.date,
      });
      onCreated(t);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold">Registra Incasso</h2>
          <Button size="icon" variant="ghost" onClick={onClose}><X className="w-4 h-4" /></Button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Data" type="date" value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} />
          <Input label="Nome cliente" value={form.clientName} onChange={(e) => setForm((p) => ({ ...p, clientName: e.target.value }))} placeholder="Mario Rossi" />
          <Select
            label="Servizio"
            value={form.serviceId}
            onChange={(e) => { setForm((p) => ({ ...p, serviceId: e.target.value })); setDiscount(0); setCouponValid(null); }}
            options={shop.settings.services.filter((s: any) => s.active).map((s: any) => ({
              value: s.id,
              label: `${s.name} — ${formatCurrency(s.price * 100)}`,
            }))}
          />
          <Select
            label="Metodo di pagamento"
            value={form.paymentMethod}
            onChange={(e) => setForm((p) => ({ ...p, paymentMethod: e.target.value as PaymentMethod }))}
            options={[
              { value: "cash", label: "Contanti" },
              { value: "card", label: "Carta" },
              { value: "transfer", label: "Bonifico" },
              { value: "other", label: "Altro" },
            ]}
          />
          <div className="flex gap-2">
            <Input
              label="Codice sconto"
              value={form.couponCode}
              onChange={(e) => setForm((p) => ({ ...p, couponCode: e.target.value.toUpperCase() }))}
              placeholder="PROMO10"
              leftIcon={<Tag className="w-3.5 h-3.5" />}
            />
            <Button type="button" variant="outline" size="sm" className="self-end mb-0.5" onClick={checkCoupon}>
              Applica
            </Button>
          </div>

          {/* Total Preview */}
          <div className="bg-[var(--accent)] rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[var(--muted)]">Subtotale</span>
              <span>{formatCurrency(base * 100)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-red-400">Sconto</span>
                <span className="text-red-400">-{formatCurrency(discount * 100)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-bold border-t border-[var(--border)] pt-2">
              <span>Totale</span>
              <span className="text-[var(--primary)]">{formatCurrency(total * 100)}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Annulla</Button>
            <Button type="submit" variant="gold" className="flex-1" loading={saving}>Registra</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
