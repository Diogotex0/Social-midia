"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ password: "", confirm: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (form.password !== form.confirm) {
      toast({ title: "Senhas não coincidem", variant: "destructive" });
      return;
    }

    if (form.password.length < 6) {
      toast({ title: "A senha deve ter ao menos 6 caracteres", variant: "destructive" });
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: form.password });

    if (error) {
      toast({ title: "Erro ao redefinir senha", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Senha redefinida com sucesso!" });
      router.push("/dashboard");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-2">
          <span className="text-3xl font-bold tracking-tight">
            <span className="text-foreground">Social</span>
            <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">Next</span>
          </span>
          <p className="text-muted-foreground text-sm">Redefinir senha</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-sm text-muted-foreground">Digite sua nova senha abaixo.</p>
            <div className="space-y-2">
              <Label htmlFor="password">Nova senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm">Confirmar nova senha</Label>
              <Input
                id="confirm"
                type="password"
                placeholder="Repita a senha"
                value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...</>
              ) : "Redefinir senha"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
