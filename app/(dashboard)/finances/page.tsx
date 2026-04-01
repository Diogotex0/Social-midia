import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Header } from "@/components/layout/header";
import { FinancesBoard } from "@/components/finances/finances-board";

export default async function FinancesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const now = new Date();

  const [{ data: finances }, { data: clients }] = await Promise.all([
    supabase
      .from("finances")
      .select("*, clients(id, name, color, monthly_value, payment_day)")
      .eq("user_id", user.id)
      .order("year", { ascending: false })
      .order("month", { ascending: false }),
    supabase
      .from("clients")
      .select("id, name, color, monthly_value, payment_day, status")
      .eq("user_id", user.id)
      .eq("status", "active")
      .order("name"),
  ]);

  return (
    <div className="flex flex-col h-full">
      <Header title="Financeiro" subtitle="Controle de pagamentos dos clientes" />
      <div className="flex-1 p-6">
        <FinancesBoard
          initialFinances={finances ?? []}
          clients={clients ?? []}
          currentMonth={now.getMonth() + 1}
          currentYear={now.getFullYear()}
        />
      </div>
    </div>
  );
}
