import Link from "next/link";
import { demoStore } from "@/lib/demoStore";
import { TicketForm } from "@/components/TicketForm";

export default async function NewTicketPage({
  searchParams,
}: {
  searchParams: Promise<{ equipment?: string }>;
}) {
  const { equipment } = await searchParams;
  const options = demoStore.listEquipment().map((e) => ({ id: e.id, name: e.name }));

  return (
    <div className="max-w-2xl">
      <Link href="/app/ticket" className="text-sm text-warmgray hover:underline">
        ← Ticket
      </Link>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight">Apri un ticket</h1>
      <p className="mt-1 text-sm text-warmgray">
        La centrale operativa RistoCare qualifica la richiesta, contatta il tecnico più adatto e ti
        invia il preventivo. Ti chiederemo anche foto della macchina e della matricola.
      </p>
      <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">
        <TicketForm equipmentOptions={options} defaultEquipmentId={equipment} />
      </div>
    </div>
  );
}
