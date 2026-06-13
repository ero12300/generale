import { PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";
import { getTechnicians } from "@/lib/demo-store";
import { CATEGORY_LABELS } from "@/lib/labels";

export default function TechniciansPage() {
  const technicians = getTechnicians();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Tecnici partner"
        description="Rete interna non visibile ai clienti. Il ranking è privato."
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {technicians.map((t) => (
          <div key={t.id} className="rounded-2xl border border-border bg-surface p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-base font-semibold">{t.companyName}</h2>
                <p className="text-xs text-muted">{t.name}</p>
              </div>
              <Badge tone={t.active ? "green" : "neutral"}>{t.active ? "Attivo" : "Inattivo"}</Badge>
            </div>
            <p className="mt-3 flex items-center gap-1 text-sm">
              <span className="text-gold">★</span>
              <span className="font-medium">{t.ratingInternal.toFixed(1)}</span>
              <span className="text-xs text-muted">ranking interno</span>
            </p>
            <p className="mt-2 text-sm text-muted">{t.phone} · {t.city} ({t.province})</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {t.categories.map((c) => (
                <span key={c} className="rounded-full border border-border bg-surface-2 px-2.5 py-0.5 text-xs text-muted">
                  {CATEGORY_LABELS[c]}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
