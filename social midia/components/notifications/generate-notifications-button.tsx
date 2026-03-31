"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw } from "lucide-react";

export function GenerateNotificationsButton() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    try {
      const res = await fetch("/api/notifications/generate", { method: "POST" });
      const data = await res.json();
      toast({ title: `${data.created ?? 0} novos alertas gerados` });
      router.refresh();
    } catch {
      toast({ title: "Erro ao verificar alertas", variant: "destructive" });
    }
    setLoading(false);
  }

  return (
    <Button variant="outline" size="sm" onClick={handleGenerate} disabled={loading}>
      <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
      Verificar alertas
    </Button>
  );
}
