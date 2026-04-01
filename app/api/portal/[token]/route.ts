import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  const { data: client, error: clientError } = await supabaseAdmin
    .from("clients")
    .select("id, name, niche, color, instagram")
    .eq("portal_token", token)
    .single();

  if (clientError || !client) {
    return NextResponse.json({ error: "Portal não encontrado" }, { status: 404 });
  }

  const { data: contents } = await supabaseAdmin
    .from("contents")
    .select("id, title, caption, hashtags, pillar, platform, format, scheduled_at, approval_status, approval_comment, approved_at")
    .eq("client_id", client.id)
    .in("approval_status", ["pending", "approved", "rejected"])
    .order("scheduled_at", { ascending: true });

  return NextResponse.json({ client, contents: contents ?? [] });
}
