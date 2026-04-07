import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CONTENT_STATUSES, PLATFORMS } from "@/types";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { FileText, ArrowRight } from "lucide-react";

interface ContentWithClient {
  id: string;
  title: string;
  platform: string;
  status: string;
  scheduled_at: string | null;
  clients: { name: string; color: string } | null;
}

export function RecentContents({ contents }: { contents: ContentWithClient[] }) {
  if (contents.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Conteúdos Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <FileText className="w-8 h-8 text-muted-foreground/40 mb-2" />
            <p className="text-sm text-muted-foreground">Nenhum conteúdo criado ainda</p>
            <Link href="/contents" className="text-xs text-primary hover:underline mt-1">
              Criar primeiro conteúdo →
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-semibold">Conteúdos Recentes</CardTitle>
        <Link href="/contents" className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors">
          Ver todos <ArrowRight className="w-3 h-3" />
        </Link>
      </CardHeader>
      <CardContent className="space-y-2">
        {contents.filter(Boolean).map((content) => {
          const statusInfo = CONTENT_STATUSES.find(s => s.value === content?.status);
          const platformInfo = PLATFORMS.find(p => p.value === content?.platform);
          return (
            <Link
              key={content.id}
              href={`/contents/${content.id}`}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors group"
            >
              <div
                className="w-1 h-10 rounded-full flex-shrink-0"
                style={{ backgroundColor: content.clients?.color ?? "#6366f1" }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">{content.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-muted-foreground">{content.clients?.name}</span>
                  <span className="text-muted-foreground/40">·</span>
                  <span className="text-xs text-muted-foreground">{platformInfo?.label ?? content.platform}</span>
                  {content.scheduled_at && (
                    <>
                      <span className="text-muted-foreground/40">·</span>
                      <span className="text-xs text-muted-foreground">{formatDate(content.scheduled_at)}</span>
                    </>
                  )}
                </div>
              </div>
              <Badge className={statusInfo?.color}>{statusInfo?.label ?? content.status}</Badge>
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}
