import Link from "next/link";
import { MarketingHeader, MarketingFooter } from "@/components/marketing/header-footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-mesh">
      <MarketingHeader />
      <main className="max-w-lg mx-auto px-4 py-16 md:py-20">
        <div className="text-center mb-10 animate-fade-up">
          <p className="text-sm font-medium text-emerald-700 uppercase tracking-widest mb-3">
            Provalo subito
          </p>
          <h1 className="font-display text-4xl font-semibold mb-4">Richiedi una demo</h1>
          <p className="text-stone-600 leading-relaxed">
            Compili il modulo e La ricontatteremo entro 24 ore. Oppure provi subito la demo interattiva.
          </p>
        </div>
        <Card className="animate-fade-up shadow-lg shadow-stone-900/5">
          <CardHeader>
            <CardTitle className="font-display text-lg">I tuoi dati</CardTitle>
            <CardDescription>Lasciaci un recapito per organizzare una call</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="text-sm text-stone-600 font-medium">
                  Nome locale
                </label>
                <input
                  id="name"
                  name="name"
                  className="mt-1.5 w-full rounded-lg bg-white border border-[var(--border)] px-3 py-2.5 text-sm text-stone-900 shadow-sm focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 outline-none transition-colors"
                  placeholder="Es. Pizzeria La Lumachina"
                />
              </div>
              <div>
                <label htmlFor="phone" className="text-sm text-stone-600 font-medium">
                  Telefono
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  className="mt-1.5 w-full rounded-lg bg-white border border-[var(--border)] px-3 py-2.5 text-sm text-stone-900 shadow-sm focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 outline-none transition-colors"
                  placeholder="+39 ..."
                />
              </div>
              <div>
                <label htmlFor="city" className="text-sm text-stone-600 font-medium">
                  Città
                </label>
                <input
                  id="city"
                  name="city"
                  className="mt-1.5 w-full rounded-lg bg-white border border-[var(--border)] px-3 py-2.5 text-sm text-stone-900 shadow-sm focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 outline-none transition-colors"
                  placeholder="Messina"
                />
              </div>
              <Button type="submit" className="w-full mt-2">
                Invia richiesta
              </Button>
            </form>
          </CardContent>
        </Card>
        <p className="text-center text-sm text-zinc-500 mt-8">
          Oppure{" "}
          <Link href="/login" className="text-emerald-700 hover:underline font-medium">
            accedi alla demo interattiva
          </Link>
        </p>
      </main>
      <MarketingFooter />
    </div>
  );
}
