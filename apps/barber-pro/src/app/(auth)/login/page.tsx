"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { Sparkles } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { signInWithEmail, signInDemo, isDemo } = useAuth();
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
      await signInWithEmail(email.trim(), password);
      push({ kind: "success", title: "Bentornato!" });
      router.push("/dashboard");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Errore accesso";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  async function onDemo() {
    setLoading(true);
    try {
      await signInDemo("Barbiere Demo");
      push({ kind: "success", title: "Sei entrato in modalità demo", description: "Esplora l'app liberamente." });
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-3xl">Bentornato</h2>
        <p className="text-ink-400 text-sm mt-1">Accedi al tuo salone</p>
      </div>

      {isDemo ? (
        <button
          onClick={onDemo}
          disabled={loading}
          className="w-full mb-4 glass gold-ring rounded-xl p-4 text-left hover:brightness-110 transition"
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#e5cd8b] to-[#a8853a] grid place-items-center text-ink-950 shrink-0">
              <Sparkles className="w-4 h-4" strokeWidth={2.5} />
            </div>
            <div>
              <div className="text-sm font-medium text-ink-100">Entra in modalità demo</div>
              <div className="text-xs text-ink-400 mt-0.5">Esplora l'app subito, senza registrarti.</div>
            </div>
          </div>
        </button>
      ) : null}

      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Email" htmlFor="email">
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="mario@salone.it"
          />
        </Field>
        <Field label="Password" htmlFor="pw">
          <Input
            id="pw"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="La tua password"
          />
        </Field>
        {error ? <div className="text-xs text-rose-400">{error}</div> : null}
        <Button type="submit" loading={loading} className="w-full h-12">
          Accedi
        </Button>
      </form>

      <div className="text-sm text-ink-400 mt-6 text-center">
        Non hai un account?{" "}
        <Link href="/signup" className="text-[color:var(--color-gold-400)] hover:underline">
          Registrati
        </Link>
      </div>
    </div>
  );
}
