import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Header } from "@/components/layout/header";
import { FeedPreview } from "@/components/feed/feed-preview";

export default async function FeedPreviewPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: contents }, { data: clients }] = await Promise.all([
    supabase
      .from("contents")
      .select("id, title, caption, hashtags, platform, status, scheduled_at, client_id, media_urls, clients(id, name, color)")
      .eq("user_id", user.id)
      .order("scheduled_at", { ascending: true, nullsFirst: false }),
    supabase
      .from("clients")
      .select("id, name, color")
      .eq("user_id", user.id)
      .eq("status", "active")
      .order("name"),
  ]);

  return (
    <div className="flex flex-col h-full">
      <Header title="Feed Preview" subtitle="Visualize como vai ficar seu feed" />
      <div className="flex-1 p-4 sm:p-6">
        <FeedPreview initialContents={contents ?? []} clients={clients ?? []} />
      </div>
    </div>
  );
}
