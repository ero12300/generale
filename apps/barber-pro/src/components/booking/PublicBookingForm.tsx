"use client";
import { useMemo, useState } from "react";
import type { Service, Staff } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Field, Input, Textarea } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { formatEUR } from "@/lib/utils";
import { Check, ChevronRight, Scissors, User, Calendar, Sparkles, Tag } from "lucide-react";

interface Props {
  shopId: string;
  services: Service[];
  staff: Staff[];
  referralCode?: string;
}

const TIMES = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00"];

export function PublicBookingForm({ shopId, services, staff, referralCode }: Props) {
  const [step, setStep] = useState(1);
  const [serviceId, setServiceId] = useState<string>(services[0]?.id ?? "");
  const [staffId, setStaffId] = useState<string>(staff[0]?.id ?? "");
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState<string>("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [coupon, setCoupon] = useState("");
  const [refCode, setRefCode] = useState(referralCode ?? "");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<null | { id: string }>(null);
  const { push } = useToast();

  const service = useMemo(() => services.find((s) => s.id === serviceId), [services, serviceId]);
  const staffMember = useMemo(() => staff.find((s) => s.id === staffId), [staff, staffId]);

  async function submit() {
    if (!service || !time) return;
    setLoading(true);
    try {
      const res = await fetch("/api/public/bookings", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          shopId,
          serviceId,
          staffId,
          startAt: new Date(`${date}T${time}:00`).toISOString(),
          client: { name, phone, email, notes },
          couponCode: coupon.trim() || undefined,
          referralCode: refCode.trim() || undefined,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = (await res.json()) as { booking: { id: string } };
      setDone({ id: data.booking.id });
      push({ kind: "success", title: "Prenotazione confermata!" });
    } catch (err) {
      push({ kind: "error", title: "Errore", description: err instanceof Error ? err.message : "" });
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="glass rounded-2xl p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#e5cd8b] to-[#a8853a] grid place-items-center text-ink-950 mx-auto mb-4">
          <Check className="w-8 h-8" strokeWidth={3} />
        </div>
        <h2 className="font-display text-3xl">Prenotazione confermata!</h2>
        <p className="text-ink-400 mt-2 max-w-md mx-auto">
          Ci vediamo il <strong className="text-ink-100">{date}</strong> alle <strong className="text-ink-100">{time}</strong> con <strong className="text-ink-100">{staffMember?.name}</strong>.
        </p>
        {refCode ? (
          <div className="mt-6 glass rounded-lg p-3 text-sm inline-flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[color:var(--color-gold-400)]" />
            Codice referral applicato: <span className="font-mono text-[color:var(--color-gold-300)]">{refCode}</span>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Steps step={step} />

      {step === 1 ? (
        <div className="glass rounded-2xl p-5">
          <div className="text-sm text-ink-400 mb-3 flex items-center gap-2"><Scissors className="w-4 h-4" /> Scegli il servizio</div>
          <div className="grid sm:grid-cols-2 gap-2">
            {services.map((s) => (
              <button
                key={s.id}
                onClick={() => setServiceId(s.id)}
                className={`text-left p-3.5 rounded-xl border transition ${
                  serviceId === s.id
                    ? "border-[color:var(--color-gold-500)] bg-[color:var(--color-gold-500)]/10"
                    : "border-white/10 hover:border-white/20"
                }`}
              >
                <div className="text-sm font-medium">{s.name}</div>
                <div className="text-xs text-ink-400 mt-1 flex items-center gap-2">
                  <span>{formatEUR(s.priceCents / 100)}</span>
                  <span>·</span>
                  <span>{s.durationMin} min</span>
                </div>
              </button>
            ))}
          </div>
          <div className="flex justify-end mt-4">
            <Button disabled={!serviceId} onClick={() => setStep(2)}>Continua<ChevronRight className="w-4 h-4" /></Button>
          </div>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="glass rounded-2xl p-5">
          <div className="text-sm text-ink-400 mb-3 flex items-center gap-2"><User className="w-4 h-4" /> Scegli il barbiere</div>
          <div className="grid sm:grid-cols-3 gap-2">
            {staff.map((s) => (
              <button
                key={s.id}
                onClick={() => setStaffId(s.id)}
                className={`p-3.5 rounded-xl border transition ${
                  staffId === s.id
                    ? "border-[color:var(--color-gold-500)] bg-[color:var(--color-gold-500)]/10"
                    : "border-white/10 hover:border-white/20"
                }`}
              >
                <div className="w-10 h-10 rounded-full mx-auto grid place-items-center border" style={{ borderColor: `${s.color}66`, background: `${s.color}22` }}>
                  <User className="w-4 h-4" style={{ color: s.color }} />
                </div>
                <div className="text-sm mt-2">{s.name}</div>
                <div className="text-xs text-ink-500">{s.role ?? "Barbiere"}</div>
              </button>
            ))}
          </div>
          <div className="flex justify-between mt-4">
            <Button variant="ghost" onClick={() => setStep(1)}>Indietro</Button>
            <Button disabled={!staffId} onClick={() => setStep(3)}>Continua<ChevronRight className="w-4 h-4" /></Button>
          </div>
        </div>
      ) : null}

      {step === 3 ? (
        <div className="glass rounded-2xl p-5">
          <div className="text-sm text-ink-400 mb-3 flex items-center gap-2"><Calendar className="w-4 h-4" /> Scegli data e ora</div>
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Data">
              <Input type="date" value={date} min={new Date().toISOString().slice(0, 10)} onChange={(e) => setDate(e.target.value)} />
            </Field>
            <Field label="Ora">
              <div className="grid grid-cols-5 gap-1.5">
                {TIMES.map((t) => (
                  <button
                    type="button"
                    key={t}
                    onClick={() => setTime(t)}
                    className={`text-xs py-2 rounded-md border ${
                      time === t
                        ? "border-[color:var(--color-gold-500)] bg-[color:var(--color-gold-500)]/10 text-[color:var(--color-gold-300)]"
                        : "border-white/10 text-ink-300 hover:border-white/20"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </Field>
          </div>
          <div className="flex justify-between mt-4">
            <Button variant="ghost" onClick={() => setStep(2)}>Indietro</Button>
            <Button disabled={!time} onClick={() => setStep(4)}>Continua<ChevronRight className="w-4 h-4" /></Button>
          </div>
        </div>
      ) : null}

      {step === 4 ? (
        <div className="glass rounded-2xl p-5 space-y-4">
          <div className="text-sm text-ink-400 flex items-center gap-2"><User className="w-4 h-4" /> I tuoi dati</div>
          <Field label="Nome completo">
            <Input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Mario Rossi" />
          </Field>
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Telefono">
              <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+39 333 123 4567" />
            </Field>
            <Field label="Email (opzionale)">
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="mario@example.com" />
            </Field>
          </div>
          <Field label="Note (opzionale)">
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Es. preferenze taglio, allergie…" />
          </Field>
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Codice sconto">
              <div className="relative">
                <Tag className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-500" />
                <Input className="pl-9" value={coupon} onChange={(e) => setCoupon(e.target.value.toUpperCase())} placeholder="BENVENUTO10" />
              </div>
            </Field>
            <Field label="Codice referral (porta un amico)">
              <div className="relative">
                <Sparkles className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-500" />
                <Input className="pl-9" value={refCode} onChange={(e) => setRefCode(e.target.value.toUpperCase())} placeholder="ANDRE12AB" />
              </div>
            </Field>
          </div>

          <div className="glass rounded-xl p-3.5 text-sm">
            <div className="text-xs uppercase tracking-wider text-ink-500 mb-1">Riepilogo</div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-ink-100">{service?.name}</div>
                <div className="text-xs text-ink-400">
                  {date} · {time} · con {staffMember?.name}
                </div>
              </div>
              <div className="font-medium">{service ? formatEUR(service.priceCents / 100) : ""}</div>
            </div>
          </div>

          <div className="flex justify-between">
            <Button variant="ghost" onClick={() => setStep(3)}>Indietro</Button>
            <Button onClick={submit} loading={loading} disabled={!name}>
              Conferma prenotazione
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Steps({ step }: { step: number }) {
  const items = [
    { n: 1, l: "Servizio" },
    { n: 2, l: "Barbiere" },
    { n: 3, l: "Data & ora" },
    { n: 4, l: "Contatti" },
  ];
  return (
    <div className="flex items-center gap-2 text-xs">
      {items.map((it, i) => (
        <div key={it.n} className="flex items-center gap-2">
          <div
            className={`w-6 h-6 rounded-full grid place-items-center text-[11px] font-medium border ${
              step === it.n
                ? "bg-[color:var(--color-gold-500)] text-ink-950 border-[color:var(--color-gold-500)]"
                : step > it.n
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                  : "text-ink-500 border-white/10"
            }`}
          >
            {step > it.n ? <Check className="w-3 h-3" /> : it.n}
          </div>
          <span className={step === it.n ? "text-ink-100" : "text-ink-500"}>{it.l}</span>
          {i < items.length - 1 ? <div className="w-6 h-px bg-white/10 mx-1" /> : null}
        </div>
      ))}
    </div>
  );
}
