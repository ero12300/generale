import Link from "next/link";
import { ReferralForm } from "@/components/ReferralForm";

const REWARDS = [
  { plan: "Start", reward: "50 €" },
  { plan: "Pro", reward: "100 €" },
  { plan: "Premium", reward: "200 €" },
  { plan: "Enterprise", reward: "5% del primo setup" },
];

export default function ReferralPage() {
  return (
    <div className="min-h-screen bg-paper">
      <header className="bg-ink py-4 text-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6">
          <Link href="/" className="font-semibold tracking-tight">
            RistoCare <span className="text-gold">OS</span>
          </Link>
          <Link href="/" className="text-sm text-stone-300 hover:text-white">
            ← Torna al sito
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="text-3xl font-semibold tracking-tight">Diventa partner RistoCare</h1>
        <p className="mt-3 max-w-2xl text-warmgray">
          Segnala ristoranti, bar, gelaterie e pizzerie interessati a digitalizzare la gestione
          delle proprie attrezzature. Se il cliente attiva il servizio, ricevi un premio.
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-5">
          <section className="lg:col-span-3" aria-labelledby="form-referral">
            <h2 id="form-referral" className="text-lg font-semibold">
              Segnala un locale
            </h2>
            <div className="mt-4 rounded-xl bg-white p-6 shadow-sm">
              <ReferralForm />
            </div>
          </section>

          <aside className="lg:col-span-2">
            <h2 className="text-lg font-semibold">Premi referral</h2>
            <table className="mt-4 w-full overflow-hidden rounded-xl bg-white text-sm shadow-sm">
              <thead className="border-b border-stone-200 text-left text-warmgray">
                <tr>
                  <th scope="col" className="px-4 py-2.5 font-medium">Piano attivato</th>
                  <th scope="col" className="px-4 py-2.5 font-medium">Premio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {REWARDS.map((r) => (
                  <tr key={r.plan}>
                    <td className="px-4 py-2.5 font-medium">{r.plan}</td>
                    <td className="px-4 py-2.5 text-gold">{r.reward}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <ul className="mt-4 space-y-1.5 text-xs text-warmgray">
              <li>· Il premio è riconosciuto solo se il cliente attiva un piano.</li>
              <li>· Pagamento dopo incasso del setup o del primo canone.</li>
              <li>· Lead già presenti nel database non danno diritto al premio.</li>
              <li>· Il referral non può rappresentare RistoCare senza autorizzazione.</li>
            </ul>
          </aside>
        </div>
      </main>
    </div>
  );
}
