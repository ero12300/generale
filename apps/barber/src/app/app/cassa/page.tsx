"use client";

import { Download, PlusCircle } from "lucide-react";
import { useMemo, useState } from "react";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Field,
  Input,
  SectionHeading,
  Select,
  Spinner,
} from "@/components/ui";
import { computeRevenueKpi, toIsoDate } from "@/lib/logic";
import { formatEuro } from "@/lib/money";
import { useStore } from "@/lib/store/provider";
import { PLANS } from "@/lib/types";
import { saleInputSchema } from "@/lib/validation";

export default function CassaPage() {
  const { state, loading, addSale } = useStore();
  const [date, setDate] = useState(() => toIsoDate(new Date()));
  const [serviceName, setServiceName] = useState("");
  const [barberId, setBarberId] = useState("");
  const [amountInput, setAmountInput] = useState("");
  const [method, setMethod] = useState("contanti");
  const [customerId, setCustomerId] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const daySales = useMemo(() => {
    if (!state) return [];
    return state.sales
      .filter((s) => s.date === date)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [state, date]);

  const kpi = useMemo(() => computeRevenueKpi(daySales), [daySales]);

  if (loading || !state) return <Spinner label="Apro la cassa…" />;

  const plan = PLANS[state.settings.plan];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    setFeedback(null);
    const parsed = saleInputSchema.safeParse({
      serviceName,
      barberId,
      amountInput,
      method,
      customerId,
      date,
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
    const result = addSale(parsed.data);
    if (!result.ok) {
      setSubmitError(result.error);
      return;
    }
    setFeedback(
      `Incasso di ${formatEuro(result.data.amountCents)} registrato.`,
    );
    setServiceName("");
    setAmountInput("");
    setCustomerId("");
  }

  function exportCsv() {
    if (!state) return;
    const header = "data;servizio;barbiere;cliente;importo_eur;metodo\n";
    const rows = state.sales
      .slice()
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((s) =>
        [
          s.date,
          s.serviceName,
          s.barberName,
          s.customerName ?? "",
          (s.amountCents / 100).toFixed(2).replace(".", ","),
          s.method,
        ].join(";"),
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `incassi-${toIsoDate(new Date())}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Cassa"
        title="Registro incassi"
        subtitle="Registra i pagamenti al volo, anche senza prenotazione. Gli appuntamenti chiusi in agenda finiscono qui automaticamente."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="space-y-1">
          <p className="text-xs uppercase tracking-widest text-cream/40">
            Totale del giorno
          </p>
          <p className="font-display text-3xl text-gold-300">
            {formatEuro(kpi.totalCents)}
          </p>
        </Card>
        <Card className="space-y-1">
          <p className="text-xs uppercase tracking-widest text-cream/40">
            Servizi
          </p>
          <p className="font-display text-3xl text-cream">{kpi.count}</p>
        </Card>
        <Card className="space-y-1">
          <p className="text-xs uppercase tracking-widest text-cream/40">
            Ticket medio
          </p>
          <p className="font-display text-3xl text-cream">
            {formatEuro(kpi.averageTicketCents)}
          </p>
        </Card>
      </div>

      <Card>
        <h3 className="font-display mb-4 text-lg text-cream">Nuovo incasso</h3>
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <Field label="Servizio / descrizione" htmlFor="sale-service" error={errors.serviceName}>
            <Input
              id="sale-service"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              placeholder="Es. Taglio Classico"
              list="service-suggestions"
            />
            <datalist id="service-suggestions">
              {state.services.map((s) => (
                <option key={s.id} value={s.name} />
              ))}
            </datalist>
          </Field>
          <Field label="Importo (€)" htmlFor="sale-amount" error={errors.amountInput}>
            <Input
              id="sale-amount"
              value={amountInput}
              onChange={(e) => setAmountInput(e.target.value)}
              placeholder="Es. 25 oppure 24,50"
              inputMode="decimal"
            />
          </Field>
          <Field label="Barbiere" htmlFor="sale-barber" error={errors.barberId}>
            <Select
              id="sale-barber"
              value={barberId}
              onChange={(e) => setBarberId(e.target.value)}
            >
              <option value="">Scegli…</option>
              {state.barbers
                .filter((b) => b.active)
                .map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
            </Select>
          </Field>
          <Field label="Metodo di pagamento" htmlFor="sale-method">
            <Select
              id="sale-method"
              value={method}
              onChange={(e) => setMethod(e.target.value)}
            >
              <option value="contanti">Contanti</option>
              <option value="carta">Carta</option>
              <option value="satispay">Satispay</option>
              <option value="altro">Altro</option>
            </Select>
          </Field>
          <Field label="Cliente (facoltativo)" htmlFor="sale-customer">
            <Select
              id="sale-customer"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
            >
              <option value="">Cliente di passaggio</option>
              {state.customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Data" htmlFor="sale-date">
            <Input
              id="sale-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </Field>
          {submitError ? (
            <p role="alert" className="text-sm text-red-300 md:col-span-2">
              {submitError}
            </p>
          ) : null}
          {feedback ? (
            <p className="text-sm text-emerald-300 md:col-span-2">{feedback}</p>
          ) : null}
          <div className="md:col-span-2">
            <Button type="submit">
              <PlusCircle className="h-4 w-4" aria-hidden /> Registra incasso
            </Button>
          </div>
        </form>
      </Card>

      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg text-cream">
          Movimenti del {date}
        </h3>
        {plan.csvExport ? (
          <Button variant="outline" onClick={exportCsv}>
            <Download className="h-4 w-4" aria-hidden /> Export CSV
          </Button>
        ) : (
          <Badge tone="neutral">Export CSV disponibile nel piano Pro</Badge>
        )}
      </div>

      {daySales.length === 0 ? (
        <EmptyState title="Nessun incasso registrato in questa data" />
      ) : (
        <Card className="divide-y divide-white/5 p-0">
          {daySales.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between gap-4 px-6 py-4"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-cream">
                  {s.serviceName}
                </p>
                <p className="text-xs text-cream/50">
                  {s.barberName}
                  {s.customerName ? ` · ${s.customerName}` : ""} ·{" "}
                  <span className="capitalize">{s.method}</span>
                </p>
              </div>
              <p className="font-display shrink-0 text-lg text-gold-300">
                {formatEuro(s.amountCents)}
              </p>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
