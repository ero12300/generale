import Link from "next/link";
import { Suspense } from "react";
import { Logo } from "@/components/brand/logo";
import { MarketingHeader } from "@/components/marketing/header-footer";
import { SignupForm } from "./signup-form";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-mesh text-zinc-100">
      <MarketingHeader />
      <main className="max-w-md mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-8 animate-fade-up">
          <Logo size="lg" href={null} className="justify-center mb-6" />
          <h1 className="font-display text-2xl font-semibold">Inizia gratis</h1>
          <p className="text-zinc-500 text-sm mt-2">
            Crea il tuo account e controlla i margini del tuo locale
          </p>
        </div>
        <Suspense fallback={<div className="text-center text-zinc-500">Caricamento...</div>}>
          <SignupForm />
        </Suspense>
        <p className="text-center text-xs text-zinc-500 mt-8">
          Hai già un account?{" "}
          <Link href="/login" className="text-emerald-400 hover:underline font-medium">
            Accedi
          </Link>
        </p>
      </main>
    </div>
  );
}
