"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient as createSupabaseClient } from "@/lib/supabase/client";
import { CONTENT_STATUSES, PLATFORMS, FORMATS } from "@/types";
import type { Content } from "@/types";
import { formatDate } from "@/lib/utils";
import { ContentFormDialog } from "./content-form-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  Search, MoreHorizontal, Pencil, Trash2, FileText, Calendar,
  Send, Check, X, Clock, MessageSquare,
} from "lucide-react";

interface ContentWithClient extends Content {
  clients: { id: string; name: string; color: string } | null;
  approval_status?: string | null;
  approval_comment?: string | null;
}

interface ClientRef { id: string; name: string; color: string }

interface Props {
  initialContents: ContentWithClient[];
  clients: ClientRef[];
}

function getWeekGroup(scheduledAt: string | null): { key: string; label: string } {
  if (!scheduledAt) return { key: "sem-data", label: "Sem data definida" };

  const date = new Date(scheduledAt);
  const day = date.getUTCDate();
  const month = date.toLocaleDateString("pt-BR", { month: "long", timeZone: "UTC" });
  const year = date.getUTCFullYear();

  let weekNum: number;
  let startDay: number;
  let endDay: number;

  if (day <= 7) {
    weekNum = 1; startDay = 1; endDay = 7;
  } else if (day <= 14) {
    weekNum = 2; startDay = 8; endDay = 14;
  } else if (day <= 21) {
    weekNum = 3; startDay = 15; endDay = 21;
  } else {
    weekNum = 4; startDay = 22;
    endDay = new Date(year, date.getUTCMonth() + 1, 0).getDate();
  }

  const key = `${year}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-w${weekNum}`;
  const label = `Semana ${weekNum} — ${startDay} a ${endDay} de ${month.charAt(0).toUpperCase() + month.slice(1)} ${year}`;
  return { key, label };
}

