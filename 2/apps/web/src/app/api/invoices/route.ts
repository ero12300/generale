import { NextResponse } from "next/server";
import { requireAuthContext, getSupabaseClient } from "@/lib/auth/session";

export async function GET() {
  try {
    const auth = await requireAuthContext();
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .schema("profit")
      .from("supplier_invoices")
      .select("id, invoice_number, invoice_date, total_cents, document_path, status, created_at")
      .eq("organization_id", auth.organizationId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json({ data: data ?? [] });
  } catch {
    return NextResponse.json({ error: "Non autenticato" }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requireAuthContext();
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "File mancante" }, { status: 400 });
    }

    const allowed = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      return NextResponse.json({ error: "Formato non supportato" }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File troppo grande (max 10MB)" }, { status: 400 });
    }

    const supabase = await getSupabaseClient();
    const ext = file.name.split(".").pop() ?? "pdf";
    const path = `${auth.organizationId}/${Date.now()}-${crypto.randomUUID()}.${ext}`;

    const buffer = Buffer.from(await file.arrayBuffer());
    const { error: uploadError } = await supabase.storage
      .from("profit-invoices")
      .upload(path, buffer, { contentType: file.type, upsert: false });

    if (uploadError) throw uploadError;

    const { data: invoice, error: dbError } = await supabase
      .schema("profit")
      .from("supplier_invoices")
      .insert({
        organization_id: auth.organizationId,
        document_path: path,
        status: "pending",
      })
      .select()
      .single();

    if (dbError) throw dbError;

    return NextResponse.json({ data: invoice }, { status: 201 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Errore upload";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
