import Link from "next/link";
import { PageHeader } from "@/components/app/page-header";
import { EquipmentStatusBadge, WarrantyBadge } from "@/components/ui/status-badges";
import { getEquipmentList } from "@/lib/demo-store";
import { CATEGORY_LABELS } from "@/lib/labels";
import { formatDate, warrantyStatusFrom } from "@/lib/utils";

export default function EquipmentListPage() {
  const equipment = getEquipmentList();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Attrezzature"
        description={`${equipment.length} attrezzature censite nel locale.`}
      />

      <div className="overflow-hidden rounded-2xl border border-border bg-surface">
        <div className="hidden grid-cols-12 gap-3 border-b border-border px-5 py-3 text-xs uppercase tracking-wide text-muted md:grid">
          <span className="col-span-4">Attrezzatura</span>
          <span className="col-span-2">Categoria</span>
          <span className="col-span-2">Matricola</span>
          <span className="col-span-2">Garanzia</span>
          <span className="col-span-2">Stato</span>
        </div>
        <ul className="divide-y divide-border">
          {equipment.map((e) => (
            <li key={e.id}>
              <Link
                href={`/app/attrezzature/${e.id}`}
                className="grid grid-cols-1 gap-2 px-5 py-4 transition-colors hover:bg-surface-2 md:grid-cols-12 md:items-center md:gap-3"
              >
                <div className="md:col-span-4">
                  <p className="text-sm font-medium">{e.name}</p>
                  <p className="text-xs text-muted">{e.brand} {e.model}</p>
                </div>
                <div className="text-sm text-muted md:col-span-2">{CATEGORY_LABELS[e.category]}</div>
                <div className="font-mono text-xs text-muted md:col-span-2">{e.serialNumber}</div>
                <div className="md:col-span-2">
                  <WarrantyBadge status={warrantyStatusFrom(e.warrantyEnd)} />
                  <p className="mt-1 text-xs text-muted">fino al {formatDate(e.warrantyEnd)}</p>
                </div>
                <div className="md:col-span-2"><EquipmentStatusBadge status={e.status} /></div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
