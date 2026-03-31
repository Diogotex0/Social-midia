"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Notification } from "@/types";
import { formatRelativeTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  Bell, AlertTriangle, DollarSign, FileX, Info, CheckCheck, Trash2,
} from "lucide-react";

interface NotifWithClient extends Notification {
  clients: { name: string; color: string } | null;
}

const TYPE_CONFIG = {
  delayed_post: { icon: AlertTriangle, color: "text-red-400", bg: "bg-red-500/10", label: "Post atrasado" },
  no_content: { icon: FileX, color: "text-yellow-400", bg: "bg-yellow-500/10", label: "Sem conteúdo" },
  payment_delayed: { icon: DollarSign, color: "text-red-400", bg: "bg-red-500/10", label: "Pag. atrasado" },
  payment_due: { icon: DollarSign, color: "text-yellow-400", bg: "bg-yellow-500/10", label: "Pag. próximo" },
  general: { icon: Info, color: "text-blue-400", bg: "bg-blue-500/10", label: "Geral" },
};

export function NotificationsList({ initialNotifications }: { initialNotifications: NotifWithClient[] }) {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState(initialNotifications);

  async function markAllRead() {
    const supabase = createClient();
    const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
    if (unreadIds.length === 0) return;
    const { error } = await supabase.from("notifications").update({ read: true }).in("id", unreadIds);
    if (!error) {
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      toast({ title: "Todas marcadas como lidas" });
    }
  }

  async function markRead(id: string) {
    const supabase = createClient();
    await supabase.from("notifications").update({ read: true }).eq("id", id);
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  }

  async function handleDelete(id: string) {
    const supabase = createClient();
    await supabase.from("notifications").delete().eq("id", id);
    setNotifications(notifications.filter(n => n.id !== id));
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-4">
          <Bell className="w-8 h-8 text-green-400" />
        </div>
        <h3 className="text-lg font-semibold mb-1">Sem notificações</h3>
        <p className="text-muted-foreground text-sm">Tudo em ordem! Use o botão acima para verificar alertas.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-3xl">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {unreadCount > 0 ? `${unreadCount} não lidas` : "Todas lidas"}
        </p>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllRead}>
            <CheckCheck className="w-4 h-4 mr-2" />
            Marcar todas como lidas
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {notifications.map((notif) => {
          const config = TYPE_CONFIG[notif.type] ?? TYPE_CONFIG.general;
          const Icon = config.icon;

          return (
            <div
              key={notif.id}
              className={cn(
                "flex items-start gap-4 p-4 rounded-xl border transition-colors group",
                notif.read
                  ? "border-border bg-card opacity-60 hover:opacity-100"
                  : "border-border bg-card hover:border-border/80"
              )}
              onClick={() => !notif.read && markRead(notif.id)}
            >
              <div className={`p-2 rounded-lg ${config.bg} shrink-0`}>
                <Icon className={`w-4 h-4 ${config.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{notif.title}</p>
                      {!notif.read && (
                        <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{notif.message}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-[10px]">{config.label}</Badge>
                      {notif.clients && (
                        <span
                          className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                          style={{
                            backgroundColor: (notif.clients.color ?? "#6366f1") + "25",
                            color: notif.clients.color ?? "#6366f1",
                          }}
                        >
                          {notif.clients.name}
                        </span>
                      )}
                      <span className="text-[10px] text-muted-foreground">{formatRelativeTime(notif.created_at)}</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-7 h-7 opacity-0 group-hover:opacity-100 shrink-0"
                    onClick={(e) => { e.stopPropagation(); handleDelete(notif.id); }}
                  >
                    <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
