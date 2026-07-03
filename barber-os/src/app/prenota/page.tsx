import Link from "next/link";
import { BookingForm } from "@/components/booking-form";

export const metadata = {
  title: "Prenota — BarberOS",
};

export default function PrenotaPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <Link href="/" className="text-sm text-cream-dim transition hover:text-cream">
        ← Torna alla home
      </Link>
      <h1 className="font-display mt-6 text-4xl font-bold">
        Prenota il tuo <span className="gold-gradient-text">appuntamento</span>
      </h1>
      <p className="mt-3 text-cream-dim">
        Scegli servizio, giorno e orario. Hai un codice sconto o il codice di un amico?
        Inseriscilo e risparmia subito.
      </p>
      <div className="mt-10">
        <BookingForm />
      </div>
    </main>
  );
}
