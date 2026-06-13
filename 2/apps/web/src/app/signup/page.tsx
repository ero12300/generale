import Link from "next/link";
import { Suspense } from "react";
import { MarketingHeader } from "@/components/marketing/header-footer";
import { SignupForm } from "./signup-form";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <MarketingHeader />
      <main className="max-w-md mx-auto px-4 py-16">
        <h1 className="text-2xl font-bold text-center mb-2">Registrati</h1>
        <p className="text-zinc-400 text-sm text-center mb-8">
          Crea il tuo account RistoProfit OS
        </p>
        <Suspense fallback={<div className="text-center text-zinc-500">Caricamento...</div>}>
          <SignupForm />
        </Suspense>
        <p className="text-center text-xs text-zinc-500 mt-6">
          Hai già un account?{" "}
          <Link href="/login" className="text-emerald-400 hover:underline">
            Accedi
          </Link>
        </p>
      </main>
    </div>
  );
}
