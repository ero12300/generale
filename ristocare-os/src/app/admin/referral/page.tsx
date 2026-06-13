import { PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";
import { getReferrals } from "@/lib/demo-store";
import { formatDate, formatEuro } from "@/lib/utils";
import type { Referral } from "@/lib/types";

const STATUS_TONE: Record<Referral["status"], "neutral" | "blue" | "amber" | "green" | "red"> = {
  nuovo: "blue",
  contattato: "amber",
  in_trattativa: "amber",
  vinto: "green",
  perso: "red",
};

const STATUS_LABEL: Record<Referral["status"], string> = {
  nuovo: "Nuovo",
  contattato: "Contattato",
  in_trattativa: "In trattativa",
  vinto: "Vinto",
  perso: "Perso",
};

const REWARD_LABEL: Record<Referral["rewardStatus"], string> = {
  in_attesa: "In attesa",
  maturato: "Maturato",
  pagato: "Pagato",
};

export default function AdminReferralPage() {
  const referrals = getReferrals();

  return (
    <div className="space-y-8">
      <PageHeader title="Referral" description="Lead segnalati dai partner e stato dei premi." />

      <div className="overflow-hidden rounded-2xl border border-border bg-surface">
        <ul className="divide-y divide-border">
          {referrals.map((r) => (
            <li key={r.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{r.referredCompany}</p>
                  <Badge tone={STATUS_TONE[r.status]}>{STATUS_LABEL[r.status]}</Badge>
                </div>
                <p className="text-xs text-muted">
                  da {r.partnerName} ({r.partnerType}) · {r.city} · {formatDate(r.createdAt)}
                </p>
              </div>
              <div className="text-right text-sm">
                <p className="font-medium">{r.rewardAmount ? formatEuro(r.rewardAmount) : "—"}</p>
                <p className="text-xs text-muted">Premio: {REWARD_LABEL[r.rewardStatus]}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
