import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Usa service role para acessar invite_codes sem RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  const { code } = await request.json();

  if (!code?.trim()) {
    return NextResponse.json({ valid: false, error: "Código obrigatório" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("invite_codes")
    .select("id, code, used, active, label")
    .eq("code", code.trim())
    .single();

  if (error || !data) {
    return NextResponse.json({ valid: false, error: "Código não encontrado" }, { status: 401 });
  }

  if (!data.active) {
    return NextResponse.json({ valid: false, error: "Este código foi desativado" }, { status: 401 });
  }

  if (data.used) {
    return NextResponse.json({ valid: false, error: "Este código já foi utilizado" }, { status: 401 });
  }

  return NextResponse.json({ valid: true, codeId: data.id });
}
