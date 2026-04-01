"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import type { Client } from "@/types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client?: Client;
}

const CLIENT_COLORS = [
  "#6366f1", "#8b5cf6", "#ec4899", "#f43f5e",
  "#f97316", "#eab308", "#22c55e", "#14b8a6",
  "#3b82f6", "#06b6d4",
];

export function ClientFormDialog({ open, onOpenChange, client }: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: client?.name ?? "",
    niche: client?.niche ?? "",
    monthly_value: client?.monthly_value?.toString() ?? "",
    payment_day: client?.payment_day?.toString() ?? "",
    status: client?.status ?? "active",
    instagram: client?.instagram ?? "",
    tiktok: client?.tiktok ?? "",
    facebook: client?.facebook ?? "",
    youtube: client?.youtube ?? "",
    linkedin: client?.linkedin ?? "",
    notes: client?.notes ?? "",
    color: client?.color ?? CLIENT_COLORS[0],
  });

  const isEdit = !!client;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    setLoading(true);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const payload = {
      user_id: user.id,
      name: form.name.trim(),
      niche: form.niche || null,
      monthly_value: parseFloat(form.monthly_value) || 0,
      payment_day: parseInt(form.payment_day) || null,
      status: form.status as "active" | "inactive",
      instagram: form.instagram || null,
      tiktok: form.tiktok || null,
      facebook: form.facebook || null,
      youtube: form.youtube || null,
      linkedin: form.linkedin || null,
      notes: form.notes || null,
      color: form.color,
    };

    const { error } = isEdit
      ? await supabase.from("clients").update(payload).eq("id", client.id)
      : await supabase.from("clients").insert(payload);

    if (error) {
      toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
    } else {
      toast({ title: isEdit ? "Cliente atualizado!" : "Cliente criado!" });
      onOpenChange(false);
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar Cliente" : "Novo Cliente"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Cor */}
          <div className="space-y-2">
            <Label>Cor do cliente</Label>
            <div className="flex gap-2 flex-wrap">
              {CLIENT_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setForm({ ...form, color })}
                  className={`w-6 h-6 rounded-full transition-all ${form.color === color ? "ring-2 ring-white ring-offset-2 ring-offset-background scale-110" : "hover:scale-105"}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                placeholder="Nome do cliente"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="niche">Nicho</Label>
              <Input
                id="niche"
                placeholder="Ex: Alimentação, Moda..."
                value={form.niche}
                onChange={(e) => setForm({ ...form, niche: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="monthly_value">Valor Mensal (R$)</Label>
              <Input
                id="monthly_value"
                type="number"
                step="0.01"
                min="0"
                placeholder="0,00"
                value={form.monthly_value}
                onChange={(e) => setForm({ ...form, monthly_value: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="payment_day">Dia de Pagamento</Label>
              <Input
                id="payment_day"
                type="number"
                min="1"
                max="31"
                placeholder="Ex: 5"
                value={form.payment_day}
                onChange={(e) => setForm({ ...form, payment_day: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground text-xs uppercase tracking-wide">Redes Sociais</Label>
            <div className="grid grid-cols-2 gap-3">
              <Input placeholder="@instagram" value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} />
              <Input placeholder="@tiktok" value={form.tiktok} onChange={(e) => setForm({ ...form, tiktok: e.target.value })} />
              <Input placeholder="facebook.com/..." value={form.facebook} onChange={(e) => setForm({ ...form, facebook: e.target.value })} />
              <Input placeholder="youtube.com/..." value={form.youtube} onChange={(e) => setForm({ ...form, youtube: e.target.value })} />
              <Input className="col-span-2" placeholder="linkedin.com/..." value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              placeholder="Notas sobre o cliente..."
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEdit ? "Salvar alterações" : "Criar cliente"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
