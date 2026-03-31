import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Header } from "@/components/layout/header";
import { ClientsList } from "@/components/clients/clients-list";
import { NewClientButton } from "@/components/clients/new-client-button";

export default async function ClientsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: clients } = await (supabase as any)
    .from("clients")
    .select("*")
    .eq("user_id", user.id)
    .order("name", { ascending: true });

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Clientes"
        subtitle={`${clients?.length ?? 0} clientes cadastrados`}
        action={<NewClientButton />}
      />
      <div className="flex-1 p-6">
        <ClientsList initialClients={clients ?? []} userId={user.id} />
      </div>
    </div>
  );
}
