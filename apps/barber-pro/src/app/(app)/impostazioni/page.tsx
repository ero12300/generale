import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { getShop, listStaff } from "@/lib/data/repo";
import { StaffManager } from "@/components/settings/StaffManager";
import { Badge } from "@/components/ui/Badge";

export default async function ImpostazioniPage() {
  const [shop, staff] = await Promise.all([getShop(), listStaff()]);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl gold-shine">Impostazioni</h1>
        <p className="text-ink-400 text-sm mt-1">Configura il tuo salone.</p>
      </div>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Informazioni salone</CardTitle>
            <p className="text-xs text-ink-500 mt-0.5">Dati mostrati sulla pagina pubblica di prenotazione.</p>
          </div>
        </CardHeader>
        <CardBody>
          <dl className="grid sm:grid-cols-2 gap-4 text-sm">
            <Item label="Nome" value={shop?.name} />
            <Item label="Indirizzo" value={shop?.address} />
            <Item label="Telefono" value={shop?.phone} />
            <Item label="Slug pagina pubblica" value={shop?.slug ? `/book/${shop.slug}` : "—"} />
            <Item label="Fuso orario" value={shop?.timezone} />
            <Item label="Piano attivo" value={<Badge tone={shop?.plan === "pro" ? "gold" : "default"}>{shop?.plan?.toUpperCase() ?? "—"}</Badge>} />
          </dl>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Team</CardTitle>
            <p className="text-xs text-ink-500 mt-0.5">Barbieri e postazioni</p>
          </div>
        </CardHeader>
        <CardBody>
          <StaffManager initial={staff} />
        </CardBody>
      </Card>
    </div>
  );
}

function Item({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wider text-ink-500">{label}</dt>
      <dd className="text-ink-100 mt-1">{value ?? "—"}</dd>
    </div>
  );
}
