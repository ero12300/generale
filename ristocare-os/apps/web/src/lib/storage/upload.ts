import type { SupabaseClient } from "@supabase/supabase-js";

export async function uploadEquipmentDocument(
  supabase: SupabaseClient,
  orgId: string,
  equipmentId: string,
  file: File
): Promise<{ path: string; publicUrl: string }> {
  const ext = file.name.split(".").pop() ?? "bin";
  const path = `${orgId}/${equipmentId}/${Date.now()}.${ext}`;

  const { error } = await supabase.storage.from("equipment-documents").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type,
  });
  if (error) throw error;

  const { data: signed, error: signError } = await supabase.storage
    .from("equipment-documents")
    .createSignedUrl(path, 60 * 60 * 24 * 365);
  if (signError) throw signError;
  return { path, publicUrl: signed.signedUrl };
}

export async function uploadPdf(
  supabase: SupabaseClient,
  bucket: "quotes-pdf" | "reports-pdf",
  path: string,
  bytes: Uint8Array
): Promise<string> {
  const { error } = await supabase.storage.from(bucket).upload(path, bytes, {
    contentType: "application/pdf",
    upsert: true,
  });
  if (error) throw error;
  const { data: signed, error: signError } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, 60 * 60 * 24 * 365);
  if (signError) throw signError;
  return signed.signedUrl;
}
