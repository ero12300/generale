"use client";

export const dynamic = "force-dynamic";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { Scissors, Chrome, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { useAuth } from "@/components/providers/auth-provider";
import { useToast } from "@/components/providers/toast-provider";

export default function LoginPageWrapper() {
  return (
    <Suspense fallback={<div className="grid min-h-dvh place-items-center text-white/60">Caricamento…</div>}>
      <LoginPage />
    </Suspense>
  );
}

function LoginPage() {
  const { status, signInEmail, signInGoogle, signInDemo, mode } = useAuth();
  const router = useRouter();
  const search = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (status === "authed") {
      const next = search.get("next") ?? "/app";
      router.replace(next);
    }
  }, [status, router, search]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInEmail(email, password);
      toast.success("Bentornato!");
    } catch (err: any) {
      toast.error("Login fallito", err?.message ?? "Riprova.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-dvh md:grid-cols-2">
      <div className="hidden md:block relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[color:var(--color-ink-900)] via-[color:var(--color-ink-950)] to-black" />
        <div className="absolute -left-32 top-24 h-96 w-96 rounded-full bg-[color:var(--color-gold-400)]/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-[color:var(--color-copper-500)]/15 blur-3xl" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-xl gold-border bg-[color:var(--color-ink-800)]">
              <Scissors className="h-4 w-4 text-[color:var(--color-gold-300)]" />
            </span>
            <div className="leading-tight">
              <div className="font-display text-lg text-white">Rasoio</div>
              <div className="text-[10px] uppercase tracking-widest text-white/40">barber os</div>
            </div>
          </Link>

          <div>
            <div className="max-w-md">
              <div className="text-xs uppercase tracking-widest text-[color:var(--color-gold-200)]">Bentornato</div>
              <h1 className="mt-3 font-display text-4xl text-white leading-tight">
                Un'agenda ordinata è<br />
                <span className="gold-text">un cliente in più al giorno</span>.
              </h1>
              <p className="mt-4 text-white/60">
                Accedi al tuo Rasoio: prenotazioni, incassi, clienti e campagne referral in un colpo d'occhio.
              </p>
            </div>
          </div>

          <div className="text-xs text-white/40">© Rasoio · barber os</div>
        </div>
      </div>

      <div className="relative flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 md:hidden">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl gold-border bg-[color:var(--color-ink-800)]">
                <Scissors className="h-4 w-4 text-[color:var(--color-gold-300)]" />
              </span>
              <div className="font-display text-lg text-white">Rasoio</div>
            </Link>
          </div>
          <h2 className="font-display text-3xl text-white">Accedi</h2>
          <p className="mt-1 text-sm text-white/60">Non hai ancora un account? <Link className="text-[color:var(--color-gold-200)] underline underline-offset-4" href="/signup">Registrati</Link></p>

          <div className="mt-6 space-y-3">
            <Button variant="gold" className="w-full" onClick={async () => {
              setLoading(true);
              try {
                await signInDemo();
                toast.success("Modalità demo attivata");
              } finally { setLoading(false); }
            }} disabled={loading}>
              <Wand2 className="h-4 w-4" />
              Entra in modalità demo
            </Button>
            <Button variant="outline" className="w-full" onClick={async () => {
              setLoading(true);
              try {
                await signInGoogle();
              } catch (err: any) {
                toast.error("Google login non disponibile", err?.message);
              } finally { setLoading(false); }
            }} disabled={loading}>
              <Chrome className="h-4 w-4" />
              Continua con Google
            </Button>
          </div>

          <div className="my-6 flex items-center gap-3 text-xs text-white/40">
            <div className="h-px flex-1 bg-white/10" />
            oppure con email
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <form className="space-y-3" onSubmit={submit}>
            <div>
              <Label>Email</Label>
              <Input type="email" required placeholder="tu@barber.it" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <Label>Password</Label>
              <Input type="password" required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Button type="submit" className="w-full mt-2" disabled={loading}>Accedi</Button>
          </form>

          {mode === "demo" && (
            <p className="mt-4 text-center text-[11px] text-white/40">
              Firebase non è configurato: puoi entrare in demo con qualsiasi email/password.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
