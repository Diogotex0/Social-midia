import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Header } from "@/components/layout/header";
import { IdeasBoard } from "@/components/ideas/ideas-board";
import { NewIdeaButton } from "@/components/ideas/new-idea-button";

export default async function IdeasPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: ideas }, { data: clients }] = await Promise.all([
    supabase
      .from("ideas")
      .select("*, clients(id, name, color)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
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
        title="Banco de Ideias"
        subtitle={`${ideas?.length ?? 0} ideias salvas`}
        action={<NewIdeaButton clients={clients ?? []} />}
      />
      <div className="flex-1 p-6">
        <IdeasBoard initialIdeas={ideas ?? []} clients={clients ?? []} />
      </div>
    </div>
  );
}
