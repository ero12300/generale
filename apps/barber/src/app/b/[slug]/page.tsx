import { BookingClient } from "@/components/booking/booking-client";

/**
 * Pagina pubblica di prenotazione.
 *
 * NOTA: in demo mode il negozio è unico (barberia-del-corso).
 * Con Firebase configurato: fetch di `shops` where `slug == slug`.
 */

type Params = { params: Promise<{ slug: string }> };

// In demo/build server-side non abbiamo accesso al localStorage.
// Rendiamo la pagina client-only montando il componente.
export default async function PublicBookingPage({ params }: Params) {
  const { slug } = await params;
  void slug; // in demo mode è sempre `barberia-del-corso`; il client gestisce il resto.
  return <BookingClient />;
}

export const dynamic = "force-dynamic";
