import { createClient as createAdmin } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Header } from "@/components/layout/header";
import { InviteCodesManager } from "@/components/admin/invite-codes-manager";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Só o admin pode acessar
  if (user.email !== process.env.ADMIN_EMAIL) {
    redirect("/dashboard");
  }

  const supabaseAdmin = createAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: codes } = await supabaseAdmin
    .from("invite_codes")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-col h-full">
      <Header title="Admin — Códigos de Acesso" subtitle="Gerencie os acessos dos seus clientes" />
      <div className="flex-1 p-6">
        <InviteCodesManager initialCodes={codes ?? []} />
      </div>
    </div>
  );
}
