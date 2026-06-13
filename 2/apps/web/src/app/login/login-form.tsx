"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const areas = [
  { key: "app", label: "Area cliente", href: "/app/dashboard", desc: "Titolare / manager ristorante" },
  { key: "admin", label: "Admin Emotive", href: "/admin/dashboard", desc: "Pannello interno" },
  { key: "sales", label: "Area venditori", href: "/sales/dashboard", desc: "Provvigioni e lead" },
  { key: "referral", label: "Portale referral", href: "/partner/dashboard", desc: "Partner segnalatori" },
];

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/app/dashboard";
  const defaultArea = searchParams.get("area") ?? "app";
  const supabaseReady = isSupabaseConfigured();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    searchParams.get("error") === "auth_callback" ? "Autenticazione non riuscita." : null
  );
  const [showDemo, setShowDemo] = useState(!supabaseReady);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }
    router.push(redirect);
    router.refresh();
  }

  if (showDemo || !supabaseReady) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Modalità demo</CardTitle>
          <p className="text-xs text-zinc-500 mt-1">
            Esplora l&apos;interfaccia con dati di esempio (pizzeria Messina).
          </p>
          <div className="mt-4 space-y-2">
            {areas.map((a) => (
              <button
                key={a.key}
                type="button"
                onClick={() => router.push(a.href)}
                className={`w-full text-left rounded-lg border px-4 py-3 transition-colors ${
                  defaultArea === a.key
                    ? "border-emerald-400 bg-emerald-50"
                    : "border-[var(--border)] hover:bg-stone-50"
                }`}
              >
                <p className="font-medium text-sm">{a.label}</p>
                <p className="text-xs text-zinc-500">{a.desc}</p>
              </button>
            ))}
          </div>
          <Button className="w-full mt-6" onClick={() => router.push("/app/dashboard")}>
            Entra in demo cliente
          </Button>
          {supabaseReady && (
            <button
              type="button"
              className="w-full text-xs text-emerald-700 mt-4 hover:underline"
              onClick={() => setShowDemo(false)}
            >
              Ho un account — accedi con email
            </button>
          )}
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Accedi con email</CardTitle>
        <form onSubmit={handleLogin} className="mt-4 space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1"
            />
          </div>
          {error && (
            <p role="alert" className="text-sm text-red-400">
              {error}
            </p>
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Accesso..." : "Accedi"}
          </Button>
        </form>
        <p className="text-sm text-zinc-500 mt-4 text-center">
          Non hai un account?{" "}
          <Link href="/signup" className="text-emerald-700 hover:underline">
            Registrati
          </Link>
        </p>
        <button
          type="button"
          className="w-full text-xs text-stone-500 mt-2 hover:text-stone-800"
          onClick={() => setShowDemo(true)}
        >
          Oppure prova la demo senza account
        </button>
      </CardHeader>
    </Card>
  );
}
