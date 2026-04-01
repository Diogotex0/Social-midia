"use client";

import { Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useSidebar } from "./sidebar-context";

interface HeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function Header({ title, subtitle, action }: HeaderProps) {
  const { open } = useSidebar();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase
        .from("notifications")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("read", false)
        .then(({ count }) => setUnreadCount(count ?? 0));
    });
  }, []);

  return (
    <header className="h-14 border-b border-border flex items-center justify-between px-4 bg-background/80 backdrop-blur sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <button
          onClick={open}
          className="lg:hidden text-muted-foreground hover:text-foreground transition-colors p-1 -ml-1"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-base font-semibold leading-tight">{title}</h1>
          {subtitle && <p className="text-xs text-muted-foreground hidden sm:block">{subtitle}</p>}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {action}
        <Button variant="ghost" size="icon" asChild className="relative">
          <Link href="/notifications">
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary rounded-full text-[9px] font-bold flex items-center justify-center text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Link>
        </Button>
      </div>
    </header>
  );
}
