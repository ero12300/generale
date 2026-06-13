import { Badge, Kpi, Section, Table, statusTone } from "@/components/ui";
import { DEMO_PARTNER, referralLeads } from "@/lib/demo-data";
import { formatEuro } from "@/lib/money";
import { LeadForm } from "./lead-form";

export const metadata = { title: "Portale referral" };

export default function PartnerPage() {
  const accrued = referralLeads
    .filter((l) => l.rewardCents && !l.rewardPaid)
    .reduce((s, l) => s + (l.rewardCents ?? 0), 0);
  const paid = referralLeads
    .filter((l) => l.rewardCents && l.rewardPaid)
    .reduce((s, l) => s + (l.rewardCents ?? 0), 0);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Segnalazioni inviate" value={String(referralLeads.length)} />
        <Kpi label="Premi maturati" value={formatEuro(accrued)} tone="gold" hint="in attesa di pagamento" />
        <Kpi label="Premi pagati" value={formatEuro(paid)} tone="good" />
        <Kpi label="Protezione lead" value="90 giorni" hint="dalla data di segnalazione" />
      </div>

      <Section
        title="Link referral"
        description="Da condividere con i locali: la segnalazione viene attribuita automaticamente"
      >
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-stone-200 bg-white p-4">
          <code className="rounded bg-stone-100 px-3 py-2 text-sm">{DEMO_PARTNER.referralLink}</code>
          <button type="button" className="rounded-lg border border-stone-300 px-3 py-2 text-sm font-semibold text-ink hover:bg-stone-50">
            Copia link
          </button>
          <button type="button" className="rounded-lg border border-stone-300 px-3 py-2 text-sm font-semibold text-ink hover:bg-stone-50">
            Scarica materiale commerciale
          </button>
        </div>
      </Section>

      <Section title="Le mie segnalazioni" description="Stato di ogni lead e premio">
        <Table headers={["Cliente", "Città", "Data", "Stato", "Piano", "Premio"]}>
          {referralLeads.map((l) => (
            <tr key={l.id}>
              <td className="px-4 py-3 font-medium text-ink">{l.customerName}</td>
              <td className="px-4 py-3 text-warmgray">{l.city}</td>
              <td className="px-4 py-3 text-warmgray">{l.createdAt}</td>
              <td className="px-4 py-3">
                <Badge tone={statusTone(l.status)}>{l.status}</Badge>
              </td>
              <td className="px-4 py-3 capitalize">{l.plan ?? "—"}</td>
              <td className="px-4 py-3 tabular-nums">
                {l.rewardCents ? `${formatEuro(l.rewardCents)}${l.rewardPaid ? " ✓" : ""}` : "—"}
              </td>
            </tr>
          ))}
        </Table>
      </Section>

      <Section title="Nuovo lead" description="Inserisca un locale da segnalare: protezione 90 giorni se non già presente nel CRM">
        <div id="nuovo-lead">
          <LeadForm />
        </div>
      </Section>
    </>
  );
}
