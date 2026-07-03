import Link from "next/link";
import { Scissors, ArrowLeft, CheckCircle2 } from "lucide-react";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata = { title: "Registrati" };

const perks = [
  "Pagina di prenotazione pubblica pronta in 5 minuti",
  "Database clienti + storico visite",
  'Codice referral "porta un amico" incluso',
  "Nessuna carta di credito richiesta",
];

export default function SignupPage() {
  return (
    <main className="min-h-dvh grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden border-r border-white/5">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(201,162,75,0.15),transparent_60%)]"
        />
        <Link href="/" className="relative flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-gradient-to-br from-[color:var(--color-gold-400)] to-[color:var(--color-gold-500)] text-ink-950">
            <Scissors className="h-4 w-4" />
          </span>
          <span className="font-display text-xl text-ink-50">BarberPro</span>
        </Link>

        <div className="relative">
          <h2 className="font-display text-4xl text-ink-50 mb-6 leading-tight">
            Tutto quello che ti serve,
            <br />
            <span className="text-gold-gradient">gratis per iniziare.</span>
          </h2>
          <ul className="space-y-3">
            {perks.map((p) => (
              <li key={p} className="flex items-start gap-3 text-ink-200">
                <CheckCircle2 className="h-5 w-5 text-[color:var(--color-gold-400)] shrink-0 mt-0.5" />
                <span className="text-sm">{p}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative text-xs text-ink-500">
          © {new Date().getFullYear()} BarberPro
        </div>
      </div>

      <div className="flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-ink-400 hover:text-ink-100 mb-8"
          >
            <ArrowLeft className="h-4 w-4" /> Torna alla home
          </Link>

          <h1 className="font-display text-4xl text-ink-50 mb-2">Registrati</h1>
          <p className="text-ink-400 mb-8">
            Crea il tuo barbershop digitale in 30 secondi.
          </p>

          <AuthForm mode="signup" />
        </div>
      </div>
    </main>
  );
}
