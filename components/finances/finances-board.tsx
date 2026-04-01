"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { FINANCE_STATUSES, MONTH_NAMES } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";
import type { Finance } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, TrendingUp, AlertTriangle, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { FINANCE_STATUSES as FINANCE_STATUSES_TYPE } from "@/types";

interface FinanceWithClient extends Finance {
  clients: { id: string; name: string; color: string; monthly_value: number; payment_day: number | null } | null;
}

interface ClientRef { id: string; name: string; color: string; monthly_value: number; payment_day: number | null; status: string }

interface Props {
  initialFinances: FinanceWithClient[];
  clients: ClientRef[];
  currentMonth: number;
  currentYear: number;
}

export function FinancesBoard({ initialFinances, clients, currentMonth, currentYear }: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const [finances, setFinances] = useState(initialFinances);

  useEffect(() => { setFinances(initialFinances); }, [initialFinances]);
  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);
  const [loading, setLoading] = useState<string | null>(null);

  const monthFinances = finances.filter(f => f.month === month && f.year === year);

  // Build list: for each active client, show their finance record or create placeholder
  const clientsWithFinance = clients.map(client => {
    const record = monthFinances.find(f => f.client_id === client.id);
    return { client, record };
  });

  const totalRevenue = monthFinances.filter(f => f.status === "paid").reduce((a, f) => a + f.amount, 0);
  const totalPending = monthFinances.filter(f => f.status !== "paid").reduce((a, f) => a + f.amount, 0);
  const paidCount = monthFinances.filter(f => f.status === "paid").length;
  const delayedCount = monthFinances.filter(f => f.status === "delayed").length;

  async function handleStatusChange(clientId: string, newStatus: Finance["status"]) {
    setLoading(clientId);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const existingRecord = monthFinances.find(f => f.client_id === clientId);
    const client = clients.find(c => c.id === clientId)!;

    if (existingRecord) {
      const { error } = await supabase
        .from("finances")
        .update({ status: newStatus, paid_at: newStatus === "paid" ? new Date().toISOString().slice(0, 10) : null })
        .eq("id", existingRecord.id);
      if (!error) {
        setFinances(prev => prev.map(f =>
          f.id === existingRecord.id
            ? { ...f, status: newStatus, paid_at: newStatus === "paid" ? new Date().toISOString().slice(0, 10) : null }
            : f
        ));
        toast({ title: "Status atualizado!" });
      }
    } else {
      const dueDate = client.payment_day
        ? `${year}-${String(month).padStart(2, "0")}-${String(client.payment_day).padStart(2, "0")}`
        : null;
      const { data, error } = await supabase
        .from("finances")
        .insert({
          user_id: user.id,
          client_id: clientId,
          month,
          year,
          amount: client.monthly_value,
          status: newStatus,
          due_date: dueDate,
          paid_at: newStatus === "paid" ? new Date().toISOString().slice(0, 10) : null,
        })
        .select("*, clients(id, name, color, monthly_value, payment_day)")
        .single();
      if (!error && data) {
        setFinances(prev => [...prev, data as FinanceWithClient]);
        toast({ title: "Registro criado!" });
      }
    }
    setLoading(null);
  }

  function navigate(dir: -1 | 1) {
    let newMonth = month + dir;
    let newYear = year;
    if (newMonth < 1) { newMonth = 12; newYear--; }
    if (newMonth > 12) { newMonth = 1; newYear++; }
    setMonth(newMonth);
    setYear(newYear);
  }

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-green-500/15 rounded-lg"><CheckCircle2 className="w-4 h-4 text-green-400" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Recebido</p>
              <p className="text-lg font-bold">{formatCurrency(totalRevenue)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-yellow-500/15 rounded-lg"><TrendingUp className="w-4 h-4 text-yellow-400" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Pendente</p>
              <p className="text-lg font-bold">{formatCurrency(totalPending)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/15 rounded-lg"><DollarSign className="w-4 h-4 text-blue-400" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Pagos</p>
              <p className="text-lg font-bold">{paidCount} <span className="text-sm font-normal text-muted-foreground">/ {clients.length}</span></p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-red-500/15 rounded-lg"><AlertTriangle className="w-4 h-4 text-red-400" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Atrasados</p>
              <p className="text-lg font-bold text-red-400">{delayedCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Month navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}><ChevronLeft className="w-4 h-4" /></Button>
          <span className="text-base font-semibold min-w-36 text-center">
            {MONTH_NAMES[month - 1]} {year}
          </span>
          <Button variant="outline" size="icon" onClick={() => navigate(1)}><ChevronRight className="w-4 h-4" /></Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Total esperado: <span className="font-semibold text-foreground">{formatCurrency(clients.reduce((a, c) => a + c.monthly_value, 0))}</span>
        </p>
      </div>

      {/* Client list */}
      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-secondary/30">
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Cliente</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 hidden md:table-cell">Valor</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 hidden lg:table-cell">Vencimento</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Status</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 hidden md:table-cell">Pago em</th>
            </tr>
          </thead>
          <tbody>
            {clientsWithFinance.map(({ client, record }, idx) => {
              const status = record?.status ?? "pending";
              const statusInfo = FINANCE_STATUSES_TYPE.find(s => s.value === status);
              return (
                <tr key={client.id} className={`border-b border-border/50 hover:bg-accent/20 transition-colors ${idx % 2 === 0 ? "" : "bg-secondary/10"}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: client.color }} />
                      <span className="text-sm font-medium">{client.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-sm">{formatCurrency(record?.amount ?? client.monthly_value)}</span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {client.payment_day ? `Dia ${client.payment_day}` : "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Select
                      value={status}
                      onValueChange={(v) => handleStatusChange(client.id, v as Finance["status"])}
                      disabled={loading === client.id}
                    >
                      <SelectTrigger className="h-7 border-none bg-transparent p-0 w-auto">
                        <Badge className={statusInfo?.color}>{statusInfo?.label}</Badge>
                      </SelectTrigger>
                      <SelectContent>
                        {FINANCE_STATUSES_TYPE.map(s => (
                          <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-xs text-muted-foreground">
                      {record?.paid_at ? new Date(record.paid_at).toLocaleDateString("pt-BR") : "—"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {clients.length === 0 && (
          <div className="text-center py-10 text-muted-foreground text-sm">
            Nenhum cliente ativo encontrado
          </div>
        )}
      </div>
    </div>
  );
}
