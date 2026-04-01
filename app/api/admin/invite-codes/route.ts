import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const { data } = await supabaseAdmin
    .from("invite_codes")
    .select("*")
    .order("created_at", { ascending: false });
  return NextResponse.json(data ?? []);
}

export async function POST(request: NextRequest) {
  const { code, label } = await request.json();
  const { data, error } = await supabaseAdmin
    .from("invite_codes")
    .insert({ code, label })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ code: data }, { status: 201 });
}
