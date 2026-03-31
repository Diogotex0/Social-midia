"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, KeyRound } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    accessCode: "",
  });

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

    // Valida o código de acesso no servidor
    const codeRes = await fetch("/api/auth/validate-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: form.accessCode }),
    });

    if (!codeRes.ok) {
      toast({
        title: "Código de acesso inválido",
        description: "Você precisa de um código válido para criar uma conta.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    const { codeId } = await codeRes.json();

    const supabase = createClient();
    const { data: signUpData, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { name: form.name } },
    });

    if (error) {
      toast({ title: "Erro ao criar conta", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    // Marca o código como usado
    await fetch("/api/auth/use-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ codeId, userId: signUpData.user?.id }),
    });

    toast({
      title: "Conta criada!",
      description: "Verifique seu e-mail para confirmar o cadastro.",
    });
    router.push("/login");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-2">
          <span className="text-3xl font-bold tracking-tight">
            <span className="text-foreground">Social</span>
            <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">Next</span>
          </span>
          <p className="text-muted-foreground text-sm">Comece a gerenciar seus clientes</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Código de acesso em destaque */}
            <div className="space-y-2 bg-primary/5 border border-primary/20 rounded-lg p-3">
              <Label htmlFor="accessCode" className="flex items-center gap-1.5 text-primary">
                <KeyRound className="w-3.5 h-3.5" />
                Código de acesso *
              </Label>
              <Input
                id="accessCode"
                placeholder="Digite seu código de acesso"
                value={form.accessCode}
                onChange={(e) => setForm({ ...form, accessCode: e.target.value })}
                required
              />
              <p className="text-[11px] text-muted-foreground">
                Código fornecido no momento da contratação.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nome completo</Label>
              <Input
                id="name"
                placeholder="Seu nome"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="voce@exemplo.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm">Confirmar senha</Label>
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
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Criando conta...</>
              ) : "Criar conta"}
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            Já tem conta?{" "}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Entrar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
