import { Suspense } from "react";
import { MarketingFooter, MarketingHeader } from "@/components/marketing/site-chrome";
import { ContactForm } from "@/components/marketing/contact-form";

export const metadata = { title: "Contatti" };

export default function ContattiPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <MarketingHeader />
      <main className="flex-1 mx-auto max-w-xl w-full px-4 py-16">
        <h1 className="text-3xl font-bold text-zinc-100 mb-4">Contatti</h1>
        <p className="text-zinc-400 mb-8">
          Richiedi una demo, un preventivo o prenota un sopralluogo per digitalizzare il tuo locale.
        </p>
        <Suspense fallback={<div className="text-zinc-500">Caricamento...</div>}>
          <ContactForm />
        </Suspense>
      </main>
      <MarketingFooter />
    </div>
  );
}
