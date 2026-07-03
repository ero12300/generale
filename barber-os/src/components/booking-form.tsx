"use client";

import { useEffect, useMemo, useState } from "react";
import { getStore, generateId, generateReferralCode } from "@/lib/store";
import type { Booking, Campaign, Customer, Service, ShopSettings } from "@/lib/types";
import { bookingSchema, formatEuro, todayISO } from "@/lib/types";

type Status = "loading" | "ready" | "submitting" | "success" | "error";

function buildSlots(settings: ShopSettings): string[] {
  const slots: string[] = [];
  for (let h = settings.openingHour; h < settings.closingHour; h++) {
    for (let m = 0; m < 60; m += settings.slotMinutes) {
      slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    }
  }
  return slots;
}

export function BookingForm() {
  const [status, setStatus] = useState<Status>("loading");
  const [services, setServices] = useState<Service[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [settings, setSettings] = useState<ShopSettings | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [confirmed, setConfirmed] = useState<Booking | null>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [date, setDate] = useState(todayISO());
  const [time, setTime] = useState("");
  const [code, setCode] = useState("");

  useEffect(() => {
    const store = getStore();
    Promise.all([
      store.listServices(),
      store.listCampaigns(),
      store.listCustomers(),
      store.listBookings(),
      store.getSettings(),
    ])
      .then(([svc, camp, cust, books, sett]) => {
        setServices(svc);
        setCampaigns(camp);
        setCustomers(cust);
        setBookings(books);
        setSettings(sett);
        if (svc.length > 0) setServiceId(svc[0].id);
        setStatus("ready");
      })
      .catch(() => {
        setErrorMsg("Impossibile caricare i dati. Riprova più tardi.");
        setStatus("error");
      });
  }, []);

  const selectedService = services.find((s) => s.id === serviceId) ?? null;

  const takenSlots = useMemo(
    () =>
      new Set(
        bookings
          .filter((b) => b.date === date && b.status !== "annullata")
          .map((b) => b.time)
      ),
    [bookings, date]
  );

  const allSlots = settings ? buildSlots(settings) : [];

  const matchedDiscount = useMemo(() => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return null;
    const campaign = campaigns.find(
      (c) => c.active && c.code.toUpperCase() === trimmed
    );
    if (campaign) return { pct: campaign.discountPct, label: campaign.name };
    const referrer = customers.find(
      (c) => c.referralCode.toUpperCase() === trimmed
    );
    if (referrer) {
      const referralCampaign = campaigns.find(
        (c) => c.active && c.type === "referral"
      );
      if (referralCampaign) {
        return {
          pct: referralCampaign.discountPct,
          label: `Porta un amico — invitato da ${referrer.name}`,
        };
      }
    }
    return null;
  }, [code, campaigns, customers]);

  const priceCents = selectedService?.priceCents ?? 0;
  const finalPriceCents = matchedDiscount
    ? Math.round((priceCents * (100 - matchedDiscount.pct)) / 100)
    : priceCents;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    const booking: Booking = {
      id: generateId(),
      customerName: name.trim(),
      phone: phone.trim(),
      serviceId,
      date,
      time,
      status: "confermata",
      priceCents,
      discountCode: matchedDiscount ? code.trim().toUpperCase() : null,
      finalPriceCents,
      createdAt: new Date().toISOString(),
    };
    const parsed = bookingSchema.safeParse(booking);
    if (!parsed.success) {
      setErrorMsg(
        parsed.error.issues[0]?.message ?? "Controlla i dati inseriti."
      );
      return;
    }
    if (!time) {
      setErrorMsg("Scegli un orario disponibile.");
      return;
    }
    setStatus("submitting");
    try {
      const store = getStore();
      await store.saveBooking(parsed.data);

      // Registra il cliente in rubrica se non esiste già (match sul telefono)
      const existing = customers.find((c) => c.phone === parsed.data.phone);
      if (!existing) {
        await store.saveCustomer({
          id: generateId(),
          name: parsed.data.customerName,
          phone: parsed.data.phone,
          email: "",
          notes: "",
          createdAt: new Date().toISOString(),
          referralCode: generateReferralCode(parsed.data.customerName),
          referredBy: matchedDiscount ? code.trim().toUpperCase() : null,
        });
      }

      // Incrementa il contatore usi della campagna
      const trimmed = code.trim().toUpperCase();
      const campaign = campaigns.find(
        (c) => c.active && c.code.toUpperCase() === trimmed
      );
      if (campaign) {
        await store.saveCampaign({ ...campaign, uses: campaign.uses + 1 });
      }

      setConfirmed(parsed.data);
      setStatus("success");
    } catch {
      setErrorMsg("Errore durante il salvataggio. Riprova.");
      setStatus("ready");
    }
  }

  if (status === "loading") {
    return (
      <div className="card animate-pulse text-center text-cream-dim">
        Caricamento disponibilità…
      </div>
    );
  }

  if (status === "error" && services.length === 0) {
    return <div className="card border-red-500/40 text-red-300">{errorMsg}</div>;
  }

  if (status === "success" && confirmed) {
    const svc = services.find((s) => s.id === confirmed.serviceId);
    return (
      <div className="card border-gold/50 text-center">
        <span aria-hidden className="text-5xl">✅</span>
        <h2 className="font-display mt-4 text-2xl font-bold">Prenotazione confermata!</h2>
        <p className="mt-3 text-cream-dim">
          {confirmed.customerName}, ti aspettiamo il{" "}
          <strong className="text-cream">
            {new Date(confirmed.date + "T00:00:00").toLocaleDateString("it-IT", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </strong>{" "}
          alle <strong className="text-cream">{confirmed.time}</strong> per{" "}
          <strong className="text-cream">{svc?.name}</strong>.
        </p>
        <p className="mt-2 text-lg font-bold text-gold">
          Totale: {formatEuro(confirmed.finalPriceCents)}
          {confirmed.discountCode && (
            <span className="ml-2 text-sm font-normal text-cream-dim">
              (codice {confirmed.discountCode} applicato)
            </span>
          )}
        </p>
        <button
          type="button"
          className="btn-outline mt-6"
          onClick={() => {
            setConfirmed(null);
            setName("");
            setPhone("");
            setTime("");
            setCode("");
            setStatus("ready");
            getStore().listBookings().then(setBookings);
          }}
        >
          Nuova prenotazione
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-6" aria-label="Modulo di prenotazione">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="nome" className="label">Nome e cognome</label>
          <input
            id="nome"
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Mario Rossi"
            required
          />
        </div>
        <div>
          <label htmlFor="telefono" className="label">Telefono</label>
          <input
            id="telefono"
            type="tel"
            className="input"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="333 1234567"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="servizio" className="label">Servizio</label>
        <select
          id="servizio"
          className="input"
          value={serviceId}
          onChange={(e) => setServiceId(e.target.value)}
        >
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} — {formatEuro(s.priceCents)} ({s.durationMin} min)
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="data" className="label">Giorno</label>
        <input
          id="data"
          type="date"
          className="input"
          value={date}
          min={todayISO()}
          onChange={(e) => {
            setDate(e.target.value);
            setTime("");
          }}
          required
        />
      </div>

      <fieldset>
        <legend className="label">Orario disponibile</legend>
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
          {allSlots.map((slot) => {
            const taken = takenSlots.has(slot);
            const selected = time === slot;
            return (
              <button
                key={slot}
                type="button"
                disabled={taken}
                aria-pressed={selected}
                onClick={() => setTime(slot)}
                className={`rounded-lg border px-2 py-2 text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                  taken
                    ? "cursor-not-allowed border-white/5 text-cream-dim/30 line-through"
                    : selected
                      ? "border-gold bg-gold font-bold text-ink"
                      : "border-white/15 text-cream hover:border-gold/60"
                }`}
              >
                {slot}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div>
        <label htmlFor="codice" className="label">
          Codice sconto o codice amico <span className="normal-case">(facoltativo)</span>
        </label>
        <input
          id="codice"
          className="input uppercase"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="BENVENUTO10"
        />
        {code.trim() && (
          <p className={`mt-2 text-sm ${matchedDiscount ? "text-emerald-400" : "text-red-400"}`}>
            {matchedDiscount
              ? `✓ ${matchedDiscount.label}: -${matchedDiscount.pct}%`
              : "Codice non valido o scaduto"}
          </p>
        )}
      </div>

      {selectedService && (
        <div className="flex items-center justify-between rounded-xl border border-gold/30 bg-gold/5 px-4 py-3">
          <span className="text-sm text-cream-dim">Totale da pagare in negozio</span>
          <span className="text-xl font-bold text-gold">
            {matchedDiscount && finalPriceCents !== priceCents ? (
              <>
                <s className="mr-2 text-sm text-cream-dim">{formatEuro(priceCents)}</s>
                {formatEuro(finalPriceCents)}
              </>
            ) : (
              formatEuro(priceCents)
            )}
          </span>
        </div>
      )}

      {errorMsg && (
        <p role="alert" className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {errorMsg}
        </p>
      )}

      <button type="submit" className="btn-gold w-full" disabled={status === "submitting"}>
        {status === "submitting" ? "Invio in corso…" : "Conferma prenotazione"}
      </button>
    </form>
  );
}
