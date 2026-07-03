import { NextResponse } from "next/server";
import { getStore } from "@/lib/store";
import { computeStats } from "@/lib/stats";
import { planHasCapability } from "@/lib/plans";
import { handleRouteError } from "@/lib/api-helpers";

export async function GET() {
  try {
    const store = await getStore();
    const [payments, appointments, clients, settings] = await Promise.all([
      store.listPayments(),
      store.listAppointments(),
      store.listClients(),
      store.getSettings(),
    ]);
    const stats = computeStats(payments, appointments, clients);
    if (!planHasCapability(settings.plan, "report_avanzati")) {
      // Report avanzati solo nel piano Pro
      stats.topServices = [];
      stats.methodBreakdown = [];
    }
    return NextResponse.json({ stats, plan: settings.plan });
  } catch (error) {
    return handleRouteError(error);
  }
}
