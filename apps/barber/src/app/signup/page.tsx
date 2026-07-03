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

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    shopName: "",
    email: "",
    password: "",
  });
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
      const { createUserWithEmailAndPassword } = await import("firebase/auth");
      const { getFirebaseAuth } = await import("@/lib/firebase/client");
      const auth = getFirebaseAuth();
      if (!auth) throw new Error("Firebase non configurato");
      await createUserWithEmailAndPassword(auth, form.email, form.password);
      router.push("/dashboard");
    } catch {
      setError("Errore durante la registrazione. In modalità demo, registrati senza Firebase.");
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
          <CardTitle className="text-2xl">Crea il tuo account</CardTitle>
          <p className="text-sm text-cream/50 mt-2">Inizia gratis, nessuna carta richiesta</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
            <div>
              <Label htmlFor="shopName">Nome del Salone</Label>
              <Input
                id="shopName"
                value={form.shopName}
                onChange={(e) => setForm({ ...form, shopName: e.target.value })}
                placeholder="Il Mio Barber Shop"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="tu@barberia.it"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                minLength={6}
              />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creazione account..." : "Crea Account Gratuito"}
            </Button>
          </form>
          <p className="text-center text-sm text-cream/50 mt-6">
            Hai già un account?{" "}
            <Link href="/login" className="text-gold hover:underline">
              Accedi
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
