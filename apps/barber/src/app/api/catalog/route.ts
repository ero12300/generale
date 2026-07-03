import { store } from "@/lib/store";
import { ok } from "@/lib/api-response";

export async function GET() {
  const org = store.getOrg();
  return ok({
    services: store.listServices(),
    staff: store.listStaff(),
    org,
  });
}
