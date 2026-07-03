import { StoreProvider } from "@/lib/store";
import { BookingClient } from "./booking-client";

export default function PublicBookingPage() {
  return (
    <StoreProvider>
      <BookingClient />
    </StoreProvider>
  );
}
