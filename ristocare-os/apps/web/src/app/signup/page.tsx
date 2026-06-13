"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    if (!supabase) {
      setError("Supabase non configurato");
      setLoading(false);
      return;
    }
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }
    router.push("/app/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#0c0f0e]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-6 w-6 text-emerald-500" />
            <CardTitle>Registrati su RistoCare OS</CardTitle>
          </div>
          <CardDescription>
            Crea il portale digitale del tuo locale. Al primo accesso configuriamo organizzazione e sede.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password (min. 8 caratteri)</Label>
              <Input id="password" type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            {error && <p className="text-sm text-red-400" role="alert">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Registrazione..." : "Crea account"}
            </Button>
          </form>
          <p className="text-sm text-zinc-500 mt-4 text-center">
            Hai già un account?{" "}
            <Link href="/login" className="text-emerald-400 hover:underline">Accedi</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
