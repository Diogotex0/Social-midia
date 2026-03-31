import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(
  req: Request,
  { params }: { params: { token: string } }
) {
  const { token } = params;
  const { contentId, action, comment } = await req.json();

  if (!contentId || !action || !["approve", "reject"].includes(action)) {
    return NextResponse.json({ error: "Parâmetros inválidos" }, { status: 400 });
  }

  const { data: client } = await supabaseAdmin
    .from("clients")
    .select("id, name, user_id")
    .eq("portal_token", token)
    .single();

  if (!client) {
    return NextResponse.json({ error: "Portal não encontrado" }, { status: 404 });
  }

  const { data: content } = await supabaseAdmin
    .from("contents")
    .select("id, title")
    .eq("id", contentId)
    .eq("client_id", client.id)
    .single();

  if (!content) {
    return NextResponse.json({ error: "Conteúdo não encontrado" }, { status: 404 });
  }

  const updates =
    action === "approve"
      ? { approval_status: "approved", approved_at: new Date().toISOString(), approval_comment: null }
      : { approval_status: "rejected", approval_comment: comment ?? null, approved_at: null };

  const { error } = await supabaseAdmin
    .from("contents")
    .update(updates)
    .eq("id", contentId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Create notification for the manager
  const isReject = action === "reject";
  await supabaseAdmin.from("notifications").insert({
    user_id: client.user_id,
    title: isReject
      ? `❌ Conteúdo reprovado por ${client.name}`
      : `✅ Conteúdo aprovado por ${client.name}`,
    message: isReject
      ? `"${content.title}"${comment ? ` — Motivo: ${comment}` : " — Sem motivo informado."}`
      : `"${content.title}" foi aprovado e está pronto para publicar.`,
    type: "general",
    read: false,
  });

  return NextResponse.json({ success: true });
}
