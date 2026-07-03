"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Scissors, ArrowRight, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/components/ui/toast";
import { TIER_LIMITS, type SubscriptionTier } from "@/types";

export default function SignupPage() {
  return (
    <Suspense fallback={null}>
      <SignupPageInner />
    </Suspense>
  );
}

function SignupPageInner() {
  const router = useRouter();
  const params = useSearchParams();
  const { signUp, signInDemo, isDemo } = useAuth();
  const { push } = useToast();

  const preselectedTier = (params.get("tier") as SubscriptionTier) ?? "free";
  const [tier, setTier] = useState<SubscriptionTier>(
    TIER_LIMITS[preselectedTier] ? preselectedTier : "free"
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [shop, setShop] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signUp(email, password, name);
      push("Account creato! Benvenuto in Filo.", "success");
      router.push(tier === "free" ? "/dashboard" : `/impostazioni?upgrade=${tier}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Errore creazione account";
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
      push("Demo pronto: esplora la suite completa.", "success");
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-[1.1fr,1fr]">
      <main className="flex items-center justify-center p-6 order-2 lg:order-1">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-2.5">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-gold-300 to-gold-500 text-ink-950">
                <Scissors className="h-4.5 w-4.5" strokeWidth={2.5} />
              </span>
              <span className="font-display text-xl tracking-tight text-ink-50">Filo<span className="text-gold-300">.</span></span>
            </Link>
          </div>
          <h1 className="font-display text-4xl text-ink-50 tracking-tight">
            Crea il tuo <span className="gradient-text italic">salone digitale</span>.
          </h1>
          <p className="mt-2 text-ink-300">Setup in meno di 3 minuti.</p>

          {isDemo && (
            <div className="mt-6 rounded-xl border border-gold-400/20 bg-gold-400/5 p-4 text-sm text-gold-100">
              <div className="font-medium mb-1">Modalità demo attiva</div>
              <p className="text-gold-200/80 text-xs">Firebase non è configurato: l'account viene creato localmente per esplorare la piattaforma.</p>
            </div>
          )}

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <Label htmlFor="name">Come ti chiami?</Label>
              <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Antonio" />
            </div>
            <div>
              <Label htmlFor="shop">Nome del salone</Label>
              <Input id="shop" required value={shop} onChange={(e) => setShop(e.target.value)} placeholder="Filo Barber Studio" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Almeno 6 caratteri" />
            </div>
            <div>
              <Label>Piano scelto</Label>
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(TIER_LIMITS) as SubscriptionTier[]).map((t) => {
                  const p = TIER_LIMITS[t];
                  const isActive = tier === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTier(t)}
                      className={`rounded-lg p-3 border text-left transition-all ${
                        isActive
                          ? "border-gold-400/60 bg-gold-400/10 shadow-[0_0_0_1px_rgba(212,167,44,0.3)]"
                          : "border-white/10 bg-white/5 hover:border-white/20"
                      }`}
                    >
                      <div className={`text-xs uppercase tracking-widest ${isActive ? "text-gold-300" : "text-ink-400"}`}>
                        {p.label}
                      </div>
                      <div className="font-display text-xl text-ink-50 mt-1">
                        {p.priceMonthly === 0 ? "Gratis" : `€${p.priceMonthly}`}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
            {error && (
              <div className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg p-2.5">
                {error}
              </div>
            )}
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? "Creazione…" : (<>Crea account <ArrowRight className="h-4 w-4" /></>)}
            </Button>
          </form>

          <div className="mt-4">
            <Button type="button" variant="ghost" className="w-full" onClick={onDemo} disabled={loading}>
              <Sparkles className="h-4 w-4" /> Entra come demo
            </Button>
          </div>

          <p className="mt-6 text-center text-sm text-ink-400">
            Hai già un account?{" "}
            <Link href="/login" className="text-gold-300 hover:text-gold-200 font-medium">
              Accedi
            </Link>
          </p>
        </div>
      </main>

      <aside className="hidden lg:flex flex-col justify-center p-12 bg-gradient-to-br from-ink-900 via-ink-950 to-ink-900 relative overflow-hidden order-1 lg:order-2">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/3 right-10 h-[400px] w-[400px] rounded-full bg-gold-500/10 blur-[120px]" />
        </div>
        <div className="max-w-md">
          <h2 className="font-display text-4xl text-ink-50 tracking-tight leading-tight">
            Cosa ottieni <span className="gradient-text italic">subito.</span>
          </h2>
          <ul className="mt-8 space-y-4">
            {[
              "Agenda in tempo reale con pagina prenotazione pubblica",
              "Cassa digitale con report incassi giornalieri",
              "CRM clienti con note, preferenze e storico",
              "Campagne sconto e programma porta-un-amico",
              "Backup automatico su cloud Firebase",
              "Nessuna carta richiesta per iniziare",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-ink-100">
                <Check className="h-5 w-5 text-gold-300 mt-0.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
