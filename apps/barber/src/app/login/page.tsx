"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Scissors, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/components/ui/toast";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageInner />
    </Suspense>
  );
}

function LoginPageInner() {
  const router = useRouter();
  const params = useSearchParams();
  const { signIn, signInDemo, isDemo } = useAuth();
  const { push } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const redirect = params.get("redirect") ?? "/dashboard";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signIn(email, password);
      push("Bentornato!", "success");
      router.push(redirect);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Errore accesso";
      setError(msg);
      push(msg, "error");
    } finally {
      setLoading(false);
    }
  }

  async function onDemo() {
    setLoading(true);
    try {
      await signInDemo();
      push("Accesso demo attivato", "success");
      router.push(redirect);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <aside className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-ink-900 via-ink-950 to-ink-900 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-20 h-[300px] w-[300px] rounded-full bg-gold-500/10 blur-[100px]" />
          <div className="absolute bottom-20 right-20 h-[200px] w-[200px] rounded-full bg-gold-400/5 blur-[80px]" />
        </div>
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-gold-300 to-gold-500 text-ink-950">
            <Scissors className="h-4.5 w-4.5" strokeWidth={2.5} />
          </span>
          <span className="font-display text-xl tracking-tight text-ink-50">Filo<span className="text-gold-300">.</span></span>
        </Link>
        <div>
          <blockquote className="font-display text-3xl leading-snug text-ink-100 tracking-tight">
            "In 3 mesi ho portato Filo nel mio salone.
            <br />
            <span className="gradient-text italic">+32% di fatturato.</span>
            <br />
            E finalmente dormo la sera."
          </blockquote>
          <p className="mt-6 text-sm text-ink-400 uppercase tracking-widest">
            — Antonio, Filo Barber Studio Milano
          </p>
        </div>
        <div className="text-xs text-ink-500 flex items-center gap-2">
          <Sparkles className="h-3 w-3" />
          Suite premium per barber shop moderni
        </div>
      </aside>

      <main className="flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-gold-300 to-gold-500 text-ink-950">
              <Scissors className="h-4.5 w-4.5" strokeWidth={2.5} />
            </span>
            <span className="font-display text-xl tracking-tight text-ink-50">Filo<span className="text-gold-300">.</span></span>
          </div>
          <h1 className="font-display text-4xl text-ink-50 tracking-tight">Bentornato.</h1>
          <p className="mt-2 text-ink-300">Accedi al tuo salone digitale.</p>

          {isDemo && (
            <div className="mt-6 rounded-xl border border-gold-400/20 bg-gold-400/5 p-4 text-sm text-gold-100">
              <div className="font-medium mb-1">Modalità demo attiva</div>
              <p className="text-gold-200/80 text-xs">Firebase non configurato: l'app usa un archivio locale. Dati e sessione salvati nel tuo browser.</p>
            </div>
          )}

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="mario@barbieria.it"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            {error && (
              <div className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg p-2.5">
                {error}
              </div>
            )}
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? "Accesso…" : (<>Accedi <ArrowRight className="h-4 w-4" /></>)}
            </Button>
          </form>

          <div className="mt-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/5" />
            <span className="text-xs text-ink-400 uppercase tracking-widest">oppure</span>
            <div className="h-px flex-1 bg-white/5" />
          </div>

          <Button
            type="button"
            variant="secondary"
            className="w-full mt-6"
            size="lg"
            onClick={onDemo}
            disabled={loading}
          >
            <Sparkles className="h-4 w-4" />
            Entra come demo
          </Button>

          <p className="mt-8 text-center text-sm text-ink-400">
            Non hai un account?{" "}
            <Link href="/signup" className="text-gold-300 hover:text-gold-200 font-medium">
              Registrati
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
