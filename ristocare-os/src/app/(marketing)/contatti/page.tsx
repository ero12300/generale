import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/contact-form";
import type { ContactRequest } from "@/lib/types";

export const metadata: Metadata = {
  title: "Contatti",
  description: "Richiedi una demo, un preventivo o un censimento del tuo locale food.",
};

const VALID_TYPES = ["demo", "preventivo", "censimento", "tecnico", "referral"] as const;

function resolveType(value?: string): ContactRequest["requestType"] {
  return (VALID_TYPES as readonly string[]).includes(value ?? "")
    ? (value as ContactRequest["requestType"])
    : "demo";
}

export default async function ContattiPage({
  searchParams,
}: {
  searchParams: Promise<{ tipo?: string; piano?: string }>;
}) {
  const { tipo } = await searchParams;
  const defaultType = resolveType(tipo);

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">Contatti</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">Parliamo del tuo locale</h1>
          <p className="mt-4 text-muted">
            Organizziamo una demo o un censimento tecnico delle attrezzature. Ti mostriamo come
            funziona il portale e quanto costa digitalizzare il tuo locale.
          </p>
          <div className="mt-8 space-y-4 text-sm">
            <div className="rounded-xl border border-border bg-surface p-4">
              <p className="font-medium">Centrale operativa</p>
              <p className="mt-1 text-muted">Messina e provincia · Lun–Sab</p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-4">
              <p className="font-medium">RistoCare OS</p>
              <p className="mt-1 text-muted">Brand dedicato di Emotive S.r.l.</p>
            </div>
            <p className="text-xs text-muted">
              Le proposte di intervento e i preventivi sono bozze e non costituiscono consulenza legale.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
          <ContactForm defaultType={defaultType} />
        </div>
      </div>
    </div>
  );
}
