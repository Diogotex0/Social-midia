"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Copy, ToggleLeft, ToggleRight, Trash2, RefreshCw } from "lucide-react";

interface InviteCode {
  id: string;
  code: string;
  label: string | null;
  used: boolean;
  active: boolean;
  created_at: string;
}

export function InviteCodesManager({ initialCodes }: { initialCodes: InviteCode[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const [codes, setCodes] = useState(initialCodes);
  const [newLabel, setNewLabel] = useState("");
  const [loading, setLoading] = useState(false);

  function generateCode() {
    const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `SN-${rand}`;
  }

  async function handleCreate() {
    if (!newLabel.trim()) {
      toast({ title: "Informe o nome do cliente", variant: "destructive" });
      return;
    }
    setLoading(true);
    const res = await fetch("/api/admin/invite-codes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: generateCode(), label: newLabel.trim() }),
    });
    const data = await res.json();
    if (data.code) {
      setCodes([data.code, ...codes]);
      setNewLabel("");
      toast({ title: "Código criado!" });
    }
    setLoading(false);
  }

  async function handleToggle(id: string, currentActive: boolean) {
    const res = await fetch(`/api/admin/invite-codes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !currentActive }),
    });
    if (res.ok) {
      setCodes(codes.map(c => c.id === id ? { ...c, active: !currentActive } : c));
      toast({ title: !currentActive ? "Código ativado" : "Código desativado" });
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Excluir este código?")) return;
    const res = await fetch(`/api/admin/invite-codes/${id}`, { method: "DELETE" });
    if (res.ok) {
      setCodes(codes.filter(c => c.id !== id));
      toast({ title: "Código excluído" });
    }
  }

  async function handleRegenerate(id: string) {
    const newCode = generateCode();
    const res = await fetch(`/api/admin/invite-codes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: newCode, used: false }),
    });
    if (res.ok) {
      setCodes(codes.map(c => c.id === id ? { ...c, code: newCode, used: false } : c));
      toast({ title: "Código regenerado!" });
    }
  }

  function copyCode(code: string) {
    navigator.clipboard.writeText(code);
    toast({ title: "Código copiado!" });
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Criar novo código */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-3">
        <h3 className="text-sm font-semibold">Novo código de acesso</h3>
        <div className="flex gap-2">
          <Input
            placeholder="Nome do cliente (ex: João Silva)"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          />
          <Button onClick={handleCreate} disabled={loading}>
            <Plus className="w-4 h-4 mr-1.5" />
            Gerar
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Um código único será gerado automaticamente para o cliente.
        </p>
      </div>

      {/* Lista de códigos */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {codes.length} código{codes.length !== 1 ? "s" : ""} cadastrado{codes.length !== 1 ? "s" : ""}
        </p>

        {codes.length === 0 && (
          <div className="text-center py-10 text-muted-foreground text-sm bg-card border border-border rounded-xl">
            Nenhum código criado ainda
          </div>
        )}

        {codes.map((code) => (
          <div
            key={code.id}
            className="flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-3 group"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">{code.label ?? "Sem nome"}</p>
                {code.used && <Badge variant="outline" className="text-[10px]">Utilizado</Badge>}
                {!code.active && <Badge variant="danger" className="text-[10px]">Desativado</Badge>}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <code className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">
                  {code.code}
                </code>
                <button
                  onClick={() => copyCode(code.code)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  title="Copiar código"
                >
                  <Copy className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {code.used && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-7 h-7"
                  title="Regenerar código (para reenviar ao cliente)"
                  onClick={() => handleRegenerate(code.id)}
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="w-7 h-7"
                title={code.active ? "Desativar acesso" : "Ativar acesso"}
                onClick={() => handleToggle(code.id, code.active)}
              >
                {code.active
                  ? <ToggleRight className="w-4 h-4 text-green-400" />
                  : <ToggleLeft className="w-4 h-4 text-muted-foreground" />
                }
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="w-7 h-7 text-destructive"
                onClick={() => handleDelete(code.id)}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
