"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, PlayCircle, Loader2 } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useToast } from "@/components/ui/Toast";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading, firebaseEnabled, signInDemo, signInEmail, registerEmail } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) router.replace("/dashboard");
  }, [user, loading, router]);

  const handleDemo = () => {
    signInDemo();
    toast("Benvenuto nella demo di BarberPro", "success");
    router.push("/dashboard");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "register") {
        await registerEmail(email, password);
        toast("Account creato con successo", "success");
      } else {
        await signInEmail(email, password);
        toast("Accesso effettuato", "success");
      }
      router.push("/dashboard");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Errore di autenticazione", "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Colonna sinistra: brand */}
      <div className="relative hidden flex-col justify-between overflow-hidden border-r border-ink-line bg-ink-soft p-12 lg:flex">
        <Link href="/">
          <Logo />
        </Link>
        <div>
          <h2 className="font-display text-4xl leading-tight text-cream">
            Gestisci il salone
            <br />
            <span className="bg-gold-gradient bg-clip-text text-transparent">come un professionista.</span>
          </h2>
          <p className="mt-4 max-w-sm text-cream/55">
            Prenotazioni, clienti, incassi e campagne: tutto in un&apos;unica dashboard elegante.
          </p>
        </div>
        <p className="text-xs text-cream/35">© {new Date().getFullYear()} BarberPro</p>
      </div>

      {/* Colonna destra: form */}
      <div className="flex flex-col items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Link href="/">
              <Logo />
            </Link>
          </div>

          <h1 className="font-display text-3xl text-cream">
            {mode === "login" ? "Bentornato" : "Crea il tuo salone"}
          </h1>
          <p className="mt-2 text-sm text-cream/50">
            Prova subito senza registrazione con la modalità demo.
          </p>

          <button onClick={handleDemo} className="btn-gold mt-6 w-full">
            <PlayCircle className="h-4 w-4" /> Entra in modalità demo
          </button>

          <div className="my-6 flex items-center gap-4 text-xs uppercase tracking-widest text-cream/30">
            <span className="h-px flex-1 bg-ink-line" /> oppure <span className="h-px flex-1 bg-ink-line" />
          </div>

          {firebaseEnabled ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label" htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="field"
                  placeholder="tu@salone.it"
                />
              </div>
              <div>
                <label className="label" htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="field"
                  placeholder="••••••••"
                />
              </div>
              <button type="submit" disabled={busy} className="btn-outline-gold w-full">
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                {mode === "login" ? "Accedi" : "Registrati"}
              </button>
              <p className="text-center text-sm text-cream/50">
                {mode === "login" ? "Non hai un account?" : "Hai già un account?"}{" "}
                <button
                  type="button"
                  onClick={() => setMode(mode === "login" ? "register" : "login")}
                  className="font-medium text-gold-soft hover:underline"
                >
                  {mode === "login" ? "Registrati" : "Accedi"}
                </button>
              </p>
            </form>
          ) : (
            <p className="rounded-xl border border-ink-line bg-ink-soft p-4 text-center text-xs text-cream/50">
              Login email/password disponibile dopo aver configurato Firebase.
              Per ora usa la <span className="text-gold-soft">modalità demo</span> qui sopra.
            </p>
          )}

          <p className="mt-8 text-center text-xs text-cream/35">
            <Link href="/" className="hover:text-gold-soft">← Torna alla home</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
