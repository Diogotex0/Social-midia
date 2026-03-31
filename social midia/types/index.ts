import type { Database } from "./database";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Client = Database["public"]["Tables"]["clients"]["Row"];
export type Content = Database["public"]["Tables"]["contents"]["Row"];
export type Idea = Database["public"]["Tables"]["ideas"]["Row"];
export type Finance = Database["public"]["Tables"]["finances"]["Row"];
export type Notification = Database["public"]["Tables"]["notifications"]["Row"];
export type Metric = Database["public"]["Tables"]["metrics"]["Row"];

export type ClientInsert = Database["public"]["Tables"]["clients"]["Insert"];
export type ContentInsert = Database["public"]["Tables"]["contents"]["Insert"];
export type IdeaInsert = Database["public"]["Tables"]["ideas"]["Insert"];
export type FinanceInsert = Database["public"]["Tables"]["finances"]["Insert"];
export type NotificationInsert = Database["public"]["Tables"]["notifications"]["Insert"];
export type MetricInsert = Database["public"]["Tables"]["metrics"]["Insert"];

export type ContentStatus = Content["status"];
export type ContentPlatform = Content["platform"];
export type ContentFormat = Content["format"];
export type FinanceStatus = Finance["status"];
export type ClientStatus = Client["status"];
export type NotificationType = Notification["type"];

export const PLATFORMS: { value: ContentPlatform; label: string }[] = [
  { value: "instagram", label: "Instagram" },
  { value: "tiktok", label: "TikTok" },
  { value: "facebook", label: "Facebook" },
  { value: "youtube", label: "YouTube" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "twitter", label: "Twitter/X" },
];

export const FORMATS: { value: ContentFormat; label: string }[] = [
  { value: "reels", label: "Reels" },
  { value: "stories", label: "Stories" },
  { value: "post", label: "Post Estático" },
  { value: "carrossel", label: "Carrossel" },
  { value: "live", label: "Live" },
  { value: "shorts", label: "Shorts" },
  { value: "video", label: "Vídeo" },
];

export const CONTENT_STATUSES: { value: ContentStatus; label: string; color: string }[] = [
  { value: "planned", label: "Planejado", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  { value: "in_production", label: "Em Produção", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  { value: "ready", label: "Pronto", color: "bg-green-500/20 text-green-400 border-green-500/30" },
  { value: "posted", label: "Postado", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
  { value: "delayed", label: "Atrasado", color: "bg-red-500/20 text-red-400 border-red-500/30" },
];

export const FINANCE_STATUSES: { value: FinanceStatus; label: string; color: string }[] = [
  { value: "paid", label: "Pago", color: "bg-green-500/20 text-green-400 border-green-500/30" },
  { value: "pending", label: "Pendente", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  { value: "delayed", label: "Atrasado", color: "bg-red-500/20 text-red-400 border-red-500/30" },
];

export const PILLARS = [
  "Educativo",
  "Entretenimento",
  "Vendas",
  "Institucional",
  "Bastidores",
  "Depoimento",
  "Tendência",
  "Engajamento",
];
