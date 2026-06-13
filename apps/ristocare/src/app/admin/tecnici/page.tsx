import { demoStore } from "@/lib/demoStore";
import { EQUIPMENT_CATEGORY_LABELS } from "@/lib/types";
import { Star } from "lucide-react";

export default function TechniciansPage() {
  const technicians = demoStore.listTechnicians();
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Tecnici partner</h1>
      <p className="mt-1 text-sm text-warmgray">
        Ranking interno riservato: il cliente non vede mai questi dati. Il tecnico resta partner
        operativo, non protagonista commerciale.
      </p>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {technicians.map((t) => (
          <article key={t.id} className="rounded-xl bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-semibold">{t.name}</h2>
                <p className="text-sm text-warmgray">{t.companyName} · {t.city}</p>
              </div>
              <span
                className="inline-flex items-center gap-1 rounded-full bg-gold-soft px-2.5 py-0.5 text-xs font-medium text-gold"
                aria-label={`Valutazione interna ${t.ratingInternal} su 5`}
              >
                <Star className="h-3.5 w-3.5 fill-current" aria-hidden /> {t.ratingInternal}/5
              </span>
            </div>
            <p className="mt-3 text-sm">{t.phone}</p>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {t.categories.map((c) => (
                <li
                  key={c}
                  className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs text-stone-600"
                >
                  {EQUIPMENT_CATEGORY_LABELS[c]}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}
