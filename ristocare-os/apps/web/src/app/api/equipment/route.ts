import { repository } from "@/lib/data/repository";
import { jsonOk } from "@/lib/api-response";

export async function GET() {
  return jsonOk(repository.listEquipment("org-demo-001"));
}
