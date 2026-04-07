"use client";

import { useState } from "react";
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext, rectSortingStrategy, useSortable, arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { createClient } from "@/lib/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CONTENT_STATUSES } from "@/types";
import { cn } from "@/lib/utils";
import { Film, ImageIcon, LayoutGrid, Smartphone, Heart, MessageCircle, Bookmark, GripVertical } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ContentItem {
  id: string;
  title: string;
  caption?: string | null;
  hashtags?: string | null;
  platform: string;
  status: string;
  scheduled_at?: string | null;
  client_id: string;
  media_urls?: string[] | null;
  clients: { id: string; name: string; color: string } | null;
}

interface ClientRef { id: string; name: string; color: string }

function PostCard({ content, overlay }: { content: ContentItem; overlay?: boolean }) {
  const [hovered, setHovered] = useState(false);
  const firstMedia = content.media_urls?.[0];
  const isVideo = firstMedia?.match(/\.(mp4|mov|webm)$/i);
  const isCarousel = (content.media_urls?.length ?? 0) > 1;
  const color = content.clients?.color ?? "#6366f1";
  const statusInfo = CONTENT_STATUSES.find(s => s.value === content.status);

  return (
    <div
      className={cn(
        "relative aspect-square bg-zinc-900 overflow-hidden cursor-grab",
        overlay && "opacity-80 rotate-1 shadow-2xl"
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Media */}
      {firstMedia ? (
        isVideo ? (
          <video src={firstMedia} className="w-full h-full object-cover" muted loop={hovered} />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={firstMedia} alt="" className="w-full h-full object-cover" />
        )
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2"
          style={{ background: `linear-gradient(135deg, ${color}20, ${color}40)` }}>
          <ImageIcon className="w-8 h-8" style={{ color }} />
          <p className="text-[10px] text-center px-2 font-medium line-clamp-2" style={{ color }}>
            {content.title}
          </p>
        </div>
      )}

      {/* Carousel / video badge */}
      {isCarousel && (
        <div className="absolute top-2 right-2">
          <LayoutGrid className="w-4 h-4 text-white drop-shadow" />
        </div>
      )}
      {isVideo && !isCarousel && (
        <div className="absolute top-2 right-2">
          <Film className="w-4 h-4 text-white drop-shadow" />
        </div>
      )}

      {/* Hover overlay */}
      {hovered && (
        <div className="absolute inset-0 bg-black/60 flex flex-col justify-between p-2 transition-opacity">
          <div>
            <p className="text-white text-xs font-semibold line-clamp-2">{content.title}</p>
            {content.caption && (
              <p className="text-white/70 text-[10px] mt-1 line-clamp-3">{content.caption}</p>
            )}
          </div>
          <div className="space-y-1">
            {content.scheduled_at && (
              <p className="text-white/60 text-[10px]">
                {new Date(content.scheduled_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", timeZone: "UTC" })}
              </p>
            )}
            <Badge className={`text-[10px] ${statusInfo?.color}`}>{statusInfo?.label}</Badge>
          </div>
        </div>
      )}

      {/* Drag handle */}
      <div className="absolute bottom-1 left-1 text-white/30 opacity-0 group-hover:opacity-100">
        <GripVertical className="w-3 h-3" />
      </div>
    </div>
  );
}

function SortablePost({ content }: { content: ContentItem }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: content.id });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn("group", isDragging && "z-50 opacity-50")}
      {...attributes}
      {...listeners}
    >
      <PostCard content={content} />
    </div>
  );
}

export function FeedPreview({ initialContents, clients }: { initialContents: ContentItem[]; clients: ClientRef[] }) {
  const { toast } = useToast();
  const [contents, setContents] = useState(initialContents);
  const [filterClient, setFilterClient] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "phone">("grid");

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const filtered = contents.filter(c =>
    (filterClient === "all" || c.client_id === filterClient) &&
    c.platform === "instagram"
  );

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIdx = filtered.findIndex(c => c.id === active.id);
    const newIdx = filtered.findIndex(c => c.id === over.id);
    const reordered = arrayMove(filtered, oldIdx, newIdx);

    // Update scheduled_at based on new order to persist
    const supabase = createClient();
    const updates = reordered
      .filter(c => c.scheduled_at)
      .map((c, i) => ({ id: c.id, scheduled_at: reordered[i].scheduled_at }));

    // Optimistic update
    setContents(prev => {
      const nonFiltered = prev.filter(c => !(filterClient === "all" || c.client_id === filterClient) || c.platform !== "instagram");
      return [...nonFiltered, ...reordered];
    });

    // Swap dates in DB
    const a = filtered[oldIdx];
    const b = filtered[newIdx];
    if (a.scheduled_at && b.scheduled_at) {
      await Promise.all([
        supabase.from("contents").update({ scheduled_at: b.scheduled_at }).eq("id", a.id),
        supabase.from("contents").update({ scheduled_at: a.scheduled_at }).eq("id", b.id),
      ]);
      toast({ title: "Ordem atualizada!" });
    }
  }

  const gridContents = filtered.slice(0, 9);

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center gap-3 flex-wrap">
        <Select value={filterClient} onValueChange={setFilterClient}>
          <SelectTrigger className="w-48"><SelectValue placeholder="Todos clientes" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos clientes</SelectItem>
            {clients.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>

        <div className="flex gap-1 border border-border rounded-lg p-1">
          <button
            onClick={() => setViewMode("grid")}
            className={cn("p-1.5 rounded text-sm transition-colors", viewMode === "grid" ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground")}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("phone")}
            className={cn("p-1.5 rounded text-sm transition-colors", viewMode === "phone" ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground")}
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-muted-foreground">
          Arraste os posts para reorganizar • Mostrando conteúdos do Instagram
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground text-sm border border-dashed border-border rounded-xl">
          Nenhum conteúdo do Instagram encontrado. Crie conteúdos com plataforma Instagram para visualizar o feed.
        </div>
      ) : viewMode === "grid" ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={filtered.map(c => c.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-3 gap-0.5 max-w-2xl">
              {filtered.map(content => (
                <SortablePost key={content.id} content={content} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        /* Phone mockup view */
        <div className="flex justify-center">
          <div className="w-80 bg-zinc-950 rounded-3xl border-4 border-zinc-800 overflow-hidden shadow-2xl">
            {/* Status bar */}
            <div className="bg-zinc-950 px-4 py-2 flex justify-between items-center">
              <span className="text-white text-[10px]">9:41</span>
              <div className="flex gap-1">
                <div className="w-3 h-1.5 bg-white rounded-sm" />
                <div className="w-1 h-1.5 bg-white/40 rounded-sm" />
              </div>
            </div>

            {/* Instagram header */}
            <div className="bg-zinc-950 px-4 py-2 flex justify-between items-center border-b border-zinc-800">
              <span className="text-white font-bold text-base">
                {filterClient !== "all" ? clients.find(c => c.id === filterClient)?.name ?? "Feed" : "Feed"}
              </span>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-3 gap-0.5">
              {gridContents.map(content => (
                <PostCard key={content.id} content={content} />
              ))}
              {/* Empty cells to complete grid */}
              {Array.from({ length: Math.max(0, 9 - gridContents.length) }).map((_, i) => (
                <div key={i} className="aspect-square bg-zinc-900" />
              ))}
            </div>

            {/* Bottom bar */}
            <div className="bg-zinc-950 px-6 py-3 flex justify-between border-t border-zinc-800">
              {["🏠", "🔍", "➕", "❤️", "👤"].map((icon, i) => (
                <span key={i} className="text-base">{icon}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
