"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient as createSupabaseClient } from "@/lib/supabase/client";
import type { Idea } from "@/types";
import { formatRelativeTime } from "@/lib/utils";
import { IdeaFormDialog } from "./idea-form-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { Search, MoreHorizontal, Pencil, Trash2, Lightbulb, ArrowRight, Sparkles, Tag } from "lucide-react";

interface IdeaWithClient extends Idea {
  clients: { id: string; name: string; color: string } | null;
}

interface ClientRef { id: string; name: string; color: string }

export function IdeasBoard({ initialIdeas, clients }: { initialIdeas: IdeaWithClient[]; clients: ClientRef[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const [ideas, setIdeas] = useState(initialIdeas);
  const [search, setSearch] = useState("");
  const [editingIdea, setEditingIdea] = useState<Idea | null>(null);
  const [filterConverted, setFilterConverted] = useState<"all" | "pending" | "converted">("all");

  const filtered = ideas.filter(i => {
    const matchSearch = i.title.toLowerCase().includes(search.toLowerCase()) ||
      i.description?.toLowerCase().includes(search.toLowerCase()) ||
      i.tags?.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchConverted = filterConverted === "all" ||
      (filterConverted === "converted" ? i.converted : !i.converted);
    return matchSearch && matchConverted;
  });

  async function handleDelete(id: string) {
    if (!confirm("Excluir esta ideia?")) return;
    const supabase = createSupabaseClient();
    const { error } = await supabase.from("ideas").delete().eq("id", id);
    if (error) toast({ title: "Erro ao excluir", variant: "destructive" });
    else { setIdeas(ideas.filter(i => i.id !== id)); toast({ title: "Ideia excluída" }); }
  }

  async function handleConvertToContent(idea: IdeaWithClient) {
    router.push(`/contents?from_idea=${idea.id}&title=${encodeURIComponent(idea.title)}&client=${idea.client_id ?? ""}`);
  }

  if (ideas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
          <Lightbulb className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-lg font-semibold mb-1">Nenhuma ideia ainda</h3>
        <p className="text-muted-foreground text-sm max-w-xs">
          Use o gerador de IA para criar ideias incríveis para seus clientes.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Buscar ideias, tags..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <div className="flex gap-1">
          {(["all", "pending", "converted"] as const).map(f => (
            <Button key={f} size="sm" variant={filterConverted === f ? "default" : "outline"} onClick={() => setFilterConverted(f)}>
              {f === "all" ? "Todas" : f === "pending" ? "Pendentes" : "Convertidas"}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(idea => (
          <div key={idea.id} className="group bg-card border border-border rounded-xl p-4 hover:border-border/80 transition-colors flex flex-col">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                {idea.source === "ai" ? (
                  <Sparkles className="w-4 h-4 text-primary shrink-0" />
                ) : (
                  <Lightbulb className="w-4 h-4 text-yellow-400 shrink-0" />
                )}
                <p className="text-sm font-semibold line-clamp-2">{idea.title}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="w-7 h-7 shrink-0 opacity-0 group-hover:opacity-100">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setEditingIdea(idea)}>
                    <Pencil className="w-4 h-4 mr-2" /> Editar
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleDelete(idea.id)} className="text-destructive focus:text-destructive">
                    <Trash2 className="w-4 h-4 mr-2" /> Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {idea.hook && (
              <p className="text-xs text-primary/80 mt-2 italic line-clamp-2">"{idea.hook}"</p>
            )}

            {idea.description && (
              <p className="text-xs text-muted-foreground mt-2 line-clamp-3">{idea.description}</p>
            )}

            {idea.tags && idea.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {idea.tags.slice(0, 4).map(tag => (
                  <span key={tag} className="flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">
                    <Tag className="w-2.5 h-2.5" />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-auto pt-3 flex items-center justify-between border-t border-border/50">
              <div className="flex items-center gap-2">
                {idea.clients && (
                  <span className="text-[10px] text-muted-foreground">{idea.clients.name}</span>
                )}
                {idea.converted && <Badge variant="success" className="text-[10px]">Convertida</Badge>}
              </div>
              {!idea.converted && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-xs h-7 text-primary hover:text-primary"
                  onClick={() => handleConvertToContent(idea)}
                >
                  Usar <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground text-sm">Nenhuma ideia encontrada</div>
      )}

      {editingIdea && (
        <IdeaFormDialog
          open={!!editingIdea}
          onOpenChange={(open) => { if (!open) setEditingIdea(null); }}
          clients={clients}
          idea={editingIdea}
        />
      )}
    </div>
  );
}
