"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ClientFormDialog } from "./client-form-dialog";

export function NewClientButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        <Plus className="w-4 h-4 mr-1.5" />
        Novo Cliente
      </Button>
      <ClientFormDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
