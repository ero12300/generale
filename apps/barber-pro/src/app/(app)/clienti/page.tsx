import { listClients } from "@/lib/data/repo";
import { ClientsView } from "@/components/clients/ClientsView";

export default async function ClientiPage() {
  const clients = await listClients();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl gold-shine">Clienti</h1>
        <p className="text-ink-400 text-sm mt-1">
          Il tuo CRM: cerca, filtra, gestisci le schede dei tuoi clienti.
        </p>
      </div>
      <ClientsView initial={clients} />
    </div>
  );
}
