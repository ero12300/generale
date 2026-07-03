import Link from "next/link";
import { redirect } from "next/navigation";
import { Scissors } from "lucide-react";
import { getSession } from "@/lib/session";
import { dataMode } from "@/lib/firebase";
import { LoginForm } from "./login-form";

export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-premium text-zinc-100 flex flex-col">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-b from-[#e3c680] to-[#c9a24b] text-zinc-950">
            <Scissors className="h-5 w-5" />
          </span>
          <span className="font-display text-lg font-semibold gold-gradient-text">
            Lama d&apos;Oro
          </span>
        </Link>
        <Link href="/" className="text-sm text-zinc-400 hover:text-zinc-100">
          ← Torna al sito
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center px-5 py-10">
        <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-[#17171a]/80 p-8 card-ring">
          <h1 className="font-display text-2xl font-semibold">Accedi al gestionale</h1>
          <p className="mt-2 text-sm text-zinc-400">
            {dataMode() === "demo"
              ? "Modalità demo: inserisci una email qualsiasi per entrare e provare tutte le funzioni."
              : "Accedi con le tue credenziali Firebase."}
          </p>
          <div className="mt-6">
            <LoginForm />
          </div>
        </div>
      </main>
    </div>
  );
}
