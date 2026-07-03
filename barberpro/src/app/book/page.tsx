"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Clock, Scissors, Gift, ArrowRight, CalendarCheck } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { loadLocal, saveLocal } from "@/lib/store/persistence";
import type { WorkspaceData, Service } from "@/lib/types";
import { formatCents, genId } from "@/lib/format";

export default function BookPage() {
  const [data, setData] = useState<WorkspaceData | null>(null);
  const [serviceId, setServiceId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [referral, setReferral] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    const d = loadLocal();
    setData(d);
    const firstActive = d.services.find((s) => s.active);
    if (firstActive) setServiceId(firstActive.id);
  }, []);

  const activeServices = useMemo(
    () => (data?.services ?? []).filter((s) => s.active),
    [data],
  );
  const selected: Service | undefined = activeServices.find((s) => s.id === serviceId);

  const referralClient = useMemo(() => {
    if (!data || !referral.trim()) return undefined;
    return data.clients.find(
      (c) => c.referralCode.toLowerCase() === referral.trim().toLowerCase(),
    );
  }, [data, referral]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data || !selected || !date || !time || !name.trim()) return;
    const start = new Date(`${date}T${time}`);
    const booking = {
      id: genId("bkg"),
      clientName: name.trim(),
      clientPhone: phone.trim() || undefined,
      serviceId: selected.id,
      serviceName: selected.name,
      priceCents: selected.priceCents,
      start: start.toISOString(),
      durationMin: selected.durationMin,
      status: "pending" as const,
      notes: referralClient
        ? `Referral: invitato da ${referralClient.firstName} ${referralClient.lastName} (${referralClient.referralCode})`
        : referral.trim()
          ? `Codice sconto/referral: ${referral.trim()}`
          : undefined,
      source: "public" as const,
      createdAt: new Date().toISOString(),
    };
    const next = { ...data, bookings: [booking, ...data.bookings] };
    saveLocal(next);
    setData(next);
    setDone(true);
  };

  const shopName = data?.settings.shopName ?? "BarberPro";
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="min-h-screen">
      <header className="border-b border-ink-line/60">
        <div className="container-page flex h-16 items-center justify-between">
          <Link href="/"><Logo /></Link>
          <Link href="/login" className="btn-ghost">Area gestionale</Link>
        </div>
      </header>

      <main className="container-page max-w-2xl py-12">
        <div className="text-center">
          <p className="kicker">Prenotazione online</p>
          <h1 className="mt-3 font-display text-4xl text-cream">{shopName}</h1>
          <p className="mt-2 text-cream/55">Scegli il servizio e l&apos;orario. Confermeremo la tua richiesta.</p>
          {data?.settings.address ? (
            <p className="mt-1 text-sm text-cream/40">{data.settings.address}</p>
          ) : null}
        </div>

        {done ? (
          <div className="card mt-10 grid place-items-center gap-4 p-10 text-center animate-fade-up">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-gold-gradient text-ink">
              <CheckCircle2 className="h-8 w-8" />
            </span>
            <h2 className="font-display text-2xl text-cream">Richiesta inviata!</h2>
            <p className="max-w-sm text-cream/60">
              Grazie {name.split(" ")[0]}, la tua prenotazione per <strong className="text-gold-soft">{selected?.name}</strong> è
              stata registrata. Ti contatteremo per la conferma.
            </p>
            <button
              onClick={() => { setDone(false); setName(""); setPhone(""); setReferral(""); setDate(""); setTime(""); }}
              className="btn-outline-gold mt-2"
            >
              Prenota un altro appuntamento
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="card mt-10 space-y-6 p-6 sm:p-8">
            <div>
              <p className="label">Servizio</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {activeServices.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setServiceId(s.id)}
                    className={
                      serviceId === s.id
                        ? "rounded-xl border border-gold/50 bg-gold/5 p-4 text-left transition"
                        : "rounded-xl border border-ink-line bg-ink-soft/40 p-4 text-left transition hover:border-gold/30"
                    }
                  >
                    <div className="flex items-center gap-2">
                      <Scissors className="h-4 w-4 text-gold-soft" />
                      <span className="font-medium text-cream">{s.name}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-sm">
                      <span className="text-gold-soft">{formatCents(s.priceCents)}</span>
                      <span className="flex items-center gap-1 text-cream/50">
                        <Clock className="h-3.5 w-3.5" /> {s.durationMin}′
                      </span>
                    </div>
                  </button>
                ))}
                {activeServices.length === 0 ? (
                  <p className="text-sm text-cream/40">Nessun servizio disponibile al momento.</p>
                ) : null}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="bk-date">Data</label>
                <input id="bk-date" type="date" min={today} value={date} onChange={(e) => setDate(e.target.value)} className="field" required />
              </div>
              <div>
                <label className="label" htmlFor="bk-time">Ora</label>
                <input id="bk-time" type="time" value={time} onChange={(e) => setTime(e.target.value)} className="field" required />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="bk-name">Il tuo nome</label>
                <input id="bk-name" value={name} onChange={(e) => setName(e.target.value)} className="field" placeholder="Nome e cognome" required />
              </div>
              <div>
                <label className="label" htmlFor="bk-phone">Telefono</label>
                <input id="bk-phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="field" placeholder="+39 ..." />
              </div>
            </div>

            <div>
              <label className="label" htmlFor="bk-ref">Codice sconto / porta un amico (facoltativo)</label>
              <input id="bk-ref" value={referral} onChange={(e) => setReferral(e.target.value)} className="field uppercase" placeholder="Es. MARCO2048" />
              {referralClient ? (
                <p className="mt-1.5 flex items-center gap-1.5 text-xs text-emerald-300">
                  <Gift className="h-3.5 w-3.5" /> Codice valido — invitato da {referralClient.firstName} {referralClient.lastName}
                </p>
              ) : null}
            </div>

            <button type="submit" className="btn-gold w-full" disabled={!selected}>
              <CalendarCheck className="h-4 w-4" /> Conferma prenotazione
              {selected ? <span className="opacity-80">· {formatCents(selected.priceCents)}</span> : null}
            </button>
            <p className="text-center text-xs text-cream/35">
              <ArrowRight className="mr-1 inline h-3 w-3" />
              Le prenotazioni appaiono nel gestionale del salone in tempo reale.
            </p>
          </form>
        )}
      </main>
    </div>
  );
}
