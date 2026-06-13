import { getRepository, getSession } from "@/lib/auth/session";
import { demoStore } from "@/lib/demo-store";
import { jsonOk } from "@/lib/api-response";

export async function GET() {
  const session = await getSession();
  const repo = await getRepository();
  const orgId = session.orgId ?? demoStore.orgId;
  return jsonOk(await repo.listEquipment(orgId));
}
