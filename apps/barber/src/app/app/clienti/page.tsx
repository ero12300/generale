"use client";

import { Search, UserPlus } from "lucide-react";
import { useMemo, useState } from "react";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Field,
  Input,
  SectionHeading,
  Spinner,
  Textarea,
} from "@/components/ui";
import { formatEuro } from "@/lib/money";
import { useStore } from "@/lib/store/provider";
import { PLANS } from "@/lib/types";
import { customerInputSchema } from "@/lib/validation";

export default function ClientiPage() {
  const { state, loading, addCustomer } = useStore();
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [consent, setConsent] = useState(false);
  const [referredBy, setReferredBy] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!state) return [];
    const q = query.trim().toLowerCase();
    return state.customers
      .filter(
        (c) =>
          !q ||
          c.name.toLowerCase().includes(q) ||
          c.phone.replace(/\s/g, "").includes(q.replace(/\s/g, "")) ||
          c.referralCode.toLowerCase().includes(q),
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [state, query]);

  const statsByCustomer = useMemo(() => {
    if (!state) return new Map<string, { visits: number; totalCents: number }>();
    const map = new Map<string, { visits: number; totalCents: number }>();
    for (const sale of state.sales) {
      if (!sale.customerId) continue;
      const entry = map.get(sale.customerId) ?? { visits: 0, totalCents: 0 };
      entry.visits += 1;
      entry.totalCents += sale.amountCents;
      map.set(sale.customerId, entry);
    }
    return map;
  }, [state]);

  if (loading || !state) return <Spinner label="Carico i clienti…" />;

  const plan = PLANS[state.settings.plan];
  const referralActive = plan.referralProgram;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    setFeedback(null);
    const parsed = customerInputSchema.safeParse({
      name,
      phone,
      email,
      notes,
      marketingConsent: consent,
    });
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        fieldErrors[String(issue.path[0])] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    const result = addCustomer(parsed.data, referredBy || undefined);
    if (!result.ok) {
      setSubmitError(result.error);
      return;
    }
    setFeedback(
      `Cliente ${result.data.name} aggiunto. Codice amico: ${result.data.referralCode}`,
    );
    setName("");
    setPhone("");
    setEmail("");
    setNotes("");
    setReferredBy("");
    setConsent(false);
    setShowForm(false);
  }

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Clienti"
        title="Database clienti"
        subtitle={
          plan.maxCustomers === null
            ? "Clienti illimitati con il piano Pro. Ogni cliente ha un codice amico personale da condividere."
            : `Piano Base: fino a ${plan.maxCustomers} clienti (${state.customers.length} usati).`
        }
      />

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cream/30"
            aria-hidden
          />
          <Input
            aria-label="Cerca cliente"
            className="pl-9"
            placeholder="Cerca per nome, telefono o codice amico…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Button onClick={() => setShowForm((v) => !v)}>
          <UserPlus className="h-4 w-4" aria-hidden />
          {showForm ? "Chiudi" : "Nuovo cliente"}
        </Button>
      </div>

      {feedback ? (
        <p className="rounded-xl bg-emerald-500/10 p-3 text-sm text-emerald-300">
          {feedback}
        </p>
      ) : null}

      {showForm ? (
        <Card>
          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            <Field label="Nome e cognome" htmlFor="c-name" error={errors.name}>
              <Input
                id="c-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Field>
            <Field label="Telefono" htmlFor="c-phone" error={errors.phone}>
              <Input
                id="c-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                inputMode="tel"
              />
            </Field>
            <Field label="Email (facoltativa)" htmlFor="c-email" error={errors.email}>
              <Input
                id="c-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Field>
            <Field
              label={`Codice amico di chi lo ha invitato${referralActive ? "" : " (solo Pro)"}`}
              htmlFor="c-ref"
            >
              <Input
                id="c-ref"
                value={referredBy}
                onChange={(e) => setReferredBy(e.target.value)}
                disabled={!referralActive}
                placeholder="Es. GIULI421"
              />
            </Field>
            <div className="md:col-span-2">
              <Field label="Note (preferenze, allergie…)" htmlFor="c-notes">
                <Textarea
                  id="c-notes"
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </Field>
            </div>
            <label className="flex items-center gap-2 text-xs text-cream/50 md:col-span-2">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="accent-gold-500"
              />
              Ha dato il consenso a ricevere comunicazioni promozionali.
            </label>
            {submitError ? (
              <p role="alert" className="text-sm text-red-300 md:col-span-2">
                {submitError}
              </p>
            ) : null}
            <div className="md:col-span-2">
              <Button type="submit">Salva cliente</Button>
            </div>
          </form>
        </Card>
      ) : null}

      {filtered.length === 0 ? (
        <EmptyState
          title="Nessun cliente trovato"
          hint="I clienti che prenotano online vengono aggiunti automaticamente."
        />
      ) : (
        <div className="grid gap-3">
          {filtered.map((c) => {
            const stats = statsByCustomer.get(c.id);
            const referrer = c.referredById
              ? state.customers.find((x) => x.id === c.referredById)
              : undefined;
            return (
              <Card key={c.id} className="flex flex-wrap items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gold-500/15 font-display text-lg text-gold-300">
                  {c.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-cream">{c.name}</p>
                  <p className="text-xs text-cream/50">
                    {c.phone}
                    {c.email ? ` · ${c.email}` : ""}
                  </p>
                  {c.notes ? (
                    <p className="mt-1 truncate text-xs text-cream/40">
                      {c.notes}
                    </p>
                  ) : null}
                </div>
                <div className="text-right text-xs text-cream/50">
                  <p>
                    Visite:{" "}
                    <span className="text-cream">{stats?.visits ?? 0}</span>
                  </p>
                  <p>
                    Spesa:{" "}
                    <span className="text-gold-300">
                      {formatEuro(stats?.totalCents ?? 0)}
                    </span>
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge tone="gold">Codice: {c.referralCode}</Badge>
                  {referrer ? (
                    <span className="text-[11px] text-cream/40">
                      Invitato da {referrer.name}
                    </span>
                  ) : null}
                  {c.marketingConsent ? (
                    <Badge tone="green">Consenso marketing</Badge>
                  ) : null}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
