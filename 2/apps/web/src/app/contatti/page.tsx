import { MarketingHeader, MarketingFooter } from "@/components/marketing/header-footer";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export default function ContattiPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <MarketingHeader />
      <main className="max-w-lg mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8">Contatti</h1>
        <Card>
          <CardHeader>
            <CardTitle>Emotive S.r.l.</CardTitle>
            <p className="text-zinc-400 text-sm mt-4">Messina e provincia</p>
            <p className="text-zinc-400 text-sm mt-2">info@emotive.it</p>
            <p className="text-zinc-400 text-sm">+39 090 000 0000</p>
          </CardHeader>
        </Card>
      </main>
      <MarketingFooter />
    </div>
  );
}
