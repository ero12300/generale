import { InvoiceUpload } from "@/components/invoices/invoice-upload";
import { getAuthContext, getSupabaseClient } from "@/lib/auth/session";
import { isSupabaseConfigured } from "@/lib/utils";
import { PageContainer, PageHeader } from "@/components/layout/page-header";

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
    <PageContainer>
      <PageHeader
        eyebrow="Documenti"
        title="Fatture fornitori"
        subtitle="Carica PDF o foto — estrazione AI in arrivo (Fase 3)"
      />
      <InvoiceUpload initial={initial} />
    </PageContainer>
  );
}
