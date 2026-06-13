"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SignupForm() {
  const router = useRouter();
  const [orgName, setOrgName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isSupabaseConfigured()) {
    return (
      <Card>
        <CardHeader>
          <p className="text-sm text-zinc-400">
            Registrazione disponibile con Supabase configurato. Usa la{" "}
            <button
              type="button"
              className="text-emerald-400 hover:underline"
              onClick={() => router.push("/login")}
            >
              modalità demo
            </button>
            .
          </p>
        </CardHeader>
      </Card>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { org_name: orgName },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
    setTimeout(() => router.push("/app/dashboard"), 1500);
  }

  if (success) {
    return (
      <Card className="border-emerald-500/30">
        <CardHeader>
          <CardTitle className="text-base text-emerald-400">Account creato!</CardTitle>
          <p className="text-sm text-zinc-400 mt-2">Reindirizzamento alla dashboard...</p>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="org">Nome locale / attività</Label>
            <Input
              id="org"
              required
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              placeholder="Es. Pizzeria La Lumachina"
              className="mt-1"
            />
          </div>
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
            <Label htmlFor="password">Password (min. 8 caratteri)</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
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
            {loading ? "Registrazione..." : "Crea account"}
          </Button>
        </form>
      </CardHeader>
    </Card>
  );
}
