"use client";
import AdminSidebar from "@/components/Admin/AdminSidebar";
import SidebarDemo from "@/components/MainSidebar";
import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full">
      <AdminSidebar children={children}/>
    </div>
  );
}
