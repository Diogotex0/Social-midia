import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Header } from "@/components/layout/header";
import { ContentsList } from "@/components/contents/contents-list";
import { NewContentButton } from "@/components/contents/new-content-button";

export default async function ContentsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: contents }, { data: clients }] = await Promise.all([
    supabase
      .from("contents")
      .select("*, clients(id, name, color)")
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
      <Header
        title="Conteúdos"
        subtitle={`${contents?.length ?? 0} conteúdos`}
        action={<NewContentButton clients={clients ?? []} />}
      />
      <div className="flex-1 p-6">
        <ContentsList initialContents={contents ?? []} clients={clients ?? []} />
      </div>
    </div>
  );
}
