import { MarketingHeader, MarketingFooter } from "@/components/marketing/header-footer";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <MarketingHeader />
      <main className="max-w-lg mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-4">Richiedi una demo</h1>
        <p className="text-zinc-400 mb-8">
          Compili il modulo e La ricontatteremo entro 24 ore. Oppure provi subito la demo interattiva.
        </p>
        <Card>
          <CardHeader>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="text-sm text-zinc-400">Nome locale</label>
                <input
                  id="name"
                  name="name"
                  className="mt-1 w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-sm"
                  placeholder="Es. Pizzeria La Lumachina"
                />
              </div>
              <div>
                <label htmlFor="phone" className="text-sm text-zinc-400">Telefono</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  className="mt-1 w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-sm"
                  placeholder="+39 ..."
                />
              </div>
              <div>
                <label htmlFor="city" className="text-sm text-zinc-400">Città</label>
                <input
                  id="city"
                  name="city"
                  className="mt-1 w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-sm"
                  placeholder="Messina"
                />
              </div>
              <Button type="submit" className="w-full">Invia richiesta</Button>
            </form>
          </CardHeader>
        </Card>
        <p className="text-center text-sm text-zinc-500 mt-6">
          Oppure{" "}
          <a href="/login" className="text-emerald-400 hover:underline">
            acceda alla demo interattiva
          </a>
        </p>
      </main>
      <MarketingFooter />
    </div>
  );
}
