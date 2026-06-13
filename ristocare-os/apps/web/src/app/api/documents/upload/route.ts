import { getRepository, getSession } from "@/lib/auth/session";
import { getSupabaseClient } from "@/lib/auth/session";
import { demoStore } from "@/lib/demo-store";
import { uploadEquipmentDocument } from "@/lib/storage/upload";
import { jsonError, jsonOk } from "@/lib/api-response";

export async function POST(request: Request) {
  const form = await request.formData();
  const equipmentId = form.get("equipment_id") as string;
  const documentType = form.get("document_type") as string;
  const file = form.get("file") as File | null;

  if (!equipmentId || !file || !documentType) {
    return jsonError("equipment_id, document_type e file sono obbligatori");
  }

  const repo = await getRepository();
  const equipment = await repo.getEquipment(equipmentId);
  if (!equipment) return jsonError("Attrezzatura non trovata", 404);

  const session = await getSession();
  const orgId = session.orgId ?? equipment.organization_id ?? demoStore.orgId;

  let fileUrl = `demo://${file.name}`;

  try {
    const supabase = await getSupabaseClient();
    const uploaded = await uploadEquipmentDocument(supabase, orgId, equipmentId, file);
    fileUrl = uploaded.publicUrl;
  } catch {
    // demo mode fallback
  }

  const doc = await repo.addDocument({
    equipment_id: equipmentId,
    document_type: documentType as "manual" | "invoice" | "photo" | "other",
    file_url: fileUrl,
    file_name: file.name,
  });

  return jsonOk(doc, 201);
}
