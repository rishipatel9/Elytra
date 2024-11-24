// app/dashboard/layout.tsx
import { AppSidebar } from '@/components/AppSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import React from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full"> {/* Ensure full width */}
        <AppSidebar />
        <main className="flex-1 overflow-hidden">
          <div className="h-full w-full flex flex-col"> {/* Ensure children take full width */}
            <header className="border-b border-gray-200">
            </header>
            <div>{children}</div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
