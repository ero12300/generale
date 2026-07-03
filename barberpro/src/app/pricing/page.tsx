import type { Metadata } from "next";
import { SiteHeader } from "@/components/landing/SiteHeader";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { PricingCards } from "@/components/PricingCards";

export const metadata: Metadata = {
  title: "Prezzi — BarberPro",
  description: "Piani Starter gratuito e Pro. Scegli quello giusto per il tuo salone.",
};

const FAQ = [
  {
    q: "Posso iniziare gratis?",
    a: "Sì. Il piano Starter è gratuito per sempre e include agenda, fino a 30 clienti e registro incassi base.",
  },
  {
    q: "Come funziona il pagamento del piano Pro?",
    a: "Il piano Pro si attiva con pagamento sicuro tramite Stripe. Puoi disdire quando vuoi dal portale clienti.",
  },
  {
    q: "I miei dati sono al sicuro?",
    a: "I dati sono salvati su Firebase con accesso protetto. In modalità demo restano solo sul tuo browser.",
  },
];

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="container-page flex-1 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <p className="kicker">Prezzi</p>
          <h1 className="mt-3 font-display text-4xl text-cream sm:text-5xl">
            Un piano per ogni fase del tuo salone
          </h1>
          <p className="mt-4 text-cream/60">
            Inizia gratis e passa a Pro quando vuoi sbloccare campagne, prenotazioni online e analisi avanzate.
          </p>
        </div>

        <div className="mx-auto mt-14 max-w-4xl">
          <PricingCards />
        </div>

        <div className="mx-auto mt-20 max-w-3xl">
          <h2 className="text-center font-display text-2xl text-cream">Domande frequenti</h2>
          <div className="mt-8 space-y-4">
            {FAQ.map((item) => (
              <div key={item.q} className="card p-6">
                <h3 className="font-medium text-cream">{item.q}</h3>
                <p className="mt-2 text-sm text-cream/55">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
