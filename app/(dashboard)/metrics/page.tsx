import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Header } from "@/components/layout/header";
import { MetricsBoard } from "@/components/metrics/metrics-board";

export default async function MetricsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: metrics }, { data: clients }] = await Promise.all([
    supabase
      .from("metrics")
      .select("*, contents(id, title, platform, clients(name, color))")
      .eq("user_id", user.id)
      .order("recorded_at", { ascending: false })
      .limit(50),
    supabase
      .from("clients")
      .select("id, name, color")
      .eq("user_id", user.id)
      .eq("status", "active")
      .order("name"),
  ]);

  return (
    <div className="flex flex-col h-full">
      <Header title="Métricas" subtitle="Acompanhe o desempenho dos seus conteúdos" />
      <div className="flex-1 p-6">
        <MetricsBoard initialMetrics={metrics ?? []} clients={clients ?? []} />
      </div>
    </div>
  );
}
