import { demoStore } from "@/lib/demoStore";
import { formatEuroCents } from "@/lib/money";
import clsx from "clsx";

const STATUS_STYLES = {
  nuovo: "bg-blue-100 text-blue-800",
  contattato: "bg-amber-100 text-amber-800",
  convertito: "bg-emerald-100 text-emerald-800",
  scartato: "bg-stone-200 text-stone-600",
} as const;

export default function AdminReferralPage() {
  const referrals = demoStore.listReferrals();
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Referral partner</h1>
      <p className="mt-1 text-sm text-warmgray">
        Il premio viene riconosciuto solo se il cliente attiva un piano, dopo incasso del setup o
        del primo canone.
      </p>

      <div className="mt-6 overflow-x-auto rounded-xl bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-stone-200 text-warmgray">
            <tr>
              <th scope="col" className="px-5 py-3 font-medium">Partner</th>
              <th scope="col" className="px-5 py-3 font-medium">Locale segnalato</th>
              <th scope="col" className="px-5 py-3 font-medium">Città</th>
              <th scope="col" className="px-5 py-3 font-medium">Stato</th>
              <th scope="col" className="px-5 py-3 font-medium">Premio</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {referrals.map((r) => (
              <tr key={r.id} className="hover:bg-stone-50">
                <td className="px-5 py-4">
                  <p className="font-medium">{r.partnerName}</p>
                  <p className="text-xs text-warmgray">{r.partnerType}</p>
                </td>
                <td className="px-5 py-4">
                  <p className="font-medium">{r.referredCompany}</p>
                  <p className="text-xs text-warmgray">{r.referredContact}</p>
                </td>
                <td className="px-5 py-4">{r.city}</td>
                <td className="px-5 py-4">
                  <span
                    className={clsx(
                      "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
                      STATUS_STYLES[r.status]
                    )}
                  >
                    {r.status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  {r.rewardAmountCents != null ? formatEuroCents(r.rewardAmountCents) : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
