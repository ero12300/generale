"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { User, Wrench, Users, Shield } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { DemoRole } from "@/lib/auth/session";

const demoRoles: {
  role: DemoRole;
  title: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
}[] = [
  { role: "customer", title: "Cliente", desc: "Gelateria, ristorante o bar", icon: User, href: "/app/dashboard" },
  { role: "operator", title: "Operatore RistoCare", desc: "Centrale operativa", icon: Shield, href: "/admin/dashboard" },
  { role: "technician", title: "Tecnico partner", desc: "Interventi assegnati", icon: Wrench, href: "/tech/tickets" },
  { role: "referral", title: "Partner referral", desc: "Lead segnalati", icon: Users, href: "/referral/dashboard" },
];

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/app/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    searchParams.get("error") === "auth_callback" ? "Autenticazione non riuscita." : null
  );
  const supabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    if (!supabase) {
      setError("Supabase non configurato");
      setLoading(false);
      return;
    }
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }
    router.push(redirect);
    router.refresh();
  }

  async function enterDemo(role: DemoRole, href: string) {
    await fetch("/api/auth/demo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    router.push(href);
    router.refresh();
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 mesh-grid pointer-events-none opacity-60" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-emerald-500/10 rounded-full blur-[100px]" />

      <div className="relative mb-10 text-center animate-fade-up">
        <Link href="/" className="inline-block">
          <Logo size="lg" className="justify-center" />
        </Link>
        <p className="text-zinc-500 text-sm mt-6">Accedi al portale o prova la demo interattiva</p>
      </div>

      {supabaseConfigured && (
        <Card className="relative w-full max-w-md mb-8 glass-panel glow-emerald animate-fade-up animate-fade-up-delay-1">
          <CardHeader>
            <CardTitle className="font-display text-xl">Accedi con email</CardTitle>
            <CardDescription>Portale cliente e operatore RistoCare</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && (
                <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2" role="alert">
                  {error}
                </p>
              )}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Accesso..." : "Accedi"}
              </Button>
            </form>
            <p className="text-sm text-zinc-500 mt-4 text-center">
              Non hai un account?{" "}
              <Link href="/signup" className="text-emerald-400 hover:underline">
                Registrati
              </Link>
            </p>
          </CardContent>
        </Card>
      )}

      <p className="relative text-[10px] text-zinc-600 mb-4 uppercase tracking-[0.25em] font-medium">
        Modalità demo
      </p>
      <div className="relative grid sm:grid-cols-2 gap-4 w-full max-w-2xl animate-fade-up animate-fade-up-delay-2">
        {demoRoles.map(({ role, title, desc, icon: Icon, href }) => (
          <Card key={role} className="border-white/5 hover:border-emerald-500/25 transition-all duration-300 group">
            <CardHeader>
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/15 group-hover:bg-emerald-500/15 transition-colors">
                <Icon className="h-5 w-5 text-emerald-400" />
              </div>
              <CardTitle className="text-base">{title}</CardTitle>
              <CardDescription>{desc}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="secondary" onClick={() => enterDemo(role, href)}>
                Entra in demo
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
