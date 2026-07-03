import { NextResponse } from "next/server";
import { getStore } from "@/lib/store";
import { handleRouteError } from "@/lib/api-helpers";

export async function GET() {
  try {
    const store = await getStore();
    const [services, barbers, settings] = await Promise.all([
      store.listServices(),
      store.listBarbers(),
      store.getSettings(),
    ]);
    return NextResponse.json({
      services,
      barbers,
      shopName: settings.shopName,
      closedWeekdays: settings.closedWeekdays,
    });
  } catch (error) {
    return handleRouteError(error);
  }
}
