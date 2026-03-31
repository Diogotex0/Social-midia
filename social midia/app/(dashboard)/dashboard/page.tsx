import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Header } from "@/components/layout/header";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { RecentContents } from "@/components/dashboard/recent-contents";
import { UpcomingTasks } from "@/components/dashboard/upcoming-tasks";
import { AlertsPanel } from "@/components/dashboard/alerts-panel";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();

  const [
    { count: totalClients },
    { count: activeClients },
    { count: postsThisMonth },
    { count: delayedPosts },
    { data: upcomingContents },
    { data: recentContents },
    { data: finances },
    { data: notifications },
  ] = await Promise.all([
    supabase.from("clients").select("id", { count: "exact", head: true }).eq("user_id", user.id),
    supabase.from("clients").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("status", "active"),
    supabase.from("contents").select("id", { count: "exact", head: true }).eq("user_id", user.id).gte("scheduled_at", firstDay).lte("scheduled_at", lastDay),
    supabase.from("contents").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("status", "delayed"),
    supabase.from("contents").select("*, clients(name, color)").eq("user_id", user.id).in("status", ["planned", "in_production"]).order("scheduled_at", { ascending: true }).limit(5),
    supabase.from("contents").select("*, clients(name, color)").eq("user_id", user.id).order("created_at", { ascending: false }).limit(5),
    supabase.from("finances").select("amount, status").eq("user_id", user.id).eq("month", now.getMonth() + 1).eq("year", now.getFullYear()),
    supabase.from("notifications").select("*").eq("user_id", user.id).eq("read", false).order("created_at", { ascending: false }).limit(5),
  ]);

  const monthlyRevenue = finances?.filter(f => f.status === "paid").reduce((acc, f) => acc + f.amount, 0) ?? 0;
  const pendingRevenue = finances?.filter(f => f.status !== "paid").reduce((acc, f) => acc + f.amount, 0) ?? 0;

  return (
    <div className="flex flex-col h-full">
      <Header title="Dashboard" subtitle={`Bem-vindo de volta! Hoje é ${new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}`} />
      <div className="flex-1 p-6 space-y-6">
        <DashboardStats
          totalClients={totalClients ?? 0}
          activeClients={activeClients ?? 0}
          postsThisMonth={postsThisMonth ?? 0}
          delayedPosts={delayedPosts ?? 0}
          monthlyRevenue={monthlyRevenue}
          pendingRevenue={pendingRevenue}
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <RecentContents contents={recentContents ?? []} />
            <UpcomingTasks contents={upcomingContents ?? []} />
          </div>
          <div>
            <AlertsPanel notifications={notifications ?? []} />
          </div>
        </div>
      </div>
    </div>
  );
}
