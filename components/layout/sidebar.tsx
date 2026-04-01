"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  FileText,
  Calendar,
  CalendarDays,
  Lightbulb,
  DollarSign,
  Bell,
  BarChart2,
  LogOut,
  ChevronRight,
  Loader2,
  X,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { useEffect, useState, useTransition } from "react";
import type { Profile } from "@/types";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/clients", label: "Clientes", icon: Users },
  { href: "/contents", label: "Conteúdos", icon: FileText },
  { href: "/calendar", label: "Calendário", icon: Calendar },
  { href: "/commemorative-calendar", label: "Cal. Comercial", icon: CalendarDays },
  { href: "/ideas", label: "Banco de Ideias", icon: Lightbulb },
  { href: "/finances", label: "Financeiro", icon: DollarSign },
  { href: "/notifications", label: "Notificações", icon: Bell },
  { href: "/metrics", label: "Métricas", icon: BarChart2 },
];

interface Props {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [navigating, setNavigating] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  useEffect(() => {
    setNavigating(null);
    onClose?.();
  }, [pathname]);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setProfile({
          id: user.id,
          email: user.email ?? "",
          name: user.user_metadata?.name ?? user.email?.split("@")[0] ?? "Usuário",
          avatar_url: null,
          created_at: "",
          updated_at: "",
        });
        supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single()
          .then(({ data }) => { if (data) setProfile(data); });
      }
    });
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen w-60 flex flex-col bg-sidebar border-r border-sidebar-border z-50 transition-transform duration-300",
        // Desktop: always visible
        "lg:translate-x-0",
        // Mobile: slide in/out based on isOpen
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}
    >
      {/* Logo */}
      <div className="px-4 py-5 border-b border-sidebar-border flex items-center justify-between">
        <span className="text-lg font-bold tracking-tight">
          <span className="text-foreground">Social</span>
          <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">Next</span>
        </span>
        {/* Close button - mobile only */}
        <button
          onClick={onClose}
          className="lg:hidden text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          const isNavigating = navigating === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={() => { if (!active) setNavigating(href); }}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors group",
                active
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground"
              )}
            >
              {isNavigating && !active
                ? <Loader2 className="w-4 h-4 shrink-0 animate-spin text-primary" />
                : <Icon className={cn("w-4 h-4 shrink-0", active ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
              }
              {label}
              {active && <ChevronRight className="w-3 h-3 ml-auto text-primary" />}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-sidebar-accent transition-colors">
          <Avatar className="w-7 h-7">
            <AvatarFallback className="text-xs">
              {profile?.name ? getInitials(profile.name) : "??"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium truncate">{profile?.name ?? "Carregando..."}</p>
            <p className="text-[10px] text-muted-foreground truncate">{profile?.email}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="text-muted-foreground hover:text-foreground transition-colors"
            title="Sair"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
