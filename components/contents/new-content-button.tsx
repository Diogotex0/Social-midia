"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ContentFormDialog } from "./content-form-dialog";

interface ClientRef { id: string; name: string; color: string }

export function NewContentButton({ clients }: { clients: ClientRef[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        <Plus className="w-4 h-4 mr-1.5" />
        Novo Conteúdo
      </Button>
      <ContentFormDialog open={open} onOpenChange={setOpen} clients={clients} />
    </>
  );
}
