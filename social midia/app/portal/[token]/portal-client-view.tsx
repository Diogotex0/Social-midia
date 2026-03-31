"use client";

import { useState } from "react";
import { Check, X, Clock, ChevronDown, ChevronUp, Hash, FileText, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PLATFORM_LABELS: Record<string, string> = {
  instagram: "Instagram", tiktok: "TikTok", facebook: "Facebook",
  youtube: "YouTube", linkedin: "LinkedIn", twitter: "Twitter/X",
};
const FORMAT_LABELS: Record<string, string> = {
  reels: "Reels", stories: "Stories", post: "Post Estático",
  carrossel: "Carrossel", live: "Live", shorts: "Shorts", video: "Vídeo",
};
const PLATFORM_COLORS: Record<string, string> = {
  instagram: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  tiktok: "bg-slate-500/10 text-slate-300 border-slate-500/20",
  facebook: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  youtube: "bg-red-500/10 text-red-400 border-red-500/20",
  linkedin: "bg-sky-500/10 text-sky-400 border-sky-500/20",
  twitter: "bg-slate-500/10 text-slate-300 border-slate-500/20",
};

interface PortalContent {
  id: string;
  title: string;
  caption: string | null;
  hashtags: string | null;
  pillar: string | null;
  platform: string;
  format: string;
  scheduled_at: string | null;
  approval_status: string;
  approval_comment: string | null;
}

interface Props {
  token: string;
  client: { name: string; niche: string | null; color: string };
  initialContents: PortalContent[];
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}

export function PortalClientView({ token, client, initialContents }: Props) {
  const [contents, setContents] = useState(initialContents);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectComment, setRejectComment] = useState("");
  const [loading, setLoading] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const pending = contents.filter(c => c.approval_status === "pending");
  const approved = contents.filter(c => c.approval_status === "approved");
  const rejected = contents.filter(c => c.approval_status === "rejected");

  async function handleAction(contentId: string, action: "approve" | "reject", comment?: string) {
    setLoading(contentId);
    const res = await fetch(`/api/portal/${token}/action`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contentId, action, comment }),
    });
    setLoading(null);
    if (res.ok) {
      setContents(prev => prev.map(c =>
        c.id === contentId
          ? { ...c, approval_status: action === "approve" ? "approved" : "rejected", approval_comment: comment ?? null }
          : c
      ));
      setRejectingId(null);
      setRejectComment("");
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="border-b border-white/10">
        <div className="max-w-2xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm"
              style={{ backgroundColor: client.color + "25", border: `1px solid ${client.color}40`, color: client.color }}>
              {client.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-sm">{client.name}</p>
              {client.niche && <p className="text-xs text-white/40">{client.niche}</p>}
            </div>
          </div>
          <span className="text-sm font-bold tracking-tight">
            <span className="text-white/50">Social</span>
            <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">Next</span>
          </span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">
        {/* Summary */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Aguardando", count: pending.length, color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20" },
            { label: "Aprovados", count: approved.length, color: "text-green-400", bg: "bg-green-500/10 border-green-500/20" },
            { label: "Reprovados", count: rejected.length, color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
          ].map(({ label, count, color, bg }) => (
            <div key={label} className={cn("rounded-xl border p-4 text-center", bg)}>
              <p className={cn("text-2xl font-bold", color)}>{count}</p>
              <p className="text-xs text-white/40 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Pending */}
        {pending.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
              <h2 className="text-sm font-semibold text-white/70">Aguardando sua aprovação ({pending.length})</h2>
            </div>
            {pending.map(content => (
              <ContentCard
                key={content.id}
                content={content}
                loading={loading === content.id}
                isRejecting={rejectingId === content.id}
                rejectComment={rejectComment}
                onApprove={() => handleAction(content.id, "approve")}
                onStartReject={() => { setRejectingId(content.id); setRejectComment(""); }}
                onCancelReject={() => setRejectingId(null)}
                onConfirmReject={() => handleAction(content.id, "reject", rejectComment)}
                onCommentChange={setRejectComment}
              />
            ))}
          </section>
        )}

        {/* All done */}
        {pending.length === 0 && contents.length > 0 && (
          <div className="text-center py-10 border border-white/10 rounded-xl">
            <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-3">
              <Check className="w-6 h-6 text-green-400" />
            </div>
            <p className="font-medium text-sm">Tudo em dia!</p>
            <p className="text-xs text-white/40 mt-1">Nenhum conteúdo aguardando aprovação.</p>
          </div>
        )}

        {contents.length === 0 && (
          <div className="text-center py-16 border border-white/10 border-dashed rounded-xl">
            <p className="text-white/30 text-sm">Nenhum conteúdo enviado para aprovação ainda.</p>
          </div>
        )}

        {/* History */}
        {(approved.length > 0 || rejected.length > 0) && (
          <section>
            <button
              onClick={() => setShowHistory(v => !v)}
              className="flex items-center gap-2 text-sm text-white/30 hover:text-white/60 transition-colors"
            >
              {showHistory ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              Histórico ({approved.length + rejected.length} conteúdos)
            </button>
            {showHistory && (
              <div className="mt-3 space-y-3">
                {[...approved, ...rejected].map(content => (
                  <ContentCard key={content.id} content={content} loading={false} isRejecting={false} rejectComment="" readonly />
                ))}
              </div>
            )}
          </section>
        )}
      </div>

      <div className="border-t border-white/10 mt-8">
        <div className="max-w-2xl mx-auto px-6 py-4 text-center">
          <p className="text-xs text-white/20">Portal de aprovação · <span className="text-white/30">SocialNext</span></p>
        </div>
      </div>
    </div>
  );
}

function ContentCard({
  content, loading, isRejecting, rejectComment, readonly,
  onApprove, onStartReject, onCancelReject, onConfirmReject, onCommentChange,
}: {
  content: PortalContent;
  loading: boolean;
  isRejecting: boolean;
  rejectComment: string;
  readonly?: boolean;
  onApprove?: () => void;
  onStartReject?: () => void;
  onCancelReject?: () => void;
  onConfirmReject?: () => void;
  onCommentChange?: (v: string) => void;
}) {
  const isPending = content.approval_status === "pending";
  const isApproved = content.approval_status === "approved";
  const isRejected = content.approval_status === "rejected";

  return (
    <div className={cn(
      "rounded-xl border overflow-hidden transition-colors",
      isApproved ? "border-green-500/25 bg-green-500/5" :
      isRejected ? "border-red-500/25 bg-red-500/5" :
      "border-white/10 bg-white/[0.03]"
    )}>
      {/* Top bar */}
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {/* Badges */}
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className={cn("text-[10px] px-2 py-0.5 rounded-full border font-medium",
                PLATFORM_COLORS[content.platform] ?? "bg-white/10 text-white/60 border-white/10"
              )}>
                {PLATFORM_LABELS[content.platform] ?? content.platform}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full border border-white/10 bg-white/5 text-white/50">
                {FORMAT_LABELS[content.format] ?? content.format}
              </span>
              {content.pillar && (
                <span className="text-[10px] px-2 py-0.5 rounded-full border border-violet-500/20 bg-violet-500/10 text-violet-400">
                  {content.pillar}
                </span>
              )}
              {content.scheduled_at && (
                <span className="flex items-center gap-1 text-[10px] text-white/30">
                  <Clock className="w-2.5 h-2.5" />
                  {formatDate(content.scheduled_at)}
                </span>
              )}
            </div>

            {/* Title */}
            <h3 className="font-semibold text-base leading-snug">{content.title}</h3>
          </div>

          {/* Status icon */}
          {!readonly && isApproved && (
            <div className="shrink-0 w-8 h-8 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
              <Check className="w-4 h-4 text-green-400" />
            </div>
          )}
          {!readonly && isRejected && (
            <div className="shrink-0 w-8 h-8 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center">
              <X className="w-4 h-4 text-red-400" />
            </div>
          )}
        </div>

        {/* Caption */}
        {content.caption && (
          <div className="mt-3 p-3 rounded-lg bg-white/5 border border-white/8">
            <div className="flex items-center gap-1.5 text-[10px] text-white/30 mb-1.5 uppercase tracking-wide font-medium">
              <FileText className="w-3 h-3" />
              Legenda
            </div>
            <p className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap">{content.caption}</p>
          </div>
        )}

        {/* Hashtags */}
        {content.hashtags && (
          <div className="mt-2 flex items-start gap-1.5">
            <Hash className="w-3.5 h-3.5 text-white/25 mt-0.5 shrink-0" />
            <p className="text-xs text-violet-400/70 leading-relaxed">{content.hashtags}</p>
          </div>
        )}

        {/* Rejection comment received */}
        {isRejected && content.approval_comment && (
          <div className="mt-3 flex items-start gap-2 text-xs text-red-400/90 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2.5">
            <X className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium mb-0.5">Motivo da reprovação</p>
              <p className="text-red-300/70">{content.approval_comment}</p>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      {isPending && !readonly && (
        <div className="border-t border-white/8 px-5 py-4 bg-white/[0.02]">
          {!isRejecting ? (
            <div className="flex gap-2.5">
              <button
                onClick={onApprove}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-green-500/15 hover:bg-green-500/25 border border-green-500/30 hover:border-green-500/50 text-green-400 text-sm font-medium transition-all disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                {loading ? "Aprovando..." : "Aprovar conteúdo"}
              </button>
              <button
                onClick={onStartReject}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/25 hover:border-red-500/40 text-red-400 text-sm font-medium transition-all disabled:opacity-50"
              >
                <X className="w-4 h-4" />
                Solicitar alteração
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium mb-1.5">O que precisa ser alterado?</p>
                <p className="text-xs text-white/40 mb-2">Descreva o que você gostaria de mudar neste conteúdo. Seu gestor receberá esse feedback.</p>
                <textarea
                  className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/25 resize-none focus:outline-none focus:border-white/30 transition-colors"
                  rows={3}
                  placeholder="Ex: Mudar a cor do fundo, ajustar o texto no final, incluir o logotipo..."
                  value={rejectComment}
                  onChange={e => onCommentChange?.(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={onConfirmReject}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-400 text-sm font-medium transition-all disabled:opacity-50"
                >
                  <X className="w-4 h-4" />
                  {loading ? "Enviando..." : "Confirmar solicitação"}
                </button>
                <button
                  onClick={onCancelReject}
                  className="px-4 py-2.5 rounded-lg border border-white/10 text-white/40 hover:text-white/60 text-sm transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Readonly status bar */}
      {readonly && (
        <div className={cn(
          "border-t px-5 py-2.5 flex items-center gap-2 text-xs font-medium",
          isApproved ? "border-green-500/20 text-green-400/70" : "border-red-500/20 text-red-400/70"
        )}>
          {isApproved ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
          {isApproved ? "Aprovado" : "Reprovado"}
        </div>
      )}
    </div>
  );
}
