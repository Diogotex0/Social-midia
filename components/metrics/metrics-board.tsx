"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Metric } from "@/types";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { BarChart2, Heart, MessageCircle, Share2, Eye, Bookmark, Plus, Pencil, Trash2 } from "lucide-react";

interface MetricWithContent extends Metric {
  contents: {
    id: string;
    title: string;
    platform: string;
    clients: { name: string; color: string } | null;
  } | null;
}

interface ClientRef { id: string; name: string; color: string }

interface MetricFormData {
  content_id: string;
  likes: string;
  comments: string;
  shares: string;
  reach: string;
  impressions: string;
  saved: string;
  recorded_at: string;
}

function MetricFormDialog({
  open,
  onOpenChange,
  metric,
  contentId,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  metric?: MetricWithContent;
  contentId?: string;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<MetricFormData>({
    content_id: metric?.content_id ?? contentId ?? "",
    likes: metric?.likes?.toString() ?? "0",
    comments: metric?.comments?.toString() ?? "0",
    shares: metric?.shares?.toString() ?? "0",
    reach: metric?.reach?.toString() ?? "0",
    impressions: metric?.impressions?.toString() ?? "0",
    saved: metric?.saved?.toString() ?? "0",
    recorded_at: metric?.recorded_at ?? new Date().toISOString().slice(0, 10),
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const payload = {
      user_id: user.id,
      content_id: form.content_id,
      likes: parseInt(form.likes) || 0,
      comments: parseInt(form.comments) || 0,
      shares: parseInt(form.shares) || 0,
      reach: parseInt(form.reach) || 0,
      impressions: parseInt(form.impressions) || 0,
      saved: parseInt(form.saved) || 0,
      recorded_at: form.recorded_at,
    };

    const { error } = metric
      ? await supabase.from("metrics").update(payload).eq("id", metric.id)
      : await supabase.from("metrics").insert(payload);

    if (error) toast({ title: "Erro ao salvar", variant: "destructive" });
    else { toast({ title: "Métricas salvas!" }); onOpenChange(false); router.refresh(); }
    setLoading(false);
  }

  const fields = [
    { key: "likes", label: "Curtidas", icon: Heart },
    { key: "comments", label: "Comentários", icon: MessageCircle },
    { key: "shares", label: "Compartilhamentos", icon: Share2 },
    { key: "reach", label: "Alcance", icon: Eye },
    { key: "impressions", label: "Impressões", icon: Eye },
    { key: "saved", label: "Salvos", icon: Bookmark },
  ] as const;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{metric ? "Editar Métricas" : "Registrar Métricas"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Data de registro</Label>
            <Input type="date" value={form.recorded_at} onChange={e => setForm({ ...form, recorded_at: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {fields.map(({ key, label }) => (
              <div key={key} className="space-y-1">
                <Label className="text-xs">{label}</Label>
                <Input
                  type="number"
                  min="0"
                  value={form[key]}
                  onChange={e => setForm({ ...form, [key]: e.target.value })}
                />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={loading}>Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function MetricsBoard({ initialMetrics, clients }: { initialMetrics: MetricWithContent[]; clients: ClientRef[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const [metrics, setMetrics] = useState(initialMetrics);
  const [openForm, setOpenForm] = useState(false);
  const [editingMetric, setEditingMetric] = useState<MetricWithContent | undefined>();

  const totalLikes = metrics.reduce((a, m) => a + m.likes, 0);
  const totalComments = metrics.reduce((a, m) => a + m.comments, 0);
  const totalShares = metrics.reduce((a, m) => a + m.shares, 0);
  const totalReach = metrics.reduce((a, m) => a + m.reach, 0);

  async function handleDelete(id: string) {
    if (!confirm("Excluir estas métricas?")) return;
    const supabase = createClient();
    await supabase.from("metrics").delete().eq("id", id);
    setMetrics(metrics.filter(m => m.id !== id));
    toast({ title: "Métricas removidas" });
  }

  if (metrics.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button size="sm" onClick={() => setOpenForm(true)}>
            <Plus className="w-4 h-4 mr-1.5" /> Registrar métricas
          </Button>
        </div>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
            <BarChart2 className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-1">Sem métricas ainda</h3>
          <p className="text-muted-foreground text-sm">Registre o desempenho dos seus posts.</p>
        </div>
        {openForm && <MetricFormDialog open={openForm} onOpenChange={setOpenForm} />}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button size="sm" onClick={() => { setEditingMetric(undefined); setOpenForm(true); }}>
          <Plus className="w-4 h-4 mr-1.5" /> Registrar métricas
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Curtidas", value: totalLikes.toLocaleString("pt-BR"), icon: Heart, color: "text-pink-400 bg-pink-500/10" },
          { label: "Total Comentários", value: totalComments.toLocaleString("pt-BR"), icon: MessageCircle, color: "text-blue-400 bg-blue-500/10" },
          { label: "Total Compartilhamentos", value: totalShares.toLocaleString("pt-BR"), icon: Share2, color: "text-green-400 bg-green-500/10" },
          { label: "Alcance Total", value: totalReach.toLocaleString("pt-BR"), icon: Eye, color: "text-violet-400 bg-violet-500/10" },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`p-2.5 rounded-lg ${color}`}><Icon className="w-4 h-4" /></div>
              <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-xl font-bold">{value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-secondary/30">
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Post</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 hidden md:table-cell">Data</th>
              <th className="text-center text-xs font-medium text-muted-foreground px-2 py-3">❤️</th>
              <th className="text-center text-xs font-medium text-muted-foreground px-2 py-3 hidden sm:table-cell">💬</th>
              <th className="text-center text-xs font-medium text-muted-foreground px-2 py-3 hidden sm:table-cell">🔄</th>
              <th className="text-center text-xs font-medium text-muted-foreground px-2 py-3 hidden lg:table-cell">👁️</th>
              <th className="w-10 px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {metrics.map((metric, idx) => (
              <tr key={metric.id} className={`border-b border-border/50 hover:bg-accent/20 transition-colors ${idx % 2 === 0 ? "" : "bg-secondary/10"}`}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {metric.contents?.clients && (
                      <div className="w-1.5 h-8 rounded-full" style={{ backgroundColor: metric.contents.clients.color }} />
                    )}
                    <div>
                      <p className="text-sm font-medium line-clamp-1">{metric.contents?.title ?? "—"}</p>
                      <p className="text-xs text-muted-foreground">{metric.contents?.clients?.name}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <span className="text-xs text-muted-foreground">{formatDate(metric.recorded_at)}</span>
                </td>
                <td className="px-2 py-3 text-center text-sm">{metric.likes.toLocaleString("pt-BR")}</td>
                <td className="px-2 py-3 text-center text-sm hidden sm:table-cell">{metric.comments.toLocaleString("pt-BR")}</td>
                <td className="px-2 py-3 text-center text-sm hidden sm:table-cell">{metric.shares.toLocaleString("pt-BR")}</td>
                <td className="px-2 py-3 text-center text-sm hidden lg:table-cell">{metric.reach.toLocaleString("pt-BR")}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="w-7 h-7" onClick={() => { setEditingMetric(metric); setOpenForm(true); }}>
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="w-7 h-7 text-destructive" onClick={() => handleDelete(metric.id)}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {openForm && (
        <MetricFormDialog
          open={openForm}
          onOpenChange={(v) => { setOpenForm(v); if (!v) setEditingMetric(undefined); }}
          metric={editingMetric}
        />
      )}
    </div>
  );
}
