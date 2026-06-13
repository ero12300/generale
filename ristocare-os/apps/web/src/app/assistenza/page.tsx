import { Headphones, FileCheck, Send, Wrench } from "lucide-react";
import { MarketingFooter, MarketingHeader } from "@/components/marketing/site-chrome";
import { MarketingPageShell, PageHero } from "@/components/marketing/page-shell";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = { title: "Assistenza e ticket" };

const steps = [
  {
    step: "1",
    icon: Headphones,
    title: "Apri ticket",
    desc: "Da app, portale web, QR code o assistente telefonico.",
  },
  {
    step: "2",
    icon: FileCheck,
    title: "Qualificazione",
    desc: "RistoCare verifica garanzia, foto, matricola e urgenza.",
  },
  {
    step: "3",
    icon: Send,
    title: "Preventivo",
    desc: "Ricevi un preventivo unico con tempi e condizioni chiare.",
  },
  {
    step: "4",
    icon: Wrench,
    title: "Intervento",
    desc: "Il tecnico incaricato interviene. Storico archiviato nel portale.",
  },
];

export default function AssistenzaPage() {
  return (
    <MarketingPageShell>
      <MarketingHeader />
      <main className="flex-1 mx-auto max-w-4xl w-full px-4 lg:px-6 py-16 md:py-24">
        <PageHero
          eyebrow="Centrale operativa"
          title="Assistenza senza caos"
          description="Con RistoCare OS non devi cercare il tecnico. Apri un ticket e la centrale qualifica il problema, verifica la garanzia, contatta il professionista più adatto e ti invia un preventivo chiaro."
        />

        <div className="grid sm:grid-cols-2 gap-5">
          {steps.map(({ step, icon: Icon, title, desc }) => (
            <Card key={step} className="border-zinc-200 hover:border-emerald-500/20 transition-colors">
              <CardContent className="pt-6 flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                  <Icon className="h-5 w-5 text-emerald-600" aria-hidden />
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-emerald-700 tracking-widest uppercase mb-1">
                    Step {step}
                  </p>
                  <h3 className="font-display text-lg font-medium text-zinc-900">{title}</h3>
                  <p className="text-sm text-zinc-500 mt-1 leading-relaxed">{desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-8 text-center">
          <p className="font-display text-xl text-zinc-900">Il cliente non sceglie il tecnico</p>
          <p className="text-zinc-500 mt-2 max-w-lg mx-auto text-sm leading-relaxed">
            La centrale operativa RistoCare coordina la rete partner e ti presenta un unico preventivo.
            Tu vedi solo lo stato avanzamento e il costo finale.
          </p>
        </div>
      </main>
      <MarketingFooter />
    </MarketingPageShell>
  );
}
