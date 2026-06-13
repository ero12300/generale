import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Come funziona" };

const MODULES = [
  {
    title: "1. Food Cost",
    text: "Inseriamo ingredienti, grammature, scarti e packaging. Il sistema calcola costo porzione, food cost percentuale, margine lordo e prezzo minimo e ideale consigliato, con alert se il food cost è troppo alto.",
  },
  {
    title: "2. Menu Engineering",
    text: "Ogni piatto viene classificato come Star, Puzzle, Cavallo da lavoro o Dog confrontando vendite e margine: così sa cosa spingere, cosa aumentare e cosa eliminare.",
  },
  {
    title: "3. Fatture fornitori",
    text: "Carica le fatture (PDF o foto): i prezzi degli ingredienti si aggiornano e ricevi alert quando un aumento riduce il margine dei piatti collegati.",
  },
  {
    title: "4. Magazzino semplice",
    text: "Scorte minime, prodotti in esaurimento, lista riordino e storico prezzi: sa cosa manca, cosa sta aumentando e cosa ordinare.",
  },
  {
    title: "5. Produzione giornaliera",
    text: "Suggerimenti di produzione basati sullo storico vendite, giorno della settimana e stagionalità — ideale per bar, gelaterie, pasticcerie e take away.",
  },
  {
    title: "6. Personale",
    text: "Non è un software paghe: confronta costo del personale e incasso, calcola incidenza e costo per coperto, con alert se il costo è troppo alto.",
  },
  {
    title: "7. Report giornaliero",
    text: "Ogni sera il titolare riceve incasso, coperti, scontrino medio, food cost stimato, prodotti critici, ingredienti in aumento e azioni consigliate.",
  },
];

export default function ComeFunzionaPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-10 px-4 py-12">
      <div className="space-y-3 text-center">
        <h1 className="text-3xl font-bold text-ink">Come funziona</h1>
        <p className="text-warmgray">
          RistoProfit OS aiuta il ristoratore a rispondere ogni giorno a una
          domanda semplice: <strong className="text-ink">sto guadagnando davvero?</strong>
        </p>
      </div>
      <ol className="space-y-4">
        {MODULES.map((m) => (
          <li key={m.title} className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-ink">{m.title}</h2>
            <p className="mt-1 text-sm text-warmgray">{m.text}</p>
          </li>
        ))}
      </ol>
      <div className="text-center">
        <Link
          href="/demo"
          className="inline-block rounded-lg bg-profit px-6 py-3 font-semibold text-white hover:bg-green-700"
        >
          Richiedi una demo
        </Link>
      </div>
    </div>
  );
}
