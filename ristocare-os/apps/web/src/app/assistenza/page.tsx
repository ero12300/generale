import { MarketingFooter, MarketingHeader } from "@/components/marketing/site-chrome";

export const metadata = { title: "Assistenza e ticket" };

export default function AssistenzaPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <MarketingHeader />
      <main className="flex-1 mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl font-bold text-zinc-100 mb-4">Centrale operativa assistenza</h1>
        <p className="text-zinc-400 mb-8 leading-relaxed">
          Con RistoCare OS non devi cercare il tecnico. Apri un ticket e la centrale operativa
          qualifica il problema, verifica la garanzia, contatta il professionista più adatto
          e ti invia un preventivo chiaro.
        </p>
        <div className="space-y-6 mb-12">
          {[
            { step: "1", title: "Apri ticket", desc: "Da app, portale web, QR code o assistente telefonico." },
            { step: "2", title: "Qualificazione", desc: "RistoCare verifica garanzia, foto, matricola e urgenza." },
            { step: "3", title: "Preventivo", desc: "Ricevi un preventivo unico con tempi e condizioni chiare." },
            { step: "4", title: "Intervento", desc: "Il tecnico incaricato interviene. Storico archiviato nel portale." },
          ].map(({ step, title, desc }) => (
            <div key={step} className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600/20 text-emerald-400 text-sm font-bold">
                {step}
              </div>
              <div>
                <h3 className="font-medium text-zinc-200">{title}</h3>
                <p className="text-sm text-zinc-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
