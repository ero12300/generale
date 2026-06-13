import Link from "next/link";
import { demoStore } from "@/lib/demoStore";
import { EQUIPMENT_CATEGORY_LABELS } from "@/lib/types";
import { warrantyStatus, WARRANTY_LABELS } from "@/lib/warranty";
import clsx from "clsx";

const WARRANTY_STYLES = {
  attiva: "bg-emerald-100 text-emerald-800",
  in_scadenza: "bg-amber-100 text-amber-800",
  scaduta: "bg-rose-100 text-rose-800",
} as const;

export default function EquipmentListPage() {
  const equipment = demoStore.listEquipment();
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Attrezzature</h1>
      <p className="mt-1 text-sm text-warmgray">
        Ogni attrezzatura ha scheda digitale, documenti, QR code e storico ticket.
      </p>
      <div className="mt-6 overflow-x-auto rounded-xl bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-stone-200 text-warmgray">
            <tr>
              <th scope="col" className="px-5 py-3 font-medium">Attrezzatura</th>
              <th scope="col" className="px-5 py-3 font-medium">Categoria</th>
              <th scope="col" className="px-5 py-3 font-medium">Matricola</th>
              <th scope="col" className="px-5 py-3 font-medium">Area</th>
              <th scope="col" className="px-5 py-3 font-medium">Garanzia</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {equipment.map((e) => {
              const ws = warrantyStatus(e.warrantyEnd);
              return (
                <tr key={e.id} className="hover:bg-stone-50">
                  <td className="px-5 py-4">
                    <Link href={`/app/attrezzature/${e.id}`} className="font-medium hover:underline">
                      {e.name}
                    </Link>
                    <p className="text-xs text-warmgray">
                      {e.brand} {e.model}
                    </p>
                  </td>
                  <td className="px-5 py-4">{EQUIPMENT_CATEGORY_LABELS[e.category]}</td>
                  <td className="px-5 py-4 font-mono text-xs">{e.serialNumber}</td>
                  <td className="px-5 py-4">{e.area}</td>
                  <td className="px-5 py-4">
                    <span
                      className={clsx(
                        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
                        WARRANTY_STYLES[ws]
                      )}
                    >
                      {WARRANTY_LABELS[ws]}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
