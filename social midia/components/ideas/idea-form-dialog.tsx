"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { PLATFORMS } from "@/types";
import type { Idea } from "@/types";

interface ClientRef { id: string; name: string; color: string }
interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clients: ClientRef[];
  idea?: Idea;
}

export function IdeaFormDialog({ open, onOpenChange, clients, idea }: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    client_id: idea?.client_id ?? "",
    title: idea?.title ?? "",
    description: idea?.description ?? "",
    hook: idea?.hook ?? "",
    platform: idea?.platform ?? "",
    tags: idea?.tags?.join(", ") ?? "",
  });

  const isEdit = !!idea;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;
    setLoading(true);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const payload = {
      user_id: user.id,
      client_id: form.client_id || null,
      title: form.title.trim(),
      description: form.description || null,
      hook: form.hook || null,
      platform: form.platform || null,
      tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
      source: "manual" as const,
    };

    const { error } = isEdit
      ? await supabase.from("ideas").update(payload).eq("id", idea.id)
      : await supabase.from("ideas").insert(payload);

    if (error) {
      toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
    } else {
      toast({ title: isEdit ? "Ideia atualizada!" : "Ideia salva!" });
      onOpenChange(false);
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar Ideia" : "Nova Ideia"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="title">Título da ideia *</Label>
              <Input
                id="title"
                placeholder="Ex: 5 erros que iniciantes cometem"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Cliente (opcional)</Label>
              <Select value={form.client_id || "none"} onValueChange={(v) => setForm({ ...form, client_id: v === "none" ? "" : v })}>
                <SelectTrigger><SelectValue placeholder="Ideia global" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sem cliente (global)</SelectItem>
                  {clients.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Plataforma</Label>
              <Select value={form.platform || "none"} onValueChange={(v) => setForm({ ...form, platform: v === "none" ? "" : v })}>
                <SelectTrigger><SelectValue placeholder="Qualquer" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Qualquer</SelectItem>
                  {PLATFORMS.map(p => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="hook">Hook / Gancho</Label>
              <Textarea
                id="hook"
                placeholder="A primeira frase que vai prender a atenção..."
                value={form.hook}
                onChange={(e) => setForm({ ...form, hook: e.target.value })}
                rows={2}
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="description">Descrição / Roteiro</Label>
              <Textarea
                id="description"
                placeholder="Descreva o conteúdo, roteiro ou sugestão de legenda..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={4}
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
              <Input
                id="tags"
                placeholder="tutorial, receita, motivação..."
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEdit ? "Salvar" : "Criar ideia"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
