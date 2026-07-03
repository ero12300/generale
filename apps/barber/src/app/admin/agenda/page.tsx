import { AgendaView } from "./agenda-view";

export const dynamic = "force-dynamic";

export default function AgendaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Agenda</h1>
        <p className="mt-1 text-sm text-muted">
          Conferma le richieste, completa i servizi e incassa in un tocco.
        </p>
      </div>
      <AgendaView />
    </div>
  );
}
