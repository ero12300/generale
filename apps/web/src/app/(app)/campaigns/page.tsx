import { Gift, MessageCircleMore, QrCode, Repeat2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { referralCampaigns } from "@/lib/barber-data";
import { formatCurrencyFromCents } from "@/lib/utils";

export default function CampaignsPage() {
  return (
    <div className="space-y-8">
      <div>
        <Badge className="border-white/10 bg-white/10 text-white">Referral & retention</Badge>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">Campagne sconti e porta un amico</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400">
          Qui gestisci campagne che riportano i clienti in poltrona, incentivano il passaparola e
          fanno salire il valore medio per appuntamento.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <MiniCard icon={Gift} title="Reward stack" text="Sconti, wallet credit, servizi bonus." />
        <MiniCard icon={QrCode} title="Referral QR" text="Codici da banco, receipt e WhatsApp." />
        <MiniCard icon={MessageCircleMore} title="Automazioni" text="Reminder e follow-up post visita." />
        <MiniCard icon={Repeat2} title="Riattivazione" text="Workflow per clienti dormienti." />
      </div>

      <Card className="border-white/10 bg-white/5 backdrop-blur">
        <CardHeader>
          <CardTitle>Campagne attive</CardTitle>
          <CardDescription>Focus su ROI, conversioni e reward più efficaci.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          {referralCampaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="grid gap-4 rounded-3xl border border-white/10 bg-black/20 p-5 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.6fr]"
            >
              <div>
                <p className="text-sm font-medium text-white">{campaign.title}</p>
                <p className="mt-2 text-sm text-zinc-400">
                  Referrer: {campaign.reward_referrer} · Friend: {campaign.reward_friend}
                </p>
              </div>
              <Metric label="Conversioni" value={String(campaign.conversions)} />
              <Metric label="Ricavi attribuiti" value={formatCurrencyFromCents(campaign.revenue_cents)} />
              <div className="flex items-start justify-start lg:justify-end">
                <Badge variant={campaign.status === "active" ? "success" : "secondary"}>
                  {campaign.status}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function MiniCard({
  icon: Icon,
  title,
  text,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  text: string;
}) {
  return (
    <Card className="border-white/10 bg-white/5 backdrop-blur">
      <CardContent className="p-5">
        <Icon className="h-5 w-5 text-amber-300" aria-hidden />
        <p className="mt-4 text-sm font-medium text-white">{title}</p>
        <p className="mt-1 text-sm text-zinc-400">{text}</p>
      </CardContent>
    </Card>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-zinc-500">{label}</p>
      <p className="mt-1 text-sm font-medium text-white">{value}</p>
    </div>
  );
}
