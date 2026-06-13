import Link from "next/link";
import { LineChart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  return (
    <div className="brand-grid flex min-h-dvh items-center justify-center bg-[var(--background)] px-4 text-zinc-100">
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-6 flex items-center justify-center gap-2">
          <LineChart className="h-7 w-7 text-emerald-500" />
          <span className="text-xl font-bold tracking-tight">
            RistoProfit<span className="text-emerald-500"> OS</span>
          </span>
        </Link>
        <Card>
          <CardHeader>
            <CardTitle>Accedi all&apos;area cliente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" className="mt-1" type="email" placeholder="titolare@locale.it" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" className="mt-1" type="password" placeholder="••••••••" />
            </div>
            <Button asChild className="w-full">
              <Link href="/dashboard">Entra nella demo</Link>
            </Button>
            <p className="text-center text-xs text-zinc-500">
              Modalità demo: nessuna autenticazione reale. In produzione: Supabase
              Auth con ruoli e Row Level Security.
            </p>
          </CardContent>
        </Card>
        <p className="mt-4 text-center text-sm text-zinc-500">
          <Link href="/" className="hover:text-zinc-300">
            ← Torna al sito
          </Link>
        </p>
      </div>
    </div>
  );
}
