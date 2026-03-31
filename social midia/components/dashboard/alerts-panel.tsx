import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, AlertTriangle, DollarSign, FileX, Info } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";
import Link from "next/link";
import type { Notification } from "@/types";

const ICON_MAP = {
  delayed_post: { icon: AlertTriangle, color: "text-red-400" },
  no_content: { icon: FileX, color: "text-yellow-400" },
  payment_delayed: { icon: DollarSign, color: "text-red-400" },
  payment_due: { icon: DollarSign, color: "text-yellow-400" },
  general: { icon: Info, color: "text-blue-400" },
};

export function AlertsPanel({ notifications }: { notifications: Notification[] }) {
  if (notifications.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Alertas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Bell className="w-8 h-8 text-muted-foreground/40 mb-2" />
            <p className="text-sm text-muted-foreground">Sem alertas pendentes</p>
            <p className="text-xs text-muted-foreground mt-1">Tudo em ordem!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-semibold">Alertas</CardTitle>
        <Link href="/notifications" className="text-xs text-primary hover:underline">
          Ver todos
        </Link>
      </CardHeader>
      <CardContent className="space-y-2">
        {notifications.map((notif) => {
          const { icon: Icon, color } = ICON_MAP[notif.type] ?? ICON_MAP.general;
          return (
            <div key={notif.id} className="flex items-start gap-3 p-3 rounded-lg border border-border/50 hover:border-border transition-colors">
              <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${color}`} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{notif.title}</p>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{notif.message}</p>
                <p className="text-[10px] text-muted-foreground/60 mt-1">{formatRelativeTime(notif.created_at)}</p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
