"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";

export default function SignupPage() {
  const router = useRouter();
  const { signUpWithEmail, signInDemo, isDemo } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { push } = useToast();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isDemo) {
        await signInDemo(name.trim() || "Barbiere");
      } else {
        await signUpWithEmail(email.trim(), password, name.trim());
      }
      push({ kind: "success", title: "Benvenuto in BarberPro!" });
      router.push("/dashboard");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Errore registrazione";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-3xl">Crea il tuo account</h2>
        <p className="text-ink-400 text-sm mt-1">14 giorni Pro gratis, poi Starter senza costi.</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Nome titolare" htmlFor="name">
          <Input
            id="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Mario Rossi"
          />
        </Field>
        <Field label={isDemo ? "Email (opzionale in demo)" : "Email"} htmlFor="email">
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required={!isDemo}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="mario@salone.it"
          />
        </Field>
        {!isDemo ? (
          <Field label="Password" htmlFor="pw" hint="Minimo 8 caratteri">
            <Input
              id="pw"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </Field>
        ) : null}
        {isDemo ? (
          <div className="text-xs text-ink-500 glass rounded-lg p-3 border border-white/5">
            Firebase non è configurato: verrai portato in <span className="text-[color:var(--color-gold-400)]">modalità demo</span> con dati di esempio. Configura Firebase in <code className="text-ink-300">.env.local</code> per attivare account reali.
          </div>
        ) : null}
        {error ? <div className="text-xs text-rose-400">{error}</div> : null}
        <Button type="submit" loading={loading} className="w-full h-12">
          Crea account
        </Button>
      </form>

      <div className="text-sm text-ink-400 mt-6 text-center">
        Hai già un account?{" "}
        <Link href="/login" className="text-[color:var(--color-gold-400)] hover:underline">
          Accedi
        </Link>
      </div>
    </div>
  );
}
