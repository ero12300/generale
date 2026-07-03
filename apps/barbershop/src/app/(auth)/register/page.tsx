"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Scissors, Eye, EyeOff, Star } from "lucide-react";
import { toast } from "sonner";

export default function RegisterPage() {
  const { signUpWithEmail, signInWithGoogle } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "", shopName: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.shopName || !form.email || !form.password) return;
    if (form.password.length < 6) {
      toast.error("La password deve avere almeno 6 caratteri");
      return;
    }
    setLoading(true);
    try {
      await signUpWithEmail(form.email, form.password, form.shopName);
      toast.success("Account creato! Benvenuto su BarberPro 🎉");
      router.push("/dashboard");
    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") {
        toast.error("Email già in uso. Prova ad accedere.");
      } else {
        toast.error("Errore durante la registrazione");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      router.push("/dashboard");
    } catch {
      toast.error("Accesso con Google fallito");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex">
      {/* Left Visual */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#111111] to-[#0a0a0a]" />
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-[var(--primary)]/10 rounded-full blur-3xl" />
        <div className="relative flex flex-col items-center justify-center w-full p-12 text-center">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[var(--primary-dark)] to-[var(--primary)] flex items-center justify-center shadow-2xl shadow-[var(--primary)]/30 mb-8">
            <Scissors className="w-10 h-10 text-black" />
          </div>
          <h2 className="text-4xl font-bold text-gold mb-4">Inizia gratis</h2>
          <p className="text-[var(--muted)] max-w-xs">
            Crea il tuo account in 30 secondi. Nessuna carta richiesta per il piano gratuito.
          </p>
          <div className="mt-12 p-6 rounded-2xl border border-[var(--primary)]/20 bg-[var(--primary)]/5 w-full max-w-xs">
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-4 h-4 fill-[var(--primary)] text-[var(--primary)]" />
              <span className="text-sm font-bold text-[var(--primary)]">Piano Pro — Prova 14 giorni</span>
            </div>
            <ul className="space-y-2 text-left">
              {["Clienti illimitati", "Prenotazioni online", "Campagne marketing", "Supporto prioritario"].map((f) => (
                <li key={f} className="text-sm text-[var(--muted)] flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Right Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex justify-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--primary-dark)] to-[var(--primary)] flex items-center justify-center">
              <Scissors className="w-6 h-6 text-black" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">Crea il tuo account</h1>
          <p className="text-[var(--muted)] text-sm mb-8">Inizia gratis, aggiorna quando vuoi</p>

          <Button variant="outline" className="w-full mb-6" onClick={handleGoogle} loading={googleLoading}>
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continua con Google
          </Button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--border)]" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-[var(--background)] px-3 text-[var(--muted)]">oppure</span>
            </div>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <Input
              label="Nome del barbershop"
              value={form.shopName}
              onChange={(e) => setForm((p) => ({ ...p, shopName: e.target.value }))}
              placeholder="Barber King Milano"
              required
              leftIcon={<Scissors className="w-4 h-4" />}
            />
            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              placeholder="nome@barbershop.it"
              required
            />
            <Input
              label="Password"
              type={showPwd ? "text" : "password"}
              value={form.password}
              onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
              placeholder="Minimo 6 caratteri"
              required
              rightIcon={
                <button type="button" onClick={() => setShowPwd((p) => !p)}>
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />
            <Button type="submit" variant="gold" className="w-full" loading={loading}>
              Crea account gratuito
            </Button>
          </form>

          <p className="text-center text-xs text-[var(--muted)] mt-4">
            Registrandoti accetti i{" "}
            <a href="#" className="text-[var(--primary)] hover:underline">Termini di servizio</a>
            {" "}e la{" "}
            <a href="#" className="text-[var(--primary)] hover:underline">Privacy Policy</a>
          </p>

          <p className="text-center text-sm text-[var(--muted)] mt-4">
            Hai già un account?{" "}
            <Link href="/login" className="text-[var(--primary)] hover:underline font-medium">Accedi</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
