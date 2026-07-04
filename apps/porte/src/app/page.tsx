import Link from "next/link";
import { ArrowRight, Compass, DoorOpen, Ruler, Sparkles, ListChecks } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const FEATURES = [
  {
    icon: Ruler,
    title: "Dal foro muro alla porta",
    body: "Inserisci le misure del vano grezzo e ottieni anta, telaio, coprifilo e luce netta secondo lo standard italiano.",
  },
  {
    icon: Compass,
    title: "Verso apertura chiaro",
    body: "Maniglia DX/SX e spinta/tira visualizzati direttamente nello schema di produzione.",
  },
  {
    icon: Sparkles,
    title: "Bussola, fisso, vetro",
    body: "Sistema bussola per muri spessi, pannello fisso, sopraluce e inserti vetrati (ovale, tondo, rettangolare).",
  },
  {
    icon: DoorOpen,
    title: "Scheda di produzione",
    body: "Esportazione stampabile in A4 con quote, tabelle e schema tecnico pronta per il laboratorio.",
  },
];

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-800/60 bg-gradient-to-b from-slate-900/80 to-slate-950/60 px-6 py-10 text-center shadow-lg shadow-black/30">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-brand-500/40 bg-brand-500/10 px-3 py-1 text-xs font-medium text-brand-200">
          <DoorOpen size={12} /> Configuratore mobile
        </div>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl">
          Porte interne, dal cantiere alla produzione
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-sm text-slate-400 sm:text-base">
          Prendi le misure del foro muro direttamente in cantiere: PortePro calcola
          l&apos;anta, il telaio e la scheda di produzione già pronta.
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/nuova"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-500 px-6 text-sm font-semibold text-white shadow-sm shadow-brand-500/30 transition hover:bg-brand-600"
          >
            Nuova porta
            <ArrowRight size={18} />
          </Link>
          <Link
            href="/ordini"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/60 px-6 text-sm font-medium text-slate-200 transition hover:bg-slate-800"
          >
            <ListChecks size={18} />
            Vedi ordini salvati
          </Link>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        {FEATURES.map((f) => (
          <Card key={f.title}>
            <CardHeader>
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-brand-500/15 p-2 text-brand-300">
                  <f.icon size={22} />
                </div>
                <div>
                  <CardTitle>{f.title}</CardTitle>
                  <CardDescription>{f.body}</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle>Come funziona</CardTitle>
            <CardDescription>3 passi dal foro muro alla scheda di produzione</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3 text-sm text-slate-300">
              <li className="flex gap-3">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-500/15 text-brand-300 font-semibold">
                  1
                </span>
                Inserisci larghezza, altezza e spessore del muro finito.
              </li>
              <li className="flex gap-3">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-500/15 text-brand-300 font-semibold">
                  2
                </span>
                Scegli modello, bussola, fisso, sopraluce, vetro, maniglia e verso apertura.
              </li>
              <li className="flex gap-3">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-500/15 text-brand-300 font-semibold">
                  3
                </span>
                Salva l&apos;ordine e stampa/condividi la scheda per la produzione.
              </li>
            </ol>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
