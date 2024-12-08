
import { AdminSidebar } from '@/components/Admin/AdminSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import React from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full"> 
      <AdminSidebar/>
        <main className="flex-1 overflow-hidden">
          <div className="h-full w-full flex flex-col"> 
            <div>{children}</div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}