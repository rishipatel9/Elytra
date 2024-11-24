// components/Sidebar.tsx
'use client';

import { useState } from "react";
import Link from "next/link";
import {  HomeIcon, CustomerIcon, VendorIcon, MoneyIcon } from "@/components/icons/icons"; // Add other icons as needed

export function SideBar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div
      className={`
        menu fixed flex flex-col gap-1 z-10 py-6
        text-gray-800 bg-[#30344f] border-r border-gray-200 shadow-lg
        min-h-screen items-start
        w-[72px] hover:w-56
        transition-all duration-300 ease-in-out
        ${isSidebarOpen ? 'w-56' : 'w-20'}
      `}
      onMouseEnter={() => setIsSidebarOpen(true)}
      onMouseLeave={() => setIsSidebarOpen(false)}
    >
      {/* Sidebar Menu Items */}
      <Link href="/" className="w-full">
        <div className="flex items-center justify-between px-4 py-2 text-white hover:bg-gray-50 hover:text-black transition-colors duration-200">
          <HomeIcon />
          {isSidebarOpen && <span className="ml-3">Dashboard</span>}
        </div>
      </Link>

      <div className="w-full border-t border-gray-200 my-2" />

      <Link href="/dashboard/mentor" className="w-full">
        <div className="flex items-center px-4 py-2 text-white hover:bg-gray-50 hover:text-black transition-colors duration-200">
          <CustomerIcon />
          {isSidebarOpen && <span className="ml-3">Virtual Mentor</span>}
        </div>
      </Link>

      <Link href="/dashboard/programs" className="w-full">
        <div className="flex items-center px-4 py-2 text-white hover:bg-gray-50 hover:text-black transition-colors duration-200">
          <VendorIcon />
          {isSidebarOpen && <span className="ml-3">Study Programs</span>}
        </div>
      </Link>

      <Link href="/dashboard/counselor" className="w-full">
        <div className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-50 hover:text-black transition-colors duration-200">
          <MoneyIcon />
          {isSidebarOpen && <span className="ml-3">Ask as Counselor</span>}
        </div>
      </Link>
    </div>
  );
}
