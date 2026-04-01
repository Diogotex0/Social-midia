import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Header } from "@/components/layout/header";
import { NotificationsList } from "@/components/notifications/notifications-list";
import { GenerateNotificationsButton } from "@/components/notifications/generate-notifications-button";

export default async function NotificationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: notifications } = await supabase
    .from("notifications")
    .select("*, clients(name, color)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  const unreadCount = notifications?.filter(n => !n.read).length ?? 0;

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Notificações"
        subtitle={unreadCount > 0 ? `${unreadCount} não lidas` : "Tudo em dia"}
        action={<GenerateNotificationsButton />}
      />
      <div className="flex-1 p-6">
        <NotificationsList initialNotifications={notifications ?? []} />
      </div>
    </div>
  );
}
