import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Header } from "@/components/layout/header";
import { CalendarView } from "@/components/calendar/calendar-view";

export default async function CalendarPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: contents }, { data: clients }] = await Promise.all([
    supabase
      .from("contents")
      .select("id, title, platform, format, status, scheduled_at, client_id, clients(id, name, color)")
      .eq("user_id", user.id)
      .not("scheduled_at", "is", null)
      .order("scheduled_at", { ascending: true }),
    supabase
      .from("clients")
      .select("id, name, color")
      .eq("user_id", user.id)
      .eq("status", "active")
      .order("name"),
  ]);

  return (
    <div className="flex flex-col h-full">
      <Header title="Calendário de Conteúdo" subtitle="Visualize e gerencie seus posts" />
      <div className="flex-1 p-6">
        <CalendarView contents={contents ?? []} clients={clients ?? []} />
      </div>
    </div>
  );
}
