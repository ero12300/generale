"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Scissors, Chrome, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { useAuth } from "@/components/providers/auth-provider";
import { useToast } from "@/components/providers/toast-provider";

export default function SignupPage() {
  const { status, signUpEmail, signInGoogle, signInDemo, mode } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (status === "authed") router.replace("/app");
  }, [status, router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signUpEmail(email, password, name);
      toast.success("Account creato!", "Benvenuto in Rasoio.");
    } catch (err: any) {
      toast.error("Registrazione fallita", err?.message ?? "Riprova.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-dvh md:grid-cols-2">
      <div className="hidden md:block relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[color:var(--color-ink-900)] via-[color:var(--color-ink-950)] to-black" />
        <div className="absolute -left-32 top-24 h-96 w-96 rounded-full bg-[color:var(--color-gold-400)]/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-[color:var(--color-copper-500)]/15 blur-3xl" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-xl gold-border bg-[color:var(--color-ink-800)]">
              <Scissors className="h-4 w-4 text-[color:var(--color-gold-300)]" />
            </span>
            <div className="leading-tight">
              <div className="font-display text-lg text-white">Rasoio</div>
              <div className="text-[10px] uppercase tracking-widest text-white/40">barber os</div>
            </div>
          </Link>
          <div className="max-w-md">
            <div className="text-xs uppercase tracking-widest text-[color:var(--color-gold-200)]">Crea il tuo Rasoio</div>
            <h1 className="mt-3 font-display text-4xl text-white leading-tight">
              Nasce un nuovo <span className="gold-text">barbershop</span>.
            </h1>
            <p className="mt-4 text-white/60">
              Setup in un minuto. Prova subito prenotazioni, incassi, CRM e referral in modalità demo.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-white/70">
              <li>· Nessuna carta richiesta</li>
              <li>· Annulli quando vuoi</li>
              <li>· I tuoi dati, la tua identità visiva</li>
            </ul>
          </div>
          <div className="text-xs text-white/40">© Rasoio · barber os</div>
        </div>
      </div>

      <div className="relative flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <h2 className="font-display text-3xl text-white">Crea account</h2>
          <p className="mt-1 text-sm text-white/60">Hai già un account? <Link className="text-[color:var(--color-gold-200)] underline underline-offset-4" href="/login">Accedi</Link></p>

          <div className="mt-6 space-y-3">
            <Button variant="gold" className="w-full" onClick={async () => {
              setLoading(true);
              try { await signInDemo(name); toast.success("Modalità demo attivata"); }
              finally { setLoading(false); }
            }}>
              <Wand2 className="h-4 w-4" />
              Prova la demo (nessuna carta)
            </Button>
            <Button variant="outline" className="w-full" onClick={async () => {
              setLoading(true);
              try { await signInGoogle(); }
              catch (err: any) { toast.error("Google non disponibile", err?.message); }
              finally { setLoading(false); }
            }}>
              <Chrome className="h-4 w-4" />
              Continua con Google
            </Button>
          </div>

          <div className="my-6 flex items-center gap-3 text-xs text-white/40">
            <div className="h-px flex-1 bg-white/10" />
            oppure con email
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <form className="space-y-3" onSubmit={submit}>
            <div>
              <Label>Nome</Label>
              <Input required placeholder="Il tuo nome" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" required placeholder="tu@barber.it" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <Label>Password</Label>
              <Input type="password" required minLength={6} placeholder="minimo 6 caratteri" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Button type="submit" variant="gold" className="w-full mt-2" disabled={loading}>Crea account</Button>
          </form>

          {mode === "demo" && (
            <p className="mt-4 text-center text-[11px] text-white/40">
              Firebase non è configurato: verrà creato un account demo salvato solo nel tuo browser.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
