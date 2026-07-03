"use client";

import { useTransition } from "react";
import { setBookingStatus } from "@/app/actions";

export function BookingActions({ bookingId }: { bookingId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex gap-2">
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            await setBookingStatus(bookingId, "completata");
          })
        }
        className="rounded-lg border border-emerald-500/40 px-3 py-1.5 text-xs font-medium text-emerald-300 transition hover:bg-emerald-500/10 focus:outline-none focus:ring-2 focus:ring-emerald-400 disabled:opacity-50 cursor-pointer"
      >
        Completata
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            await setBookingStatus(bookingId, "annullata");
          })
        }
        className="rounded-lg border border-red-500/40 px-3 py-1.5 text-xs font-medium text-red-300 transition hover:bg-red-500/10 focus:outline-none focus:ring-2 focus:ring-red-400 disabled:opacity-50 cursor-pointer"
      >
        Annulla
      </button>
    </div>
  );
}
