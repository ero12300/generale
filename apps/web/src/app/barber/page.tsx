import { BarberPremiumApp } from "@/components/barber/barber-premium-app";
import { getBarberRepository } from "@/lib/barber/repository";

export const dynamic = "force-dynamic";

export default async function BarberPage() {
  const repository = getBarberRepository();
  const data = await repository.getDashboardData();
  return <BarberPremiumApp initialData={data} />;
}
