"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { SidebarProvider, useSidebar } from "@/components/layout/sidebar-context";

function Inner({ children }: { children: React.ReactNode }) {
  const { isOpen, close } = useSidebar();
  return (
    <div className="min-h-screen bg-background">
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={close}
        />
      )}
      <Sidebar isOpen={isOpen} onClose={close} />
      <main className="lg:ml-60 min-h-screen flex flex-col">
        {children}
      </main>
    </div>
  );
}

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Inner>{children}</Inner>
    </SidebarProvider>
  );
}
