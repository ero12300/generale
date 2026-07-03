"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Scissors } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isFirebaseConfigured } from "@/lib/firebase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!isFirebaseConfigured()) {
      router.push("/dashboard");
      return;
    }

    try {
      const { signInWithEmailAndPassword } = await import("firebase/auth");
      const { getFirebaseAuth } = await import("@/lib/firebase/client");
      const auth = getFirebaseAuth();
      if (!auth) throw new Error("Firebase non configurato");
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch {
      setError("Credenziali non valide. In modalità demo, accedi senza Firebase.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-charcoal hero-glow p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10 border border-gold/20">
              <Scissors className="h-6 w-6 text-gold" />
            </div>
          </div>
          <CardTitle className="text-2xl">Accedi a BarberPro</CardTitle>
          <p className="text-sm text-cream/50 mt-2">
            {!isFirebaseConfigured() && "Modalità demo — clicca Accedi per entrare"}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@barberia.it"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Accesso..." : "Accedi"}
            </Button>
          </form>
          <p className="text-center text-sm text-cream/50 mt-6">
            Non hai un account?{" "}
            <Link href="/signup" className="text-gold hover:underline">
              Registrati gratis
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
