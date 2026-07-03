"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toaster";
import { isFirebaseEnabled, getFirebase } from "@/lib/firebase/client";
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

type Mode = "login" | "signup";

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const [loading, setLoading] = React.useState<null | "google" | "email">(null);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const isDemo = !isFirebaseEnabled();

  async function handleGoogle() {
    if (isDemo) {
      toast({
        title: "Modalità demo",
        description: "Firebase non configurato. Ti porto direttamente al gestionale.",
        variant: "info",
      });
      router.push("/dashboard");
      return;
    }
    setLoading("google");
    try {
      const fb = getFirebase()!;
      await signInWithPopup(fb.auth, new GoogleAuthProvider());
      router.push("/dashboard");
    } catch (err) {
      toast({
        title: "Errore",
        description: (err as Error).message,
        variant: "error",
      });
    } finally {
      setLoading(null);
    }
  }

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    if (isDemo) {
      toast({
        title: "Modalità demo attiva",
        description: "Salto l'autenticazione — entra pure e prova tutto.",
        variant: "info",
      });
      router.push("/dashboard");
      return;
    }
    setLoading("email");
    try {
      const fb = getFirebase()!;
      if (mode === "signup") {
        await createUserWithEmailAndPassword(fb.auth, email, password);
      } else {
        await signInWithEmailAndPassword(fb.auth, email, password);
      }
      router.push("/dashboard");
    } catch (err) {
      toast({
        title: "Errore autenticazione",
        description: (err as Error).message,
        variant: "error",
      });
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="space-y-4">
      {isDemo && (
        <div className="rounded-lg border border-[color:var(--color-gold-500)]/30 bg-[color:var(--color-gold-500)]/5 p-4 text-sm text-ink-200">
          <div className="font-medium text-[color:var(--color-gold-300)] mb-1">
            Stai provando la modalità demo
          </div>
          <p className="text-xs text-ink-400">
            Puoi entrare senza registrarti. Per abilitare la vera
            autenticazione, configura le variabili Firebase (vedi{" "}
            <code className="text-[color:var(--color-gold-300)]">
              .env.example
            </code>
            ).
          </p>
        </div>
      )}

      <Button
        onClick={handleGoogle}
        disabled={loading !== null}
        variant="secondary"
        size="lg"
        className="w-full"
      >
        {loading === "google" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <GoogleIcon className="h-4 w-4" />
        )}
        Continua con Google
      </Button>

      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/5" />
        </div>
        <div className="relative flex justify-center text-xs uppercase tracking-widest">
          <span className="bg-[color:var(--color-ink-950)] px-3 text-ink-500">
            oppure
          </span>
        </div>
      </div>

      <form onSubmit={handleEmail} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="tu@barbershop.it"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required={!isDemo}
            autoComplete="email"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required={!isDemo}
            minLength={mode === "signup" ? 8 : undefined}
            autoComplete={
              mode === "signup" ? "new-password" : "current-password"
            }
          />
        </div>
        <Button
          type="submit"
          disabled={loading !== null}
          size="lg"
          className="w-full"
        >
          {loading === "email" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : mode === "signup" ? (
            "Crea account e inizia"
          ) : (
            "Accedi"
          )}
        </Button>
      </form>

      <div className="text-center text-sm text-ink-400 pt-2">
        {mode === "login" ? (
          <>
            Non hai un account?{" "}
            <Link
              href="/registrati"
              className="text-[color:var(--color-gold-300)] hover:underline"
            >
              Registrati
            </Link>
          </>
        ) : (
          <>
            Hai già un account?{" "}
            <Link
              href="/accedi"
              className="text-[color:var(--color-gold-300)] hover:underline"
            >
              Accedi
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.24 1.4-1.68 4.1-5.5 4.1-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.7 3.4 14.6 2.4 12 2.4 6.7 2.4 2.4 6.7 2.4 12s4.3 9.6 9.6 9.6c5.6 0 9.3-3.9 9.3-9.4 0-.6-.1-1.1-.2-1.6H12z"
      />
    </svg>
  );
}
