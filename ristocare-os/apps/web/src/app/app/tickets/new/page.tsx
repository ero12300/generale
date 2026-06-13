import { Suspense } from "react";
import NewTicketForm from "./new-ticket-form";

export const metadata = { title: "Nuovo ticket" };

export default function NewTicketPage() {
  return (
    <Suspense fallback={<div className="p-8 text-zinc-500">Caricamento...</div>}>
      <NewTicketForm />
    </Suspense>
  );
}
