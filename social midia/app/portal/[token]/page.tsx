import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import { PortalClientView } from "./portal-client-view";

export const dynamic = "force-dynamic";

export default async function PortalPage({ params }: { params: { token: string } }) {
  const { token } = params;

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: client, error: clientError } = await supabaseAdmin
    .from("clients")
    .select("id, name, niche, color, instagram")
    .eq("portal_token", token)
    .single();

  if (clientError || !client) notFound();

  const { data: contents, error: contentsError } = await supabaseAdmin
    .from("contents")
    .select("id, title, caption, hashtags, pillar, platform, format, scheduled_at, approval_status, approval_comment, approved_at")
    .eq("client_id", client.id)
    .in("approval_status", ["pending", "approved", "rejected"])
    .order("scheduled_at", { ascending: true });

  console.log("[portal] client:", client.id, "contents:", contents, "error:", contentsError);

  return (
    <PortalClientView
      token={token}
      client={client}
      initialContents={contents ?? []}
    />
  );
}
