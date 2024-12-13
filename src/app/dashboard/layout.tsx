import SidebarDemo from "@/components/MainSidebar";
import { getUserDetails } from "@/utils";
import React from "react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session= await getUserDetails();
  return (
    <div className="flex h-screen w-full">
      <SidebarDemo user={session.user} children={children} />
    </div>
  );
}
