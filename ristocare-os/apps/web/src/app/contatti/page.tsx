import { Suspense } from "react";
import { MarketingFooter, MarketingHeader } from "@/components/marketing/site-chrome";
import { MarketingPageShell, PageHero } from "@/components/marketing/page-shell";
import { ContactForm } from "@/components/marketing/contact-form";

export const metadata = { title: "Contatti" };

export default function ContattiPage() {
  return (
    <MarketingPageShell>
      <MarketingHeader />
      <main className="flex-1 mx-auto max-w-xl w-full px-4 lg:px-6 py-16 md:py-24">
        <PageHero
          eyebrow="Parliamone"
          title="Contatti"
          description="Richiedi una demo, un preventivo o prenota un sopralluogo per digitalizzare il tuo locale."
        />
        <Suspense fallback={<div className="text-zinc-500 animate-pulse">Caricamento...</div>}>
          <ContactForm />
        </Suspense>
      </main>
      <MarketingFooter />
    </MarketingPageShell>
  );
}
