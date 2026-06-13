import Link from "next/link";
import { Suspense } from "react";
import { MarketingHeader } from "@/components/marketing/header-footer";
import { Logo } from "@/components/brand/logo";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-mesh">
      <MarketingHeader />
      <main className="max-w-md mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-8">
          <Logo size="lg" href={null} className="justify-center mb-6" />
          <h1 className="font-display text-2xl font-semibold">Bentornato</h1>
          <p className="text-zinc-500 text-sm mt-2">
            Accedi al cruscotto o prova la demo gratuita
          </p>
        </div>
        <Suspense fallback={<div className="text-center text-zinc-500">Caricamento...</div>}>
          <LoginForm />
        </Suspense>
        <p className="text-center text-xs text-zinc-500 mt-8">
          <Link href="/" className="hover:text-emerald-400 transition-colors">← Torna al sito</Link>
        </p>
      </main>
    </div>
  );
}
