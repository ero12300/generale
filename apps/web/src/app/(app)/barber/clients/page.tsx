import { ClientsManager } from "@/components/barber/clients-manager";

export default function BarberClientsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Clienti</h1>
        <p className="text-sm text-zinc-400 mt-1">
          CRM premium con storico, contatti e codici referral.
        </p>
      </div>
      <ClientsManager />
    </div>
  );
}
