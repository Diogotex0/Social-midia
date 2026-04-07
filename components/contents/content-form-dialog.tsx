"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, X, ImageIcon, Film, ChevronLeft, ChevronRight } from "lucide-react";
import { PLATFORMS, FORMATS, CONTENT_STATUSES, PILLARS } from "@/types";
import type { Content } from "@/types";

interface ClientRef { id: string; name: string; color: string }

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clients: ClientRef[];
  content?: Content & { media_urls?: string[] | null };
  defaultClientId?: string;
}

export function ContentFormDialog({ open, onOpenChange, clients, content, defaultClientId }: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [mediaUrls, setMediaUrls] = useState<string[]>(content?.media_urls ?? []);
  const [carouselIdx, setCarouselIdx] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    client_id: content?.client_id ?? defaultClientId ?? "",
    title: content?.title ?? "",
    caption: content?.caption ?? "",
    hashtags: content?.hashtags ?? "",
    platform: content?.platform ?? "instagram",
    format: content?.format ?? "reels",
    pillar: content?.pillar ?? "",
    status: content?.status ?? "planned",
    scheduled_at: content?.scheduled_at ? content.scheduled_at.slice(0, 10) : "",
    notes: content?.notes ?? "",
  });

  const isEdit = !!content;

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploadingMedia(true);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setUploadingMedia(false); return; }

    const uploaded: string[] = [];
    for (const file of files) {
      const ext = file.name.split(".").pop();
      const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("content-media").upload(path, file);
      if (!error) {
        const { data } = supabase.storage.from("content-media").getPublicUrl(path);
        uploaded.push(data.publicUrl);
      }
    }

    setMediaUrls(prev => [...prev, ...uploaded]);
    setUploadingMedia(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removeMedia(idx: number) {
    setMediaUrls(prev => prev.filter((_, i) => i !== idx));
    setCarouselIdx(prev => Math.max(0, prev - 1));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.client_id || !form.title.trim()) return;
    setLoading(true);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const payload = {
      user_id: user.id,
      client_id: form.client_id,
      title: form.title.trim(),
      caption: form.caption || null,
      hashtags: form.hashtags || null,
      platform: form.platform as Content["platform"],
      format: form.format as Content["format"],
      pillar: form.pillar || null,
      status: form.status as Content["status"],
      scheduled_at: form.scheduled_at ? `${form.scheduled_at}T12:00:00.000Z` : null,
      notes: form.notes || null,
      media_urls: mediaUrls.length > 0 ? mediaUrls : null,
    };

    const { error } = isEdit
      ? await supabase.from("contents").update(payload).eq("id", content.id)
      : await supabase.from("contents").insert(payload);

    if (error) {
      toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
    } else {
      toast({ title: isEdit ? "Conteúdo atualizado!" : "Conteúdo criado!" });
      onOpenChange(false);
      router.refresh();
    }
    setLoading(false);
  }

  const currentMedia = mediaUrls[carouselIdx];
  const isVideo = currentMedia?.match(/\.(mp4|mov|webm)$/i);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar Conteúdo" : "Novo Conteúdo"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">

            <div className="col-span-2 space-y-2">
              <Label>Cliente *</Label>
              <Select value={form.client_id} onValueChange={(v) => setForm({ ...form, client_id: v })}>
                <SelectTrigger><SelectValue placeholder="Selecione o cliente" /></SelectTrigger>
                <SelectContent>
                  {clients.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input id="title" placeholder="Título do conteúdo" value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Plataforma</Label>
              <Select value={form.platform} onValueChange={(v) => setForm({ ...form, platform: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PLATFORMS.map(p => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Formato</Label>
              <Select value={form.format} onValueChange={(v) => setForm({ ...form, format: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {FORMATS.map(f => <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CONTENT_STATUSES.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Pilar</Label>
              <Select value={form.pillar} onValueChange={(v) => setForm({ ...form, pillar: v })}>
                <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                <SelectContent>
                  {PILLARS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="scheduled_at">Data de Publicação</Label>
              <Input id="scheduled_at" type="date" value={form.scheduled_at}
                onChange={(e) => setForm({ ...form, scheduled_at: e.target.value })} />
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="caption">Legenda</Label>
              <Textarea id="caption" placeholder="Escreva a legenda do post..." value={form.caption}
                onChange={(e) => setForm({ ...form, caption: e.target.value })} rows={4} />
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="hashtags">Hashtags</Label>
              <Input id="hashtags" placeholder="#exemplo #social #marketing" value={form.hashtags}
                onChange={(e) => setForm({ ...form, hashtags: e.target.value })} />
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="notes">Notas internas</Label>
              <Textarea id="notes" placeholder="Observações sobre este conteúdo..." value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} />
            </div>

            {/* Media upload */}
            <div className="col-span-2 space-y-2">
              <Label>Mídia (fotos, vídeos, carrossel)</Label>

              {mediaUrls.length > 0 && (
                <div className="relative rounded-xl overflow-hidden border border-border bg-black">
                  <div className="aspect-square max-h-64 flex items-center justify-center">
                    {isVideo ? (
                      <video src={currentMedia} controls className="max-h-64 max-w-full" />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={currentMedia} alt="" className="max-h-64 max-w-full object-contain" />
                    )}
                  </div>
                  {mediaUrls.length > 1 && (
                    <>
                      <button type="button" onClick={() => setCarouselIdx(i => Math.max(0, i - 1))}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 rounded-full p-1 text-white hover:bg-black/80">
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button type="button" onClick={() => setCarouselIdx(i => Math.min(mediaUrls.length - 1, i + 1))}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 rounded-full p-1 text-white hover:bg-black/80">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                        {mediaUrls.map((_, i) => (
                          <button key={i} type="button" onClick={() => setCarouselIdx(i)}
                            className={`w-1.5 h-1.5 rounded-full transition-colors ${i === carouselIdx ? "bg-white" : "bg-white/40"}`} />
                        ))}
                      </div>
                    </>
                  )}
                  <button type="button" onClick={() => removeMedia(carouselIdx)}
                    className="absolute top-2 right-2 bg-black/60 rounded-full p-1 text-white hover:bg-red-500/80">
                    <X className="w-3 h-3" />
                  </button>
                  <div className="absolute top-2 left-2 bg-black/60 rounded-full px-2 py-0.5 text-white text-[10px]">
                    {carouselIdx + 1}/{mediaUrls.length}
                  </div>
                </div>
              )}
              {mediaUrls.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {mediaUrls.map((url, i) => (
                    <button key={i} type="button" onClick={() => setCarouselIdx(i)}
                      className={`shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-colors ${i === carouselIdx ? "border-primary" : "border-transparent"}`}>
                      {url.match(/\.(mp4|mov|webm)$/i)
                        ? <div className="w-full h-full bg-zinc-800 flex items-center justify-center"><Film className="w-4 h-4 text-zinc-400" /></div>
                        // eslint-disable-next-line @next/next/no-img-element
                        : <img src={url} alt="" className="w-full h-full object-cover" />
                      }
                    </button>
                  ))}
                </div>
              )}
              <label className="border-2 border-dashed border-border rounded-xl p-4 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors block">
                {uploadingMedia ? (
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" /> Enviando...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <ImageIcon className="w-4 h-4" />
                    <Film className="w-4 h-4" />
                    <span className="text-sm">Adicionar fotos ou vídeos</span>
                  </div>
                )}
                <input type="file" accept="image/*,video/*" multiple className="hidden" onChange={handleFileUpload} />
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={loading || uploadingMedia || !form.client_id}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEdit ? "Salvar alterações" : "Criar conteúdo"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