const APPROVAL_INFO: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  draft:    { label: "Rascunho",  color: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",   icon: <FileText className="w-3 h-3" /> },
  pending:  { label: "Aguard. aprovação", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", icon: <Clock className="w-3 h-3" /> },
  approved: { label: "Aprovado",  color: "bg-green-500/20 text-green-400 border-green-500/30",  icon: <Check className="w-3 h-3" /> },
  rejected: { label: "Reprovado", color: "bg-red-500/20 text-red-400 border-red-500/30",       icon: <X className="w-3 h-3" /> },
};

export function ContentsList({ initialContents, clients }: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const [contents, setContents] = useState(initialContents);

  useEffect(() => {
    setContents(initialContents);
  }, [initialContents]);

  const [search, setSearch] = useState("");
  const [filterMonth, setFilterMonth] = useState(() => {
    const now = new Date();
    const currentYM = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    // Use current month if it has content, otherwise use first available month
    const months = Array.from(new Set(
      initialContents
        .filter(c => c.scheduled_at)
        .map(c => {
          const d = new Date(c.scheduled_at!);
          return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
        })
    )).sort();
    return months.includes(currentYM) ? currentYM : (months[0] ?? "all");
  });
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterClient, setFilterClient] = useState("all");
  const [filterPlatform, setFilterPlatform] = useState("all");
  const [filterApproval, setFilterApproval] = useState("all");
  const [editingContent, setEditingContent] = useState<Content | null>(null);
  const [rejectionModal, setRejectionModal] = useState<{ title: string; comment: string } | null>(null);

  // Build list of months that have contents
  const availableMonths = Array.from(new Set(
    contents
      .filter(c => c.scheduled_at)
      .map(c => {
        const d = new Date(c.scheduled_at!);
        return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
      })
  )).sort();

  function monthLabel(ym: string) {
    const [year, month] = ym.split("-");
    const date = new Date(Number(year), Number(month) - 1, 1);
    const label = date.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
    return label.charAt(0).toUpperCase() + label.slice(1);
  }

  const filtered = contents.filter((c) => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.clients?.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || c.status === filterStatus;
    const matchClient = filterClient === "all" || c.client_id === filterClient;
    const matchPlatform = filterPlatform === "all" || c.platform === filterPlatform;
    const matchApproval = filterApproval === "all" || (c.approval_status ?? "draft") === filterApproval;
    const matchMonth = filterMonth === "all"
      ? true
      : c.scheduled_at
        ? `${new Date(c.scheduled_at).getUTCFullYear()}-${String(new Date(c.scheduled_at).getUTCMonth() + 1).padStart(2, "0")}` === filterMonth
        : false;
    return matchSearch && matchStatus && matchClient && matchPlatform && matchApproval && matchMonth;
  });

  async function handleDelete(id: string) {
    if (!confirm("Excluir este conteúdo?")) return;
    const supabase = createSupabaseClient();
    const { error } = await supabase.from("contents").delete().eq("id", id);
    if (error) {
      toast({ title: "Erro ao excluir", variant: "destructive" });
    } else {
      setContents(contents.filter(c => c.id !== id));
      toast({ title: "Conteúdo excluído" });
    }
  }

  async function handleStatusChange(id: string, newStatus: string) {
    const supabase = createSupabaseClient();
    const { error } = await supabase.from("contents").update({ status: newStatus }).eq("id", id);
    if (!error) {
      setContents(contents.map(c => c.id === id ? { ...c, status: newStatus as Content["status"] } : c));
    }
  }

  async function handleSendForApproval(id: string) {
    const supabase = createSupabaseClient();
    const { error } = await supabase.from("contents").update({ approval_status: "pending" }).eq("id", id);
    if (error) {
      toast({ title: "Erro ao enviar", description: error.message, variant: "destructive" });
    } else {
      setContents(contents.map(c => c.id === id ? { ...c, approval_status: "pending" } : c));
      toast({ title: "Enviado para aprovação!", description: "O cliente pode aprovar pelo portal." });
    }
  }

  if (contents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
          <FileText className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-lg font-semibold mb-1">Nenhum conteúdo ainda</h3>
        <p className="text-muted-foreground text-sm">Crie seu primeiro conteúdo para começar.</p>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-4">
        {/* Month selector */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setFilterMonth("all")}
            className={cn(
              "shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-colors",
              filterMonth === "all"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-transparent text-muted-foreground border-border hover:text-foreground"
            )}
          >
            Todos os meses
          </button>
          {availableMonths.map(ym => (
            <button
              key={ym}
              onClick={() => setFilterMonth(ym)}
              className={cn(
                "shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-colors",
                filterMonth === ym
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-transparent text-muted-foreground border-border hover:text-foreground"
              )}
            >
              {monthLabel(ym)}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Buscar conteúdos..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos status</SelectItem>
              {CONTENT_STATUSES.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filterApproval} onValueChange={setFilterApproval}>
            <SelectTrigger className="w-44"><SelectValue placeholder="Aprovação" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas aprovações</SelectItem>
              {Object.entries(APPROVAL_INFO).map(([v, info]) => (
                <SelectItem key={v} value={v}>{info.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterClient} onValueChange={setFilterClient}>
            <SelectTrigger className="w-44"><SelectValue placeholder="Cliente" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos clientes</SelectItem>
              {clients.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filterPlatform} onValueChange={setFilterPlatform}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Plataforma" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas plataformas</SelectItem>
              {PLATFORMS.map(p => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Grouped by week */}
        {filtered.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground text-sm border border-border rounded-xl">
            Nenhum conteúdo encontrado
          </div>
        ) : (
          <div className="space-y-6">
            {(() => {
              // Group by week
              const groups: Record<string, { label: string; items: typeof filtered }> = {};
              filtered.forEach((c) => {
                const { key, label } = getWeekGroup(c.scheduled_at ?? null);
                if (!groups[key]) groups[key] = { label, items: [] };
                groups[key].items.push(c);
              });

              return Object.entries(groups).map(([key, group]) => (
                <div key={key} className="space-y-2">
                  {/* Week header */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span className="text-sm font-semibold text-foreground">{group.label}</span>
                    </div>
                    <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                      {group.items.length} {group.items.length === 1 ? "conteúdo" : "conteúdos"}
                    </span>
                    <div className="flex-1 h-px bg-border" />
                  </div>

                  {/* Table for this week */}
                  <div className="rounded-xl border border-border overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border bg-secondary/30">
                          <th className="text-left text-xs font-medium text-muted-foreground px-4 py-2.5">Conteúdo</th>
                          <th className="text-left text-xs font-medium text-muted-foreground px-4 py-2.5 hidden md:table-cell">Cliente</th>
                          <th className="text-left text-xs font-medium text-muted-foreground px-4 py-2.5 hidden lg:table-cell">Plataforma</th>
                          <th className="text-left text-xs font-medium text-muted-foreground px-4 py-2.5 hidden md:table-cell">Data</th>
                          <th className="text-left text-xs font-medium text-muted-foreground px-4 py-2.5">Status</th>
                          <th className="text-left text-xs font-medium text-muted-foreground px-4 py-2.5">Aprovação</th>
                          <th className="w-10 px-4 py-2.5" />
                        </tr>
                      </thead>
                      <tbody>
                        {group.items.map((content, idx) => {
                          const statusInfo = CONTENT_STATUSES.find(s => s.value === content.status);
                          const platformInfo = PLATFORMS.find(p => p.value === content.platform);
                          const approvalKey = (content.approval_status ?? "draft") as keyof typeof APPROVAL_INFO;
                          const approvalInfo = APPROVAL_INFO[approvalKey] ?? APPROVAL_INFO.draft;
                          const isRejected = approvalKey === "rejected";

                          return (
                            <tr
                              key={content.id}
                              className={`border-b border-border/50 hover:bg-accent/30 transition-colors ${idx % 2 === 0 ? "" : "bg-secondary/10"}`}
                            >
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-0.5 h-8 rounded-full" style={{ backgroundColor: content.clients?.color ?? "#6366f1" }} />
                                  <p className="text-sm font-medium line-clamp-1">{content.title}</p>
                                </div>
                              </td>
                              <td className="px-4 py-3 hidden md:table-cell">
                                <span className="text-sm text-muted-foreground">{content.clients?.name ?? "—"}</span>
                              </td>
                              <td className="px-4 py-3 hidden lg:table-cell">
                                <span className="text-sm">{platformInfo?.label ?? content.platform}</span>
                              </td>
                              <td className="px-4 py-3 hidden md:table-cell">
                                {content.scheduled_at ? (
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Calendar className="w-3 h-3" />
                                    {formatDate(content.scheduled_at)}
                                  </div>
                                ) : <span className="text-muted-foreground/40 text-xs">—</span>}
                              </td>
                              <td className="px-4 py-3">
                                <Select value={content.status} onValueChange={(v) => handleStatusChange(content.id, v)}>
                                  <SelectTrigger className="h-7 border-none bg-transparent p-0 w-auto">
                                    <Badge className={statusInfo?.color}>{statusInfo?.label}</Badge>
                                  </SelectTrigger>
                                  <SelectContent>
                                    {CONTENT_STATUSES.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                                  </SelectContent>
                                </Select>
                              </td>
                              <td className="px-4 py-3">
                                {isRejected ? (
                                  <button
                                    onClick={() => setRejectionModal({
                                      title: content.title,
                                      comment: content.approval_comment ?? "Sem motivo informado.",
                                    })}
                                    className={cn(
                                      "inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium transition-opacity hover:opacity-80",
                                      approvalInfo.color
                                    )}
                                  >
                                    {approvalInfo.icon}
                                    {approvalInfo.label}
                                  </button>
                                ) : (
                                  <span className={cn(
                                    "inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium",
                                    approvalInfo.color
                                  )}>
                                    {approvalInfo.icon}
                                    {approvalInfo.label}
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-3">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="w-7 h-7">
                                      <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => setEditingContent(content)}>
                                      <Pencil className="w-4 h-4 mr-2" /> Editar
                                    </DropdownMenuItem>
                                    {(approvalKey === "draft" || approvalKey === "rejected") && (
                                      <DropdownMenuItem onClick={() => handleSendForApproval(content.id)}>
                                        <Send className="w-4 h-4 mr-2" />
                                        {approvalKey === "rejected" ? "Reenviar p/ aprovação" : "Enviar p/ aprovação"}
                                      </DropdownMenuItem>
                                    )}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={() => handleDelete(content.id)}
                                      className="text-destructive focus:text-destructive"
                                    >
                                      <Trash2 className="w-4 h-4 mr-2" /> Excluir
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ));
            })()}
          </div>
        )}

        {editingContent && (
          <ContentFormDialog
            open={!!editingContent}
            onOpenChange={(open) => { if (!open) setEditingContent(null); }}
            clients={clients}
            content={editingContent}
          />
        )}

        {rejectionModal && (
          <Dialog open={!!rejectionModal} onOpenChange={(open) => { if (!open) setRejectionModal(null); }}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <X className="w-4 h-4 text-red-400" />
                  Motivo da reprovação
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Conteúdo: <span className="text-foreground font-medium">{rejectionModal.title}</span>
                </p>
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
                  <p className="text-sm text-red-300 leading-relaxed">{rejectionModal.comment}</p>
                </div>
                <p className="text-xs text-muted-foreground">
                  Faça as alterações solicitadas e reenvie o conteúdo para aprovação.
                </p>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </TooltipProvider>
  );
}
