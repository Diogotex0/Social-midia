"use client";

import { useState, useEffect } from "react";
import { createClient as createSupabaseClient } from "@/lib/supabase/client";
import { Client } from "@/types";
import { formatCurrency, getInitials } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { ClientFormDialog } from "./client-form-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Users,
  Instagram,
  ExternalLink,
  Link2,
  Plus,
} from "lucide-react";

type ClientWithPortal = Client & { portal_token?: string | null };

interface Props {
  initialClients: ClientWithPortal[];
  userId: string;
}

export function ClientsList({ initialClients, userId }: Props) {
  const { toast } = useToast();
  const [clients, setClients] = useState(initialClients);
  const [newClientOpen, setNewClientOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");

  useEffect(() => { setClients(initialClients); }, [initialClients]);

  const filtered = clients.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.niche?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  function handleCreated(newClient: ClientWithPortal) {
    setClients((prev) => [...prev, newClient].sort((a, b) => a.name.localeCompare(b.name)));
  }

  function handleUpdated(updated: ClientWithPortal) {
    setClients((prev) => prev.map((c) => c.id === updated.id ? updated : c));
    setEditingClient(null);
  }

  async function handleDelete(clientId: string) {
    if (!confirm("Excluir este cliente? Todos os conteúdos associados serão removidos.")) return;
    const supabase = createSupabaseClient();
    const { error } = await supabase.from("clients").delete().eq("id", clientId);
    if (error) {
      toast({ title: "Erro ao excluir", description: error.message, variant: "destructive" });
    } else {
      setClients(clients.filter(c => c.id !== clientId));
      toast({ title: "Cliente excluído" });
    }
  }

  function copyPortalLink(token: string | null | undefined) {
    if (!token) {
      toast({ title: "Token do portal não encontrado", description: "Verifique se o SQL foi executado no Supabase.", variant: "destructive" });
      return;
    }
    const url = `${window.location.origin}/portal/${token}`;
    navigator.clipboard.writeText(url);
    toast({ title: "Link copiado!", description: "Envie para o cliente para ele aprovar os conteúdos." });
  }

  return (
    <div className="space-y-4">
      {/* Filters + Button */}
      <div className="flex gap-3 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar clientes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-1">
          {(["all", "active", "inactive"] as const).map((s) => (
            <Button
              key={s}
              size="sm"
              variant={filterStatus === s ? "default" : "outline"}
              onClick={() => setFilterStatus(s)}
            >
              {s === "all" ? "Todos" : s === "active" ? "Ativos" : "Inativos"}
            </Button>
          ))}
        </div>
        <Button size="sm" onClick={() => setNewClientOpen(true)} className="ml-auto">
          <Plus className="w-4 h-4 mr-1.5" />
          Novo Cliente
        </Button>
      </div>

      {clients.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
            <Users className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-1">Nenhum cliente ainda</h3>
          <p className="text-muted-foreground text-sm max-w-xs">
            Adicione seu primeiro cliente para começar a organizar seus conteúdos.
          </p>
          <Button size="sm" onClick={() => setNewClientOpen(true)} className="mt-4">
            <Plus className="w-4 h-4 mr-1.5" />
            Novo Cliente
          </Button>
        </div>
      ) : (
        <>
          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((client) => (
              <div
                key={client.id}
                className="group bg-card border border-border rounded-xl p-5 hover:border-border/80 transition-colors relative"
              >
                <div
                  className="absolute top-0 left-0 right-0 h-1 rounded-t-xl"
                  style={{ backgroundColor: client.color }}
                />
                <div className="flex items-start justify-between mt-1">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback style={{ backgroundColor: client.color + "30", color: client.color }}>
                        {getInitials(client.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-sm">{client.name}</p>
                      <p className="text-xs text-muted-foreground">{client.niche ?? "Sem nicho"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={client.status === "active" ? "success" : "outline"}>
                      {client.status === "active" ? "Ativo" : "Inativo"}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="w-7 h-7 opacity-0 group-hover:opacity-100">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditingClient(client)}>
                          <Pencil className="w-4 h-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => copyPortalLink(client.portal_token)}>
                          <Link2 className="w-4 h-4 mr-2" />
                          Copiar link do portal
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(client.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="bg-secondary/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">Valor mensal</p>
                    <p className="text-sm font-semibold mt-0.5">{formatCurrency(client.monthly_value)}</p>
                  </div>
                  <div className="bg-secondary/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">Pag. dia</p>
                    <p className="text-sm font-semibold mt-0.5">{client.payment_day ?? "—"}</p>
                  </div>
                </div>

                <button
                  onClick={() => copyPortalLink(client.portal_token)}
                  className="mt-3 w-full flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-primary border border-dashed border-border hover:border-primary/30 rounded-lg py-1.5 transition-colors"
                >
                  <Link2 className="w-3 h-3" />
                  Copiar link do portal do cliente
                </button>

                {client.instagram && (
                  <div className="mt-2 flex items-center gap-2">
                    <a
                      href={`https://instagram.com/${client.instagram.replace("@", "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Instagram className="w-3 h-3" />
                      {client.instagram}
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                )}

                {client.notes && (
                  <p className="mt-3 text-xs text-muted-foreground line-clamp-2 border-t border-border/50 pt-2">
                    {client.notes}
                  </p>
                )}
              </div>
            ))}
          </div>

          {filtered.length === 0 && search && (
            <div className="text-center py-12 text-muted-foreground">
              Nenhum cliente encontrado para &quot;{search}&quot;
            </div>
          )}
        </>
      )}

      <ClientFormDialog
        open={newClientOpen}
        onOpenChange={setNewClientOpen}
        onSuccess={handleCreated}
      />

      {editingClient && (
        <ClientFormDialog
          open={!!editingClient}
          onOpenChange={(open) => { if (!open) setEditingClient(null); }}
          client={editingClient}
          onSuccess={handleUpdated}
        />
      )}
    </div>
  );
}
