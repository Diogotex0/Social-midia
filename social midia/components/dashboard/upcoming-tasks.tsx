import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CONTENT_STATUSES } from "@/types";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";

interface ContentWithClient {
  id: string;
  title: string;
  platform: string;
  status: string;
  scheduled_at: string | null;
  clients: { name: string; color: string } | null;
}

export function UpcomingTasks({ contents }: { contents: ContentWithClient[] }) {
  if (contents.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Próximas Tarefas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Calendar className="w-8 h-8 text-muted-foreground/40 mb-2" />
            <p className="text-sm text-muted-foreground">Sem tarefas pendentes</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-semibold">Próximas Tarefas</CardTitle>
        <Link href="/calendar" className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors">
          Calendário <ArrowRight className="w-3 h-3" />
        </Link>
      </CardHeader>
      <CardContent className="space-y-2">
        {contents.map((content) => {
          const statusInfo = CONTENT_STATUSES.find(s => s.value === content.status);
          return (
            <div key={content.id} className="flex items-center gap-3 p-3 rounded-lg border border-border/50">
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: content.clients?.color ?? "#6366f1" }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{content.title}</p>
                <p className="text-xs text-muted-foreground">{content.clients?.name}</p>
              </div>
              <div className="text-right flex-shrink-0">
                {content.scheduled_at && (
                  <p className="text-xs text-muted-foreground">{formatDate(content.scheduled_at)}</p>
                )}
                <Badge className={`mt-1 ${statusInfo?.color}`} >{statusInfo?.label}</Badge>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
