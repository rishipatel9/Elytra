// app/dashboard/layout.tsx
import { AppSidebar } from '@/components/AppSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import React from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <AppSidebar />
        <main className="flex-1 overflow-hidden">
          <div className="h-full flex flex-col">
            <header className="border-b border-gray-200">
              <SidebarTrigger />
            </header>
            <div className="flex-1 overflow-y-auto p-6">
              {children}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}