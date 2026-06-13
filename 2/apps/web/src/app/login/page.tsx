import Link from "next/link";
import { MarketingHeader } from "@/components/marketing/header-footer";
import { Suspense } from "react";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <MarketingHeader />
      <main className="max-w-md mx-auto px-4 py-16">
        <h1 className="text-2xl font-bold text-center mb-2">Accedi a RistoProfit OS</h1>
        <p className="text-zinc-400 text-sm text-center mb-8">
          Senza account Supabase, usa la demo con dati di esempio.
        </p>
        <Suspense fallback={<div className="text-center text-zinc-500">Caricamento...</div>}>
          <LoginForm />
        </Suspense>
        <p className="text-center text-xs text-zinc-500 mt-6">
          <Link href="/" className="hover:text-zinc-300">← Torna al sito</Link>
        </p>
      </main>
    </div>
  );
}
