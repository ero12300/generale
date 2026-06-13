import Link from "next/link";
import { getRepository, getSession } from "@/lib/auth/session";
import { PortalShell } from "@/components/layout/portal-shell";
import { EmptyState, PortalPageHeader } from "@/components/portal/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
        <PortalPageHeader
          title="Lead segnalati"
          description="Stato premi e conversioni"
          action={
            <Button size="sm" asChild>
              <Link href="/referral">+ Nuova segnalazione</Link>
            </Button>
          }
        />
        {referrals.length === 0 ? (
          <EmptyState
            title="Nessun lead ancora"
            description="Segnala il primo locale e inizia a guadagnare premi referral."
            action={
              <Button asChild>
                <Link href="/referral">Segnala un locale</Link>
              </Button>
            }
          />
        ) : (
          <div className="space-y-3">
            {referrals.map((r) => (
              <Card key={r.id}>
                <CardContent className="py-4 flex flex-wrap justify-between gap-4">
                  <div>
                    <p className="font-medium text-zinc-200">{r.referred_company}</p>
                    <p className="text-sm text-zinc-500">
                      {r.referred_contact} · {formatDate(r.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Badge variant={r.status === "converted" ? "success" : "default"}>{r.status}</Badge>
                    {r.reward_amount && (
                      <span className="font-display text-emerald-400">{formatCurrency(r.reward_amount)}</span>
                    )}
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
