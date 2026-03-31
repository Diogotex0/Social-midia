import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  const { codeId, userId } = await request.json();
  if (!codeId) return NextResponse.json({ ok: false });

  await supabaseAdmin
    .from("invite_codes")
    .update({ used: true, used_by: userId ?? null })
    .eq("id", codeId);

  return NextResponse.json({ ok: true });
}
