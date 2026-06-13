import { MarketingHeader, MarketingFooter } from "@/components/marketing/header-footer";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, MapPin, Phone } from "lucide-react";

export default function ContattiPage() {
  return (
    <div className="min-h-screen bg-mesh">
      <MarketingHeader />
      <main className="max-w-lg mx-auto px-4 py-16 md:py-20">
        <div className="text-center mb-10 animate-fade-up">
          <p className="text-sm font-medium text-emerald-400 uppercase tracking-widest mb-3">
            Siamo qui per Lei
          </p>
          <h1 className="font-display text-4xl font-semibold">Contatti</h1>
        </div>
        <Card className="animate-fade-up shadow-2xl shadow-black/30">
          <CardHeader className="space-y-5">
            <CardTitle className="font-display text-xl">Emotive S.r.l.</CardTitle>
            <div className="space-y-4 text-sm text-zinc-400">
              <p className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-emerald-500 shrink-0" />
                Messina e provincia
              </p>
              <p className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-emerald-500 shrink-0" />
                info@emotive.it
              </p>
              <p className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-emerald-500 shrink-0" />
                +39 090 000 0000
              </p>
            </div>
          </CardHeader>
        </Card>
      </main>
      <MarketingFooter />
    </div>
  );
}
