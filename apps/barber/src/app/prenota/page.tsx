import Link from "next/link";
import { Scissors } from "lucide-react";
import { getStore } from "@/lib/store";
import { planAllows } from "@/lib/plans";
import { formatEuro } from "@/lib/money";
import { BookingForm } from "@/components/forms/BookingForm";

export const dynamic = "force-dynamic";

export default async function PrenotaPage() {
  const store = await getStore();
  const [shop, services] = await Promise.all([
    store.getShop(),
    store.listServices(),
  ]);
  const onlineEnabled = planAllows(shop.plan, "onlineBooking");

  return (
    <div className="texture min-h-screen">
      <header className="mx-auto flex max-w-3xl items-center justify-between px-6 py-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/50 bg-gold/10">
            <Scissors className="h-4 w-4 text-gold-bright" aria-hidden />
          </span>
          <span className="font-display text-xl tracking-wide text-cream">
            {shop.name}
          </span>
        </Link>
      </header>

      <main className="mx-auto max-w-3xl px-6 pb-20">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-gold">
            Prenotazione online
          </p>
          <h1 className="mt-3 font-display text-4xl text-cream">
            Riserva la tua poltrona
          </h1>
          <p className="mt-3 text-muted">
            Scegli servizio, giorno e orario: ci pensiamo noi al resto.
          </p>
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl border border-line bg-panel p-6">
            <h2 className="font-display text-lg text-cream">I nostri servizi</h2>
            <ul className="mt-4 divide-y divide-line">
              {services.map((s) => (
                <li key={s.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm text-cream">{s.name}</p>
                    <p className="text-xs text-muted">{s.durationMin} minuti</p>
                  </div>
                  <span className="font-display text-gold-bright">
                    {formatEuro(s.priceCents)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="gold-ring rounded-2xl border border-gold/40 bg-panel p-6">
            <h2 className="font-display text-lg text-cream">Prenota ora</h2>
            {onlineEnabled ? (
              <div className="mt-4">
                <BookingForm services={services} variant="online" />
              </div>
            ) : (
              <p className="mt-4 rounded-lg border border-line bg-panel-2 px-4 py-3 text-sm text-muted">
                La prenotazione online non è al momento attiva. Chiamaci per
                fissare il tuo appuntamento!
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
