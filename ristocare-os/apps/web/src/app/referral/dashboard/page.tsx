import Link from "next/link";
import { getRepository, getSession } from "@/lib/auth/session";
import { PortalShell } from "@/components/layout/portal-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";

export const metadata = { title: "Area partner" };

export default async function ReferralDashboardPage() {
  const session = await getSession();
  const repo = await getRepository();
  const referrals = await repo.listReferrals();

  return (
    <PortalShell variant="referral" title="Partner RistoCare" subtitle="I tuoi lead" mode={session.mode} email={session.email}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-zinc-100">Lead segnalati</h1>
          <Link href="/referral" className="text-sm text-emerald-400 hover:underline">+ Nuova segnalazione</Link>
        </div>
        {referrals.length === 0 ? (
          <Card><CardContent className="py-12 text-center text-zinc-500">Nessun lead ancora.</CardContent></Card>
        ) : (
          <div className="space-y-3">
            {referrals.map((r) => (
              <Card key={r.id}>
                <CardContent className="py-4 flex flex-wrap justify-between gap-4">
                  <div>
                    <p className="font-medium text-zinc-200">{r.referred_company}</p>
                    <p className="text-sm text-zinc-500">{r.referred_contact} · {formatDate(r.created_at)}</p>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Badge variant={r.status === "converted" ? "success" : "default"}>{r.status}</Badge>
                    {r.reward_amount && <span className="text-emerald-400">{formatCurrency(r.reward_amount)}</span>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PortalShell>
  );
}
