"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { IdeaFormDialog } from "./idea-form-dialog";

interface ClientRef { id: string; name: string; color: string }

export function NewIdeaButton({ clients }: { clients: ClientRef[] }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        <Plus className="w-4 h-4 mr-1.5" />
        Nova Ideia
      </Button>
      <IdeaFormDialog open={open} onOpenChange={setOpen} clients={clients} />
    </>
  );
}
