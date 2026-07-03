import { ClientsView } from "./clients-view";

export const dynamic = "force-dynamic";

export default function ClientiPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Database clienti</h1>
        <p className="mt-1 text-sm text-muted">
          Ogni cliente ha un codice &quot;porta un amico&quot; personale da condividere.
        </p>
      </div>
      <ClientsView />
    </div>
  );
}
