import { InvoiceUpload } from "@/components/invoices/invoice-upload";
import { getAuthContext, getSupabaseClient } from "@/lib/auth/session";
import { isSupabaseConfigured } from "@/lib/utils";

export default async function FatturePage() {
  let initial: { id: string; document_path: string | null; status: string; created_at: string }[] = [];

  if (isSupabaseConfigured()) {
    const auth = await getAuthContext();
    if (auth) {
      const supabase = await getSupabaseClient();
      const { data } = await supabase
        .schema("profit")
        .from("supplier_invoices")
        .select("id, document_path, status, created_at")
        .eq("organization_id", auth.organizationId)
        .order("created_at", { ascending: false })
        .limit(20);
      initial = data ?? [];
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Fatture fornitori</h1>
        <p className="text-zinc-400 text-sm mt-1">
          Carica PDF o foto — estrazione AI in arrivo (Fase 3)
        </p>
      </div>
      <InvoiceUpload initial={initial} />
    </div>
  );
}
