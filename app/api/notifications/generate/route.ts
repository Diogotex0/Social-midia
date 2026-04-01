import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const now = new Date();
  const notifications: {
    user_id: string;
    type: string;
    title: string;
    message: string;
    client_id?: string;
  }[] = [];

  // 1. Posts atrasados
  const { data: delayedContents } = await supabase
    .from("contents")
    .select("id, title, client_id, scheduled_at, clients(name)")
    .eq("user_id", user.id)
    .eq("status", "delayed")
    .order("scheduled_at", { ascending: true })
    .limit(10);

  for (const content of delayedContents ?? []) {
    notifications.push({
      user_id: user.id,
      type: "delayed_post",
      title: "Post atrasado",
      message: `"${content.title}" está atrasado${(content as { clients?: { name?: string } }).clients?.name ? ` para ${(content as { clients?: { name?: string } }).clients?.name}` : ""}.`,
      client_id: content.client_id,
    });
  }

  // 2. Clientes sem conteúdo nos próximos 7 dias
  const nextWeek = new Date(now);
  nextWeek.setDate(nextWeek.getDate() + 7);

  const { data: activeClients } = await supabase
    .from("clients")
    .select("id, name")
    .eq("user_id", user.id)
    .eq("status", "active");

  const { data: upcomingContents } = await supabase
    .from("contents")
    .select("client_id")
    .eq("user_id", user.id)
    .gte("scheduled_at", now.toISOString())
    .lte("scheduled_at", nextWeek.toISOString())
    .in("status", ["planned", "in_production", "ready"]);

  const clientsWithContent = new Set(upcomingContents?.map(c => c.client_id) ?? []);
  for (const client of activeClients ?? []) {
    if (!clientsWithContent.has(client.id)) {
      notifications.push({
        user_id: user.id,
        type: "no_content",
        title: "Cliente sem conteúdo",
        message: `${client.name} não tem posts planejados para os próximos 7 dias.`,
        client_id: client.id,
      });
    }
  }

  // 3. Pagamentos atrasados / próximos
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const { data: pendingFinances } = await supabase
    .from("finances")
    .select("id, client_id, due_date, status, clients(name)")
    .eq("user_id", user.id)
    .eq("month", currentMonth)
    .eq("year", currentYear)
    .neq("status", "paid");

  for (const finance of pendingFinances ?? []) {
    const clientName = (finance as { clients?: { name?: string } }).clients?.name ?? "Cliente";
    if (finance.due_date) {
      const due = new Date(finance.due_date);
      const daysUntilDue = Math.floor((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      if (daysUntilDue < 0) {
        notifications.push({
          user_id: user.id,
          type: "payment_delayed",
          title: "Pagamento atrasado",
          message: `${clientName} está com pagamento atrasado há ${Math.abs(daysUntilDue)} dias.`,
          client_id: finance.client_id,
        });
      } else if (daysUntilDue <= 3) {
        notifications.push({
          user_id: user.id,
          type: "payment_due",
          title: "Pagamento próximo",
          message: `${clientName} vence em ${daysUntilDue} dia(s).`,
          client_id: finance.client_id,
        });
      }
    }
  }

  if (notifications.length === 0) {
    return NextResponse.json({ created: 0 });
  }

  const { data: inserted, error } = await supabase
    .from("notifications")
    .insert(notifications)
    .select("id");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ created: inserted?.length ?? 0 });
}
